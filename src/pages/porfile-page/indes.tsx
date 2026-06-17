import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { IAddress, AuthenticatedUser, IOrderResponse } from "@/commons/types";
import AddressService from "@/services/Address-service";
import OrderService from "@/services/Order-service";
import { Link } from "react-router-dom";
import "./profile-page.css";
import { OrderStatus } from "@/commons/enum";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";

export const ProfilePage = () => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [addresses, setAddresses] = useState<IAddress[]>([]);
    const [orders, setOrders] = useState<IOrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const toast = useRef<Toast>(null);

    const [statusFilter, setStatusFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [currentTab, setCurrentTab] = useState<"orders" | "addresses">("orders");

    const navigate = useNavigate();

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (user) {
            const isUser = user.authorities?.some((auth) => auth.authority === "ROLE_USER");
            if (!isUser) {
                navigate("/");
                return;
            }
            loadAddresses();
            loadOrders();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate]);

    const loadUser = () => {
        setLoading(true);
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as AuthenticatedUser;
            setUser(parsedUser);

            const isUser = parsedUser.authorities?.some((auth) => auth.authority === "ROLE_USER");
            if (!isUser) {
                navigate("/");
                return;
            }
        } else {
            navigate("/login");
        }
        setLoading(false);
    };

    const loadAddresses = async () => {
        try {
            const response = await AddressService.getByUser();
            if (response) setAddresses(response);
        } catch (error) {
            console.error("Erro ao carregar endereços:", error);
        }
    };

    const loadOrders = async () => {
        try {
            const response = await OrderService.findAllByUser();
            if (response) setOrders(response);
        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        }
    };

    const handleDownload = async (orderId: number) => {
        setDownloadingId(orderId);
        try {
            await OrderService.downloadFile(orderId);
            toast.current?.show({
                severity: "success",
                summary: "Sucesso",
                detail: "Download concluído com sucesso!",
                life: 3000
            });
        } catch (error) {
            console.error("Erro no download:", error);
            toast.current?.show({
                severity: "error",
                summary: "Erro no Download",
                detail: "Não foi possível baixar o arquivo do MinIO.",
                life: 4000
            });
        } finally {
            setDownloadingId(null);
        }
    };

    const filteredOrders = orders.filter((order) => {
        const matchesStatus = !statusFilter || order.orderStatus === statusFilter;

        if (!order.dateOrder) return matchesStatus;

        const orderTime = new Date(order.dateOrder).getTime();
        if (isNaN(orderTime)) return matchesStatus;

        const matchesStartDate = !startDate || orderTime >= new Date(startDate).setHours(0, 0, 0, 0);
        const matchesEndDate = !endDate || orderTime <= new Date(endDate).setHours(23, 59, 59, 999);

        return matchesStatus && matchesStartDate && matchesEndDate;
    });

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
                                {filteredOrders.map((order, idx) => {
                                    const currentId = order.id;

                                    return (
                                        <div key={currentId || idx} className="order-card">
                                            <p>
                                                <strong>Data do Pedido:</strong>{" "}
                                                {order.dateOrder ? new Date(order.dateOrder).toLocaleDateString("pt-BR", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }) : "Data não disponível"}
                                            </p>
                                            <p><strong>Total:</strong> R${order.totalPrice}</p>

                                            <p>
                                                <strong>Status:</strong> <span>{order.orderStatus}</span>
                                            </p>

                                            <strong>Itens:</strong>
                                            <ul>
                                                {order.itemsList?.map((item, index) => (
                                                    <li key={item.productId || index}>
                                                        <Link
                                                            to={`/product/${item.productId}`}
                                                            className="link-produto"
                                                            style={{ textDecoration: "none" }}
                                                        >
                                                            <div className="card-img-wrapper">
                                                                <img
                                                                    src={item.urlImage}
                                                                    className="card-img-top"
                                                                    alt={String(item.productName || "Produto")}
                                                                />
                                                            </div>

                                                            <strong className="product-link-name">
                                                                Produto: {item.productName}
                                                            </strong>
                                                            <br />
                                                        </Link>

                                                        <strong>Preço:</strong> R${typeof item.productPrice === 'number' ? item.productPrice.toFixed(2) : parseFloat(item.productPrice || '0').toFixed(2)}<br />
                                                        <strong>Qtd:</strong> {item.quantity}
                                                    </li>
                                                ))}
                                            </ul>

                                            {currentId !== undefined && currentId !== null && order.imageName && (
                                                <div className="order-actions" style={{ marginTop: "15px" }}>
                                                    <button
                                                        type="button"
                                                        className="download-invoice-btn"
                                                        onClick={() => handleDownload(currentId)}
                                                        disabled={downloadingId === currentId}
                                                        style={{
                                                            width: "100%",
                                                            padding: "10px",
                                                            backgroundColor: "#007bff",
                                                            color: "#fff",
                                                            border: "none",
                                                            borderRadius: "4px",
                                                            cursor: downloadingId === currentId ? "not-allowed" : "pointer",
                                                            opacity: downloadingId === currentId ? 0.7 : 1
                                                        }}
                                                    >
                                                        {downloadingId === currentId ? "Baixando..." : "Baixar Nota Fiscal"}
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ textAlign: "center", marginTop: "20px" }}>Nenhum pedido encontrado para o filtro selecionado.</p>
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