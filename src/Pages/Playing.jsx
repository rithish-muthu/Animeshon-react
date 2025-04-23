import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import EpisodesPage from "../Components/Episodes";
import Loader from "../Components/loader";

function Playing() {
  const location = useLocation();
  const { animeName, episodeName, id, description, animeId, stream } =
    location.state || {};

  const [loading, setLoading] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: "smooth" });
      videoRef.current.load(); // forces the video to reload
      videoRef.current.play(); // optionally auto-play
    }
  }, [stream,episodeName]);
  

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      console.log("Speed changed to:", playbackSpeed);
    }
  }, [playbackSpeed]);

  useEffect(() => {
    async function loader() {
      try {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
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
                key={stream} // 👈 this forces re-mount when stream URL changes
                ref={videoRef}
                id={`video-${id}`}
                className="video-js w-full h-auto object-cover"
                controls
                preload="auto"
                data-setup="{}"
              >
                <source src={stream} type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="flex justify-left items-center gap-2 my-4">
            <label htmlFor="speed" className="text-white">
              Speed:
            </label>
            <select
              id="speed"
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-gray-800 text-white p-2 rounded"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x (Normal)</option>
              <option value={1.25}>1.25x</option>
              <option value={1.5}>1.5x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
            </select>
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
