import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentBudget,
  setBudget,
  getBudgetHistory,
} from "../store/slices/budgetSlice";
import { getFinancialSummary } from "../store/slices/summarySlice";

const Budget = () => {
  const dispatch = useDispatch();
  const {
    currentBudget,
    budgetHistory,
    loading: budgetLoading,
    error: budgetError,
  } = useSelector((state) => state.budget);
  const {
    financialSummary,
    loading: summaryLoading,
    error: summaryError,
  } = useSelector((state) => state.summary);
  console.log("financialSummary:", financialSummary);
  console.log("currentBudget:", currentBudget);
  const [editMode, setEditMode] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Current month in YYYY-MM format
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Fetch budget and summary data
  useEffect(() => {
    dispatch(getCurrentBudget(currentMonth));
    dispatch(getBudgetHistory());
    dispatch(getFinancialSummary(currentMonth));
  }, [dispatch, currentMonth]);

  // Update budget amount when current budget changes
  useEffect(() => {
    if (currentBudget) {
      setBudgetAmount(currentBudget.amount.toString());
    }
  }, [currentBudget]);

  // Handle month change
  const handleMonthChange = (e) => {
    setCurrentMonth(e.target.value);
    setEditMode(false);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (currentBudget) {
      setBudgetAmount(currentBudget.amount.toString());
    } else {
      setBudgetAmount("");
    }
  };

  // Handle budget amount change
  const handleBudgetChange = (e) => {
    setBudgetAmount(e.target.value);
  };

  // Submit budget update
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!budgetAmount || isNaN(budgetAmount) || parseFloat(budgetAmount) <= 0) {
      return;
    }

    setSubmitting(true);

    try {
      await dispatch(
        setBudget({
          month: currentMonth,
          amount: parseFloat(budgetAmount),
        })
      );

      setEditMode(false);

      // Refresh summary data after budget update
      dispatch(getFinancialSummary(currentMonth));
    } catch (err) {
      console.error("Error setting budget:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatMonth = (dateString) => {
    const [year, month] = dateString.split("-");
    const date = new Date(year, parseInt(month) - 1);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate percentage
  const calculatePercentage = (used, total) => {
    if (!total) return 0;
    return Math.min(Math.round((used / total) * 100), 100);
  };

  // Get status color based on percentage
  const getStatusColor = (percentage) => {
    if (percentage < 80) return "bg-primary-600";
    // if (percentage < 75) return 'bg-yellow-500';
    return "bg-red-500";
  };

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

  const loading = budgetLoading || summaryLoading;
  const error = budgetError || summaryError;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-secondary-800 mb-4 md:mb-0">
          Budget
        </h1>

        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-secondary-600 mb-1">
            Month
          </label>

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
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
          <p className="mt-2 text-secondary-600">Loading budget data...</p>
        </div>
      ) : (
        <>
          {/* Budget Overview */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-secondary-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-secondary-800">
                  Budget for {formatMonth(currentMonth)}
                </h2>
                <button
                  onClick={toggleEditMode}
                  className="text-primary-600 hover:text-primary-800 font-medium text-sm focus:outline-none">
                  {editMode ? "Cancel" : currentBudget ? "Edit" : "Set Budget"}
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Budget Amount
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-secondary-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        value={budgetAmount}
                        onChange={handleBudgetChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-7 border border-secondary-300 rounded-md px-3 py-2 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50">
                      {submitting ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  {!currentBudget ? (
                    <div className="text-center py-6">
                      <p className="text-secondary-600 mb-4">
                        No budget set for this month
                      </p>
                      <button
                        onClick={toggleEditMode}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500">
                        Set Budget
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-secondary-600 text-sm">
                            Total Budget
                          </h3>
                          <p className="text-2xl font-bold text-secondary-900">
                            {formatCurrency(currentBudget.amount)}
                          </p>
                        </div>

                        {financialSummary && (
                          <>
                            <div className="text-center">
                              <h3 className="text-secondary-600 text-sm">
                                Used
                              </h3>
                              <p className="text-2xl font-bold text-secondary-900">
                                {formatCurrency(financialSummary.budget.used)}
                              </p>
                            </div>

                            <div className="text-right">
                              <h3 className="text-secondary-600 text-sm">
                                Remaining
                              </h3>
                              <p className="text-2xl font-bold text-secondary-900">
                                {formatCurrency(
                                  financialSummary.budget.remaining
                                )}
                              </p>
                            </div>
                          </>
                        )}
                      </div>

                      {financialSummary && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-secondary-600">
                              {financialSummary.budget.percentageUsed}% used
                            </span>
                            <span className="text-sm text-secondary-600">
                              {formatCurrency(financialSummary.budget.used)} of{" "}
                              {formatCurrency(currentBudget.amount)}
                            </span>
                          </div>
                          <div className="w-full bg-secondary-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${getStatusColor(
                                calculatePercentage(
                                  financialSummary.budget.used,
                                  currentBudget.amount
                                )
                              )}`}
                              style={{
                                width: `${calculatePercentage(
                                  financialSummary.budget.used,
                                  currentBudget.amount
                                )}%`,
                              }}></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Budget History */}
          {budgetHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-5 border-b border-secondary-200">
                <h2 className="text-lg font-semibold text-secondary-800">
                  Budget History
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead className="bg-secondary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Budget Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Set At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-secondary-200">
                    {budgetHistory.map((budget) => (
                      <tr
                        key={budget._id || budget.month}
                        className="hover:bg-secondary-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          {formatMonth(budget.month)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-secondary-900">
                          {formatCurrency(budget.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                          {new Date(
                            budget.updatedAt || budget.createdAt
                          ).toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Budget;
