import { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext.js';
import { useNavigate } from 'react-router-dom';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
const navigate = useNavigate();
  const cartItem = Array.isArray(cartItems) ? cartItems.find(item => item.productId === id) : null;
  const quantity = cartItem ? cartItem.quantity : 0;


  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img className='food-item-image' src={url + "/images/" + image} alt={name} />


        {quantity === 0 ? (

          <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add to Cart" />
        ) : (

          <div className='food-item-counter'>
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
            <p>{quantity}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add" />
          </div>
        )}
      </div>


      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>

        </div>
        <p className="food-item-desc">{description}</p>
        <div className='food-item-price-viewmore'>
        <p className="food-item-price">${price}</p>
        <button className='button-view-more' onClick={() => navigate(`/viewmore/${id}`)}>View more</button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
