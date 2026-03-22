"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { content } from "@/lib/content"

const SQRT_5000 = Math.sqrt(5000)

const testimonials = content.testimonials.list

interface TestimonialCardProps {
  position: number
  testimonial: (typeof testimonials)[0]
  handleMove: (steps: number) => void
  cardSize: number
  isMobile: boolean
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ position, testimonial, handleMove, cardSize, isMobile }) => {
  const isCenter = position === 0
  
  // On mobile, we only want to show the center card clearly, others should be more tucked away
  const translateX = isMobile 
    ? (cardSize * 0.85) * position 
    : (cardSize / 1.5) * position

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 p-6 sm:p-8 transition-all duration-500 ease-in-out overflow-hidden",
        isCenter
          ? "z-10 text-white opacity-100 scale-100"
          : "z-0 text-gray-900 border-gray-200 hover:border-gray-400 opacity-40 sm:opacity-60 scale-90 sm:scale-95",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        clipPath: `polygon(40px 0%, calc(100% - 40px) 0%, 100% 40px, 100% 100%, calc(100% - 40px) 100%, 40px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%) 
          translateX(${translateX}px)
          translateY(${isCenter ? -40 : position % 2 ? 10 : -10}px)
          rotate(${isCenter ? 0 : position % 2 ? 2 : -2}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px rgba(0,0,0,0.1)" : "none",
        backgroundColor: isCenter ? 'var(--primary)' : 'var(--background)',
        borderColor: isCenter ? 'var(--primary)' : 'var(--border)',
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45 bg-gray-300/30"
        style={{
          right: -2,
          top: 38,
          width: SQRT_5000,
          height: 2,
        }}
      />
      <img
        src={testimonial.imgSrc || "/placeholder.svg"}
        alt={`${testimonial.by.split(",")[0]}`}
        className="mb-4 h-12 w-10 sm:h-14 sm:w-12 bg-gray-100 object-cover object-top rounded-sm"
        style={{
          boxShadow: "2px 2px 0px rgba(0,0,0,0.1)",
        }}
      />
      <div className="overflow-y-auto max-h-[60%] scrollbar-hide">
        <h3 className={cn("text-sm sm:text-lg font-medium leading-snug", isCenter ? "text-white" : "text-gray-900")}>
          "{testimonial.testimonial}"
        </h3>
      </div>
      <p
        className={cn(
          "absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-8 mt-2 text-xs sm:text-sm italic font-semibold",
          isCenter ? "text-gray-200" : "text-gray-600",
        )}
      >
        - {testimonial.by}
      </p>
    </div>
  )
}

export const StaggerTestimonials: React.FC = () => {
  const [cardSize, setCardSize] = useState(365)
  const [isMobile, setIsMobile] = useState(false)
  const [testimonialsList, setTestimonialsList] = useState(testimonials)

  const handleMove = (steps: number) => {
    const newList = [...testimonialsList]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setTestimonialsList(newList)
  }

  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      if (width < 400) {
        setCardSize(260)
      } else if (width < 640) {
        setCardSize(300)
      } else {
        setCardSize(365)
      }
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div className="relative w-full overflow-hidden" style={{ height: isMobile ? 500 : 600, backgroundColor: 'var(--background)' }}>
      {testimonialsList.map((testimonial, index) => {
        const position =
          testimonialsList.length % 2 ? index - (testimonialsList.length + 1) / 2 : index - testimonialsList.length / 2
        
        // Only render cards that are close to the center to improve performance and mobile view
        if (Math.abs(position) > 2) return null

        return (
          <TestimonialCard
            key={testimonial.tempId}
            testimonial={testimonial}
            handleMove={handleMove}
            position={position}
            cardSize={cardSize}
            isMobile={isMobile}
          />
        )
      })}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-4 z-20">
        <button
          onClick={() => handleMove(-1)}
          className={cn(
            "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center text-xl transition-all active:scale-95",
            "bg-white border-2 border-gray-300 hover:bg-gray-900 hover:text-white shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
          )}
          aria-label="Previous testimonial"
        >
          <ChevronLeft />
        </button>
        <button
          onClick={() => handleMove(1)}
          className={cn(
            "flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center text-xl transition-all active:scale-95",
            "bg-white border-2 border-gray-300 hover:bg-gray-900 hover:text-white shadow-md",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
          )}
          aria-label="Next testimonial"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}
