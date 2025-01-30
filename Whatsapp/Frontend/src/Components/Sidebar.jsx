import React, { useEffect, useState } from "react";
import { GetSocket } from "../utils/SocketProvider";
import { EllipsisVertical, LogOut, MessageCircle, SquarePlus, UserPlus } from "lucide-react";
import Avatar from "./Avatar";
import { useLocalStorage } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  const socket = GetSocket();
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit("sidebar", user?._id);

      socket.on("conversation", (data) => {
        const conversationUserData = data?.map((convUser) => {
          if (convUser?.sender?._id === convUser?.receiver?._id) {
            return {
              ...convUser,
              userDetails: convUser?.receiver,
            };
          } else {
            return {
              ...convUser,
              userDetails: convUser?.sender,
            };
          }
        });
        setAllUsers(conversationUserData);

        console.log(conversationUserData);
      });
    }
  }, [socket, user]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex w-full h-screen">
      {/* Sidebar de navegación */}
      <div className="w-[60px] h-full bg-[#111B21] py-4 flex flex-col justify-between items-center">
        {/* Iconos superiores */}
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 flex justify-center items-center cursor-pointer text-[#8696A0] hover:text-white">
            <MessageCircle size={24} />
          </div>
          <div
            title="Add new contact"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center cursor-pointer text-[#8696A0] hover:text-white"
          >
            <UserPlus size={24} />
          </div>
        </div>

        {/* Avatar y Logout */}
        <div className="mt-auto mb-2 flex flex-col items-center">
          <button>
            <Avatar
              imageUrl={user?.profilePicture}
              name={user?.name}
              userId={user?._id}
            />
          </button>
          <button title="Logout" onClick={handleLogout}>
            <span className="ml-2 text-slate-300 hover:text-slate-200">
              <LogOut size={20} />
            </span>
          </button>
        </div>
      </div>

      {/* Sidebar de chats */}
      <div className="w-[45%] bg-[#F5F5F5] h-full overflow-y-auto">
        <div className="flex flex-col p-4 bg-[#E0E0E0] rounded-lg shadow-lg space-y-4 h-full">
          <div className="flex justify-between items-center text-[#444444]">
            <h2 className="text-sm font-semibold">Chats</h2>
            <div className="flex gap-2 text-slate-300">
              <SquarePlus size={20} className="cursor-pointer" />
              <EllipsisVertical size={20} className="cursor-pointer" />
            </div>
          </div>

          <div className="space-y-2 overflow-y-auto">
            {allUsers?.length
              ? allUsers?.map((conv) => {
                  return (
                    <Link
                      to={`/chat/${conv?.userDetails?._id}`}
                      key={conv?._id}
                      className="flex items-center gap-2 border border-transparent hover:border-slate-400 rounded-lg p-2 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          imageUrl={conv?.userDetails?.profilePicture}
                          name={conv?.userDetails?.name}
                        />
                        <div>
                          <h3 className="text-gray-400 text-ellipsis line-clamp-1 font-semibold text-base">
                            {conv?.userDetails?.name}
                          </h3>
                          <div>
                            {conv?.lastMsg?.imageUrl && conv?.lastMsg?.name ? (
                              <p className="text-gray-400 text-ellipsis line-clamp-1">
                                {conv?.lastMsg?.name}
                              </p>
                            ) : (
                              <p className="text-gray-400 text-ellipsis line-clamp-1">
                                {conv?.lastMsg?.text}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
