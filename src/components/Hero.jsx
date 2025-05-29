import { useLocation, useNavigate } from "react-router-dom"; // Adicionado
import { Link as ScrollLink, scroller } from "react-scroll"; // Adicionado scroller e ScrollLink (apesar de não usarmos ScrollLink diretamente no botão, scroller é o principal)
import { motion } from "framer-motion";

function Hero() {
  const location = useLocation(); // Adicionado
  const navigate = useNavigate(); // Adicionado

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

  const atelieTitle = "A Essência do Artesanato";
  const atelieTitleWords = atelieTitle.split(" ");
  const atelieDescription =
    "Peças únicas, criadas com alma e paixão, que levam afeto e originalidade para o seu lar. Descubra a arte que toca o coração.";
  const buttonText = "Conheça Nossos Produtos";
  // const buttonLink = "/produtos"; // Não será mais um Link direto

  const heroBackgroundColor =
    "bg-gradient-to-br from-emerald-200 via-teal-300 to-cyan-300";
  const subtitleTextColor = "text-emerald-700";
  const titleTextColor = "text-emerald-800";
  const paragraphTextColor = "text-emerald-700";
  const buttonClasses =
    "bg-white text-emerald-600 hover:bg-emerald-50 font-bold py-4 px-10 rounded-md text-xl shadow-xl cursor-pointer"; // Adicionado cursor-pointer
  const subtitleText = "✨ Bem-vindo ao Nosso Ateliê ✨";

  const handleScrollToProducts = () => {
    if (location.pathname === "/") {
      // Já está na home, apenas rola
      scroller.scrollTo("produtos-section", {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
        offset: -70, // Ajuste conforme a altura do seu header fixo ou outra necessidade de offset
      });
    } else {
      // Navega para a home e, após a navegação, a rolagem será tratada
      // pelo useEffect em App.jsx (ou similar) que escuta por hash na URL.
      // Se não houver tal useEffect, pode ser necessário um pequeno delay aqui.
      navigate("/#produtos-section");
    }
  };

  return (
    <motion.section
      className={`${heroBackgroundColor} py-28 md:py-44 text-center flex flex-col items-center justify-center min-h-screen relative overflow-hidden`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto relative z-10 px-4">
        <motion.h2
          className={`text-md md:text-lg font-semibold uppercase tracking-wider ${subtitleTextColor} mb-3`}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
        >
          {subtitleText}
        </motion.h2>
        <motion.h1
          className={`text-4xl md:text-6xl font-serif font-bold mb-5 ${titleTextColor} drop-shadow-md`}
        >
          {atelieTitleWords.map((word, index) => (
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
          className={`text-lg md:text-2xl mb-10 max-w-xl mx-auto ${paragraphTextColor}`}
          variants={textVariants}
          initial="hidden"
          animate="visible"
          transition={{
            delay: atelieTitleWords.length * 0.15 + 0.3,
            duration: 0.7,
            ease: "easeOut",
          }}
        >
          {atelieDescription}
        </motion.p>
        {/* Alterado de Link para motion.button com onClick */}
        <motion.button
          onClick={handleScrollToProducts} // Adicionado onClick
          className={buttonClasses}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          initial="hidden"
          animate="visible"
          transition={{
            delay: atelieTitleWords.length * 0.15 + 0.6,
            duration: 0.6,
            ease: [0.6, -0.05, 0.01, 0.99],
          }}
        >
          {buttonText}
        </motion.button>
      </div>
    </motion.section>
  );
}

export default Hero;
