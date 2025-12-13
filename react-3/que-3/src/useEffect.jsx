//a) Component Lifecycle in React Functional Components


// When a component is rendered for the first time, it is called the mount phase.
// This is handled using:

// useEffect(() => {
//   // code runs once when component mounts
// }, []);

// When a component updates due to changes in state or props, it is called the update phase.
// This is handled using:

// useEffect(() => {
//   // code runs when dependency changes
// }, [dependency]);

// When a component is removed from the UI, it enters the unmount phase.
// This is handled using a cleanup function inside useEffect.
// useEffect(() => {
//   return () => {
//     // cleanup code runs when component unmounts
//   };
// }, []);


// b) What is a Cleanup Function? Why Is It Needed?

// A cleanup function is a function returned inside useEffect.
// It is used to clean up side effects such as:

// Removing event listeners
// Clearing timers or intervals
// Canceling API subscriptions

// Cleanup functions are needed to:
// Prevent memory leaks
// Stop unnecessary background tasks
// Keep the application efficient and bug-free

//Example

// useEffect(() => {
//   const timer = setInterval(() => {
//     console.log("Running...");
//   }, 1000);

//   return () => {
//     clearInterval(timer);
//   };
// }, []);
