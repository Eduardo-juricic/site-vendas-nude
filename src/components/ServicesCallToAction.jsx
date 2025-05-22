// src/components/ServicesCallToActionOption2.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function ServicesCallToActionOption2() {
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 }, // Começa menor e invisível
    visible: {
      opacity: 1,
      scale: 1, // Volta ao tamanho normal
      transition: {
        duration: 1.0, // Duração maior para o zoom
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
          Nossos Serviços Especializados
        </h2>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto mb-10">
          Descubra uma gama completa de tratamentos estéticos e de bem-estar
          personalizados para realçar sua beleza natural e promover sua saúde.
        </p>
        <Link to="/servicos">
          <motion.button
            className="bg-green-600 text-white font-bold py-4 px-10 rounded-full text-xl shadow-lg uppercase tracking-wide
                      hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Conheça Nossos Serviços
          </motion.button>
        </Link>
      </div>
    </motion.section>
  );
}

export default ServicesCallToActionOption2;
