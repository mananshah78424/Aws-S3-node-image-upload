import { MenuIcon } from "@heroicons/react/outline";
import React, { useState } from "react";
import { useUser } from "../helpers/userContext";
import LogoutButton from "./LogoutButton";
import SidebarIcon from "./SidebarIcon";

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const userFromContext = useUser().user;

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="lg:w-64 lg:shadow-lg lg:border sidebar-border-color mt-6">
      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center p-4">
        <button onClick={toggleMenu} aria-label="Menu">
          <MenuIcon className="w-8 h-8 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="break-words p-4">
        <div
          className="bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://media.licdn.com/dms/image/C5616AQGV97VWh8K8Gg/profile-displaybackgroundimage-shrink_200_800/0/1661537441140?e=1729123200&amp;v=beta&amp;t=fyCSVzPR8_4Flci8a2Ly-cg52YSYUvlUqQNsvRdmAQM')",
          }}
        ></div>

        <a href="/in/mananshah21/" id="ember195" className="block">
          <div>
            <img
              width="64"
              src="https://media.licdn.com/dms/image/v2/D5603AQF3tLWHqNjBiQ/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1719112794761?e=1729123200&amp;v=beta&amp;t=R_Z6KssY2tEgLLrrZGbon4qwn0mDUtFQezLkcgR-v-U"
              loading="lazy"
              height="64"
              alt="Photo of Manan Shah"
              className="rounded-full mx-auto"
            />
          </div>
          <div className="text-xl font-bold text-white mt-2 text-center">
            {userFromContext && userFromContext.name
              ? userFromContext.name
              : "User"}
          </div>
        </a>

        <p className="text-sm text-gray-700 mt-1 text-center">
          This is user here!
        </p>
      </div>

      {/* Padding container for the <hr> */}
      <div className="px-4">
        <hr className="sidebar-border-bottom-color my-4" />
      </div>

      <div className="pv3 p-4">
        <div className="entity-list-wrapper">
          <ul className="entity-list flex flex-wrap">
            <li className="entity-list-item w-full mb-2">
              <a href="/me/profile-views/" className="block w-full">
                <div className="flex items-baseline">
                  <div className="text-left">
                    <div className="text-s mr-2 text-gray-600">
                      <span>Total Number of posts</span>
                    </div>
                  </div>
                  <div className="text-s text-black flex-1 text-right">
                    <span className="feed-identity-widget-item__stat">
                      <strong>"Fill this"</strong>
                    </span>
                  </div>
                </div>
              </a>
            </li>
            <li className="entity-list-item w-full">
              <a href="/dashboard/" className="block w-full">
                <div className="flex items-baseline">
                  <div className="text-left">
                    <div className="text-s mr-2 text-gray-600">
                      <span>Total threads posted</span>
                    </div>
                  </div>
                  <div className="text-s text-black flex-1 text-right">
                    <span className="feed-identity-widget-item__stat">
                      <strong>"Fill here""</strong>
                    </span>
                  </div>
                </div>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Padding container for the <hr> */}
      <div className="px-4 mb-4">
        <hr className="sidebar-border-bottom-color" />
      </div>

      {/* Mobile Menu Items */}
      <div
        className={`lg:flex lg:flex-col lg:items-start ${
          isOpen ? "flex" : "hidden"
        } lg:block items-center lg:space-y-4 lg:space-y-0 lg:space-x-4`}
      >
        <div className=""></div>

        <a href="/" className="sidebar-option-tab">
          <SidebarIcon
            icon={
              <svg
                rpl=""
                fill="currentColor"
                height="20"
                icon-name="home-fill"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="m19.724 6.765-9.08-6.11A1.115 1.115 0 0 0 9.368.647L.276 6.765a.623.623 0 0 0 .35 1.141h.444v10.001c.001.278.113.544.31.74.196.195.462.304.739.303h5.16a.704.704 0 0 0 .706-.707v-4.507c0-.76 1.138-1.475 2.02-1.475.882 0 2.02.715 2.02 1.475v4.507a.71.71 0 0 0 .707.707h5.16c.274-.001.538-.112.732-.307.195-.195.305-.46.306-.736v-10h.445a.618.618 0 0 0 .598-.44.625.625 0 0 0-.25-.702Z"></path>{" "}
              </svg>
            }
            label="Home"
          />
        </a>

        <a href="/newPost" className="sidebar-option-tab">
          <SidebarIcon
            icon={
              <svg
                aria-label="New post"
                className="x1lliihq x1n2onr6 x5n08af"
                fill="currentColor"
                height="24"
                role="img"
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

        {userFromContext ? (
          <LogoutButton className="pb-4" />
        ) : (
          <>
            <a href="/login" className="sidebar-option-tab">
              <SidebarIcon
                icon={
                  <svg
                    aria-label="Explore"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height="24"
                    role="img"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <title>Explore</title>
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

            <a href="/register" className="sidebar-option-tab pb-4">
              <SidebarIcon
                icon={
                  <svg
                    aria-label="Register"
                    className="x1lliihq x1n2onr6 x5n08af"
                    fill="currentColor"
                    height="24"
                    role="img"
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
  );
};

export default SideBar;
