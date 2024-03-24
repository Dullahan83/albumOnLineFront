import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from "../Context/AuthContext";
import Album from "../pages/Album";
import AutoLogin from "../pages/AutoLogin";
import Creation from "../pages/Creation";
import Home from "../pages/Home";
import ResetPassword from "../pages/ResetPassword";
import Upload from "../pages/Upload";
import Page404 from "./Errors/404";
import Unauthorized from "./Errors/Unauthorized";
import ProtectedRoutes from "./ProtectedRoutes";
const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/album/:albumId" element={<Album />} />
            <Route path="/upload" element={<Upload />} />
          </Route>
          <Route path="/creation" element={<Creation />} />
          <Route path="/autoLogin" element={<AutoLogin />} />
          <Route path="*" element={<Page404 />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/reset" element={<ResetPassword />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;
