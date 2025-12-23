import { useReducer } from "react";
import "./styles.css";

const initialState = {
    step:1,
    isSubmited :false,
    formData : {
        name:"",
        email: "",
        username:"",
        password: ""
    }
}

function reducer(state, action){
    switch (action.type){
        case "UPDATE_FIELD" :
            return {
                ...state,
                formData : {
                    ...state.formData,
                    [action.filed] : action.value
                }
            }
        case "NEXT_STEP" :
            return {
                ...state, step: state.step + 1 
            };

        case "PREVIOUS_STEP":
            return {
                ...state, step: state.step - 1 
            };

        case "SUBMIT_FORM":
            return {
                ...state, isSubmited:true
            };

        case "RESET_FORM" :
            return initialState;

        default:
            return state;
    }
}

export default function RegistrationForm(){
    const [state, dispatch] = useReducer(reducer, initialState);
    const {step, formData, isSubmited} = state;

    if (isSubmited){
        return (
            <div>
                <h2>Form Submitted Successfully</h2>
                <button onClick={() => dispatch({type: "RESET_FORM"})}>
                    Reset Form
                </button>
            </div>
        );
    }

    return (
        <div className="form-container">
            <h3>Step {step} of 3</h3>
            { /* STEP */}
            {step === 1 && (
                <>
                <input placeholder="Name"
                    value={formData.name}
                    onChange={(e) => 
                        dispatch({
                            type : "UPDATE_FIELD",
                            filed: "name",
                            value: e.target.value
                        })
                    }
                />
                <input placeholder="Email"
                    value={formData.email}
                    onChange={(e) => 
                        dispatch({
                            type : "UPDATE_FIELD",
                            filed: "email",
                            value: e.target.value
                        })
                    }
                />
                <button
                    disabled= {!formData.name || !formData.email}
                    onClick={() => dispatch({type: "NEXT_STEP"})}
                >
                    Next
                </button>
                </>
            )}
            {/* STEP 2 */}
            {step === 2 && (
                <>
                <input
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) =>
                    dispatch({
                        type: "UPDATE_FIELD",
                        field: "username",
                        value: e.target.value
                    })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                    dispatch({
                        type: "UPDATE_FIELD",
                        field: "password",
                        value: e.target.value
                    })
                    }
                />

                <button onClick={() => dispatch({ type: "PREVIOUS_STEP" })}>
                    Back
                </button>
                <button
                    disabled={!formData.username || !formData.password}
                    onClick={() => dispatch({ type: "NEXT_STEP" })}
                >
                    Next
                </button>
                </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
                <>
                <h4>Review Details</h4>
                <p>Name: {formData.name}</p>
                <p>Email: {formData.email}</p>
                <p>Username: {formData.username}</p>

                <button onClick={() => dispatch({ type: "PREVIOUS_STEP" })}>
                    Back
                </button>
                <button onClick={() => dispatch({ type: "SUBMIT_FORM" })}>
                    Submit
                </button>
                </>
            )}
        </div>
    )
}