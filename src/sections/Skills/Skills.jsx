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
          <p className="skills__eyebrow">
            A PROBLEM IS A CHANCE FOR YOU TO DO YOUR BEST.
          </p>
          <h2 className="skills__title">Skills &amp; Experience</h2>

          <p className="skills__lead">
            The main area of expertise is front end development (client side of the web).
          </p>
          <p className="skills__desc">
            HTML, CSS, JS, building small and medium web applications with Vue or React, custom
            plugins, features, animations, and coding interactive layouts. I have also full-stack
            developer experience with one of the most popular open source CMS on the web - WordPress.
          </p>

          <p className="skills__linkline">
            Visit my <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a> for more details.
          </p>
        </header>

        <ul className="skills__grid" role="list">
          {skills.map(({ Icon, label }, i) => (
            <li className="skills__card" key={i} role="listitem" aria-label={label}>
              <span className="skills__icon"><Icon /></span>
              <span className="skills__label">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
