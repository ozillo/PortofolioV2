import { useEffect } from 'react'
import { initLenis } from './lib/lenis'
import { ScrollTrigger } from './lib/gsap'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import Hero from './sections/Hero/Hero'
import About from './sections/About/About'
import Skills from './sections/Skills/Skills'
import Collaborations from './sections/Collaborations/Collaborations'
import PillNav from './components/PillNav'

export default function App() {
  useEffect(() => {
    const lenis = initLenis()

    ScrollTrigger.scrollerProxy(document.body, {
      scrollTop(value) {
        return arguments.length ? window.scrollTo(0, value) : window.scrollY
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
      }
    })

    function onScroll() { ScrollTrigger.update() }
    lenis.on('scroll', onScroll)
    setTimeout(() => ScrollTrigger.refresh(), 0)

    return () => { lenis.off('scroll', onScroll) }
  }, [])

  return (
    <>
      {/* <Navbar />  si lo quieres activo, descomenta */}
      <PillNav
        items={[
          { label: 'Inicio',         ariaLabel: 'Ir a inicio',         link: '#hero' },
          { label: 'Sobre mí',       ariaLabel: 'Ir a sobre mí',       link: '#about' },
          { label: 'Habilidades',    ariaLabel: 'Ir a habilidades',    link: '#skills' },
          { label: 'Colaboraciones', ariaLabel: 'Ir a colaboraciones', link: '#collaborations' },
        ]}
        socialItems={[
          { label: 'Twitter',  link: 'https://twitter.com' },
          { label: 'GitHub',   link: 'https://github.com' },
          { label: 'LinkedIn', link: 'https://linkedin.com' },
        ]}
      />

      <main>
        <section id="hero" className="section"><Hero /></section>
        <section id="about" className="section"><About /></section>
        <section id="skills" className="section"><Skills /></section>
        <section id="collaborations" className="section"><Collaborations /></section> 
      </main>

      <Footer />
    </>
  )
}
