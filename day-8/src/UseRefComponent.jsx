import { useRef} from "react";

function UseRefComponent(){

    // const inputRef = useRef();
    // const inputRef1 = useRef();
    // const Handle = () => {
    //     inputRef.current.focus();
    //     inputRef1.current.focus();
    // }

    // return (
    //     <>
    //     <input ref={inputRef}></input>
    //     <button onClick={Handle}>Focus</button>
    //     <br/>
    //     <input ref={inputRef1}></input>
    //     <button onClick={Handle}>Focus</button>
    //     </>
    // )

    // const inputRef = useRef(null);
    // const inputRef1 = useRef(null);
    // const isFirst = useRef(true)
    // const Handle = () => {
    //     if (isFirst.current){
    //         inputRef.current.focus();
    //     }
    //     else{
    //         inputRef1.current.focus();
    //     }
    //     isFirst.current = !isFirst.current
    // }

    // return (
    //     <>
    //     <input ref={inputRef}></input><br /><br />
    //     <input ref={inputRef1}></input><br /><br />
    //     <button onClick={Handle}>Focus</button>
    //     </>
    // )

    // let c= 0;
    // const Handle = () => {
    //     c++;
    //     console.log("count:", c)
    // }

    // return(
    //     <div>
            
    //         <button onClick={Handle}>Click Me</button>
    //     </div>
    // )
    //presist the value store value it will not reset on re-rendering

    // const [text, setText] = useState("");

    // const c = useRef(0);
    // const handle = () => {
    //     c.current++;
    //     console.log("Ref", c)
    // }


    // return (
    //     <div>
    //         <input onChange={(e) => setText(e.target.value)} />
    //         <button onClick={handle}>click</button>
    //     </div>
    // )

    const c = useRef(0);
    const handle = () => {
        c.current++;
        console.log("Ref", c)
    }


    return (
        <div>
            <button onClick={handle}>click</button>
        </div>
    )
}

export default UseRefComponent;