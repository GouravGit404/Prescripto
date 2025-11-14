import React from 'react';
import { assets } from '../assets/assets';
import { useContext } from 'react';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import { DoctorContext } from '../context/DoctorContext';
const NavBar = () => {
    const {admintoken,setAdminToken} = useContext(AdminContext);
    const {doctortoken,setDoctorToken} = useContext(DoctorContext);
    const navigate = useNavigate();

    const logout = () => {
      navigate('/');
      admintoken && setAdminToken('');
      admintoken && localStorage.removeItem('admintoken');
      doctortoken && setDoctorToken("");
      doctortoken && localStorage.removeItem("doctortoken");
    }
    return (
      <div className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-10 py-3 border-b border-neutral-100 bg-white">
        <div className="flex items-center gap-2 text-xs">
          <img
            className="w-36 sm:w-40 cursor-pointer"
            src={assets.admin_logo}
            alt=""
          />
          <p className="border border-gray-600 rounded-full px-2.5 py-0.5 text-gray-600">
            {admintoken ? "Admin" : "Doctor"}
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-primary text-white text-sm px-10 py-2 rounded-full font-light hover:scale-y-95 transition-all duration-300"
        >
          Logout
        </button>
      </div>
    );
}

export default NavBar;