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

const icons = [
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
];

export default function Skills() {
  return (
    <section id="skills" className="section skills" aria-label="Skills">
      <div className="skills__wrap">
        <ul className="skills__row" role="list">
          {icons.map((Icon, i) => (
            <li className="skills__item" key={i} role="listitem" aria-label="skill icon">
              <Icon />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
