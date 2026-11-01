import './Success.css';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  const handleToOrders = () => {
    navigate('/myorders');
  };

  return (
    <div className="success-container">
      <div className="success-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="white"
          width="50px"
          height="50px"
        >
          <path d="M9 16.2l-3.5-3.5c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4 4c.4.4 1 .4 1.4 0l10-10c.4-.4.4-1 0-1.4-.4-.4-1-.4-1.4 0L9 16.2z" />
        </svg>
      </div>
      <h1>Order Successfully Placed!</h1>
      <button className='button-success' onClick={handleToOrders}>Check Order Status</button>
    </div>
  );
};

export default Success;
