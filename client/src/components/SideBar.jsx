import { MenuIcon } from "@heroicons/react/outline";
import React, { useEffect, useState } from "react";
import PostFinder from "../baseApi";
import { useUser } from "../helpers/userContext";
import LogoutButton from "./LogoutButton";
import SidebarIcon from "./SidebarIcon";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const token = sessionStorage.getItem("jwtToken");
  const [loading, setLoading] = useState(true); // Add loading state
  const [thoughts, setThoughts] = useState([]);
  const userFromContext = useUser().user;

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    async function fetchPosts() {
      try {
        if (userFromContext) {
          setLoading(true); // Set loading to true when fetching starts
          const result = await PostFinder.get(
            `/${userFromContext.id}/userposts`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPosts(result.data); // Ensure you access the data property
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    }

    async function fetchThoughts() {
      try {
        if (userFromContext) {
          const result = await PostFinder.get(
            `/${userFromContext.id}/userthoughts`,
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
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    }

    if (userFromContext && token) {
      fetchPosts();
      fetchThoughts();
    }
  }, [userFromContext, token]); // Include dependencies here

  return (
    <div className="lg:w-64 lg:shadow-lg lg:border sidebar-border-color lg:mt-6 lg:sticky lg:top-0 lg:h-screen">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center p-4">
        <button onClick={toggleMenu} aria-label="Menu">
          <MenuIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Sidebar Content */}
      <div
        className={`lg:block ${
          isOpen ? "block" : "hidden"
        } lg:flex lg:flex-col lg:space-y-4`}
      >
        <div className="p-4">
          {userFromContext && userFromContext.profilepic ? (
            <div
              className="bg-cover bg-center h-32"
              style={{
                backgroundImage: `url('https://d3st0nkyboghj9.cloudfront.net/${userFromContext.profilepic}')`,
              }}
            ></div>
          ) : userFromContext ? (
            <div
              className="bg-cover bg-center h-32"
              style={{
                backgroundImage: `url('https://image.api.playstation.com/cdn/UP1063/BLUS31423_00/rmBPMz7gHm6Oc5YJlYVOvCptLqSTuOjf.png?w=440&thumb=false')`,
              }}
            ></div>
          ) : (
            <></>
          )}
          {userFromContext && (
            <a href="/profile" id="ember195" className="block text-center mt-4">
              {userFromContext && userFromContext.profilepic ? (
                <img
                  width="64"
                  src={`https://d3st0nkyboghj9.cloudfront.net/${userFromContext.profilepic}`}
                  loading="lazy"
                  height="64"
                  alt="Profile"
                  className="rounded-full mx-auto"
                />
              ) : userFromContext ? (
                <img
                  width="64"
                  src={`https://image.api.playstation.com/cdn/UP1063/BLUS31423_00/rmBPMz7gHm6Oc5YJlYVOvCptLqSTuOjf.png?w=440&thumb=false`}
                  loading="lazy"
                  height="64"
                  alt="Profile"
                  className="rounded-full mx-auto"
                />
              ) : (
                <></>
              )}
              <div className="text-xl font-bold text-white mt-2">
                {userFromContext && userFromContext.name
                  ? userFromContext.name
                  : ""}
              </div>
              <p className="text-sm text-gray-700 mt-1">
                {userFromContext && userFromContext.bio
                  ? userFromContext.bio
                  : ""}
              </p>
            </a>
          )}
        </div>

        {userFromContext && (
          <div className="px-4">
            <hr className="my-4 border-gray-600" />
          </div>
        )}

        {userFromContext && (
          <div className="px-4">
            <ul className="space-y-4">
              <li>
                <a
                  href="/profile"
                  className="flex items-baseline justify-between"
                >
                  <span className="text-gray-600">Total Number of posts</span>
                  <span className="text-white">
                    {loading ? <strong>Loading...</strong> : posts.length}
                  </span>
                </a>
              </li>
              <li>
                <a href="/" className="flex items-baseline justify-between">
                  <span className="text-gray-600">Total threads posted</span>
                  <span className="text-white">
                    {loading ? <strong>Loading...</strong> : thoughts.length}
                  </span>
                </a>
              </li>
            </ul>
          </div>
        )}
        {userFromContext && (
          <div className="px-4 mt-4">
            <hr className="border-gray-600" />
          </div>
        )}

        {/* Menu Items */}
        <div className="px-4">
          <a
            href="/"
            className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-700 rounded-lg"
          >
            <SidebarIcon
              icon={
                <svg
                  fill="currentColor"
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="m19.724 6.765-9.08-6.11A1.115 1.115 0 0 0 9.368.647L.276 6.765a.623.623 0 0 0 .35 1.141h.444v10.001c.001.278.113.544.31.74.196.195.462.304.739.303h5.16a.704.704 0 0 0 .706-.707v-4.507c0-.76 1.138-1.475 2.02-1.475.882 0 2.02.715 2.02 1.475v4.507a.71.71 0 0 0 .707.707h5.16c.274-.001.538-.112.732-.307.195-.195.305-.46.306-.736v-10h.445a.618.618 0 0 0 .598-.44.625.625 0 0 0-.25-.702Z"></path>
                </svg>
              }
              label="Home"
            />
          </a>
          {userFromContext && (
            <a
              href="/newPost"
              className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-700 rounded-lg"
            >
              <SidebarIcon
                icon={
                  <svg
                    aria-label="New post"
                    fill="currentColor"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>New post</title>
                    <path
                      d="M2 12v3.45c0 2.849.698 4.005 1.606 4.944.94.909 2.098 1.608 4.946 1.608h6.896c2.848 0 4.006-.7 4.946-1.608C21.302 19.455 22 18.3 22 15.45V8.552c0-2.849-.698-4.006-1.606-4.945C19.454 2.7 18.296 2 15.448 2H8.552c-2.848 0-4.006.699-4.946 1.607C2.698 4.547 2 5.703 2 8.552Z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    ></path>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="6.545"
                      x2="17.455"
                      y1="12.001"
                      y2="12.001"
                    ></line>
                    <line
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      x1="12.003"
                      x2="12.003"
                      y1="6.545"
                      y2="17.455"
                    ></line>
                  </svg>
                }
                label="Upload"
              />
            </a>
          )}
          {userFromContext && (
            <a
              href="/notifications"
              className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-700 rounded-lg"
            >
              <SidebarIcon
                icon={
                  <svg
                    aria-label="Notifications"
                    fill="currentColor"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>Notifications</title>
                    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
                  </svg>
                }
                label="Notifications"
              />
            </a>
          )}
          {userFromContext && (
            <a
              href="/profile"
              className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-700 rounded-lg"
            >
              <SidebarIcon
                icon={
                  <svg
                    aria-label="Profile"
                    fill="currentColor"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>Profile</title>
                    <polygon
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      points="12 2 19 21 12 17 5 21 12 2"
                    ></polygon>
                  </svg>
                }
                label="Profile"
              />
            </a>
          )}
          {userFromContext ? (
            <div className="flex items-center py-2 px-4 hover:bg-gray-700 rounded-lg items-center justify-center">
              <LogoutButton />
            </div>
          ) : (
            <>
              <a
                href="/login"
                className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-700 rounded-lg"
              >
                <SidebarIcon
                  icon={
                    <svg
                      aria-label="Login"
                      fill="currentColor"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <title>Login</title>
                      <polygon
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        points="12 2 19 21 12 17 5 21 12 2"
                      ></polygon>
                    </svg>
                  }
                  label="Login"
                />
              </a>

              <a
                href="/register"
                className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-700 rounded-lg"
              >
                <SidebarIcon
                  icon={
                    <svg
                      aria-label="Register"
                      fill="currentColor"
                      height="24"
                      viewBox="0 0 24 24"
                      width="24"
                    >
                      <title>Register</title>
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM12 20c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
                      <path d="M13 7H11V11H7V13H11V17H13V13H17V11H13z"></path>
                    </svg>
                  }
                  label="Register"
                />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
