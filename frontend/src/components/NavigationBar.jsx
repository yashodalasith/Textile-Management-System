// src/components/NavigationBar.jsx
import React from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
  List,
  ListItem,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  SquaresPlusIcon,
  UserGroupIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import ProfileMenu from "./ProfileMenu";

// ---- Menu items config
const navListMenuItems = [
  {
    title: "Products",
    description: "Find the perfect solution for your needs.",
    icon: SquaresPlusIcon,
    to: "/products",
  },
  {
    title: "About Us",
    description: "Meet and learn about our dedication",
    icon: UserGroupIcon,
    to: "/aboutus",
  },
  {
    title: "Contact",
    description: "We’re here to help.",
    icon: PhoneIcon,
    to: "/contact",
  },
];

function NavListMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const renderItems = navListMenuItems.map(
    ({ icon, title, description, to }, key) => (
      <MenuItem
        key={key}
        as={Link}
        to={to}
        className="flex items-center gap-3 rounded-lg"
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2">
          {React.createElement(icon, {
            strokeWidth: 2,
            className: "h-6 w-6 text-gray-900",
          })}
        </div>
        <div>
          <Typography
            variant="h6"
            color="blue-gray"
            className="flex items-center text-sm font-bold"
          >
            {title}
          </Typography>
          <Typography
            variant="paragraph"
            className="text-xs !font-medium text-blue-gray-500"
          >
            {description}
          </Typography>
        </div>
      </MenuItem>
    )
  );

  return (
    <>
      {/* Desktop dropdown (hover) */}
      <Menu
        open={isMenuOpen}
        handler={setIsMenuOpen}
        offset={{ main: 20 }}
        placement="bottom"
        allowHover
      >
        <MenuHandler>
          <Typography
            as="div"
            variant="small"
            className="font-medium cursor-pointer"
          >
            <ListItem
              className="flex items-center gap-2 py-2 pr-4"
              selected={isMenuOpen}
            >
              Explore
              <ChevronDownIcon
                strokeWidth={2.5}
                className={`hidden h-3 w-3 transition-transform lg:block ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            </ListItem>
          </Typography>
        </MenuHandler>
        <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
          <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
            {renderItems}
          </ul>
        </MenuList>
      </Menu>

      {/* Mobile collapsible list (no nested anchors) */}
      <div className="block lg:hidden">
        <Collapse open={isMobileMenuOpen}>{renderItems}</Collapse>
      </div>
    </>
  );
}

function NavList() {
  return (
    <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
      <Typography
        as={Link}
        to="/home"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">Home</ListItem>
      </Typography>

      {/* Dropdown menu entry (desktop shows hover menu; mobile will use hamburger) */}
      <NavListMenu />

      <Typography
        as={Link}
        to="/aboutus"
        variant="small"
        color="blue-gray"
        className="font-medium"
      >
        <ListItem className="flex items-center gap-2 py-2 pr-4">
          About Us
        </ListItem>
      </Typography>
    </List>
  );
}

export function NavigationBar() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 960) setOpenNav(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl px-4 py-2">
      <div className="flex items-center justify-between text-blue-gray-900">
        {/* Logo as Link (no nested anchors) */}
        <Typography
          as={Link}
          to="/home"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5 lg:ml-2"
        >
          Omusono
        </Typography>

        {/* Desktop nav */}
        <div className="hidden lg:block">
          <NavList />
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <IconButton
            variant="text"
            color="blue-gray"
            className="lg:hidden"
            onClick={() => setOpenNav((cur) => !cur)}
          >
            {openNav ? (
              <XMarkIcon className="h-6 w-6" strokeWidth={2} />
            ) : (
              <Bars3Icon className="h-6 w-6" strokeWidth={2} />
            )}
          </IconButton>

          {/* Profile dropdown (your component) */}
          <ProfileMenu />
        </div>
      </div>

      {/* Mobile collapse content */}
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}

export default NavigationBar;
