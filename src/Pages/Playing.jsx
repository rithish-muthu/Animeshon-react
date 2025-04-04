import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import EpisodesPage from "../Components/Episodes";
import Loader from "../Components/loader";

function Playing() {
  const location = useLocation();
  const { animeName, episodeName, id, description, animeId, stream } =
    location.state || {};

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loader() {
      try {
        setTimeout(() => {
          setLoading(false);
        },0);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    }
    loader();
  }, []);
  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <main className=" bg-gray-900 text-white flex flex-col">
        <div className="w-full  bg-gray-900 text-white flex flex-col">
        
        <div className="text-xl sm:text-3xl font-bold text-center p-4">
          {animeName}
        </div>

        
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-full h-full">
            <video
              id={`video-${id}`}
              className="video-js w-full h-auto object-cover"
              controls
              preload="auto"
              data-setup="{}"
            >
              <source
                src={stream}
                type="video/mp4"
              />
            </video>
          </div>
        </div>

        
        <div className="p-4 bg-gray-900 text-center">
          <h2 className="text-lg sm:text-xl font-semibold">{episodeName}</h2>
          <h3 className="text-gray-300 mt-2 text-sm sm:text-base">
            {description}
          </h3>
        </div>
        </div>
        <EpisodesPage id={animeId || ""} />
      </main>
    </>
  );
}

export default Playing;
