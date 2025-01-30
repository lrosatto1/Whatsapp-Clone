import { useLocalStorage } from "@mantine/hooks";
import { UserCircle } from "lucide-react";
import React from "react";

const Avatar = ({ userId, name, imageUrl }) => {
  const [onlineUser] = useLocalStorage({
    key: "onlineUser",
    defaultValue: [],
  });

  let avatarName = "";
  if (name) {
    const splitName = name.split(" ");
    if (splitName.length > 1) {
      avatarName = `${splitName[0][0]}${splitName[1][0]}`;
    } else if (splitName[0]) {
      avatarName = splitName[0][0];
    }
  }

  const bgColor = [
    "bg-green-500",
    "bg-green-600",
    "bg-green-700",
    "bg-emerald-500",
    "bg-emerald-600",
  ];

  const randomNumber = Math.floor(Math.random() * bgColor.length);
  const onlineStatus = onlineUser.includes(userId);

  return (
    <div className="flex flex-col items-center justify-end">
      <div className="relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            width={48}
            height={48}
            alt={name}
            className="overflow-hidden rounded-full border-2 border-white"
          />
        ) : name ? (
          <div
            className={`w-12 h-12 rounded-full flex justify-center items-center text-white text-lg font-semibold ${bgColor[randomNumber]}`}
          >
            {avatarName}
          </div>
        ) : (
          <UserCircle size={48} className="text-gray-400" />
        )}

        {onlineStatus && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        )}
      </div>
      <span className="text-white text-sm mt-2">{name}</span>
    </div>
  );
};

export default Avatar;
