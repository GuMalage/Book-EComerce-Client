import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import logo from "@/assets/logo_transparent.png";
import "./top-menu.css";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars } from "react-icons/fa";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const { authenticated, handleLogout } = useAuth();

  const logout = () => {
    handleLogout();
    navigate("/login");
  };

  const cart = () => {
    navigate("/cart");
  }

  const login = () => {
    navigate("/login");
  }

  const profile = () => {
    navigate("/profile");
  }

  const aboutUs = () => {
    navigate("about-us");
  }

  const toggleMenu = () => {
    const menu = document.querySelector(".navbar-div-menu");
    menu?.classList.toggle("active");
  };

  const toggleSubmenu = () => {
    const submenu = document.querySelector(".submenu-items");
    submenu?.classList.toggle("open");
  };

  return (
    <section id="navbar-rool">

      <div className="navbar-navbar-cor">
        <div className="navbar-navbar">


          <div className="navbar-div-menu">
            <div className="logo">
              <a onClick={() => navigate("/home")}>
                <img src={logo} alt="Logo Loyalty" />
              </a>
            </div>

            <ul>
              <li><a href="/home">Início</a></li>

              <li className="submenu">
                <a className="submenu-toggle" href="#" onClick={toggleSubmenu}>Categorias</a>
                <ul className="submenu-items">
                  <li><a href="#" onClick={() => navigate("/products")}>Acervo</a></li>
                  <li><a href="#" onClick={() => navigate("/category/1")}>Fantasia</a></li>
                  <li><a href="#" onClick={() => navigate("/category/2")}>Ficção Científica</a></li>
                  <li><a href="#" onClick={() => navigate("/category/3")}>Infantil</a></li>
                  <li><a href="#" onClick={() => navigate("/category/4")}>Literatura Nacional</a></li>
                  <li><a href="#" onClick={() => navigate("/category/5")}>Mistério</a></li>
                  <li><a href="#" onClick={() => navigate("/category/6")}>Romance</a></li>
                </ul>
              </li>

              <li><a href="#" onClick={aboutUs}>Sobre Nós</a></li>
              <li><a href="/#noticias-unic">Noticias</a></li>
            </ul>
          </div>

          <button className="menu-toggle" onClick={toggleMenu}>
            <FaBars />
          </button>


          <div className="icones-nav">
            <a className="icone-item" href="#" onClick={cart}>
              <FaShoppingCart className="icone" />
              <span>Carrinho</span>
            </a>

            {!authenticated && (
              <a className="icone-item" href="#" onClick={login}>
                <FaUser className="icone" />
                <span>Login</span>
              </a>)}

            {authenticated && (
              <a className="icone-item" href="#" onClick={profile}>
                <FaUser className="icone" />
                <span>Perfil</span>
              </a>)}

            {authenticated && (

              <a className="icone-item" href="#" onClick={logout}>
                <FaSignOutAlt className="icone" />
                <span>Sair</span>
              </a>)}
          </div>

        </div>
      </div>



    </section>
  );
};

export default TopMenu;
