// src/components/auth/RegistrationForm.jsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { registerUser } from '../../store/authSlice';
import './AuthForms.css';
import './RegistrationForm.css';
import { RiMailFill, RiLockPasswordFill, RiUserFill } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const MoneyGuardLogo = () => (
  <img src="/img/Logo.svg" alt="Money Guard Logo" className="app-logo" />
);

const schema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(12, 'Password must be no more than 12 characters'),
  confirmPassword: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

const RegistrationForm = () => {
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
      await dispatch(
        registerUser({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      ).unwrap();

      toast.success(
        `Great, ${data.name}! Your registration is complete. You can log in now.`
      );
      
    } catch (error) {
      const errorMessage =
        error.message || 'An error occurred during registration.';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="registration-container">
      <div className="auth-box">
        <header className="auth-header">
          <MoneyGuardLogo />
          <h1 className="app-name">Money Guard</h1>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-group">
            <RiUserFill className="input-icon" />
            <input
              type="text"
              id="name"
              placeholder="Name"
              aria-label="Enter your name"
              {...register('name')}
              className={errors.name ? 'input-error' : ''}
            />
          </div>
          {errors.name && (
            <p className="auth-error-message">{errors.name.message}</p>
          )}

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

          <div className="input-group">
            <RiLockPasswordFill className="input-icon" />
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              aria-label="Confirm your password"
              {...register('confirmPassword')}
              className={errors.confirmPassword ? 'input-error' : ''}
            />
          </div>
          {errors.confirmPassword && (
            <p className="auth-error-message">
              {errors.confirmPassword.message}
            </p>
          )}

          <div style={{ marginBottom: '20px' }}></div>

          <button
            type="submit"
            className="auth-button primary-button"
            disabled={isLoading}
          >
            <span>{isLoading ? 'REGISTERING...' : 'REGISTER'}</span>
          </button>

          <Link
            to="/login"
            className="auth-button secondary-button"
            style={isLoading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
          >
            LOG IN
          </Link>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;