import React,{useState,useEffect} from "react";
import {
  Navbar,
  Typography,
  Button,
  IconButton,
  Input,
  Collapse,
  Avatar,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { selectEmail } from "../State/Reducers/emailSlice";
import { selectToken } from '../State/Reducers/tokenSlice';
import AvatarWithDropdown from "../Avatar/Avatar";
import { useSelector } from "react-redux";
import logo from '../../assets/logo2_Optimized.png'
import sellProperty from '../../assets/sell-property.png';
import predictPrice from '../../assets/predict-price.png';
import myProperty from '../../assets/my-property.png';
import myBids from '../../assets/my-bids.png';

 
export function Header() {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();
  const storedEmail = localStorage.getItem('email');
  const email = useSelector(selectEmail) || storedEmail;
  const [loggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const storedToken = localStorage.getItem('token');
  const token = useSelector(selectToken) || storedToken;

  const handleSignIn = ()=>{
navigate('/login')
  }
 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);
 
  const navList = (
    <ul className="mt-[2vh] mb-[4vh] flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
  as="li"
  variant="small"
  color="white"
  className="flex items-center gap-x-2 p-1 font-medium"
>
<a href="/create-listing" className="flex items-center">
<img width="16" height="16" src={sellProperty} alt="sell-property" className="mr-2"/>
    Sell Property
  </a>
</Typography>

      <Typography
        as="li"
        variant="small"
        color="white"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
        <a href="/predict-price" className="flex items-center">
       <img width="20" height="20" src={predictPrice} alt="predict-price" className="mr-2"/>
          Predict Price
          </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
                <a href="/my-properties" className="flex items-center">
<img width="16" height="16" src={myProperty} alt="my-property" className="mr-2"/>
          My Properties
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="white"
        className="flex items-center gap-x-2 p-1 font-medium"
      >
<a href="/my-bids" className="flex items-center">
<img width="16" height="16" src={myBids} alt="my-bids" className="mr-2"/>
          My Bids
        </a>
      </Typography>
    </ul>
  );
 
  return (
    <Navbar className="mx-auto min-w-screen !bg-[#789DBC] px-4 py-2 lg:px-8 lg:py-4">
      <div className="mx-auto flex w-full flex-wrap items-center gap-[4vw] justify-between text-blue-gray-900">
        <a href='/home'>
        <img 
  src={logo} 
  alt="Card 1" 
  className="w-16 rounded-md object-cover bg-white"
/>        </a>
        <div className="hidden lg:block">{navList}</div>
        <div className="hidden items-center gap-x-[6vw] lg:flex">
          <div className="relative flex gap-2 md:w-max">
            <Input
              type="search"
              placeholder="Search"
              color="white"
              containerProps={{
                className: "min-w-[288px]",
              }}
              className="focus:ring-0 pl-9 !border-1 !border-white !text-white placeholder:text-white focus:!border-white"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <div className="!absolute left-3 top-[13px]">
              <svg
                width="13"
                height="14"
                viewBox="0 0 14 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.97811 7.95252C10.2126 7.38634 10.3333 6.7795 10.3333 6.16667C10.3333 4.92899 9.84167 3.742 8.9665 2.86683C8.09133 1.99167 6.90434 1.5 5.66667 1.5C4.42899 1.5 3.242 1.99167 2.36683 2.86683C1.49167 3.742 1 4.92899 1 6.16667C1 6.7795 1.12071 7.38634 1.35523 7.95252C1.58975 8.51871 1.93349 9.03316 2.36683 9.4665C2.80018 9.89984 3.31462 10.2436 3.88081 10.4781C4.447 10.7126 5.05383 10.8333 5.66667 10.8333C6.2795 10.8333 6.88634 10.7126 7.45252 10.4781C8.01871 10.2436 8.53316 9.89984 8.9665 9.4665C9.39984 9.03316 9.74358 8.51871 9.97811 7.95252Z"
                  fill="none"
                  />
                <path
                  d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          {/* <Button size="md" className="rounded-lg shadow-none hover:shadow-black hover:shadow-sm bg-black text-white ">
            Search
          </Button> */}
          <div className="flex items-center xs:hidden gap-x-1">
         {token?(
      <AvatarWithDropdown/>
      ):(
          <Button
            variant="gradient"
            size="sm"
            color="white"
            onClick={handleSignIn}
            className="hidden text-black lg:inline-block"
          >
            <span>Sign in</span>
          </Button>
         )}
        </div>
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-white hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </IconButton>
        <div className="flex items-center lg:hidden gap-x-1">
         {token?(
      <AvatarWithDropdown/>
      ):(
          <Button
            variant="gradient"
            size="sm"
            color="white"
            onClick={handleSignIn}
            className="hidden text-black  sm:inline-block"
          >
            <span>Sign in</span>
          </Button>
         )}
        </div>
      </div>
      <Collapse open={openNav}>
        <div className="container mx-auto">
          {navList}
          <div className="flex flex-col gap-x-2 sm:flex-row sm:items-center">
            <div className="relative w-full gap-2 mb-[2vh] md:w-max">
              <Input
                type="search"
                placeholder="Search"
                color="white"
                containerProps={{
                  className: "min-w-[288px]",
                }}
                className="focus:ring-0 pl-9 !border-1 !border-white !text-white placeholder:text-grey-700 focus:!border-white"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <div className="!absolute left-3 top-[13px]">
                <svg
                  width="13"
                  height="14"
                  viewBox="0 0 14 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.97811 7.95252C10.2126 7.38634 10.3333 6.7795 10.3333 6.16667C10.3333 4.92899 9.84167 3.742 8.9665 2.86683C8.09133 1.99167 6.90434 1.5 5.66667 1.5C4.42899 1.5 3.242 1.99167 2.36683 2.86683C1.49167 3.742 1 4.92899 1 6.16667C1 6.7795 1.12071 7.38634 1.35523 7.95252C1.58975 8.51871 1.93349 9.03316 2.36683 9.4665C2.80018 9.89984 3.31462 10.2436 3.88081 10.4781C4.447 10.7126 5.05383 10.8333 5.66667 10.8333C6.2795 10.8333 6.88634 10.7126 7.45252 10.4781C8.01871 10.2436 8.53316 9.89984 8.9665 9.4665C9.39984 9.03316 9.74358 8.51871 9.97811 7.95252Z"
                    fill="none"
                  />
                  <path
                    d="M13 13.5L9 9.5M10.3333 6.16667C10.3333 6.7795 10.2126 7.38634 9.97811 7.95252C9.74358 8.51871 9.39984 9.03316 8.9665 9.4665C8.53316 9.89984 8.01871 10.2436 7.45252 10.4781C6.88634 10.7126 6.2795 10.8333 5.66667 10.8333C5.05383 10.8333 4.447 10.7126 3.88081 10.4781C3.31462 10.2436 2.80018 9.89984 2.36683 9.4665C1.93349 9.03316 1.58975 8.51871 1.35523 7.95252C1.12071 7.38634 1 6.7795 1 6.16667C1 4.92899 1.49167 3.742 2.36683 2.86683C3.242 1.99167 4.42899 1.5 5.66667 1.5C6.90434 1.5 8.09133 1.99167 8.9665 2.86683C9.84167 3.742 10.3333 4.92899 10.3333 6.16667Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
            {/* <Button size="md" className="mt-1 rounded-lg sm:mt-0">
              Search
            </Button> */}
          </div>
        </div>
      </Collapse>
    </Navbar>
  );
}