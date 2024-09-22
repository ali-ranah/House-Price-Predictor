// import { Carousel } from "@material-tailwind/react";
// import image1 from '../../assets/homepage-1.jpg';
// import image2 from '../../assets/home1.webp';

 
// const Carousels =()=> {
//   return (
//     <Carousel
//       className="rounded-xl"
//       navigation={({ setActiveIndex, activeIndex, length }) => (
//         <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
//           {new Array(length).fill("").map((_, i) => (
//             <span
//               key={i}
//               className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
//                 activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
//               }`}
//               onClick={() => setActiveIndex(i)}
//             />
//           ))}
//         </div>
//       )}
//     >
//       <img
//         src={image1}
//         alt="image 1"
//         className="h-full w-full object-cover"
//       />
//       <img
//         src={image2}
//         alt="image 2"
//         className="h-full w-full object-cover"
//       />
//       <img
//         src="https://images.unsplash.com/photo-1518623489648-a173ef7824f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2762&q=80"
//         alt="image 3"
//         className="h-full w-full object-cover"
//       />
//     </Carousel>
//   );
// }

import { Carousel } from "@material-tailwind/react";
import image1 from '../../assets/carousel3.jpg';
import image2 from '../../assets/carousel4.jpeg';
import image3 from '../../assets/carousel6.jpg';
import image4 from '../../assets/carousel13.jpeg';
import image5 from '../../assets/carousel12.jpeg';
import image6 from '../../assets/carousel11.jpg';




const Carousels = () => {
  return (
    <div className="w-full h-[40vh] md:h-[90vh] mx-auto">
      <Carousel
        className="rounded-xl"
        navigation={({ setActiveIndex, activeIndex, length }) => (
          <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
            {new Array(length).fill("").map((_, i) => (
              <span
                key={i}
                className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                  activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
                }`}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      >
 <img
src={image1}
alt="image 1"
className="h-full w-full object-cover"
sizes={10}
/>
<img
src={image2}
alt="image 2"
className="h-full w-full object-cover"
sizes={10}
/>
<img
src={image3}
alt="image 3"
className="h-full w-full object-cover"
sizes={10}
/> 
<img
src={image4}
alt="image 4"
className="h-full w-full object-cover"
sizes={10}
/>
<img
src={image5}
alt="image 5"
className="h-full w-full object-cover"
sizes={10}
/>
<img
src={image6}
alt="image 6"
className="h-full w-full object-cover"
sizes={10}
/>
      </Carousel>
    </div>
  );
}

export default Carousels





