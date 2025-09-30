"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './AddressManagement.module.css';

export default function AddressManagement() {
  const { getAddresses, addAddress, updateAddress, deleteAddress } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'IN',
    phone: '',
    isDefault: false
  });
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState('');

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
    'Puducherry'
  ];

  const fetchAddresses = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result = await getAddresses();
      
      if (result.success) {
        setAddresses(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear message when user starts typing
    if (message) setMessage('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'IN',
      phone: '',
      isDefault: false
    });
    setEditingAddress(null);
    setShowForm(false);
    setMessage('');
  };

  const handleEdit = (address) => {
    setFormData({
      name: address.name || '',
      line1: address.line1 || '',
      line2: address.line2 || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      country: address.country || 'IN',
      phone: address.phone || '',
      isDefault: address.isDefault || false
    });
    setEditingAddress(address._id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
  };

  const validateForm = () => {
    const required = ['name', 'line1', 'city', 'state', 'pincode', 'phone'];
    
    for (const field of required) {
      if (!formData[field].trim()) {
        setMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }

    if (formData.pincode.length !== 6 || !/^\d{6}$/.test(formData.pincode)) {
      setMessage('Pincode must be 6 digits');
      return false;
    }

    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      setMessage('Phone number must be 10 digits');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setFormLoading(true);
    setMessage('');

    try {
      let result;
      if (editingAddress) {
        result = await updateAddress(editingAddress, formData);
      } else {
        result = await addAddress(formData);
      }
      
      if (result.success) {
        setAddresses(result.data);
        setMessage(editingAddress ? 'Address updated successfully!' : 'Address added successfully!');
        resetForm();
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;

    setFormLoading(true);
    setMessage('');

    try {
      const result = await deleteAddress(addressId);
      
      if (result.success) {
        setAddresses(result.data);
        setMessage('Address deleted successfully!');
        if (editingAddress === addressId) {
          resetForm();
        }
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.addressManagementContainer}>
        <div className={styles.header}>
          <h2>Manage Addresses</h2>
          <p>Add, edit, or remove your delivery addresses</p>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading addresses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.addressManagementContainer}>
      <div className={styles.header}>
        <h2>Manage Addresses</h2>
        <p>Add, edit, or remove your delivery addresses</p>
        <button 
          onClick={handleAddNew}
          className={styles.addButton}
          disabled={formLoading}
        >
          + Add New Address
        </button>
      </div>

      {error && (
        <div className={styles.error}>
          <p>{error}</p>
          <button onClick={fetchAddresses} className={styles.retryButton}>
            Retry
          </button>
        </div>
      )}

      {message && (
        <div className={`${styles.message} ${message.includes('success') ? styles.success : styles.error}`}>
          {message}
        </div>
      )}

      {showForm && (
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h3>{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
            <button 
              onClick={resetForm}
              className={styles.cancelButton}
              disabled={formLoading}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.addressForm}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="10-digit phone number"
                  maxLength="10"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="line1">Address Line 1 *</label>
              <input
                type="text"
                id="line1"
                name="line1"
                value={formData.line1}
                onChange={handleInputChange}
                required
                placeholder="House/Flat number, Street name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="line2">Address Line 2</label>
              <input
                type="text"
                id="line2"
                name="line2"
                value={formData.line2}
                onChange={handleInputChange}
                placeholder="Area, Landmark (optional)"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter city"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="state">State *</label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="pincode">Pincode *</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  placeholder="6-digit pincode"
                  maxLength="6"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  disabled
                  className={styles.disabledInput}
                />
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleInputChange}
                />
                <span className={styles.checkboxText}>Set as default address</span>
              </label>
            </div>

            <div className={styles.formActions}>
              <button 
                type="button" 
                onClick={resetForm}
                className={styles.cancelButton}
                disabled={formLoading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={formLoading}
              >
                {formLoading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Add Address')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.addressesList}>
        {addresses.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📍</div>
            <h3>No Addresses Found</h3>
            <p>Add your first address to get started.</p>
          </div>
        ) : (
          addresses.map((address) => (
            <div key={address._id} className={styles.addressCard}>
              <div className={styles.addressHeader}>
                <div className={styles.addressInfo}>
                  <h4>{address.name}</h4>
                  {address.isDefault && (
                    <span className={styles.defaultBadge}>Default</span>
                  )}
                </div>
                <div className={styles.addressActions}>
                  <button 
                    onClick={() => handleEdit(address)}
                    className={styles.editButton}
                    disabled={formLoading}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(address._id)}
                    className={styles.deleteButton}
                    disabled={formLoading}
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className={styles.addressDetails}>
                <p>{address.line1}</p>
                {address.line2 && <p>{address.line2}</p>}
                <p>{address.city}, {address.state} {address.pincode}</p>
                <p>{address.country}</p>
                <p className={styles.phone}>Phone: {address.phone}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
