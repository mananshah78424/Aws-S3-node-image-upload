import axios from "axios";
console.log("Process env is", process.env.NODE_ENV);
const baseURL =
  process.env.NODE_ENV === "production"
    ? "/api/posts"
    : "http://localhost:3001/api/posts";

export default axios.create({
  baseURL,
});
