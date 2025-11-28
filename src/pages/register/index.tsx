import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { useRef, useState } from "react";
import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/Auth-service";
import { Toast } from "primereact/toast";
import "./register-page.css";

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegister>({
    defaultValues: { username: "", password: "", displayName: "" },
  });

  const { signup } = AuthService;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const onSubmit = async (data: IUserRegister) => {
    setLoading(true);
    try {
      const response = await signup(data);

      if (response.status === 200) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Usuário cadastrado com sucesso.",
          life: 3000,
        });

        setTimeout(() => navigate("/login"), 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao cadastrar usuário.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao cadastrar usuário.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-content-center min-h-screen p-4 card-login-register">
      <Toast ref={toast} />

      <Card title="Registrar Conta" className="w-full sm:w-20rem login-card">
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid space-y-4">

          <div>
            <label className="form-label-centered">Nome de Exibição</label>
            <Controller
              name="displayName"
              control={control}
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <InputText
                  {...field}
                  className={classNames("uniform-input", {
                    "p-invalid": errors.displayName,
                  })}
                  placeholder="Ex: João das Neves"
                />
              )}
            />
            {errors.displayName && (
              <small className="p-error block text-center">
                {errors.displayName.message}
              </small>
            )}
          </div>

          <div>
            <label className="form-label-centered">Usuário</label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <InputText
                  {...field}
                  className={classNames("uniform-input", {
                    "p-invalid": errors.username,
                  })}
                  placeholder="Ex: jsnow"
                />
              )}
            />
            {errors.username && (
              <small className="p-error block text-center">
                {errors.username.message}
              </small>
            )}
          </div>

          <div>
            <label className="form-label-centered">Senha</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Campo obrigatório",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              }}
              render={({ field }) => (
                <Password
                  {...field}
                  toggleMask
                  feedback={false}
                  className={classNames({
                    "p-invalid": errors.password,
                  })}
                  inputClassName="uniform-input"
                />
              )}
            />
            {errors.password && (
              <small className="p-error block text-center">
                {errors.password.message}
              </small>
            )}
          </div>

          <Button
            type="submit"
            label="Registrar"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
            className="p-button-standard"
          />

          <div className="text-center mt-3">
            <small>
              Já tem uma conta?{" "}
              <Link to="/login" className="text-primary">
                Fazer login
              </Link>
            </small>
          </div>
        </form>
      </Card>
    </div>
  );
};
