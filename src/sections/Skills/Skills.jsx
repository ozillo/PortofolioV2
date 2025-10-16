import React from "react";
import "./Skills.css";
import {
  SiReact,
  SiJavascript,
  SiHtml5,
  SiCss3,
  SiTailwindcss,
  SiFigma,
  SiGithub,
  SiNodedotjs,
  SiAdobephotoshop,
  SiAdobeillustrator,
  SiAdobeaftereffects,
  SiMysql,
  SiWordpress,
  SiFramer,
  SiWix,
} from "react-icons/si";

const skills = [
  { Icon: SiJavascript, label: "JavaScript" },
  { Icon: SiReact, label: "React" },
  { Icon: SiHtml5, label: "HTML5" },
  { Icon: SiCss3, label: "CSS3" },
  { Icon: SiTailwindcss, label: "Tailwind" },
  { Icon: SiFigma, label: "Figma" },
  { Icon: SiGithub, label: "GitHub" },
  { Icon: SiNodedotjs, label: "Node.js" },
  { Icon: SiAdobephotoshop, label: "Photoshop" },
  { Icon: SiAdobeillustrator, label: "Illustrator" },
  { Icon: SiAdobeaftereffects, label: "After Effects" },
  { Icon: SiMysql, label: "MySQL" },
  { Icon: SiWordpress, label: "WordPress" },
  { Icon: SiFramer, label: "Framer" },
  { Icon: SiWix, label: "Wix" },
];

export default function Skills() {
  return (
    <section id="skills" className="section skills" aria-label="Skills">
      <div className="skills__wrap">
        <header className="skills__header">
          <p className="skills__eyebrow">UN PROBLEMA ES UNA OPORTUNIDAD PARA QUE HAGAS LO MEJOR QUE PUEDAS.</p>
          <h2 className="skills__title">Hablidades &amp; Experiencia</h2>

          <p className="skills__lead">
          Mi principal área de especialización es el desarrollo front-end (del lado del cliente web).
          </p>
          <p className="skills__desc">
            HTML, CSS, JS, desarrollo de aplicaciones web pequeñas y medianas con Vue o React, plugins 
            personalizados, funciones, animaciones y programación de diseños interactivos. También tengo experiencia
             como desarrollador full-stack con uno de los CMS de código abierto más populares de la web: WordPress.
          </p>

          <p className="skills__linkline">
            Visita mi{" "}
            <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">
              LinkedIn
            </a>{" "}
            para mas detalles.
          </p>
        </header>

        <ul className="skills__grid" role="list">
          {skills.map(({ Icon, label }, i) => (
            <li className="skills__card" key={i} role="listitem" aria-label={label}>
              <span className="skills__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="skills__label">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
