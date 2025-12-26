import React from "react";
import Lottie from "lottie-react";

// 👇 Your uploaded animation file here
import loadingAnimation from "../assets/squareLoader.json"; 

export default function SquareLoader() {
  return (
    <div className="fixed inset-0 z-[30] flex flex-col items-center justify-center bg-white">

      {/* Lottie Animation */}
      <div className="w-48 h-auto">
        <Lottie 
          animationData={loadingAnimation} 
          loop={true} 
        />
      </div>
    </div>
  );
}
