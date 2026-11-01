import { useState } from 'react';
import Navbar from './components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Cart from './pages/Cart/Cart';
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup';
import Success from './pages/Success/Success';
import MyOrders from './pages/MyOrders/MyOrders';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify';
import Viewmore from './components/Viewmore/Viewmore';
import User from './pages/User/User';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}

        <div className="app">
          <ToastContainer />
          <Navbar setShowLogin={setShowLogin} />

          <Routes>
            <Route  path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/order" element={<PlaceOrder />} />
            <Route path="/success" element={<Success />} />
            <Route path="/myorders" element={<MyOrders />} />
            <Route path="/verify" element={<Verify />} />
            <Route path="/viewmore/:id" element={<Viewmore />} />
            <Route path="/user" element={<User />} />
          </Routes>
        </div>
        <Footer />

    </>
  );
}

export default App;
