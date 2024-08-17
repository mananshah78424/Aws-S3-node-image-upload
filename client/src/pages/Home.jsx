import { useEffect, useState } from "react";
import PostFinders from "../baseApi";
import NewsBar from "../components/NewsBar";
import ShareBox from "../components/ShareBox";
import SideBar from "../components/SideBar";
import SinglePost from "../components/SinglePost";
import { useUser } from "../helpers/userContext"; // Import the user context
export default function App() {
  const [posts, setPosts] = useState([]);
  const userFromContext = useUser().user;
  const [newsReady, setNewsReady] = useState(false);

  useEffect(() => {
    async function getPosts() {
      try {
        const result = await PostFinders.get("/");
        setPosts(result.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    getPosts();
  }, []);

  const likeClicked = async ({ id }) => {
    console.log(`likeClicked = (${id})`);
  };
  const commentClicked = ({ id }) => {
    console.log(`commentClicked = (${id})`);
  };
  const editPostClicked = ({ id }) => {
    console.log(`editPostClicked = (${id})`);
  };
  const deletePostClicked = async ({ postId }) => {
    console.log("Deletion for postId:", postId);
    const post = posts.find((post) => post.id === postId);

    // Check if the user is authorized to delete the post
    if (userFromContext.isAdmin || userFromContext.id === post.user.id) {
      try {
        await PostFinders.delete(`${postId}`);
        setPosts(posts.filter((post) => post.id !== postId));
        console.log(`Post ${postId} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    } else {
      console.error("You are not authorized to delete this post.");
    }
  };

  const postActions = {
    likeClicked,
    commentClicked,
    editPostClicked,
    deletePostClicked,
    posts,
    setPosts,
  };

  return (
    <div
      className="flex flex-col flex-grow flex-shrink-0 container"
      style={{ marginLeft: "20px", marginRight: "-20px" }}
    >
      <div className="flex flex-row items-start">
        <div className="w-1/4 h-full" tabindex="-1">
          <SideBar />
        </div>
        <div className="flex-1">
          {!newsReady ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="text-white">Loading NewsBar...</div>
            </div>
          ) : (
            <div className="flex flex-col space-y-6 px-4 py-8">
              <ShareBox></ShareBox>
              {posts.map((post) => (
                <div
                  key={`post-${post.id}`}
                  className="border-b border-gray-700 pb-4 mb-4"
                >
                  <SinglePost
                    className="relative"
                    post={post}
                    {...postActions}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-1/4 h-full">
          <NewsBar setReady={setNewsReady}></NewsBar>
        </div>
      </div>
    </div>
  );
}
