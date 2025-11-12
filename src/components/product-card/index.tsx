import type { IProduct } from "@/commons/types";
import { Link } from "react-router-dom";
import { confirmDialog } from "primereact/confirmdialog";
import { toastRef } from "@/App";
import "./card-component.css";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const precoFormatado = product.price.toFixed(2).replace(".", ",");

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

  return (
    <div className="card border-0">
      <div className="position-relative">
        <Link
          to={`/product/${product.id}`}
          className="link-produto"
          style={{ textDecoration: "none" }}
        >
          <img
            src={product.img as string}
            className="card-img-top"
            alt={product.name}
          />
        </Link>
      </div>

      <div className="card-body p-2 card-hover">
        <Link
          to={`/product/${product.id}`}
          className="fw-bold link-produto"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {product.name}
        </Link>

        <div className="progress mb-2" style={{ height: "6px" }}>
          <div className="progress-bar" style={{ width: "80%" }}></div>
        </div>

        <p className="mb-1 fw-bold">
          <span className="preco">R$ {precoFormatado}</span>
        </p>

        <div className="text-warning estrelas">★★★★☆</div>

        <button
          data-id={product.id}
          className="btn-adicionar-carrinho w-100 mt-2"
          onClick={() => addToCart(product)}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
};
