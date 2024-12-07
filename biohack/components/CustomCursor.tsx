// components/CustomCursor.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      // Vérifier si le curseur devrait être en mode "pointer"
      const target = e.target as HTMLElement
      const computed = window.getComputedStyle(target)
      setIsPointer(computed.cursor === 'pointer' || target.tagName.toLowerCase() === 'button' || target.tagName.toLowerCase() === 'a')
    }

    window.addEventListener('mousemove', handleMouseMove, false)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[9999] h-3 w-3 rounded-full bg-white mix-blend-difference"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isPointer ? 1.5 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 28
        }}
        style={{
          pointerEvents: 'none'
        }}
      />
    </>
  )
}

export default CustomCursor