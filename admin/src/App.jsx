import React from "react";
import Login from "./pages/Login";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AdminContext } from "./context/AdminContext";
import { useContext } from "react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Admin/Dashboard";
import AllAppointments from "./pages/Admin/AllAppointments";
import DoctorsList from "./pages/Admin/DoctorsList";
import AddDoctor from "./pages/Admin/AddDoctor";
import { DoctorContext } from "./context/DoctorContext";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAppointment from "./pages/Doctor/DoctorAppointment";
import DoctorProfile from "./pages/Doctor/DoctorProfile";

const App = () => {
  const {admintoken} = useContext(AdminContext);
  const {doctortoken} = useContext(DoctorContext);
  return admintoken || doctortoken ? (
    <div className="bg-[#f2f5fa]">
      <ToastContainer/>
      <NavBar/>
      <div className="flex items-start">
        <SideBar/>
        <Routes>
          <Route path='/' element={<></>}/>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/all-appointments' element={<AllAppointments/>}/>
          <Route path='/add-doctor' element={<AddDoctor/>}/>
          <Route path='/doctor-list' element={<DoctorsList/>}/>
          

          <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
          <Route path='/doctor-appointments' element={<DoctorAppointment/>}/>
          <Route path='/doctor-profile' element={<DoctorProfile/>}/>
        </Routes>
      </div>
      </div>
  ) 
  :
  (
    <>
         <Login/>
      <ToastContainer/>
    </>
  )
}

export default App;