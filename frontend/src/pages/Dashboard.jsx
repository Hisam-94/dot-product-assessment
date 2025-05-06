import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFinancialSummary } from "../store/slices/summarySlice";
import { getYearlyOverview } from "../store/slices/summarySlice";
import * as d3 from "d3";

// Components
const StatCard = ({ title, value, icon, textColor, bgColor }) => (
  <div className="bg-white rounded-lg shadow p-5">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-secondary-500 text-sm font-medium">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>
          ${value.toLocaleString()}
        </p>
      </div>
      <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { financialSummary, loading, error } = useSelector(
    (state) => state.summary
  );

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Refs for D3 charts
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  useEffect(() => {
    // Get financial summary for current month
    dispatch(getFinancialSummary(currentMonth));

    // Get yearly overview for current year
    const year = currentMonth.split("-")[0];
    dispatch(getYearlyOverview(year));
  }, [dispatch, currentMonth]);

  // Create pie chart for income vs expense
  useEffect(() => {
    if (!financialSummary || !pieChartRef.current) return;

    // Clear previous chart
    d3.select(pieChartRef.current).selectAll("*").remove();

    try {
      const income = financialSummary.summary.income || 0;
      const expense = financialSummary.summary.expense || 0;

      // If both income and expense are 0, show a message
      if (income === 0 && expense === 0) {
        d3.select(pieChartRef.current)
          .append("div")
          .attr("class", "flex justify-center items-center h-48")
          .append("p")
          .attr("class", "text-secondary-500")
          .text("No income or expense data for this month");
        return;
      }

      // Set up dimensions
      const width = 240;
      const height = 240;
      const margin = 40;
      const radius = Math.min(width, height) / 2 - margin;

      // Create SVG container
      const svg = d3
        .select(pieChartRef.current)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      // Set up data
      const data = [
        { name: "Income", value: income, color: "#10b981" },
        { name: "Expense", value: expense, color: "#ef4444" },
      ].filter((d) => d.value > 0); // Filter out zero values

      // Define pie layout
      const pie = d3
        .pie()
        .value((d) => d.value)
        .sort(null);

      // Define arc generator
      const arc = d3
        .arc()
        .innerRadius(radius * 0.6) // Make it a donut chart
        .outerRadius(radius);

      // Define outer arc for labels
      const outerArc = d3
        .arc()
        .innerRadius(radius * 1.1)
        .outerRadius(radius * 1.1);

      // Generate pie segments
      const pieData = pie(data);

      // Create pie segments
      svg
        .selectAll("path")
        .data(pieData)
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", (d) => d.data.color)
        .attr("stroke", "white")
        .style("stroke-width", "2px")
        .style("opacity", 0.85);

      // Add text labels
      const text = svg
        .selectAll("text")
        .data(pieData)
        .enter()
        .append("text")
        .attr("transform", (d) => {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.8 * (midAngle < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", (d) => {
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return midAngle < Math.PI ? "start" : "end";
        });

      // Add name labels
      text
        .append("tspan")
        .attr("x", 0)
        .attr("y", "-0.7em")
        .style("font-weight", "bold")
        .style("font-size", "12px")
        .style("fill", (d) => d.data.color)
        .text((d) => d.data.name);

      // Add value labels
      text
        .append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .style("fill", "#666")
        .style("font-size", "10px")
        .text((d) => `$${d.data.value.toLocaleString()}`);

      // Add polylines
      svg
        .selectAll("polyline")
        .data(pieData)
        .enter()
        .append("polyline")
        .attr("points", (d) => {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.8 * (midAngle < Math.PI ? 1 : -1);
          return [arc.centroid(d), outerArc.centroid(d), pos];
        })
        .style("fill", "none")
        .style("stroke", "#ccc")
        .style("stroke-width", "1px");

      // Add center text for total
      const total = income + expense;
      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.2em")
        .style("font-size", "12px")
        .style("fill", "#666")
        .text("Total");

      svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(`$${total.toLocaleString()}`);
    } catch (error) {
      console.error("Error rendering pie chart:", error);
      d3.select(pieChartRef.current)
        .append("div")
        .attr("class", "text-red-500 text-center py-4")
        .text("Failed to render chart");
    }
  }, [financialSummary]);

  // Create bar chart for budget vs expense
  useEffect(() => {
    if (!financialSummary || !barChartRef.current) return;

    // Clear previous chart
    d3.select(barChartRef.current).selectAll("*").remove();

    const margin = { top: 20, right: 20, bottom: 40, left: 60 };
    const width = 300 - margin.left - margin.right;
    const height = 240 - margin.top - margin.bottom;

    const data = [
      {
        name: "Budget",
        value: financialSummary.budget.amount,
        color: "#0ea5e9",
      },
      { name: "Spent", value: financialSummary.budget.used, color: "#ef4444" },
    ];

    const svg = d3
      .select(barChartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Set up scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      .range([0, width])
      .padding(0.3);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) * 1.2])
      .range([height, 0]);

    // Add axes
    svg
      .append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    svg.append("g").call(d3.axisLeft(y).tickFormat((d) => `$${d}`));

    // Add bars
    svg
      .selectAll("bars")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.name))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => d.color)
      .attr("rx", 3)
      .style("opacity", 0.8);

    // Add values on top of bars
    svg
      .selectAll("text.value")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "value")
      .attr("x", (d) => x(d.name) + x.bandwidth() / 2)
      .attr("y", (d) => y(d.value) - 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "black")
      .text((d) => `$${d.value.toLocaleString()}`);
  }, [financialSummary]);

  // Handle month change
  const handleMonthChange = (e) => {
    setCurrentMonth(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        <p>{error}</p>
      </div>
    );
  }

  if (!financialSummary) {
    return (
      <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
        <p>No data available for the selected month.</p>
      </div>
    );
  }

  // Get month options for selector
  const getMonthOptions = () => {
    const currentYear = new Date().getFullYear();
    const months = [];

    // Add months for current year
    for (let i = 0; i < 12; i++) {
      const monthStr = `${currentYear}-${String(i + 1).padStart(2, "0")}`;
      const date = new Date(currentYear, i, 1);
      const monthName = date.toLocaleString("default", { month: "long" });
      months.push({ value: monthStr, label: `${monthName} ${currentYear}` });
    }

    return months;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">Dashboard</h1>

        <select
          value={currentMonth}
          onChange={handleMonthChange}
          className="bg-white border border-secondary-300 text-secondary-700 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
          {getMonthOptions().map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Income"
          value={financialSummary.summary.income}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 11l5-5m0 0l5 5m-5-5v12"
              />
            </svg>
          }
          textColor="text-green-600"
          bgColor="bg-green-100"
        />

        <StatCard
          title="Expenses"
          value={financialSummary.summary.expense}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 13l-5 5m0 0l-5-5m5 5V6"
              />
            </svg>
          }
          textColor="text-red-600"
          bgColor="bg-red-100"
        />

        <StatCard
          title="Balance"
          value={financialSummary.summary.balance}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-primary-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          textColor={
            financialSummary.summary.balance >= 0
              ? "text-primary-600"
              : "text-red-600"
          }
          bgColor="bg-primary-100"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4">
            Income vs Expenses
          </h2>
          <div ref={pieChartRef} className="flex justify-center"></div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4">
            Budget vs Spending
          </h2>
          <div ref={barChartRef} className="flex justify-center"></div>
          <div className="mt-4 text-center">
            <p className="text-secondary-600">
              Budget Usage:{" "}
              <span
                className={
                  financialSummary.budget.percentageUsed > 80
                    ? "text-red-600 font-bold"
                    : "text-primary-600 font-bold"
                }>
                {financialSummary.budget.percentageUsed.toFixed(1)}%
              </span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full ${
                  financialSummary.budget.percentageUsed > 80
                    ? "bg-red-600"
                    : "bg-primary-600"
                }`}
                style={{
                  width: `${Math.min(
                    financialSummary.budget.percentageUsed,
                    100
                  )}%`,
                }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-secondary-800 mb-4">
          Expense Categories
        </h2>

        {financialSummary.categoryBreakdown.length === 0 ? (
          <p className="text-secondary-500 text-center py-6">
            No expenses recorded for this month
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {financialSummary.categoryBreakdown.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-secondary-700">
                    {category.category}
                  </span>
                  <span className="font-bold text-red-600">
                    ${category.amount.toLocaleString()}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-red-600`}
                    style={{
                      width: `${
                        (category.amount / financialSummary.summary.expense) *
                        100
                      }%`,
                    }}></div>
                </div>
                <div className="text-xs text-right mt-1 text-secondary-500">
                  {(
                    (category.amount / financialSummary.summary.expense) *
                    100
                  ).toFixed(1)}
                  % of expenses
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
