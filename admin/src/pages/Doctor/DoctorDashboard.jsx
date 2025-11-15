import React from "react";
import { useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { useEffect } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";

const DoctorDashboard = () => {
  const {
    dashData,
    getDashData,
    doctortoken,
    completeAppointment,
    cancelAppointment,
  } = useContext(DoctorContext);
  const { currency, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (doctortoken) {
      getDashData();
    }
  }, [doctortoken, getDashData]);

  const handleCancel = async (appointmentId) => {
    await cancelAppointment(appointmentId);
    getDashData();
  };

  const handleComplete = async (appointmentId) => {
    await completeAppointment(appointmentId);
    getDashData();
  };

  if (!dashData) {
    return (
      <div className="m-5 p-5 text-gray-600">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="m-5">
      <div className="flex gap-5 flex-wrap">
        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-103 transition-all">
          <img className="w-14" src={assets.earning_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {currency} {dashData.earnings}
            </p>
            <p className="text-gray-400">Earnings</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-103 transition-all">
          <img className="w-14" src={assets.appointments_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.appointments}
            </p>
            <p className="text-gray-400">Appointments</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-103 transition-all">
          <img className="w-14" src={assets.patients_icon} alt="" />
          <div>
            <p className="text-xl font-semibold text-gray-600">
              {dashData.patients}
            </p>
            <p className="text-gray-400">Patients</p>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <div className="flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border border-gray-100">
          <img src={assets.list_icon} />
          <p className="font-semibold">Latest Bookings</p>
        </div>

        <div className="pt-4  border-t-0">
          {dashData.latestAppointments.map((item, index) => (
            <div
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100"
              key={index}
            >
              <img className="rounded-full w-12" src={item.userData.image} />

              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">
                  {item.userData.name}
                </p>
                <p className="text-gray-600">{slotDateFormat(item.slotDate)}</p>
              </div>

              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-400 text-xs font-medium">Completed</p>
              ) : (
                <div className="flex gap-1">
                  <img
                    onClick={() => handleCancel(item._id)}
                    className="w-10 cursor-pointer"
                    src={assets.cancel_icon}
                  />
                  <img
                    className="w-10 cursor-pointer"
                    onClick={() => handleComplete(item._id)}
                    src={assets.tick_icon}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;