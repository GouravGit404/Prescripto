import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-gray-600 text-2xl pt-11 font-medium">
        <p>CONTACT US</p>
      </div>

      <div className="flex flex-col md:flex-row gap-10 justify-center mb-28 text-sm my-10">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />

        <div className="flex flex-col gap-6 justify-center items-start mx-3">
          <p className="text-gray-700 font-semibold text-lg">OUR OFFICE</p>
          <p className="text-gray-500">
            11091 Green Field
            <br /> Suite 000, Bengaluru, Karnataka, India
          </p>
          <p className="text-gray-500">
            Tel: +91-100-029-086 <br /> Email: prescripto@medimail.com
          </p>
          <p className="text-gray-700 font-semibold text-lg">
            CAREERS AT PRESCRIPTO
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="text-xs text-gray-950 border font-serif border-gray-800 py-4 px-7 hover:bg-black hover:text-white transition-all duration-500">EXPLORE NOW</button>
        </div>
      </div>
    </div>
  );
};

export default Contact;