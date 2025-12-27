import { useCallback, useState } from "react";
import Title from "./Title";
import Count from "./Count";
import Button from "./Button";

function ParentComponent(){

    const [age, setAge] = useState(22);
    const [salary, setSalary] = useState(80000);

    const onChangeAge = useCallback(() => {
        setAge(age + 1)
    }, [age])

    const onChangeSalary = useCallback(() => {  //reference equality
        setSalary(salary + 10000)
    },[salary])

    return(
        <div>
            <Title />
            <Count text="Age" count={age}  />
            <Button handleClick={onChangeAge}>Increment Age</Button> 
            <Count text="Salary" count={salary} />
            <Button handleClick={onChangeSalary}>Increment Salary</Button>            
        </div>
    )
}

export default ParentComponent;