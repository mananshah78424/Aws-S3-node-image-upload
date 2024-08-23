import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostFinder from "../baseApi";
import SideBar from "../components/SideBar";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [file, setFile] = useState();
  const [mediaPreview, setMediaPreview] = useState();
  const [loading, setLoading] = useState(false); // State for loading screen

  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [newsReady, setNewsReady] = useState(false);

  const handleRegister = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("bio", bio);
    console.log(formData);
    try {
      setLoading(true);
      const response = await PostFinder.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      });
      if (response) {
        console.log("Register successfully logged in!");
        navigate("/login");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error("Register failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleRegister(email, password, name);
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
    console.log("File details are:", file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMediaPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen dark-bg-color-screen">
      <SideBar />
      <div className="container flex flex-col mx-auto bg-white rounded-lg pt-12 my-5">
        <div className="flex justify-center w-full h-full my-auto xl:gap-14 lg:justify-normal md:gap-5 draggable">
          <div className="flex items-center justify-center w-full lg:p-12">
            <div className="flex items-center xl:p-10 border border-gray-200">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="loader"></div>{" "}
                  {/* Loader component or CSS spinner */}
                  <p className="text-gray-600 ml-4">Registering user ...</p>
                </div>
              ) : (
                <form
                  className="flex flex-col w-full h-full pb-6 text-center bg-white rounded-3xl"
                  onSubmit={handleSubmit}
                >
                  <h3 className="mb-3 text-4xl font-extrabold text-dark-grey-900">
                    Register
                  </h3>
                  <p className="mb-4 text-grey-700">
                    Create an account by filling the details below
                  </p>
                  <label
                    htmlFor="name"
                    className="mb-2 text-sm text-start text-grey-900"
                  >
                    Name*
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="John Doe"
                    className="flex items-center w-full py-4 mb-7 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  <label
                    htmlFor="email"
                    className="mb-2 text-sm text-start text-grey-900"
                  >
                    Email*
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="mail@gmail.com"
                    className="flex items-center w-full py-4 mb-7 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  <label
                    htmlFor="password"
                    className="mb-2 text-sm text-start text-grey-900"
                  >
                    Password*
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter a password"
                    className="flex items-center w-full py-4 mb-5 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  <label
                    htmlFor="bio"
                    className="mb-2 text-sm text-start text-grey-900"
                  >
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself"
                    className="flex items-center w-full py-4 mb-5 text-sm font-medium outline-none focus:bg-grey-400 placeholder:text-grey-700 bg-grey-200 text-dark-grey-900 rounded-2xl"
                  />
                  <label
                    htmlFor="uploadFile1" // Associate this label with the input
                    className="mb-2 text-sm text-start text-grey-900 cursor-pointer" // Make the label clickable
                  >
                    Profile picture
                  </label>
                  <div className="flex flex-row items-center justify-start mb-4">
                    <span
                      onClick={() =>
                        document.getElementById("uploadFile1").click()
                      }
                      className="cursor-pointer text-blue-500 mr-4"
                    >
                      Upload picture
                    </span>
                    <input
                      type="file"
                      id="uploadFile1"
                      className="hidden" // Keep the file input hidden
                      accept="image/*" // Allow only image files
                      onChange={fileSelected}
                    />
                    {mediaPreview && (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="w-24 h-24 object-cover rounded-lg border border-gray-300"
                      />
                    )}
                  </div>

                  <div className="flex flex-row justify-center mb-8">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition duration-300"
                    >
                      Register
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed text-grey-900">
                    Already have an account?{" "}
                    <a href="/login" className="font-bold text-grey-700">
                      Sign In
                    </a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 my-5">
          <div className="w-full max-w-full sm:w-3/4 mx-auto text-center">
            <p className="text-sm text-slate-500 py-1">Made by Manan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
