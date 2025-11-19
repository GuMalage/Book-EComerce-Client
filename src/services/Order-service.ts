import { api } from "@/lib/axios.ts";
import type { IOrder, IOrderResponse } from "@/commons/types";

const ordersURL = "/order";

const findAll = async (): Promise<IOrder[]> => {
  try {
    const response = await api.get(ordersURL);
    return response.data;
  } catch (error: any) {
    console.error("Erro ao buscar pedidos:", error);
    return [];
  }
};

const findAllByUser = async (): Promise<IOrderResponse[]> => {
  try {
    const response = await api.get(ordersURL);
    return response.data as IOrderResponse[];
  } catch (error: any) {
    console.error("Erro ao buscar pedidos do usuário autenticado:", error);
    return [];
  }
};


const findById = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`${ordersURL}/${id}`);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

const save = async (order: IOrder): Promise<any> => {
  try {
    console.log("ORDER ENVIADO:", order);

    const response = await api.post(ordersURL, order);

    console.log("RESPOSTA DO BACKEND:", response);

    return {
      httpStatus: response.status, 
      data: response.data
    };
  } catch (error: any) {
    return {
      httpStatus: error.response?.status || 500,
      data: null
    };
  }
};


const OrderService = {
  findAll,
  findAllByUser,
  findById,
  save,
};

export default OrderService;
