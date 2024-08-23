import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostFinder from "../baseApi";
import SideBar from "../components/SideBar";

export default function NewPost() {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState("");
  const [mediaPreview, setMediaPreview] = useState();
  const [fileType, setFileType] = useState(""); // State for file type
  const [newsReady, setNewsReady] = useState(false);
  const [loading, setLoading] = useState(false); // State for loading screen

  const token = sessionStorage.getItem("jwtToken");
  const navigate = useNavigate();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true); // Show loader
    const formData = new FormData();
    formData.append("file", file); // Media file
    formData.append("caption", caption);
    formData.append("mediaType", fileType);

    try {
      await PostFinder.post("/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/");
    } catch (error) {
      console.error("Error submitting post", error);
    } finally {
      setLoading(false); // Hide loader
    }
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);

    if (file) {
      const fileType = file.type;
      if (fileType.startsWith("video/")) {
        setFileType("Video");
      } else if (fileType.startsWith("image/")) {
        setFileType("Image");
      } else if (fileType.startsWith("text/")) {
        setFileType("Text");
      } else {
        setFileType("Other");
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col min-h-screen dark-bg-color-screen">
      <div className="flex flex-grow">
        <SideBar />
        <div className="flex flex-col w-full lg:w-3/5 p-4 mx-auto mt-10">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader"></div>{" "}
              {/* Loader component or CSS spinner */}
              <p className="text-gray-600 ml-4">Submitting your post...</p>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="flex flex-col space-y-6 bg-white shadow-lg rounded-lg p-8 w-full max-w-lg mx-auto"
            >
              <label
                htmlFor="uploadFile1"
                className="bg-white text-gray-500 font-semibold text-base rounded-lg h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto w-full relative"
              >
                {mediaPreview && (
                  <>
                    {file?.type.startsWith("video/") ? (
                      <video
                        src={mediaPreview}
                        alt="Preview"
                        className="absolute inset-0 object-cover w-full h-full rounded-lg"
                        controls
                      />
                    ) : (
                      <img
                        src={mediaPreview}
                        alt="Preview"
                        className="absolute inset-0 object-cover w-full h-full rounded-lg"
                      />
                    )}
                  </>
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
                  accept="image/*,video/*" // Allow both images and videos
                  onChange={fileSelected}
                />
                <p className="text-xs font-medium text-gray-400 mt-2">
                  Images and videos are allowed!
                </p>
              </label>
              <input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                type="text"
                placeholder="Caption"
                className="w-full border border-gray-300 rounded-lg py-2 px-4"
              />
              {fileType && (
                <p className="text-sm text-gray-600 mt-2">
                  File type: {fileType}
                </p>
              )}
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
