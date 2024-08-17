import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostFinder from "../baseApi";
import NewsBar from "../components/NewsBar";
import SideBar from "../components/SideBar";
export default function NewPost() {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState();
  const [imagePreview, setImagePreview] = useState();
  const token = sessionStorage.getItem("jwtToken");
  const [newsReady, setNewsReady] = useState(false);

  let navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);
    await PostFinder.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    navigate("/");
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex">
      <SideBar />
      <div className="mt-10 flex flex-col items-center w-full lg:w-3/5 p-4">
        {!newsReady ? (
          <div className="flex items-center justify-center w-full h-full">
            <div className="text-white">Loading NewsBar...</div>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="flex flex-col space-y-6 bg-white shadow-lg rounded-lg p-8 w-full max-w-lg"
          >
            <label
              htmlFor="uploadFile1"
              className="bg-white text-gray-500 font-semibold text-base rounded-lg h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto w-full relative"
            >
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 object-cover w-full h-full rounded-lg"
                />
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 mb-2 fill-gray-500"
                viewBox="0 0 32 32"
              >
                <path d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z" />
                <path d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z" />
              </svg>
              Upload file
              <input
                type="file"
                id="uploadFile1"
                className="hidden"
                accept="image/*"
                onChange={fileSelected}
              />
              <p className="text-xs font-medium text-gray-400 mt-2">
                Images are allowed!
              </p>
            </label>
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              type="text"
              placeholder="Caption"
              className="w-full border border-gray-300 rounded-lg py-2 px-4"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </form>
        )}
      </div>
      <NewsBar setReady={setNewsReady} />
    </div>
  );
}
