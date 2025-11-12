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

const calculateShipment = async (data: any): Promise<any> => {
    try {
        const response = await fetch("/melhorenvio/me/shipment/calculate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiZGU2MzEzMGRjZDVmMWM4ZGMzYzFiMzQzOTkxN2I5YzY2MTk3OTU3MzU1YTlhYzAyMDFhZWJlM2FiZTI3NGZhMzdiOTg2MjRiNDU2MWJlZTAiLCJpYXQiOjE3Mzk5MDA2MDQuNzI5OTIsIm5iZiI6MTczOTkwMDYwNC43Mjk5MjEsImV4cCI6MTc3MTQzNjYwNC43MTg3ODgsInN1YiI6IjllM2E0MDg2LTYyNjctNDA1ZS05MDYyLWQ4MmRlZDhlMGNhNiIsInNjb3BlcyI6WyJzaGlwcGluZy1jYWxjdWxhdGUiXX0.dovt8jjK42ckBdcVfxqAV41se02lqMDmbHjzi0Mbn9x5rXRxa0e65BWEmZ-YE3yuPduRk5JOz8MLH_2ZZbaUbzwqHCRNDcuiTjVEM-9FTqHJJQaPnawOkFkjQ1fk1MdTYp0ibMrITkQ8mu-pOUI3hZfpFC7Ul5Ivn3vzKYaJUrk_kNbc-f7c3LqaGcYm5DEVXac0LMJKU-BsNCladgPk4e-US2O7C-l-_9FxaRQZdGUt5yT8R_o4VviaokfK2jE2gGsJwLHMc_lOJ4j3rQOoCMUfiNqfJJw1fQJp_Gg152SqFX4SezHtYuCDBu_JZ7n-cxfrwvegrtXAYrLXj_soE5FULT0QdD7aeXjMcQFq3oBFXG5XPNDWDlpK7j8k4Mz9wJLCsRAoL_6Zbbv3FdDhGpmzgJFmvf5vmmV9BSqUpmJ0NZHeUrv5hwM0pyu48M8UsRQe-ce9tn60wZKtjnKNAIB7aTTjFsKf-VMrQ29b0ryK3VzId6jxp5jzthkbOkmf5WQMU9a0jF7xYXGPL2GXDAHkV-nNbLFJksuNoO7WRoFMiTKALhf5UTs3OnMZmQd3PdB8yb2EARiJGGqZaccgYhL0y6JgJyjfCld41eKRAiZz0JfiWhiOhvARq93PiG2hPdGeTv820AFIrXY3pbzb7wObGHDcCtICdWUGDeuyRik", // Replace with your token
                "Accept": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error calculating shipment:", error);
        return null;
    }
};


const AddressService = {
  save,
  findAll,
  remove,
  findById,
  calculateShipment
};

export default AddressService;