import { NavLink } from 'react-router-dom';
import { Activity, GitBranch, Link2 } from 'lucide-react';

const footerLinks = [
  { title: 'Product',   links: [{ name: 'Features' }, { name: 'Pricing' }, { name: 'Security' }, { name: 'Roadmap' }] },
  { title: 'Resources', links: [{ name: 'Docs' }, { name: 'API Ref' }, { name: 'Guides' }, { name: 'Support' }] },
  { title: 'Company',   links: [{ name: 'About' }, { name: 'Blog' }, { name: 'Careers' }, { name: 'Contact' }] },
  { title: 'Legal',     links: [{ name: 'Privacy' }, { name: 'Terms' }, { name: 'Cookies' }] },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="page-shell py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <NavLink to="/" className="flex items-center gap-2 mb-4 w-fit">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand text-background">
                <Activity className="h-3.5 w-3.5" />
              </div>
              <span className="font-bold text-foreground">Clear<span className="text-brand">Shelf</span></span>
            </NavLink>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered inventory forecasting for modern retailers across India.
            </p>
            <div className="mt-4 flex gap-2">
              {[{ icon: <GitBranch className="h-4 w-4" />, label: 'GitHub' }, { icon: <Link2 className="h-4 w-4" />, label: 'LinkedIn' }].map(s => (
                <a key={s.label} href="#" aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-brand/50 hover:text-brand"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map(section => (
            <div key={section.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(link => (
                  <li key={link.name}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">{link.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ClearShelf Intelligence. All rights reserved.</p>
          <p>Powering smarter retail with AI.</p>
        </div>
      </div>
    </footer>
  );
}