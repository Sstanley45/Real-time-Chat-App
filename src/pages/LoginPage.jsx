import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, handleUserLogin } = useAuth();

  const [credentials, setCredentials] = useState({
    email: '',
    password : ''
  })

  const handleInputChange = (e) => {
    setCredentials(prev => {
      let name = e.target.name 
      let value = e.target.value
      return {
        ...credentials,
        [name] : value
      }
    })

  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);
  return (
    <div className="auth--container">
      <div className="form--wrapper">
        <form onSubmit={(e) => handleUserLogin(e, credentials)}>
          <div className="field--wrapper">
            <label htmlFor="Email">Email</label>
            <input
              type="email"
              required
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              // onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="enter your email.."
            />
          </div>

          <div className="field--wrapper">
            <label htmlFor="Email">Password</label>
            <input
              type="password"
              required
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              // onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              placeholder="**********"
            />
          </div>

          <div className="field--wrapper">
            <input
              type="submit"
              value="Login"
              className="btn btn--lg btn--main"
            />
          </div>
          <p>Not yet registered? click <Link to='/register'>here</Link></p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
