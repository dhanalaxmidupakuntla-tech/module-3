import { AppContext } from "./AppContext";
import Component2 from "./Component2";

function Component1() {
  const contextValues = {
    a: "Apple",
    b: "Ball",
    c: "Cat",
    d: "Dog",
    e: "Elephant",
    f: "Fish",
  };

  return (
    <AppContext.Provider value={contextValues}>
      <Component2 />
    </AppContext.Provider>
  );
}

export default Component1;
