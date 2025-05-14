// App.jsx
import React from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Products from "./components/Products";
import FeaturedProduct from "./components/FeaturedProduct";
import Footer from "./components/Footer";

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Products />
      <FeaturedProduct />
      <Footer />
    </>
  );
}

function App() {
  return <Home />;
}

export default App;
