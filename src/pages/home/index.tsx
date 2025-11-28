import { useEffect, useState } from "react";
import type { IProduct } from "@/commons/types";
import { ProductCard } from "@/components/product-card";
import ProductService from "@/services/Product-service";
import "./home.css";
import leituraFimAno from "@/assets/leituraFimAno.jpg"
import feiraLivro from "@/assets/feiraLivro.jpeg"
import luxoLivro from "@/assets/luxoLivro.jpg"
import banner1 from "@/assets/banner1.jpg"
import banner2 from "@/assets/banner2.jpeg"
import { useNavigate } from "react-router-dom";
import acervo from "@/assets/lv1.jpg"
import fantasia from "@/assets/lv2.avif"
import ficcao from "@/assets/lv3.jpg"
import infantil from "@/assets/lv4.jpg"
import nacional from "@/assets/lv5.webp"
import romance from "@/assets/lv6.webp"
import misterio from "@/assets/lv7.jpg"


export const HomePage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { findAll: findAllProducts } = ProductService;

  const goToProducts = () => {
    navigate("/products")
  }

  const goToProduct = () => {
    navigate("/product/12")
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodRes = await findAllProducts();

        if (prodRes.status === 200 && Array.isArray(prodRes.data)) {
          // Aqui os produtos seriam, idealmente, livros.
          setProducts(prodRes.data);
        }
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);




  return (
    <>
      <section className="banner-inicio">
        <div className="banner-conteudo">
          <p className="mini-titulo">Descubra sua próxima grande leitura</p>
          <h1 className="frase-tema">
            Histórias que <br /> Transformam
          </h1>
          <p className="descricao">
            Mergulhe em nossa seleção de best-sellers, clássicos atemporais <br />
            e lançamentos exclusivos.
          </p>
          <div className="banner-botoes">
            <a href="#link" className="btn-colecao" onClick={goToProducts}>Explorar Livros</a>
            <a href="#" className="btn-saibamais" onClick={goToProducts}>Conheça Nossas Coleções</a>
          </div>
        </div>
        <div className="banner-imgs">
          <div className="banner-imgs-hover" onClick={() => navigate("/category/2")}>
            <img
              src={banner1}
              className="imagem-box1"
              alt="Capa de livro de fantasia"
            />
            <div>
              <h2 className="banner-link">Ficção</h2>
              <p>10 Títulos</p>
            </div>
          </div>

          <div className="banner-imgs-hover" onClick={() => navigate("/category/1")}>
            <img
              src={banner2}
              className="imagem-box2"
              alt="Capa de livro de não-ficção"
            />
            <div>
              <h2 className="banner-link">Fantasia</h2>
              <p>5 Títulos</p>
            </div>
          </div>
        </div>

      </section>
      <div className="linha-banner">
        <hr />
      </div>

      <section className="grade">

        <div
          className="grade-selecao"
          onClick={() => navigate("/products")}
          style={{ cursor: "pointer" }}
        >
          <img src={acervo} alt="Imagens livro" />
          <span>Nosso Acervo</span>
        </div>

        <div
          className="grade-selecao"
          onClick={() => navigate("/category/1")}
          style={{ cursor: "pointer" }}
        >
          <img src={fantasia} alt="Imagens livro" />
          <span>Fantasia</span>
        </div>

        <div
          className="grade-selecao"
          onClick={() => navigate("/category/2")}
          style={{ cursor: "pointer" }}
        >
          <img src={ficcao} alt="Imagens livro" />
          <span>Ficção Científica</span>
        </div>

        <div
          className="grade-selecao"
          onClick={() => navigate("/category/3")}
          style={{ cursor: "pointer" }}
        >
          <img src={infantil} alt="Imagens livro" />
          <span>Infantil</span>
        </div>

        <div
          className="grade-selecao"
          onClick={() => navigate("/category/4")}
          style={{ cursor: "pointer" }}
        >
          <img src={nacional} alt="Imagens livro" />
          <span>Literatura Nacional</span>
        </div>

        <div
          className="grade-selecao"
          onClick={() => navigate("/category/5")}
          style={{ cursor: "pointer" }}
        >
          <img src={misterio} alt="Imagens livro" />
          <span>Mistério</span>
        </div>

        <div
          className="grade-selecao"
          onClick={() => navigate("/category/6")}
          style={{ cursor: "pointer" }}
        >
          <img src={romance} alt="Imagens livro" />
          <span>Romance</span>
        </div>

      </section>


      <section className="product-page">
        <div className="cards-posicionamento" id="produtosContainer">
          {loading ? (
            <p>Carregando livros...</p>
          ) : (
            products.slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>


      <section className="noticias-fundo" id="noticias-unic">
        <div className="noticias-section-titulo">
          <h2>Últimas Notícias e Eventos Literários</h2>
          <p>Fique por dentro dos lançamentos, feiras e entrevistas com autores.</p>
        </div>

        <div className="noticias">
          <div className="noticias-card">
            <div className="data-noticia">

              <img src={feiraLivro} className="noticias-div-img" alt="Pessoas em uma feira de livros" />
              <div>
                <p><span className="destaque-texto-noticia">15</span><br />Set</p>
              </div>
            </div>
            <div className="noticias-titulo">
              <a href="https://www.cnnbrasil.com.br/educacao/festa-do-livro-da-usp-chega-a-27a-edicao-com-250-mil-titulos-e-220-editoras/">
                <h3>Feira Nacional do Livro USP: Conheça os Autores Confirmados</h3>
              </a>
              <p>Não perca a chance de encontrar seus escritores favoritos!</p>
            </div>
            <div className="noticias-link">
              <a href="https://www.cnnbrasil.com.br/educacao/festa-do-livro-da-usp-chega-a-27a-edicao-com-250-mil-titulos-e-220-editoras/">
                Saiba mais
              </a>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <div className="noticias-card">
            <div className="data-noticia">
              <img src={luxoLivro} className="noticias-div-img" alt="Pilha de livros novos" onClick={goToProduct} />
              <div>
                <p><span className="destaque-texto-noticia">01</span><br />Out</p>
              </div>
            </div>
            <div className="noticias-titulo">
              <a href="#">
                <h3 onClick={goToProduct}>Lançamento Exclusivo: Edição de Luxo Amanhecer na Colheita</h3>
              </a>
              <p>Garanta seu exemplar em pré-venda com desconto.</p>
            </div>
            <div className="noticias-link">
              <a href="#" onClick={goToProduct}>
                Compre agora
              </a>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>

          <div className="noticias-card">
            <div className="data-noticia">
              <img src={leituraFimAno} className="noticias-div-img" alt="Pessoas em um clube de leitura" />
              <div>
                <p><span className="destaque-texto-noticia">20</span><br />Nov</p>
              </div>
            </div>
            <div className="noticias-titulo">
              <a href="https://revistagalileu.globo.com/colunistas/sua-estante/coluna/2024/12/14-livros-para-ler-durante-as-ferias-de-fim-de-ano.ghtml">
                <h3>Dicas de Leitura para o Final de Ano</h3>
              </a>
              <p>Romances e biografias perfeitos para as férias.</p>
            </div>
            <div className="noticias-link">
              <a href="https://revistagalileu.globo.com/colunistas/sua-estante/coluna/2024/12/14-livros-para-ler-durante-as-ferias-de-fim-de-ano.ghtml">
                Veja a lista
              </a>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};