import Auth from "./Auth/Auth";
import Nav from "./Nav";
import ThemeSwitcher from "./ThemeSwitcher";

const Header = () => {
  return (
    <div className="flex items-center justify-between px-8 py-4  border-b border-b-border dark:border-b-border-dark sticky top-0 left-0 bg-inherit z-50">
      <ThemeSwitcher />
      <Nav />
      <Auth />
    </div>
  );
};

export default Header;
