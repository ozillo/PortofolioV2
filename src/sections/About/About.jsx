import './About.css';

export default function About() {
  return (
    <div className="about" role="region" aria-label="Texto sobre mí">
      <div className="about__container">
        <h2 className="about__title">Sobre mí</h2>
        <p className="about__text">
          Me dedico a diseñar y desarrollar experiencias digitales funcionales y con carácter propio.
          Trabajo con <strong>React</strong> y <strong>GSAP</strong> para crear interfaces fluidas,
          accesibles y de alto rendimiento. Pongo atención en cada detalle para reforzar la identidad
          visual y generar impacto real.
        </p>
      </div>
    </div>
  );
}
