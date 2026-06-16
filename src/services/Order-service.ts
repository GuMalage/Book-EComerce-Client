import { api } from "@/lib/axios.ts";
import type { IOrder, IOrderResponse, IResponse } from "@/commons/types";

const ordersURL = "/order";

const findAll = async (): Promise<IOrderResponse[]> => {
  try {
    const response = await api.get(`${ordersURL}/all`)
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

const update = async (order: IOrder | IOrderResponse): Promise<any> => {
  try {

    const response = await api.put(
      `${ordersURL}/${order.id}`,
      order
    );

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


const saveAndUpload = async (formData: FormData): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.put(`${ordersURL}/reciptUpdate`, formData);
    response = {
      status: 200,
      success: true,
      message: "Produto salvo com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Falha ao salvar produto",
      data: err.response.data,
    };
  }
  return response;
};

const OrderService = {
  findAll,
  findAllByUser,
  findById,
  save,
  update,
  saveAndUpload
};



export default OrderService;
