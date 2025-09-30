"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ChangePassword from '../components/ChangePassword';
import OrderHistory from '../components/OrderHistory';
import AddressManagement from '../components/AddressManagement';
import { CiUser } from "react-icons/ci";
import { FaKey } from "react-icons/fa6";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaRegAddressCard } from "react-icons/fa";
import styles from './profile.module.css';

export default function ProfilePage() {
  const { user, updateProfile, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobilenum: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        mobilenum: user.mobilenum || ''
      });
    }
  }, [isAuthenticated, user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await updateProfile(formData.name, formData.mobilenum);
      if (result.success) {
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setMessage(result.message);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      mobilenum: user?.mobilenum || ''
    });
    setIsEditing(false);
    setMessage('');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!isAuthenticated) {
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <CiUser /> },
    { id: 'password', label: 'Change Password', icon: <FaKey /> },
    { id: 'orders', label: 'Order History', icon: <FaClockRotateLeft /> },
    { id: 'addresses', label: 'Addresses', icon: <FaRegAddressCard /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className={styles.profileCard}>
            <div className={styles.profileCardHeader}>
              <h2>Personal Information</h2>
              {!isEditing && (
                <button 
                  className={styles.editButton}
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className={styles.profileForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="mobilenum">Mobile Number</label>
                  <input
                    type="tel"
                    id="mobilenum"
                    name="mobilenum"
                    value={formData.mobilenum}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your mobile number"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className={styles.disabledInput}
                  />
                  <small>Email cannot be changed</small>
                </div>

                {message && (
                  <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
                    {message}
                  </div>
                )}

                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.cancelButton}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className={styles.saveButton}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className={styles.profileInfo}>
                <div className={styles.infoItem}>
                  <label>Full Name</label>
                  <span>{user?.name || 'Not provided'}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Email</label>
                  <span>{user?.email || 'Not provided'}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Mobile Number</label>
                  <span>{user?.mobilenum || 'Not provided'}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Member Since</label>
                  <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            )}
          </div>
        );
      case 'password':
        return <ChangePassword />;
      case 'orders':
        return <OrderHistory />;
      case 'addresses':
        return <AddressManagement />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>My Profile</h1>
        <p>Manage your account information and preferences</p>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.tabNavigation}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.tabContent}>
          {renderTabContent()}
        </div>
      </div>

      <div className={styles.logoutContainer}>
        <button 
          className={styles.logoutButton} 
          onClick={handleLogout}
          style={{ 
            display: 'block',
            visibility: 'visible',
            opacity: 1
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
