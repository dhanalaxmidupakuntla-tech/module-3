import React, { useState } from "react";

function Calculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState("Add");
  const [results, setResults] = useState([]);

  const performAction = () => {
    const n1 = Number(num1);
    const n2 = Number(num2);

    let resultValue = 0;

    if (operation === "Add") resultValue = n1 + n2;
    if (operation === "Subtract") resultValue = n1 - n2;
    if (operation === "Multiply") resultValue = n1 * n2;

    // Append new result to previous results
    setResults([...results, resultValue]);
  };

  return (
    <div>
      <h2>Basic Calculator</h2>

      <input
        type="number"
        placeholder="Enter first number"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
      />
      <br/>

      <input
        type="number"
        placeholder="Enter second number"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
      />
      <br/>

      <select
        value={operation}
        onChange={(e) => setOperation(e.target.value)}
      >
        <option value="Add">Add</option>
        <option value="Subtract">Subtract</option>
        <option value="Multiply">Multiply</option>
      </select>
      <br/>

      <button onClick={performAction}>Perform Action</button>
      <br/>

      <h3>Results:</h3>
      <ul>
        {results.map((res, index) => (
          <li key={index}>{res}</li>
        ))}
      </ul>
    </div>
  );
}

export default Calculator;
