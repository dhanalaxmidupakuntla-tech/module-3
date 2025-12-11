import React from "react";

function UserInfo({ name, age }) {
  return (
    <div style={{ border: "1px solid gray", padding: "10px", width: "250px" }}>
      <h3>User Information</h3>
      <p><b>Name:</b> {name}</p>
      <p><b>Age:</b> {age}</p>
    </div>
  );
}

export default UserInfo;
