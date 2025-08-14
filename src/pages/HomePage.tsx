import React from 'react'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header>
        <h1>Dream Shops</h1>
        <nav>
          <Link to="/products">Produtos</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      
      <main>
        <section className="hero">
          <h2>Bem-vindo à Dream Shops</h2>
          <p>Encontre os melhores produtos com os melhores preços!</p>
          <Link to="/products" className="cta-button">
            Ver Produtos
          </Link>
        </section>
        
        <section className="features">
          <div className="feature">
            <h3>Qualidade Garantida</h3>
            <p>Produtos selecionados com máxima qualidade</p>
          </div>
          <div className="feature">
            <h3>Entrega Rápida</h3>
            <p>Receba seus produtos em casa rapidamente</p>
          </div>
          <div className="feature">
            <h3>Melhor Preço</h3>
            <p>Preços competitivos e promoções exclusivas</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default HomePage