// src/pages/ServicesPage.jsx (ou ServicesPageOption3.jsx) - COM ROLAGEM PARA O TOPO
import React, { useEffect } from "react"; // Importe useEffect
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const services = [
  {
    id: "1",
    name: "Limpeza de Pele Profunda",
    professional: "Dra. Ana Paula",
    description:
      "Remove impurezas, células mortas e cravos, promovendo a renovação celular e uma pele mais luminosa e saudável.",
    details: [
      "Higienização completa",
      "Esfoliação e vapor",
      "Extração manual de cravos e espinhas",
      "Máscara calmante e hidratante",
      "Proteção solar",
    ],
  },
  {
    id: "2",
    name: "Massagem Relaxante",
    professional: "Sr. Carlos Eduardo",
    description:
      "Técnica que utiliza movimentos suaves e firmes para aliviar tensões musculares, reduzir o estresse e promover o relaxamento profundo.",
    details: [
      "Aplicação de óleos essenciais",
      "Foco em pontos de tensão",
      "Ambiente aromatizado e climatizado",
      "Duração: 60 minutos",
    ],
  },
  {
    id: "3",
    name: "Drenagem Linfática",
    professional: "Dra. Juliana Mendes",
    description:
      "Massagem com toques leves e rítmicos que estimula o sistema linfático, auxiliando na eliminação de toxinas e redução de inchaços.",
    details: [
      "Redução de retenção de líquidos",
      "Combate à celulite",
      "Melhora da circulação sanguínea",
      "Ideal pós-operatório",
    ],
  },
  {
    id: "4",
    name: "Peeling Químico",
    professional: "Dra. Roberta Dias",
    description:
      "Tratamento que utiliza ácidos para remover camadas danificadas da pele, melhorando a textura, manchas e cicatrizes de acne.",
    details: [
      "Clareamento de manchas",
      "Redução de rugas finas",
      "Estímulo à produção de colágeno",
      "Recomendado em sessões",
    ],
  },
  {
    id: "5",
    name: "Microagulhamento",
    professional: "Sr. Felipe Costa",
    description:
      "Técnica que cria microperfurações na pele com agulhas finas, estimulando a produção de colágeno e a absorção de ativos.",
    details: [
      "Tratamento de cicatrizes de acne",
      "Redução de poros dilatados",
      "Rejuvenescimento da pele",
      "Melhora da elasticidade",
    ],
  },
];

function ServicesPageOption3() {
  // === NOVO HOOK useEffect PARA ROLAR PARA O TOPO ===
  useEffect(() => {
    window.scrollTo(0, 0); // Rola a janela para a posição (x: 0, y: 0)
  }, []); // O array vazio [] garante que ele só execute uma vez, na montagem do componente.

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const buttonHoverVariants = {
    hover: {
      backgroundColor: "#047857", // emerald-800
      color: "#ffffff",
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    initial: {
      backgroundColor: "#10B981", // emerald-500
      color: "#ffffff",
    },
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center mb-8">
        <Link
          to="/"
          className="text-emerald-600 hover:text-emerald-800 transition duration-300 flex items-center"
        >
          <ArrowLeftIcon className="h-6 w-6 inline-block mr-2" />
          <span className="align-middle">Voltar para o Início</span>
        </Link>
      </div>

      <h1 className="text-4xl md:text-5xl font-extrabold text-emerald-800 mb-10 text-center">
        Nossos Serviços
      </h1>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service) => (
          <motion.div
            key={service.id}
            className="bg-white rounded-xl border border-gray-200 shadow-md hover:border-emerald-500 hover:shadow-xl transition-all duration-300 flex flex-col p-6"
            variants={itemVariants}
            whileHover={{
              y: -5,
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 className="text-2xl font-bold text-emerald-800 mb-2 text-center">
              {service.name}
            </h2>
            <p className="text-gray-500 text-md mb-4 text-center italic">
              Profissional: {service.professional}
            </p>
            <p className="text-gray-700 mb-4 text-center flex-grow">
              {service.description}
            </p>
            <div className="mt-auto">
              <h3 className="text-lg font-semibold text-emerald-700 mb-2">
                Benefícios:
              </h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-1 text-sm">
                {service.details.map((detail, detailIndex) => (
                  <li key={detailIndex}>{detail}</li>
                ))}
              </ul>
              <motion.button
                className="bg-emerald-500 text-white font-semibold py-3 px-6 rounded-full w-full
                          focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75"
                variants={buttonHoverVariants}
                initial="initial"
                whileHover="hover"
              >
                Agendar Serviço
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default ServicesPageOption3;
