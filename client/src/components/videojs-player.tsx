import React, { useEffect, useRef } from "react"
import videojs from "video.js"
import Player from "video.js/dist/types/player"

import "video.js/dist/video-js.css"
import "@videojs/http-streaming"

interface VideoJsPlayerProps {
  src: string
  isLive: boolean
  autoPlay?: boolean
  muted?: boolean
  isMobile?: boolean 
}

const VideoJsPlayer: React.FC<VideoJsPlayerProps> = ({
  src,
  isLive,
  autoPlay = true,
  muted = false,
  isMobile = false, 
}) => {
  const videoNodeRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<Player | null>(null)

  useEffect(() => {
    if (!playerRef.current && videoNodeRef.current) {
      const videoElement = videoNodeRef.current
      
      const options = {
        autoplay: autoPlay,
        muted: muted,
        controls: true,
        responsive: true,
        fluid: true,
        liveui: isLive,
        controlBar: {
          progressControl: false, 
        },
        html5: {
          vhs: { 
            overrideNative: true,
            withCredentials: false 
          },
        },
        playsinline: true,
      }

      const player = videojs(videoElement, options, () => {
        console.log("Video.js Player is ready")
      })

      playerRef.current = player
    }

    return () => {
      const player = playerRef.current
      if (player && !player.isDisposed()) {
        console.log("Disposing Video.js player")
        playerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const player = playerRef.current

    if (player && !player.isDisposed()) {
      
      const currentSrc = player.currentSrc() 
      
      if (currentSrc !== src) {
        
        let sourceType = "";
        if (src.endsWith('.m3u8')) {
          sourceType = "application/x-mpegURL";
        } else if (src.endsWith('.mpd')) {
          sourceType = "application/dash+xml";
        } else if (src.includes("easybroadcast.io")) {
          sourceType = "application/x-mpegURL"; 
        }

        console.log("Updating Video.js source to:", src, "Type:", sourceType);
        
        player.src({
          src: src,
          type: sourceType 
        })
        
        if (autoPlay) {
          player.play()?.catch(e => console.warn("Autoplay blocked for new src"));
        }
      }
      
      player.autoplay(autoPlay || false)
      player.muted(muted || false)
    }
  }, [src, autoPlay, muted, isLive]) 

  return (
    <div data-vjs-player className="w-full h-full">
      <video
        ref={videoNodeRef}
        className="video-js vjs-big-play-centered vjs-fill vjs-theme-city"
      />
    </div>
  )
}

export default VideoJsPlayer
