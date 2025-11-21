import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, RefreshCcw, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";
import { questions, results } from "@/data/questions";
import hronLogo from "@assets/HR_ON_logo_IceBlue1000px_1763730225207.png";

export default function OnboardingMaturityCheck() {
  const [currentStep, setCurrentStep] = useState<"start" | number | "result">("start");
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const startQuiz = () => setCurrentStep(0);
  
  const handleAnswer = (points: number) => {
    if (typeof currentStep === "number") {
      setAnswers(prev => ({ ...prev, [currentStep]: points }));
    }
  };

  const nextStep = () => {
    if (typeof currentStep === "number") {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setCurrentStep("result");
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

  return (
    <div className="min-h-screen w-full bg-white flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="w-full border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <img src={hronLogo} alt="HR-ON Logo" className="h-8 w-auto object-contain" />
          {typeof currentStep === "number" && (
             <div className="text-sm font-medium text-slate-500">
               {currentStep + 1} / {questions.length}
             </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="max-w-3xl w-full">
          <AnimatePresence mode="wait">
            {currentStep === "start" && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-12"
              >
                <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
                  Onboarding Maturity Check
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                  Få et hurtigt reality check på jeres onboarding. <br/>
                  Svar på 10 spørgsmål og få en dybdegående analyse af jeres nuværende niveau.
                </p>
                <Button 
                  onClick={startQuiz} 
                  size="lg" 
                  className="h-14 px-10 text-lg bg-primary hover:bg-blue-600 text-white rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Start testen <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                
                <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center opacity-60 grayscale hover:grayscale-0 transition-all">
                   {/* Simple trust indicators or stats could go here to make it look pro */}
                </div>
              </motion.div>
            )}

            {typeof currentStep === "number" && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full"
              >
                <div className="w-full bg-slate-100 h-1.5 rounded-full mb-12 overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <span className="text-primary font-semibold text-sm tracking-wider uppercase">
                      {questions[currentStep].category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 leading-tight">
                      {questions[currentStep].text}
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    {questions[currentStep].options.map((option, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleAnswer(option.points)}
                        className={`
                          group relative p-5 rounded-lg border cursor-pointer transition-all duration-200 flex items-center gap-4
                          ${answers[currentStep] === option.points 
                            ? "border-primary bg-blue-50/40 shadow-sm" 
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50"}
                        `}
                      >
                        <div className={`
                          w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                          ${answers[currentStep] === option.points 
                            ? "border-primary bg-primary text-white" 
                            : "border-slate-300 group-hover:border-primary"}
                        `}>
                          {answers[currentStep] === option.points && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div className="flex-1">
                          <p className={`text-base ${answers[currentStep] === option.points ? "text-slate-900 font-medium" : "text-slate-600 group-hover:text-slate-900"}`}>
                            {option.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between pt-6 border-t border-slate-100">
                    <Button 
                      variant="ghost" 
                      onClick={prevStep} 
                      disabled={currentStep === 0}
                      className="text-slate-400 hover:text-slate-900 -ml-4"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" /> Tilbage
                    </Button>
                    <Button 
                      onClick={nextStep} 
                      disabled={answers[currentStep] === undefined}
                      className={`
                        bg-primary hover:bg-blue-600 text-white px-8 rounded-full transition-all
                        ${answers[currentStep] === undefined ? "opacity-50 cursor-not-allowed" : "shadow-md hover:shadow-lg"}
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
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-10"
              >
                <div className="text-center space-y-4">
                   <p className="text-sm font-semibold text-primary uppercase tracking-widest">Resultat</p>
                   <h2 className="text-4xl md:text-5xl font-bold text-slate-900">{getResult().title}</h2>
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
                      Modenhedsscore: {calculateScore()} / 30
                   </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-8 md:p-10 border border-slate-100">
                   <p className="text-xl text-slate-700 leading-relaxed max-w-3xl mx-auto text-center">
                     {getResult().description}
                   </p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {getResult().bullets.map((bullet, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="mb-4">
                        {bullet.type === "strength" && <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3"><CheckCircle2 className="w-5 h-5" /></div>}
                        {bullet.type === "risk" && <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-3"><AlertCircle className="w-5 h-5" /></div>}
                        {bullet.type === "opportunity" && <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-3"><TrendingUp className="w-5 h-5" /></div>}
                        
                        <h3 className="font-semibold text-slate-900">
                          {bullet.type === "strength" ? "Styrke" : bullet.type === "risk" ? "Risiko" : "Mulighed"}
                        </h3>
                      </div>
                      <p className="text-slate-600 text-sm leading-relaxed">{bullet.text}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-600 rounded-2xl p-8 md:p-12 text-white text-center relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 z-0"></div>
                   <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                     <h3 className="text-2xl font-bold">Tag det næste skridt med HR-ON</h3>
                     <p className="text-blue-100 text-lg">
                       HR-ON Boarding kan hjælpe jer med at samle onboardingplaner, opgaver og opfølgning ét sted, så I sikrer en professionel start for alle nye medarbejdere.
                     </p>
                     <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
                       <Button onClick={resetQuiz} variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10">
                         <RefreshCcw className="mr-2 w-4 h-4" /> Start forfra
                       </Button>
                       <Button className="bg-white text-blue-600 hover:bg-blue-50">
                         Læs mere om HR-ON
                       </Button>
                     </div>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
