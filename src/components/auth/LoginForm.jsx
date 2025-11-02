// src/components/auth/LoginForm.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/authSlice';
import { toast } from 'react-toastify';
import './AuthForms.css';
import './LoginForm.css';
import { RiMailFill, RiLockPasswordFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const MoneyGuardLogo = () => (
  <img src="/img/Logo.svg" alt="Money Guard Logo" className="app-logo" />
);

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      const actionPayload = await dispatch(loginUser(data)).unwrap();

      const username = actionPayload.user.username;
      toast.success(`Welcome back, ${username}!`);
      
    } catch (error) {
      const errorMessage = error.message || 'An error occurred during login.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="login-container">
      <div className="auth-box">
        <header className="auth-header">
          <MoneyGuardLogo />
          <h1 className="app-name">Money Guard</h1>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-group">
            <RiMailFill className="input-icon" />
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              aria-label="Enter your email address"
              {...register('email')}
              className={errors.email ? 'input-error' : ''}
            />
          </div>
          {errors.email && (
            <p className="auth-error-message">{errors.email.message}</p>
          )}

          <div className="input-group">
            <RiLockPasswordFill className="input-icon" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              aria-label="Enter your password"
              {...register('password')}
              className={errors.password ? 'input-error' : ''}
            />
          </div>
          {errors.password && (
            <p className="auth-error-message">{errors.password.message}</p>
          )}

          <div style={{ marginBottom: '20px' }}></div>

          <button
            type="submit"
            className="auth-button primary-button"
            disabled={isLoading}
          >
            <span>{isLoading ? 'LOGGING IN...' : 'LOG IN'}</span>
          </button>

          <Link
            to="/register"
            className="auth-button secondary-button"
            style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
          >
            REGISTER
          </Link>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;