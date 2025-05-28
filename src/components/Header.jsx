import React, { useState, useEffect } from "react";
import {
  NavLink,
  Link as RouterLink,
  useLocation,
  useNavigate,
} from "react-router-dom"; // Adicionado useNavigate
import { Link as ScrollLink, scroller } from "react-scroll"; // Adicionado scroller
import { motion } from "framer-motion";

// Ícones (CartIcon, MenuIcon, CloseIcon) permanecem os mesmos...
// Ícone de Carrinho SVG (Existente)
const CartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="h-6 w-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
    />
  </svg>
);

// Ícone de Menu Hambúrguer (Heroicons outline menu)
const MenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
    />
  </svg>
);

// Ícone de Fechar (X) (Heroicons outline x-mark)
const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // Hook para navegação

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const baseLinkClasses =
    "font-medium text-stone-600 hover:text-amber-600 transition-colors duration-200";
  const mobileLinkClasses =
    "block py-3 px-4 text-base font-medium text-stone-700 hover:bg-amber-50 hover:text-amber-600 rounded-md";

  const navLinkActiveClasses = ({ isActive }) =>
    isActive
      ? "font-medium text-amber-500 transition-colors duration-200"
      : baseLinkClasses;

  const mobileNavLinkActiveClasses = ({ isActive }) =>
    isActive
      ? "block py-3 px-4 text-base font-medium text-amber-600 bg-amber-100 rounded-md"
      : mobileLinkClasses;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleProdutosMobileClick = () => {
    closeMobileMenu();
    if (location.pathname === "/") {
      // Já está na home, apenas rola
      scroller.scrollTo("produtos-section", {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -70, // Ajuste conforme a altura do seu header fixo
      });
    } else {
      // Navega para a home com o hash para indicar a rolagem
      navigate("/#produtos-section");
    }
  };

  return (
    <motion.header
      className="bg-white shadow-sm sticky top-0 z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <RouterLink
              to="/"
              className="text-2xl font-serif font-bold text-emerald-700"
              onClick={closeMobileMenu}
            >
              Ateliê Criativo
            </RouterLink>
          </div>

          {/* Navegação Desktop */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            <NavLink to="/" className={navLinkActiveClasses} end>
              Início
            </NavLink>
            <ScrollLink
              to="produtos-section"
              spy={true}
              smooth={true}
              offset={-70}
              duration={500}
              className={baseLinkClasses + " cursor-pointer"}
            >
              Produtos
            </ScrollLink>
            <RouterLink
              to="/carrinho"
              className={`${baseLinkClasses} flex items-center space-x-1`}
            >
              <CartIcon />
              <span>Carrinho</span>
            </RouterLink>
          </div>

          {/* Botão do Menu Mobile */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-stone-500 hover:text-amber-600 hover:bg-stone-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menu principal</span>
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Dropdown */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg absolute top-16 inset-x-0 z-40 pb-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink
              to="/"
              className={mobileNavLinkActiveClasses}
              end
              onClick={closeMobileMenu}
            >
              Início
            </NavLink>
            <button
              onClick={handleProdutosMobileClick}
              className={`${mobileLinkClasses} w-full text-left`} // Faz o botão parecer um link
            >
              Produtos
            </button>
            <RouterLink
              to="/carrinho"
              className={`${mobileNavLinkActiveClasses({
                isActive: location.pathname === "/carrinho",
              })} flex items-center space-x-1.5`}
              onClick={closeMobileMenu}
            >
              <CartIcon />
              <span>Carrinho</span>
            </RouterLink>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

export default Header;
