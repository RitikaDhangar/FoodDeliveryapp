import './App.css'
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Error from './components/Error';
import Home from './components/Home';
import NavSection from './components/nav/NavSection'
import { Routes, Route, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { isTokenExpired } from "./components/utils.js";
import ProtectedRoute from './components/ProtectedRoute.jsx'
import { useEffect } from 'react';
import History from './components/History.jsx';
import DeliveryStatus from './components/DeliveryStatus.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const token=localStorage.getItem('token');
  const navigate=useNavigate();
  useEffect(() => {
    if (!token) {
      return;
    }
    if (isTokenExpired(token)) {
      navigate("/login");
      localStorage.clear();
      toast.error('Session is expired. Please login again')
    }
  }, [token]);
  return (
    <>
     <Toaster position="top-right" reverseOrder={false} />
      <NavSection/>

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
           <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/delivery" element={<DeliveryStatus />} />            
            <Route path="/history" element={<History />} />
          </Route>
        <Route path="*" element={<Error />} />
      </Routes>
      <Footer/>
    </>
  )
}

export default App