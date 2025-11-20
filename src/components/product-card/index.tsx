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
      <div className="position-relative">
        <Link
          to={`/product/${product.id}`}
          className="link-produto"
          style={{ textDecoration: "none" }}
        >
          <img
            src={product.img as string}
            className="card-img-top"
            alt={`Capa do Livro: ${product.name}`}
          />
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

        {(product as any).author && (
          <p className="text-muted">
            {(product as any).author}
          </p>
        )}

        <p className="mb-1 mt-auto">
          <span className="preco">R$ {precoFormatado}</span>
        </p>

        <div className="estrelas" aria-label="Avaliação 4 de 5 estrelas">
          ★★★★☆
        </div>

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
