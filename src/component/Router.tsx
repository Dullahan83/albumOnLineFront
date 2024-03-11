import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Album from "../pages/Album";
import Upload from "../pages/Upload";
import AutoLogin from "../pages/AutoLogin";
import ProtectedRoutes from "./ProtectedRoutes";
import Page404 from "./Errors/404";
import Unauthorized from "./Errors/Unauthorized";
import { AuthProvider } from "../Context/AuthContext";
const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/album" element={<Album />} />
            <Route path="/upload" element={<Upload />} />
          </Route>
          <Route path="/autoLogin" element={<AutoLogin />} />
          <Route path="*" element={<Page404 />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
