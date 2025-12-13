// How to style React Component with css

// 1. Global or External
// 2. Modulaes/ Modular //big apps 
// 3. Inline/Internal

import styles from "./StyleComponent.module.css"

function StyleComponent(){
    return (
        <button className={styles.button}>Click me</button>
    )
}

export default StyleComponent;