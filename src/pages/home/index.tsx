import React, { useEffect, useState } from "react";
import type { IProduct } from "@/commons/types";
import { ProductCard } from "@/components/product-card";
import ProductService from "@/services/Product-service";
import "./card.css";
import "./index.css";


export const HomePage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const { findAll: findAllProducts } = ProductService;

  useEffect(() => {
    const loadData = async () => {
      try {
        const prodRes = await findAllProducts();

        if (prodRes.status === 200 && Array.isArray(prodRes.data)) {
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
          <p className="mini-titulo">Transforme seu lar com estilo e personalidade</p>
          <h1 className="frase-tema">
            Detalhes que <br /> Encantam
          </h1>
          <p className="descricao">
            Explore nossa seleção exclusiva de adesivos decorativos, quadros modernos <br />
            e vasos elegantes.
          </p>
          <div className="banner-botoes">
            <a href="#link" className="btn-colecao">Coleção Completa</a>
            <a href="#" className="btn-saibamais">Saiba mais</a>
          </div>
        </div>

        <div className="banner-meio">
          <div className="folha-posicao">
            <img src="img/imgBanner/folha.png" className="folha-tamanho" alt="Folha Decorativa" />
          </div>
        </div>

        <div className="banner-imgs">
          <div className="banner-imgs-hover">
            <img src="img/imgBanner/profissoes.webp" className="imagem-box1" alt="Quadro decorativo" />
            <div>
              <h2><a href="#">Quadros</a></h2>
              <p>9 Produtos</p>
            </div>
          </div>

          <div className="banner-imgs-hover">
            <img src="img/imgBanner/folhabanner.webp" className="imagem-box2" alt="Adesivo decorativo" />
            <div>
              <h2><a href="#">Adesivos</a></h2>
              <p>5 Produtos</p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="cards-produtos">
        <div className="cards-posicionamento" id="produtosContainer">
          {loading ? (
            <p>Carregando produtos...</p>
          ) : (
            products.slice(0, 12).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      <section className="noticias-fundo">
        <div className="noticias-section-titulo">
          <h2>Últimas Notícias e Eventos</h2>
          <p>Não perca as novidades do mundo da decoração ou os próximos eventos do nosso site</p>
        </div>

        <div className="noticias">
          <div className="noticias-card">
            <div className="data-noticia">
              <img src="img/imgNoticias/sustentavel.jpg" className="noticias-div-img" alt="Quadro com moldura" />
              <div>
                <p><span className="destaque-texto-noticia">25</span><br />Abr</p>
              </div>
            </div>
            <div className="noticias-titulo">
              <a href="https://didigalvao.com.br/arte-e-sustentabilidade-opcoes-de-quadros-decorativos-eco-friendly/">
                <h3>Quadros Feitos com Materiais Sustentáveis e Reciclados</h3>
              </a>
              <p>A Loyalty super apoia essa luta. Conheça nossa linha Eco.</p>
            </div>
            <div className="noticias-link">
              <a href="https://didigalvao.com.br/arte-e-sustentabilidade-opcoes-de-quadros-decorativos-eco-friendly/">
                Continue lendo
              </a>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
        

      
          <div className="noticias-card">
            <div className="data-noticia">
              <img src="img/imgNoticias/sustentavel.jpg" className="noticias-div-img" alt="Quadro com moldura" />
              <div>
                <p><span className="destaque-texto-noticia">25</span><br />Abr</p>
              </div>
            </div>
            <div className="noticias-titulo">
              <a href="https://didigalvao.com.br/arte-e-sustentabilidade-opcoes-de-quadros-decorativos-eco-friendly/">
                <h3>Quadros Feitos com Materiais Sustentáveis e Reciclados</h3>
              </a>
              <p>A Loyalty super apoia essa luta. Conheça nossa linha Eco.</p>
            </div>
            <div className="noticias-link">
              <a href="https://didigalvao.com.br/arte-e-sustentabilidade-opcoes-de-quadros-decorativos-eco-friendly/">
                Continue lendo
              </a>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
     
          <div className="noticias-card">
            <div className="data-noticia">
              <img src="img/imgNoticias/sustentavel.jpg" className="noticias-div-img" alt="Quadro com moldura" />
              <div>
                <p><span className="destaque-texto-noticia">25</span><br />Abr</p>
              </div>
            </div>
            <div className="noticias-titulo">
              <a href="https://didigalvao.com.br/arte-e-sustentabilidade-opcoes-de-quadros-decorativos-eco-friendly/">
                <h3>Quadros Feitos com Materiais Sustentáveis e Reciclados</h3>
              </a>
              <p>A Loyalty super apoia essa luta. Conheça nossa linha Eco.</p>
            </div>
            <div className="noticias-link">
              <a href="https://didigalvao.com.br/arte-e-sustentabilidade-opcoes-de-quadros-decorativos-eco-friendly/">
                Continue lendo
              </a>
              <i className="fa-solid fa-arrow-right"></i>
            </div>
          </div>
          </div>
      </section>
    </>
  );
};
