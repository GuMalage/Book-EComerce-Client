import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/Product-service";
import { Toast } from "primereact/toast";
import AddToCartProvider from "@/components/add-cart";
import "./product-page.css";


export const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useRef<Toast>(null);

  const { findById } = ProductService;

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!id) throw new Error("ID do produto não informado.");

        const prodRes = await findById(Number(id));

        if (prodRes?.status === 200 && prodRes.data) {
          setProduct(prodRes.data as IProduct);
        } else {
          throw new Error("Produto não encontrado.");
        }
      } catch (err: any) {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: err.message,
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <p className="loading-message">Carregando...</p>;
  if (!product) return <p className="error-message">Produto não encontrado.</p>;
  
  const precoFormatado = product.price ? product.price.toFixed(2).replace(".", ",") : "0,00";

  return (
    <>
      <Toast ref={toast} />

      <AddToCartProvider>
        {(addToCart) => (
          <section className="produto-livro">
            <div className="imagem-produto-livro">
              <img id="imagemPrincipal" src={product.img as string} alt={product.name} />

              <div className="subImagem-produto-livro">
                {[1, 2, 3].map((i) => (
                  <img
                    key={i}
                    className="subimagem"
                    src={product.img as string}
                    alt={product.name}
                  />
                ))}
              </div>
            </div>

            <div className="informacoes-livro">
              <div>
                <small className="status-estoque">Em Estoque</small>

                <div className="nome-produto-livro">
                  <h1>{product.name}</h1>
                </div>

                {product.author && (
                    <p className="autor-livro">
                        Por: <strong>{product.author}</strong>
                    </p>
                )}

                <div className="preco-livro">
                  <p className="preco-cor">R$ {precoFormatado}</p>
                </div>
                
                <div className="estrelas-avaliacao">★★★★★ (4.5/5)</div>
                <hr className="divider" />

                <div className="conteudo-livro">
                  <p>{product.description}</p>
                </div>
              </div>

              <div className="acoes-livro">
                <button
                  className="btn-adicionar-carrinho"
                  onClick={() => addToCart(product)}
                >
                  Adicionar ao Carrinho
                </button>
              </div>

              <hr className="divider" />
            </div>
          </section>
        )}
      </AddToCartProvider>

      <section className="descricao-avaliacao-container">
        <div className="descricao-titulo">
          <h2>Detalhes do Livro e Avaliações</h2>
          <hr />
        </div>

        <div className="descricao-avaliacao">
          <div className="descricao">
            <p>{product.description}</p>
          </div>

          <div className="avaliacao">
            <div className="avaliacao-principal">
              <h3>
                4.5<span>/5</span>
              </h3>
              <div className="estrelas">★★★★★</div>
              <p className="qnt-avaliacoes">Baseado em 125 Avaliações</p>
            </div>
          
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;