import { HeartIcon as HeartOutline } from "@heroicons/react/outline";
import { ChatIcon, TrashIcon } from "@heroicons/react/solid";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

Modal.setAppElement("#root"); // Set the root element for accessibility

function timeAgo(date) {
  const now = new Date();
  const postDate = new Date(date);
  const seconds = Math.floor((now - postDate) / 1000);
  const interval = Math.floor(seconds / 31536000);

  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return `1 year ago`;

  const months = Math.floor(seconds / 2592000);
  if (months > 1) return `${months} months ago`;
  if (months === 1) return `1 month ago`;

  const days = Math.floor(seconds / 86400);
  if (days > 1) return `${days} days ago`;
  if (days === 1) return `1 day ago`;

  const hours = Math.floor(seconds / 3600);
  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return `1 hour ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes > 1) return `${minutes} minutes ago`;
  if (minutes === 1) return `1 minute ago`;

  return `just now`;
}

export default function SinglePost({
  className,
  post,
  likeClicked,
  commentClicked,
  deletePostClicked,
}) {
  let navigate = useNavigate();

  const { id, caption, imageUrl, totalComments, totalLikes, created } = post;
  const [time, setTime] = useState(timeAgo(created));
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [postDetails, setPostDetails] = useState(post);

  useEffect(() => {
    async function fetchComments() {
      try {
        const result = await axios.get(
          `http://localhost:8080/api/posts/${id}/comments`
        );
        setComments(result.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    fetchComments();
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(timeAgo(created));
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, [created]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (comment.trim()) {
      try {
        await axios.post(`http://localhost:8080/api/posts/${id}/comments`, {
          content: comment,
        });

        // Increment the totalComments count in the database
        await axios.put(
          `http://localhost:8080/api/posts/${id}/incrementComments`
        );

        setComment("");
        navigate("/"); // Redirect or update the state to reflect changes

        // Update the total comments count in the local state
        setPostDetails((prevPost) => ({
          ...prevPost,
          totalComments: prevPost.totalComments + 1,
        }));

        // Optionally, refetch comments after submitting
        const result = await axios.get(
          `http://localhost:8080/api/posts/${id}/comments`
        );
        setComments(result.data);
      } catch (error) {
        console.log("Error at comment submit function: ", error);
      }
    }
  };

  const toggleComments = () => {
    setShowAllComments((prevState) => !prevState);
  };

  return (
    <div className={`${className}`}>
      {/* Post Header */}
      {/* <div className="flex items-center justify-between p-2 dark-bg-color-screen">
        <div className="flex items-center">
          <p className="ml-3 font-semibold text-gray-800 text-lg">username</p>
        </div>
      </div> */}
      <div className="flex pb-1 dark-bg-color-screen">
        <div className="icon">
          <HeartOutline
            className="h-7 w-7 text-gray-700 cursor-pointer hover:text-red-500"
            onClick={() => likeClicked({ id })}
          />
        </div>
        <div class="w-full ml-4">
          <div class="flex items-center text-white font-medium">
            <div class="flex items-center">
              <div class="flex items-center">
                <span class="font-bold text-gray-900 dark:text-white">
                  User
                </span>
              </div>
              <div class="ml-2">
                <svg
                  aria-label="Verified"
                  fill="rgb(0, 149, 246)"
                  height="12"
                  role="img"
                  viewBox="0 0 40 40"
                  width="12"
                >
                  <title>Verified</title>
                  <path
                    d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                    fill-rule="evenodd"
                  ></path>
                </svg>
              </div>
            </div>
            <div class="flex items-center">
              <span class="mx-1">•</span>

              {time}
            </div>
          </div>
          <div class="text-white text-xs mb-2">California, USA</div>
        </div>
      </div>

      {/* Post Image */}
      <img
        className="object-contain border rounded-[2px] border-gray-900 shadow-lg pb-2 post-image"
        style={{
          width: "min(470px, 100vw)",
          height: "550px",
          borderBottom: "2px solid #1A202C", // Tailwind's text-gray-600 color
        }}
        src={imageUrl}
        alt="Post"
      />

      {/* Post Content */}
      <div className="p-2 text-white">
        {/* Actions */}
        <div className="flex items-center space-x-5 mb-2">
          <HeartOutline
            className="h-7 w-7 text-gray-700 cursor-pointer hover:text-red-500"
            onClick={() => likeClicked({ id })}
          />
          <ChatIcon
            className="h-7 w-7 text-gray-700 cursor-pointer hover:text-gray-900"
            onClick={() => commentClicked({ id })}
          />
          <div className="ml-auto flex-1 flex items-center justify-end">
            <TrashIcon
              className="h-7 w-7 text-gray-700 cursor-pointer hover:text-gray-900"
              onClick={() => deletePostClicked({ id })}
            />
          </div>
        </div>
        <p className="font-medium  text-base">{postDetails.totalLikes} likes</p>

        {caption && (
          <p className="mt-1  text-base">
            <span className="font-medium"></span> {caption}
          </p>
        )}

        {/* View All Comments Link */}
        {postDetails.totalComments > 0 && (
          <button
            className="mt-1 text-blue-500 text-sm"
            onClick={toggleComments}
          >
            {showAllComments
              ? "Hide comments"
              : `View all ${postDetails.totalComments} comments`}
          </button>
        )}
      </div>

      {/* Modal for Comments */}
      <Modal
        isOpen={showAllComments}
        onRequestClose={toggleComments}
        contentLabel="Comments"
        className="bg-white border border-gray-300 rounded-lg shadow-md max-w-4xl mx-auto my-20 p-4 flex"
      >
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-500"
          onClick={toggleComments}
        >
          Close
        </button>

        {/* Modal Content */}
        <div className="w-full flex flex-row">
          {/* Image on the left */}
          <div className="w-3/4 pr-4">
            <img
              className="w-full h-[500px] object-cover rounded-lg"
              src={post.imageUrl}
              alt="Post"
            />
          </div>

          {/* Comments on the right */}
          <div className="w-1/2 pl-4 flex flex-col">
            <h3 className="text-gray-700 font-semibold text-lg mb-3">
              {caption ? caption : ""}
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex flex-col space-y-1">
                  <p className="text-gray-900 font-medium">{comment.content}</p>
                  <p className="text-gray-500 text-sm">
                    {timeAgo(comment.createdAt)}
                  </p>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="flex flex-col border-t border-gray-300 mt-4 pt-4">
              <form
                onSubmit={handleCommentSubmit}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                  <input
                    type="text"
                    value={comment}
                    onChange={handleCommentChange}
                    className="w-full p-2 text-gray-800 border-none rounded-l-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add a comment"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Post
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>

      {/* Comment Input */}
      <div className="flex flex-col">
        <form
          onSubmit={handleCommentSubmit}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={comment}
            onChange={handleCommentChange}
            className="flex-grow p-2 text-white bg-transparent focus:outline-none focus:ring-0"
            placeholder="Add a comment..."
          />
          <button
            type="submit"
            className="text-blue-500 font-semibold text-base"
          >
            Post
          </button>
        </form>
      </div>
    </div>
  );
}
