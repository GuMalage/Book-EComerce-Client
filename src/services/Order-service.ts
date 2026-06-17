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
      status: err.response?.status || 500,
      success: false,
      message: "Falha ao salvar produto",
      data: err.response?.data,
    };
  }
  return response;
};

const downloadFile = async (id: number): Promise<any> => {
  try {
    // É fundamental usar responseType: "blob" para que o axios trate a resposta como arquivo binário
    const response = await api.get(`${ordersURL}/download/${id}`, {
      responseType: "blob"
    });

    // Tenta capturar o nome original do arquivo enviado pelo cabeçalho do Java
    const contentDisposition = response.headers["content-disposition"];
    let fileName = `comprovante-pedido-${id}.jpg`; // Nome padrão caso falhe

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename=(.+)/);
      if (fileNameMatch && fileNameMatch[1]) {
        // Decodifica o nome (ex: remove os %20 de espaços)
        fileName = decodeURIComponent(fileNameMatch[1]);
      }
    }

    const blob = new Blob([response.data], { type: response.headers["content-type"] });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = downloadUrl;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    
    // Limpa a memória e remove o elemento criado
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);

    return response;
  } catch (error: any) {
    return error.response;
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

const OrderService = {
  findAll,
  findAllByUser,
  findById,
  save,
  update,
  saveAndUpload,
  downloadFile
};


console.log("EXPORTANDO:", OrderService);

export default OrderService;
