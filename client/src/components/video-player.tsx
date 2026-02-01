import { useState } from "react"
import YouTube from "react-youtube"

// Determine if the URL is from YouTube
function getYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|live\/)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

interface VideoPlayerProps {
  src: string
  autoPlay?: boolean
  muted?: boolean
  isMobile?: boolean
}

export default function VideoPlayer({
  src,
  autoPlay = true, 
  muted = false,
  isMobile = false,
}: VideoPlayerProps) {
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("Stream Offline")

  const youTubeVideoId = getYouTubeVideoId(src)

  const handleYouTubeError = (event: any) => {
    console.error("YouTube Error Code:", event.data)
    setErrorMessage("This YouTube video is unavailable.")
    setError(true)
    setLoading(false)
  }

  // Render YouTube player
  if (youTubeVideoId) {
    return (
      <div className="relative w-full h-full bg-black overflow-hidden">
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-gray-300 z-20">
            <span className="text-lg font-semibold mb-4 text-red-500">{errorMessage}</span>
          </div>
        )}
        <YouTube
          videoId={youTubeVideoId}
          className="w-full h-full absolute top-0 left-0 z-10"
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: autoPlay ? 1 : 0,
              mute: muted ? 1 : 0,
              controls: 1,
              rel: 0,
              modestbranding: 1,
            },
          }}
          onReady={() => setLoading(false)}
          onError={handleYouTubeError}
        />
        {loading && (
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center bg-black text-gray-300 z-30 transition-opacity duration-700`}
          >
            <div className="w-10 h-10 border-2 border-t-transparent border-cyan-400 rounded-full animate-spin mb-3"></div>
            <span className="text-sm font-medium">Loading video...</span>
          </div>
        )}
      </div>
    )
  }

  // Fallback for invalid YouTube URL
  return (
    <div className="relative w-full h-full bg-black flex items-center justify-center">
        <p className="text-red-500">Invalid YouTube URL passed to player.</p>
    </div>
  )
}
