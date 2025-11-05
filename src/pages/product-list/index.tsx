import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import ProductService from "@/services/Product-service";
import CategoryService from "@/services/Category-service";
import type { IProduct, ICategory } from "@/commons/types";
import { ProductCard } from "@/components/product-card";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import "./index.css";

export const ProductListPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const { findAll: findAllProducts } = ProductService;
  const { findAll: findAllCategories } = CategoryService;

  const toast = useRef<Toast>(null);

  const { control, watch } = useForm();
  const category = watch("category");

  // 🔹 Carrega produtos e categorias
  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          findAllProducts(),
          findAllCategories(),
        ]);

        if (prodRes.status === 200 && Array.isArray(prodRes.data)) {
          setProducts(prodRes.data);
        }
        if (catRes.data && Array.isArray(catRes.data)) {
          setCategories([{ id: 0, name: "Todas as categorias" }, ...catRes.data]);
        }
      } catch {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao carregar dados do servidor.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtra por categoria
  const filteredProducts =
    !category || category.id === 0
      ? products
      : products.filter((p) => p.category.id === category.id);

  // paginacap
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentPageSafe = Math.min(currentPage, totalPages || 1);
  const indexOfLastProduct = currentPageSafe * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedData = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  return (
    <main className="container py-4">
      <Toast ref={toast} />

      <div className="categoria-container">
        <label className="categoria-label">Categoria</label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Dropdown
              {...field}
              options={categories}
              optionLabel="name"
              placeholder="Selecione uma categoria"
              className="categoria-dropdown"
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
            />
          )}
        />
      </div>

      <h2 className="mb-4 text-center">Lista de Produtos Encontrados</h2>

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-center text-muted">
          Nenhum produto encontrado para esta categoria.
        </p>
      ) : (
        <>
          <div className="grid-product">
            {paginatedData.map((product) => (
              <div key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(currentPageSafe - 1)}
              disabled={currentPageSafe <= 1 || totalPages === 0}
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn btn-sm ${
                  currentPageSafe === i + 1 ? "btn-danger" : "btn-outline-secondary"
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setCurrentPage(currentPageSafe + 1)}
              disabled={currentPageSafe >= totalPages || totalPages === 0}
            >
              Próximo
            </button>
          </div>
        </>
      )}
    </main>
  );
};
