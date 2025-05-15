import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

function CartPage() {
  const { cartItems, updateQuantity, removeItem, getTotal } = useCart();
  const [observation, setObservation] = useState("");

  const handleQuantityChange = (productId, quantity) => {
    const newQuantity = Math.max(1, parseInt(quantity, 10) || 1);
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    removeItem(productId);
  };

  const total = getTotal();

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center bg-white shadow-lg rounded-lg mt-10 max-w-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
          Seu carrinho está vazio.
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Que tal explorar nossos produtos incríveis?
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-600 transition duration-300 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414L7.5 8.586 5.707 6.879a1 1 0 00-1.414 1.414l2.5 2.5a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          Voltar para a loja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b pb-4">
        Seu Carrinho de Compras
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <ul className="divide-y divide-gray-200">
            {cartItems.map((item) => {
              // Divide a string destaque_curto em um array de características
              const caracteristicas = item.destaque_curto
                ? item.destaque_curto
                    .split(";")
                    .map((c) => c.trim())
                    .filter((c) => c !== "")
                : [];

              return (
                <li key={item.id} className="flex flex-col sm:flex-row py-6">
                  <div className="flex-shrink-0 w-32 h-32 sm:w-40 sm:h-40 relative rounded-md overflow-hidden">
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-full h-full object-cover object-center"
                    />
                    {item.preco_promocional &&
                      item.preco_promocional < item.preco && (
                        <span className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                          Promoção!
                        </span>
                      )}
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {item.nome}
                        </h3>
                        {item.preco_promocional &&
                        item.preco_promocional < item.preco ? (
                          <div className="text-lg font-semibold flex items-baseline">
                            <span className="text-gray-500 line-through mr-2">
                              R$ {item.preco.toFixed(2)}
                            </span>
                            <span className="text-emerald-600">
                              R$ {item.preco_promocional.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <p className="text-lg font-semibold text-gray-800">
                            R$ {item.preco.toFixed(2)}
                          </p>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {item.descricao}
                      </p>
                      {/* INÍCIO DA MUDANÇA PARA LISTA DE CARACTERÍSTICAS */}
                      {caracteristicas.length > 0 && (
                        <div className="mt-2 text-sm text-gray-700">
                          <p className="font-semibold mb-1">Características:</p>
                          <ul className="list-disc list-inside space-y-0.5 text-gray-600">
                            {caracteristicas.map((caracteristica, index) => (
                              <li key={index}>{caracteristica}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {/* FIM DA MUDANÇA */}
                    </div>
                    <div className="flex flex-1 items-end justify-between text-sm mt-4 sm:mt-0">
                      <div className="flex items-center">
                        <label
                          htmlFor={`quantity-${item.id}`}
                          className="mr-2 text-gray-700"
                        >
                          Qtd:
                        </label>
                        <input
                          id={`quantity-${item.id}`}
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, e.target.value)
                          }
                          className="w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-center text-gray-900"
                        />
                      </div>
                      <div className="flex">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 transition duration-200 ease-in-out font-medium"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <label
              htmlFor="observation"
              className="block text-gray-800 text-base font-semibold mb-2"
            >
              Observação (opcional):
            </label>
            <textarea
              id="observation"
              value={observation}
              onChange={(e) => setObservation(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-gray-700 placeholder-gray-400"
              rows="4"
              placeholder="Adicione observações sobre o pedido, como preferências de entrega ou mensagens."
            ></textarea>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Resumo do Pedido
          </h3>
          <div className="flex justify-between items-center text-gray-700 text-lg mb-2">
            <span>Subtotal:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-extrabold text-gray-900 border-t pt-4 mt-4">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-md text-lg shadow-lg transform transition duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
            Finalizar Compra
          </button>
          <div className="mt-4 text-center">
            <Link
              to="/"
              className="text-emerald-600 hover:text-emerald-800 hover:underline transition duration-200 ease-in-out font-medium"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
