import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { AuthenticatedUser, IAuthority, IOrderResponse, IUserAuthorities, IUserStatus } from "@/commons/types";
import OrderService from "@/services/Order-service";
import UserService from "@/services/User-service";
import { OrderStatus, type OrderStatusType } from "@/commons/enum";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import "./admin-dashboard.css";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

export function AdminDashboardPage() {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [orders, setOrders] = useState<IOrderResponse[]>([]);
    const [clientsList, setClientsList] = useState<any[]>([]);
    const [allUsersList, setAllUsersList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const toast = useRef<Toast>(null);

    const [statusFilter, setStatusFilter] = useState<string>("");
    const [clientFilter, setClientFilter] = useState<string>("");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [userActiveFilter, setUserActiveFilter] = useState<string>("all");
    const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
    const [image, setImage] = useState<File | null>(null);

    const [currentTab, setCurrentTab] = useState<"indicators" | "all-orders" | "access-management">("indicators");

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser: any = JSON.parse(storedUser);
            const userAuths = parsedUser.userAuthorities || parsedUser.authorities;
            const isAdmin = userAuths?.some((auth: any) => auth?.authority === "ROLE_ADMIN");

            if (!isAdmin) {
                navigate("/profile");
                return;
            }
            setUser(parsedUser);
        } else {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (user) {
            loadDashboardData();
        }
    }, [user]);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadAllOrders(),
                loadAllClients(),
                loadAllUsers()
            ]);
        } catch (error) {
            console.error("Erro ao carregar dados do painel:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadAllOrders = async () => {
        try {
            const response = await OrderService.findAll();
            if (response) setOrders(response);
        } catch (error) {
            console.error("Erro ao carregar todos os pedidos:", error);
        }
    };

    const loadAllClients = async () => {
        try {
            const response = await UserService.getAllUsersClient();
            if (response) setClientsList(response);
        } catch (error) {
            console.error("Erro ao carregar clientes para o filtro:", error);
        }
    };

    const loadAllUsers = async () => {
        try {
            const response = await UserService.getAllUsers();
            if (response) setAllUsersList(response);
        } catch (error) {
            console.error("Erro ao carregar usuários:", error);
        }
    };

    const handleChangeStatus = async (order: IOrderResponse, newStatus: OrderStatusType) => {
        confirmDialog({
            header: "Alterar status do pedido (ADMIN)",
            message: (
                <div style={{ lineHeight: 1.6 }}>
                    Confirmar alteração do status do pedido para <strong>{newStatus}</strong>?
                </div>
            ),
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Confirmar",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-success",
            rejectClassName: "p-button-text",
            accept: async () => {
                try {
                    const updatedOrder = { ...order, orderStatus: newStatus };
                    await OrderService.update(updatedOrder);

                    setOrders((prevOrders) =>
                        prevOrders.map((o) => (o.id === order.id ? { ...o, orderStatus: newStatus } : o))
                    );

                    toast.current?.show({
                        severity: "success",
                        summary: "Sucesso",
                        detail: `Pedido updated para ${newStatus}.`,
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
            }
        });
    };

    const handleToggleUserActive = async (targetUser: any) => {
        const nextState = !targetUser.active;

        confirmDialog({
            header: `${nextState ? "Ativar" : "Desativar"} Usuário`,
            message: `Tem certeza que deseja ${nextState ? "ativar" : "desativar"} o acesso de ${targetUser.username}?`,
            icon: "pi pi-user-edit",
            acceptLabel: "Confirmar",
            rejectLabel: "Cancelar",
            acceptClassName: nextState ? "p-button-success" : "p-button-danger",
            accept: async () => {
                try {
                    const payload: IUserStatus = {
                        id: targetUser.id,
                        active: nextState
                    };

                    await UserService.updateStatusUser(payload);

                    setAllUsersList((prev) =>
                        prev.map((u) => (u.id === targetUser.id ? { ...u, active: nextState } : u))
                    );

                    if (targetUser.id === user?.id) {
                        setUser(prev => prev ? { ...prev, active: nextState } : null);
                    }

                    toast.current?.show({
                        severity: "success",
                        summary: "Sucesso",
                        detail: `Usuário ${nextState ? 'ativado' : 'desativado'} com sucesso.`,
                        life: 3000
                    });
                } catch (error) {
                    console.error("Erro ao alterar status:", error);
                    toast.current?.show({
                        severity: "error",
                        summary: "Erro",
                        detail: "Erro ao alterar o status do usuário no servidor.",
                        life: 3000
                    });
                }
            }
        });
    };

    const handleToggleAdminRole = async (targetUser: any) => {
        const currentAuths = targetUser.userAuthorities || [];
        const isAdmin = currentAuths.some((auth: any) => auth && auth.authority === "ROLE_ADMIN");
        const nextAction = isAdmin ? "remover" : "conceder";

        confirmDialog({
            header: "Alterar Permissões Administrativas",
            message: `Deseja realmente ${nextAction} a permissão de Administrador para ${targetUser.username}?`,
            icon: "pi pi-shield",
            acceptLabel: "Confirmar",
            rejectLabel: "Cancelar",
            acceptClassName: "p-button-warning",
            accept: async () => {
                try {
                    let updatedAuthorities: IAuthority[] = currentAuths.map((auth: any) => ({
                        authority: String(auth.authority)
                    }));

                    if (isAdmin) {
                        updatedAuthorities = updatedAuthorities.filter((auth) => auth.authority !== "ROLE_ADMIN");

                        const hasUserRole = updatedAuthorities.some((auth) => auth.authority === "ROLE_USER");
                        if (updatedAuthorities.length === 0 || !hasUserRole) {
                            updatedAuthorities.push({ authority: "ROLE_USER" });
                        }
                    } else {
                        const alreadyHasAdmin = updatedAuthorities.some((auth) => auth.authority === "ROLE_ADMIN");
                        if (!alreadyHasAdmin) {
                            updatedAuthorities.push({ authority: "ROLE_ADMIN" });
                        }
                    }

                    const payload: IUserAuthorities = {
                        id: targetUser.id,
                        userAuthorities: updatedAuthorities
                    };

                    await UserService.updatePermissionUser(payload);

                    setAllUsersList((prev) =>
                        prev.map((u) => (u.id === targetUser.id ? { ...u, userAuthorities: updatedAuthorities } : u))
                    );

                    if (user && targetUser.id === user.id) {
                        const updatedUser: AuthenticatedUser = {
                            ...user,
                            username: user.username,
                            userAuthorities: updatedAuthorities
                        } as any;
                        setUser(updatedUser);
                        localStorage.setItem("user", JSON.stringify(updatedUser));

                        if (isAdmin) {
                            navigate("/profile");
                            return;
                        }
                    }

                    toast.current?.show({
                        severity: "success",
                        summary: "Sucesso",
                        detail: `Permissão de Administrador ${isAdmin ? 'removida' : 'concedida'}.`,
                        life: 3000
                    });
                } catch (error) {
                    console.error("Erro ao alterar permissões:", error);
                    toast.current?.show({
                        severity: "error",
                        summary: "Erro",
                        detail: "Erro ao alterar as permissões do usuário no servidor.",
                        life: 3000
                    });
                }
            }
        });
    };

    const handleReciptOrder = async (data: IOrderResponse) => {
        if (!image) {
            toast.current?.show({
                severity: "warn",
                summary: "Aviso",
                detail: "Por favor, selecione uma imagem antes de salvar.",
                life: 3000,
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("image", image);

            const blob = new Blob([JSON.stringify(data)], {
                type: "application/json",
            });
            formData.append("order", blob);

            const response = await OrderService.saveAndUpload(formData);

            if (response && (response.status === 200 || response.success)) {
                toast.current?.show({
                    severity: "success",
                    summary: "Sucesso",
                    detail: "Comprovante enviado com sucesso.",
                    life: 3000,
                });

                await loadAllOrders();
                setImage(null);
            } else {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: "Não foi possível salvar o registro.",
                    life: 3000,
                });
            }
        } catch (error) {
            console.error(error);
            toast.current?.show({
                severity: "error",
                summary: "Erro",
                detail: "Erro inesperado ao salvar o registro.",
                life: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const onFileChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setImage(event.target.files ? event.target.files[0] : null);
    };

    const filteredOrders = orders.filter((order) => {
        const orderDate = new Date(order.dateOrder);
        const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
        const matchesStartDate = !startDate || orderDate >= startDate;
        const matchesEndDate = !endDate || orderDate <= endDate;

        const currentOrderUser = typeof order.username === 'object' ? order.username?.username : order.username;
        const matchesClient = !clientFilter || currentOrderUser === clientFilter;

        return matchesStatus && matchesStartDate && matchesEndDate && matchesClient;
    });

    const filteredUsers = allUsersList.filter((u) => {
        const matchesStatus =
            userActiveFilter === "all" ? true :
                userActiveFilter === "active" ? u.active === true : u.active === false;

        const isUserAdmin = u.userAuthorities?.some((auth: any) => auth && auth.authority === "ROLE_ADMIN");
        const matchesRole =
            userRoleFilter === "all" ? true :
                userRoleFilter === "admin" ? isUserAdmin === true : isUserAdmin === false;

        return matchesStatus && matchesRole;
    });

    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    const statusCounts = filteredOrders.reduce((acc: Record<string, number>, order) => {
        acc[order.orderStatus] = (acc[order.orderStatus] || 0) + 1;
        return acc;
    }, {});

    const pieData = {
        labels: Object.keys(statusCounts),
        datasets: [
            {
                label: 'Quantidade de Pedidos',
                data: Object.values(statusCounts),
                backgroundColor: ['#3b546e', '#4a6785', '#a3c1e0', '#333333', '#e0e0e0', '#f8f8f8'],
            },
        ],
    };

    const revenueByStatus = filteredOrders.reduce((acc: Record<string, number>, order) => {
        acc[order.orderStatus] = (acc[order.orderStatus] || 0) + order.totalPrice;
        return acc;
    }, {});

    const barData = {
        labels: Object.keys(revenueByStatus),
        datasets: [
            {
                label: 'Faturamento por Status (R$)',
                data: Object.values(revenueByStatus),
                backgroundColor: '#a3c1e0',
            },
        ],
    };

    return (
        <div className="admin-layout">
            <Toast ref={toast} />

            <aside className="admin-sidebar">
                <h2>Painel Admin</h2>
                <p>Olá, <strong>{user?.displayName || user?.username || "Administrador"}</strong></p>
                <div className="menu">
                    <button
                        className={currentTab === "indicators" ? "active" : ""}
                        onClick={() => setCurrentTab("indicators")}
                    >
                        Indicadores & Gráficos
                    </button>
                    <button
                        className={currentTab === "all-orders" ? "active" : ""}
                        onClick={() => setCurrentTab("all-orders")}
                    >
                        Todos os Pedidos
                    </button>

                    <button
                        className={currentTab === "access-management" ? "active" : ""}
                        onClick={() => setCurrentTab("access-management")}
                    >
                        Gerenciamento de Acesso
                    </button>
                </div>
            </aside>

            <main className="admin-content">
                {loading && <div className="spinner">Carregando dados globais...</div>}

                {!loading && currentTab === "all-orders" && (
                    <div>
                        <h2>Histórico Geral de Vendas</h2>
                        <div className="admin-filters">
                            <div className="filter-group">
                                <label>Filtrar por Cliente</label>
                                <select className="form-select" value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
                                    <option value="">Todos os Clientes</option>
                                    {clientsList.map((client) => (
                                        <option key={client.id} value={client.username}>{client.displayName || client.username}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="filter-group">
                                <label>Data Inicial</label>
                                <Calendar value={startDate} onChange={(e) => setStartDate(e.value as Date)} dateFormat="dd/mm/yy" showIcon />
                            </div>
                            <div className="filter-group">
                                <label>Data Final</label>
                                <Calendar value={endDate} onChange={(e) => setEndDate(e.value as Date)} dateFormat="dd/mm/yy" showIcon />
                            </div>

                            <div className="filter-group">
                                <label>Status</label>
                                <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                    <option value="">Todos os Status</option>
                                    {Object.values(OrderStatus).map((status) => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </select>
                            </div>
                            <button className="clear-filter-btn" onClick={() => { setStatusFilter(""); setClientFilter(""); setStartDate(null); setEndDate(null); }}>
                                Limpar
                            </button>
                        </div>

                        {filteredOrders.length > 0 ? (
                            <div className="orders-grid">
                                {filteredOrders.map(order => {
                                    const displayOrderUser = typeof order.username === 'object' ? order.username?.username : order.username;
                                    return (
                                        <div key={order.id} className="order-card admin-card">
                                            <div className="card-admin-header">
                                                <span><strong>Pedido ID:</strong> {order.id}</span>
                                                <span className="client-badge">{displayOrderUser}</span>
                                            </div>
                                            <hr />
                                            <p><strong>Data:</strong> {new Date(order.dateOrder).toLocaleDateString("pt-BR")}</p>
                                            <p><strong>Total:</strong> R${order.totalPrice.toFixed(2)}</p>

                                            <p><strong>Gerenciar Status:</strong></p>
                                            <select
                                                className="form-select alert-select"
                                                value={order.orderStatus}
                                                onChange={(e) => handleChangeStatus(order, e.target.value as OrderStatusType)}
                                            >
                                                {Object.values(OrderStatus).map((statusValue) => (
                                                    <option key={statusValue} value={statusValue}>{statusValue}</option>
                                                ))}
                                            </select>

                                            <details className="admin-items-details">
                                                <summary>Ver Itens ({order.itemsList?.length || 0})</summary>
                                                <ul>
                                                    {order.itemsList?.map(item => (
                                                        <li key={item.productId} className="admin-item-row">
                                                            <span>{item.productName} (x{item.quantity})</span>
                                                            <span>R${(item.productPrice * item.quantity).toFixed(2)}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </details>

                                         
                                            <div className="receipt-upload-container">
                                                <label className="receipt-upload-label">
                                                    <i className="pi pi-paperclip" style={{ marginRight: '6px', fontSize: '0.9rem', color: 'var(--color-primary-medium)' }}></i>
                                                    Anexar Nota Fiscal / Recibo:
                                                </label>

                                                <input
                                                    className="receipt-file-input"
                                                    type="file"
                                                    name="image"
                                                    accept="image/*"
                                                    onChange={onFileChangeHandler}
                                                />

                                                {order?.imageName && (
                                                    <div className="receipt-preview-box">
                                                        <img
                                                            className="receipt-img"
                                                            src={`http://localhost:9000/commons/${order.imageName}`}
                                                            alt="Recibo do Pedido"
                                                        />
                                                        <div>
                                                            <small className="block">Nota Fiscal anexada</small>
                                                            <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>Clique para expandir</span>
                                                        </div>
                                                    </div>
                                                )}

                                                <Button
                                                    type="button"
                                                    label="Salvar Nota Fiscal"
                                                    icon="pi pi-upload"
                                                    className="receipt-submit-btn p-button-sm"
                                                    loading={isSubmitting}
                                                    onClick={() => handleReciptOrder(order)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p>Nenhum pedido corresponde aos filtros definidos.</p>
                        )}
                    </div>
                )}

                {!loading && currentTab === "indicators" && (
                    <div className="indicators-section">
                        <h2>Indicadores de Performance</h2>
                        <div className="metrics-grid">
                            <div className="metric-card">
                                <h3>Faturamento Total</h3>
                                <p className="metric-value revenue">R$ {totalRevenue.toFixed(2)}</p>
                                <small>Baseado nos filtros atuais</small>
                            </div>
                            <div className="metric-card">
                                <h3>Total de Pedidos</h3>
                                <p className="metric-value">{filteredOrders.length}</p>
                                <small>Pedidos processados</small>
                            </div>
                        </div>

                        <div className="charts-container">
                            <div className="chart-box">
                                <h3>Volume por Status de Pedido</h3>
                                {filteredOrders.length > 0 ? <Pie data={pieData} /> : <p>Sem dados</p>}
                            </div>
                            <div className="chart-box">
                                <h3>Faturamento Bruto por Status</h3>
                                {filteredOrders.length > 0 ? <Bar data={barData} /> : <p>Sem dados</p>}
                            </div>
                        </div>
                    </div>
                )}

                {!loading && currentTab === "access-management" && (
                    <div className="access-management-section">
                        <h2>Controle de Acessos e Permissões</h2>

                        <div className="admin-filters">
                            <div className="filter-group">
                                <label>Perfil de Acesso</label>
                                <select
                                    className="form-select"
                                    value={userRoleFilter}
                                    onChange={(e) => setUserRoleFilter(e.target.value)}
                                >
                                    <option value="all">Todos os Perfis</option>
                                    <option value="admin">Apenas Administradores</option>
                                    <option value="client">Apenas Clientes</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label>Status da Conta</label>
                                <select
                                    className="form-select"
                                    value={userActiveFilter}
                                    onChange={(e) => setUserActiveFilter(e.target.value)}
                                >
                                    <option value="all">Todos os Status</option>
                                    <option value="active">Apenas Ativos</option>
                                    <option value="inactive">Apenas Inativos</option>
                                </select>
                            </div>

                            <button
                                className="clear-filter-btn"
                                onClick={() => {
                                    setUserActiveFilter("all");
                                    setUserRoleFilter("all");
                                }}
                            >
                                Limpar
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Usuário</th>
                                        <th>Nome Exibido</th>
                                        <th>Status</th>
                                        <th>Perfil</th>
                                        <th style={{ textAlign: 'center' }}>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((u) => {
                                            const isTargetAdmin = u.userAuthorities?.some((auth: any) => auth && auth.authority === "ROLE_ADMIN");
                                            return (
                                                <tr key={u.id}>
                                                    <td><strong>{u.username}</strong></td>
                                                    <td>{u.displayName || "—"}</td>
                                                    <td>
                                                        <span className={`status-badge ${u.active ? 'active' : 'inactive'}`}>
                                                            {u.active ? "Ativo" : "Inativo"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`role-badge ${isTargetAdmin ? 'admin' : 'client'}`}>
                                                            {isTargetAdmin ? "Administrador" : "Cliente"}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="table-actions-container">
                                                            <button
                                                                onClick={() => handleToggleUserActive(u)}
                                                                className={`action-btn toggler ${u.active ? 'deactivate' : 'activate'}`}
                                                            >
                                                                {u.active ? "Desativar" : "Ativar"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleToggleAdminRole(u)}
                                                                className={`action-btn role-toggle ${isTargetAdmin ? 'demote' : 'promote'}`}
                                                                disabled={u.id === user?.id}
                                                                title={u.id === user?.id ? "Você não pode remover seu próprio acesso administrativo." : ""}
                                                            >
                                                                {isTargetAdmin ? "Remover Admin" : "Tornar Admin"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="table-empty-msg">
                                                Nenhum usuário corresponde aos critérios selecionados.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default AdminDashboardPage;