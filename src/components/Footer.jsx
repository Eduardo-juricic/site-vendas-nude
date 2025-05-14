import { FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa"; // Ícones populares do Font Awesome

function Footer() {
  return (
    <footer className="bg-gray-100 py-6 text-center text-gray-600 text-sm">
      <div className="container mx-auto flex flex-col items-center">
        {/* Copyright */}
        <p className="mb-3">© {new Date().getFullYear()} Gisele Carvalho</p>

        {/* Redes Sociais */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-pink-500">
            <FaInstagram className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-pink-500">
            <FaTiktok className="h-5 w-5" />
          </a>
          <a href="#" className="hover:text-pink-500">
            <FaYoutube className="h-5 w-5" />
          </a>
        </div>
        {/* Outras informações (opcional) */}
        <p className="mt-3 text-xs">Rua Exemplo, 123 - Araruama, RJ</p>
      </div>
    </footer>
  );
}

export default Footer;
