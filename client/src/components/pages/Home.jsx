import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import NewsBar from "../NewsBar";
import SinglePost from "../SinglePost";

export default function App() {
  const [posts, setPosts] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    async function getPosts() {
      try {
        const result = await axios.get("http://localhost:8080/api/posts");
        setPosts(result.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    getPosts();
  }, []);

  const likeClicked = async ({ id }) => {
    console.log(`likeClicked = (${id})`);
    // Add logic for liking a post here
  };
  const commentClicked = ({ id }) => {
    console.log(`commentClicked = (${id})`);
    // Add logic for commenting on a post here
  };
  const editPostClicked = ({ id }) => {
    // navigate("/editPost/" + id);
    console.log(`editPostClicked = (${id})`);
    // Add logic for editing a post here
  };
  const deletePostClicked = async ({ id }) => {
    console.log(`deletePostClicked = (${id})`);
    try {
      await axios.delete("http://localhost:8080/api/posts/" + id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };
  const postActions = {
    likeClicked,
    commentClicked,
    editPostClicked,
    deletePostClicked,
  };

  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 min-h-screen flex flex-col items-center w-full mt-6">
        <p className="text-white">
          Upload an image, and the image will be uploaded to AWS S3 bucket.
        </p>
        <div className="flex flex-col space-y-6 px-4 py-8">
          {posts.map((post) => (
            <div
              key={`post-${post.id}`}
              className="border-b border-gray-700 pb-4 mb-4"
            >
              <SinglePost className="relative" post={post} {...postActions} />
            </div>
          ))}
        </div>
      </div>

      <NewsBar />
    </div>
  );
}
