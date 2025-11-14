import React from "react";
import { assets } from "../../assets/assets";
import { useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {

const [docImg,setDocImg] = useState(false);
const [email,setEmail] = useState('');
const [name,setName] = useState('');
const [password,setPassword] = useState('');
const [experience,setExperience] = useState('1 Year');
const [about,setAbout] = useState('');
const [fees,setFees] = useState('');
const [speciality,setSpeciality] = useState('General Physician');
const [degree,setDegree] = useState('');
const [address1,setAddress1] = useState('');
const [address2,setAddress2] = useState('');

 const {admintoken,backendUrl} = useContext(AdminContext);

const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
        if(!docImg){
            return toast.error("Image Not Selected")
        }

        const formData = new FormData();
        formData.append('image',docImg)
        formData.append('name',name)
        formData.append('email',email)
        formData.append('password',password)
        formData.append('experience',experience)
        formData.append('about',about)
        formData.append('speciality',speciality)
        formData.append('degree',degree)
        formData.append('fees',Number(fees))
        formData.append('address',JSON.stringify({line1:address1,line2:address2}));

        const {data} = await axios.post(backendUrl + '/api/admin/add-doctor',formData, {headers:{admintoken}});

        if(data.success){
            toast.success(data.message);
            setDocImg(false);
            setName('');
            setEmail('');
            setPassword('');
            setAddress1('');
            setAddress2('');
            setDegree('');
            setAbout('');
            setFees('');
        }
        else {
            toast.error(data.message)
        }
        
    } 
    catch (error) {
        toast.error(error.message);
        console.error("Error adding doctor:", error);
    }

}



  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="bg-gray-100 w-20 cursor-pointer rounded-full"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 items-start text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="border rounded px-3 py-1.5"
                type="text"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-1.5"
                type="email"
                placeholder="Your Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Password"
                required
                className="border rounded px-3 py-1.5"
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-1.5"
                name=""
                id=""
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
                <option value="More Than 10 Years">More Than 10 Years</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                className="border rounded px-3 py-1.5"
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-3 py-1.5"
                name=""
                id=""
              >
                <option value="General Physician">General Physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Degree</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-1.5"
                type="text"
                placeholder="Degree"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-1.5"
                type="text"
                placeholder="Address 1"
                required
              />

              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-1.5"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border rounded px-4 pt-2 h-34 text-neutral-600"
            type="text"
            placeholder="Write About Doctor..."
            row={10}
            required
          />
        </div>

        <button type='submit' className="bg-primary text-white rounded-full py-3 px-10 mt-4">
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
