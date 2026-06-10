import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import type { AuthenticationResponse, IUserLogin } from "@/commons/types";
import AuthService from "@/services/Auth-service";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/hooks/use-auth";
import "./login.css";

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLogin>({
    defaultValues: { username: "", password: "" },
  });

  const navigate = useNavigate();
  const { login } = AuthService;
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);
  const { handleLogin } = useAuth();

const onSubmit = async (userLogin: IUserLogin) => {
  setLoading(true);

  try {
    const response = await login(userLogin);

    if (response.status === 200 && response.data) {
      const authenticationResponse = response.data as AuthenticationResponse;
      handleLogin(authenticationResponse);

      toast.current?.show({
        severity: "success",
        summary: "Sucesso",
        detail: "Login efetuado com sucesso.",
        life: 3000,
      });

      // 1. Tenta extrair a lista de permissões de onde o Spring costuma mandar
      const resAny = authenticationResponse as any;
      const authorities = 
        resAny.user?.authorities || 
        resAny.usuario?.authorities || 
        resAny.authorities || 
        resAny.userAuthorities || 
        resAny.user?.roles ||
        resAny.roles ||
        [];

      // 2. Checa se o "ROLE_ADMIN" existe na lista, tratando se vier String ou Objeto
      const isAdmin = Array.isArray(authorities) && authorities.some((auth: any) => {
        if (!auth) return false;
        if (typeof auth === "string") {
          return auth === "ROLE_ADMIN";
        }
        return auth.authority === "ROLE_ADMIN" || auth.role === "ROLE_ADMIN" || auth.nome === "ROLE_ADMIN";
      });

      // 3. Redirecionamento
      setTimeout(() => {
        if (isAdmin) {
          navigate("/adminDeshboard");
        } else {
          navigate("/");
        }
      }, 1000);

    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao efetuar login.",
        life: 3000,
      });
    }
  } catch (error: any) {
    console.error("Erro capturado no login:", error);

    const backendMessage = error.response?.data?.message || error.response?.data;

    if (error.response?.status === 401 || error.response?.status === 403) {
      toast.current?.show({
        severity: "error",
        summary: "Acesso Negado",
        detail: typeof backendMessage === "string" ? backendMessage : "Usuário/senha incorretos ou conta inativa.",
        life: 5000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Ocorreu uma falha de comunicação com o servidor.",
        life: 3000,
      });
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-content-center card-login-register min-h-screen p-4">
      <Toast ref={toast} />

      <Card title="Login" className="w-full sm:w-20rem login-card">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-column gap-3">

          <div className="input-wrapper">
            <label htmlFor="username" className="form-label-centered mb-2">Usuário</label>

            <Controller
              name="username"
              control={control}
              rules={{ required: "Informe o nome de usuário" }}
              render={({ field }) => (
                <InputText
                  id="username"
                  {...field}
                  className={errors.username ? "p-invalid" : ""}
                />
              )}
            />

            {errors.username && <small className="p-error">{errors.username.message}</small>}
          </div>

          <div className="input-wrapper">
            <label htmlFor="password" className="form-label-centered mb-2">Senha</label>

            <Controller
              name="password"
              control={control}
              rules={{ required: "Informe a senha" }}
              render={({ field }) => (
                <Password
                  id="password"
                  {...field}
                  toggleMask
                  feedback={false}
                  className={errors.password ? "p-invalid w-full" : "w-full"}
                  inputClassName="password-input"
                />
              )}
            />

            {errors.password && <small className="p-error">{errors.password.message}</small>}
          </div>

          <Button
            type="submit"
            label="Entrar"
            className="w-full p-button-standard"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          />
        </form>

        <div className="text-center mt-3">
          <small>
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary">
              Criar conta
            </Link>
          </small>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;