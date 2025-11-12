import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faYoutube,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import "./footer-component.css";
import mastercard from "@/assets/mastercard@2x.png";
import visa from "@/assets/visa@2x.png";
import boleto from "@/assets/boleto@2x.png";
import pix from "@/assets/pix@2x.png";

export function Footer() {
  return (
    <footer>
      <hr className="linha-rodape" />

      <section className="rodape">
        <div className="informacoes-contato">
          <div>
            <div className="politicas">
              <img src="img/imgLogo/logo-fundo.png" alt="Logo Loyalty" />
              <div className="politica-hover">
                <a href="#">Institucional</a>
              </div>
              <div className="politica-hover">
                <a href="#">Dúvidas</a>
              </div>
              <div className="politica-hover">
                <a href="#">Política De Privacidade</a>
              </div>
            </div>
          </div>

          <div className="forma-pagamento">
            <img src={visa} alt="Visa" />
            <img src={mastercard} alt="MasterCard" />
            <img src={boleto} alt="Boleto" />
            <img src={pix} alt="Pix" />
          </div>
        </div>

        <div className="redes-sociais">
          <div>
            <h2>SIGA-NOS:</h2>
          </div>
          <div className="icones-flex">
            <div className="icones">
              <a href="#">
                <FontAwesomeIcon icon={faFacebookF} className="cor-tamanho-icone" />
              </a>
            </div>
            <div className="icones">
              <a href="#">
                <FontAwesomeIcon icon={faInstagram} className="cor-tamanho-icone" />
              </a>
            </div>
            <div className="icones">
              <a href="#">
                <FontAwesomeIcon icon={faYoutube} className="cor-tamanho-icone" />
              </a>
            </div>
            <div className="icones">
              <a href="#">
                <FontAwesomeIcon icon={faTwitter} className="cor-tamanho-icone" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="direitos-autorais">
        <div className="direitos-autorais-estilo">
          <h3>
            &copy;2025 <span className="destaque-texto">Loyalty</span>. Todos os
            direitos reservados.
          </h3>
        </div>
      </section>
    </footer>
  );
}

export default Footer;
