import { motion } from "motion/react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Gradient/Grain Effect */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #1c1c1c 0%, #111111 100%)`,
        }}
      />
      
      {/* Header */}
      <header className="relative z-10 w-full px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base md:text-lg font-normal tracking-[0.3em] text-primary uppercase"
        >
          Sentient
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <a 
            href="#" 
            className="text-secondary text-[10px] md:text-xs font-medium tracking-widest uppercase hover:text-primary transition-colors duration-300"
          >
            About
          </a>
        </motion.div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-8 md:py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-4 md:px-8 py-6 md:py-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
        <div className="text-[9px] md:text-[10px] font-semibold tracking-[0.15em] uppercase text-secondary text-center md:text-left">
          © 2024 Sentient AI. Built for focus.
        </div>
        <div className="flex gap-6 md:gap-8">
          {['Privacy', 'Terms', 'Security'].map((item) => (
            <a 
              key={item}
              href="#" 
              className="text-[10px] font-semibold tracking-[0.15em] uppercase text-secondary hover:text-primary transition-colors duration-300"
            >
              {item}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
