import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, RefreshCcw, CheckCircle2, Zap, TrendingUp, Users, Settings } from "lucide-react";
import { questions as defaultQuestions, results as defaultResults } from "@/data/questions";
import hronLogo from "@assets/HR_ON_logo_IceBlue1000px_1763730225207.png";
import { Link } from "wouter";

export default function OnboardingMaturityCheck() {
  const [currentStep, setCurrentStep] = useState<"start" | number | "result">("start");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [config, setConfig] = useState<any>(null);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [results, setResults] = useState(defaultResults);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      setConfig(data);
      
      if (data.questionsData && data.questionsData.length > 0) {
        setQuestions(data.questionsData);
      }
      if (data.resultsData && data.resultsData.length > 0) {
        setResults(data.resultsData);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

  const startQuiz = () => setCurrentStep(0);
  
  const handleAnswer = (points: number) => {
    if (typeof currentStep === "number") {
      setAnswers(prev => ({ ...prev, [currentStep]: points }));
      setTimeout(() => {
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
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
    const primaryColor = config?.primaryColor || '#2F80ED';
    const secondaryColor = config?.secondaryColor || '#0B1E3D';
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: [primaryColor, secondaryColor, '#ffffff'] };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // Journey phases for visual element
  const journeyPhases = [
    { icon: "🎯", label: "Rekrutering" },
    { icon: "🚀", label: "Preboarding" },
    { icon: "👋", label: "Onboarding" },
    { icon: "📈", label: "Udvikling" },
    { icon: "🎯", label: "Fastholdelse" }
  ];

  if (!config) return <div className="min-h-screen flex items-center justify-center">Indlæser...</div>;

  return (
    <div className="min-h-screen w-full bg-white relative overflow-hidden font-sans text-slate-900 flex flex-col">
      
      {/* Dynamic Gradient Background */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-5"
        style={{
          background: `linear-gradient(135deg, ${config?.primaryColor || '#2F80ED'} 0%, ${config?.secondaryColor || '#0B1E3D'} 100%)`
        }}
      />

      {/* Animated Circles */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 360] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-[20%] -right-[20%] w-[80vw] h-[80vw] rounded-full"
          style={{ borderColor: config?.primaryColor || '#2F80ED', borderWidth: 100 }}
        />
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[40%] -left-[10%] w-[40vw] h-[40vw] rounded-full blur-3xl"
          style={{ backgroundColor: config?.secondaryColor || '#0B1E3D' }}
        />
      </div>

      {/* Header */}
      <header className="w-full px-8 py-6 flex justify-between items-center z-50 relative">
        <img src={hronLogo} alt="HR-ON" className="h-10 w-auto" />
        <div className="flex items-center gap-4">
          {typeof currentStep === "number" && (
            <div className="text-sm font-bold tracking-widest uppercase" style={{ color: config?.secondaryColor || '#0B1E3D' }}>
              {currentStep + 1}/{questions.length}
            </div>
          )}
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col relative z-10 container mx-auto px-6 max-w-7xl">
        <AnimatePresence mode="wait">
          
          {/* --- START SCREEN --- */}
          {currentStep === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center items-center text-center py-20"
            >
              <motion.div className="space-y-12 max-w-3xl mx-auto">
                {/* Journey Visualization */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center items-center gap-2 mb-12"
                >
                  {journeyPhases.map((phase, idx) => (
                    <motion.div
                      key={idx}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ delay: idx * 0.1, duration: 2, repeat: Infinity }}
                      className="flex flex-col items-center gap-1"
                    >
                      <div className="text-4xl">{phase.icon}</div>
                      <div className="text-xs font-medium text-slate-500 hidden md:block">{phase.label}</div>
                      {idx < journeyPhases.length - 1 && (
                        <motion.div 
                          className="hidden md:block h-px w-6" 
                          style={{ backgroundColor: config?.primaryColor || '#2F80ED' }}
                        />
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Main Content */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="inline-block py-2 px-4 rounded-full text-xs font-bold tracking-widest uppercase mb-6" 
                      style={{ backgroundColor: `${config?.primaryColor || '#2F80ED'}15`, color: config?.primaryColor || '#2F80ED' }}>
                      {config?.subtitle || "HR Maturity Check"}
                    </span>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6" style={{ color: config?.secondaryColor || '#0B1E3D' }}>
                      {config?.title || "Er jeres onboarding gearet til fremtiden?"}
                    </h1>
                  </motion.div>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto"
                  >
                    {config?.description || "Tag vores 2-minutters maturity check og få en dybdegående analyse af jeres styrker og potentialer."}
                  </motion.p>
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Button 
                    onClick={startQuiz} 
                    className="h-16 px-12 text-lg text-white rounded-lg border-2 border-transparent transition-all shadow-xl font-semibold"
                    style={{ 
                      backgroundColor: config?.primaryColor || "#2F80ED",
                      boxShadow: `0 20px 40px -10px ${config?.primaryColor || '#2F80ED'}40`
                    }}
                  >
                    {config?.buttonText || "Start testen nu"} <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* --- QUESTION SCREEN --- */}
          {typeof currentStep === "number" && currentStep < questions.length && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-between py-16"
            >
              <div className="max-w-4xl mx-auto w-full">
                {/* Progress Bar */}
                <motion.div className="mb-12 space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-4xl font-bold" style={{ color: config?.secondaryColor || "#0B1E3D" }}>
                      {questions[currentStep]?.text}
                    </h2>
                    <div className="text-sm font-bold tracking-widest uppercase px-4 py-2 rounded-full" 
                      style={{ backgroundColor: `${config?.primaryColor || '#2F80ED'}15`, color: config?.primaryColor || '#2F80ED' }}>
                      {currentStep + 1}/{questions.length}
                    </div>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full"
                      style={{ backgroundColor: config?.primaryColor || '#2F80ED' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>

                {/* Options */}
                <div className="space-y-4 mt-12">
                  {questions[currentStep]?.options?.map((option: any, idx: number) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleAnswer(option.points)}
                      className={`w-full text-left p-6 rounded-lg transition-all duration-200 border-2 font-medium text-lg group ${
                        answers[currentStep] === option.points 
                          ? "text-white shadow-lg scale-105" 
                          : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:shadow-md"
                      }`}
                      style={answers[currentStep] === option.points ? {
                        backgroundColor: config?.secondaryColor || "#0B1E3D",
                        borderColor: config?.primaryColor || "#2F80ED"
                      } : {}}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option.text}</span>
                        {answers[currentStep] === option.points && (
                          <motion.div layoutId="check">
                            <CheckCircle2 className="w-6 h-6" style={{ color: config?.primaryColor || "#2F80ED" }} />
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="max-w-4xl mx-auto w-full mt-12 flex justify-between items-center pt-8 border-t border-slate-100">
                <button 
                  onClick={prevStep} 
                  disabled={currentStep === 0}
                  className="flex items-center text-slate-400 hover:text-slate-900 disabled:opacity-30 transition-colors font-medium"
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Forrige
                </button>

                <div className="flex gap-1.5">
                  {questions.map((_, idx) => (
                    <div 
                      key={idx}
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: idx === currentStep ? '20px' : '8px',
                        backgroundColor: idx <= currentStep ? config?.primaryColor || "#2F80ED" : '#e2e8f0'
                      }}
                    />
                  ))}
                </div>

                <button 
                  onClick={nextStep} 
                  disabled={answers[currentStep] === undefined}
                  className={`flex items-center font-bold transition-all ${
                    answers[currentStep] === undefined 
                      ? "text-slate-300 cursor-not-allowed" 
                      : "hover:translate-x-1"
                  }`}
                  style={answers[currentStep] !== undefined ? { color: config?.primaryColor || "#2F80ED" } : {}}
                >
                  Næste <ArrowRight className="ml-2 w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* --- RESULT SCREEN --- */}
          {currentStep === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col justify-center py-16"
            >
              <div className="max-w-4xl mx-auto w-full">
                <div className="grid lg:grid-cols-5 gap-8">
                  {/* Score Card */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-2xl border"
                    style={{ borderColor: `${config?.primaryColor || '#2F80ED'}30` }}
                  >
                    <div className="text-center space-y-6">
                      <h3 className="text-xs font-bold tracking-widest uppercase" style={{ color: config?.secondaryColor || "#0B1E3D" }}>
                        Din Score
                      </h3>
                      
                      <div className="relative w-48 h-48 mx-auto">
                        <svg viewBox="0 0 224 224" className="w-full h-full">
                          <circle cx="112" cy="112" r="100" fill="none" stroke="#f1f5f9" strokeWidth="16" />
                          <motion.circle
                            cx="112"
                            cy="112"
                            r="100"
                            fill="none"
                            stroke={config?.primaryColor || "#2F80ED"}
                            strokeWidth="16"
                            strokeDasharray={2 * Math.PI * 100}
                            initial={{ strokeDashoffset: 2 * Math.PI * 100 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 100 * (1 - calculateScore() / 30) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-5xl font-black" style={{ color: config?.secondaryColor || "#0B1E3D" }}>
                            {calculateScore()}
                          </span>
                          <span className="text-slate-400 text-sm">af 30</span>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold mb-2" style={{ color: config?.secondaryColor || "#0B1E3D" }}>
                          {getResult()?.title}
                        </h2>
                        <p className="text-slate-600 text-sm">{getResult()?.subtitle}</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Insights */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-3 space-y-4"
                  >
                    <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: config?.secondaryColor || "#0B1E3D" }}>
                      <Zap className="w-5 h-5" style={{ color: config?.primaryColor || "#2F80ED" }} />
                      Vigtigste indsigter
                    </h3>

                    <div className="space-y-3">
                      {getResult()?.bullets?.slice(0, 4).map((bullet: any, idx: number) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm"
                        >
                          <div className="flex gap-3">
                            <div className="text-2xl mt-1">{bullet.emoji || "→"}</div>
                            <p className="text-slate-700 text-sm leading-relaxed">{bullet.text}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* CTA */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7 }}
                      className="pt-4 space-y-3"
                    >
                      <Button 
                        onClick={resetQuiz}
                        className="w-full text-white font-semibold h-12 rounded-lg"
                        style={{ backgroundColor: config?.primaryColor || "#2F80ED" }}
                      >
                        Tag testen igen
                      </Button>
                      <Button 
                        variant="outline"
                        className="w-full h-12 rounded-lg"
                      >
                        Læs mere
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
