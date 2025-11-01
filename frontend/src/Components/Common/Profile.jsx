import React, { useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "./Auth/AuthProvider";

const Profile = ({ open, onClose, onLogout }) => {
  const sidebarRef = useRef(null);
  const { user } = useAuth();
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
      <aside
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[350px] bg-white shadow-xl z-[999] transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="User avatar"
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <FaUserCircle className="w-14 h-14 text-gray-400" />
            )}
            <div>
              <div className="font-bold text-lg text-gray-800">
                {user?.first_name || user?.username || "User"}
              </div>
              <div className="text-sm text-gray-500">
                {user?.username || ""}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {user?.role || ""}
              </div>
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
          {/* Logout Button */}
          <div className="mt-auto">
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full px-4 py-2 bg-red-500 text-white cursor-pointer rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Profile;
