import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
    return (
      <div className="md:mx-10">
        <div className="flex-col grid sm:grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-35 text-sm">
          <div id="left">
            <img className="mb-5 w-40" src={assets.logo} />
            <p className="w-full md:w-2/3 text-gray-700 leading-6">
              Prescripto is dedicated to simplifying your health. We connect you
              with trusted doctors and provide seamless access to your
              prescription needs. As your trusted
              digital pharmacy, we are committed to providing safe and affordable,
              access to your medications.
            </p>
          </div>

          <div id="center">
            <p className="text-xl mb-5 font-medium">COMPANY</p>
            <ul className="flex flex-col gap-2 text-gray-700">
              <li>Home</li>
              <li>About Us</li>
              <li>Delivery</li>
              <li>Privacy Policy</li>
            </ul>
          </div>

          <div id="right">
            <p className="text-xl font-medium mb-5">GET IN TOUCH</p>
            <ul className="flex flex-col gap-2 text-gray-700">
              <li>+91-100-029-086</li>
              <li>prescripto@medimail.com</li>
            </ul>
          </div>
        </div>

        <div>
          <hr />
          <p className="text-sm text-gray-600 text-center py-5">
            Copyright 2025 @PrescriptoLabs - All Right Reserved.
          </p>
        </div>
      </div>
    );
}

export default Footer;