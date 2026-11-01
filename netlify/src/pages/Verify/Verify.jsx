import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../../config/api.js';

const Verify = () => {
  const [message, setMessage] = useState('Verifying...');
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');

    if (!token) {
      setError(true);
      setMessage('Token is missing.');
      return;
    }

    fetch(`${apiUrl}/api/Registration/verify?token=${encodeURIComponent(token)}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Verification failed.');
        }
        return response.json();
      })
      .then(() => {
        setMessage('Email successfully verified!');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      })
      .catch(() => {
        setError(true);
        setMessage('Invalid or expired token.');
      });
  }, [navigate]);

  return (
    <div>
      <h1>{message}</h1>
      {error && <p style={{ color: 'red' }}>Something went wrong. Please try again later.</p>}
    </div>
  );
};

export default Verify;
