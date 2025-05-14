import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // Importe o hook useCart do novo local
import { Link } from "react-router-dom"; // Se você estiver usando rotas

function CartPage() {
  const { cartItems, updateQuantity, removeItem, getTotal } = useCart();
  const [observation, setObservation] = useState("");

  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, quantity);
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const total = getTotal();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-16 text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Seu carrinho está vazio.
        </h2>
        <Link to="/" className="text-pink-500 hover:underline">
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-16">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Seu Carrinho</h2>
      <ul>
        {cartItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between py-4 border-b"
          >
            <div className="flex items-center">
              <img
                src={item.imagem}
                alt={item.nome}
                className="w-20 h-20 object-cover rounded mr-4"
              />
              <div>
                <h3 className="font-semibold text-gray-700">{item.nome}</h3>
                <p className="text-gray-600 text-sm">
                  R$ {item.preco.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-4">
                <label htmlFor={`quantity-${item.id}`} className="sr-only">
                  Quantidade
                </label>
                <input
                  id={`quantity-${item.id}`}
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, e.target.value)
                  }
                  className="w-16 text-center border border-gray-300 rounded"
                />
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:underline"
              >
                Remover
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <label
          htmlFor="observation"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Observação (opcional):
        </label>
        <textarea
          id="observation"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="3"
        ></textarea>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <p className="text-xl font-bold text-gray-800">
          Total: R$ {total.toFixed(2)}
        </p>
        <button className="bg-pink-500 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-full text-lg shadow-md">
          Finalizar Compra
        </button>
      </div>
      <div className="mt-4">
        <Link to="/" className="text-pink-500 hover:underline">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
}

export default CartPage;
