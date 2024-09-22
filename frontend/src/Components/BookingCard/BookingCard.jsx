// import {
//   Card,
//   CardHeader,
//   CardBody,
//   CardFooter,
//   Typography,
//   Button,
//   Tooltip,
//   IconButton,
// } from "@material-tailwind/react";
// import image1 from '../../assets/carousel2.jpg'

// const  BookingCard =() => {
//   return (
//     <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//       {[...Array(3)].map((_, index) => (
//         <Card key={index} className="w-full max-w-[26rem] shadow-lg">
//           <CardHeader floated={false} color="blue-gray">
//             <img
//           src={image1}
//               alt="ui/ux review check"
//             />
//             <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60 " />
//             <IconButton
//               size="sm"
//               color="red"
//               variant="text"
//               className="!absolute top-4 right-4 rounded-full"
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 viewBox="0 0 24 24"
//                 fill="currentColor"
//                 className="h-6 w-6"
//               >
//                 <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
//               </svg>
//             </IconButton>
//           </CardHeader>
//           <CardBody>
//             <div className="mb-3 flex items-center justify-between">
//               <Typography variant="h5" color="blue-gray" className="font-medium">
//                 Fairy Meadows, Pakistan
//               </Typography>
//               <Typography
//                 color="blue-gray"
//                 className="flex items-center gap-1.5 font-normal"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="-mt-0.5 h-5 w-5 text-yellow-700"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 5.0
//               </Typography>
//             </div>
//             <Typography color="gray">
//               Enter a freshly updated and thoughtfully furnished peaceful home
//               surrounded by ancient trees, stone walls, and open meadows.
//             </Typography>
//             <div className="group mt-8 inline-flex flex-wrap items-center gap-3">
//               <Tooltip content="Rs.12999 per night">
//                 <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="h-5 w-5"
//                   >
//                     <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
//                     <path
//                       fillRule="evenodd"
//                       d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
//                       clipRule="evenodd"
//                     />
//                     <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
//                   </svg>
//                 </span>
//               </Tooltip>
//               <Tooltip content="Free wifi">
//                 <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="h-5 w-5"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M1.371 8.143c5.858-5.857 15.356-5.857 21.213 0a.75.75 0 010 1.061l-.53.53a.75.75 0 01-1.06 0c-4.98-4.979-13.053-4.979-18.032 0a.75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.182 3.182c4.1-4.1 10.749-4.1 14.85 0a.75.75 0 010 1.061l-.53.53a.75.75 0 01-1.062 0 8.25 8.25 0 00-11.667 0 .75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.204 3.182a6 6 0 018.486 0 .75.75 0 010 1.061l-.53.53a.75.75 0 01-1.06 0 4.5 4.5 0 00-6.366 0 .75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm4.121 4.95a2.25 2.25 0 113.182 0 .75.75 0 001.06 0l.53-.53a.75.75 0 000-1.061 3.75 3.75 0 00-5.303 0 .75.75 0 000 1.06l.53.531a.75.75 0 001.06 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </span>
//               </Tooltip>
//               <Tooltip content="4 bedrooms">
//                 <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 24 24"
//                     fill="currentColor"
//                     className="h-5 w-5"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8.25 2.25a.75.75 0 000 1.5h.75v3.313l-.616-.308a.75.75 0 00-.768 1.286l1.384.692v4.277h-1.5V9.75a.75.75 0 00-1.5 0v3.26A3.75 3.75 0 0012 19.5a3.75 3.75 0 005.25-6.49V9.75a.75.75 0 00-1.5 0v3.26h-1.5V9.73l1.384-.692a.75.75 0 00-.768-1.286l-.616.308V3.75h.75a.75.75 0 000-1.5H8.25zM12 19.5a2.25 2.25 0 01-2.25-2.25h4.5A2.25 2.25 0 0112 19.5zm-1.5-14.25h3v4.066l-1.5.75-1.5-.75V5.25z"
//                       clipRule="evenodd"
//                     />
//                     <path d="M7.5 15a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3zM18 15a.75.75 0 00-1.5 0v3a.75.75 0 001.5 0v-3z" />
//                     <path
//                       fillRule="evenodd"
//                       d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM1.5 12c0 5.799 4.701 10.5 10.5 10.5S22.5 17.799 22.5 12 17.799 1.5 12 1.5 1.5 6.201 1.5 12z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 </span>
//               </Tooltip>
//             <Tooltip content="Fire alert">
//               <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   viewBox="0 0 24 24"
//                   fill="currentColor"
//                   className="h-5 w-5"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M12.963 2.286a.75.75 0 00-1.071-.136 9.742 9.742 0 00-3.539 6.177A7.547 7.547 0 016.648 6.61a.75.75 0 00-1.152-.082A9 9 0 1015.68 4.534a7.46 7.46 0 01-2.717-2.248zM15.75 14.25a3.75 3.75 0 11-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 011.925-3.545 3.75 3.75 0 013.255 3.717z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </span>
//             </Tooltip>
//             <Tooltip content="And +20 more">
//               <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
//                 +20
//               </span>
//             </Tooltip>
//             </div>
//           </CardBody>
//           <CardFooter className="pt-3">
//             <Button fullWidth={true}>Book Now</Button>
//           </CardFooter>
//         </Card>
//       ))}
//     </div>
//   );
// }

// export default BookingCard;


import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import AxiosRequest from '../AxiosRequest/AxiosRequest';

const BookingCard = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    // Fetch properties from the API
    const fetchProperties = async () => {
      try {
        const response = await AxiosRequest.get('/api/property/properties'); // Replace with your actual API URL
        setProperties(response.data);  // Assuming API response is an array of properties
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <Card key={property._id} className="w-full max-w-[26rem] shadow-lg">
          <CardHeader floated={false} color="blue-gray">
            <img
              src={property.imageUrl || 'default-image.jpg'} // Use a default image if imageUrl is missing
              alt={property.title}
            />
            <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-tr from-transparent via-transparent to-black/60" />
            <IconButton
              size="sm"
              color="red"
              variant="text"
              className="!absolute top-4 right-4 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </IconButton>
          </CardHeader>
          <CardBody>
            <div className="mb-3 flex items-center justify-between">
              <Typography variant="h5" color="blue-gray" className="font-medium">
                {property.title}
              </Typography>
              <Typography
                color="blue-gray"
                className="flex items-center gap-1.5 font-normal"
              >
                {property.price} PKR
              </Typography>
            </div>
            <Typography color="gray">
              {property.description}
            </Typography>
            <div className="group mt-8 inline-flex flex-wrap items-center gap-3">
              <Tooltip content={`Location: ${property.location}`}>
                <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
                    <path
                      fillRule="evenodd"
                      d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
                      clipRule="evenodd"
                    />
                    <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
                  </svg>
                </span>
              </Tooltip>
              <Tooltip content="Free Wifi">
                <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.371 8.143c5.858-5.857 15.356-5.857 21.213 0a.75.75 0 010 1.061l-.53.53a.75.75 0 01-1.06 0c-4.98-4.979-13.053-4.979-18.032 0a.75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.182 3.182c4.1-4.1 10.749-4.1 14.85 0a.75.75 0 010 1.061l-.53.53a.75.75 0 01-1.062 0 8.25 8.25 0 00-11.667 0 .75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm3.204 3.182a6 6 0 018.486 0 .75.75 0 010 1.061l-.53.53a.75.75 0 01-1.06 0 4.5 4.5 0 00-6.366 0 .75.75 0 01-1.06 0l-.53-.53a.75.75 0 010-1.06zm4.121 4.95a2.25 2.25 0 113.182 0 .75.75 0 001.06 0l.53-.53a.75.75 0 000-1.061 3.75 3.75 0 00-5.303 0 .75.75 0 000 1.06l.53.531a.75.75 0 001.06 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </Tooltip>
              <Tooltip content="Free parking">
                <span className="cursor-pointer rounded-full border border-gray-900/5 bg-gray-900/5 p-3 text-gray-900 transition-colors hover:border-gray-900/10 hover:bg-gray-900/10 hover:!opacity-100 group-hover:opacity-70">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M2.25 4.875C2.25 3.839 3.09 3 4.125 3h15.75c1.035 0 1.875.839 1.875 1.875v15.75c0 1.036-.84 1.875-1.875 1.875H4.125A1.875 1.875 0 012.25 20.625V4.875zm4.5 5.25c0-.621.504-1.125 1.125-1.125h4.5a3.375 3.375 0 010 6.75H9v3a.75.75 0 01-1.5 0v-8.625zm1.5 0V12h4.125a1.875 1.875 0 000-3.75H8.25z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </Tooltip>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default BookingCard;
