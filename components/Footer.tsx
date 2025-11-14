import React from 'react';
import { Github, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer
      className="
        mt-16
        border-t border-white/10
        bg-gradient-to-b from-transparent to-[#0D1117]
        text-text-secondary
      "
    >
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo e descrição */}
        <div className="text-center md:text-left space-y-2 max-w-sm">
          <h2 className="text-xl font-semibold text-white tracking-tight">
            <span className="text-brand-primary font-bold">AI</span> Image Stylist
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Geração inteligente de fotos profissionais com IA.  
            Crie, edite e baixe headshots com qualidade premium e realismo natural.
          </p>
          <p className="text-xs text-text-secondary/70 mt-2">
            CNPJ: <strong>60.806.192/0001-50</strong>
          </p>
        </div>

        {/* Links rápidos */}
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <Link to="/terms" className="hover:text-white transition-colors">
            Termos de Uso
          </Link>
          <Link to="/privacy" className="hover:text-white transition-colors">
            Privacidade
          </Link>
          <Link to="/contact" className="hover:text-white transition-colors">
            Contato
          </Link>
          <Link to="/guide" className="hover:text-white transition-colors">
            Guia de IA
          </Link>
        </nav>

        {/* Social links */}
        <div className="flex gap-4">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-base-300 hover:bg-brand-primary/30 transition-all"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5 text-white" />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-base-300 hover:bg-brand-primary/30 transition-all"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5 text-white" />
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-base-300 hover:bg-brand-primary/30 transition-all"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5 text-white" />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-4 text-center text-xs text-text-secondary">
        © {new Date().getFullYear()} <strong>AI Image Stylist</strong> — Todos os direitos reservados.  
        Desenvolvido por <span className="text-white font-medium">FinHouse</span>.
      </div>
    </footer>
  );
};

export default Footer;
