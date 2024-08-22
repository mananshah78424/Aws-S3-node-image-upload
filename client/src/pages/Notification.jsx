import React, { useEffect, useState } from "react";
import PostFinder from "../baseApi";
import SideBar from "../components/SideBar";
import { useUser } from "../helpers/userContext";

export default function Notification() {
  const token = sessionStorage.getItem("jwtToken");
  const userFromContext = useUser().user;
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (userFromContext && userFromContext.id) {
      async function getNotifications() {
        try {
          const result = await PostFinder.get(`/notifications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Filter notifications based on userIdToInform
          const filteredNotifications = result.data.filter(
            (notification) => notification.userIdToInform === userFromContext.id
          );

          // Set the filtered notifications in state
          setNotifications(filteredNotifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      }

      getNotifications();
    }
  }, [token, userFromContext]);

  return (
    <div className="flex flex-col flex-grow flex-shrink-0 container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row lg:space-x-4 text-white">
        <div className="w-full lg:w-1/4 lg:h-full lg:sticky lg:top-0">
          <SideBar />
        </div>
        <div className="flex-1 lg:ml-4 lg:pl-4 lg:py-6 p-4 overflow-y-auto">
          {/* Content area styling */}
          <div className="flex flex-col space-y-6">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={`post-${notification.id}`}
                  className="border-b border-gray-700 pb-4 mb-4"
                >
                  <div className="flex items-start space-x-4 items-center">
                    <div>
                      {userFromContext && userFromContext.profilepic ? (
                        <img
                          width="44"
                          src={`https://d3st0nkyboghj9.cloudfront.net/${userFromContext.profilepic}`}
                          loading="lazy"
                          height="44"
                          alt="Notification"
                          className="rounded-full"
                        />
                      ) : (
                        <img
                          width="44"
                          src="https://image.api.playstation.com/cdn/UP1063/BLUS31423_00/rmBPMz7gHm6Oc5YJlYVOvCptLqSTuOjf.png?w=440&amp;thumb=false"
                          loading="lazy"
                          height="44"
                          alt="Notification"
                          className="rounded-full"
                        />
                      )}
                    </div>
                    <p className="text-base">{notification.content}</p>
                    {notification.posturl ? (
                      <img
                        className="object-fill"
                        style={{ height: "60px", width: "60px" }}
                        src={`https://d3st0nkyboghj9.cloudfront.net/${notification.posturl}`}
                        alt="Notification Image"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No notifications available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
