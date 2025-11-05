import { type ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IAddress } from "@/commons/types";
import AddressService from "@/services/Address-service";
import { Button, Form, Alert } from "react-bootstrap";
import "./index.css";

export function AddressPage() {
  const [form, setForm] = useState<IAddress>({
    zip: "",
    street: "",
    city: "",
    houseNumber: "",
    complement: "",
    cep: "",
  });

  const [pendingApiCall, setPendingApiCall] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [apiSuccess, setApiSuccess] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const onBlurCEP = async () => {
    const cep = form.zip.replace(/\D/g, "");
    if (cep.length !== 8) {
      setCepError("CEP inválido. Deve conter 8 dígitos.");
      return;
    }

    try {
      setCepError(null);
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado.");
      } else {
        setForm((prevForm) => ({
          ...prevForm,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        }));
      }
    } catch {
      setCepError("Erro ao buscar o CEP. Tente novamente.");
    }
  };

  const onClickSave = async () => {
    setPendingApiCall(true);
    setApiError(false);

    try {
      const response = await AddressService.save(form);

      if (response && (response.status === 200 || response.status === 201)) {
        setApiSuccess(true);
        setTimeout(() => navigate("/home"), 2000);
      } else {
        throw new Error("Falha ao salvar");
      }
    } catch {
      setApiError(true);
    } finally {
      setPendingApiCall(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: "700px", color: "#CC3733" }}>
      <h2 className="text-center mb-4">Cadastro de Endereço</h2>

      <Form>
        <Form.Group className="mb-3" controlId="zip">
          <Form.Label>CEP</Form.Label>
          <Form.Control
            type="text"
            name="zip"
            value={form.zip.replace(/\D/g, "")}
            onChange={onChange}
            onBlur={onBlurCEP}
            isInvalid={!!cepError}
          />
          {cepError && <Form.Text className="text-danger">{cepError}</Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3" controlId="street">
          <Form.Label>Rua</Form.Label>
          <Form.Control
            type="text"
            name="street"
            value={form.street}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="houseNumber">
          <Form.Label>Número</Form.Label>
          <Form.Control
            type="number"
            name="houseNumber"
            value={form.houseNumber ?? ""}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="complement">
          <Form.Label>Complemento</Form.Label>
          <Form.Control
            type="text"
            name="complement"
            value={form.complement}
            onChange={onChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="city">
          <Form.Label>Cidade</Form.Label>
          <Form.Control
            type="text"
            name="city"
            value={form.city}
            onChange={onChange}
          />
        </Form.Group>


        {apiError && (
          <Alert variant="danger">Falha ao salvar o endereço!</Alert>
        )}
        {apiSuccess && (
          <Alert variant="success">Endereço salvo com sucesso!</Alert>
        )}

        <Button
          variant="danger"
          disabled={pendingApiCall}
          onClick={onClickSave}
          className="w-100 mt-3"
        >
          {pendingApiCall ? "Salvando..." : "Salvar"}
        </Button>
      </Form>
    </div>
  );
}
