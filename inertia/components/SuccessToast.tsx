import React, { useEffect, useState } from 'react'

interface SuccessToastProps {
  message: string
  show: boolean
  onClose: () => void
  duration?: number
}

export default function SuccessToast({ message, show, onClose, duration = 3000 }: SuccessToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsExiting(false)
      const timer = setTimeout(() => {
        setIsExiting(true)
        setTimeout(() => {
          setIsVisible(false)
          onClose()
        }, 300) // Match animation duration
      }, duration)
      return () => clearTimeout(timer)
    } else {
      setIsExiting(true)
      setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }
  }, [show, duration, onClose])

  if (!isVisible) return null

  return (
    <div className={`fixed top-6 right-6 z-[100] transition-all duration-300 ${
      isExiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'
    }`}>
      <div className="glass border border-green-200/50 px-6 py-4 rounded-2xl shadow-2xl flex items-center space-x-3 min-w-[300px] max-w-md transform transition-all duration-300 hover:scale-105 backdrop-blur-xl">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
          <svg
            className="h-6 w-6 text-white"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsExiting(true)
            setTimeout(() => {
              setIsVisible(false)
              onClose()
            }, 300)
          }}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-white/20"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

