import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import ProjectCard from "../../components/ProjectCard/ProjectCard";
import { PROJECTS } from "../../data/projects";
import "./ProjectsCarousel.css";

export default function ProjectsCarousel({
  id = "projects",
  title = "Proyectos",
  subtitle = "Selección de trabajos recientes.",
  items = PROJECTS,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section id={id} className="projects-carousel" aria-label={title}>
      <header className="pc-header">
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </header>

      <div className="pc-swiper-wrap">
        {/* Botones externos (opcional) */}
        <button ref={prevRef} className="pc-nav pc-prev" aria-label="Anterior">
          {/* chevron izq */}
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M15.5 19 8.5 12l7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <Swiper
          modules={[Navigation, Pagination, A11y, Keyboard]}
          // Conecta los botones externos una vez que exista el swiper
          onBeforeInit={(swiper) => {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          navigation={{ enabled: true }}
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          // touch y arrastre
          spaceBetween={16}
          slidesPerView={1.1}
          centeredSlides={true}
          centeredSlidesBounds={true}
          // breakpoints para columnas
          breakpoints={{
            640: { slidesPerView: 1.3, spaceBetween: 18, centeredSlides: true },
            768: { slidesPerView: 2,   spaceBetween: 18, centeredSlides: false },
            1024:{ slidesPerView: 3,   spaceBetween: 22, centeredSlides: false },
          }}
          className="pc-swiper"
        >
          {items.map((p) => (
            <SwiperSlide key={p.id} className="pc-slide">
              <ProjectCard {...p} />
            </SwiperSlide>
          ))}
        </Swiper>

        <button ref={nextRef} className="pc-nav pc-next" aria-label="Siguiente">
          {/* chevron der */}
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
            <path d="M8.5 5 15.5 12l-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </section>
  );
}
