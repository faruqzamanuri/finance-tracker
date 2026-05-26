import { useEffect, useMemo, useState } from 'react'

export const SECTION_IDS = ['overview', 'add-transaction', 'activity', 'insights']

export function useSectionNavigation(sectionIds = SECTION_IDS) {
  const sectionKey = sectionIds.join('|')
  const stableSectionIds = useMemo(() => sectionIds, [sectionKey])
  const [activeSection, setActiveSection] = useState(stableSectionIds[0])

  useEffect(() => {
    const sections = stableSectionIds
      .map((sectionId) => document.getElementById(sectionId))
      .filter(Boolean)

    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id)
        }
      },
      {
        root: null,
        rootMargin: '-18% 0px -62% 0px',
        threshold: [0.12, 0.3, 0.55],
      },
    )

    sections.forEach((section) => observer.observe(section))

    return () => observer.disconnect()
  }, [stableSectionIds])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (!section) return

    setActiveSection(sectionId)
    section.scrollIntoView({
      behavior: 'smooth',
      block: sectionId === 'add-transaction' ? 'center' : 'start',
    })
    window.history.replaceState(null, '', `#${sectionId}`)
  }

  return { activeSection, scrollToSection }
}
