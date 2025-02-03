import { UserCircle } from "lucide-react";
import React, { useState } from "react";
import FormInput from "./FormInput";
import { Link, useNavigate } from "react-router-dom";
import RemoveIcon from "../assets/img/text-document-remove-icon.png";
import UploadIcon from "../assets/img/UploadIcon.png";
import uploadFile from "../utils/uploadFile"; 
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    profilePicture: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadImage = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file)); 
      setFileName(file.name); 
      try {
        const uploadResponse = await uploadFile(file);
        if (uploadResponse?.url) {
          setRegisterData((prev) => ({
            ...prev,
            profilePicture: uploadResponse.url,
          }));
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error);
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null); 
    setFileName(""); 
    setRegisterData((prev) => ({ ...prev, profilePicture: "" }));
    document.getElementById("profilePicture").value = ""; 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const res = await response.json();

      if (res.success) {
        toast.success(res?.message);
        navigate("/login");
      }
    } catch (error) {
      toast.error(error?.message || "Error al registrar el usuario.");
      console.error("Error al registrar el usuario:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white-opacity-20 p-4">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          {previewImage ? (
            <img
              src={previewImage}
              alt="Vista previa"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <UserCircle size={80} className="text-gray-500" />
          )}
        </div>
        <h3 className="text-center text-2xl font-semibold text-gray-700 mb-4">
          Crear una cuenta
        </h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          Regístrate para comenzar
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nombre"
            name="name"
            type="text"
            value={registerData?.name}
            placeholder="Ingresa tu nombre"
            onChange={handleChange}
            className="w-full"
          />
          <FormInput
            label="Correo electrónico"
            name="email"
            type="email"
            value={registerData?.email}
            placeholder="Ingresa tu correo"
            onChange={handleChange}
            className="w-full"
          />
          <FormInput
            label="Contraseña"
            name="password"
            type="password"
            value={registerData?.password}
            placeholder="Crea una contraseña"
            onChange={handleChange}
            className="w-full"
          />
          <div>
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-gray-700"
            >
              Foto de Perfil
            </label>
            <div className="flex items-center bg-slate-100 border rounded-md px-3 py-2 mt-2 justify-between">
              <button
                type="button"
                onClick={() => document.getElementById("profilePicture").click()}
                className="text-gray-500 hover:text-gray-600 mx-auto"
              >
                <img
                  src={UploadIcon}
                  alt="Subir"
                  className="w-8 h-8 object-contain"
                />
              </button>
              {previewImage && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="text-gray-500 hover:text-gray-600 mx-auto"
                >
                  <img
                    src={RemoveIcon}
                    alt="Eliminar"
                    className="w-6 h-6 object-contain"
                  />
                </button>
              )}
            </div>
            {fileName && (
              <p className="text-xs text-gray-500 mt-1 truncate">
                Archivo: {fileName}
              </p>
            )}
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              className="hidden"
              onChange={handleUploadImage}
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login">
            <span className="text-green-500 font-medium hover:underline">
              Inicia sesión
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
