// // Loading.jsx
// import React from "react";

// export default function Loading({ message }) {
//   return (
//     <div className="fixed inset-0 z-[10] flex items-center justify-center bg-black/30 backdrop-blur-sm">
//       <div className="flex flex-col items-center">
//         {/* Loader */}
//         <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>

//         {/* Message from parent */}
//         <p className="mt-4 text-lg font-medium text-white animate-pulse">
//           {message}
//         </p>
//       </div>
//     </div>
//   );
// }




import React from "react";
import Lottie from "lottie-react";

// 👇 Your uploaded animation file here
import loadingAnimation from "../assets/loading.json"; 

export default function Loading({ message = "Loading, please wait...", width = "default" }) {
  return (
   <div className={`fixed inset-0 z-[30] flex flex-col items-center justify-center bg-white mb-20 md:mb-0 ${width === "full" ? "ml-0 md:ml-0" : "ml-0 md:ml-60"}`}>

      {/* Lottie Animation */}
      <div className="w-48 h-auto">
        <Lottie 
          animationData={loadingAnimation} 
          loop={true} 
        />
      </div>

      {/* Pink Stylish Message */}
      <p className="text-xl font-extrabold text-pink-600 tracking-wide drop-shadow-sm">
        {message}
      </p>
    </div>
  );
}
