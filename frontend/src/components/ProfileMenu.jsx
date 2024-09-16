import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
} from "@material-tailwind/react";
import {
  ChevronDownIcon,
  UserCircleIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
} from "@heroicons/react/24/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Snackbar, Alert } from "@mui/material"; // Import Snackbar and Alert

const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
    path: "/userProfile",
  },
  // {
  //   label: "Edit Profile",
  //   icon: Cog6ToothIcon,
  //   path: "/updateProfile",
  // },
  {
    label: "Inbox",
    icon: InboxArrowDownIcon,
  },
  {
    label: "Help",
    icon: LifebuoyIcon,
  },
  {
    label: "Sign Out",
    icon: PowerIcon,
  },
];

function ProfileMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleMenuItemClick = (path) => {
    if (path === undefined) {
      logoutHandler();
    } else if (path) {
      // Add user ID if path requires it
      const updatedPath = path.includes(":userId")
        ? path.replace(":userId", user._id)
        : path;
      navigate(updatedPath);
      closeMenu();
    }
  };

  const logoutHandler = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");

    // Show Snackbar alert
    setMessage("Logged out successfully!");
    setSeverity("success");
    setOpen(true);

    // Redirect to the login page after delay
    setTimeout(() => {
      navigate("/"); // Redirect after delay
    }, 3000); // Match Snackbar duration
  };

  return (
    <>
      <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
        <MenuHandler>
          <Button
            variant="text"
            color="gray"
            className="flex items-center gap-1 rounded-full py-0.5 pr-2 pl-0.5 lg:ml-auto"
          >
            <FontAwesomeIcon icon={faUser} className="h-6 w-6 text-gray-600" />
            <ChevronDownIcon
              strokeWidth={2.5}
              className={`h-3 w-3 transition-transform ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList className="p-1 bg-white border border-gray-300 rounded-lg">
          {profileMenuItems.map(({ label, icon, path }, key) => {
            const isLastItem = key === profileMenuItems.length - 1;
            return (
              <MenuItem
                key={label}
                onClick={() => handleMenuItemClick(path)}
                className={`flex items-center gap-2 rounded-lg px-2 py-1 ${
                  isLastItem
                    ? "hover:bg-red-100 focus:bg-red-100 active:bg-red-200"
                    : "hover:bg-gray-100 focus:bg-gray-100 active:bg-gray-200"
                }`}
              >
                {React.createElement(icon, {
                  className: `h-4 w-4 ${
                    isLastItem ? "text-red-500" : "text-gray-600"
                  }`,
                  strokeWidth: 2,
                })}
                <Typography
                  as="span"
                  variant="small"
                  className="font-normal"
                  color={isLastItem ? "red" : "gray"}
                >
                  {label}
                </Typography>
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>

      {/* Snackbar Alert */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProfileMenu;
