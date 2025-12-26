import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  const token = localStorage.getItem("token");
      if(token){
      window.location.href = "/store-home";
      return null;
      }
  
  return (
    <div>
      <div className='h-screen flex justify-between w-full flex-col pt-5 bg-[url("/background.png")] bg-cover bg-center'>
        <img  className='w-30 ml-5' src="/FLYER.png" alt="" />
        <div className='bg-pink-200 py-5 px-5 '>
           <h2 className='text-3xl font-bold text-pink-500'>Get your restaurant digitally ! unlock your potential</h2>
          <div className='w-full flex gap-4'>
           <Link to={"/store-login"} className='flex items-center justify-center bg-pink-600  w-full text-white py-4 px-4 rounded mt-4'>Continue</Link>                         
          </div>
          </div>
      </div>
    </div>
  )
}

export default Start
