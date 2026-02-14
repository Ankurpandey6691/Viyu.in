import React, { useState, useEffect } from 'react';
import { FaFacebookF, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';


const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithFacebook, currentUser, configError } = useAuth();


  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';

    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}${endpoint}`,
        formData
      );

      // ✅ SIGNUP FLOW
      if (isSignUp) {

        toast.success("Account created successfully 🎉");

        // Signup ke baad login screen pe le jao
        setIsSignUp(false);

        // optional -> fields clear
        setFormData({
          name: '',
          email: '',
          password: ''
        });

        return;
      }

      // ✅ LOGIN FLOW
      localStorage.setItem("token", response.data.token);

      toast.success("Login Successful 🚀");

      // Smooth redirect after toast
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {

      if (err.response?.data?.message === "Invalid credentials") {
        toast.error("You are not registered ⚠️");
      }
      else if (err.response?.data?.message === "User already exists") {
        toast.error("User already exists 😅");
      }
      else {
        toast.error("Server error... try again");
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (token || currentUser) {
      navigate("/dashboard");
    }

  }, [currentUser, navigate]);


  const handleLogout = () => {

    // token delete
    localStorage.removeItem("token");

    // optional but recommended
    toast.success("Logged out successfully 👋");

    // redirect
    navigate("/auth");
  }


  return (
    <div className="flex flex-col items-center bg-black justify-center min-h-screen font-sans p-4 overflow-hidden">
      <Toaster position="top-center" />
      <Header />

      {/* Main Container - Size reduced from max-w-4xl to max-w-3xl and min-h reduced */}
      <div className="relative mt-8 overflow-hidden w-full max-w-3xl min-h-[480px] bg-white rounded-3xl shadow-2xl flex scale-95 md:scale-100 transition-all">

        {/* --- CONFIGURATION ERROR BANNER --- */}
        {configError && (
          <div className="absolute top-0 left-0 w-full bg-red-500 text-white p-4 z-[200] text-center text-sm font-bold shadow-md">
            ⚠️ {configError} <br />
            <span className="font-normal text-xs opacity-90">Open your project folder and add your API keys to the <code>frontend/.env</code> file.</span>
          </div>
        )}

        {/* --- SIGN UP FORM --- */}
        <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center p-6 transition-all duration-700 ease-in-out ${isSignUp ? "translate-x-full opacity-100 z-50" : "opacity-0 z-10"}`}>
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-[280px]">
            <h1 className="text-2xl font-bold mb-3 text-gray-800">Create Account</h1>
            <div className="flex space-x-3 mb-3">
              <button type="button" onClick={signInWithFacebook} className="p-2 rounded-full bg-[#1877F2] text-white hover:scale-110 transition-all shadow-sm"><FaFacebookF size={14} /></button>
              <button type="button" onClick={signInWithGoogle} className="p-2 rounded-full bg-white text-red-500 border hover:scale-110 transition-all shadow-sm"><FaGoogle size={14} /></button>
            </div>
            <input name="name" onChange={handleChange} type="text" placeholder="Full Name" required className="w-full p-2.5 mb-2 bg-gray-100 text-black rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all" />
            <input name="email" onChange={handleChange} type="email" placeholder="Email" required className="w-full p-2.5 mb-2 bg-gray-100 text-black rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400" />
            <div className="relative w-full">
              <input name="password" onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Password" required className="w-full p-2.5 mb-2 bg-gray-100 text-black rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400" />
              <span className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </span>
            </div>
            <button disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider text-xs hover:opacity-90 disabled:opacity-50 mt-2">
              {loading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>

        {/* --- SIGN IN FORM --- */}
        <div className={`absolute top-0 left-0 h-full w-1/2 flex flex-col items-center justify-center p-6 transition-all duration-700 ease-in-out z-20 ${isSignUp ? "translate-x-full opacity-0" : "opacity-100"}`}>
          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-[280px]">
            <h1 className="text-2xl font-bold mb-3 text-gray-800">Welcome Back</h1>
            <div className="flex space-x-3 mb-3">
              <button type="button" onClick={signInWithFacebook} className="p-2 rounded-full bg-[#1877F2] text-white hover:scale-110 transition-all shadow-sm"><FaFacebookF size={14} /></button>
              <button type="button" onClick={signInWithGoogle} className="p-2 rounded-full bg-white text-red-500 border hover:scale-110 transition-all shadow-sm"><FaGoogle size={14} /></button>
            </div>
            <input name="email" onChange={handleChange} type="email" placeholder="Email" required className="w-full p-2.5 mb-2 bg-gray-100 text-black rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400" />
            <div className="relative w-full">
              <input name="password" onChange={handleChange} type={showPassword ? "text" : "password"} placeholder="Password" required className="w-full p-2.5 mb-2 bg-gray-100 text-black rounded-lg text-sm outline-none focus:ring-2 focus:ring-orange-400" />
              <span className="absolute right-3 top-3 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
              </span>
            </div>
            <button disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-2.5 rounded-lg uppercase tracking-wider text-xs hover:opacity-90 disabled:opacity-50 mt-2">
              {loading ? "Checking..." : "Sign In"}
            </button>
            <p className="text-[10px] text-gray-400 mt-4 cursor-pointer hover:underline" onClick={handleLogout}>Logout Session</p>
          </form>
        </div>

        {/* --- OVERLAY --- */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${isSignUp ? "-translate-x-full" : ""}`}>
          <div className={`relative -left-full h-full w-[200%] text-white transform transition-transform duration-700 ease-in-out bg-gradient-to-br from-orange-500 via-pink-500 to-purple-600 ${isSignUp ? "translate-x-1/2" : "translate-x-0"}`}>
            <div className={`absolute top-0 flex flex-col items-center justify-center w-1/2 h-full px-8 text-center transition-transform duration-700 ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}`}>
              <h1 className="text-2xl font-bold mb-3">Already a member?</h1>
              <p className="mb-6 opacity-90 text-xs">Login with your account details.</p>
              <button onClick={() => setIsSignUp(false)} className="border-2 border-white px-8 py-1.5 rounded-full font-bold uppercase text-xs hover:bg-white hover:text-pink-600 transition-all">Sign In</button>
            </div>
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-8 text-center transition-transform duration-700 ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}`}>
              <h1 className="text-2xl font-bold mb-3">New here?</h1>
              <p className="mb-6 opacity-90 text-xs">Start your journey with us!</p>
              <button onClick={() => setIsSignUp(true)} className="border-2 border-white px-8 py-1.5 rounded-full font-bold uppercase text-xs hover:bg-white hover:text-pink-600 transition-all">Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;