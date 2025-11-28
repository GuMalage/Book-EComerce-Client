import "./about-us.css";

export default function AboutUs() {
  return (
    <div className="about-wrapper">

      <section className="about-hero">
        <h4 className="about-subtitle">CONHEÇA NOSSA ESSÊNCIA</h4>
        <h1 className="about-title">Quem Somos</h1>
        <p className="about-description">
          Conectamos leitores às histórias que inspiram, emocionam e transformam.
          Acreditamos no poder dos livros como portas para novos mundos e novas ideias.
        </p>
      </section>

      <section className="quote-section">
        <blockquote className="quote-text">
          “Um leitor vive mil vidas antes de morrer. O homem que nunca lê vive apenas uma.”
        </blockquote>
        <p className="quote-author">— George R. R. Martin</p>
      </section>

    </div>
  );
}
