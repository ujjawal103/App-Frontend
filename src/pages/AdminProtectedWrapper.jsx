import React, { useContext, useEffect, useState } from 'react';
import { AdminDataContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../components/Loading';

const AdminProtectedWrapper = ({ children }) => {

  const {admin , setAdmin} = useContext(AdminDataContext);
  const [isLoading , setIsLoading] = useState(true);


  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/admin-login");
    }



     axios.get(`${import.meta.env.VITE_BASE_URL}admin/profile`, {                 //validation part as it must be admin
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
    .then(response => {
      if (response.status === 200) {
        setAdmin(response.data.admin);
        setIsLoading(false);
      }
    })
    .catch(error => {
      localStorage.removeItem('token');
      navigate("/admin-login");
    });

  }, [token, navigate]);

  // Optional: prevent rendering children while redirecting
  if (!token) return null;



    if(isLoading){
      return <Loading message="Loading..." />;
    }



  return <>{children}</>;               //if its self user then return the children
};

export default AdminProtectedWrapper;