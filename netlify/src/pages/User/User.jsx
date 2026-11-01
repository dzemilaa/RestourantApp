import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './User.css';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const User = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [error] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', oldPassword: '', newPassword: '' });
  const [editField, setEditField] = useState(null);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      toast.error('User not logged in.');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(`https://backend20250126033414.azurewebsites.net/api/FetchAllUsers/GetUserById/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data.');
        }
        const data = await response.json();
        setUserData(data);
        setForm({ username: data.userName, email: data.email, oldPassword: '', newPassword: '' });
      } catch {
        toast.error("Error");
      }
    };

    fetchUserData();
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (field) => {
    try {
      // Provera da li je polje ispravno popunjeno
      if (field === 'username' && !form.username) {
        toast.error('Username cannot be empty.');
        return;
      }
      if (field === 'email' && !form.email) {
        toast.error('Email cannot be empty.');
        return;
      }
      if (field === 'password') {
        if (!form.oldPassword || !form.newPassword) {
            toast.error('Both old and new password are required.');
          return;
        }
      }

      let url = '';
      if (field === 'username') {
        url = `https://backend20250126033414.azurewebsites.net/api/UserChange/ChangeUsername?id=${userId}&newUsername=${form.username}`;
      } else if (field === 'email') {
        url = `https://backend20250126033414.azurewebsites.net/api/UserChange/ChangeEmail?id=${userId}&newEmail=${form.email}`;
      } else if (field === 'password') {
        url = `https://backend20250126033414.azurewebsites.net/api/UserChange/ChangePassword?id=${userId}&oldPassword=${form.oldPassword}&newPassword=${form.newPassword}`;
      }

      // Logovanje podataka koji se šalju
      console.log("Request URL:", url);

      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      toast.success('Update successful!');
      setEditField(null);
      setTimeout(() => {
        window.location.reload(); // Osvežavanje podataka o korisniku
      }, 2000);
    } catch {
        toast.error("Invalid data");
    }
  };


  const handleDelete = async () => {
    try {
      const response = await fetch(`https://backend20250126033414.azurewebsites.net/api/UserChange/DeleteProfile?id=${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      localStorage.removeItem('userId');
      localStorage.removeItem('authToken');
      toast.success('Profile deleted successfully.');
      setUserData(null);

      navigate('/');
      window.location.reload();

    } catch {
        toast.error("Error");
    }
  };

  const handleEdit = (field) => {
    if (editField === field) {
      setEditField(null);

    } else {
      setEditField(field); // Open the form for the selected field
    }
  };

  if (error) {
    return <div className='user-error'>Error: {error}</div>;
  }

  if (!userData) {
    return <div className='user-loading'>Loading user data...</div>;
  }

  return (
    <div className='user'>
      <div className='user-right'>
        <div className='img-user'>
          <img src={assets.profile_icon} alt="User" />
          <h2>{userData.userName}</h2>
        </div>
        <p>Email: {userData.email}</p>
        <p>Status: {userData.isActive ? 'Active' : 'Inactive'}</p>

        <button  className='button' onClick={() => handleEdit('username')}>Change Username</button>
        {editField === 'username' && (
          <div className='edit-form'>
            <div className='form-group'>
              <label>New Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleInputChange}
              />
              <button  className='button' onClick={() => handleUpdate('username')}>Update Username</button>
              <button className="close-button" onClick={() => setEditField(null)}>Close</button>
            </div>

          </div>
        )}

        <button className='button' onClick={() => handleEdit('email')}>Change Email</button>
        {editField === 'email' && (
          <div className='edit-form'>
            <div className='form-group'>
              <label>New Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleInputChange}
              />
              <button  className='button' onClick={() => handleUpdate('email')}>Update Email</button>
              <button className="close-button" onClick={() => setEditField(null)}>Close</button>
            </div>

          </div>
        )}

        <button  className='button' onClick={() => handleEdit('password')}>Change Password</button>
        {editField === 'password' && (
          <div className='edit-form'>
            <div className='form-group'>
              <label>Old Password</label>
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleInputChange}
              />
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={form.newPassword}
                onChange={handleInputChange}
              />
              <button  className='button' onClick={() => handleUpdate('password')}>Update Password</button>
              <button className="close-button" onClick={() => setEditField(null)}>Close</button>
            </div>

          </div>
        )}

        <button onClick={handleDelete} className='delete-button'>Delete Account</button>
      </div>
    </div>
  );
};

export default User;
