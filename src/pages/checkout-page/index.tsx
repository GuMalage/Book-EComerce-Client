import { useEffect, useState, useRef } from "react";
import OrderService from "@/services/Order-service";
import AddressService from "@/services/Address-service";
import { useNavigate } from "react-router-dom";
import type { IOrder, IProduct, IAddress } from "@/commons/types";
import { Toast } from "primereact/toast";
import "./checkout-page.css";

const CheckoutPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [addresses, setAddresses] = useState<IAddress[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  const [paymentMethod, setPaymentMethod] = useState("PIX");

  const [shippingType, setShippingType] = useState("");
  const [shippingPrice, setShippingPrice] = useState(0);

  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  // Carrega carrinho
  useEffect(() => {
    const cartItems: IProduct[] = JSON.parse(localStorage.getItem("cart") || "[]");
    setProducts(cartItems);
  }, []);

  // Carrega endereços
  useEffect(() => {
    AddressService.getByUser().then((res) => setAddresses(res || []));
  }, []);

  const handleSelectAddress = (id: number) => {
    setSelectedAddress(id);
  };

  const subtotal = products.reduce(
    (acc, product) => acc + product.price * product.cartQuantity,
    0
  );

  const finalTotal = subtotal + shippingPrice;

  const handleOrder = async () => {
    if (!selectedAddress) {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Selecione um endereço",
        life: 2000,
      });
      return;
    }

    if (!shippingType) {
      toast.current?.show({
        severity: "warn",
        summary: "Atenção",
        detail: "Selecione um método de envio",
        life: 2000,
      });
      return;
    }

    if (!products.length) return;

    const order: IOrder = {
      itemsList: products.map((product) => ({
        productId: product.id,
        quantity: product.cartQuantity,
      })),
      totalPrice: finalTotal,
      paymentType: paymentMethod.toUpperCase(),
      shippingType,
      addressId: Number(selectedAddress),
    };

    const response = await OrderService.save(order);

    // 🚀 CORRETO AGORA — ANALISA STATUS HTTP REAL
    if (response && response.httpStatus === 200) {
      toast.current?.show({
        severity: "success",
        summary: "Pedido criado",
        detail: "Seu pedido foi confirmado!",
        life: 2000,
      });

      localStorage.removeItem("cart");
      setTimeout(() => navigate("/profile"), 1500);
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao finalizar pedido!",
        life: 2500,
      });
    }
  };

  if (!products.length && !addresses.length) {
    return (
      <main className="checkout-container py-4">
        <p>Carregando...</p>
      </main>
    );
  }

  return (
    <main className="checkout-container py-4">
      <Toast ref={toast} />
      <h1 className="fw-bold mb-4">Finalização da compra</h1>

      {/* ENDEREÇOS */}
      <div className="checkout-box">
        <h5>Selecione o endereço de entrega</h5>
        {addresses.length === 0 && <p>Nenhum endereço cadastrado.</p>}

        {addresses.map((address: IAddress) => (
          <div
            key={address.id ?? Math.random()}
            onClick={() => address.id && handleSelectAddress(address.id)}
            className={`address-item ${
              selectedAddress === address.id ? "selected" : ""
            }`}
          >
            <p className="m-0">
              {address.street}, {address.houseNumber} — {address.city}
            </p>
            <small>CEP: {address.zip}</small>
          </div>
        ))}
      </div>

      {/* FRETE */}
      <div className="checkout-box">
        <h5>Forma de envio</h5>

        {!selectedAddress && <p>Selecione um endereço antes.</p>}

        {selectedAddress && (
          <select
            className="form-select"
            value={shippingType}
            onChange={(e) => {
              const value = e.target.value;
              setShippingType(value);

              if (value === "PAC") setShippingPrice(10);
              else if (value === "SEDEX") setShippingPrice(20);
              else if (value === "RETIRADA") setShippingPrice(0);
            }}
          >
            <option value="">Selecione</option>
            <option value="PAC">PAC — R$ 10,00 (7 dias)</option>
            <option value="SEDEX">SEDEX — R$ 20,00 (3 dias)</option>
            <option value="RETIRADA">Retirada no local — R$ 0,00</option>
          </select>
        )}
      </div>

      {/* PAGAMENTO */}
      <div className="checkout-box">
        <h5>Método de pagamento</h5>
        <select
          className="form-select"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="CREDITO">Crédito</option>
          <option value="DEBITO">Débito</option>
          <option value="PIX">PIX</option>
        </select>
      </div>

      {/* ITENS */}
      <div className="checkout-card">
        <div className="checkout-card-header">
          <h5 className="m-0">Itens do pedido</h5>
        </div>
        <div className="checkout-card-body">
          {products.length === 0 && <p>Seu carrinho está vazio.</p>}

          {products.map((item) => (
            <div key={item.id} className="checkout-item">
              <img src={item.img as string} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <p className="mb-0">Preço: R${item.price.toFixed(2)}</p>
                <p className="mb-0">Qtd: {item.cartQuantity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESUMO */}
      <div className="checkout-box">
        <h5>Resumo do pedido</h5>

        <div className="summary-row">
          <span>Subtotal:</span>
          <span>R${subtotal.toFixed(2)}</span>
        </div>

        <div className="summary-row">
          <span>Frete:</span>
          <span>R${shippingPrice.toFixed(2)}</span>
        </div>

        <hr />

        <div className="summary-row summary-total">
          <span>Total:</span>
          <span>R${finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="checkout-actions">
        <button className="btn btn-danger btn-lg" onClick={handleOrder}>
          Finalizar pedido
        </button>
      </div>
    </main>
  );
};

export default CheckoutPage;
