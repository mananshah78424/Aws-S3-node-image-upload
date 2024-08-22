import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import PostFinder from "../baseApi";
import { useUser } from "../helpers/userContext";

export default function ProfilePostCard({ post, onOpenModal }) {
  console.log("Post here at profile page is", post);
  console.log(post.mediaType);
  const userFromContext = useUser();
  const [showAllComments, setShowAllComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [postCaption, setPostCaption] = useState(post.caption);

  const token = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    if (showAllComments) {
      fetchComments();
    }
  }, [showAllComments]);

  const fetchComments = async () => {
    try {
      const result = await PostFinder.get(`/${post.id}/comments`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setComments(result.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const toggleComments = () => {
    setShowAllComments(!showAllComments);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await PostFinder.post(
        `/${post.id}/comments`,
        { content: comment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setComments([...comments, result.data]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const createdDate = new Date(date);
    const seconds = Math.floor((now - createdDate) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval > 1) {
        return `${interval} ${key}s ago`;
      }
    }
    return `${seconds} seconds ago`;
  };

  return (
    <div className="flex flex-col pb-0 pt-0 relative w-full">
      <div className="flex h-full w-full" style={{ height: "280px" }}>
        <button className="block w-full" onClick={toggleComments} role="link">
          <div className="relative h-full w-full">
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              {post.mediaType !== "text" && (
                <svg
                  aria-label="Carousel"
                  className="text-white"
                  fill="currentColor"
                  height="20"
                  role="img"
                  viewBox="0 0 48 48"
                  width="20"
                >
                  <title>Carousel</title>
                  <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
                </svg>
              )}
            </div>
            {post.mediaType === "Image" ? (
              <img
                alt={post.caption}
                className="object-cover w-full h-full"
                src={`https://d3st0nkyboghj9.cloudfront.net/${post.fileName}`}
                style={{ objectFit: "cover", lineHeight: "0" }}
              />
            ) : post.mediaType === "Video" ? (
              <video
                className="object-cover border rounded-[2px] border-gray-900 shadow-lg pb-2 post-image w-full"
                style={{
                  height: "550px",
                  borderBottom: "2px solid #1A202C", // Tailwind's text-gray-600 color
                }}
                src={`https://d3st0nkyboghj9.cloudfront.net/${post.fileName}`}
                alt="Post"
                controls // Ensure controls are enabled
              />
            ) : (
              <div className="border-b border-gray-700 pb-4 mb-4 text-white w-full">
                <div className="flex items-center justify-between">
                  <p className="lg:ml-4 ml-2">{postCaption}</p>
                  <p>{post.created}</p>
                </div>
              </div>
            )}
          </div>
        </button>
      </div>
      <Modal
        isOpen={showAllComments}
        onRequestClose={toggleComments}
        contentLabel="Comments"
        className="bg-white border border-gray-300 rounded-lg shadow-md max-w-4xl mx-auto my-20 p-4 flex relative"
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
            {post.mediaType === "Image" ? (
              <img
                alt={post.caption}
                className="w-full h-[500px] object-fill rounded-lg"
                src={`https://d3st0nkyboghj9.cloudfront.net/${post.fileName}`}
                style={{ objectFit: "cover", lineHeight: "0" }}
              />
            ) : post.mediaType === "Video" ? (
              <video
                className="object-cover border rounded-[2px] border-gray-900 shadow-lg pb-2 post-image w-full"
                style={{
                  height: "550px",
                  borderBottom: "2px solid #1A202C", // Tailwind's text-gray-600 color
                }}
                src={`https://d3st0nkyboghj9.cloudfront.net/${post.fileName}`}
                alt="Post"
                controls // Ensure controls are enabled
              />
            ) : (
              <div className="text-black bggray-700">{postCaption}</div>
            )}
            {/* <img
              className="w-full h-[500px] object-fill rounded-lg"
              src={`https://d3st0nkyboghj9.cloudfront.net/${post.fileName}`}
              alt="Post"
            /> */}
          </div>

          {/* Comments on the right */}
          {(post.mediaType === "Video" || post.mediaType === "Image") && (
            <div className="w-1/2 pl-4 flex flex-col">
              <h3 className="text-gray-700 font-semibold text-lg mb-3">
                {postCaption || ""}
              </h3>
              <div className="flex-1 overflow-y-auto max-h-[500px] space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex flex-col space-y-1">
                      <div className="flex flex-row items-center space-x-2">
                        <p className="text-gray-900 font-medium">
                          {comment.user.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {timeAgo(comment.createdAt)}
                        </p>
                      </div>

                      <p className="text-gray-700" style={{ fontSize: "15px" }}>
                        {comment.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-700">No comments yet.</p>
                )}
              </div>

              {/* Comment Input */}
              {userFromContext && (
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
              )}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
