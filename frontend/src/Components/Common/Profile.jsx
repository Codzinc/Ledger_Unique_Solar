import React, { useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";

const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  role: "Administrator",
  avatar: "", // Optional avatar URL
};

const Profile = ({ open, onClose }) => {
  const sidebarRef = useRef(null);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  return (
    <>
      {/* Sidebar Panel */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[350px] bg-white shadow-xl z-[999] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-14 h-14 text-gray-400" />
            )}
            <div>
              <div className="font-bold text-lg text-gray-800">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
              <div className="text-xs text-gray-400 mt-1">{user.role}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-6 flex flex-col gap-6">
          <div>
            <div className="font-semibold text-gray-700 mb-1">About</div>
            <div className="text-gray-500 text-sm">
              This is a sample user profile panel. You can add more details
              here.
            </div>
          </div>
          <div>
            <div className="font-semibold text-gray-700 mb-1">Settings</div>
            <button className="mt-2 px-4 py-2 bg-[#d8f276] text-[#181829] rounded-lg font-semibold hover:bg-[#e6fa9c] transition">
              Edit Profile
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Profile;
