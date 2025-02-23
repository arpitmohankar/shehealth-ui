// src/components/SplineClient.tsx
"use client";
import { useState } from "react";
import Spline from "@splinetool/react-spline";

export default function SplineClient() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <Spline
        scene="https://prod.spline.design/oMVe7KvAHpWUTqiv/scene.splinecode" // Replace with your own interactive scene URL
        onLoad={() => setIsLoading(false)}
        style={{
          width: "100%",
          height: "100%",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
          cursor: "grab",
        }}
      />
    </div>
  );
}
