import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { IProduct } from "@/commons/types";
import { Toast } from "primereact/toast";
import ProductService from "@/services/Product-service";
import { confirmDialog } from "primereact/confirmdialog";
import { toastRef } from "@/App";
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

        if (prodRes && prodRes.status === 200 && prodRes.data) {
         setProduct(prodRes.data as IProduct);
        } else {
          throw new Error(prodRes?.message || "Produto não encontrado.");
        }
      } catch (err: any) {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: err.message || "Falha ao carregar dados do servidor.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const addToCart = (product: IProduct) => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const alreadyInCartIndex = cart.findIndex(
        (item: IProduct) => item.id === product.id
      );
  
      if (alreadyInCartIndex !== -1) {
        confirmDialog({
          header: "Produto já no carrinho",
          message: (
            <div style={{ lineHeight: 1.6 }}>
              O produto <strong>{product.name}</strong> já está no seu carrinho. <br />
              Deseja adicionar <strong>mais uma unidade</strong>?
            </div>
          ),
          icon: "pi pi-shopping-cart",
          acceptLabel: "Adicionar mais 1",
          rejectLabel: "Cancelar",
          acceptClassName: "p-button-success",
          rejectClassName: "p-button-text",
          accept: () => {
            cart[alreadyInCartIndex].cartQuantity += 1;
            localStorage.setItem("cart", JSON.stringify(cart));
            toastRef.current?.show({
              severity: "success",
              summary: "Carrinho atualizado",
              detail: `Adicionada mais uma unidade de "${product.name}".`,
              life: 3000,
            });
          },
          reject: () => {
            toastRef.current?.show({
              severity: "info",
              summary: "Operação cancelada",
              detail: "Nenhuma alteração foi feita no carrinho.",
              life: 2500,
            });
          },
        });
        return;
      }
  
      product.cartQuantity = 1;
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
  
      toastRef.current?.show({
        severity: "success",
        summary: "Adicionado ao carrinho",
        detail: "O produto foi adicionado ao seu carrinho com sucesso!",
        life: 3000,
      });
    };

  if (loading) return <p>Carregando...</p>;
  if (!product) return <p>Produto não encontrado.</p>;

  return (
    <>
      <Toast ref={toast} />

      <section className="produto">
        <div className="imagem-produto">
          <img id="imagemPrincipal" src={product.img as string} alt={product.name} />
          <div className="subImagem-produto">
            <img className="subimagem" src={product.img as string} alt={product.name} />
            <img className="subimagem" src={product.img as string} alt={product.name} />
            <img className="subimagem" src={product.img as string} alt={product.name} />
          </div>
        </div>

        <div className="informacoes">
          <div>
            <div>
              <i className="fas fa-bolt desconto-cor"></i>
              <small className="desconto-stoque">Em Estoque</small>
            </div>

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
              data-id={product.id}
              className="btn-adicionar-carrinho w-100 mt-2"
              onClick={() => addToCart(product)}
            >
              Adicionar ao Carrinho
            </button>
          </div>

          <hr />
          <div className="frete-container">
            <div className="calcular-frete">
              <div>
                <input type="text" className="input-frete" id="cep" placeholder="Seu CEP" />
              </div>
              <div>
                <button type="submit" className="calcular-frete-button">
                  Calcular Frete
                </button>
              </div>
            </div>
            <div>
              <p className="frete-link">
                Não sabe seu CEP?{" "}
                <a
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Buscar CEP
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

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

            <div>
              {[80, 10, 6, 3, 1].map((pct, i) => (
                <div key={i} className="avaliacao-linha">
                  <span>{5 - i}</span>
                  <div className="barra">
                    <div className="barra-cor" style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="porcentagem">{pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductPage;
