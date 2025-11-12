import './App.css'
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { AppRoutes } from './routes/app-routes';
import { ConfirmDialog } from "primereact/confirmdialog";

export const toastRef = { current: null as Toast | null };


function App() {
    const toast = useRef<Toast>(null);
    toastRef.current = toast.current;
  return (
    <>
      <Toast ref={toastRef} />
      <ConfirmDialog /> 
      <AppRoutes />
    </>
  )
}

export default App