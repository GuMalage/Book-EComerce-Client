// CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import OrderService from "@/services/Order-service";
import AddressService from "@/services/Address-service";
import ShippingCalculator from "@/components/shipping-calculator";
import type { IOrder, IProduct, ShippingOption } from "@/commons/types";
import "./checkout-page.css"

interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  zip: string;
}

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);
  const [selectedAddressZip, setSelectedAddressZip] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [installments, setInstallments] = useState<number>(1);
  const [pendingOrder, setPendingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<IProduct[]>([]);
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
    loadCartItems();
  }, []);

  const loadAddresses = async () => {
  try {
    const response = await AddressService.findAll();
    if (response) {
      setAddresses(response as unknown as Address[]); 
    }
  } catch (error) {
    console.error("Erro ao carregar endereços:", error);
  }
};


  const loadCartItems = () => {
    const cartString = localStorage.getItem("cart");
    if (cartString) {
      const parsedCart: IProduct[] = JSON.parse(cartString);
      setCartItems(parsedCart);
    }
  };

  const handleSelectAddress = (id: number | undefined, zip: string) => {
    setSelectedAddress(id ?? null);
    setSelectedAddressZip(zip);
  };

  const handleFinishOrder = async () => {
    if (!selectedAddress || !paymentMethod || !selectedShipping) {
      alert("Selecione endereço, forma de envio e método de pagamento");
      return;
    }

    if (!cartItems.length) {
      alert("Não há item no carrinho");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.cartQuantity,
    }));

    const subtotal = cartItems.reduce(
      (acc, item) => acc + item.price * item.cartQuantity,
      0
    );
    const total = subtotal + parseFloat(selectedShipping.price || "0");

    const order: IOrder = {
      shipping: parseFloat(selectedShipping.price || "0"),
      paymentType: paymentMethod.toUpperCase().replace(" ", "_"),
      addressId: selectedAddress,
      itemsList: orderItems,
      total: total,
      shippingType: selectedShipping.name, // ✅ salva o tipo de envio
    };

    setPendingOrder(true);
    setOrderError(null);
    setOrderSuccess(null);

    try {
      const response = await OrderService.save(order);
      if (response.status === 200 || response.status === 201) {
        setOrderSuccess("Pedido realizado com sucesso");
        localStorage.removeItem("cart");
        navigate("/profile", { state: { order: response.data } });
      } else {
        setOrderError("Falha ao finalizar o pedido.");
      }
    } catch (error) {
      console.error("Erro ao finalizar pedido:", error);
      setOrderError("Falha ao finalizar o pedido.");
    } finally {
      setPendingOrder(false);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.cartQuantity,
    0
  );
  const shippingCost = parseFloat(selectedShipping?.price || "0");
  const total = subtotal + shippingCost;

  return (
    <main className="checkout-container py-4">
      <h1 className="fw-bold mb-4">Finalização da compra</h1>

      {/* Endereços */}
      <div className="mb-4">
        <h5>Selecione o endereço de entrega</h5>
        <div
          style={{
            maxHeight: "200px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          {addresses.length > 0 ? (
            addresses.map((addr) => (
              <div
                key={addr.id}
                onClick={() => handleSelectAddress(addr.id, addr.zip)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  marginBottom: "5px",
                  cursor: "pointer",
                  background:
                    selectedAddress === addr.id ? "#eee" : "#fff",
                  border: "1px solid #ccc",
                }}
              >
                <p className="m-0">
                  {addr.street}, {addr.city}, {addr.state} - {addr.zip}
                </p>
              </div>
            ))
          ) : (
            <p>Nenhum endereço cadastrado</p>
          )}
        </div>
        <button
          className="btn btn-danger mt-3"
          onClick={() => navigate("/address")}
        >
          Adicionar endereço
        </button>
      </div>

   
<div className="mb-4">
  <h5>Forma de envio</h5>

  <div className="border rounded p-3">
    <select
      className="form-select"
      value={selectedShipping?.name || ""}
      onChange={(e) => {
        const val = e.target.value;

        const option =
          val === "PAC"
            ? { id: 1, name: "PAC", price: "15.00", delivery_time: 5 }
            : val === "SEDEX"
            ? { id: 2, name: "SEDEX", price: "25.00", delivery_time: 2 }
            : val === "Retirada"
            ? { id: 3, name: "Retirada", price: "0.00", delivery_time: 0 }
            : null;

        setSelectedShipping(option);
      }}
    >
      <option value="">Selecione...</option>
      <option value="PAC">PAC - R$15,00 (5 dias úteis)</option>
      <option value="SEDEX">SEDEX - R$25,00 (2 dias úteis)</option>
      <option value="Retirada">Retirada na loja - Grátis</option>
    </select>
  </div>
</div>






      {/* Método de pagamento */}
      <div className="mb-4">
        <h5>Método de pagamento</h5>
        <div className="border rounded p-3">
          <select
            className="form-select"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              if (e.target.value === "credit card") setInstallments(1);
            }}
          >
            <option value="">Selecione...</option>
            <option value="credit card">Cartão de crédito</option>
            <option value="bank transfer">Pix</option>
          </select>

          {paymentMethod === "credit card" && (
            <div className="mt-3">
              <label htmlFor="installments" className="form-label">
                Número de parcelas
              </label>
              <select
                id="installments"
                className="form-select"
                value={installments}
                onChange={(e) => setInstallments(Number(e.target.value))}
              >
                {[...Array(10)].map((_, index) => (
                  <option key={index + 1} value={index + 1}>
                    {index + 1}x R${(total / (index + 1)).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Itens do pedido */}
      <div className="card mb-4">
        <div className="card-header bg-light">
          <h5 className="m-0">Itens do pedido</h5>
        </div>
        <div className="card-body">
          {cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-center mb-3 border-bottom pb-2"
              >
                <img
                  src={item.img as string}
                  alt={item.name}
                  style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  className="me-3 rounded"
                />
                <div>
                  <strong>{item.name}</strong>
                  <p className="mb-0">Preço: R${item.price.toFixed(2)}</p>
                  <p className="mb-0">Quantidade: {item.cartQuantity}</p>
                </div>
              </div>
            ))
          ) : (
            <p>Sem itens no carrinho</p>
          )}
        </div>
      </div>

      {/* Resumo */}
      <div className="border rounded p-3 mb-4">
        <h5>Resumo do pedido</h5>
        <div className="d-flex justify-content-between">
          <span>Subtotal:</span>
          <span>R${subtotal.toFixed(2)}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span>Frete:</span>
          <span>R${shippingCost.toFixed(2)}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between fw-bold">
          <span>Total:</span>
          <span>R${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Botões */}
      <div className="text-center">
        <NavLink to="/" className="btn btn-outline-danger me-3">
          Continuar comprando
        </NavLink>
        <button
          className="btn btn-danger btn-lg"
          onClick={handleFinishOrder}
          disabled={pendingOrder}
        >
          {pendingOrder ? "Finalizando..." : "Finalizar pedido"}
        </button>
      </div>

      {orderError && <p className="text-danger mt-3">{orderError}</p>}
      {orderSuccess && <p className="text-success mt-3">{orderSuccess}</p>}
    </main>
  );
};

export default CheckoutPage;
