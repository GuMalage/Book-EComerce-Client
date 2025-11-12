import { useState } from "react";
import type { IProduct } from "@/commons/types";

export function useAddToCart() {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const addToCart = (product: IProduct) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");

    const selectedProduct = cart.find((item: IProduct) => item.id === product.id);
    if (selectedProduct) {
      setAlertMessage("Esse produto já foi adicionado ao carrinho.");
      return;
    }

    product.cartQuantity = 1;
    cart.push(product);
    localStorage.setItem("cart", JSON.stringify(cart));

    setToastMessage("Produto adicionado ao carrinho com sucesso!");

    setTimeout(() => setToastMessage(null), 3000);
  };

  return {
    addToCart,
    alertDialog: alertMessage && (
      <div className="alert-overlay">
        <div className="alert-box">
          <h3>Produto já no carrinho</h3>
          <p>{alertMessage}</p>
          <button onClick={() => setAlertMessage(null)}>OK</button>
        </div>
      </div>
    ),
    toast: toastMessage && (
      <div className="toast">{toastMessage}</div>
    ),
  };
}
