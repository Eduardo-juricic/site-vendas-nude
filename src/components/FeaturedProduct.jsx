// src/components/FeaturedProduct.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import featuredProductImagePlaceholder from "/src/assets/imagem-destaque.jpg"; //
import { getProdutoDestaque } from "../utils/firebaseUtils"; //

function FeaturedProduct() {
  const [produtoDestaque, setProdutoDestaque] = useState(null); //
  const [loading, setLoading] = useState(true); //
  const [error, setError] = useState(null); //

  useEffect(() => {
    const buscarDestaque = async () => {
      setLoading(true); //
      setError(null); //
      try {
        const destaque = await getProdutoDestaque(); //
        if (destaque && destaque.id) {
          //
          setProdutoDestaque(destaque); //
        } else {
          setProdutoDestaque({
            //
            id: "produto-exclusivo-fallback", //
            nome: "Tesouros Artesanais", //
            descricao:
              "Explore peças únicas, criadas com paixão e esmero, perfeitas para adicionar um toque especial ao seu ambiente.", //
            imageUrl: featuredProductImagePlaceholder, //
          });
        }
      } catch (err) {
        console.error("Erro ao buscar produto destaque:", err); //
        setError(err); //
        setProdutoDestaque({
          //
          id: "produto-erro-fallback", //
          nome: "Algo Inesperado", //
          descricao:
            "Não conseguimos carregar nosso destaque no momento. Que tal explorar outras maravilhas do nosso ateliê?", //
          imageUrl: featuredProductImagePlaceholder, //
        });
      } finally {
        setLoading(false); //
      }
    };

    buscarDestaque(); //
  }, []);

  const sectionVariants = {
    //
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const cardMotionProps = {
    //
    initial: { opacity: 0, x: -50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "circOut", delay: 0.1 },
    viewport: { once: true, amount: 0.2 },
  };

  const contentMotionProps = {
    //
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "circOut", delay: 0.3 },
    viewport: { once: true, amount: 0.2 },
  };

  // ANIMAÇÃO DO BOTÃO ATUALIZADA
  const buttonMotionProps = {
    whileHover: {
      scale: 1.05, // Aumenta o tamanho sutilmente
      // A cor de fundo no hover é controlada pelo className do Link (Tailwind CSS)
      // Adicionar uma sombra sutil no hover pode ser uma opção, se desejar:
      // boxShadow: "0px 8px 15px rgba(0,0,0,0.1)",
    },
    whileTap: {
      scale: 0.95, // Diminui o tamanho ao clicar
    },
    transition: {
      // Usando tween para uma transição mais direta
      type: "tween",
      duration: 0.15, // Duração curta para resposta rápida
      ease: "easeOut",
    },
  };

  const mainSectionBackgroundColor = "bg-stone-50"; //
  const mainSectionTitleColor = "text-stone-700"; //

  if (loading) {
    //
    return (
      <section
        className={`bg-gray-100 py-28 md:py-44 text-center flex items-center justify-center min-h-[60vh]`}
      >
        <div className={`text-2xl text-gray-600 font-semibold`}>
          Carregando nosso destaque...
        </div>
      </section>
    );
  }

  if (error) {
    //
    return (
      <section
        className={`py-16 bg-red-50 md:py-48 text-red-700 text-center flex flex-col items-center justify-center min-h-[60vh]`}
      >
        <h2 className="text-3xl font-semibold mb-4">Ocorreu um Erro</h2>
        <p className="text-xl mb-2">
          Não foi possível carregar o produto em destaque.
        </p>
        <p className="text-md">
          {error.message || "Tente novamente mais tarde."}
        </p>
      </section>
    );
  }

  if (!produtoDestaque || !produtoDestaque.id) {
    //
    return (
      <section
        className={`bg-gray-100 py-28 md:py-44 text-center flex items-center justify-center min-h-[60vh]`}
      >
        <div className={`text-2xl text-gray-500 font-semibold`}>
          Nenhuma joia em destaque no momento.
        </div>
      </section>
    );
  }

  const imageUrl = //
    produtoDestaque.imageUrl ||
    produtoDestaque.imagem ||
    featuredProductImagePlaceholder;

  return (
    <motion.section
      className={`${mainSectionBackgroundColor} py-20 md:py-28 overflow-hidden`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <h2
            className={`text-3xl md:text-4xl font-serif font-bold ${mainSectionTitleColor} tracking-tight`}
          >
            Conheça Nossa Peça Destaque
          </h2>
          <p className="mt-3 text-lg text-stone-500 max-w-2xl mx-auto">
            Uma amostra do carinho e da dedicação que colocamos em cada criação.
          </p>
        </div>

        <motion.div
          className="max-w-5xl mx-auto bg-white rounded-xl shadow-2xl md:flex md:items-stretch overflow-hidden"
          {...cardMotionProps}
        >
          <div className="md:w-1/2">
            {" "}
            <img
              src={imageUrl}
              alt={produtoDestaque.nome || "Produto em destaque"}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>
          <motion.div
            className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center text-center"
            {...contentMotionProps}
          >
            {/* ADICIONADO MARGEM NO TOPO AQUI (mt-6) */}
            <h3 className="text-3xl lg:text-4xl font-bold text-emerald-700 mb-4 leading-tight mt-6 md:mt-0">
              {" "}
              {/* Adicionado mt-6, e md:mt-0 para resetar em telas maiores se o justify-center já for suficiente */}
              {produtoDestaque.nome || "Nome Indisponível"}
            </h3>
            <p className="text-stone-600 text-base md:text-lg mb-8 leading-relaxed">
              {produtoDestaque.descricao || "Descrição não disponível."}
            </p>
            {/* PREÇO REMOVIDO */}

            {produtoDestaque.id && (
              <motion.div
                className="mt-auto"
                variants={buttonMotionProps}
                whileHover="whileHover"
                whileTap="whileTap"
              >
                <Link
                  to={`/produto/${produtoDestaque.id}`}
                  className="inline-block bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg text-lg
                            shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2
                            focus:ring-emerald-500 focus:ring-opacity-75
                            transition-colors duration-200 ease-in-out"
                >
                  Ver Detalhes da Peça
                  <span className="ml-2" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default FeaturedProduct;
