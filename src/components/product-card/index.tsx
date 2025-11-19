import type { IProduct } from "@/commons/types";
import { Link } from "react-router-dom";
import AddToCartProvider from "../add-cart";
import "./card-component.css";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const precoFormatado = product.price.toFixed(2).replace(".", ",");

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

        {/* ---- AQUI ENTRA O PROVIDER ---- */}
        <AddToCartProvider>
          {(addToCart) => (
            <button
              data-id={product.id}
              className="btn-adicionar-carrinho w-100 mt-2"
              onClick={() => addToCart(product)}
            >
              Adicionar ao Carrinho
            </button>
          )}
        </AddToCartProvider>
      </div>
    </div>
  );
};
