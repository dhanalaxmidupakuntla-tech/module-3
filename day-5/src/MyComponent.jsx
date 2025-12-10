import React, {useState} from 'react';

function MyComponent(){
    const [name, setName] = useState("laxmi");
    const [age, setAge] = useState(0);
    const [isEmployed, setEmployed] = useState(false);
    const updateName = () => {
        setName("mini")
    }
    const increment = () => {
        setAge(age+1)
    }
    const toggleEmployee = () => {
        setEmployed(!isEmployed)
    }
    return (
        <div>
            Name:{name}
            <button onClick={updateName}>Set Name</button>
            Age: {age}            
            <button onClick = {increment}>incre</button>
            Is empolyed: {isEmployed?"yes":"no"}
            <button onClick={toggleEmployee}>toggle</button>
        </div>
    )
}

export default MyComponent;