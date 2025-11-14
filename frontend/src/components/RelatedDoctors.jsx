import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({docId, speciality}) => {

const {doctors} = useContext(AppContext);
const navigate = useNavigate();

const [relDocs,setRelDocs] = useState([]);


useEffect(()=>{
if(doctors.length > 0 && speciality){
    const docsData = doctors.filter((doc) => doc._id !== docId && doc.speciality === speciality)
    setRelDocs(docsData);
}
},[doctors,docId,speciality])


    return (
      <div className="flex flex-col items-center gap-4 my-12 text-gray-900 md:mx-10">
        <h1 className="font-medium text-3xl">Top Doctors to Book</h1>
        <p className="sm:w-1/2 text-center tetx-xs">
          Simply browse through our extensive list of trusted doctors
        </p>
        <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
          {relDocs.slice(0, 5).map((item, index) => (
            <div
              onClick={() => {
                navigate(`/appointment/${item._id}`);
                scrollTo(0, 0);
              }}
              className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-2.5 transition-all duration-500"
              key={index}
            >
              <img className="bg-indigo-50" src={item.image} />
              <div className="p-4">
                <div className={`flex items-center text-sm gap-2  ${item.available ? 'text-green-500' : 'text-gray-500' }`}>
                <p className={`w-2 h-2 rounded-full ${item.available ? 'bg-green-500' : 'bg-gray-500'}`}></p>
                <p>{item.available ? 'Available' : 'Unavailable'}</p>
              </div>
                <p className="font-semibold text-gray-900 ">{item.name}</p>
                <p className="text-sm text-gray-700">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            navigate("/doctors");
            scrollTo(0, 0);
          }}
          className="flex items-center bg-indigo-100 rounded-full py-2 px-6 text-gray-600 mt-7 font-medium"
        >
          More
        </button>
      </div>
    );
}

export default RelatedDoctors;