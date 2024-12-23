import { UserCircle } from "lucide-react";
import React, { useState } from "react";
import FormInput from "./FormInput";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLocalStorage } from "@mantine/hooks";

const Login = () => {

  const [, setUser] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });



  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        // Maneja errores HTTP explícitamente
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al iniciar sesión.");
      }

      const res = await response.json();

      if (res.success) {
       const data = {...res?.data?.user,token:res?.data?.token};
       setUser(data);
        toast.success(res?.message || "Inicio de sesión exitoso.");
        navigate("/"); // Redirigir a la página principal
      }
    } catch (error) {
      toast.error(error.message || "Error al iniciar sesión.");
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-md p-6">
        <div className="flex justify-center mb-6">
          <UserCircle size={80} className="text-gray-500" />
        </div>
        <h3 className="text-center text-2xl font-semibold text-gray-700 mb-4">
          Bienvenido
        </h3>
        <p className="text-center text-sm text-gray-500 mb-6">
          Inicia sesión para continuar
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Correo electrónico"
            name="email"
            type="email"
            value={loginData?.email}
            placeholder="Ingresa tu correo"
            onChange={handleChange}
            className="w-full"
          />
          <FormInput
            label="Contraseña"
            name="password"
            type="password"
            value={loginData?.password}
            placeholder="Ingresa tu contraseña"
            onChange={handleChange}
            className="w-full"
          />
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition"
          >
            Iniciar Sesión
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4 gap-2">
          ¿No tienes cuenta?{" "}
          <Link to="/register">
            <span className="text-green-500 font-semibold hover:underline cursor-pointer">
              Regístrate
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
