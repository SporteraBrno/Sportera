import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/AboutPage.css';

const AboutPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">
            <nav className="top-bar">
                <div className="nav-content">
                    <img 
                        src="/images/Name.png"
                        alt="Sportera"
                        className="nav-title"
                        onClick={(): void => navigate('/')}
                        role="button"
                        tabIndex={0}
                    />
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
                        src="/images/aboutus.jpg" 
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
                                Databáze sportovních hřišť včetně všech jejích součástí (zejména lokace sportovišť, jejich fotografie, 
                                popisy, hodnocení, kategorizace sportů a další související data) zveřejněná na stránce sportera.cz 
                                je chráněna podle zákona č. 121/2000 Sb., autorského zákona, a práv sui generis k databázím podle 
                                evropské směrnice 96/9/ES. Všechna práva k této databázi náleží Družstvu Virtigo, které provozuje 
                                projekt Sportera.
                            </p>

                            <h4>Odpovědnost</h4>
                            <p>Družstvo Virtigo nenese odpovědnost za:</p>
                            <ul>
                                <li>stav sportovišť,</li>
                                <li>případné nehody, úrazy nebo škody vzniklé při jejich využívání.</li>
                            </ul>
                            <p>Informace o sportovištích mají pouze informativní charakter a mohou se v čase měnit.</p>

                            <h4>Právní ochrana databáze</h4>
                            <p>
                                Databáze je výsledkem podstatného vkladu do pořízení, ověření a předvedení jejího obsahu ve smyslu 
                                § 88a autorského zákona, a tato práva jsou chráněna podle českého práva i práva Evropské unie a jsou 
                                vymahatelná na území České republiky i dalších členských států EU.
                            </p>

                            <h4>Zakázané činnosti</h4>
                            <p>Bez předchozího písemného souhlasu Družstva Virtigo je zakázáno:</p>
                            <ol>
                                <li>Kopírování, šíření, úprava nebo jiné využívání dat obsažených v databázi.</li>
                                <li>Automatizované stahování dat (tzv. scraping) nebo jejich přenos na jiné platformy.</li>
                                <li>Použití databáze pro komerční účely nebo jakýkoliv jiný účel mimo rámec osobního nekomerčního využití.</li>
                            </ol>

                            <h4>Výjimky a povolené využití</h4>
                            <p>
                                Používání databáze je povoleno výhradně na této webové stránce (sportera.cz) v rámci jejího 
                                uživatelského rozhraní a v souladu s jejím zamýšleným účelem.
                            </p>

                            <h4>Ochrana fotografií</h4>
                            <p>
                                Veškeré fotografie sportovišť zveřejněné na sportera.cz jsou chráněny autorským právem. 
                                Jakékoliv jejich použití bez předchozího souhlasu je zakázáno.
                            </p>

                            <h4>Podmínky používání</h4>
                            <p>
                                Použitím této webové stránky uživatel bere na vědomí a souhlasí s těmito podmínkami ochrany 
                                databáze. Jakékoliv jednání v rozporu s těmito podmínkami může vést k občanskoprávním i 
                                trestněprávním důsledkům.
                            </p>

                            <h4>Kontaktní informace</h4>
                            <p>
                                Pokud máte zájem o spolupráci nebo jiný způsob využití databáze, kontaktujte nás na:{' '}
                                <a href="mailto:virtigo.sportera@gmail.com" className="legal-link">virtigo.sportera@gmail.com</a>
                            </p>

                            <h4>Správa databáze</h4>
                            <p>
                                Databázi spravuje Družstvo Virtigo, IČO: 22210458, se sídlem Kolejní 2906/4, Královo Pole, 612 00 Brno.
                            </p>
                        </div>
                    </section>
                </div>

<button 
    className="floating-map-button"
    onClick={(): void => navigate('/')}
    aria-label="Go to map"
>
    <img 
        src="/images/map-icon.svg"
        alt="Map"
    />
</button>
                
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