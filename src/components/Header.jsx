import React from 'react'
import { LogOut } from 'react-feather'
import { useAuth } from '../context/AuthContext'

const Header = () => {
    const { user, handleUserLogout } = useAuth();
  return (
    <div id="header--wrapper">
      {user ? (
        <>
          <p>welcome {user.name}</p>
          <LogOut onClick={handleUserLogout} className="header--link" />
        </>
      ) : (
        <button>Login</button> 
      )}
    </div>
  );
}

export default Header