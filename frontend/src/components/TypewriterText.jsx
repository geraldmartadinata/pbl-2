import { useState, useEffect } from 'react'

export default function TypewriterText({ lines = [], typeSpeed = 60, deleteSpeed = 30, pauseDuration = 2000 }) {
  const [display, setDisplay] = useState('')
  const [cursor, setCursor] = useState(true)

  useEffect(() => {
    let timer
    let idx = 0
    let charIdx = 0
    let isDeleting = false
    let isPaused = false

    const tick = () => {
      if (isPaused) return

      const current = lines[idx] || ''
      if (!isDeleting) {
        charIdx++
        setDisplay(current.slice(0, charIdx))
        if (charIdx >= current.length) {
          isPaused = true
          timer = setTimeout(() => {
            isPaused = false
            isDeleting = true
            tick()
          }, pauseDuration)
          return
        }
        timer = setTimeout(tick, typeSpeed)
      } else {
        charIdx--
        setDisplay(current.slice(0, charIdx))
        if (charIdx <= 0) {
          isDeleting = false
          idx = (idx + 1) % lines.length
          timer = setTimeout(tick, 200)
          return
        }
        timer = setTimeout(tick, deleteSpeed)
      }
    }

    timer = setTimeout(tick, 500)

    return () => clearTimeout(timer)
  }, [lines, typeSpeed, deleteSpeed, pauseDuration])

  useEffect(() => {
    const blink = setInterval(() => setCursor((c) => !c), 500)
    return () => clearInterval(blink)
  }, [])

  return (
    <span className="inline">
      {display}
      <span className={`${cursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}>|</span>
    </span>
  )
}
