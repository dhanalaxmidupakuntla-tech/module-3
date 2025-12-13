//useEffect() --React Hook
// It Tells react Do some Code when Any of the following will happen

//functon can be callback anoynomus arrow 

// 1. useEffect(() = {}) // run after every re-render

//2.useEffect(() => {}, []) //runs only on mount //perfrom only once

//3. useEffect(() => {}, [value]) //Runs on Mount+ when values changes

//uses:
// Dom manipulation
//event listeners
//real time updates
//clen up when a component unmount
//fenthing /data from an API

import { useState, useEffect } from "react";

function MyComponent(){
    //const [count, setCount] = useState(0);

    //side effect
    
    //useEffect(() => {
        // if(count%2 == 0){
        //     document.title = `${count}`
        // }

        //document.title = `${count}`
    //})

//     useEffect(() => {
//         document.title = `Counter: ${count}`;
//     }, [count]);

//     return (
//         <div>
//             <h1>{count}</h1>
//             <button onClick={() => setCount(count+1)}>Counter</button>
//         </div>
//     )


    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        console.log("Timer Started")
        const timer = setInterval(() => {
            setSeconds(s => s+1)
        }, 1000);
        return () => {
            console.log("Timer Stopped");
            clearInterval(timer)
        }
    }, [])

    return <h1>{seconds}</h1>
}

export default MyComponent;