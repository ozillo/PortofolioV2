import Lenis from '@studio-freight/lenis';


let lenis;


export function initLenis() {
if (lenis) return lenis;
lenis = new Lenis({
lerp: 0.1,
wheelMultiplier: 1,
smoothWheel: true,
smoothTouch: false,
});


function raf(time) {
lenis.raf(time);
requestAnimationFrame(raf);
}
requestAnimationFrame(raf);


return lenis;
}


export function getLenis() {
return lenis;
}