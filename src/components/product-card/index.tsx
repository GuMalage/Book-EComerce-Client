import type { IProduct } from "@/commons/types";
import "./index.css";

export function ProductCard({ product }: { product: IProduct }) {
    const precoFormatado = product.price.toFixed(2).replace('.', ',');

    return (
        <div className="card border-0">
           <div className="position-relative">
            <a href={`produto.html?id=${product.id}`} className="link-produto">
                <img src={product.img as string} className="card-img-top" alt={product.name}/>
            </a>
            </div>

            <div className="card-body p-2 card-hover">
                <a href={`produto.html?id=${product.id}`} className="fw-bold link-produto">
                    {product.name}
                </a>

                <div className="progress mb-2" style={{ height: '6px' }}>
                    <div className="progress-bar" style={{ width: '80%' }}></div>
                </div>

                <p className="mb-1 fw-bold">
                    &nbsp;
                    <span className="preco">R${precoFormatado}</span>
                </p>

                <div className="text-warning estrelas">★★★★☆</div>

                <button data-id={product.id} className="btn-adicionar-carrinho w-100 mt-2">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    );
}
