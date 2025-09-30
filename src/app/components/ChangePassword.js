"use client";
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './ChangePassword.module.css';

export default function ChangePassword() {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message) setMessage('');
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const validateForm = () => {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage('All fields are required');
      return false;
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New password and confirm password do not match');
      return false;
    }

    if (formData.currentPassword === formData.newPassword) {
      setMessage('New password must be different from current password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await changePassword(formData.currentPassword, formData.newPassword);
      
      if (result.success) {
        setMessage('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.changePasswordContainer}>
      <div className={styles.header}>
        <h2>Change Password</h2>
        <p>Update your account password for better security</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="currentPassword">Current Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPassword.current ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              required
              placeholder="Enter your current password"
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => togglePasswordVisibility('current')}
            >
              {showPassword.current ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="newPassword">New Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPassword.new ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              placeholder="Enter your new password"
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => togglePasswordVisibility('new')}
            >
              {showPassword.new ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          <small className={styles.helpText}>
            Password must be at least 6 characters long
          </small>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <div className={styles.passwordInput}>
            <input
              type={showPassword.confirm ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              className={styles.toggleButton}
              onClick={() => togglePasswordVisibility('confirm')}
            >
              {showPassword.confirm ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>

        {message && (
          <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <div className={styles.formActions}>
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Changing Password...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}
