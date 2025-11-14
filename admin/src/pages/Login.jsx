import React, { useState } from "react";
import {assets} from '../assets/assets'
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from 'axios';
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [state,setState] = useState('Admin');
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

    const {setAdminToken,backendUrl} = useContext(AdminContext);

    const {setDoctorToken} = useContext(DoctorContext);

    const navigate = useNavigate();

    const onSubmitHandler = async (e)=>{
        e.preventDefault();

        try {

            if(state==='Admin'){
                const {data} = await axios.post(backendUrl + '/api/admin/admin-login',{email,password})
                if(data.success){
                    localStorage.setItem('admintoken',data.token);
                    setAdminToken(data.token)
                    navigate('/all-appointments')
                }
                else {
                   toast.error(data.message);
                }
            }
            else {

 const {data} = await axios.post(backendUrl + '/api/doctor/login',{email,password});
  if (data.success) {
    localStorage.setItem("doctortoken", data.token);
    setDoctorToken(data.token);
     navigate("/doctor-appointments");
    // console.log(data.token);
  } else {
    toast.error(data.message);
  }
            }
        } 
        catch (error) {
            
        }
    }


  return (
    <form onSubmit={onSubmitHandler} className="min-h-[95vh] flex items-center">
      <div className="flex flex-col gap-3 items-start m-auto p-8 min-w-[340px] sm:min-w-96 border border-primary rounded-xl text-sm shadow-lg text-[#5E5E5E]">
        <p className="text-3xl m-auto font-semibold">
          <span className="text-primary mr-0.5">{state} </span>
          Login
        </p>

        <div className="w-full">
          <p className="text-zinc-800 font-light">Email</p>
          <input
            className="w-full border border-primary mt-1 rounded p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p className="text-zinc-600 font-light">Password</p>
          <input
            className="w-full border border-primary mt-1 rounded p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="m-auto bg-primary text-white w-full rounded-md py-2 mt-2 text-sm hover:scale-103 transition-all duration-500">
          Login
        </button>
        {
        state === "Admin" ? 
          <p className="ml-1">Doctor Login? <span className="underline text-xm text-primary cursor-pointer" onClick={()=>setState('Doctor')}>Click here</span></p>
         : 
          <p className="ml-1"> Admin Login? <span className="underline text-xm text-primary cursor-pointer" onClick={()=>setState('Admin')}>Click here</span></p>
        }
      </div>
    </form>
  );
}

export default Login;