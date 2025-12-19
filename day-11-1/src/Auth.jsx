export const isAuthenticted = () => {
    return localStorage.getItem("login") === "true"
};