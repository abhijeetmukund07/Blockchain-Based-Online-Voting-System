import React, { useState } from "react";
import './loginstyle.css';
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar.js";
import Foot from "./foot.js";
import { useTypewriter ,Cursor } from 'react-simple-typewriter'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginPage() {
  const [loginType, setLoginType] = useState("user");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [text] =useTypewriter({
    words: ['Vote','See Results','Your Vote Your Voice'],
    loop:{},
    typeSpeed:80,
    deleteSpeed:20
  });

  const navigate = useNavigate();

  const handleLogin = () => {
    const data = { username, password };

    let url = '/voters-api/login'; 
    if (loginType === "admin") {
      url = '/admin-api/login'; 
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === "login success") {
        toast.success('Logged in Successfully', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        if (loginType === "user") {
          navigate(`/voter-home/${username}`);
        } else {
          navigate("/admin-home");
        }
      } else {
        toast.error('Invalid Credentials', {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    })
    .catch(error => {
      console.error('Error:', error);
      toast.error('Error occurred', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    });
  };

  return (
    <>
      <Navbar/>
      <div className="app">
        <div className="getSign">Get <span className="special" style={{ color: "red" }}>Signed in</span>  to</div>
        <div className="typewriter"> 
          <span style={{position:"relative"}}>{text}</span>
          <Cursor/>
        </div>
        <div className="login-form">
          <div className="title text-center">Sign In</div>
          <hr className="pb-3" />
          <div className="button-container">
            <button
              className={`col-6 btn  ${loginType === "user" ? "active btn-dark" : ""}`}
              onClick={() => setLoginType("user")}
            >
              User Login
            </button>
            <button
              className={`col-6 btn  ${loginType === "admin" ? "active btn-dark" : ""}`}
              onClick={() => setLoginType("admin")}
            >
              Admin Login
            </button>
          </div>
          <div className="input-container">
            <div className="input-container">
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="input-container">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="button-container">
            <button className="btn btn-danger" style={{color:"white"}} onClick={handleLogin}>
              Login <i className="fa-solid fa-arrow-right-to-bracket"></i>
            </button>
            <ToastContainer
              position="top-center"
              autoClose={1000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </div>
      </div>
      <footer>
        <Foot/>
      </footer>
    </>
  );
}

export default LoginPage;
