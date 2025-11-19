import { Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { RegisterPage } from "@/pages/register";
import { HomePage } from "@/pages/home";
import { RequireAuth } from "@/components/require-auth";
import { Layout } from "@/components/layout";
import { ProductListPage } from "@/pages/product-list";
import { NotFound } from "@/pages/not-found";
import { AddressPage } from "@/pages/address-form";
import { ProductPage } from "@/pages/product-page";
import { CartPage } from "@/pages/cart-page";
import CheckoutPage from "@/pages/checkout-page";
import { ProfilePage } from "@/pages/porfile-page/indes";


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/product/:id" element={<ProductPage />} />

        {/* protected routes */}
        <Route element={<RequireAuth />}>
         
          <Route path="register" element={<RegisterPage />} />
          <Route path="/address" element={<AddressPage/>} />
          
          <Route path="/checkout" element={<CheckoutPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Route>
    </Routes>
  );
}