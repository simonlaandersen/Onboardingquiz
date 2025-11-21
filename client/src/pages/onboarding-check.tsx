import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, RefreshCcw, CheckCircle2, AlertCircle, TrendingUp, Power, BarChart3, Users } from "lucide-react";
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
      
      // Auto-advance after a short delay to show selection feedback
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
          setHoveredOption(null);
        } else {
          setCurrentStep("result");
          triggerConfetti();
        }
      }, 400);
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
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: ['#2F80ED', '#0B1E3D', '#ffffff'] };

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
    <div className="min-h-screen w-full bg-white relative overflow-hidden font-sans text-slate-900 flex flex-col">
      
      {/* Abstract Brand Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
        <div className="absolute -top-[20%] -right-[20%] w-[80vw] h-[80vw] border-[100px] border-blue-600 rounded-full opacity-20" />
        <div className="absolute top-[40%] -left-[10%] w-[40vw] h-[40vw] bg-blue-100 rounded-full blur-3xl" />
      </div>

      {/* Minimalist Header */}
      <header className="w-full px-8 py-6 flex justify-between items-center z-50 relative">
        <img src={hronLogo} alt="HR-ON" className="h-10 w-auto" />
        {typeof currentStep === "number" && (
          <div className="text-sm font-bold text-blue-900 tracking-widest uppercase">
            Spørgsmål {currentStep + 1} / {questions.length}
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col relative z-10 container mx-auto px-6 max-w-7xl">
        <AnimatePresence mode="wait">
          
          {/* --- CUSTOM START SCREEN --- */}
          {currentStep === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex-1 grid lg:grid-cols-2 gap-12 items-center py-12"
            >
              <div className="space-y-10 max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block py-1 px-3 rounded bg-blue-50 text-blue-600 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                    HR Maturity Tools
                  </span>
                  <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]">
                    Er jeres <br/>
                    <span className="text-blue-600">onboarding</span> <br/>
                    gearet til fremtiden?
                  </h1>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-slate-600 leading-relaxed max-w-lg border-l-4 border-blue-200 pl-6"
                >
                  Tag vores 2-minutters maturity check og få en dybdegående analyse af jeres styrker og potentialer.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button 
                    onClick={startQuiz} 
                    className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-none border-2 border-transparent hover:border-blue-800 transition-all shadow-xl shadow-blue-600/20"
                  >
                    Start testen nu <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                  
                  <div className="flex items-center gap-4 px-6 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Gratis</span>
                    <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-500"/> Uforpligtende</span>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative hidden lg:flex justify-center items-center"
              >
                {/* Abstract Graphic representing "Maturity" */}
                <div className="relative w-[500px] h-[500px]">
                  <div className="absolute inset-0 border border-slate-200 rounded-full animate-[spin_60s_linear_infinite]" />
                  <div className="absolute inset-[50px] border border-slate-200 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
                  <div className="absolute inset-[100px] border border-blue-100 rounded-full animate-[spin_30s_linear_infinite]" />
                  
                  {/* Floating Stats Cards */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute top-20 right-0 bg-white p-6 shadow-2xl shadow-blue-900/10 max-w-xs z-20 border-l-4 border-blue-500"
                  >
                    <BarChart3 className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="font-bold text-slate-900">Datadrevet Indsigt</h3>
                    <p className="text-sm text-slate-500 mt-1">Få konkrete tal på jeres HR-indsats.</p>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-20 left-0 bg-white p-6 shadow-2xl shadow-blue-900/10 max-w-xs z-20 border-l-4 border-indigo-500"
                  >
                    <Users className="w-8 h-8 text-indigo-600 mb-3" />
                    <h3 className="font-bold text-slate-900">Medarbejderrejse</h3>
                    <p className="text-sm text-slate-500 mt-1">Optimér oplevelsen fra dag 1.</p>
                  </motion.div>
                  
                  {/* Center Power Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/40">
                      <Power className="w-16 h-16" strokeWidth={3} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* --- CUSTOM QUIZ SCREEN --- */}
          {typeof currentStep === "number" && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full py-8"
            >
              <div className="grid lg:grid-cols-12 gap-12">
                {/* Question Side */}
                <div className="lg:col-span-5 space-y-8">
                  <div className="w-12 h-12 bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xl rounded-full mb-6">
                    {currentStep + 1}
                  </div>
                  <h2 className="text-4xl font-bold text-slate-900 leading-tight">
                    {questions[currentStep].text}
                  </h2>
                  <div className="h-1 w-24 bg-blue-600" />
                  <p className="text-slate-500 uppercase tracking-wider font-bold text-sm">
                    {questions[currentStep].category}
                  </p>
                </div>

                {/* Options Side */}
                <div className="lg:col-span-7 grid gap-4 content-center">
                  {questions[currentStep].options.map((option, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleAnswer(option.points)}
                      className={`
                        group relative w-full text-left p-6 transition-all duration-200 border-l-4 
                        ${answers[currentStep] === option.points 
                          ? "bg-slate-900 border-blue-500 text-white shadow-xl scale-[1.02]" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-300 hover:text-slate-900"}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium pr-8">{option.text}</span>
                        {answers[currentStep] === option.points && (
                          <motion.div layoutId="check">
                             <CheckCircle2 className="w-6 h-6 text-blue-500" />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-16 border-t border-slate-100 pt-8">
                <button 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  className="flex items-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors font-medium"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Forrige spørgsmål
                </button>

                {/* Custom Progress Indicator */}
                <div className="flex gap-1">
                  {questions.map((_, idx) => (
                    <div 
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${idx <= currentStep ? 'bg-blue-600' : 'bg-slate-200'}`}
                    />
                  ))}
                </div>

                <button 
                  onClick={nextStep} 
                  disabled={answers[currentStep] === undefined}
                  className={`
                    flex items-center font-bold transition-all
                    ${answers[currentStep] === undefined 
                      ? "text-slate-300 cursor-not-allowed" 
                      : "text-blue-600 hover:text-blue-800 hover:translate-x-1"}
                  `}
                >
                  Næste trin <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* --- CUSTOM RESULT SCREEN --- */}
          {currentStep === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 py-12 max-w-6xl mx-auto w-full"
            >
              <div className="grid lg:grid-cols-12 gap-8 h-full">
                {/* Left Column: Score & Title */}
                <div className="lg:col-span-4 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2" />
                  
                  <div>
                    <p className="text-blue-400 font-bold tracking-widest uppercase text-sm mb-2">Din Score</p>
                    <div className="text-8xl font-black text-white mb-2 tracking-tighter">
                      {calculateScore()}<span className="text-4xl text-slate-500 font-normal">/30</span>
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="h-1 w-20 bg-blue-500" />
                    <h2 className="text-4xl font-bold leading-tight">
                      {getResult().title}
                    </h2>
                    <p className="text-slate-400 leading-relaxed">
                      {getResult().description}
                    </p>
                  </div>

                  <div className="pt-12">
                    <Button onClick={resetQuiz} variant="outline" className="w-full border-slate-700 text-white hover:bg-slate-800 hover:text-white">
                      <RefreshCcw className="mr-2 w-4 h-4" /> Tag testen igen
                    </Button>
                  </div>
                </div>

                {/* Right Column: Analysis & CTA */}
                <div className="lg:col-span-8 bg-slate-50 p-10 flex flex-col gap-8">
                  <div className="grid md:grid-cols-3 gap-6">
                    {getResult().bullets.map((bullet, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                      >
                        <div className="mb-4">
                          {bullet.type === "strength" && <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />}
                          {bullet.type === "risk" && <AlertCircle className="w-8 h-8 text-red-500 mb-2" />}
                          {bullet.type === "opportunity" && <TrendingUp className="w-8 h-8 text-amber-500 mb-2" />}
                          
                          <h3 className="font-bold text-slate-900 text-lg capitalize">
                            {bullet.type === "strength" ? "Styrke" : bullet.type === "risk" ? "Risiko" : "Mulighed"}
                          </h3>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed">{bullet.text}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-auto bg-blue-50 border border-blue-100 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <h3 className="font-bold text-blue-900 text-xl mb-2">Klar til at løfte jeres onboarding?</h3>
                      <p className="text-blue-700/80 max-w-md">
                        HR-ON Boarding samler hele rejsen ét sted. Få styr på planer, opgaver og opfølgning.
                      </p>
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 whitespace-nowrap shadow-lg shadow-blue-600/20">
                      Prøv HR-ON Boarding
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
