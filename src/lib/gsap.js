import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


if (!gsap.core.globals().ScrollTrigger) {
gsap.registerPlugin(ScrollTrigger);
}


export { gsap, ScrollTrigger };