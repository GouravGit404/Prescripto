import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);
  const [docInfo, setDocInfo] = useState(null);

  const navigate = useNavigate();

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSlots = async () => {
    let allSlots = [];
    setDocSlots([]);

    let today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1; // Use 1-indexed month
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const currentSlotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(currentSlotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }
      allSlots.push(timeSlots);
    }
    setDocSlots(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Register To Book Appointment");
      return navigate("/login");
    }

    // Check if a time slot has been selected
    if (!slotTime) {
      toast.warn("Please select a time slot.");
      return;
    }

    try {
      // Safely get the date based on the selected index
      const dateObj = new Date();
      dateObj.setDate(new Date().getDate() + slotIndex);

      let day = dateObj.getDate();
      let month = dateObj.getMonth() + 1; // Use 1-indexed month
      let year = dateObj.getFullYear();

      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData(); // To refresh doctor data (including booked slots)
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [docId, doctors]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]); // This will re-run if docInfo (and its slots) changes

  useEffect(() => {
    console.log(docSlots);
  }, [docSlots]);

  return (
    docInfo && (
      <div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg cursor-pointer"
              src={docInfo.image}
              alt={docInfo.name}
            />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name} <img className="w-4" src={assets.verified_icon} />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {docInfo.experience}
              </button>
            </div>

            <div>
              <p className="flex items-center gap-1 mt-3 text-sm font-medium text-gray-700">
                About <img src={assets.info_icon} />
              </p>
              <p className="text-gray-600 text-sm mt-1 max-w-[7F00px]">
                {docInfo.about}
              </p>
            </div>
            <p className="text-gray-500 mt-3 font-medium">
              Appointmnet Fee :{" "}
              <span className="text-gray-700">
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking Slots</p>

          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlots.map((item, index) => {
              const badgeDate = new Date();
              badgeDate.setDate(new Date().getDate() + index);

              return (
                <div
                  onClick={() => {
                    setSlotIndex(index);
                    setSlotTime(""); // Reset time when date changes
                  }}
                  key={index}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                    slotIndex === index
                      ? "bg-primary text-white"
                      : "border border-gray-200"
                  }`}
                >
                  <p>{daysOfWeek[badgeDate.getDay()]}</p>
                  <p>{badgeDate.getDate()}</p>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-3 mt-4 w-full overflow-x-scroll">
            {docSlots.length > 0 && docSlots[slotIndex].length === 0 && (
              <p className="text-gray-500">No available slots for this day.</p>
            )}

            {docSlots.length > 0 &&
              docSlots[slotIndex].map((item, index) => (
                <p
                  onClick={() => setSlotTime(item.time)}
                  className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                    item.time === slotTime
                      ? "bg-primary text-white"
                      : "text-gray-500 border border-gray-400"
                  }`}
                  key={index}
                >
                  {item.time.toLowerCase()}
                </p>
              ))}
          </div>

          <button
            onClick={bookAppointment}
            className="bg-primary py-2 px-10 mt-6 font-light rounded-full text-white text-sm hover:scale-105 transition-all duration-300"
          >
            Book an appointment
          </button>
        </div>

        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;


































// import React, { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { AppContext } from "../context/AppContext";
// import { assets } from "../assets/assets";
// import RelatedDoctors from "../components/RelatedDoctors";
// import axios from "axios";
// import {toast} from "react-toastify";

// const Appointment = () => {
//   const { docId } = useParams();
//   const { doctors, currencySymbol, backendUrl, token, getDoctorsData } = useContext(AppContext);
//   const [docInfo, setDocInfo] = useState(null);

//   const navigate = useNavigate();

//   const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

//   const [docSlots, setDocSlots] = useState([]);
//   const [slotIndex, setSlotIndex] = useState(0);
//   const [slotTime, setSlotTime] = useState("");

//   const fetchDocInfo = async () => {
//     const docInfo = doctors.find((doc) => doc._id === docId);
//     setDocInfo(docInfo);
//   };

//   const getAvailableSlots = async () => {
//     let allSlots = [];
//     setDocSlots([]);

//     let today = new Date();

//     for (let i = 0; i < 7; i++) {
//       let currentDate = new Date(today);
//       currentDate.setDate(today.getDate() + i);

//       let endTime = new Date();
//       endTime.setDate(today.getDate() + i);
//       endTime.setHours(21, 0, 0, 0);

//       if (i === 0) {
//         currentDate.setHours(
//           currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
//         );
//         currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
//       } else {
//         currentDate.setHours(10);
//         currentDate.setMinutes(0);
//       }

//       let timeSlots = [];

//       while (currentDate < endTime) {
//         let formattedTime = currentDate.toLocaleTimeString([], { hour : '2-digit', minute : '2-digit'})

//         let day = currentDate.getDate();
//         let month = currentDate.getMonth()+1;
//         let year = currentDate.getFullYear();

//         const slotDate = day + "_" + month + "_" + year;
//         const slotTime = formattedTime;

//         const isSlotAvailable =
//           docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true

//           if(isSlotAvailable){
//             timeSlots.push({
//               datetime: new Date(currentDate),
//               time: formattedTime,
//             });
//           }

//         // timeSlots.push({
//         //   datetime: new Date(currentDate),
//         //   time: formattedTime
//         // });

//         currentDate.setMinutes(currentDate.getMinutes() + 30);

//         // setDocSlots(prev => ([...prev,timeSlots]))
//       }
//       allSlots.push(timeSlots);
//     }
//     setDocSlots(allSlots);
//   };

//   const bookAppointment = async () => {
//     if(!token){
//       toast.warn('Login To Book Appointment');
//       return navigate('/login');
//     }

//     try {
//       const date = docSlots[slotIndex][0].datetime;
//       let day = date.getDate();
//       let month = date.getMonth();
//       let year = date.getFullYear();

//       const slotDate = day + "_" + month + "_" + year;

//       const {data} = await axios.post(backendUrl + '/api/user/book-appointment', {docId,slotDate,slotTime}, {headers:{token}})

//       if(data.success){
//         toast.success(data.message);
//         getDoctorsData();
//         navigate("/my-appointments");
//       }
//       else {
//         toast.error(data.message)
//       }

//     } 
//     catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   }

//   useEffect(() => {
//     fetchDocInfo();
//   }, [docId, doctors]);

//   useEffect(() => {
//     if (docInfo) {
//       getAvailableSlots();
//     }
//   }, docInfo);

//   useEffect(() => {
//     console.log(docSlots);
//   }, [docSlots]);

//   return (
//     docInfo && (
//       <div>
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div>
//             <img
//               className="bg-primary w-full sm:max-w-72 rounded-lg"
//               src={docInfo.image}
//               alt={docInfo.name}
//             />
//           </div>

//           <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0">
//             <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
//               {docInfo.name} <img className="w-4" src={assets.verified_icon} />
//             </p>
//             <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
//               <p>
//                 {docInfo.degree} - {docInfo.speciality}
//               </p>
//               <button className="py-0.5 px-2 border text-xs rounded-full">
//                 {docInfo.experience}
//               </button>
//             </div>

//             <div>
//               <p className="flex items-center gap-1 mt-3 text-sm font-medium text-gray-700">
//                 About <img src={assets.info_icon} />
//               </p>
//               <p className="text-gray-600 text-sm mt-1 max-w-[700px]">
//                 {docInfo.about}
//               </p>
//             </div>
//             <p className="text-gray-500 mt-3 font-medium">
//               Appointmnet Fee :{" "}
//               <span className="text-gray-700">
//                 {currencySymbol}
//                 {docInfo.fees}
//               </span>
//             </p>
//           </div>
//         </div>

//         <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
//           <p>Booking Slots</p>

//           <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
//             {docSlots.map((item, index) => (


//               <div
//                 onClick={() => setSlotIndex(index)}
//                 key={index}
//                 className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
//                   slotIndex === index
//                     ? "bg-primary text-white"
//                     : "border border-gray-200"
//                 }`}
//               >
//                 <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
//                 <p>{item[0] && item[0].datetime.getDate()}</p>
//               </div>
//             ))}
//           </div>

//           <div className="flex items-center gap-3 mt-4 w-full overflow-x-scroll">
//             {docSlots.length &&
//               docSlots[slotIndex].map((item, index) => (
//                 <p
//                   onClick={() => setSlotTime(item.time)}
//                   className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer ${
//                     item.time === slotTime
//                       ? "bg-primary text-white"
//                       : "text-gray-500 border border-gray-400"
//                   }`}
//                   key={index}
//                 >
//                   {item.time.toLowerCase()}
//                 </p>
//               ))}
//           </div>

//           <button onClick={bookAppointment} className="bg-primary py-2 px-10 mt-6 font-light rounded-full text-white text-sm hover:scale-105 transition-all duration-300">Book an appointment</button>
//         </div>

//      <RelatedDoctors docId = {docId} speciality={docInfo.speciality}/>

//       </div>
//     )
//   );
// };

// export default Appointment;

