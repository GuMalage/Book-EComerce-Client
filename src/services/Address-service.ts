import type { IAddress, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

const addressURL = "/address";

const save = async (address: IAddress): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post(addressURL, address);
    response = {
      status: 200,
      success: true,
      message: "Categoria salva com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Falha ao salvar categoria",
      data: err.response.data,
    };
  }
  return response;
};

const findAll = async (): Promise<IAddress[] | undefined> => {
    try {
        const response = await api.get(`${addressURL}/my-address`);
        return response.data; // Retorna a lista de endereços
    } catch (error) {
        console.error("Erro ao buscar endereços:", error);
        return undefined; // Retorna undefined em caso de erro
    }
};

const remove = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.delete(`${addressURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Categoria removida com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Falha ao remover categoria",
      data: err.response.data,
    };
  }
  return response;
};

/**
 * Função para buscar uma categoria pelo id
 * @param id - Recebe o id da categoria que será buscada
 * @returns - Retorna uma Promise com a resposta da API
 */
const findById = async (id: number): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.get(`${addressURL}/${id}`);
    response = {
      status: 200,
      success: true,
      message: "Categoria carregada com sucesso!",
      data: data.data,
    };
  } catch (err: any) {
    response = {
      status: err.response.status,
      success: false,
      message: "Falha ao carregar categoria",
      data: err.response.data,
    };
  }
  return response;
};

const AddressService = {
  save,
  findAll,
  remove,
  findById,
};

export default AddressService;