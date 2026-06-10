import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { IAddress, AuthenticatedUser, IOrderResponse } from "@/commons/types";
import AddressService from "@/services/Address-service";
import OrderService from "@/services/Order-service";
import { Link } from "react-router-dom";
import "./profile-page.css";
import {
    OrderStatus,
} from "@/commons/enum";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";

export const ProfilePage = () => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [orders, setOrders] = useState<IOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    const [statusFilter, setStatusFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [currentTab, setCurrentTab] = useState<"orders" | "addresses">("orders");

    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
    }, []);

    useEffect(() => {
        if (user) {
            // Verifica estritamente se o usuário logado possui a role ROLE_USER
            const isUser = user.authorities?.some((auth) => auth.authority === "ROLE_USER");
            
            if (!isUser) {
                // Redireciona para home ou página de acesso negado se não for ROLE_USER
                navigate("/"); 
                return;
            }

            loadAddresses();
            loadOrders();
        }
    }, [user, navigate]);

    const loadUser = () => {
        setLoading(true);
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as AuthenticatedUser;
            setUser(parsedUser);
            
            // Validação imediata após o parse do localStorage
            const isUser = parsedUser.authorities?.some((auth) => auth.authority === "ROLE_USER");
            if (!isUser) {
                navigate("/");
                return;
            }
        } else {
            // Se não houver usuário no localStorage, redireciona para o login
            navigate("/login");
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

    const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.dateOrder);

        const matchesStatus =
            !statusFilter || order.orderStatus === statusFilter;

        const matchesStartDate =
            !startDate || orderDate >= startDate;

        const matchesEndDate =
            !endDate || orderDate <= endDate;

        return (
            matchesStatus &&
            matchesStartDate &&
            matchesEndDate
        );
    });

    // Se ainda estiver carregando ou o usuário não for válido, exibe o feedback visual
    if (loading || !user || !user.authorities?.some((auth) => auth.authority === "ROLE_USER")) {
        return <div className="spinner">Carregando...</div>;
    }

    return (
        <div className="profile-layout">
            <Toast ref={toast} />
            
            <aside className="profile-sidebar">
                <h2>Perfil</h2>
                <p><strong>Nome:</strong> {user.username}</p>

                <div className="menu">
                    <button
                        className={currentTab === "orders" ? "active" : ""}
                        onClick={() => setCurrentTab("orders")}
                    >
                        Pedidos
                    </button>

                    <button
                        className={currentTab === "addresses" ? "active" : ""}
                        onClick={() => setCurrentTab("addresses")}
                    >
                        Endereços
                    </button>
                </div>
            </aside>

            <main className="profile-content">
                {currentTab === "orders" && (
                    <div>
                        <h2>Histórico de Pedidos</h2>
                        <div className="orders-filters">

                            <div className="filter-group">
                                <label>Status</label>
                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    <option value="">Todos</option>
                                    {Object.values(OrderStatus).map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Data inicial</label>
                                <Calendar
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.value as Date)}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                />
                            </div>

                            <div className="filter-group">
                                <label>Data final</label>
                                <Calendar
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.value as Date)}
                                    dateFormat="dd/mm/yy"
                                    showIcon
                                />
                            </div>

                            <button
                                className="clear-filter-btn"
                                onClick={() => {
                                    setStatusFilter("");
                                    setStartDate(null);
                                    setEndDate(null);
                                }}
                            >
                                Limpar filtros
                            </button>

                        </div>

                        {filteredOrders.length > 0 ? (
                            <div className="orders-grid">
                                {filteredOrders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <p>
                                            <strong>Data do Pedido:</strong>{" "}
                                            {new Date(order.dateOrder).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </p>
                                        <p><strong>Total:</strong> R${order.totalPrice}</p>
                                        
                                        <p>
                                            <strong>Status:</strong> <span>{order.orderStatus}</span>
                                        </p>

                                        <strong>Itens:</strong>
                                        <ul>
                                            {order.itemsList.map(item => (
                                                <li key={item.productId}>
                                                    <Link
                                                        to={`/product/${item.productId}`}
                                                        className="link-produto"
                                                        style={{ textDecoration: "none" }}
                                                    >
                                                        <div className="card-img-wrapper">
                                                            <img src={item.urlImage} className="card-img-top"/>
                                                        </div>

                                                        <strong className="product-link-name">
                                                            Produto: {item.productName}
                                                        </strong>
                                                        <br />
                                                    </Link>

                                                    <strong>Preço:</strong> R${item.productPrice.toFixed(2)}<br />
                                                    <strong>Qtd:</strong> {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Nenhum pedido encontrado.</p>
                        )}
                    </div>
                )}

                {currentTab === "addresses" && (
                    <div>
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

                        <button className="add-address-btn" onClick={() => navigate("/address")}>
                            Adicionar Endereço
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ProfilePage;