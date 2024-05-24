import React, { useState } from "react";
import { useAuth } from "../../AuthContext";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import "./login.css";
import { jwtDecode } from "jwt-decode";
function LoginSignupContainer({ show, onHide }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleToggle = () => {
    setIsLogin(!isLogin);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (email === "" || password === "") {
        toast.error("Email and password are required");
        return;
      }
      const body = { email, password };
      const response = await fetch("http://localhost:5000/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status === true) {
        login(data.token);
        onHide();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (name === "" || email === "" || password === "") {
        toast.error("Name, email, and password are required");
        return;
      }
      const body = { username: name, email, password };
      const response = await fetch("http://localhost:5000/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status === true) {
        toast.success("Sign up successful. Please log in.");
        setIsLogin(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const cred = jwtDecode(credentialResponse.credential);
      const body = {
        username: cred.name,
        email: cred.email,
        password: 123,
      };
      console.log(body);
      const response = await fetch("http://localhost:5000/user/gprofile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (data.status === true) {
        login(data.token);
        onHide();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  };

  return show ? (
    <div className={`container1 ${show ? "blur" : ""}`}>
      <div className={`form-container ${isLogin ? "login" : "signup"}`}>
        {isLogin ? (
          <form
            onSubmit={handleLogin}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <button className="close-btn" onClick={onHide}>
              X
            </button>
            <h1>Login</h1>
            <div className="infield">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <div className="infield">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            <button className="bid-history" type="submit">
              Login
            </button>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Login Failed");
              }}
              origin={"http://localhost:3000"}
            />
          </form>
        ) : (
          <form
            onSubmit={handleSignup}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <button className="close-btn" onClick={onHide}>
              X
            </button>
            <h1>Sign Up</h1>
            <div className="infield">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <label>Name</label>
            </div>
            <div className="infield">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label>Email</label>
            </div>
            <div className="infield">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label>Password</label>
            </div>
            <button type="submit">Sign Up</button>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log("Login Failed");
              }}
              origin={"http://localhost:3000"}
            />
          </form>
        )}
        <br />
        {isLogin ? (
          <p style={{ color: "#fff" }}>
            Dont Have An Account?
            <a className="toggle" onClick={handleToggle}>
              SignUp
            </a>
          </p>
        ) : (
          <p style={{ color: "#fff" }}>
            Already Have An Account?
            <a className="toggle" onClick={handleToggle}>
              Login
            </a>
          </p>
        )}

        <br />
      </div>
    </div>
  ) : null;
}

export default LoginSignupContainer;
