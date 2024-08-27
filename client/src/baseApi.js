import axios from "axios";
console.log("Process env is", process.env.NODE_ENV);
const baseURL =
  process.env.NODE_ENV === "production"
    ? "https://instas3verse.onrender.com/api/posts"
    : "https://instas3verse.onrender.com/api/posts";

export default axios.create({
  baseURL,
});
