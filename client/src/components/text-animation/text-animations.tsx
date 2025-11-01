import { motion } from "framer-motion"
import { useEffect, useState } from "react";

export function GradientText({ text, size = "large" }: { size?: string, text: string }) {
  return (
    <motion.span
      initial="initial"
      animate="animate"
      className={`${size === "large" ? "text-4xl md:text-6xl" : size === "medium" ? "text-3xl md:text-4xl" : "text-2xl"} font-bold bg-clip-text text-transparent 
       dark:bg-gradient-to-r dark:from-orange-400 dark:via-red-500 dark:to-pink-500  
       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 `}
    >
      {text}
    </motion.span>
  )
}


export const LandingPara = () => {

  const textArr = ["Assign Editors", "Chill & Relax", "Preview & Publish"]
  const [index, setIndex] = useState<number>(0);
  const emojiArr = ["✨","✈️⛱️", ""]

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % textArr.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [textArr]);

  return (<motion.h1

    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
    className="scroll-m-20 text-foreground/80 px-2 md:max-w-[600px] w-fit text-center 
    text-lg sm:text-xl md:text-2xl font-semibold tracking-tight text-balance">
    <span
    ><span className="relative" >
        <span className="opacity-0" >Preview & Publish. </span>
        <motion.span
          key={index}
          initial={{ opacity: 0, top: -20 }}
          animate={{ opacity: 1, top: -3 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="absolute left-0" >
          <span
            className=" bg-clip-text text-transparent 
       dark:bg-gradient-to-r dark:from-orange-400 dark:via-red-500 dark:to-pink-500  
       bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >{textArr[index]}</span>
          {emojiArr[index]}.
        </motion.span>
      </span>

    </span> Review and publish to YouTube. No re-uploads, no internet waste.
  </motion.h1>)
}


// const gradientClasses: Record<AnimationTypes, string> = {
//     [AnimationTypes.WAVE]: "bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600",
//     [AnimationTypes.TYPEWRITER]: "bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500",
//     [AnimationTypes.GLOW]: "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500",
//     [AnimationTypes.SLIDE]: "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500",
//     [AnimationTypes.BOUNCE]: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
//   }