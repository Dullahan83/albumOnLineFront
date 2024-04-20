import React from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import { cn } from "../Utils/func";
const Layout = ({
  children,
  withoutHeader = false,
}: {
  children: React.ReactNode;
  withoutHeader?: boolean;
}) => {
  const location = useLocation();
  const { pathname } = location;
  const pages = ["/", "/upload", "/creation", "/albumChoice"];
  return (
    <div
      className={cn(
        " bg-background dark:bg-background-dark text-textColor dark:text-textColor-dark transition-colors duration-100 relative z-0  min-h-screen",
        {
          "flex items-center justify-center": withoutHeader,
          "bg-no-repeat bg-cover bg-center bg-[url(/Error404.png)]":
            !pages.includes(pathname) && !pathname.includes("/album"),
          "bg-no-repeat bg-cover bg-center bg-[url(/UnauthorizedBackgroundDark.png)]  ":
            pathname === "/Unauthorized",
        }
      )}
    >
      <Helmet>
        <link rel="preconnect" href={import.meta.env.VITE_BACKEND_URL} />
        <link rel="preconnect" href={import.meta.env.VITE_BACKEND_IMAGES} />
      </Helmet>
      {!withoutHeader && <Header />}
      {children}
    </div>
  );
};

export default Layout;
