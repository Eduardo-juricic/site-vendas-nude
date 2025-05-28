// src/components/FeaturedProduct.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import featuredProductImagePlaceholder from "/src/assets/imagem-destaque.jpg";
import { getProdutoDestaque } from "../utils/firebaseUtils"; //

function FeaturedProduct() {
  const [produtoDestaque, setProdutoDestaque] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const buscarDestaque = async () => {
      setLoading(true);
      setError(null);
      try {
        const destaque = await getProdutoDestaque(); //
        if (destaque && destaque.id) {
          setProdutoDestaque(destaque);
        } else {
          setProdutoDestaque({
            id: "produto-exclusivo-fallback",
            name: "Peça Exclusiva do Ateliê",
            description:
              "Descubra nossa seleção especial de artesanato, peças únicas feitas com carinho e dedicação, perfeitas para presentear ou decorar.",
            price: "R$ 149,90", // Mantido como string para fallback simples
            imageUrl: featuredProductImagePlaceholder,
          });
        }
      } catch (err) {
        console.error("Erro ao buscar produto destaque:", err);
        setError(err);
        setProdutoDestaque({
          id: "produto-erro-fallback",
          name: "Ops! Algo Aconteceu",
          description:
            "Tivemos um problema ao carregar nosso produto destaque. Explore nossos outros produtos!",
          price: "Confira!",
          imageUrl: featuredProductImagePlaceholder,
        });
      } finally {
        setLoading(false);
      }
    };

    buscarDestaque();
  }, []);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const cardMotionProps = {
    initial: { opacity: 0, scale: 0.9 },
    whileInView: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, delay: 0.2 },
    viewport: { once: true, amount: 0.3 },
  };

  const buttonMotionProps = {
    whileHover: {
      scale: 1.05,
      boxShadow: "0px 7px 15px rgba(0,0,0,0.15)", // Sombra mais suave no hover
    },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  };

  const sectionMinHeight =
    "min-h-[calc(100vh-var(--header-height,100px))] md:min-h-0";
  // Cor de fundo do Hero, conforme solicitado
  const heroBackgroundColor =
    "bg-gradient-to-br from-emerald-200 via-teal-300 to-cyan-300"; //
  const sectionTextColor = "text-emerald-800";

  if (loading) {
    return (
      <section
        className={`${heroBackgroundColor} py-28 md:py-44 text-center flex items-center justify-center ${sectionMinHeight}`}
      >
        <div className={`text-2xl ${sectionTextColor} font-semibold`}>
          Carregando destaque...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className={`py-16 bg-red-100 md:py-48 text-red-700 text-center flex flex-col items-center justify-center ${sectionMinHeight}`}
      >
        <h2 className="text-3xl font-semibold mb-4">Ocorreu um Erro</h2>
        <p className="text-xl mb-2">
          Não foi possível carregar o produto em destaque.
        </p>
        <p className="text-md">{error.message}</p>
      </section>
    );
  }

  if (!produtoDestaque) {
    return (
      <section
        className={`${heroBackgroundColor} py-28 md:py-44 text-center flex items-center justify-center ${sectionMinHeight}`}
      >
        <div className={`text-2xl ${sectionTextColor} font-semibold`}>
          Nenhum produto em destaque no momento.
        </div>
      </section>
    );
  }

  const imageUrl =
    produtoDestaque.imageUrl ||
    produtoDestaque.imagem ||
    featuredProductImagePlaceholder;

  return (
    <motion.section
      className={`${heroBackgroundColor} py-20 md:py-32`}
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h2
          className={`text-4xl md:text-5xl font-extrabold mb-6 md:mb-10 leading-tight ${sectionTextColor}`}
        >
          ✨ Destaque do Ateliê ✨
        </h2>
        <motion.div
          className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto md:flex md:items-stretch"
          {...cardMotionProps}
        >
          <img
            src={imageUrl}
            alt={produtoDestaque.name || "Produto em destaque"}
            className="w-full h-64 md:h-auto object-cover md:w-1/2 rounded-t-xl md:rounded-l-xl md:rounded-t-none"
          />
          <div className="p-6 md:p-10 md:w-1/2 flex flex-col justify-center text-center md:text-left">
            <h3 className="text-3xl lg:text-4xl font-bold text-emerald-700 mb-3">
              {produtoDestaque.name || "Nome Indisponível"}
            </h3>
            <p className="text-stone-700 text-base md:text-lg mb-5">
              {produtoDestaque.description || "Descrição não disponível."}
            </p>
            <p className="text-2xl lg:text-3xl font-extrabold text-emerald-600 mb-6">
              {typeof produtoDestaque.price === "number"
                ? `R$ ${produtoDestaque.price.toFixed(2).replace(".", ",")}`
                : produtoDestaque.price || "Preço sob consulta"}
            </p>
            {produtoDestaque.id && (
              <div className="mt-auto text-center md:text-left">
                {" "}
                {/* Garante que o botão fique na parte inferior e alinhado */}
                <motion.div
                  // Aplicando as props de animação da framer-motion diretamente
                  // Não precisa de className aqui se o Link já controla o layout
                  {...buttonMotionProps}
                  className="inline-block" // Para que a animação de scale funcione bem
                >
                  <Link
                    to={`/produto/${produtoDestaque.id}`}
                    // Classes do botão revisadas:
                    className="inline-block bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg text-lg
                              shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2
                              focus:ring-emerald-500 focus:ring-opacity-75
                               transition-colors duration-200 ease-in-out" // Transição apenas para cores
                  >
                    Ver Detalhes
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default FeaturedProduct;
