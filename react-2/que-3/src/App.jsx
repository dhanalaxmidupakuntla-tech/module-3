import MessageCard from "./MessageCard";

function App() {
  return (
    <div>
      <MessageCard
        title="Welcome"
        message="Hello! This is your first message card."
      />

      <MessageCard
        title="Reminder"
        message="Don't forget to complete your assignment."
      />

      <MessageCard
        title="Alert"
        message="Your session will expire in 5 minutes."
      />

      <MessageCard
        title="Success"
        message="Your profile has been updated successfully!"
      />
    </div>
  );
}

export default App;
