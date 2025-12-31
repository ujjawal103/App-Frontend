import React, { useContext, useState } from 'react'
import { Link , useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loading from '../components/Loading'
import { AdminDataContext } from '../context/AdminContext'

const AdminSignup = () => {
    const [ firstName , setFirstName] = useState("");
    const [ lastName , setLastName] = useState("");
    const [ email , setEmail] = useState("");
    const [ password , setPassword] = useState("");
    const [ secretCode , setSecretCode] = useState("");
    const [error , setError] = useState("");
  
    const navigate = useNavigate();
    const {admin , setAdmin} = React.useContext(AdminDataContext);

    const [loading , setLoading] = useState(false);
    const [message , setMessage] = useState("");

   const submitHandler = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("Creating Admin...");

  try {
    const newAdmin = {
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
    };

    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}admin/register`,
      newAdmin
    );

    if (response.status === 201) {
      const data = response.data;
      setAdmin(data.admin);
      setLoading(false);
      setMessage("");
      setEmail("");
      setPassword("");
      setFirstName("");
      setLastName("");
      localStorage.setItem("token", data.token);
      navigate("/admin-dashboard");
      toast.success("Registration successful!");
    }
  } catch (error) {
     setLoading(false);
     setMessage("");
    if (error.response) {
      if (error.response.status === 409) {
        setError("Email already exists");
      } else {
        setError(error.response.data.message || "Signup failed fill correct details");
      }
    } else {
      setError("Network error. Please try again.");
    }
    
  }

  
};

    

  return (
  <>
   {loading && <Loading message={message} width='full'/>}
   <div className=' h-screen w-full flex items-start justify-center md:justify-between bg-gray-50'>
    <div className="hidden md:flex md:items-center md:justify-center md:w-full md:h-screen">
          <img src="/authBanner.png" alt="banner" className="object-cover w-full h-full"/>
    </div>
    <div className='w-full max-w-md min-h-screen p-5 pb-2 flex flex-col items-start justify-between'>
       <div className='w-full'>
          <form className='w-full' onSubmit={(e) => submitHandler(e)}>
          <img  className='w-20 rounded-2xl' src="/logo.png" alt="logo" />
          <h3 className='text-2xl mb-2 font-semibold'>Enter your Full name</h3>
          <div className='w-full flex gap-4'>
            <input 
              className='w-1/2 p-2 border border-gray-300 rounded  bg-[#eeeeee] mb-4 text-lg placeholder:text-base'
              type="text"
              placeholder='First name' 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onClick={() => setError("")}
              required 
          /> 
          <input 
              className='w-1/2 p-2 border border-gray-300 rounded  bg-[#eeeeee] mb-4 text-lg placeholder:text-base'
              type="text"
              placeholder='Last name' 
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onClick={() => setError("")}
              // required 
          /> 
          </div>
          <h3 className='text-2xl mb-2 font-semibold'>Enter your email</h3>
          <input 
              className='w-full p-2 border border-gray-300 rounded bg-[#eeeeee] mb-4 text-lg placeholder:text-base'
              type="email"
              placeholder='email@example.com' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onClick={() => setError("")}
              required 
          />
          <h3 className='text-2xl mb-2 font-semibold'>Enter Password</h3>
          <input 
              className='w-full p-2 border border-gray-300 rounded bg-[#eeeeee] mb-4 text-lg placeholder:text-base'
              type="password"
              placeholder='********' 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onClick={() => setError("")}
              required 
          /> 
          <input 
              className='w-full p-2 border border-gray-300 rounded bg-[#eeeeee] mb-4 text-lg placeholder:text-base'
              type="text"
              placeholder='Secret Code' 
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              onClick={() => setError("")}
              required 
          /> 
          {error && <p className='text-red-600 mb-4 text-sm'>{error}</p>}
          <button
          className='w-full p-2 rounded mb-4 bg-pink-600 text-white text-xl font-semibold'
          >
            Register
          </button>
          </form>
          <Link to={"/admin-login"} className='text-blue-600 hover:underline'>You are admin ? login</Link> 
       </div>
       <div className='w-full'>
        <Link
        to={"/store-signup"}
        className='w-full flex items-center justify-center p-3 rounded bg-[#111] text-white mb-2 mt-2 text-xl font-semibold'
        >
          SignUp as Restron
        </Link>
       </div>
    </div>
   </div>
  </>
  )
}

export default AdminSignup;
