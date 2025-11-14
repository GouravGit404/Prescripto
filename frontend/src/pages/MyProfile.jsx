import React, { useState } from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";
import {assets} from '../assets/assets.js'
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {

const {userData,setUserData,backendUrl,token,loadUserProfileData} = useContext(AppContext);

const [isEdit,setIsEdit] = useState(false);
const [image,setImage] = useState(false);

const updateUserProfileData = async () => {
            try {
              const formData = new FormData();
              formData.append("name", userData.name)
              formData.append("phone", userData.phone)
              formData.append("dob", userData.dob)
              formData.append("gender", userData.gender)
              formData.append("address", JSON.stringify(userData.address));

              image && formData.append('image', image);

              const {data} = await axios.post(backendUrl + '/api/user/update-profile', formData, {headers:{token}})
              if(data.success){
                toast.success(data.message);
                await loadUserProfileData();
                setIsEdit(false);
                setImage(false);
              }
              else {
                toast.error(data.error);
              }
            } 
            catch (error) {
              console.log(error);
              toast.error(error.message);
            }
}

  return (
    userData && (
      <div className="max-w-lg flex flex-col text-sm gap-4 border border-gray-300 p-4 rounded-md m-auto">

        {isEdit ? 
          // Wrap these two elements in a Fragment
          <>
            <label htmlFor="image">
              <div className="inline-block relative cursor-pointer">
                <img className="w-36 rounded opacity-75" src={image ? URL.createObjectURL(image) : userData.image}/>
                <img className="w-10 absolute bottom-12 right-10" src={image ? "" : assets.upload_icon} />
              </div>
            </label>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </>
         : 
          <img className="w-40 rounded" src={userData.image} />
        
        }

        {/* <img className="w-40 rounded" src={userData.image} /> */}

        {isEdit ? (
          <input
            className="text-3xl mt-4 bg-gray-50 max-w-60"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="text-3xl mt-3 max-w-60 text-neutral-800">
            {userData.name}
          </p>
        )}

        <hr className="h-px border-none bg-zinc-300" />

        <div>
          <p className="text-neutral-600 underline mt-2">CONTACT INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] text-neutral-700 mt-3 gap-y-2.5">
            <p className="font-medium">Email : </p>
            <p className="text-blue-500">{userData.email}</p>

            <p className="font-medium">Phone : </p>
            {isEdit ? (
              <input
                className="bg-gray-50 max-w-52"
                type="text"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}

            <p className="font-medium">Address :</p>
            {isEdit ? (
              <p>
                <input
                  className="bg-gray-50 w-52"
                  type="text"
                  value={userData.address.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                />
                <br />
                <input
                  type="text"
                  className="bg-gray-50 mt-1 w-52"
                  value={userData.address.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                />
              </p>
            ) : (
              <p className="text-gray-500">
                {userData.address.line1}
                <br />
                {userData.address.line2}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-neutral-600 underline mt-3">BASIC INFORMATION</p>
          <div className="grid grid-cols-[1fr_3fr] text-neutral-700 mt-3 gap-y-2.5">
            <p>Gender :</p>
            {isEdit ? (
              <select
                className="text-neutral-700 bg-gray-50 max-w-52"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            ) : (
              <p className="text-gray-600">{userData.gender}</p>
            )}

            <p>Date Of Birth:</p>
            {isEdit ? (
              <input
                className="max-w-52 bg-gray-50 text-neutral-700"
                type="date"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-600">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-3">
          {isEdit ? (
            <button
              className="bg-primary text-white text-sm px-6 py-2 rounded-full font-light hover:scale-105 transition-all duration-300"
              onClick={updateUserProfileData}
            >
              Save Information
            </button>
          ) : (
            <button
              className="bg-primary text-white text-sm px-8 py-2 rounded-full font-light hover:scale-105 transition-all duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit Details
            </button>
          )}
        </div>
      </div>
    )
  );
};

export default MyProfile;