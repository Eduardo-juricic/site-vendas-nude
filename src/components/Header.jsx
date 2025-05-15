import logo from "/src/assets/logo-gisele.jpg";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

function Header() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 py-2 sm:py-3">
      <div className="container mx-auto flex items-center justify-around h-24 sm:h-30">
        {/* Ícones à Esquerda */}
        <div className="flex items-center space-x-4">
          <a
            href="https://www.instagram.com/seu_perfil_instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-pink-500 transition duration-300"
          >
            <FaInstagram className="h-6 w-6" />
          </a>
          <a
            href="https://wa.me/seun_numero_whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-green-500 transition duration-300"
          >
            <FaWhatsapp className="h-6 w-6" />
          </a>
        </div>
        {/* Logo Centralizado (Reduzindo o tamanho em telas menores) */}
        <Link to="/" className="block">
          <img
            src={logo}
            alt="Logo Gisele Carvalho"
            className="w-24 sm:w-28 md:w-36 h-auto"
          />
        </Link>
        {/* Ícone do Carrinho à Direita */}
        <div className="flex items-center">
          <Link
            to="/carrinho"
            className="text-gray-500 hover:text-emerald-500 transition duration-300 relative"
          >
            <ShoppingCartIcon className="h-6 w-6 fill-current" />
            {itemCount > 0 && (
              <span className="absolute top-[-8px] right-[-8px] bg-pink-500 text-white rounded-full text-xxs px-1 font-bold">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
