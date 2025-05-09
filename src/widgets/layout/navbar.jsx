// navbar.jsx
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Navbar as MTNavbar,
  MobileNav,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserIcon } from "@heroicons/react/24/solid";
// Import default routes and adminRoutes from routes.jsx
import routesDefault, { adminRoutes } from "@/routes";

export function Navbar({ brandName, routes, textColor }) {
  const [openNav, setOpenNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 960);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      setIsLoggedIn(true);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 960);
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Choose routes based on the user role stored in localStorage.
  // If no routes prop is passed, fallback to the default routes.
  const baseRoutes = routes || routesDefault;
  const userRole = localStorage.getItem("userRole");
  const activeRoutes = userRole === "admin" ? adminRoutes : baseRoutes;

  // Handler for the "Post offer" item.
  const handlePostOfferClick = () => {
    const token = Cookies.get("token");
    navigate(token ? "/postForm" : "/sign-in");
    if (isMobile) setOpenNav(false);
  };

  // Logout handler.
  const handleLogout = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    navigate("/");
    if (isMobile) setOpenNav(false);
  };

  // Close mobile menu when a nav link is clicked.
  const handleNavLinkClick = () => {
    if (isMobile) setOpenNav(false);
  };

  const navItemColor = isMobile ? "white" : textColor;

  const navList = (
    <ul className="mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {activeRoutes
        .filter((route) => {
          if (route.hidden) return false;
          // Show "Post offer" only on home page if needed.
          if (
            route.name === "Post offer" &&
            !(location.pathname === "/" || location.pathname === "/home")
          ) {
            return false;
          }
          return true;
        })
        .map(({ name, path, icon, href, target }) =>
          name === "Post offer" ? (
            <li key={name}>
              <div
                onClick={handlePostOfferClick}
                className="cursor-pointer text-green-500 text-xl font-extrabold capitalize p-1"
              >
                {name}
              </div>
            </li>
          ) : href ? (
            <li key={name}>
              <Typography
                as="span"
                variant="small"
                color="inherit"
                className="capitalize"
                style={{ color: navItemColor }}
              >
                <a
                  href={href}
                  target={target}
                  className="flex items-center gap-1 p-1 font-bold"
                  style={{ color: navItemColor }}
                  onClick={handleNavLinkClick}
                >
                  {icon &&
                    React.createElement(icon, {
                      className: "w-[18px] h-[18px] opacity-75 mr-1",
                      style: { color: navItemColor },
                    })}
                  {name}
                </a>
              </Typography>
            </li>
          ) : (
            <li key={name}>
              <Typography
                as="span"
                variant="small"
                color="inherit"
                className="capitalize"
                style={{ color: navItemColor }}
              >
                <Link
                  to={path}
                  target={target}
                  className="flex items-center gap-1 p-1 font-bold"
                  style={{ color: navItemColor }}
                  onClick={handleNavLinkClick}
                >
                  {icon &&
                    React.createElement(icon, {
                      className: "w-[18px] h-[18px] opacity-75 mr-1",
                      style: { color: navItemColor },
                    })}
                  {name}
                </Link>
              </Typography>
            </li>
          )
        )}
    </ul>
  );

  return (
    <MTNavbar color="transparent">
      <div className="container mx-auto flex items-center justify-between" style={{ color: textColor }}>
        <Link to="/">
          <Typography className="mr-4 ml-2 cursor-pointer py-1.5 font-bold" style={{ color: textColor }}>
            {brandName}
          </Typography>
        </Link>
        <div className="hidden lg:block">{navList}</div>
        <div className="hidden gap-2 lg:flex items-center">
          <Menu>
            <MenuHandler>
              <Button variant="text" size="sm" style={{ color: textColor }} fullWidth>
                Language
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={() => console.log("Language selected: ENG")}>ENG</MenuItem>
              <MenuItem onClick={() => console.log("Language selected: አማ")}>አማ</MenuItem>
            </MenuList>
          </Menu>
          {isLoggedIn ? (
            <Menu>
              <MenuHandler>
                <IconButton variant="text">
                  <UserIcon className="w-8 h-6" style={{ color: textColor }} />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleNavLinkClick();
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Link to="/sign-in" onClick={handleNavLinkClick}>
              <Button variant="gradient" size="sm" fullWidth color="green" className="whitespace-nowrap">
                Sign in
              </Button>
            </Link>
          )}
        </div>
        <IconButton
          variant="text"
          size="sm"
          className="ml-auto text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          onClick={() => setOpenNav(!openNav)}
          style={{ color: textColor }}
        >
          {openNav ? <XMarkIcon strokeWidth={2} className="h-6 w-6" /> : <Bars3Icon strokeWidth={2} className="h-6 w-6" />}
        </IconButton>
      </div>
      <MobileNav className="rounded-xl bg-black opacity-50 px-4 pt-2 pb-4 text-white" open={openNav}>
        <div className="container space-y-2 ">
          {navList}
          <Menu>
            <MenuHandler>
              <Button variant="text" size="sm" fullWidth className="text-black bg-white" color="white">
                Language
              </Button>
            </MenuHandler>
            <MenuList>
              <MenuItem onClick={() => console.log("Language selected: ENG")}>ENG</MenuItem>
              <MenuItem onClick={() => console.log("Language selected: አማ")}>አማ</MenuItem>
            </MenuList>
          </Menu>
          {isLoggedIn ? (
            <>
              <Link to="/profile" className="block w-full" onClick={handleNavLinkClick}>
                <Button variant="gradient" size="sm" fullWidth color="white">
                  Profile
                </Button>
              </Link>
              <Button variant="gradient" size="sm" fullWidth onClick={handleLogout} color="white">
                Logout
              </Button>
            </>
          ) : (
            <Link to="/sign-in" className="block w-full" onClick={handleNavLinkClick}>
              <Button variant="gradient" size="sm" fullWidth>
                Sign in
              </Button>
            </Link>
          )}
        </div>
      </MobileNav>
    </MTNavbar>
  );
}

Navbar.defaultProps = {
  brandName: "ANKUARU",
  textColor: "white",
};

Navbar.propTypes = {
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  textColor: PropTypes.string,
};

Navbar.displayName = "/src/widgets/layout/navbar.jsx";

export default Navbar;
