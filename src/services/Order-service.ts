import { api } from "@/lib/axios.ts";
import type { IOrder } from "@/commons/types";

const ordersURL = "/orders";

const findAll = async (): Promise<any> => {
    try {
        const response = await api.get(ordersURL);
        return response.data;
    } catch (error: any) {
        console.error("Erro ao buscar pedidos:", error);
        return [];
    }
};

const findById = async (id: number): Promise<any> => {
    try {
        const response = await api.get(`${ordersURL}/${id}`);
        return response;
    } catch (error: any) {
        return error.response;
    }
};

const save = async (order: IOrder): Promise<any> => {
    try {
        const response = await api.post(ordersURL, order);
        return response;

    } catch (error: any) {
        return error.response;
    }
};

const OrderService = {
    findAll,
    findById,
    save,
};

export default OrderService;