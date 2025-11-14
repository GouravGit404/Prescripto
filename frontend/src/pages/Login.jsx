import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import {toast} from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {

const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const {backendUrl,token,setToken} = useContext(AppContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {

      if(state === 'Sign Up'){
        const {data} = await axios.post(backendUrl + '/api/user/register-user', {name,email,password});
        if(data.success){
          toast.success(data.message)
          localStorage.setItem('token',data.token);
          setToken(data.token);
          setState('Login');
        }
        else {
          toast.error(data.message);
        }
      }

      else {
        const {data} = await axios.post(backendUrl + '/api/user/login-user', {email,password});
        if(data.success){
          toast.success(data.message);
          localStorage.setItem('token',data.token);
          setToken(data.token);
        }
        else {
          toast.error(data.message);
        }
      }

    } 
    
    catch (error) {
      toast.error(error.message);
    }
  };
   
  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <form
      onSubmit={onSubmitHandler}
      autoComplete="off"
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col items-start gap-3 m-auto p-8 min-w-[370px] sm:min-w-96px border border-zinc-300 rounded-xl text-zinc-600 text-sm shadow-lg mt-9">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Login"}
        </p>
        <p className="text-gray-600">
          Please {state === "Sign Up" ? "sign up" : "login"} to book appointment
        </p>

        {state === "Sign Up" && (
          <div className="w-full">
            <p>Full Name</p>
            <input
              className="border border-zinc-300 w-full p-2 mt-1 rounded outline-none"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 w-full p-2 mt-1 rounded outline-none"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 w-full p-2 mt-1 rounded outline-none"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-primary text-white w-full rounded-md text-base mt-3 py-2 hover:scale-102 transition-all duration-400"
        >
          {state === "Sign Up" ? "Create Account" : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p className="ml-1">
            Already have an account ?{" "}
            <span
              onClick={() => setState("Login")}
              className="underline text-primary cursor-pointer text-sm font-light"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create an new account ?{" "}
            <span
              onClick={() => setState("Sign Up")}
              className="underline text-primary cursor-pointer text-sm font-light"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
