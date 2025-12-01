import { useEffect, useState } from "react";
import type { IProduct } from "@/commons/types";
import { NavLink, useNavigate } from "react-router-dom";
import AuthService from "@/services/Auth-service";
import { confirmDialog } from "primereact/confirmdialog";
import { toastRef } from "@/App";
import { Link } from "react-router-dom";
import "./cart-page.css";

export function CartPage() {
  const [cart, setCart] = useState<IProduct[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const stored = JSON.parse(localStorage.getItem("cart") || "[]").map(
      (p: any, index: number) => ({
        ...p,
        id: p.id ?? p._id ?? index,
        cartQuantity: p.cartQuantity || 1,
      })
    );
    setCart(stored);
  };

  const saveCart = (updated: IProduct[]) => {
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const increaseQuantity = (id: number) => {
    const updated = cart.map((p) =>
      p.id === id ? { ...p, cartQuantity: p.cartQuantity + 1 } : p
    );
    saveCart(updated);
  };

  const decreaseQuantity = (id: number) => {
    const product = cart.find((p) => p.id === id);
    if (!product) return;

    if (product.cartQuantity === 1) {
      confirmDialog({
        header: "Remover produto",
        message: (
          <div style={{ lineHeight: 1.6 }}>
            Deseja realmente remover <strong>{product.name}</strong> do carrinho?
          </div>
        ),
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Remover",
        rejectLabel: "Cancelar",
        acceptClassName: "p-button-danger",
        rejectClassName: "p-button-text",
        accept: () => {
          const updated = cart.filter((p) => p.id !== id);
          saveCart(updated);
          toastRef.current?.show({
            severity: "success",
            summary: "Removido",
            detail: `"${product.name}" foi removido do carrinho.`,
            life: 3000,
          });
        },
        reject: () => {
          toastRef.current?.show({
            severity: "info",
            summary: "Cancelado",
            detail: "O produto não foi removido.",
            life: 2500,
          });
        },
      });
    } else {
      const updated = cart.map((p) =>
        p.id === id ? { ...p, cartQuantity: p.cartQuantity - 1 } : p
      );
      saveCart(updated);
    }
  };


  const confirmRemove = (product: IProduct) => {
    confirmDialog({
      header: "Remover produto",
      message: (
        <div style={{ lineHeight: 1.6 }}>
          Deseja realmente remover <strong>{product.name}</strong> do carrinho?
        </div>
      ),
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Remover",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-text",
      accept: () => {
        const updated = cart.filter((p) => p.id !== product.id);
        saveCart(updated);
        toastRef.current?.show({
          severity: "success",
          summary: "Removido",
          detail: `"${product.name}" foi removido do carrinho.`,
          life: 3000,
        });
      },
      reject: () => {
        toastRef.current?.show({
          severity: "info",
          summary: "Cancelado",
          detail: "O produto não foi removido.",
          life: 2500,
        });
      },
    });
  };

  const subtotal = cart.reduce(
    (acc, p) => acc + p.price * (p.cartQuantity || 1),
    0
  );

  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleCheckout = () => {
    
    if(cart.length === 0){
      toastRef.current?.show({
          severity: "info",
          summary: "Alerta",
          detail: "O Carrinho está vazio, adicione itens para finalizar o pedido",
          life: 2500,
        });
        navigate("/home")
    }
    else if(AuthService.isAuthenticated()){
      navigate("/checkout");
    } 
    else {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      navigate("/login");
    }
  };

  return (
    <div className="container">
      <div className="carrinho">
        <div className="titulo-carrinho-wrapper">
          <h2 className="titulo-resumo">
            Carrinho de Compras{" "}
            <span id="contadorResumoItens" className="contador-itens">
              ({cart.length} {cart.length === 1 ? "item" : "itens"})
            </span>
          </h2>
        </div>

        <div className="carrinho-itens" id="carrinhoContainer">
          {cart.length === 0 ? (
            <p>Seu carrinho está vazio 😢</p>
          ) : (
            cart.map((produto) => (
              <div key={produto.id} className="carrinho-item">



                {/* IMAGEM CLICÁVEL */}
                <Link to={`/product/${produto.id}`}>
                  <img
                    src={produto.urlImage}
                    alt={produto.name}
                    className="img-produto"
                  />
                </Link>

                <div className="carrinho-info">
                  {/* NOME CLICÁVEL */}
                  <Link
                    to={`/product/${produto.id}`}
                    className="link-produto nome-produto-carrinho"
                    style={{ textDecoration: "none" }}
                  >
                    {produto.name}
                  </Link>
                  <p>Preço unitário: {formatPrice(produto.price)}</p>

                  <div className="quantidade">
                    <button
                      className="btn-diminuir"
                      onClick={() => decreaseQuantity(produto.id)}
                    >
                      -
                    </button>

                    <span>{produto.cartQuantity}</span>

                    <button
                      className="btn-aumentar"
                      onClick={() => increaseQuantity(produto.id)}
                    >
                      +
                    </button>
                  </div>

                  <p>
                    <strong>
                      Subtotal:{" "}
                      {formatPrice(produto.price * produto.cartQuantity)}
                    </strong>
                  </p>
                </div>

                <button
                  className="btn-remover"
                  onClick={() => confirmRemove(produto)}
                >
                  <svg
                    className="icon-trash"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M16 9v10H8V9h8zm-1.5-6h-5L9 4.5H4v2h16v-2h-5l-.5-1.5zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                  </svg>
                </button>

              </div>
            ))
          )}


        </div>

        <NavLink to="/" className="voltar">
          ← Voltar para a loja
        </NavLink>
      </div>

      <div className="resumo">
        <h3>Resumo da Compra</h3>
        <p>Total:</p>
        <div className="total" id="totalCarrinho">
          {formatPrice(subtotal)}
        </div>
        <button className="finalizar" onClick={handleCheckout}>
          FINALIZAR COMPRA
        </button>
      </div>
    </div>
  );
}
