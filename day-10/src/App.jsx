// import { useState } from "react";

// function App(){
//   const [page, setPage] = useState()
//
//   return (
//     <div>
//       <button onClick={() => setPage("home")}>Home</button>
//       <button onClick={() => setPage("about")}>About</button>
//       <button onClick={() => setPage("login")}>Login</button>

//       {page === "home" && <h2>Welcome to home page</h2>}
//       {page === "about" && <h2>Welcome to about page</h2>}
//       {page === "login" && <h2>Welcome to login page</h2>}
//     </div>
//   )
// }

// export default App;

//routing in react

import Home from "./Home";
import Contact from "./Contact";
import About from "./About";
import NotFound from './NotFound'
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/About" element={<About />}/>
      <Route path="/Contact" element={<Contact />}/>
      <Route path="*" element = {<NotFound />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App;