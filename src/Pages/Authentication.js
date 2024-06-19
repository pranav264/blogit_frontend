import React, { useEffect, useState } from "react";
import axios from "axios";
import customAlert from "../alerts";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@chakra-ui/react";
const { REACT_APP_SERVER_URL } = process.env;

const Authentication = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleIsLogin = () => setIsLogin(!isLogin);

  const handleEmail = (e) => setEmail(e.target.value);
  const handlePassword = (e) => setPassword(e.target.value);

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin) {
      setIsLoading(true);
      const response = await axios.post(
        `${REACT_APP_SERVER_URL}/users/signUp`,
        {
          username: email,
          password: password,
        }
      );

      setEmail("");
      setPassword("");

      setIsLoading(false);

      customAlert(response.data.message);
    } else {
      setIsLoading(true);
      const response = await axios.post(`${REACT_APP_SERVER_URL}/users/login`, {
        username: email,
        password: password,
      });

      if(response.data.message === "Login successful") {
        sessionStorage.setItem("token", response.data.token);
        
        setEmail("");
        setPassword("");
        
        setIsLoading(false);
        navigate("/documents", { state: { username: email } });
      }
      else {
        customAlert(response.data.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {!isLogin && (
        <div className="authentication-app w-screen h-screen pt-20">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-3xl font-semibold">Create an account</h1>
            <div className="flex justify-center items-center gap-2">
              <p>Already have an account?</p>
              <p
                className="underline decoration-solid hover:cursor-pointer"
                onClick={handleIsLogin}
              >
                Log in
              </p>
            </div>
          </div>
          <div>
            <form
              className="form flex flex-col justify-center items-center gap-14 mt-16"
              onSubmit={handleOnSubmit}>
              <div className="flex flex-col w-5/12 gap-1">
                <label>Email address</label>
                <input
                  className="poppins border border-gray-400 p-3 rounded-lg"
                  type="text"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmail}
                />
              </div>
              <div className="flex flex-col w-5/12 gap-1">
                <label>Password</label>
                <input
                  className="poppins border border-gray-400 p-3 rounded-lg"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePassword}
                />
              </div>
              {!isLoading && (
                <input
                  className="w-5/12 bg-blue-500 text-white border border-blue-500 rounded-3xl p-3 hover:cursor-pointer"
                  type="submit"
                  value='Create an account'
                />
              )}
              {isLoading && (
                <CircularProgress isIndeterminate />
              )}
            </form>
          </div>
        </div>
      )}
      {isLogin && (
        <div className="authentication-app w-screen h-screen pt-20">
          <div className="flex flex-col justify-center items-center gap-2">
            <h1 className="text-3xl font-semibold">Log in</h1>
            <div className="flex justify-center items-center gap-2">
              <p>Don't have an account?</p>
              <p
                className="underline decoration-solid hover:cursor-pointer"
                onClick={handleIsLogin}
              >
                Register
              </p>
            </div>
          </div>
          <div>
            <form
              className="form flex flex-col justify-center items-center gap-14 mt-16"
              onSubmit={handleOnSubmit}>
              <div className="flex flex-col w-5/12 gap-1">
                <label>Email address</label>
                <input
                  className="poppins border border-gray-400 p-3 rounded-lg"
                  type="text"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={handleEmail}
                />
              </div>
              <div className="flex flex-col w-5/12 gap-1">
                <label>Password</label>
                <input
                  className="poppins border border-gray-400 p-3 rounded-lg"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handlePassword}
                />
              </div>
              {!isLoading && (
                <input
                  className="w-5/12 bg-blue-500 text-white border border-blue-500 rounded-3xl p-3 hover:cursor-pointer"
                  type="submit"
                  value='Log in'
                />
              )}
              {isLoading && (
                <CircularProgress isIndeterminate />
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Authentication;
