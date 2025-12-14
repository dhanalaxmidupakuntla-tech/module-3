function TodoCard({ userId, title, completed }) {
  return (
    <div style={{ border: "1px solid #ccc", margin: "8px", padding: "8px" }}>
      <p><strong>User ID:</strong> {userId}</p>
      <p><strong>Title:</strong> {title}</p>
      <p><strong>Status:</strong> {completed ? "Completed" : "Pending"}</p>
    </div>
  );
}

export default TodoCard;
