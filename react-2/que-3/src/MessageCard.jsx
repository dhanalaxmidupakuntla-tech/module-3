import React from "react";

function MessageCard({ title, message }) {
  return (
    <div style={{
      border: "1px solid black",
      padding: "10px",
      margin: "10px",
      borderRadius: "8px",
      width: "250px"
    }}>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
}

export default MessageCard;
