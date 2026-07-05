import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Login() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8 bg-background dot-bg">
      <div className="absolute inset-0 glow-amber opacity-10 pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-card text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="h-3 w-3 text-foreground animate-pulse" />
            <span>Secure Authentication</span>
          </motion.div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground">
            ClearShelf Login
          </h2>
          <p className="mt-2 text-[9px] uppercase tracking-widest text-muted-foreground">
            Sign in to access your retail forecasting dashboard
          </p>
        </div>

        {/* Clerk Sign In component styled in pure monochrome style */}
        <div className="flex justify-center bg-card/75 backdrop-blur-xl border border-border rounded-xl p-6 shadow-2xl">
          <SignIn 
            routing="hash"
            appearance={{
              layout: {
                socialButtonsPlacement: 'top',
                socialButtonsVariant: 'iconButton',
              },
              variables: {
                colorPrimary: '#ffffff',
                colorBackground: 'transparent',
                colorText: 'currentColor',
                colorTextSecondary: '#9b9b9b',
                colorInputBackground: 'rgba(255, 255, 255, 0.02)',
                colorInputText: 'currentColor',
                borderRadius: '0.375rem',
              },
              elements: {
                card: 'shadow-none border-none bg-transparent p-0 w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsIconButton: 'border border-border bg-background/50 hover:bg-secondary transition-colors h-10 w-full flex items-center justify-center',
                formButtonPrimary: 'bg-foreground hover:bg-foreground/90 text-background font-bold uppercase tracking-widest text-[10px] shadow-brand transition-all duration-300 py-3 rounded-md',
                footerActionLink: 'text-foreground hover:text-muted-foreground font-black transition-colors',
                dividerLine: 'bg-border/60',
                dividerText: 'text-muted-foreground uppercase text-[9px] tracking-widest font-bold',
                formFieldLabel: 'text-[9px] font-bold text-foreground/80 mb-1 uppercase tracking-widest',
                formFieldInput: 'border border-border bg-background/30 focus:border-foreground focus:ring-1 focus:ring-foreground transition-all rounded-md text-xs py-2 px-3',
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
