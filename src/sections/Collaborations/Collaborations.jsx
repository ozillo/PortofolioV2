import "./Collaborations.css";

const CARDS = [
  {
    name: "Saüc Floristeria",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/178shots_so_sl7d7v.png",
    description: "Diseño visual y branding para floristería artesanal.",
    url: "http://xn--sacfloristeria-hsb.cat/",
  },
  {
    name: "DevLink",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141366/PortofolioMarcMateo/433shots_so_sm2qmq.png",
    description: "Plataforma para conectar desarrolladores con oportunidades.",
    url: "https://frontend-final-project-ip0mr7t7q.vercel.app/home",
  },
  {
    name: "Fem Camí",
    img: "https://res.cloudinary.com/dw9b8eqmc/image/upload/v1759141342/PortofolioMarcMateo/114shots_so_wgpxss.png",
    description: "Campaña comunitaria enfocada en la sostenibilidad.",
    url: "https://www.femcami.cat/",
  },
];

export default function Collaborations() {
  return (
    <section id="collaborations" className="collab" aria-label="Colaboraciones">
      <div className="collab__grid">
        {CARDS.map((c) => (
          <a
            key={c.name}
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            className="collab__card"
            aria-label={`Abrir ${c.name}`}
          >
            <figure className="collab__thumb">
              <img src={c.img} alt={c.name} loading="lazy" />
            </figure>
            <div className="collab__body">
              <h3 className="collab__name">{c.name}</h3>
              <p className="collab__desc">{c.description}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
