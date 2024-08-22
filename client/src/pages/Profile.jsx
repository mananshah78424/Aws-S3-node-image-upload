import React, { useEffect, useState } from "react";
import PostFinder from "../baseApi";
import ProfilePostCard from "../components/ProfilePostCard";
import SideBar from "../components/SideBar";
import { useUser } from "../helpers/userContext";

export default function ProfilePage() {
  const userFromContext = useUser();
  const [posts, setPosts] = useState([]);
  const [thoughts, setThoughts] = useState([]);
  const [selectedTab, setSelectedTab] = useState("posts");
  const token = sessionStorage.getItem("jwtToken");

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (userFromContext?.user?.id) {
          const result = await PostFinder.get(
            `/${userFromContext.user.id}/userposts`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPosts(result.data);
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    async function fetchThoughts() {
      try {
        if (userFromContext?.user?.id) {
          const result = await PostFinder.get(
            `/${userFromContext.user.id}/userthoughts`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setThoughts(result.data);
        }
      } catch (error) {
        console.error("Error fetching thoughts:", error);
      }
    }

    // Fetch data based on the selected tab
    if (selectedTab === "posts") {
      fetchPosts();
    } else if (selectedTab === "thoughts") {
      fetchThoughts();
      console.log("No of thoughts ", thoughts);
    }
  }, [userFromContext?.user?.id, selectedTab]);
  return (
    <div className="flex flex-col flex-grow flex-shrink-0 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:space-x-4">
        {/* Sidebar */}
        <div className="w-full lg:w-1/4 lg:h-full lg:sticky lg:top-0">
          <SideBar />
        </div>
        <div className="flex-1 lg:ml-4 lg:pl-4 lg:py-6 p-4">
          <hr className="text-gray-700 my-4" />
          <div className="flex flex-col space-y-4 mb-6">
            <p className="text-gray-600">
              {userFromContext?.user ? userFromContext.user.bio : ""}
            </p>

            {/* Tabs */}
            <div className="flex flex-wrap gap-4 mb-4">
              <button
                onClick={() => setSelectedTab("posts")}
                className={`py-2 px-4 font-semibold ${
                  selectedTab === "posts"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-600"
                }`}
              >
                Posts
              </button>
              <button
                onClick={() => setSelectedTab("thoughts")}
                className={`py-2 px-4 font-semibold ${
                  selectedTab === "thoughts"
                    ? "border-b-2 border-blue-500 text-blue-500"
                    : "text-gray-600"
                }`}
              >
                Thoughts
              </button>
            </div>

            {/* Conditional Content Rendering */}
            <div>
              {selectedTab === "posts" ? (
                <>
                  <h2 className="text-2xl font-semibold mb-4">Posts</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.length ? (
                      posts.map((post) => (
                        <ProfilePostCard key={post.id} post={post} />
                      ))
                    ) : (
                      <p className="text-gray-500">No posts available.</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold mb-4">Thoughts</h2>
                  {thoughts.length ? (
                    thoughts.map((thought) => (
                      <ProfilePostCard key={thought.id} post={thought} />
                    ))
                  ) : (
                    <p className="text-gray-500">No thoughts available.</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
