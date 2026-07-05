import { NavLink } from 'react-router-dom';
import { GitBranch, } from 'lucide-react';
import LinkedinIcon from './ui/LinkedinIcon';


const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#' },
      { name: 'Security', href: '#' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Docs & Guide', path: '/documentation' },
      { name: 'API Reference', href: '#' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#' },
      { name: 'Contact', href: '#' }
    ]
  }
];

export default function Footer() {
  const handleScrollToSection = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.getElementById(href.substring(1));
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-border bg-background transition-all duration-300">
      <div className="max-w-7xl px-4 md:px-8 mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">

          {/* Logo & Description */}
          <div className="col-span-2 space-y-4">
            <NavLink to="/" className="flex items-center gap-2 group">
              <svg width="18" height="15" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground transition-transform duration-300 group-hover:scale-105">
                <path d="M4.92285 14.8848H0V9.96191H4.92285V14.8848ZM19.6924 14.8848H9.84668V9.96191H4.92383V5.03809H9.84668V0.115234H19.6924V14.8848ZM9.84668 9.96191H14.7695V5.03906H9.84668V9.96191ZM4.92285 5.03809H0V0.115234H4.92285V5.03809Z" fill="currentColor"></path>
              </svg>
              <span className="font-semibold text-foreground tracking-tight text-sm">Clear<span className="text-foreground font-black">Shelf</span></span>
            </NavLink>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Autonomous retail optimization and predictive demand intelligence. Seamless shelf management using cooperative AI algorithms.
            </p>
            <div className="flex gap-2">
              <a href="#" aria-label="GitHub"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <GitBranch className="h-4 w-4" />
              </a>
              <a href="#" aria-label="LinkedIn"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <LinkedinIcon />

              </a>
            </div>
          </div>

          {/* Links Grid */}
          {footerLinks.map(section => (
            <div key={section.title} className="space-y-3">
              <h3 className="text-[9px] font-bold uppercase tracking-widest text-foreground">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map(link => (
                  <li key={link.name}>
                    {link.path ? (
                      <NavLink to={link.path} className="text-xs text-muted-foreground transition-colors hover:text-foreground">{link.name}</NavLink>
                    ) : link.href && link.href.startsWith('#') ? (
                      <button 
                        onClick={() => handleScrollToSection(link.href!)} 
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground text-left"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <a href={link.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">{link.name}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom copyright info */}
        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[9px] text-muted-foreground tracking-wider uppercase">
          <p>© {new Date().getFullYear()} ClearShelf Intelligence. All rights reserved.</p>
          <p className="font-mono text-muted-foreground/60">Designed for modern retail scale.</p>
        </div>
      </div>
    </footer>
  );
}