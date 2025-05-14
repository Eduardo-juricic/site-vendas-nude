import React, { useState } from "react";
import logo from "/src/assets/logo-gisele.jpg";
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/outline";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* Barra Superior de Destaque */}
      <div className="bg-pink-500 text-white text-center py-0.5">
        <p className="text-xs">Descubra a Beleza que Inspira</p>
      </div>

      {/* Seção Principal */}
      <div className="container mx-auto flex items-center justify-between py-1 md:py-2">
        {/* Logo */}
        <div className="w-20 md:w-24">
          <img
            src={logo}
            alt="Logo Gisele Carvalho"
            className="w-full h-auto"
          />
        </div>

        {/* Barra de Busca */}
        <div className="flex-grow mx-1 md:mx-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Digite aqui o que procura..."
              className="w-full border border-gray-300 rounded-full py-1 px-2 text-xxs focus:outline-none focus:ring-green-500"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
              <MagnifyingGlassIcon className="h-3 w-3 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Ícones de Ação */}
        <div className="hidden md:flex items-center space-x-1 md:space-x-2">
          <a href="#" className="text-pink-500 hover:text-pink-700 text-xs">
            <ShoppingCartIcon className="h-5 w-5 fill-current" />{" "}
            {/* Increased size */}
          </a>
        </div>
        {/* Ícone de Carrinho para telas menores */}
        <div className="md:hidden">
          <a href="#" className="text-pink-500 hover:text-pink-700 text-sm">
            <ShoppingCartIcon className="h-5 w-5 fill-current" />{" "}
            {/* Increased size */}
          </a>
        </div>
      </div>

      {/* Barra de Navegação */}
      <nav className="bg-gray-100 py-0.5 md:py-1 hidden md:block">
        <div className="container mx-auto flex justify-around text-xxs md:text-xs">
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Kits
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Bath & Body
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Body Splash
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Perfumaria
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Skincare
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Body Cream
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            The Cream
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            The Oil
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Make
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Hair
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Roll-on
          </a>
          <a
            href="#"
            className="text-gray-700 hover:text-green-500 font-semibold"
          >
            Bem-estar
          </a>
        </div>
      </nav>

      {/* Navegação para telas menores (hambúrguer) */}
      <div className="md:hidden bg-gray-100 py-1 text-center">
        <button
          className="text-gray-700 hover:text-green-500"
          onClick={toggleMobileMenu}
        >
          <Bars3Icon className="h-4 w-4 fill-current mx-auto" />
          <span className="text-xs">Menu</span>
        </button>
        {/* Menu Mobile */}
        <div
          className={`bg-gray-100 p-2 ${isMobileMenuOpen ? "block" : "hidden"}`}
        >
          <nav className="flex flex-col items-center space-y-1">
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Kits
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Bath & Body
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Body Splash
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Perfumaria
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Skincare
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Body Cream
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              The Cream
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              The Oil
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Make
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Hair
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Roll-on
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-green-500 font-semibold text-sm"
            >
              Bem-estar
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
