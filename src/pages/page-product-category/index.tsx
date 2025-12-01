import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Toast } from "primereact/toast";
import ProductService from "@/services/Product-service";
import CategoryService from "@/services/Category-service";
import type { IProduct, ICategory } from "@/commons/types";
import { ProductCard } from "@/components/product-card";
import "./page-product-category.css";

export const CategoryProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);

  const [products, setProducts] = useState<IProduct[]>([]);
  const [category, setCategory] = useState<ICategory | null>(null);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  const toast = useRef<Toast>(null);

  const { findAll: findAllProducts } = ProductService;
  const { findById: findCategoryById } = CategoryService;

  useEffect(() => {
    const loadData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          findAllProducts(),
          findCategoryById(categoryId)
        ]);

        if (prodRes.status === 200 && Array.isArray(prodRes.data)) {
          const filtered = prodRes.data.filter(
            (p) => p.category.id === categoryId
          );
          setProducts(filtered);
        }

        if (catRes.data) {
          setCategory(catRes.data as ICategory);
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
  }, [categoryId]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentPageSafe = Math.min(currentPage, totalPages || 1);
  const indexOfLastProduct = currentPageSafe * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const paginatedData = products.slice(indexOfFirstProduct, indexOfLastProduct);

  return (
    <main className="product-page">
      <Toast ref={toast} />

      <h2 className="title">
        {category ? ` ${category.name}` : "Carregando categoria..."}
      </h2>

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-muted">
          Nenhum produto encontrado para esta categoria.
        </p>
      ) : (
        <>
          <section>
            <div className="cards-posicionamento" id="produtosContainer">
              {paginatedData.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </section>

          <div className="pagination">
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
                className={`btn btn-sm ${currentPageSafe === i + 1 ? "btn-danger" : "btn-outline-secondary"
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
