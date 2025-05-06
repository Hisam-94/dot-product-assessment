import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const navLinkClass = ({ isActive }) => 
    `flex items-center px-4 py-3 ${isActive 
      ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600' 
      : 'text-secondary-600 hover:bg-secondary-100'} rounded-lg transition-colors`;

  return (
    <div className="flex h-screen bg-secondary-50">
      {/* Sidebar */}
      <div 
        className={`bg-white shadow-md z-10 transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } fixed h-full`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          {isSidebarOpen && (
            <h1 className="text-xl font-semibold text-primary-700">Budget Tracker</h1>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-secondary-100"
          >
            {isSidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>

        <nav className="mt-6 px-2">
          <ul className="space-y-2">
            <li>
              <NavLink to="/dashboard" className={navLinkClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {isSidebarOpen && <span>Dashboard</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/transactions" className={navLinkClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isSidebarOpen && <span>Transactions</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/budget" className={navLinkClass}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {isSidebarOpen && <span>Budget</span>}
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="ml-2 text-secondary-700 truncate">
                  {user?.name}
                </span>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="p-2 text-secondary-500 hover:text-secondary-700 rounded-full hover:bg-secondary-100"
              title="Logout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex flex-col flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-16'} transition-all duration-300`}>
        <main className="flex-1 p-6 overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 