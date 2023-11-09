import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { user, handleUserRegister } = useAuth();

  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password1: "",
    password2: "",
  });

    
  const handleInputChange = (e) => {
    setCredentials((prev) => {
      let name = e.target.name;
      let value = e.target.value;
      return {
        ...credentials,
        [name]: value,
      };
    });
  };
    

  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => handleUserRegister(e, credentials)}>
          <div className="field--wrapper">
            <label htmlFor="Email">Name</label>
            <input
              type="text"
              required
              name="name"
              value={credentials.name}
              onChange={(e) => handleInputChange(e)}
              // onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="enter email"
            />
          </div>

          <div className="field--wrapper">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              required
              name="email"
              value={credentials.email}
              onChange={(e) => handleInputChange(e)}
              // onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="enter your email.."
            />
          </div>

          <div className="field--wrapper">
            <label htmlFor="Email">Password</label>
            <input
              type="password"
              required
              name="password1"
              value={credentials.password1}
              onChange={(e) => handleInputChange(e)}
              placeholder="**********"
            />
          </div>

          <div className="field--wrapper">
            <label htmlFor="Email">Confirm Password</label>
            <input
              type="password"
              required
              name="password2"
              value={credentials.password2}
              onChange={handleInputChange}
              // onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="**********"
            />
          </div>

          <div className="field--wrapper">
            <input
              type="submit"
              value="Register"
              className="btn btn--lg btn--main"
            />
          </div>
          <p>
            Already registered? click <Link to="/login">Here</Link> to login
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
