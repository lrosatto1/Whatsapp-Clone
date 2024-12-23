import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import { Toaster } from "sonner";
import Home from "./Components/Home";

import { useLocalStorage } from "@mantine/hooks";
import { SocketProvider } from "./utils/SocketProvider";
import ProtectedRoute from "./Components/auth/ProtectedRoute";

function App() {
  const [user] = useLocalStorage({
    key: "userData",
    defaultValue: {},
  });
  return (
    <div>
      <Toaster />
      <Suspense fallback={<h1>Loading</h1>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <SocketProvider>
                <ProtectedRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
