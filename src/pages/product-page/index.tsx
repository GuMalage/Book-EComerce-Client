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

  if (loading) return <p>Carregando...</p>;
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <>
      <Toast ref={toast} />

      <AddToCartProvider>
        {(addToCart) => (
          <section className="produto">
            <div className="imagem-produto">
              <img id="imagemPrincipal" src={product.img as string} alt={product.name} />

              <div className="subImagem-produto">
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

            <div className="informacoes">
              <div>
                <small className="desconto-stoque">Em Estoque</small>

                <div className="nome-produto">
                  <h2>{product.name}</h2>
                </div>

                <div className="preco">
                  <p className="preco-cor">R$ {product.price}</p>
                </div>

                <hr />

                <div className="conteudo">
                  <p>{product.description}</p>
                </div>
              </div>

              <div className="acoes">
                <button
                  className="btn-adicionar-carrinho w-100 mt-2"
                  onClick={() => addToCart(product)}
                >
                  Adicionar ao Carrinho
                </button>
              </div>

              <hr />

              <div className="frete-container">
                <div className="calcular-frete">
                  <input type="text" className="input-frete" placeholder="Seu CEP" />
                  <button className="calcular-frete-button">Calcular Frete</button>
                </div>

                <p className="frete-link">
                  Não sabe seu CEP?{" "}
                  <a
                    href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                    target="_blank"
                  >
                    Buscar CEP
                  </a>
                </p>
              </div>
            </div>
          </section>
        )}
      </AddToCartProvider>

      <section className="descricao-avaliacao-container">
        <div className="descricao-titulo">
          <h2>Descrição</h2>
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
