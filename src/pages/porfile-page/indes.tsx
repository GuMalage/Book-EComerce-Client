import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { IAddress, IUserLogin, IOrderResponse } from "@/commons/types";
import AddressService from "@/services/Address-service";
import OrderService from "@/services/Order-service";
import { Link } from "react-router-dom";
import "./profile-page.css"

export function ProfilePage() {
    const [user, setUser] = useState<IUserLogin | null>(null);
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [orders, setOrders] = useState<IOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (user) {
            loadAddresses();
            loadOrders();
        }
    }, [user]);


    const loadUser = () => {
        setLoading(true);

        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    };


    const loadAddresses = async () => {
        try {
            const response = await AddressService.getByUser();
            if (response) {
                setAddresses(response);
            }
        } catch (error) {
            console.error("Erro ao carregar endereços:", error);
        }
    };

    const loadOrders = async () => {
        try {
            const response = await OrderService.findAllByUser();
            if (response) {
                setOrders(response);
            }
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        }
    };


    return (
        <div className="profile-container">
            {loading && <div className="spinner">Carregando...</div>}

            {!loading && user && (
                <div className="tabs">

                    {/* HEADER DAS TABS */}
                    <input type="radio" name="tabs" id="tab1" defaultChecked />
                    <label htmlFor="tab1">Perfil</label>

                    <input type="radio" name="tabs" id="tab2" />
                    <label htmlFor="tab2">Endereços</label>

                    <input type="radio" name="tabs" id="tab3" />
                    <label htmlFor="tab3">Meus Pedidos</label>

                    {/* PERFIL */}
                    <div className="tab-content" id="content1">
                        <h2>Perfil</h2>
                        <p><strong>Nome:</strong> {user.username}</p>
                    </div>

                    {/* ENDEREÇOS */}
                    <div className="tab-content" id="content2">
                        <h2>Meus Endereços</h2>

                        {addresses.length > 0 ? (
                            addresses.map(address => (
                                <div key={address.id} className="address-card">
                                    <p><strong>Rua:</strong> {address.street}, {address.houseNumber}</p>
                                    <p><strong>Cidade:</strong> {address.city}</p>
                                    <p><strong>CEP:</strong> {address.zip}</p>
                                </div>
                            ))
                        ) : (
                            <p className="warning-text">Nenhum endereço cadastrado.</p>
                        )}

                        <button className="btn btn-red" onClick={() => navigate("/address")}>
                            Adicionar Endereço
                        </button>
                    </div>

                    {/* PEDIDOS */}
                    <div className="tab-content" id="content3">
                        <h2>Histórico de Pedidos</h2>

                        {orders.length > 0 ? (
                            <div className="orders-grid">
                                {orders.map(order => {
                                

                                    return (
                                        <div key={order.id} className="order-card">
                                            <p><strong>Data do Pedido:</strong> {new Date(order.dateOrder).toLocaleDateString("pt-BR")}</p>
                                            <p><strong>Total:</strong> R${order.totalPrice}</p>

                    

                                            <strong>Itens:</strong>
                                            <ul>
                                                {order.itemsList.map(item => (
                                                    <li key={item.productId}>
                                                        <Link
                                                        to={`/product/${item.productId}`}
                                                        className="link-produto"
                                                        style={{ textDecoration: "none" }}
                                                        >
                                                        <img
                                                            src={item.urlImage as string}
                                                            className="card-img-top"
                                                        />
                                                        </Link>
                                                        <strong>Produto:</strong> {item.productName}<br />
                                                        <strong>Preço:</strong> R${item.productPrice.toFixed(2)}<br />
                                                        <strong>Qtd:</strong> {item.quantity}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>Nenhum pedido encontrado.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
