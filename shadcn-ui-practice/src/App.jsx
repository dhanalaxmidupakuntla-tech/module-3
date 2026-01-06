import FeedbackForm from "./components/FeedbackForm";
import ImageSlideshow from "./components/ImageSlideshow";
import TodoApp from "./components/TodoApp";

function App() {
  return (
    <div className="p-6 space-y-10 max-w-4xl mx-auto">
      <FeedbackForm />
      <ImageSlideshow />
      <TodoApp />
    </div>
  );
}

export default App;
