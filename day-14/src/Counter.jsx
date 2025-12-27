import { useMemo, useState } from "react"

function Counter(){
    const [counterOne, setCounterOne] = useState(0);
    const [counterTwo, setCounterTwo] = useState(0);

    const incrementOne = () => {
        setCounterOne(counterOne+1)
    }

    const incrementTwo = () => {
        setCounterTwo(counterTwo+1)
    }

    const isEven = useMemo(() => {
        let i = 0
        while(i < 100000000000000000){
            i++;
        }
        return counterOne % 2 === 0
    }, [counterOne])

    return (
        <div>
            <div>
                <button onClick={incrementOne}>Counter One - {counterOne}</button>
                <span>{isEven ? "EVEN": "ODD"}</span>
            </div>
            <div>
                <button onClick={incrementTwo}>Counter Two - {counterTwo}</button>
            </div>
        </div>
    )
}

export default Counter