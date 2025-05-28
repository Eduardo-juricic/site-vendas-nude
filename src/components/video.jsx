// src/components/Video.jsx
import React from "react";
import { motion } from "framer-motion"; // Adicionado para animações sutis

// Ícones podem manter suas cores para diferenciação ou serem padronizados
// Vou manter as cores originais dos ícones por enquanto, pois podem ser intencionais
const features = [
  {
    icon: (
      <svg
        className="w-10 h-10 text-purple-500" // Cor ajustada para um pouco mais de vibração
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        ></path>
      </svg>
    ),
    title: "Feito à Mão com Amor",
    description:
      "Cada peça é criada com dedicação e atenção aos mínimos detalhes, garantindo um produto único e de alta qualidade.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10 text-blue-500" // Cor ajustada
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M7.217 10.38V18m0 0a2.25 2.25 0 002.25 2.25H18a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25h-5.46a2.25 2.25 0 00-1.748.77l-4.303 4.302zM19.5 9L15 4.5"
        ></path>
      </svg>
    ),
    title: "Personalização Exclusiva",
    description:
      "Deixe sua criatividade fluir! Personalizamos cores, temas, nomes, fotos e tudo mais para refletir seu estilo e desejo.",
  },
  {
    icon: (
      <svg
        className="w-10 h-10 text-pink-500" // Cor ajustada
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M15.59 14.379L11.332 18.63c-1.666 1.666-4.385 1.666-6.051 0-1.667-1.666-1.667-4.384 0-6.05l4.25-4.25m-2.127 6.051l4.25-4.25m6.051-2.127l-4.25 4.25"
        ></path>
      </svg>
    ),
    title: "Entrega Rápida e Segura",
    description:
      "Sabemos da sua ansiedade! Trabalhamos para entregar seu pedido personalizado com rapidez e segurança em todo o Brasil.",
  },
];

function Video() {
  const youtubeVideoId = "dQw4w9WgXcQ"; // MANTENHA O ID DO SEU VÍDEO AQUI!
  // Atualizando o link para o padrão do YouTube para incorporação
  const videoSrc = `https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&controls=1&modestbranding=1&rel=0`;

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      id="sobre-nos" // Alterado de "servicos" para "sobre-nos" ou similar, já que serviços foi removido
      className="py-16 md:py-24 bg-stone-50" // Fundo claro e neutro
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-700 mb-10 md:mb-12"
          variants={itemVariants}
        >
          Nossa Arte em Movimento e Compromisso
        </motion.h2>

        {/* Seção do Vídeo */}
        <motion.div className="mb-12 md:mb-16" variants={itemVariants}>
          <p className="text-base sm:text-lg text-stone-600 max-w-3xl mx-auto mb-6 md:mb-8">
            Explore um pouco do nosso processo criativo e veja a paixão que
            colocamos em cada detalhe. Acreditamos que a arte é a expressão da
            alma, e transformamos essa crença em peças únicas para você.
          </p>
          <div
            className="relative mx-auto w-full max-w-3xl aspect-video rounded-xl
                       overflow-hidden shadow-xl border border-stone-200" // Sombra padrão e borda sutil
          >
            <iframe
              src={videoSrc}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          </div>
        </motion.div>

        {/* Título para os cards de features */}
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-emerald-700 mb-10 md:mb-12 mt-12 md:mt-16"
          variants={itemVariants}
        >
          Por que nos escolher?
        </motion.h2>

        {/* Grid de Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 md:p-8 rounded-xl shadow-lg
                        transition-all duration-300 ease-in-out
                        hover:shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-1.5 border border-transparent hover:border-emerald-200"
              variants={itemVariants}
              initial="hidden" // Para animar individualmente quando entram na vista
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }} // Ajuste amount para quando o card deve animar
            >
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl sm:text-2xl font-semibold text-emerald-700 mb-3">
                {feature.title}
              </h3>
              <p className="text-sm sm:text-base text-stone-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
      {/* O CSS embutido <style jsx> foi removido pois os estilos agora são primariamente Tailwind */}
    </motion.section>
  );
}

export default Video;
