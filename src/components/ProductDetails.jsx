// ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para acessar o parâmetro da rota
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig"; // Sua configuração do Firestore

function ProductDetails() {
  const { id } = useParams(); // Obtém o ID da URL
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const produtoRef = doc(db, "produtos", id);
        const docSnap = await getDoc(produtoRef);

        if (docSnap.exists()) {
          setProduto({ id: docSnap.id, ...docSnap.data() });
        } else {
          setError("Produto não encontrado!");
        }
      } catch (err) {
        setError("Erro ao carregar detalhes do produto.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]); // Executa novamente se o ID da URL mudar

  if (loading) {
    return <div>Carregando detalhes do produto...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!produto) {
    return <div>Produto não encontrado.</div>;
  }

  return (
    <div className="container mx-auto py-16">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{produto.nome}</h1>
      <div className="md:flex md:items-start md:space-x-8">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="w-full h-auto rounded-lg shadow-md md:w-1/2"
          style={{ maxHeight: "500px", objectFit: "cover" }}
        />
        <div className="mt-6 md:mt-0 md:w-1/2">
          <p className="text-gray-600 leading-relaxed mb-4">
            {produto.descricao}
          </p>
          <p className="text-2xl font-bold text-green-600 mb-4">
            R$ {produto.preco ? produto.preco.toFixed(2) : "0.00"}
          </p>
          {/* Adicione aqui outros detalhes do produto, como opções de compra, etc. */}
          <button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline">
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
      {produto.destaque_curto && (
        <p className="mt-8 text-lg text-gray-700 italic">
          Ingredientes principais: {produto.destaque_curto}
        </p>
      )}
      {/* Você pode adicionar mais informações ou componentes aqui */}
    </div>
  );
}

export default ProductDetails;
