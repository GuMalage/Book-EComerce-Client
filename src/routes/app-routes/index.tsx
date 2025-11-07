import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import { Layout } from "@/components/layout";
import { CategoryListPage } from "@/pages/category-list";
import { CategoryFormPage } from "@/pages/category-form";
import { ProductListPage } from "@/pages/product-list";
import { ProductFormPage } from "@/pages/product-form";
import { NotFound } from "@/pages/not-found";
import { AddressPage } from "@/pages/address-form";
import { ProductPage } from "@/pages/product-page";



export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/products" element={<ProductListPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
         
        <Route path="register" element={<RegisterPage />} />
        <Route path="/categories" element={<CategoryListPage />} />
          
        <Route  path="/categories/new"  element={<CategoryFormPage  />}  />
		    <Route  path="/categories/:id"  element={<CategoryFormPage  />}  />

        <Route  path="/products/new"  element={<ProductFormPage />}  />
        <Route path="/product/:id" element={<ProductPage />} />

		  
        <Route path="/address" element={<AddressPage/>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}