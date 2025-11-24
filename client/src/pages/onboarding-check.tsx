import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, RefreshCcw, CheckCircle2, AlertCircle, TrendingUp, Power, BarChart3, Users, Settings } from "lucide-react";
import { questions as defaultQuestions, results as defaultResults } from "@/data/questions";
import hronLogo from "@assets/HR_ON_logo_IceBlue1000px_1763730225207.png";
import { Link } from "wouter";

export default function OnboardingMaturityCheck() {
  const [currentStep, setCurrentStep] = useState<"start" | number | "result">("start");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const [config, setConfig] = useState<any>(null);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [results, setResults] = useState(defaultResults);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/quiz-data");
      const data = await res.json();
      
      const config = {
        title: data.header_title || "Er jeres onboarding gearet til fremtiden?",
        subtitle: data.badge_text || "HR Maturity Tools",
        description: data.description_text || "Tag vores 2-minutters maturity check og få en dybdegående analyse af jeres styrker og potentialer.",
        buttonText: data.button_text || "Start testen nu",
        primaryColor: data.color_primary || "#2F80ED",
        secondaryColor: "#0B1E3D"
      };
      setConfig(config);
      
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
      if (data.results && data.results.length > 0) {
        setResults(data.results);
      }
    } catch (error) {
      console.error("Failed to load config:", error);
    }
  };

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
    const primaryColor = config?.primaryColor || '#2F80ED';
    const secondaryColor = config?.secondaryColor || '#0B1E3D';
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0, colors: [primaryColor, secondaryColor, '#ffffff'] };

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
      <header className="w-full px-8 py-2 flex justify-between items-center z-50 relative border-b border-slate-100 pt-[0px] pb-[0px]">
        <img src={hronLogo} alt="HR-ON" className="h-10 w-auto" />
        <div className="flex items-center gap-4">
          {typeof currentStep === "number" && (
            <div className="text-sm font-bold text-blue-900 tracking-widest uppercase">
              Spørgsmål {currentStep + 1} / {questions.length}
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
          
          {/* --- CUSTOM START SCREEN --- */}
          {currentStep === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex-1 grid lg:grid-cols-2 gap-12 items-center py-6 pt-[0px] pb-[0px]"
            >
              <div className="space-y-10 max-w-2xl">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="inline-block py-1 px-3 rounded bg-blue-50 text-blue-600 text-xs font-bold tracking-[0.2em] uppercase mb-6">
                    {config?.subtitle || "HR Maturity Tools"}
                  </span>
                  <h1 className="text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[0.95]">
                    {config?.title || "Er jeres onboarding gearet til fremtiden?"}
                  </h1>
                </motion.div>
                
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-xl text-slate-600 leading-relaxed max-w-lg border-l-4 border-blue-200 pl-6"
                >
                  {config?.description || "Tag vores 2-minutters maturity check og få en dybdegående analyse af jeres styrker og potentialer."}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap gap-4"
                >
                  <Button 
                    onClick={startQuiz} 
                    className="h-16 px-10 text-lg text-white rounded-none border-2 border-transparent transition-all shadow-xl"
                    style={{ 
                      backgroundColor: config?.primaryColor || "#2F80ED",
                      boxShadow: `0 20px 25px -5px ${config?.primaryColor || "#2F80ED"}33`
                    }}
                  >
                    {config?.buttonText || "Start testen nu"} <ArrowRight className="ml-3 w-5 h-5" />
                  </Button>
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
                  <h2 className="text-4xl font-bold leading-tight" style={{ color: config?.secondaryColor || "#0B1E3D" }}>
                    {questions[currentStep]?.text}
                  </h2>
                  <div className="h-1 w-24" style={{ backgroundColor: config?.primaryColor || "#2F80ED" }} />
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
                          ? "text-white shadow-xl scale-[1.02]" 
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
                      `}
                      style={answers[currentStep] === option.points ? {
                        backgroundColor: config?.secondaryColor || "#0B1E3D",
                        borderColor: config?.primaryColor || "#2F80ED"
                      } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-medium pr-8">{option.text}</span>
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
                      className={`w-2 h-2 rounded-full transition-colors ${idx <= currentStep ? '' : 'bg-slate-200'}`}
                      style={idx <= currentStep ? { backgroundColor: config?.primaryColor || "#2F80ED" } : {}}
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
                      : "hover:translate-x-1"}
                  `}
                  style={answers[currentStep] !== undefined ? { color: config?.primaryColor || "#2F80ED" } : {}}
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 py-12 max-w-5xl mx-auto w-full"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Score Card - Left Side */}
                <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-[0_20px_50px_-12px_rgba(11,30,61,0.1)] border border-slate-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-2" style={{ backgroundColor: config?.primaryColor || "#2F80ED" }} />
                  
                  <div className="text-center pt-6 pb-10">
                    <h3 className="font-bold tracking-widest uppercase text-xs mb-8" style={{ color: config?.secondaryColor || "#0B1E3D" }}>Onboarding Maturity Score</h3>
                    
                    <div className="relative w-56 h-56 mx-auto mb-6">
                      {/* Outer Glow */}
                      <div className="absolute inset-0 bg-blue-400/10 rounded-full blur-2xl" />
                      
                      <svg className="w-full h-full transform -rotate-90 relative z-10">
                        <circle
                          cx="112"
                          cy="112"
                          r="100"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="16"
                        />
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
                      <div className="absolute inset-0 flex items-center justify-center flex-col">
                        <span className="text-6xl font-black tracking-tighter" style={{ color: config?.secondaryColor || "#0B1E3D" }}>{calculateScore()}</span>
                        <span className="text-slate-400 font-medium text-sm">af 30 point</span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-3 leading-tight" style={{ color: config?.secondaryColor || "#0B1E3D" }}>
                      {getResult()?.title}
                    </h2>
                    <div className="h-1 w-12 mx-auto rounded-full mb-4" style={{ backgroundColor: config?.primaryColor || "#2F80ED" }} />
                  </div>
                  
                  <div className="bg-slate-50 -mx-8 -mb-8 p-8 border-t border-slate-100">
                    <p className="text-slate-600 text-sm leading-relaxed text-center">
                      {getResult().description}
                    </p>
                  </div>
                </div>

                {/* Insights & Action - Right Side */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_-12px_rgba(11,30,61,0.08)] border border-slate-100">
                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2" style={{ color: config?.secondaryColor || "#0B1E3D" }}>
                      <BarChart3 className="w-5 h-5" style={{ color: config?.primaryColor || "#2F80ED" }} />
                      Analyse af jeres niveau
                    </h3>
                    
                    <div className="space-y-4">
                      {getResult().bullets.map((bullet, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + idx * 0.1 }}
                          className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 transition-all"
                          style={{ 
                            "--hover-border": `${config?.primaryColor || "#2F80ED"}4d`,
                          } as any}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = `${config?.primaryColor || "#2F80ED"}4d`}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e2e8f0"}
                        >
                          <div className={`mt-1 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            bullet.type === "strength" ? "bg-green-100 text-green-600" :
                            bullet.type === "risk" ? "bg-red-100 text-red-600" :
                            "bg-amber-100 text-amber-600"
                          }`}>
                            {bullet.type === "strength" && <CheckCircle2 className="w-4 h-4" />}
                            {bullet.type === "risk" && <AlertCircle className="w-4 h-4" />}
                            {bullet.type === "opportunity" && <TrendingUp className="w-4 h-4" />}
                          </div>
                          <div>
                            <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${
                              bullet.type === "strength" ? "text-green-700" :
                              bullet.type === "risk" ? "text-red-700" :
                              "text-amber-700"
                            }`}>
                              {bullet.type === "strength" ? "Styrke" : bullet.type === "risk" ? "Risiko" : "Mulighed"}
                            </span>
                            <p className="text-slate-700 text-sm leading-relaxed font-medium">
                              {bullet.text}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* HR-ON Branded CTA */}
                  <div className="rounded-3xl p-8 text-white relative overflow-hidden shadow-xl" style={{ backgroundColor: config?.secondaryColor || "#0B1E3D" }}>
                     <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] opacity-40 translate-x-1/3 -translate-y-1/3 pointer-events-none" style={{ backgroundColor: config?.primaryColor || "#2F80ED" }} />
                     
                     <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
                           <img src={hronLogo} className="w-8 h-auto brightness-0 invert opacity-90" alt="HR-ON" />
                         </div>
                         <div>
                           <h4 className="font-bold text-lg">Få styr på jeres onboarding</h4>
                           <p className="text-blue-200 text-sm max-w-xs">
                             Saml planer, opgaver og opfølgning ét sted med HR-ON Boarding.
                           </p>
                         </div>
                       </div>
                       
                       <div className="flex flex-col gap-2 w-full md:w-auto">
                         <Button onClick={() => window.open("https://hr-on.com/onboarding-vaerktoej/", "_blank")} className="text-white border-none h-10 rounded-full px-6 font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity" style={{ backgroundColor: config?.primaryColor || "#2F80ED" }}>
                           Læs mere
                         </Button>
                         <Button 
                           onClick={resetQuiz} 
                           variant="ghost" 
                           className="text-slate-300 hover:text-white hover:bg-white/5 h-8 text-xs"
                         >
                           <RefreshCcw className="mr-2 w-3 h-3" /> Start forfra
                         </Button>
                       </div>
                     </div>
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
