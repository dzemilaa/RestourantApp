import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { StoreContext } from "./StoreContext.js";

const StoreContextProvider = (props) => {
  // Promeni cartItems na niz
  const [cartItems, setCartItems] = useState([]);
  const url = "https://backend20250126033414.azurewebsites.net";
  const [token, setToken] = useState("");
  const userId = localStorage.getItem("userId");
  const [food_list, setFoodList] = useState([]);

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (token && userId) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
      }
    }
    loadData();
  }, [token, userId]);

  const addToCart = (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      toast.error("Please register or log in to add items to your cart or complete an order.");
      return;
    }

    setCartItems((prevItems) => {
      if (!Array.isArray(prevItems)) {
        prevItems = []; // Osiguranje da prevItems bude niz
      }

      const existingItem = prevItems.find((item) => item.productId === productId);

      let updatedItems;
      if (existingItem) {
        // Ako proizvod već postoji u korpi, samo povećaj količinu
        updatedItems = prevItems.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // Ako proizvod nije u korpi, pronađi ga u food_list i dodaj ga u korpu
        const product = food_list.find((item) => item.productId === productId);
        if (product) {
          updatedItems = [...prevItems, { ...product, quantity: 1 }];
        }
      }

      // Ažuriranje cartItems u localStorage
      localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      return updatedItems || prevItems; // Vrati ažuriranu ili originalnu vrednost
    });

    // API poziv za dodavanje proizvoda u korpu
    axios
      .post('https://backend20250126033414.azurewebsites.net/api/Cart/add', {
        ProductId: productId,
        UserId: userId,
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Product added to cart:", response.data);
        } else {
          console.error("Error adding to cart:", response);
          alert("There was an issue adding the item to your cart. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error adding to cart:", error);
        alert("There was an error adding the item to your cart. Please check your connection or try again later.");
      });
  };



  // Funkcija za uklanjanje proizvoda iz korpe
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.productId === productId);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        const updatedItem = { ...updatedItems[existingItemIndex] };

        // Ako je količina veća od 1, smanji je
        if (updatedItem.quantity > 1) {
          updatedItem.quantity -= 1;
          updatedItems[existingItemIndex] = updatedItem;
        } else {
          // Ako je količina 1, ukloni proizvod iz korpe
          updatedItems.splice(existingItemIndex, 1);
        }

        return updatedItems;
      }

      return prevItems;
    });

    axios
      .post('https://backend20250126033414.azurewebsites.net/api/Cart/remove', {
        ProductId: productId,
        UserId: localStorage.getItem("userId"),
      })
      .then((response) => {
        if (response.status === 200) {
          console.log("Cart updated:", response.data);
        } else {
          console.error("Error updating cart:", response);
        }
      })
      .catch((error) => {
        console.error("Error updating cart:", error);
      });
  };

  const getTotalCartAmount = useCallback(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        return 0;
    }

    let totalAmount = 0;

    cartItems.forEach((cartItem) => {
        const itemInfo = food_list.find(
            (product) => product.productId === cartItem.productId
        );
        if (itemInfo && itemInfo.price) {
            totalAmount += itemInfo.price * cartItem.quantity;
        }
    });

    return totalAmount;
}, [cartItems, food_list]);


const fetchFoodList = async () => {
  try {
    const response = await axios.get("https://backend20250126033414.azurewebsites.net/api/FetchProduct/list");
    const data = response.data?.data;

    if (!data || !Array.isArray(data)) {
      console.error("Invalid response format: Expected 'data' to be an array.");
      return;
    }

    const food_list = data.map((item) => ({
      ...item,
      productId: Number(item.productId),
    }));
    console.log(`Fetched ${food_list.length} items.`);
    setFoodList(food_list);
  } catch (error) {
    console.error("Error fetching food list:", error.message || error);
  }
};


  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
