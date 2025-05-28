import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero({ produtoDestaque }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  };

  const titleElementVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.4 },
    },
    hover: {
      scale: 1.08,
      boxShadow: "0px 6px 20px rgba(100, 50, 20, 0.25)",
      transition: { type: "spring", stiffness: 350, damping: 12 },
    },
    tap: { scale: 0.92 },
  };

  if (produtoDestaque && produtoDestaque.id) {
    const produtoDestaqueTitle =
      produtoDestaque.nomeHero || "Destaque do Ateliê";
    const produtoDestaqueTitleWords = produtoDestaqueTitle.split(" ");

    return (
      <motion.section
        // ALTERAÇÃO: min-h-[65vh] para min-h-screen
        className="bg-gradient-to-br from-emerald-200 via-teal-300 to-cyan-300 py-28 md:py-44 text-center flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto relative z-10 px-4">
          <motion.h2
            className="text-md md:text-lg font-semibold uppercase tracking-wider text-emerald-700 mb-3"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          >
            ✨ Promoção Especial ✨
          </motion.h2>
          <motion.h1 className="text-4xl md:text-6xl font-serif font-bold mb-5 text-emerald-800 drop-shadow-md">
            {produtoDestaqueTitleWords.map((word, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={titleElementVariants}
                style={{ display: "inline-block", marginRight: "0.2em" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl mb-10 max-w-xl mx-auto text-emerald-700"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: produtoDestaqueTitleWords.length * 0.15 + 0.3,
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            {produtoDestaque.descricaoHero ||
              "Descubra os detalhes encantadores da nossa peça selecionada."}
          </motion.p>
          <Link to={`/produto/${produtoDestaque.id}`}>
            <motion.button
              className="bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-4 px-10 rounded-md text-xl shadow-xl"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial="hidden"
              animate="visible"
              transition={{
                delay: produtoDestaqueTitleWords.length * 0.15 + 0.6,
                duration: 0.6,
                ease: [0.6, -0.05, 0.01, 0.99],
              }}
            >
              Ver Detalhes da Promoção
            </motion.button>
          </Link>
        </div>
      </motion.section>
    );
  } else {
    const fallbackTitle = "Nosso Cantinho Criativo";
    const fallbackTitleWords = fallbackTitle.split(" ");

    return (
      <motion.section
        // ALTERAÇÃO: min-h-[55vh] para min-h-screen
        className="bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 py-28 md:py-44 text-center flex flex-col items-center justify-center min-h-screen overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto relative z-10 px-4">
          <motion.h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-stone-700 drop-shadow-sm">
            {fallbackTitleWords.map((word, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={titleElementVariants}
                style={{ display: "inline-block", marginRight: "0.2em" }}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl mb-10 max-w-xl mx-auto text-stone-600"
            variants={textVariants}
            initial="hidden"
            animate="visible"
            transition={{
              delay: fallbackTitleWords.length * 0.15 + 0.2,
              duration: 0.7,
              ease: "easeOut",
            }}
          >
            Peças únicas, feitas à mão, que carregam afeto e originalidade.
          </motion.p>
          <motion.button
            className="bg-amber-500 text-white hover:bg-amber-600 font-semibold py-3 px-8 rounded-md text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            disabled
            initial="hidden"
            animate="visible"
            transition={{
              delay: fallbackTitleWords.length * 0.15 + 0.5,
              duration: 0.6,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
          >
            Promoção Indisponível
          </motion.button>
        </div>
      </motion.section>
    );
  }
}

export default Hero;
