import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { translations } from './translations'; 
import './LandingPage.css';

const LandingPage = () => {
    const [lang, setLang] = useState('en'); 
    const t = translations[lang]; 
    const [isDark, setIsDark] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) entry.target.classList.add('reveal-active');
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`site-container ${isDark ? 'dark-mode' : ''}`}>
            {/* --- Navbar --- */}
            <nav className={`navbar ${scrolled ? 'nav-glass' : ''}`}>
                <div className="nav-content">
                    <div className="logo">
                        <div className="logo-dot"></div>
                        <span>AidNexus</span>
                    </div>
                    <div className="nav-links">
                        <a href="#schemes">{lang === 'en' ? 'Programs' : 'প্রোগ্রামসমূহ'}</a>
                        <a href="#about">{lang === 'en' ? 'Mission' : 'লক্ষ্য'}</a>
                        
                        {/* Language Toggle */}
                        <button className="lang-toggle-btn" onClick={() => setLang(lang === 'en' ? 'bn' : 'en')}>
                            {lang === 'en' ? 'বাংলা' : 'English'}
                        </button>

                        <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
                            {isDark ? '☀️' : '🌙'}
                        </button>
                        <Link to="/login" className="btn-portal">{t.login}</Link>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <header className="hero-wrap">
                <div className="hero-inner reveal">
                    <h1 className="hero-h1">
                        {lang === 'en' ? 'Empowering Lives with' : 'জীবনকে ক্ষমতায়ন করি'} <br/>
                        <span>{lang === 'en' ? 'Unbiased Distribution.' : 'নিরপেক্ষ বণ্টনের মাধ্যমে।'}</span>
                    </h1>
                    <p className="hero-p">{t.subtitle}</p>
                    <div className="hero-cta">
                        <Link to="/register" className="btn-main">{t.register}</Link>
                        <Link to="/login" className="btn-outline">{t.status}</Link>
                    </div>
                </div>
            </header>

            {/* --- Stats --- */}
            <section className="stats-row reveal">
                <div className="stat-item">
                    <h4>5K+</h4>
                    <p>{lang === 'en' ? 'Verified Citizens' : 'ভেরিফাইড নাগরিক'}</p>
                </div>
                <div className="divider"></div>
                <div className="stat-item">
                    <h4>1.5M BDT</h4>
                    <p>{lang === 'en' ? 'Financial Impact' : 'আর্থিক প্রভাব'}</p>
                </div>
            </section>

            {/* --- Schemes Grid --- */}
            <section id="schemes" className="schemes-grid reveal">
                <div className="card-m">
                    <div className="card-top">🍱</div>
                    <h3>{lang === 'en' ? 'Food Subsidy' : 'খাদ্য ভর্তুকি'}</h3>
                    <p>{lang === 'en' ? 'Ensuring essential nutrition for low-income households.' : 'নিম্ন আয়ের পরিবারের জন্য প্রয়োজনীয় পুষ্টি নিশ্চিত করা।'}</p>
                    <Link to="/login" state={{ selectedScheme: 'food' }} className="card-btn">{t.apply} ➔</Link>
                </div>

                <div className="card-m">
                    <div className="card-top">💊</div>
                    <h3>{lang === 'en' ? 'Medical Care' : 'চিকিৎসা সেবা'}</h3>
                    <p>{lang === 'en' ? 'Digital vouchers for medicines and healthcare.' : 'ওষুধ এবং স্বাস্থ্যসেবার জন্য ডিজিটাল ভাউচার।'}</p>
                    <Link to="/login" state={{ selectedScheme: 'medical' }} className="card-btn">{t.apply} ➔</Link>
                </div>

                <div className="card-m">
                    <div className="card-top">💰</div>
                    <h3>{lang === 'en' ? 'Cash Grant' : 'নগদ অনুদান'}</h3>
                    <p>{lang === 'en' ? 'Direct financial assistance delivered to your account.' : 'সরাসরি আপনার অ্যাকাউন্টে আর্থিক সহায়তা।'}</p>
                    <Link to="/login" state={{ selectedScheme: 'cash' }} className="card-btn">{t.apply} ➔</Link>
                </div>
            </section>

            {/* --- Mission Section --- */}
            <section id="about" className="mission-wrap reveal">
                <div className="mission-box">
                    <div className="mission-img">
                        <img src="https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80" alt="Tech" />
                    </div>
                    <div className="mission-txt">
                        <span className="badge">Integrity</span>
                        <h2>{lang === 'en' ? 'Transparency at Scale' : 'স্বচ্ছ বণ্টন ব্যবস্থা'}</h2>
                        <p>{lang === 'en' ? 'Using algorithms to eliminate human bias.' : 'মানুষের পক্ষপাতিত্ব দূর করতে উন্নত অ্যালগরিদম।'}</p>
                        <ul className="list-m">
                            <li>✓ {lang === 'en' ? 'AI-Based Eligibility Scoring' : 'এআই-ভিত্তিক যোগ্যতা যাচাই'}</li>
                            <li>✓ {lang === 'en' ? 'Secure NID Verification' : 'নিরাপদ এনআইডি ভেরিফিকেশন'}</li>
                        </ul>
                    </div>
                </div>
            </section>

            <footer className="footer-m">
                <p>&copy; 2026 Official AidNexus Portal. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default LandingPage;