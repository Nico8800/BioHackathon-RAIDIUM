'use client'

import { motion } from 'framer-motion'

interface ResultDisplayProps {
  result: string
}

const ResultDisplay = ({ result }: ResultDisplayProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8 max-w-lg p-6 backdrop-blur-lg bg-white/10 rounded-lg"
    >
      <p className="text-violet-200 leading-relaxed">{result}</p>
    </motion.div>
  )
}

export default ResultDisplay