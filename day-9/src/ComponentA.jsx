import { useState, createContext} from "react";
import ComponentB from "./ComponentB";
export const userContext = createContext();

function ComponentA(){
    const [user, setUser] = useState("dhana");



    return (
        <div className="box">
            <h1>ComponentA</h1>
            <h1>{`hello welcome to ${user}`}</h1>
            {/* prop statement */}
            {/* <ComponentB user= {user} /> */}
            {/* without prop statement */}
            <userContext.Provider value={user}>
                <ComponentB />
            </userContext.Provider>
            
        </div>
    )
}

export default ComponentA;