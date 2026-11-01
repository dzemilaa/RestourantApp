import { useContext, useState, useEffect } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, setCartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: 'Novi Pazar',
    phone: ''
  });

  const handleOrder = async (event) => {
    event.preventDefault();

    // Kreiranje FormData objekta
    const orderData = new FormData();
    orderData.append("userId", localStorage.getItem("userId"));
    orderData.append("address", `${data.street}, ${data.city}`);
    orderData.append("firstName", data.firstName);
    orderData.append("lastName", data.lastName);
    orderData.append("email", data.email);
    orderData.append("phone", data.phone);
    orderData.append("totalAmount", (getTotalCartAmount() + 2).toString());

    // Dodavanje stavki u korpi
    cartItems.forEach(item => {
      orderData.append("cartItems", JSON.stringify({
        ProductId: item.ProductId,
        Quantity: item.Quantity,
      }));
    });

    try {
      const response = await axios.post("https://backend20250126033414.azurewebsites.net/api/Order/Order", orderData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Koristimo multipart/form-data
        },
      });

      if (response.data && response.data.message === "Order created successfully.") {
        setCartItems([]);
        navigate("/success");
      } else {
        console.error("Error placing order: ", response.data);
        alert("Error placing order");
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      alert("Error placing order");
    }
  };




  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  useEffect(() => {
    if(!userId) {
      navigate("/cart");
    }
    else if(getTotalCartAmount()===0){
      navigate("/cart");
    }
  }, [getTotalCartAmount, navigate, userId]);

  return (
    <form onSubmit={handleOrder} className='place-order'>
      <div className='place-order-left'>
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
        </div>

        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone' />
      </div>

      <div className='place-order-right'>
        <div className="cart-total">
          <h2>Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>
          <button type='submit'>CHECK ORDER STATUS</button>
          <h2>Payment upon delivery</h2>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
