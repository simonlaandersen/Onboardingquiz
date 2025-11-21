import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, RefreshCcw, CheckCircle2, AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { questions, results } from "@/data/questions";
import hronLogo from "@assets/HR_ON_logo_IceBlue1000px_1763730225207.png";

export default function OnboardingMaturityCheck() {
  const [currentStep, setCurrentStep] = useState<"start" | number | "result">("start");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);

  const startQuiz = () => setCurrentStep(0);
  
  const handleAnswer = (points: number) => {
    if (typeof currentStep === "number") {
      setAnswers(prev => ({ ...prev, [currentStep]: points }));
      
      // Small haptic/visual feedback could go here
    }
  };

  const nextStep = () => {
    if (typeof currentStep === "number") {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
        setHoveredOption(null);
      } else {
        setCurrentStep("result");
        triggerConfetti();
      }
    }
  };

  const prevStep = () => {
    if (typeof currentStep === "number" && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep("start");
  };

  const calculateScore = () => {
    return Object.values(answers).reduce((sum, points) => sum + points, 0);
  };

  const getResult = () => {
    const score = calculateScore();
    return results.find(r => score >= r.min && score <= r.max) || results[0];
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50/50 relative overflow-hidden font-sans text-slate-900">
      
      {/* Fun Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-200/30 rounded-full blur-3xl blob-animation" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-200/30 rounded-full blur-3xl blob-animation-delay" />
        <div className="absolute top-[40%] left-[60%] w-[20vw] h-[20vw] bg-cyan-100/40 rounded-full blur-3xl blob-animation" />
      </div>

      {/* Header */}
      <header className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100/50">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.img 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            src={hronLogo} 
            alt="HR-ON Logo" 
            className="h-10 w-auto object-contain" 
          />
          {typeof currentStep === "number" && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex items-center gap-2 px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100"
             >
               <span className="text-sm font-bold text-primary">
                 {currentStep + 1}
               </span>
               <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                 af {questions.length}
               </span>
             </motion.div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <div className="max-w-3xl w-full py-8">
          <AnimatePresence mode="wait">
            {currentStep === "start" && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-10"
              >
                <div className="relative inline-block">
                  <motion.div 
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute -top-6 -right-6 text-4xl"
                  >
                    👋
                  </motion.div>
                  <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    Onboarding <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                      Maturity Check
                    </span>
                  </h1>
                </div>
                
                <p className="text-xl md:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
                  Hvor stærkt står jeres onboarding? <br/>
                  Tag testen på 2 minutter og få konkrete svar.
                </p>

                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={startQuiz} 
                    size="lg" 
                    className="h-16 px-12 text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-xl shadow-blue-500/20 transition-all"
                  >
                    Start testen nu <ArrowRight className="ml-3 w-6 h-6" />
                  </Button>
                </motion.div>
                
                <div className="pt-8 flex justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                   {/* Playful icons representing HR concepts */}
                   <Sparkles className="w-8 h-8" />
                   <TrendingUp className="w-8 h-8" />
                   <CheckCircle2 className="w-8 h-8" />
                </div>
              </motion.div>
            )}

            {typeof currentStep === "number" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                {/* Segmented Progress Bar */}
                <div className="flex gap-1 mb-12">
                  {questions.map((_, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scaleY: 1 }}
                      animate={{ 
                        scaleY: idx === currentStep ? 1.5 : 1,
                        backgroundColor: idx <= currentStep ? "var(--color-primary)" : "#e2e8f0"
                      }}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300`}
                    />
                  ))}
                </div>

                <div className="space-y-8">
                  <div className="space-y-3 text-center md:text-left">
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs tracking-widest uppercase"
                    >
                      {questions[currentStep].category}
                    </motion.span>
                    <motion.h2 
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight"
                    >
                      {questions[currentStep].text}
                    </motion.h2>
                  </div>

                  <div className="grid gap-4 mt-8">
                    {questions[currentStep].options.map((option, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + idx * 0.1 }}
                        onClick={() => handleAnswer(option.points)}
                        onMouseEnter={() => setHoveredOption(idx)}
                        onMouseLeave={() => setHoveredOption(null)}
                        className={`
                          group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex items-center gap-5
                          ${answers[currentStep] === option.points 
                            ? "border-blue-500 bg-blue-50/80 shadow-lg shadow-blue-500/10 scale-[1.02]" 
                            : "border-white bg-white/80 shadow-sm hover:border-blue-200 hover:shadow-md hover:-translate-y-1"}
                        `}
                      >
                        <div className={`
                          w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300
                          ${answers[currentStep] === option.points 
                            ? "border-blue-500 bg-blue-500 text-white scale-110" 
                            : "border-slate-200 bg-slate-50 group-hover:border-blue-300"}
                        `}>
                          {answers[currentStep] === option.points && (
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2.5 h-2.5 bg-white rounded-full" 
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-lg ${answers[currentStep] === option.points ? "text-blue-900 font-semibold" : "text-slate-700 font-medium group-hover:text-slate-900"}`}>
                            {option.text}
                          </p>
                        </div>
                        
                        {/* Fun hover indicator */}
                        <AnimatePresence>
                          {answers[currentStep] === option.points && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0, rotate: -20 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, scale: 0 }}
                              className="absolute right-4 -top-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg"
                            >
                              Valgt!
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-8">
                    <Button 
                      variant="ghost" 
                      onClick={prevStep} 
                      disabled={currentStep === 0}
                      className="text-slate-400 hover:text-slate-900 hover:bg-white/50 -ml-4"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" /> Tilbage
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={answers[currentStep] === undefined}
                      className={`
                        h-12 px-8 rounded-full font-semibold text-white transition-all duration-300
                        ${answers[currentStep] === undefined 
                          ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                          : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"}
                      `}
                    >
                      Næste <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === "result" && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 max-w-4xl mx-auto"
              >
                <div className="text-center space-y-6 py-8">
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: 1 }}
                     transition={{ type: "spring", delay: 0.2 }}
                     className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-cyan-400 rounded-3xl rotate-3 flex items-center justify-center shadow-2xl shadow-blue-500/30 text-white mb-6"
                   >
                     <span className="text-4xl font-bold">{calculateScore()}</span>
                   </motion.div>
                   
                   <div className="space-y-2">
                     <p className="text-sm font-bold text-blue-600 uppercase tracking-widest">Dit Resultat</p>
                     <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">{getResult().title}</h2>
                   </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600" />
                   
                   <p className="text-xl md:text-2xl text-slate-700 leading-relaxed text-center font-medium mb-12">
                     {getResult().description}
                   </p>

                   <div className="grid gap-6 md:grid-cols-3">
                    {getResult().bullets.map((bullet, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.2 }}
                        className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow duration-300"
                      >
                        <div className="mb-4">
                          {bullet.type === "strength" && <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-3 rotate-3"><CheckCircle2 className="w-6 h-6" /></div>}
                          {bullet.type === "risk" && <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-500 mb-3 -rotate-3"><AlertCircle className="w-6 h-6" /></div>}
                          {bullet.type === "opportunity" && <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-500 mb-3 rotate-2"><TrendingUp className="w-6 h-6" /></div>}
                          
                          <h3 className="font-bold text-slate-900 text-lg">
                            {bullet.type === "strength" ? "Styrke" : bullet.type === "risk" ? "Risiko" : "Mulighed"}
                          </h3>
                        </div>
                        <p className="text-slate-600 leading-relaxed">{bullet.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl shadow-blue-900/20"
                >
                   {/* Background pattern */}
                   <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
                   
                   <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                     <h3 className="text-3xl font-bold">Klar til at tage næste skridt? 🚀</h3>
                     <p className="text-blue-100 text-lg font-medium leading-relaxed">
                       HR-ON Boarding samler hele rejsen ét sted. <br/>Få styr på planer, opgaver og opfølgning med det samme.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                       <Button onClick={resetQuiz} variant="outline" className="h-14 px-8 rounded-full bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm">
                         <RefreshCcw className="mr-2 w-5 h-5" /> Prøv igen
                       </Button>
                       <Button className="h-14 px-8 rounded-full bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg">
                         Læs mere om HR-ON Boarding
                       </Button>
                     </div>
                   </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
