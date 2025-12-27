import { useState } from "react";

function Loop(){
    const [bgColor, setBgColor] = useState("green")
    const [number, setNumber] = useState(0);

    function toggleColor() {
        setBgColor(bgColor === "green" ? "lightgreen" : "green");
    }

    function handleChange(e) {
        setNumber(Number(e.target.value))
    }

    let t = 0;
    for (let i=number; i < number +10; i++){
        t+=i;
        console.log(i)
    }

    return (
        <div style={{padding:"20px"}}>
            <div style={{backgroundColor:bgColor, padding:"20px", width:"220px", borderRadius:"10px"}}>
                <input type="number" placeholder="Enter the number" value={number} onChange={handleChange} />
            </div>
            <button onClick={toggleColor}>Toggle my Div Color</button>
            <p>Enter number : {number}</p>
            <p>Loop Result : {t}</p>
        </div>
    )
}

export default Loop;