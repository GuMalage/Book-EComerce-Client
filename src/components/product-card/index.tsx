import type { IProduct } from "@/commons/types";
import { Link } from "react-router-dom";
import AddToCartProvider from "../add-cart";
import "./card-component.css";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const precoFormatado = product.price
    ? product.price.toFixed(2).replace(".", ",")
    : "0,00";

  return (
    <div className="produto-card">
      <div className="image-container">
        <Link
          to={`/product/${product.id}`}
          className="link-produto"
          style={{ textDecoration: "none" }}
        >
          {product.urlImage ? (
            <img
              src={product.urlImage}
              alt={product.name}
            />
          ) : (
            <i
              className="pi pi-image placeholder-icon"
              style={{
                fontSize: "48px",
                color: "#ccc"
              }}
            />
          )}
        </Link>
      </div>

      <div
        className="card-body"
      >
        <Link
          to={`/product/${product.id}`}
          className="link-produto"
        >
          {product.name}
        </Link>


        <p className="text-muted">
          {product.autorName}
        </p>



        <p className="mb-1 mt-auto">
          <span className="preco">R$ {precoFormatado}</span>
        </p>


        <AddToCartProvider>
          {(addToCart) => (
            <button
              data-id={product.id}
              className="btn-adicionar-carrinho"
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