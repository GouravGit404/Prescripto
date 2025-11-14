# Prescripto 🩺

Prescripto is a full-stack (MERN) web application designed to streamline the doctor appointment booking process. It provides a seamless and intuitive interface for patients, doctors, and administrators.



---

## ✨ Key Features

* **Three User Roles:**
    * **Patient:** Can register, log in, browse doctors, book appointments, and manage their profile.
    * **Doctor:** Has a dedicated dashboard to view their appointments, manage their profile and availability, and track earnings.
    * **Admin:** Has a super-admin dashboard to view all platform-wide appointments, manage doctors, and view site statistics.
* **Dynamic Slot Booking:** A complete scheduling system where patients can select a date and an available time slot.
* **Payment Integration:** Securely process appointment fees using Razorpay (in test mode).
* **Profile Management:** Users (patients and doctors) can update their profile information, including uploading a new profile picture.
* **Dashboard & Stats:** Both admin and doctor dashboards display key statistics like total appointments, patient count, and earnings.
* **Image Uploads:** User and doctor images are handled and stored using Cloudinary.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, React Router, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT)
* **Payments:** Razorpay
* **File Storage:** Cloudinary

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v18 or later)
* MongoDB URI (from MongoDB Atlas)
* Cloudinary account (for API keys)
* Razorpay account (for test API keys)

### Installation

1.  **Clone the repo:**
    ```sh
    git clone [https://github.com/your-username/prescripto.git](https://github.com/your-username/prescripto.git)
    ```

2.  **Install Backend Dependencies:**
    ```sh
    cd prescripto/backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```sh
    cd ../frontend
    npm install
    ```

4.  **Set Up Environment Variables:**
    Create a `.env` file in the `backend` folder and add the following:
    ```env
    MONGODB_URI=your_mongodb_uri
    PORT=4000
    JWT_SECRET=your_jwt_secret_key
    RAZORPAY_KEY_ID=your_razorpay_key
    RAZORPAY_KEY_SECRET=your_razorpay_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CURRENCY='INR'
    ```
    Create a `.env` file in the `frontend` and in `admin` folder:
    ```env
    VITE_BACKEND_URL=http://localhost:4000
    VITE_RAZORPAY_KEY_ID='your_razorpay_key_id'
    ```

5.  **Run the Backend Server:**
    ```sh
    cd ../backend
    npm run server
    ```

6.  **Run the Frontend And Admin App:**
    ```sh
    cd ../frontend
    npm run dev
    ```