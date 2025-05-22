import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero({ produtoDestaque }) {
  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: "easeOut", delay: 0.5 },
    },
    hover: {
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.9 },
  };

  // Fallback for when produtoDestaque is not available or valid
  const fallbackHero = (
    <section className="bg-gradient-to-br from-emerald-300 to-emerald-700 py-20 md:py-36 text-white text-center flex flex-col items-center justify-center min-h-[40vh] relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-light opacity-10 animate-pulse"></div>{" "}
      {/* Subtle animated background */}
      <div className="container mx-auto relative z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Realce Sua Beleza Autêntica
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          Descubra a nossa seleção exclusiva de produtos para uma rotina de
          cuidados que celebra a sua individualidade.
        </motion.p>
        <motion.button
          className="bg-white text-emerald-600 hover:bg-emerald-300 font-bold py-4 px-8 rounded-full text-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          whileHover="hover"
          whileTap="tap"
          disabled
        >
          Promoção indisponível
        </motion.button>
      </div>
    </section>
  );

  if (!produtoDestaque || !produtoDestaque.id) {
    return fallbackHero;
  }

  return (
    <section className="bg-gradient-to-br from-emerald-300 to-emerald-700 py-20 md:py-36 text-white text-center flex flex-col items-center justify-center min-h-[50vh] relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-light opacity-10 animate-pulse"></div>{" "}
      {/* Subtle animated background */}
      <div className="container mx-auto relative z-10">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-lg"
          variants={textVariants}
          initial="hidden"
          animate="visible"
        >
          Realce Sua Beleza Autêntica
        </motion.h1>
        <motion.p
          className="text-lg md:text-2xl mb-10 max-w-2xl mx-auto"
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          Descubra a nossa seleção exclusiva de produtos para uma rotina de
          cuidados que celebra a sua individualidade.
        </motion.p>
        <Link to={`/produto/${produtoDestaque.id}`}>
          <motion.button
            className="bg-white text-emerald-600 hover:bg-emerald-300 font-bold py-4 px-8 rounded-full text-xl shadow-lg"
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
          >
            Veja a Promoção do Mês
          </motion.button>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
