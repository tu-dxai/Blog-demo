/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Gift, Calendar, Clock, Sparkles, Music, Music2, X, Star, ChevronDown } from 'lucide-react';

// Simple Confetti Implementation
const useConfetti = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fire = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const particles: any[] = [];
    const particleCount = 150;
    const colors = ['#ff69b4', '#da70d6', '#ee82ee', '#ffb6c1', '#ffffff', '#ffd700'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 15,
        speedY: (Math.random() - 0.5) * 15 - 5,
        gravity: 0.2,
        opacity: 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let stillAnimating = false;

      particles.forEach((p) => {
        if (p.opacity > 0) {
          p.x += p.speedX;
          p.y += p.speedY;
          p.speedY += p.gravity;
          p.opacity -= 0.01;
          
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          stillAnimating = true;
        }
      });

      if (stillAnimating) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return { canvasRef, fire };
};

const AnimatedNumber = ({ value }: { value: number | string }) => (
  <AnimatePresence mode="popLayout">
    <motion.span
      key={value}
      initial={{ y: 10, opacity: 0, scale: 0.8 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -10, opacity: 0, scale: 0.8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block"
    >
      {value.toString().padStart(2, '0')}
    </motion.span>
  </AnimatePresence>
);

const TypingText = ({ text }: { text: string }) => {
  const words = text.split("");
  
  return (
    <motion.p className="text-pink-100 text-xl md:text-2xl leading-relaxed mb-12 font-medium italic opacity-90 drop-shadow-sm">
      {words.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.1,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.p>
  );
};

export default function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { canvasRef, fire } = useConfetti();

  // Set your target date here (YYYY-MM-DD)
  const targetDate = "2026-04-04T00:00:00"; 

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Autoplay blocked", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSurprise = () => {
    setShowModal(true);
    fire();
  };

  return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center p-4 overflow-hidden relative font-sans selection:bg-pink-500/30">
      {/* Background Music */}
      <audio 
        ref={audioRef} 
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" 
        loop 
      />

      {/* Starry Night Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050510] via-[#0a0a20] to-[#1a0b2e] z-0" />
      
      {/* Twinkling Stars */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: Math.random() }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            className="absolute bg-white rounded-full"
            style={{
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              boxShadow: "0 0 5px rgba(255, 255, 255, 0.8)",
            }}
          />
        ))}
      </div>

      {/* Shooting Stars */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: "-10%", y: "20%", opacity: 0 }}
            animate={{ 
              x: "110%", 
              y: "80%", 
              opacity: [0, 1, 0] 
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 15 + 10,
              delay: i * 5,
            }}
            className="absolute w-32 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent rotate-[35deg]"
          />
        ))}
      </div>

      {/* Music Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={!isPlaying ? { scale: [1, 1.1, 1], boxShadow: ["0 0 20px rgba(236,72,153,0.3)", "0 0 40px rgba(236,72,153,0.6)", "0 0 20px rgba(236,72,153,0.3)"] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        onClick={toggleMusic}
        className={`fixed top-6 right-6 z-50 p-4 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.3)] backdrop-blur-md transition-all border border-white/10 ${
          isPlaying ? 'bg-pink-500 text-white' : 'bg-white/10 text-pink-300'
        }`}
      >
        {isPlaying ? <Music size={24} className="animate-spin-slow" /> : <Music2 size={24} />}
        {!isPlaying && (
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: -10 }}
            className="absolute right-full mr-4 bg-pink-500 text-white text-xs px-3 py-1 rounded-lg whitespace-nowrap font-bold"
          >
            Nhấn để bật nhạc 🎵
          </motion.span>
        )}
      </motion.button>

      {/* Magical Floating Particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "110vh", x: Math.random() * 100 + "vw", opacity: 0 }}
            animate={{ 
              y: "-10vh", 
              opacity: [0, 0.7, 0],
              rotate: 360,
              scale: [0.3, 1, 0.3]
            }}
            transition={{ 
              duration: Math.random() * 20 + 15, 
              repeat: Infinity, 
              ease: "linear",
              delay: Math.random() * 10
            }}
            className="absolute"
          >
            {i % 2 === 0 ? (
              <Heart size={Math.random() * 20 + 10} className="text-pink-400/20" fill="currentColor" />
            ) : (
              <Sparkles size={Math.random() * 15 + 5} className="text-yellow-200/30" />
            )}
          </motion.div>
        ))}
      </div>

      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none z-50"
        width={window.innerWidth}
        height={window.innerHeight}
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="max-w-2xl w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] shadow-[0_0_80px_rgba(0,0,0,0.5)] p-8 md:p-14 text-center relative z-10"
      >
        {/* Decorative Elements */}
        <motion.div 
          animate={{ rotate: [0, 15, -15, 0], y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute -top-10 -left-10 text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.6)]"
        >
          <Gift size={72} />
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute -bottom-10 -right-10 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.6)]"
        >
          <Sparkles size={72} />
        </motion.div>

        <motion.h1 
          className="flex flex-col items-center gap-2 mb-10"
        >
          <span className="font-dancing text-4xl md:text-6xl text-pink-300 drop-shadow-[0_0_15px_rgba(244,114,182,0.4)]">
            Happy birthday
          </span>
          <span className="font-great-vibes text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-purple-300 drop-shadow-[0_0_25px_rgba(255,255,255,0.3)]">
            Thùy My
          </span>
        </motion.h1>

        {/* Avatar Section (Moved here) */}
        <div className="relative mb-12 flex justify-center">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, type: "spring" }}
            className="relative"
          >
            {/* Floating Hearts around Avatar */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ 
                  y: [0, -40, 0],
                  x: [0, (i % 2 === 0 ? 20 : -20), 0],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3 + i, 
                  repeat: Infinity, 
                  delay: i * 0.5 
                }}
                className="absolute text-pink-400/60"
                style={{
                  top: "20%",
                  left: "40%",
                  transform: `rotate(${i * 60}deg) translate(80px)`
                }}
              >
                <Heart size={20} fill="currentColor" />
              </motion.div>
            ))}

            {/* Sparkle Border Effect */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border-2 border-dashed border-pink-300/30"
            />
            
            <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full p-1.5 bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/20">
                <img 
                  src="/assets/avatar.jpeg" 
                  alt="Võ Thị Thùy My" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback if the local file is not yet uploaded or missing
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/thuy-my/400/400";
                  }}
                />
              </div>
              
              {/* Sparkle icons around border */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 text-yellow-300"
              >
                <Sparkles size={24} />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-2 -left-2 text-pink-300"
              >
                <Sparkles size={20} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-3 md:gap-6 mb-14">
          {[
            { label: 'Ngày', value: timeLeft.days, icon: <Calendar size={18} /> },
            { label: 'Giờ', value: timeLeft.hours, icon: <Clock size={18} /> },
            { label: 'Phút', value: timeLeft.minutes, icon: <Clock size={18} /> },
            { label: 'Giây', value: timeLeft.seconds, icon: <Clock size={18} /> }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="w-full aspect-square flex items-center justify-center bg-white/10 rounded-3xl shadow-2xl border border-white/10 mb-3 overflow-hidden backdrop-blur-md">
                <span className="text-3xl md:text-5xl font-black text-pink-300 tracking-tighter drop-shadow-md">
                  <AnimatedNumber value={item.value} />
                </span>
              </div>
              <span className="text-xs md:text-sm font-bold text-pink-200/60 uppercase tracking-[0.3em] flex items-center gap-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 35px rgba(236, 72, 153, 0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSurprise}
          className="group relative px-12 py-6 bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 text-white rounded-full font-dancing text-3xl shadow-[0_0_30px_rgba(236,72,153,0.4)] overflow-hidden transition-all border border-white/20"
        >
          <span className="relative z-10 flex items-center gap-3">
            Mở món quà bí mật <Sparkles size={24} className="group-hover:rotate-[360deg] transition-transform duration-1000" />
          </span>
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
        </motion.button>

        <div className="mt-12 text-pink-200/40 text-sm flex items-center justify-center gap-4 font-bold tracking-[0.2em]">
          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
          </motion.div>
          MAGIC IS HAPPENING
          <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}>
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="mt-8 text-pink-300/70 font-dancing text-3xl flex items-center justify-center gap-2 drop-shadow-sm"
        >
          — From Anh 2 <span className="animate-bounce">💌</span>
        </motion.div>
      </motion.div>

      {/* Banking Information Section */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="max-w-md w-full mt-20 mb-20 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-[0_0_50px_rgba(0,0,0,0.3)] p-8 md:p-10 text-center relative z-10"
      >
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 mb-4 drop-shadow-sm">
          Gửi lời chúc 💌
        </h2>
        <p className="text-pink-100/60 text-sm md:text-base mb-8 font-medium">
          Gửi lời chúc hoặc một chút yêu thương đến Thùy My 🎁
        </p>

        <div className="space-y-3 text-pink-100/80 font-medium">
          <div className="bg-white/5 py-4 px-6 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/50 mb-1">Ngân hàng</p>
            <p className="text-lg">Techcombank</p>
          </div>
          <div className="bg-white/5 py-4 px-6 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/50 mb-1">Số tài khoản</p>
            <p className="text-xl font-mono tracking-wider text-pink-200">5204 0779 79</p>
          </div>
          <div className="bg-white/5 py-4 px-6 rounded-2xl border border-white/5 transition-colors hover:bg-white/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300/50 mb-1">Chủ tài khoản</p>
            <p className="text-lg uppercase">Võ Thị Thùy My</p>
          </div>
        </div>

        <div className="mt-8 text-pink-300/40 text-[10px] uppercase tracking-[0.3em] font-bold">
          Thank you for your love
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 text-white/30 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Scroll</span>
        <ChevronDown size={20} />
      </motion.div>

      {/* Surprise Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10, y: 100 }}
              animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, rotate: 10, y: 100 }}
              className="relative w-full max-w-lg bg-gradient-to-br from-[#1a0b2e] to-[#0a0a20] border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(236,72,153,0.3)] p-10 md:p-14 text-center overflow-hidden"
            >
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-white/30 hover:text-pink-400 transition-colors"
              >
                <X size={32} />
              </button>

              <div className="mb-10 flex justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                    filter: ["drop-shadow(0 0 10px rgba(236,72,153,0.5))", "drop-shadow(0 0 30px rgba(236,72,153,0.8))", "drop-shadow(0 0 10px rgba(236,72,153,0.5))"]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="p-8 bg-pink-500/10 rounded-full text-pink-400 border border-pink-500/20"
                >
                  <Heart size={80} fill="currentColor" />
                </motion.div>
              </div>

              <h2 className="font-great-vibes text-5xl md:text-7xl text-white mb-8 drop-shadow-lg">
                Happy birthday <br /> Thùy My
              </h2>
              <p className="text-pink-100/70 text-lg md:text-xl leading-relaxed mb-10 font-medium">
                Chúc My tuổi 19 thật rực rỡ, luôn xinh đẹp, rạng rỡ và tràn đầy niềm vui. 
                Hy vọng mọi ước mơ của My sẽ sớm trở thành hiện thực trong tuổi mới này. 
                Best wishes for you! ❤️
              </p>

              <div className="mb-10 text-pink-300/80 font-dancing text-3xl flex items-center justify-center gap-3">
                — From Anh 2 <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>💌</motion.span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowModal(false)}
                className="w-full py-5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-3xl font-bold text-xl shadow-xl hover:shadow-pink-500/50 transition-all border border-white/10"
              >
                Cảm ơn ❤️
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Glow Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />
    </div>
  );
}
