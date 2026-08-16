import React from "react";
import Navbar from "./Navbar";
import Fotter from "./Fotter";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, removeUser, setAuthChecked } from "../utils/userSlice";

const Body = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user?.user);
  const isAuthChecked = useSelector((state) => state.user?.isAuthChecked);

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (error) {
      dispatch(removeUser());
      dispatch(setAuthChecked(true));
      console.error("Auth check status:", error.response?.status || error.message);
    }
  };

  React.useEffect(() => {
    if (!userData && !isAuthChecked) {
      fetchUser();
    }
  }, [userData, isAuthChecked]);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Dynamic Background Ambient Blobs (Pink + Red + Blue) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Red / Rose Glow Orb */}
        <div className="absolute -top-40 -left-40 w-[30rem] h-[30rem] bg-rose-500/25 dark:bg-rose-600/15 rounded-full blur-3xl animate-pulse-glow" />
        {/* Pink Glow Orb */}
        <div className="absolute top-1/3 -right-40 w-[28rem] h-[28rem] bg-pink-500/25 dark:bg-pink-600/15 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
        {/* Blue / Electric Indigo Glow Orb */}
        <div className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] bg-blue-600/20 dark:bg-blue-600/18 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '4s' }} />
        
        {/* Subtle grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.04]" 
          style={{
            backgroundImage: `radial-gradient(currentColor 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 pb-28">
        <Outlet />
      </main>

      <Fotter />
    </div>
  );
};

export default Body;

