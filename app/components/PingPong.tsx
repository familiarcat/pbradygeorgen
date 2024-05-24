import React, { useRef, useEffect, useState } from "react"
import { Player } from "@lottiefiles/react-lottie-player"

interface PingPongAnimationProps {
  animationData: object
}

const PingPongAnimation: React.FC<PingPongAnimationProps> = ({ animationData }) => {
  const playerRef = useRef<Player | null>(null)
  const [isForward, setIsForward] = useState(true)

  const player = playerRef.current
  const handleComplete = () => {
    setIsForward(!isForward)
    // console.log("handleComplete", player)
    player?.setPlayerDirection(isForward ? 1 : -1)
    player?.play()
  }
  useEffect(() => {
    if (player) {
      const handleComplete = () => {
        setIsForward(!isForward)
        player.setPlayerDirection(isForward ? 1 : -1)
        player.play()
      }

      // player.addEventListener("complete", handleComplete)
      return () => {
        // player.removeEventListener("complete", handleComplete)
      }
    }
  }, [isForward])

  return (
    <Player
      ref={playerRef}
      autoplay
      loop={false}
      onEvent={(e) => {
        if (e === "complete") {
          setIsForward(!isForward)
          handleComplete()
          // console.log("player complete", player)
        }
      }}
      src={animationData}
      style={{ height: "300px", width: "300px" }}
    />
  )
}

export default PingPongAnimation
