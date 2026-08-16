import React from "react";
import EditProfile from "./EditProfile";
import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((state) => state.user.user);


  return (
    <div>
      <EditProfile user={user}></EditProfile>
    </div>
  );
};

export default Profile;
