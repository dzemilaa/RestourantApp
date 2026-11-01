import { useCallback, useContext, useState, useEffect } from 'react';
import './MyOrders.css';
import axios from "axios";
import { StoreContext } from '../../context/StoreContext.js';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

const MyOrders = () => {
    const { url } = useContext(StoreContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reviewStates, setReviewStates] = useState({}); // State for tracking which orders have a review box open
    const userId = localStorage.getItem('userId');

    const fetchOrders = useCallback(async () => {
        try {
            const response = await axios.get(`${url}/api/FetchOrders/user-orders`, {
                params: { userId },
            });
            if (Array.isArray(response.data.data)) {
                setData(response.data.data);
            } else {
                console.error('Invalid response format:', response.data);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setLoading(false);
        }
    }, [url, userId]);

    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [fetchOrders, userId]);

    const toggleReviewBox = (orderId) => {
        setReviewStates((prev) => ({
            ...prev,
            [orderId]: !prev[orderId], // Toggle the visibility of the textarea for this order
        }));
    };

    const handleReviewSubmit = async (orderId, reviewText, productIds) => {
        if (!reviewText || reviewText.trim() === "") {
            toast.error("Review text cannot be empty.");
            return;
        }
        console.log({
            orderId,
            reviewText,
            userId: parseInt(userId),
            productIds
        });
        try {
            const response = await axios.post(`${url}/api/Reviews/submit`, {
                orderId,
                reviewText,
                userId: parseInt(userId),
                productIds,  // Send the productIds with the review
            });

            if (response.data.success) {
                toast.success("Thank you for your review!");
                setReviewStates((prev) => ({
                    ...prev,
                    [orderId]: false, // Close the textarea
                    [`text_${orderId}`]: "", // Clear the review text
                }));
            } else {
                alert("Failed to submit review. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting review:", error);
            alert("An error occurred while submitting your review. Please try again.");
        }
    };

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            <div className="container">
                {loading ? (
                    <p>Loading orders...</p>
                ) : (
                    data.map((order, index) => (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="" />
                            <p>
                                {order.orderItems && order.orderItems.length > 0 ? (
                                    order.orderItems.map((orderItems, index) =>
                                        `${orderItems.name} x ${orderItems.quantity}${
                                            index === order.orderItems.length - 1 ? "" : ", "
                                        }`
                                    )
                                ) : (
                                    <p>No items in this order</p>
                                )}
                            </p>
                            <p>${order.totalAmount}.00</p>
                            <p>Items: {order.orderItems.length}</p>
                            <p className='order-status'>
                                <span>&#x25cf;</span> <b>{order.status}</b>
                            </p>
                            <button onClick={fetchOrders}>Track Order</button>
                            <button onClick={() => toggleReviewBox(order.orderId)}>Write a review</button>

                            {reviewStates[order.orderId] && (
                                <div className="review-box">
                                    <textarea
                                        placeholder="Write your review here..."
                                        rows="3"
                                        value={reviewStates[`text_${order.orderId}`] || ""}
                                        onChange={(e) =>
                                            setReviewStates((prev) => ({
                                                ...prev,
                                                [`text_${order.orderId}`]: e.target.value, // Track review text
                                            }))
                                        }
                                    ></textarea>
                                    <button
                                    className='review-button'
                                        onClick={() =>
                                            handleReviewSubmit(
                                                order.orderId,
                                                reviewStates[`text_${order.orderId}`],
                                                order.orderItems.map(item => item.productId) // Send all productIds in this order
                                            )

                                        }

                                    >
                                        Submit Review
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyOrders;
