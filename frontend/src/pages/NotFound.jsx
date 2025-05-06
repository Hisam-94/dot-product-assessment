import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-secondary-800">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-secondary-700 mt-4">Page Not Found</h2>
        <p className="text-secondary-600 mt-4 max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="mt-8">
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 