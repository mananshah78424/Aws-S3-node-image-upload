import axios from "axios";
console.log("Process env is", process.env.NODE_ENV);
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://instas3verse.onrender.com"
    : "https://instas3verse.onrender.com";

export default axios.create({
  baseURL,
});
