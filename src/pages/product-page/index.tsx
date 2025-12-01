import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type { IProduct } from "@/commons/types";
import ProductService from "@/services/Product-service";
import { Toast } from "primereact/toast";
import AddToCartProvider from "@/components/add-cart";
import "./product-page.css";

export const ProductPage = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<IProduct | null>(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef<Toast>(null);

    const { findById } = ProductService;

    useEffect(() => {
        const loadData = async () => {
            try {
                if (!id) throw new Error("ID do produto não informado.");

                const prodRes = await findById(Number(id));

                if (prodRes?.status === 200 && prodRes.data) {
                    setProduct(prodRes.data as IProduct);
                } else {
                    throw new Error("Produto não encontrado.");
                }
            } catch (err: any) {
                toast.current?.show({
                    severity: "error",
                    summary: "Erro",
                    detail: err.message,
                    life: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id]);

    if (loading) return <p className="loading-message">Carregando...</p>;
    if (!product) return <p className="error-message">Produto não encontrado.</p>;

    const precoFormatado = product.price
        ? product.price.toFixed(2).replace(".", ",")
        : "0,00";

    return (
        <>
            <Toast ref={toast} />

            <AddToCartProvider>
                {(addToCart) => (
                    <div className="product-detail-page">
                        <section className="product-main-section">
                            <div className="image-column">
                                <img
                                    id="imagemPrincipal"
                                    className="main-image"
                                    src={product.urlImage}
                                    alt={product.name}
                                />

                                <div className="sub-images">
                                    {[1, 2, 3].map((i) => (
                                        <img
                                            key={i}
                                            className="sub-image"
                                            src={product.urlImage}
                                            alt={product.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="info-column">
                                <div className="product-details">
                                    <small className="product-status">Em Estoque</small>

                                    <div className="product-name">
                                        <h1>{product.name}</h1>
                                    </div>

                                    {product.autorName && (
                                        <p className="product-author">
                                            Por: <strong>{product.autorName}</strong>
                                        </p>
                                    )}

                                    <div className="product-price">
                                        <p className="price-value">R$ {precoFormatado}</p>
                                    </div>

                                    <div className="rating-stars">
                                        ★★★★★ (4.5/5)
                                    </div>

                                    <hr className="divider-product-page" />

                                    <div className="product-description">
                                        <p>{product.description}</p>
                                    </div>
                                </div>

                                <button
                                    className="btn-adicionar-carrinho"
                                    onClick={() => addToCart(product)}
                                >
                                    Adicionar ao Carrinho
                                </button>

                            </div>
                        </section>

                        <section className="details-reviews-container">
                            <div className="details-title">
                                <h2>Detalhes do Produto e Avaliações</h2>

                            </div>

                            <div className="details-reviews">
                                <div className="details-content">
                                    <p>{product.longDescription}</p>
                                </div>
                                <div className="review-summary">
                                    <h3>
                                        4.5<span>/5</span>
                                    </h3>
                                    <div className="rating-stars">★★★★★</div>
                                    <p className="review-count">
                                        Baseado em 125 Avaliações
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>
                )}
            </AddToCartProvider>
        </>
    );
};

export default ProductPage;