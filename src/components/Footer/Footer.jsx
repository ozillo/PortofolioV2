import './Footer.css'


export default function Footer() {
return (
<footer className="footer">
<div className="container footer__inner">
<span>© {new Date().getFullYear()} Marc Mateo</span>
</div>
</footer>
)
}