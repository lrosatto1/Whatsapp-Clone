import { useLocalStorage } from "@mantine/hooks";
import { Delete, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { toast } from "sonner";

const AddUser = ({ setOpenSearchUser }) => {
  const [user] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchUser, setSearchUser] = useState([]);

  const handleUser = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/searchUser`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ search }),
      });

      if (!res.ok) throw new Error("Error al buscar usuario");

      const data = await res.json();
      setLoading(false);

      // Filtrar el usuario actual del resultado
      const filteredUsers = data?.users?.filter((item) => item?._id !== user?._id);
      setSearchUser(filteredUsers);
    } catch (error) {
      toast.error(error.message || "Error al buscar usuario.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      handleUser();
    } else {
      setSearchUser([]); // Limpiar los resultados si no hay búsqueda
    }
  }, [search, user]);

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-slate-700 bg-opacity-80 p-4 z-10">
      <div className="w-full h-full max-w-md mx-auto bg-white rounded-lg shadow-lg p-4 md:max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-700 font-semibold text-lg">Buscar Usuario</h2>
          <button
            onClick={() => setOpenSearchUser(false)}
            className="text-gray-500 hover:text-black p-2"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center w-full border rounded-md border-gray-300 mb-4">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none px-4 py-2 rounded-md bg-white"
          />
          <div className="p-2">
            <Search size={20} className="text-gray-500" />
          </div>
        </div>

        <div className="mt-4 w-full overflow-y-auto rounded h-full max-h-[60vh]">
          {searchUser?.length ? (
            searchUser?.map((item, index) => (
              <Link
                to={"/" + item?._id}
                key={index}
                className="flex items-center gap-3 p-3 border border-transparent border-b-gray-200 hover:bg-gray-100"
              >
                <Avatar
                  name={item?.name}
                  userId={item?._id}
                  imageUrl={item?.profilePic}
                />
                <div className="text-ellipsis line-clamp-1">
                  <h3 className="text-gray-600 font-semibold text-sm">{item?.name}</h3>
                  <p className="text-gray-500 text-xs">{item?.email}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 text-center mt-4 p-2">No se encontró el usuario.</p>
          )}
        </div>
      </div>
      <div
        className="absolute top-5 text-2xl right-5 text-white cursor-pointer"
        onClick={() => setOpenSearchUser(false)}
      >
        <Delete size={30} />
      </div>
    </div>
  );
};

export default AddUser;
