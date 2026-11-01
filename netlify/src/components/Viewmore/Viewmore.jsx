import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext.js';
import './Viewmore.css';

const ViewMore = () => {
  const { id } = useParams(); // Gets id from URL
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);
  const [foodItem, setFoodItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [error, setError] = useState(null);

  // Fetch food item details based on the id from the URL
  useEffect(() => {
    const fetchFoodItem = async () => {
      try {
        const response = await fetch(`${url}/api/FetchProduct/${id}`);
        const data = await response.json();

        if (data.success) {
          setFoodItem(data.data); // Set the fetched food item data
        } else {
          console.error('Product not found');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchFoodItem();
  }, [id, url]);

  // Fetch reviews for the current product
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${url}/api/Reviews/fetch-by-product?productId=${id}`);
        const data = await response.json();

        if (data.success) {
          setReviews(data.data);

        } else {
          setError(data.message || 'No reviews found.');
        }
      } catch {
        setError('Error fetching reviews.');
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [id, url]);

  if (!foodItem) {
    return <div>Loading...</div>;
  }

  // Find the quantity of this foodItem in the cart
  const itemInCart = cartItems.find((item) => item.productId === foodItem.productId);
  const quantityInCart = itemInCart ? itemInCart.quantity : 0;

  return (
    <div className="view-more">
      <div className='view-more-img-info'>
      <div className="view-more-img-container">
        <img className="view-more-image" src={url + "/images/" + foodItem.image} alt={foodItem.name} />
      </div>
      <div className="view-more-info">
        <h1>{foodItem.name}</h1>
        <p>{foodItem.description}</p>
        <p className="view-more-price">${foodItem.price}</p>
        {quantityInCart === 0 ? (
          <img className='add-view-more' onClick={() => addToCart(foodItem.productId)} src={assets.add_icon_white} alt="Add to Cart" />
        ) : (
          <div className='view-item-counter'>
            <img onClick={() => removeFromCart(foodItem.productId)} src={assets.remove_icon_red} alt="Remove" />
            <p>{quantityInCart}</p>
            <img onClick={() => addToCart(foodItem.productId)} src={assets.add_icon_green} alt="Add" />
          </div>
        )}
      </div>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        {loadingReviews ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p>{error}</p>
        ) : reviews.length === 0 ? (
          <p>No reviews found for this product.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.reviewId} className="review">
               <img src={assets.profile_icon} alt="" />
              <p>
                <strong>  {review.userName}</strong> reviewed on {new Date(review.createdAt).toLocaleDateString()}: {review.reviewText}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ViewMore;
