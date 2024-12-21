// src/components/AboutPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AboutPage.css';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <nav className="top-bar">
                <div className="nav-content">
                    <button 
                        className="map-button"
                        onClick={(): void => navigate('/')}
                    >
                        Mapa
                    </button>
                    <h1 
                        className="nav-title"
                        onClick={(): void => navigate('/')}
                        role="button"
                        tabIndex={0}
                    >
                        Sportera
                    </h1>
                </div>
            </nav>

            <div className="content-wrapper">
                <div 
                    className="hero-section"
                    onClick={(): void => navigate('/')}
                    role="button"
                    aria-label="Return to map"
                    tabIndex={0}
                >
                    <img 
                        src="/images/og-image.jpg" 
                        alt="Sportera Map Preview" 
                        className="hero-image"
                    />
                </div>

                <div className="content-container">
                    <section className="about-section">
                        <p className="about-text">
                            Sportera je váš průvodce světem venkovního sportování v Brně. 
                            Najděte snadno a rychle sportovní hřiště ve vašem okolí, 
                            prohlédněte si fotografie a získejte všechny potřebné informace.
                        </p>
                    </section>

                    <section className="contact-section">
                        <h2 className="contact-title">Kontaktuj nás</h2>
                        <div className="contact-list">       
                            
                                     <a 
                                href="https://www.instagram.com/sportera.cz"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="contact-item"
                            >
                                <img 
                                    src="/images/instagram_logo.svg" 
                                    alt="Instagram" 
                                    className="contact-icon"
                                />
                                <span className="contact-text">@Sportera.cz</span>
                            </a>

                            <a 
                                href="mailto:virtigo.sportera@gmail.com"
                                className="contact-item"
                            >
                                <img 
                                    src="/images/email-icon.svg" 
                                    alt="Email" 
                                    className="contact-icon"
                                />
                                <span className="contact-text">virtigo.sportera@gmail.com</span>
                            </a>
            
                        </div>
                    </section>

                    <section className="legal-section">
                        <h3 className="legal-title">Právní upozornění: Ochrana databáze Sportera</h3>
                        <div className="legal-content">
                            <p>
                                Databáze sportovních hřišť zveřejněná na stránce sportera.cz je chráněna podle zákona č. 121/2000 Sb.,
                                autorského zákona, a práv sui generis na databáze podle evropské směrnice 96/9/ES. Všechna práva k této databázi náleží
                                Družstvu Virtigo, které provozuje projekt Sportera.
                            </p>
                            <p>Bez předchozího písemného souhlasu Družstva Virtigo je zakázáno:</p>
                            <ul>
                                <li>Kopírování, šíření, úprava nebo jiné využívání dat obsažených v databázi.</li>
                                <li>Automatizované stahování dat (tzv. scraping) nebo jejich přenos na jiné platformy.</li>
                                <li>Použití databáze pro komerční účely nebo jakýkoliv jiný účel mimo rámec osobního nekomerčního využití.</li>
                            </ul>
                            <p>
                                Výjimka: Používání databáze je povoleno pouze na této webové stránce (sportera.cz) v souladu s jejím zamýšleným účelem.
                            </p>
                            <p>
                                Jakékoliv porušení práv k databázi bude považováno za neoprávněné a může vést k právním krokům.
                            </p>
                            <p>
                                Pokud máte zájem o spolupráci nebo jiný způsob využití databáze, kontaktujte nás na{' '}
                                <a href="mailto:virtigo.sportera@gmail.com" className="legal-link">virtigo.sportera@gmail.com</a>
                            </p>
                            <p>Databázi spravuje Družstvo Virtigo, Brno, Česká republika.</p>
                        </div>
                    </section>
                </div>
                
                {/* Footer */}
                <footer className="footer">
                    <div className="footer-wrapper">
                        <a 
                            href="https://virtigo.teleporthq.app/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="footer-link"
                        >
                            <div className="footer-content">
                                <span className="footer-text">Powered by</span>
                                <img 
                                    src="/images/virtigo.svg" 
                                    alt="Virtigo" 
                                    className="footer-logo"
                                />
                            </div>
                        </a>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default AboutPage;