import { useEffect, useState } from 'react'
import { ScrollTrigger } from '../lib/gsap'

export default function useActiveSection(ids = [], offsetPx = 0) {
  const [active, setActive] = useState(ids[0] ?? null)

  useEffect(() => {
    const triggers = ids.map((id) => {
      const el = document.getElementById(id)
      if (!el) return null
      return ScrollTrigger.create({
        trigger: el,
        start: `top+=${offsetPx} center`,
        end: 'bottom center',
        onEnter: () => setActive(id),
        onEnterBack: () => setActive(id),
      })
    }).filter(Boolean)

    ScrollTrigger.refresh()
    return () => triggers.forEach(t => t.kill())
  }, [ids.join(','), offsetPx])

  return active
}
