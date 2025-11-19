import { useRef } from "react";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import type { IProduct } from "@/commons/types";

interface AddToCartProps {
  children: (addToCart: (product: IProduct) => void) => React.ReactNode;
}

export default function AddToCartProvider({ children }: AddToCartProps) {
  const toastRef = useRef<Toast>(null);

  const addToCart = (product: IProduct) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const index = cart.findIndex((item: IProduct) => item.id === product.id);

    if (index !== -1) {
      confirmDialog({
        header: "Produto já no carrinho",
        message: (
          <div style={{ lineHeight: 1.6 }}>
            O produto <strong>{product.name}</strong> já está no carrinho. <br />
            Deseja adicionar <strong>mais uma unidade</strong>?
          </div>
        ),
        icon: "pi pi-shopping-cart",
        acceptLabel: "Adicionar mais 1",
        rejectLabel: "Cancelar",
        acceptClassName: "p-button-success",
        rejectClassName: "p-button-text",

        accept: () => {
          cart[index].cartQuantity += 1;
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
      detail: "O produto foi adicionado com sucesso!",
      life: 3000,
    });
  };

  return (
    <>
      <Toast ref={toastRef} position="top-center" />
      {children(addToCart)}
    </>
  );
}
