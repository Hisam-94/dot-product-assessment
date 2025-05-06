import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(state => state.auth);
  console.log("isAuthenticated:", isAuthenticated);
  const { email, password } = formData;

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error for this field if it exists
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
    // Clear API error when user starts typing
    if (error) dispatch(clearError());
  };

  const validateForm = () => {
    const errors = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (validateForm()) {
      dispatch(loginUser({ email, password }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-secondary-800 mb-6 text-center">Sign In</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-secondary-700 text-sm font-medium mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              formErrors.email ? 'border-red-500' : 'border-secondary-300'
            }`}
            id="email"
            type="email"
            name="email"
            value={email}
            onChange={onChange}
            placeholder="yourname@example.com"
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>
        
        <div className="mb-6">
          <label className="block text-secondary-700 text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              formErrors.password ? 'border-red-500' : 'border-secondary-300'
            }`}
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={onChange}
            placeholder="••••••••"
          />
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 transition-colors w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-secondary-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login; 