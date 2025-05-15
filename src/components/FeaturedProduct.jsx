// FeaturedProduct.jsx
import React, { useState, useEffect } from "react";
import featuredProductImagePlaceholder from "/src/assets/imagem-destaque.jpg";
import { getProdutoDestaque } from "../utils/firebaseUtils";
import { Link } from "react-router-dom"; // Importe o Link

function FeaturedProduct() {
  const [produtoDestaque, setProdutoDestaque] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarDestaque = async () => {
      setLoading(true);
      setError(null);
      const destaque = await getProdutoDestaque();
      if (destaque) {
        setProdutoDestaque(destaque);
      } else {
        // Define um produto padrão caso não haja destaque (opcional)
        setProdutoDestaque({
          name: "Produto Exclusivo",
          description: "Experimente a diferença com nossa fórmula avançada.",
          price: "R$ 149,90",
          imagem: featuredProductImagePlaceholder,
          destaque_curto: "", // Inicializa o novo campo no estado padrão
        });
      }
      setLoading(false);
    };

    buscarDestaque();
  }, []);

  if (loading) {
    return <div>Carregando produto em destaque...</div>;
  }

  if (error) {
    return <div>Erro ao carregar produto em destaque: {error.message}</div>;
  }

  if (!produtoDestaque) {
    return null;
  }

  return (
    <section className="py-16 bg-gradient-to-br from-emerald-700 to-emerald-300 md:py-48 text-white text-center">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-semibold text-white mb-8">
          Promoção do Mês
        </h1>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-3xl mx-auto md:flex md:items-center">
          <img
            src={produtoDestaque.imagem}
            alt={produtoDestaque.nome}
            className="w-full h-auto object-cover md:w-1/2 rounded-l-xl md:rounded-none"
            style={{ maxHeight: "400px" }}
          />
          <div className="p-8 md:p-10 md:w-1/2 text-center md:text-left">
            <h3 className="text-2xl font-semibold text-emerald-800 mb-3">
              {produtoDestaque.nome}
            </h3>
            {produtoDestaque.destaque_curto && (
              <p className="text-lg text-gray-700 mb-5">
                {produtoDestaque.descricao}
              </p>
            )}
            <p className="text-xl font-bold text-pink-700 mb-5">
              {produtoDestaque.price}
            </p>
            <Link
              to={`/produto/${produtoDestaque.id}`}
              className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline text-lg transition duration-300"
            >
              Ver Detalhes
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedProduct;
