import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //get user eventually
    getUserOnLoad(false);
  }, []);

  //get user on load to persist user - avoid the user state becoming null on reload
  const getUserOnLoad = async () => {
    try {
      setLoading(true);
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  //userLogin logic
  const handleUserLogin = async (e, credentials) => {
    e.preventDefault();
    try {
      const response = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      console.log("Logged In", response);
      const userDetails = await account.get();
      setUser(userDetails);
      console.log("user id is",userDetails.$id);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  //user registered

  const handleUserRegister = async (e, credentials) => {
    e.preventDefault();
    if (credentials.password1 !== credentials.password2) {
      return alert("passwords do not match");
    }

    try {
      let response = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password1,
        credentials.name
      );

      await account.createEmailSession(
        credentials.email,
        credentials.password1
      );

      const userDetails = await account.get();
      setUser(userDetails);

      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  //user log out

  const handleUserLogout = async () => {
    try {
      await account.deleteSession("current");
      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  const contextData = {
    user,
    handleUserLogin,
    handleUserLogout,
    handleUserRegister,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
