import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = collection(db, "produtos");
        const snapshot = await getDocs(productsRef);
        const productsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtra os produtos que NÃO possuem a propriedade 'destaque' como true
        const produtosNormais = productsList.filter(
          (product) => !product.destaque
        );
        setProducts(produtosNormais);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Carregando produtos...</div>; // Pode usar um componente de Loading
  }

  if (error) {
    return <div>Erro: {error.message}</div>; // Lida com erros
  }

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Mais Vendidos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center p-6 mb-4" // Mantivemos o padding e a margem
            >
              <img
                src={product.imagem} // Use a URL da imagem do Cloudinary
                alt={product.nome}
                className="w-full h-80 object-cover rounded-t-lg" // Voltamos para object-cover e mantivemos h-80
              />
              <div className="p-4 flex flex-col items-center">
                <h3 className="font-semibold text-gray-700 text-center mb-3 text-lg">
                  {product.nome}
                </h3>
                <p className="text-gray-600 text-sm text-center mb-4">
                  {product.descricao}
                </p>
                <p className="text-green-500 font-bold text-xl mb-5">
                  R$ {product.preco.toFixed(2)}
                </p>
                <button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline text-sm">
                  Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Products;
