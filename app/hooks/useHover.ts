import { useState, useRef, useEffect } from 'react'

export function useHover<T extends HTMLElement>() {
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseEnter = () => setIsHovered(true)
    const handleMouseLeave = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const isInModal = e.clientX >= rect.left && e.clientX <= rect.right && 
                        e.clientY >= rect.top && e.clientY <= rect.bottom
      if (!isInModal) {
        setIsHovered(false)
      }
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mousemove', handleMouseLeave)

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mousemove', handleMouseLeave)
    }
  }, [])

  return [ref, isHovered] as const
}

