import './About.css';
import TextType from '../../components/TextType/TextType';

export default function About() {
  return (
    <div className="about" role="region" aria-label="Texto sobre mí">
      <div className="about__container">
        <TextType
          className="about__typed"
          text={[
            'Me dedico a diseñar y desarrollar experiencias digitales funcionales y con carácter propio.',
            'Trabajo con React y GSAP para crear interfaces fluidas, accesibles y de alto rendimiento.',
            'Pongo atención en cada detalle para reforzar la identidad y generar impacto real.'
          ]}
          typingSpeed={75}
          pauseDuration={1500}
          showCursor={true}
          cursorCharacter="|"
          startOnVisible={true}
          variableSpeed={{ min: 45, max: 95 }}
        />
      </div>
    </div>
  );
}
