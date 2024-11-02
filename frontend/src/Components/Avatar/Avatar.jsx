// import React from "react";
// import {
//   Avatar,
//   Button,
//   Menu,
//   MenuHandler,
//   MenuItem,
//   MenuList,
//   Typography,
// } from "@material-tailwind/react";
// import {
//   Cog6ToothIcon,
//   InboxArrowDownIcon,
//   LifebuoyIcon,
//   PowerIcon,
//   UserCircleIcon,
// } from "@heroicons/react/24/solid";

// import { useDispatch } from "react-redux";
// import { setEmail } from "../State/Reducers/emailSlice";
// import { setToken } from '../State/Reducers/tokenSlice';
// import { removeTokenAction } from "../State/Reducers/tokenSlice";
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import { useNavigate } from "react-router-dom";

// // profile menu component
// const profileMenuItems = [
//   {
//     label: "My Profile",
//     icon: UserCircleIcon,
//   },
//   {
//     label: "Edit Profile",
//     icon: Cog6ToothIcon,
//   },
//   {
//     label: "Inbox",
//     icon: InboxArrowDownIcon,
//   },
//   {
//     label: "Help",
//     icon: LifebuoyIcon,
//   },
//   {
//     label: "Sign Out",
//     icon: PowerIcon,
//   },
// ];

// const AvatarWithDropdown = () => {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);
//   const dispatch = useDispatch();
//   const closeMenu = () => setIsMenuOpen(false);
//   const navigate = useNavigate();

//   const handleSignOut = () => {
//     const MySwal = withReactContent(Swal);

//     MySwal.fire({
//         title: 'Are you sure?',
//         text: "You will be logged out!",
//         icon: 'warning',
//         showCancelButton: true,
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes, log out!',
//       }).then((result) => {
//         if (result.isConfirmed) {
//           setTimeout(() => {
//             dispatch(setEmail(null));
//             dispatch(removeTokenAction());
//             closeMenu();
//             navigate('/home');
//             console.log("User signed out");
//           }, 2000);
//           Swal.fire(
//             'Logged Out!',
//             'You have been logged out.',
//             'success'
//           );
//         }
//       });
//   };

//   return (
//     <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
//       <MenuHandler>
//         <Button
//           variant="text"
//           color="blue-gray"
//           className="flex items-center rounded-full p-0"
//         >
//           <Avatar
//             variant="circular"
//             size="md"
//             alt="tania andrew"
//             withBorder={true}
//             color="white"
//             className="p-0.5"
//             src="https://docs.material-tailwind.com/img/face-2.jpg"
//           />
//         </Button>
//       </MenuHandler>
//       <MenuList className="p-1">
//         {profileMenuItems.map(({ label, icon }, key) => {
//           const isLastItem = key === profileMenuItems.length - 1;
//           return (
//             <MenuItem
//               key={label}
//               onClick={isLastItem ? handleSignOut : closeMenu}
//               className={`flex items-center gap-2 rounded ${
//                 isLastItem
//                   ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
//                   : ""
//               }`}
//             >
//               {React.createElement(icon, {
//                 className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
//                 strokeWidth: 2,
//               })}
//               <Typography
//                 as="span"
//                 variant="small"
//                 className="font-normal"
//                 color={isLastItem ? "red" : "inherit"}
//               >
//                 {label}
//               </Typography>
//             </MenuItem>
//           );
//         })}
//       </MenuList>
//     </Menu>
//   );
// };

// export default AvatarWithDropdown;


import React from "react";
import {
  Avatar,
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography,
} from "@material-tailwind/react";
import {
  Cog6ToothIcon,
  InboxArrowDownIcon,
  LifebuoyIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";

import { useDispatch } from "react-redux";
import { setEmail } from "../State/Reducers/emailSlice";
import { setToken } from '../State/Reducers/tokenSlice';
import { removeTokenAction } from "../State/Reducers/tokenSlice";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from "react-router-dom";
import { setIsLoggedIn, setIsLoggedOut } from "../State/Reducers/googleSlice";

// profile menu component
const profileMenuItems = [
  {
    label: "My Profile",
    icon: UserCircleIcon,
  },
  {
    label: "Edit Profile",
    icon: Cog6ToothIcon,
  },
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

const AvatarWithDropdown = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  const handleSignOut = () => {
    const MySwal = withReactContent(Swal);

    MySwal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log out!',
    }).then((result) => {
      if (result.isConfirmed) {
        setTimeout(() => {
          dispatch(setEmail(null));
          dispatch(setIsLoggedIn(null));
          localStorage.removeItem('isLoggedIn');
          dispatch(removeTokenAction());
          localStorage.removeItem('userId');
          closeMenu();
          navigate('/login');
          console.log("User signed out");
        }, 2000);
        Swal.fire(
          'Logged Out!',
          'You have been logged out.',
          'success'
        );
      }
    });
  };

  const handleProfileNavigation = () => {
    navigate('/profile');
    closeMenu();
  };

  return (
    <Menu open={isMenuOpen} handler={setIsMenuOpen} placement="bottom-end">
      <MenuHandler>
        <Button
          variant="text"
          color="blue-gray"
          className="flex items-center rounded-full p-0"
        >
          <Avatar
            variant="circular"
            size="md"
            alt="User"
            withBorder={true}
            color="white"
            className="p-0.5"
            src="https://docs.material-tailwind.com/img/face-2.jpg"
          />
        </Button>
      </MenuHandler>
      <MenuList className="p-1">
        {profileMenuItems.map(({ label, icon }, key) => {
          const isLastItem = key === profileMenuItems.length - 1;
          const handleClick = label === "My Profile" ? handleProfileNavigation : isLastItem ? handleSignOut : closeMenu;
          return (
            <MenuItem
              key={label}
              onClick={handleClick}
              className={`flex items-center gap-2 rounded ${
                isLastItem
                  ? "hover:bg-red-500/10 focus:bg-red-500/10 active:bg-red-500/10"
                  : ""
              }`}
            >
              {React.createElement(icon, {
                className: `h-4 w-4 ${isLastItem ? "text-red-500" : ""}`,
                strokeWidth: 2,
              })}
              <Typography
                as="span"
                variant="small"
                className="font-normal"
                color={isLastItem ? "red" : "inherit"}
              >
                {label}
              </Typography>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default AvatarWithDropdown;
