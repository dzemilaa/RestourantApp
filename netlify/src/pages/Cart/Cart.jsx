import { useCallback, useContext, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cart = () => {
  const { getTotalCartAmount, cartItems, setCartItems, url } = useContext(StoreContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  // Funkcija za dohvat podataka o korpi sa backend-a
  const fetchCartItems = useCallback(async () => {
    try {
      const response = await axios.get(`${url}/api/Cart/get/${userId}`);
      console.log("Response from cart API:", response.data);
      setCartItems(response.data || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  }, [setCartItems, url, userId]);

  useEffect(() => {
    if (userId) {
      fetchCartItems();
    }
  }, [fetchCartItems, userId]);

  // Funkcija za uklanjanje proizvoda iz korpe
  const handleRemove = async (productId) => {
    try {
      await axios.post(`${url}/api/Cart/remove`, {
        ProductId: productId,
        UserId: userId,
      });
      fetchCartItems();  // Ponovo učitaj korpu nakon uklanjanja proizvoda
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };
  const groupCartItems = (cartItems) => {
    const groupedItems = {};

    cartItems.forEach(item => {
        if (groupedItems[item.name]) {
            groupedItems[item.name].quantity += item.quantity; // Dodaj količinu za isti proizvod
        } else {
            groupedItems[item.name] = { ...item }; // Dodaj proizvod ako još nije u grupi
        }
    });

    return Object.values(groupedItems); // Vratiti listu sa grupisanim proizvodima
};
  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Image</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {cartItems.length > 0 ? (
  groupCartItems(cartItems).map((item) => (
    <div key={item.productId}>
      <div className='cart-items-title cart-items-item'>
        <img src={`${url}/images/${item.image}`} alt={item.name} />
        <p>{item.name}</p>
        <p>${item.price}</p>
        <p>{item.quantity}</p>
        <p>${item.price * item.quantity}</p>
        <p onClick={() => handleRemove(item.productId)} className='cross'>x</p>
      </div>
      <hr />
    </div>
  ))
) : (
  <p>Your cart is empty</p>
)}
      </div>

      <div className="cart-bottom">
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
          <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
