import Component2 from "./Component2";

function Component1(){
    const a = "api";
    const b = "boostrap";
    const c = "css";
    const d = "docker";
    const e = "es6";
    const f = "firebase"

    return (
        <div>
            <h3>Component 1</h3>
            <Component2 a= {a} b= {b} c={c} d = {d} e = {e} f = {f} />
        </div>
    )
}

export default Component1;