import { useState, useContext } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext.js';
import { apiUrl } from '../../config/api.js';

const LoginPopup = ({ setShowLogin }) => {
  const { setToken } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      Email: email,
      Password: password,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/Registration/login`, loginData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data.token) {
        setToken(response.data.token);


        if (response.data.userId) {
          sessionStorage.setItem("authToken", response.data.token);
          localStorage.setItem("userId", response.data.userId);

          window.location.href = "/";

        } else {
          console.error("UserId is missing in the API response");
        }
        setShowLogin(false);
      } else {
        setErrorMessage("Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage("Error during login.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const signUpData = {
      UserName: userName,
      Email: email,
      Password: password,
      IsActive: true,
    };

    try {
      const response = await axios.post(`${apiUrl}/api/Registration/registration`, signUpData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200 && response.data === "Data Inserted") {
        alert("User registered successfully!");
        setShowLogin(false);
      } else {
        setErrorMessage("Check your email inbox.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage("Error during registration.");
    }
  };

  return (
    <div className='login-popup'>
      <form className='login-popup-container' onSubmit={currState === "Login" ? handleLogin : handleSignUp}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="Close" />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder='Enter Username'
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder='Enter Email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder='Enter Password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button>{currState === "Sign Up" ? "Create Account" : "Login"}</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>I accept the terms of use and privacy policy.</p>
        </div>

        {currState === "Login" ? (
          <p>Don&apos;t have an account? <span onClick={() => setCurrState("Sign Up")}>Sign up here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => setCurrState("Login")}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
