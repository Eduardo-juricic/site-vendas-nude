function Hero() {
  return (
    <section className="bg-gradient-to-br from-emerald-300 to-emerald-700 py-24 md:py-48 text-white text-center">
      <div className="container mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Realce Sua Beleza Autêntica
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Descubra a nossa seleção exclusiva de produtos para uma rotina de
          cuidados que celebra a sua individualidade.
        </p>
        <button className="bg-white text-emerald-600 hover:bg-emerald-300 font-bold py-3 px-6 rounded-full text-lg shadow-md">
          Conheça Nossos Favoritos
        </button>
      </div>
    </section>
  );
}

export default Hero;
