import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({
        success: false,
        message: "Credentials Missing",
      });
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Passoword must be of atleast 8 characters",
      });
    }

    const userExists = await userModel.findOne({ email: email });
    if (userExists) {
      return res.json({
        success: false,
        message: "Email already resgistered",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      message: "User Registered Successfully!",
      loginToken: token,
    });
  } catch (error) {
    console.error("Error in registerUser controller:", error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Credentials Missing",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "Email not registered",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({
        message: "Logged In",
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log("Error occured during login", error);
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.json({
        success: false,
        message: "Id not found",
      });
    }

    const userData = await userModel.findById(userId).select("-password");

    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


const updateProfile = async (req, res) => {
  try {
    const { userId, name, dob, address, gender, phone } = req.body;
    const imageFile = req.file;

    if (!name || !dob || !gender || !phone) {
      return res.json({
        success: false,
        message: "Data Missing",
      });
    }

    let updateData = {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    };

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      updateData.image = imageUpload.secure_url;
    }

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, {
        new: true,
      })
      .select("-password");

    if (!updatedUser) {
      return res.json({ success: false, message: "User not found" });
    }

    const newEmbeddedUserData = {
      _id: updatedUser._id,
      name: updatedUser.name,
      image: updatedUser.image,
      dob: updatedUser.dob,
      email: updatedUser.email,
      phone: updatedUser.phone,
      gender: updatedUser.gender,
    };

    await appointmentModel.updateMany(
      { userId: userId },
      { $set: { userData: newEmbeddedUserData } }
    );

    res.json({
      success: true,
      message: "Profile Updated",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};



const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");

    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor Not Available",
      });
    }

    let slots_booked = docData.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot Not Available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userData = await userModel.findById(userId).select("-password");

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotDate,
      slotTime,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment Booked",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const listAppointments = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized Action",
      });
    }

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
      message: "Appointments Cancelled",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

// Payment APIs

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled Or Not Found",
      });
    }

    const options = {
      amount: appointmentData.amount * 100,
      currency: process.env.currency,
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({
      success: true,
      message: "Order created successfully",
      order: order,
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};


const verifyRazorpay = async (req,res) => {
  try {
    const {razorpay_order_id} = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if(orderInfo.status === 'paid'){
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment : true});
      res.json({
        success : true,
        message : 'Payment Successful'
      })
    }
    else {
       res.json({
         success: false,
         message: "Payment Failed",
       });
    }
  } 
  catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
}

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointments,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
};
