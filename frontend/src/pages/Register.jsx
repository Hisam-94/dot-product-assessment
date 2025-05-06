import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { clearError, registerUser } from '../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const {  error, loading } = useSelector(state => state.auth);
  const { name, email, password, confirmPassword } = formData;
  const dispatch = useDispatch();

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: '' });
    }
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!name) {
      errors.name = 'Name is required';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('formData in onSubmit:', formData);
      await dispatch(registerUser({ name, email, password })).then((result) => {
        if (result.payload && result.payload.token) { 
          window.location.href = '/dashboard';
        }
      })
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-secondary-800 mb-6 text-center">Create an Account</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-secondary-700 text-sm font-medium mb-2" htmlFor="name">
            Full Name
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              formErrors.name ? 'border-red-500' : 'border-secondary-300'
            }`}
            id="name"
            type="text"
            name="name"
            value={name}
            onChange={onChange}
            placeholder="John Doe"
          />
          {formErrors.name && (
            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
          )}
        </div>
        
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
        
        <div className="mb-4">
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
        
        <div className="mb-6">
          <label className="block text-secondary-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            className={`appearance-none border rounded w-full py-2 px-3 text-secondary-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              formErrors.confirmPassword ? 'border-red-500' : 'border-secondary-300'
            }`}
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            placeholder="••••••••"
          />
          {formErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>
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
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-secondary-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register; 