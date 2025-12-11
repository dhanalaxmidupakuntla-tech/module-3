import React from "react";
import UserInfo from "./UserInfo";

function UserProfile() {
  const userName = "Dhana Laxmi";
  const userAge = 22;

  return (
    <div>
      <h2>Parent Component: User Profile</h2>

      {/* Passing props to child */}
      <UserInfo name={userName} age={userAge} />
    </div>
  );
}

export default UserProfile;
