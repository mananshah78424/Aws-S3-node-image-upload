import { HeartIcon as HeartOutline } from "@heroicons/react/outline";

import { TrashIcon } from "@heroicons/react/solid";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import PostFinder from "../baseApi";
import { timeAgo } from "../helpers/newsFetch";
import { useUser } from "../helpers/userContext";
import CommentButton from "./CommentButton";
Modal.setAppElement("#root"); // Set the root element for accessibility

export default function SinglePost({
  className,
  post,
  likeClicked,
  commentClicked,
  editPostClicked,
  deletePostClicked,
  posts,
  setPosts,
}) {
  let navigate = useNavigate();

  const {
    id: postId,
    caption: postCaption,
    fileName: postImageUrl,
    totalComments: postTotalComments,
    totalLikes: postTotalLikes,
    created: postCreated,
    user: postUser,
    mediaType: postMediaType,
  } = post;
  const [time, setTime] = useState(timeAgo(postCreated));
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [postDetails, setPostDetails] = useState(post);
  const [likes, setLikes] = useState(0);
  const commentInputRef = useRef(null);
  const [loginError, SetLoginError] = useState("");
  const userFromContext = useUser().user;
  const token = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    async function fetchComments() {
      try {
        const result = await PostFinder.get(`/${postId}/comments`);

        setComments(result.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    fetchComments();
  }, [postId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(timeAgo(postCreated));
    }, 60000); // Update every 60 seconds

    return () => clearInterval(interval);
  }, [postCreated]);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentIconClick = (postId) => {
    commentClicked({ postId });

    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }
  };
  const updateLike = async (id, post) => {
    if (!userFromContext) {
      console.error("User not authenticated.");
      SetLoginError("Please login to like some posts!");
      return;
    }

    try {
      // Call the API to like the post
      await PostFinder.post(
        `/${postId}/like`,
        { post }, // No need to send any data in the body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state with the new like count
      setPostDetails((prevPost) => ({
        ...prevPost,
        totalLikes: prevPost.totalLikes + 1,
      }));

      // Optionally, refetch likes after submitting
      // const result = await PostFinder.get(`/`);
      // setPostDetails(result.data); // Update the post details with the latest data
    } catch (error) {
      console.error("Error liking the post:", error);
    }
  };
  useEffect(() => {
    if (loginError) {
      const timer = setTimeout(() => {
        SetLoginError("");
      }, 3000); // Remove error message after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [loginError]); // Effect depends on loginError state

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    if (comment.trim()) {
      try {
        await PostFinder.post(
          `/${postId}/comments`,
          {
            commentFromPic: comment,
            userFromContext,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // const res = await PostFinder.put(`/${postId}/incrementComments`);

        setComment("");
        navigate("/");

        setPostDetails((prevPost) => ({
          ...prevPost,
          totalComments: prevPost.totalComments + 1,
        }));

        const result = await PostFinder.get(`/${postId}/comments`);
        setComments(result.data);
      } catch (error) {
        console.error("Error at comment submit function: ", error);
      }
    }
  };

  const toggleComments = () => {
    setShowAllComments((prevState) => !prevState);
  };

  return (
    <div className={`${className}`}>
      {loginError && (
        <div
          className={`bg-red-500 text-white p-4 rounded-lg fixed mt-4 top-0 left-1/2 transform -translate-x-1/2 w-full max-w-lg z-50 alert-transition ${
            !loginError ? "alert-hidden" : ""
          }`}
        >
          {loginError}
        </div>
      )}

      {/* Post Header */}
      {/* <div className="flex items-center justify-between p-2 dark-bg-color-screen">
        <div className="flex items-center">
          <p className="ml-3 font-semibold text-gray-800 text-lg">username</p>
        </div>
      </div> */}
      <div className="flex pb-1 dark-bg-color-screen items-center">
        <div className="icon">
          {post.user.profilepic ? (
            <img
              src={`https://d3st0nkyboghj9.cloudfront.net/${post.user.profilepic}`}
              className="w-10 h-10 rounded-full mb-2"
            ></img>
          ) : (
            <img
              src="https://image.api.playstation.com/cdn/UP1063/BLUS31423_00/rmBPMz7gHm6Oc5YJlYVOvCptLqSTuOjf.png?w=440&thumb=false"
              className="w-10 h-10 rounded-full mb-2"
            ></img>
          )}
        </div>
        <div className="w-full ml-4">
          <div className="flex items-center text-white font-medium justify-between">
            <div className="flex items-center">
              <div className="flex flex-col">
                <span className="flex flex-row font-bold text-gray-900 dark:text-white items-center">
                  {postUser.name}
                  {/* {userFromContext && userFromContext.name ? (
                    <p className="user-name">{userFromContext.name}</p>
                  ) : (
                    <p className="user-name">User</p>
                  )} */}
                  <svg
                    aria-label="Verified"
                    fill="rgb(0, 149, 246)"
                    height="12"
                    role="img"
                    viewBox="0 0 40 40"
                    width="12"
                    className="ml-2"
                  >
                    <title>Verified</title>
                    <path
                      d="M19.998 3.094 14.638 0l-2.972 5.15H5.432v6.354L0 14.64 3.094 20 0 25.359l5.432 3.137v5.905h5.975L14.638 40l5.36-3.094L25.358 40l3.232-5.6h6.162v-6.01L40 25.359 36.905 20 40 14.641l-5.248-3.03v-6.46h-6.419L25.358 0l-5.36 3.094Zm7.415 11.225 2.254 2.287-11.43 11.5-6.835-6.93 2.244-2.258 4.587 4.581 9.18-9.18Z"
                      fillRule="evenodd"
                    ></path>
                  </svg>
                </span>
                <p className="text-gray-100 text-xs">{time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Image */}

      {postMediaType === "Image" ? (
        <img
          className="object-cover border rounded-[2px] border-gray-900 shadow-lg pb-2 post-image w-full"
          style={{
            height: "550px",
            borderBottom: "2px solid #1A202C", // Tailwind's text-gray-600 color
          }}
          src={postImageUrl}
          alt="Post"
        />
      ) : postMediaType === "Video" ? (
        <video
          className="object-cover border rounded-[2px] border-gray-900 shadow-lg pb-2 post-image w-full"
          style={{
            height: "550px",
            borderBottom: "2px solid #1A202C", // Tailwind's text-gray-600 color
          }}
          src={postImageUrl}
          alt="Post"
          controls // Ensure controls are enabled
        />
      ) : (
        <div>{postCaption}</div>
      )}

      {/* Post Content */}
      <div className="p-2 text-white">
        {/* Actions */}
        <div className="flex items-center space-x-5 mb-2">
          <HeartOutline
            className="h-7 w-7 text-gray-700 cursor-pointer hover:text-red-500"
            onClick={() => updateLike(postId, post)}
          />
          <CommentButton
            commentcount={postDetails.totalComments}
            onClick={() => handleCommentIconClick({ postId })}
          ></CommentButton>
          {/* <ChatIcon
            className="h-7 w-7 text-gray-700 cursor-pointer hover:text-gray-900"
            onClick={() => handleCommentIconClick({ postId })}
          /> */}
          {userFromContext &&
            (userFromContext.isAdmin || userFromContext.id === postUser.id) && (
              <div className="ml-auto flex-1 flex items-center justify-end">
                <TrashIcon
                  className="h-7 w-7 text-gray-700 cursor-pointer hover:text-gray-900"
                  onClick={() => deletePostClicked({ postId })}
                />
              </div>
            )}
        </div>
        <p className="font-medium text-base">
          {postDetails.totalLikes > 1
            ? `${postDetails.totalLikes} likes`
            : `${postDetails.totalLikes} like`}
        </p>

        {postCaption && postCaption !== "undefined" ? (
          <p className="mt-1  text-base">
            <span className="font-medium"></span> {postCaption}
          </p>
        ) : (
          <p className="mt-1  text-base">
            <span className="font-medium"></span>
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
          {postMediaType !== "text" && (
            <div className="w-3/4 pr-4">
              <img
                className="w-full h-[500px] object-cover rounded-lg"
                src={postImageUrl}
                alt="Post"
              />
            </div>
          )}

          {/* Comments on the right */}
          <div
            className={`flex flex-col pl-4 ${
              postMediaType !== "text" ? "w-1/2" : "w-full"
            }`}
          >
            {" "}
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
        </div>
      </Modal>

      {/* Comment Input */}
      {userFromContext && (
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
              ref={commentInputRef}
            />
            <button
              type="submit"
              className="text-blue-500 font-semibold text-base"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
