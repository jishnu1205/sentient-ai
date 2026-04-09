import { motion } from "motion/react";
import { Chrome, Github, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FormEvent } from "react";

export function LoginCard() {
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    navigate("/chat");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[420px] bg-surface-high p-6 md:p-10 rounded-2xl border border-outline/30 shadow-2xl backdrop-blur-sm"
    >
      {/* Logo Icon */}
      <div className="flex justify-center mb-6 md:mb-8">
        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border border-primary/10 bg-primary/5">
          <Sparkles className="text-primary w-5 h-5 md:w-6 md:h-6 stroke-[1.5px]" />
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8 md:mb-10">
        <h1 className="text-xl md:text-2xl font-light tracking-tight text-primary mb-2">Welcome back</h1>
        <p className="text-[9px] md:text-[10px] text-secondary font-bold tracking-[0.2em] uppercase">
          The quiet workspace awaits
        </p>
      </div>

      {/* Form */}
      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-[9px] md:text-[10px] text-secondary font-bold tracking-[0.2em] uppercase ml-1">
            Email
          </label>
          <input 
            type="email" 
            placeholder="name@example.com"
            className="w-full bg-transparent border border-outline/50 rounded-lg py-2.5 md:py-3 px-4 text-sm text-primary placeholder:text-secondary/30 focus:outline-none focus:border-primary/40 transition-all duration-300"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[9px] md:text-[10px] text-secondary font-bold tracking-[0.2em] uppercase ml-1">
            Password
          </label>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full bg-transparent border border-outline/50 rounded-lg py-2.5 md:py-3 px-4 text-sm text-primary placeholder:text-secondary/30 focus:outline-none focus:border-primary/40 transition-all duration-300"
          />
        </div>

        <button 
          className="w-full bg-primary text-surface py-3 md:py-3.5 rounded-lg text-sm font-semibold tracking-tight hover:bg-primary-dim transition-all duration-300 active:scale-[0.98]"
        >
          Continue
        </button>
      </form>

      {/* Divider */}
      <div className="relative my-8 md:my-10">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-outline/30"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface-high px-4 text-[9px] md:text-[10px] text-secondary font-bold tracking-[0.2em] uppercase">
            OR
          </span>
        </div>
      </div>

      {/* Social Logins */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        <button className="flex items-center justify-center gap-2 md:gap-3 py-2.5 md:py-3 px-4 rounded-lg border border-outline/50 hover:bg-primary/5 transition-all duration-300 group">
          <Chrome className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary group-hover:text-primary transition-colors" />
          <span className="text-[9px] md:text-[10px] text-secondary font-bold tracking-[0.2em] uppercase group-hover:text-primary transition-colors">
            Google
          </span>
        </button>
        <button className="flex items-center justify-center gap-2 md:gap-3 py-2.5 md:py-3 px-4 rounded-lg border border-outline/50 hover:bg-primary/5 transition-all duration-300 group">
          <Github className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary group-hover:text-primary transition-colors" />
          <span className="text-[9px] md:text-[10px] text-secondary font-bold tracking-[0.2em] uppercase group-hover:text-primary transition-colors">
            GitHub
          </span>
        </button>
      </div>

      {/* Footer Link */}
      <div className="mt-8 md:mt-10 text-center">
        <p className="text-[9px] md:text-[10px] text-secondary font-bold tracking-[0.2em] uppercase">
          New to Sentient? <a href="#" className="text-primary hover:underline underline-offset-4 transition-all">Create Account</a>
        </p>
      </div>
    </motion.div>
  );
}
