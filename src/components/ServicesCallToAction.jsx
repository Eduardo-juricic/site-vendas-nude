// src/components/ContactCallToAction.jsx (sugestão de novo nome)
import React from "react";
import { motion } from "framer-motion";

// Ícone do WhatsApp (opcional, mas pode melhorar a UI)
const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6 inline-block mr-2" // Ajuste o estilo conforme necessário
    fill="currentColor" // Geralmente branco para botões coloridos
    viewBox="0 0 24 24"
  >
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413z" />
  </svg>
);

function ContactCallToAction() {
  // Nome do componente alterado
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1.0,
        ease: "easeOut",
        delay: 0.4,
      },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 },
    },
    tap: { scale: 0.95 },
  };

  // Substitua SEUNUMERODOTELEFONE pelo seu número real
  const whatsappNumber = "SEUNUMERODOTELEFONE"; // Ex: "5521999998888"
  const whatsappMessage = encodeURIComponent(
    "Olá! Gostaria de mais informações sobre seus produtos."
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <motion.section
      className="bg-white py-16 md:py-24 text-center"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-6 leading-tight">
          Entre em Contato Conosco! {/* Título Alterado */}
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
          {/* Texto Alterado */}
          Tem alguma dúvida ou quer fazer um pedido especial? <br />
          Fale conosco diretamente pelo WhatsApp!
        </p>
        {/* O Link foi substituído por uma tag 'a' para link externo */}
        <motion.a
          href={whatsappUrl}
          target="_blank" // Abre o link em uma nova aba
          rel="noopener noreferrer" // Boas práticas de segurança para links externos
          className="bg-green-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg uppercase tracking-wide
                    hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75
                     inline-flex items-center" // Adicionado inline-flex para alinhar ícone e texto
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <WhatsAppIcon /> {/* Ícone adicionado */}
          Falar no WhatsApp {/* Texto do Botão Alterado */}
        </motion.a>
      </div>
    </motion.section>
  );
}

export default ContactCallToAction; // Nome do componente exportado alterado
