import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { IAddress, IUserLogin, IOrderResponse } from "@/commons/types";
import AddressService from "@/services/Address-service";
import OrderService from "@/services/Order-service";
import { Link } from "react-router-dom";
import "./profile-page.css";
import {
    OrderStatus,
    type OrderStatusType
} from "@/commons/enum";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Calendar } from "primereact/calendar";

export const ProfilePage = () => {
    const [user, setUser] = useState<IUserLogin | null>(null);
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
    const handleChangeStatus = async (
        order: IOrderResponse,
        newStatus: OrderStatusType
    ) => {

        confirmDialog({
            header: "Alterar status do pedido",

            message: (
                <div style={{ lineHeight: 1.6 }}>
                    Deseja realmente alterar o status do pedido para{" "}
                    <strong>{newStatus}</strong>?
                </div>
            ),

            icon: "pi pi-exclamation-triangle",

            acceptLabel: "Confirmar",
            rejectLabel: "Cancelar",

            acceptClassName: "p-button-success",
            rejectClassName: "p-button-text",

            accept: async () => {

                try {

                    const updatedOrder = {
                        ...order,
                        orderStatus: newStatus
                    };

                    await OrderService.update(updatedOrder);

                    setOrders((prevOrders) =>
                        prevOrders.map((o) =>
                            o.id === order.id
                                ? { ...o, orderStatus: newStatus }
                                : o
                        )
                    );

                    toast.current?.show({
                        severity: "success",
                        summary: "Status atualizado",
                        detail: `Pedido atualizado para ${newStatus}.`,
                        life: 3000,
                    });

                } catch (error) {

                    console.error(error);

                    toast.current?.show({
                        severity: "error",
                        summary: "Erro",
                        detail: "Não foi possível atualizar o pedido.",
                        life: 3000,
                    });
                }
            },

            reject: () => {

                toast.current?.show({
                    severity: "info",
                    summary: "Cancelado",
                    detail: "A alteração do pedido foi cancelada.",
                    life: 2500,
                });
            }
        });
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

    return (
        <div className="profile-layout">
            <aside className="profile-sidebar">
                {!loading && user && (
                    <>
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
                    </>
                )}
            </aside>

            <main className="profile-content">
                {loading && <div className="spinner">Carregando...</div>}



                {!loading && currentTab === "orders" && (
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
                                        <p><strong>Data do Pedido:</strong> {new Date(order.dateOrder).toLocaleDateString("pt-BR")}</p>
                                        <p><strong>Total:</strong> R${order.totalPrice}</p>

                                        <p>
                                            <strong>Status:</strong>
                                        </p>

                                        <select
                                            className="form-select"
                                            value={order.orderStatus}
                                            onChange={(e) =>
                                                handleChangeStatus(
                                                    order,
                                                    e.target.value as OrderStatusType
                                                )
                                            }
                                        >
                                            {Object.values(OrderStatus).map((statusValue) => (
                                                <option
                                                    key={statusValue}
                                                    value={statusValue}
                                                >
                                                    {statusValue}
                                                </option>
                                            ))}
                                        </select>

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
                                                            <img src={item.urlImage} className="card-img-top" />
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
                {!loading && currentTab === "addresses" && (
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