import { SignIn } from '@clerk/clerk-react';
import { motion } from 'framer-motion';

export default function Login() {
  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient glowing blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      
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
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-sm font-medium mb-4"
          >
            <span>🔐 Secure Authentication</span>
          </motion.div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome to ClearShelf
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to access your retail forecasting & stock services
          </p>
        </div>

        {/* Clerk Sign In component styled to match */}
        <div className="flex justify-center bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
          <SignIn 
            routing="hash"
            appearance={{
              layout: {
                socialButtonsPlacement: 'top',
                socialButtonsVariant: 'iconButton',
              },
              variables: {
                colorPrimary: '#6366f1',
                colorBackground: 'transparent',
                colorText: 'currentColor',
                colorTextSecondary: '#94a3b8',
                colorInputBackground: 'rgba(255, 255, 255, 0.03)',
                colorInputText: 'currentColor',
                borderRadius: '0.75rem',
              },
              elements: {
                card: 'shadow-none border-none bg-transparent p-0 w-full',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsIconButton: 'border border-border/50 bg-background/50 hover:bg-background/80 transition-colors',
                formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 py-2.5',
                footerActionLink: 'text-indigo-400 hover:text-indigo-300',
                dividerLine: 'bg-border/30',
                dividerText: 'text-muted-foreground uppercase text-xs tracking-wider',
                formFieldLabel: 'text-sm font-medium text-foreground/80 mb-1',
                formFieldInput: 'border border-border/50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all rounded-lg',
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
