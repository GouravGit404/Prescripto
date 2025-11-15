import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      about,
      experience,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !about ||
      !experience ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "ERROR. Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "ERROR. Please Enter A Valid Email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "ERROR. Please Enter A Strong Password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      about,
      experience,
      fees,
      address,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.status(200).json({
      success: true,
      message: "Doctor Added Successfully!",
    });
  } catch (error) {
    console.error("Error in addDoctor controller:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Please Enter Your Credentials",
      });
    }

    if ( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) 
    {
        const token = jwt.sign(email+password, process.env.JWT_SECRET)

        res.json({
            success:true,
            message : "LOGIN SUCCESSFULL. Token Generated",
            token
        })
    } 
    else {
      res.json({
        success: false,
        message: "Please Enter Valid Credentials",
      });
    }

  } 
  catch (error) {
    console.log("ERROR", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// API to get all doctors for admin panel 

const allDoctors = async (req,res)=> {

       try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({
          success:true,
          doctors
        })
  
           }  

catch (error) {
   console.log("ERROR", error);
   res.json({
     success: false,
     message: error.message,
   });
}
}


const appointmentsAdmin = async (req,res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({
      success : true,
      appointments,
    })
  } 
  catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}



const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

     slots_booked[slotDate] = slots_booked[slotDate].filter(
       (e) => e !== slotTime
     );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


const adminDashboard = async (req,res) => {
  try {
    
 const doctors = await doctorModel.find({});
 const users = await userModel.find({});
 const appointments = await appointmentModel.find({});

 const dashData = {
    doctors : doctors.length,
    appointments : appointments.length,
    patients : users.length,
    latestAppointments : appointments.reverse().slice(0,5),
 }

 res.json({
  success : true,
  dashData
 })

  } 
  catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}

export {
  addDoctor,
  adminLogin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  adminDashboard,
};
