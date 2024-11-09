/* eslint-disable react/prop-types */
import { createContext, useCallback, useEffect, useState } from "react";
import { postRequest } from "../utils/services";

export const AuthContext = createContext();
/**
 * The AuthContextprovider component provides the context for the entire app.
 *
 * The state it keeps track of is as follows:
 *  - user: the user object when logged in, null otherwise
 *  - registerInfo: the data to be sent to the server when registering a user
 *  - updateRegisterInfo: a function to update the registerInfo state
 *  - registerUser: a function to handle the registration process
 *  - registerError: any errors that occur during registration
 *  - isRegisterLoading: whether or not the registration request is being processed
 *  - logoutUser: a function to handle the logout process
 *  - loginUser: a function to handle the login process
 *  - loginError: any errors that occur during login
 *  - loginInfo: the data to be sent to the server when logging in
 *  - updateLoginInfo: a function to update the loginInfo state
 *  - isLoginLoading: whether or not the login request is being processed
 *
 * The component expects a children prop, which will be rendered when the component renders.
 */
export const AuthContextprovider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  console.log("Userr", user);
  console.log("loginInfo", loginInfo);

  useEffect(() => {
    const user = localStorage.getItem("User");
    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();

      setIsRegisterLoading(true);

      setRegisterError(null);

      const response = await postRequest(`/users/register`, registerInfo);

      setIsRegisterLoading(false);

      if (response.error) {
        return setRegisterError(response);
      }
      localStorage.setItem("user", JSON.stringify(registerInfo));
      setUser(response);
    },
    [registerInfo]
  );

  //login
  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);

      const response = await postRequest(`/users/login`, loginInfo);
      setIsLoginLoading(false);

      if (response.error) {
        return setLoginError(response);
      }
      localStorage.setItem("User", JSON.stringify(response));
      setUser(response);
    },
    [loginInfo]
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,
        logoutUser,
        loginUser,
        loginError,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
