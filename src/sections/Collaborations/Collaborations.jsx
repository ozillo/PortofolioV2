// sections/Collaborations/Collaborations.jsx
import "./Collaborations.css";

const SLIDES = [
  {
    type: "intro",
    title: "Portfolio & Previous\nProjects",
    text:
      "He construido distintos proyectos para cubrir necesidades reales de clientes. " +
      "Si quieres ver más ejemplos además de los que se muestran aquí, contáctame.",
    cta: { label: "See Projects", href: "#contact" },
  },
  {
    type: "card",
    name: "Saüc Floristeria",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/178shots_so_sl7d7v.png",
    description: "Diseño visual y branding para floristería artesanal.",
    url: "http://xn--sacfloristeria-hsb.cat/",
  },
  {
    type: "card",
    name: "DevLink",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141366/PortofolioMarcMateo/433shots_so_sm2qmq.png",
    description: "Plataforma para conectar desarrolladores con oportunidades.",
    url: "https://frontend-final-project-ip0mr7t7q.vercel.app/home",
  },
  {
    type: "card",
    name: "Fem Camí",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/114shots_so_wgpxss.png",
    description: "Campaña comunitaria enfocada en la sostenibilidad.",
    url: "https://www.femcami.cat/",
  },
];

export default function Collaborations() {
  return (
    <div className="collab" aria-label="Colaboraciones">
      <div className="collab__viewport" role="region" aria-roledescription="Carrusel">
        <div className="collab__track" role="list">
          {SLIDES.map((s, i) =>
            s.type === "intro" ? (
              <section className="collab__slide" role="listitem" key={i}>
                <div className="collab__panel">
                  <h2 className="collab__title">{s.title}</h2>
                  <p className="collab__text">
                    He construido distintos proyectos para cubrir necesidades reales de clientes. Si quieres ver más ejemplos además de los que se muestran aquí,{" "}
                    <a className="collab__link" href="#contact">contáctame</a>.
                  </p>
                  <a className="collab__btnLink" href={s.cta.href}>{s.cta.label}</a>
                </div>
              </section>
            ) : (
              <a
                className="collab__slide"
                role="listitem"
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Abrir ${s.name}`}
              >
                <article className="collab__panel">
                  <figure className="collab__thumb">
                    <img src={s.img} alt={s.name} loading="lazy" />
                  </figure>
                  <h3 className="collab__name">{s.name}</h3>
                  <p className="collab__desc">{s.description}</p>
                </article>
              </a>
            )
          )}
        </div>
      </div>
    </div>
  );
}
