import './About.css';
import TextType from '../../components/TextType/TextType';

export default function About() {
  return (
    <div className="about" role="region" aria-label="Texto sobre mí">
      <div className="about__container">
        <TextType
          className="about__typed"
          text={[
            'Soy un Frontend Developer centrado en React, GSAP y UI fluidas.',
            'Me gusta la performance, la accesibilidad y los microdetalles.',
            'Siempre preparado para crear nuevas experiencias de diseño.'
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
