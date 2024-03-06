import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import { Modal } from "react-bootstrap";

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [activeButton, setActiveButton] = useState(isLogin ? "login" : "register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);
  const [showLoginError, setShowLoginError] = useState(false);
  const [showRegisterError, setShowRegisterError] = useState(false);
  const { login, register } = useAuth(); // Use useAuth hook
  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setShowLoginError(true);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(email, password, fullName); // Pass fullName as the third argument
      setShowRegisterSuccess(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Register error:", error);
      setShowRegisterError(true);
    }
  };

  const handleButtonClick = (buttonType: string) => {
    setActiveButton(buttonType);
  };

  const closeModal = () => {
    setShowRegisterSuccess(false);
    setShowLoginError(false);
    setShowRegisterError(false);
  };

  return (
    <div className="body">
      <div className="veen">
        <div className={`login-btn splits ${activeButton === "login" ? "active" : ""}`}>
          <p>Already an user?</p>
          <button onClick={() => handleButtonClick("login")}>Login</button>
        </div>
        <div className={`rgstr-btn splits ${activeButton === "register" ? "active" : ""}`}>
          <p>Don't have an account?</p>
          <button onClick={() => handleButtonClick("register")}>Register</button>
        </div>
        <div className={`wrapper ${activeButton === "register" ? "move" : ""}`}>
          {activeButton === "login" ? (
            <form id="login" onSubmit={handleLoginSubmit} tabIndex={500}>
              <h3>Login</h3>
              <div className="mail">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>E-mail</label>
              </div>
              <div className="passwd">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
              </div>
              <div className="submit">
                <button type="submit" className="dark">
                  Login
                </button>
              </div>
            </form>
          ) : (
            <form id="register" onSubmit={handleRegisterSubmit} tabIndex={502}>
              <h3>Register</h3>
              <div className="name">
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
                <label>Full name</label>
              </div>
              <div className="mail">
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label>E-mail</label>
              </div>
              <div className="passwd">
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label>Password</label>
              </div>
              <div className="submit">
                <button type="submit" className="dark">
                  Register
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* Modal for Registration Success */}
      <Modal show={showRegisterSuccess} onClose={closeModal}>
        <h3>Registration Successful!</h3>
        <p>You have successfully registered. Proceed to login.</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
      {/* Modal for Login Error */}
      <Modal show={showLoginError} onClose={closeModal}>
        <h3>Login Error</h3>
        <p>Incorrect email or password. Please try again.</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
      {/* Modal for Register Error */}
      <Modal show={showRegisterError} onClose={closeModal}>
        <h3>Registration Error</h3>
        <p>An error occurred during registration. Please try again later.</p>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default AuthForm;
