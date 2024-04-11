import { BrowserRouter, Route, Routes } from "react-router-dom";

import React, { Suspense } from "react";
import { AuthProvider } from "../Context/AuthContext";
import { TimelineProvider } from "../Context/TimeLineContext";
import Home from "../pages/Home";
import ProtectedRoutes from "./ProtectedRoutes";
import PageSqueleton from "./SuspenseComponent/PageSqueleton";

const LazyAlbum = React.lazy(() => import("../pages/Album"));
// const LazyHome = React.lazy(() => import("../pages/Home"));
const LazyUpload = React.lazy(() => import("../pages/Upload"));
const LazyMissing = React.lazy(() => import("./Errors/404"));
const LazyUnauthorized = React.lazy(() => import("./Errors/Unauthorized"));
const LazyReset = React.lazy(() => import("../pages/ResetPassword"));
const LazyAutoLogin = React.lazy(() => import("../pages/AutoLogin"));
const LazyCreation = React.lazy(() => import("../pages/Creation"));

const Router = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<ProtectedRoutes />}>
            <Route
              path="/album/:albumId"
              element={
                <TimelineProvider>
                  <AlbumComponent />
                </TimelineProvider>
              }
            />
            <Route path="/upload" element={<UploadComponent />} />
          </Route>
          <Route path="/creation" element={<CreationComponent />} />
          <Route path="/autoLogin" element={<AutoLoginComponent />} />
          <Route path="*" element={<Error404Component />} />
          <Route path="/unauthorized" element={<UnauthorizedComponent />} />
          <Route path="/reset" element={<ResetPasswordComponent />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;

const AlbumComponent = () => {
  return (
    <Suspense fallback={<PageSqueleton page="Album" />}>
      <LazyAlbum />
    </Suspense>
  );
};

const UploadComponent = () => {
  return (
    <Suspense fallback={<PageSqueleton page="Upload" />}>
      <LazyUpload />
    </Suspense>
  );
};

// const HomeComponent = () => {
//   return (
//     <Suspense fallback={<PageSqueleton page="Accueil" />}>
//       <LazyHome />
//     </Suspense>
//   );
// };

const CreationComponent = () => {
  return (
    <Suspense fallback={<PageSqueleton />}>
      <LazyCreation />
    </Suspense>
  );
};

const AutoLoginComponent = () => {
  return (
    <Suspense fallback={<PageSqueleton />}>
      <LazyAutoLogin />
    </Suspense>
  );
};
const Error404Component = () => {
  return (
    <Suspense fallback={<PageSqueleton />}>
      <LazyMissing />
    </Suspense>
  );
};

const UnauthorizedComponent = () => {
  return (
    <Suspense fallback={<PageSqueleton />}>
      <LazyUnauthorized />
    </Suspense>
  );
};

const ResetPasswordComponent = () => {
  return (
    <Suspense>
      <LazyReset />
    </Suspense>
  );
};
