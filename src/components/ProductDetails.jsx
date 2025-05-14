// ProductDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { FaShoppingCart, FaStar, FaTag } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // Importe o hook useCart

function ProductDetails() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const { addToCart } = useCart(); // Acesse a função addToCart
  const navigate = useNavigate(); // Inicialize useNavigate

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const produtoRef = doc(db, "produtos", id);
        const docSnap = await getDoc(produtoRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProduto(data);
          console.log("Dados do Produto:", data);
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
  }, [id]);

  if (loading) {
    return (
      <div className="product-details-loading-alt">
        Carregando detalhes do produto...
      </div>
    );
  }

  if (error) {
    return <div className="product-details-error-alt">Erro: {error}</div>;
  }

  if (!produto) {
    return (
      <div className="product-details-not-found-alt">
        Produto não encontrado.
      </div>
    );
  }

  const handleAddToCart = () => {
    if (produto) {
      // Adiciona o produto ao carrinho usando a função do contexto
      addToCart(produto);
      alert(`${produto.nome} adicionado ao carrinho!`); // Feedback simples ao usuário

      // Opcional: Redirecionar para a página do carrinho após adicionar
      navigate("/carrinho"); // Certifique-se de que '/cart' é o caminho correto para sua CartPage
    }
  };

  return (
    <div className="product-details-card-alt">
      <div className="product-image-container-alt">
        <img
          src={produto.imagem}
          alt={produto.nome}
          className="product-image-alt"
        />
      </div>
      <div className="product-details-info-alt">
        <h2 className="product-title-alt">{produto.nome}</h2>
        <div className="product-rating-alt">
          <FaStar className="star-icon-alt" />
          <FaStar className="star-icon-alt" />
          <FaStar className="star-icon-alt" />
          <FaStar className="star-icon-alt" />
          <FaStar className="star-icon-alt" />
          <span className="rating-count-alt">(14087)</span>
        </div>
        <div className="product-price-container-alt">
          {produto && produto.preco && produto.preco_promocional ? (
            <>
              {Number(produto.preco) > Number(produto.preco_promocional) ? (
                <>
                  <span className="old-price-alt">
                    R$ {Number(produto.preco).toFixed(2)}
                  </span>
                  <span className="current-price-alt">
                    R$ {Number(produto.preco_promocional).toFixed(2)}
                  </span>
                </>
              ) : (
                <>
                  <span className="old-price-alt">
                    R$ {Number(produto.preco_promocional).toFixed(2)}
                  </span>
                  <span className="current-price-alt">
                    R$ {Number(produto.preco).toFixed(2)}
                  </span>
                </>
              )}
            </>
          ) : produto && produto.preco ? (
            <span className="current-price-alt">
              R$ {Number(produto.preco).toFixed(2)}
            </span>
          ) : (
            <span className="current-price-alt">Preço não disponível</span>
          )}
        </div>
        <div className="quantity-controls-alt">
          <button
            onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
            className="quantity-button-alt"
          >
            -
          </button>
          <input
            type="number"
            value={quantidade}
            onChange={(e) => setQuantidade(parseInt(e.target.value))}
            className="quantity-input-alt"
          />
          <button
            onClick={() => setQuantidade(quantidade + 1)}
            className="quantity-button-alt"
          >
            +
          </button>
        </div>
        <button className="buy-button-alt" onClick={handleAddToCart}>
          <FaShoppingCart className="cart-icon-alt" /> Comprar
        </button>
        {produto.destaque_curto && (
          <div className="features-section-alt">
            <h3 className="features-title-alt">Características</h3>
            <ul className="features-list-alt">
              {produto.destaque_curto.split(",").map((feature, index) => (
                <li key={index} className="feature-item-alt">
                  • {feature.trim()}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="product-description-alt">{produto.descricao}</p>
        {/* Adicione mais detalhes ou componentes aqui */}
      </div>
    </div>
  );
}

export default ProductDetails;
