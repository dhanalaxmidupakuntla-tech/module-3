import { useEffect } from "react";
import axiosInstance from "./Axios";

function FirebaseAxios() {

  useEffect(() => {
    const newStudent = {
      name: "ponchit",
      age: 22,
      major: "Computer",
    };

    axiosInstance
      .post("/student/OhQH3ap8Vo5xtfwU6-C.json", newStudent)
      .then((response) => {
        console.log("Data updated ✅", response.data);
      })
      .catch((error) => {
        console.log(error.message);
      });

  }, []); // ✅ dependency array goes here

  return (
    <h2>Firebase Axios PUT Example</h2>
  );
}

export default FirebaseAxios;
