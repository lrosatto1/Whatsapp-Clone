import React, { useEffect, useState } from "react";
import { GetSocket } from "../utils/SocketProvider";
import { EllipsisVertical, LogOut, MessageCircle, SquarePlus, UserPlus } from "lucide-react";
import Avatar from "./Avatar";
import { useLocalStorage } from "@mantine/hooks";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useLocalStorage({ key: "userData", defaultValue: {} });
  const socket = GetSocket();
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (socket) {
      socket.emit("sidebar", user?._id);
      socket.on("conversation", (data) => {
        const conversationUserData = data?.map((convUser) => ({
          ...convUser,
          userDetails: convUser?.sender?._id === convUser?.receiver?._id ? convUser?.receiver : convUser?.sender,
        }));
        setAllUsers(conversationUserData);
      });
    }
  }, [socket, user]);

  const handleLogout = () => {
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="flex w-full h-screen bg-[#FCFCFC]">
      {/* Sidebar de navegación */}
      <div className="w-[50px] h-full bg-[#F0F0F0] py-4 flex flex-col justify-between items-center shadow-lg">
        {/* Iconos superiores */}
        <div className="flex flex-col gap-4">
          <div className="w-10 h-10 flex justify-center items-center cursor-pointer text-[#B0B0B0] hover:text-black">
            <MessageCircle size={20} />
          </div>
          <div
            title="Add new contact"
            onClick={() => setOpenSearchUser(true)}
            className="w-10 h-10 flex justify-center items-center cursor-pointer text-[#B0B0B0] hover:text-black"
          >
            <UserPlus size={20} />
          </div>
        </div>

        {/* Avatar y Logout */}
        <div className="mt-auto mb-4 flex flex-col items-center gap-2">
          {/* Avatar del usuario logeado */}
          <Avatar imageUrl={user?.profilePicture} name={user?.name} userId={user?._id} />

          {/* Botón de Logout */}
          <button title="Logout" onClick={handleLogout} className="text-[#B0B0B0] hover:text-black">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Sidebar de chats */}
      <div className="w-[35%] bg-[#FAFAFA] h-full overflow-y-auto shadow-lg">
        <div className="flex flex-col p-4 bg-[#F5F5F5] rounded-lg shadow-md space-y-4 h-full">
          <div className="flex justify-between items-center text-[#666]">
            <h2 className="text-sm font-semibold">Chats</h2>
            <div className="flex gap-2 text-gray-400">
              <SquarePlus size={18} className="cursor-pointer" />
              <EllipsisVertical size={18} className="cursor-pointer" />
            </div>
          </div>
          <div className="space-y-2 overflow-y-auto">
            {allUsers?.map((conv) => (
              <Link
                to={`/chat/${conv?.userDetails?._id}`}
                key={conv?._id}
                className="flex items-center gap-2 border border-transparent hover:border-gray-300 rounded-lg p-2 cursor-pointer"
              >
                <Avatar imageUrl={conv?.userDetails?.profilePicture} name={conv?.userDetails?.name} />
                <div>
                  <h3 className="text-gray-600 font-semibold text-sm">{conv?.userDetails?.name}</h3>
                  <p className="text-gray-500 text-xs truncate">
                    {conv?.lastMsg?.imageUrl ? conv?.lastMsg?.name : conv?.lastMsg?.text}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;


