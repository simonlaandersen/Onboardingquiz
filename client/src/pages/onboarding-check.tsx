import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, ArrowLeft, RefreshCcw, CheckCircle2, AlertCircle, TrendingUp, Check } from "lucide-react";
import { questions, results, type Question } from "@/data/questions";

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
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="max-w-2xl w-full">
        <AnimatePresence mode="wait">
          {currentStep === "start" && (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                  Onboarding Maturity Check
                </h1>
                <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto leading-relaxed">
                  Svar på 10 spørgsmål og få et hurtigt reality check på, hvor moden jeres onboarding er.
                </p>
                <Button 
                  onClick={startQuiz} 
                  size="lg" 
                  className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105"
                >
                  Start testen <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
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
              <div className="mb-6 flex items-center justify-between text-sm text-slate-500 font-medium">
                <span>Spørgsmål {currentStep + 1} af {questions.length}</span>
                <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
              </div>
              <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2 mb-8 bg-slate-200" />

              <Card className="border-0 shadow-xl overflow-hidden bg-white rounded-2xl">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6 md:p-8 pb-6">
                  <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase mb-2 block">
                    {questions[currentStep].category}
                  </span>
                  <CardTitle className="text-xl md:text-2xl leading-snug text-slate-900">
                    {questions[currentStep].text}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 md:p-8 pt-6 space-y-4">
                  {questions[currentStep].options.map((option, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleAnswer(option.points)}
                      className={`
                        group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex items-start gap-4
                        ${answers[currentStep] === option.points 
                          ? "border-blue-600 bg-blue-50/50" 
                          : "border-slate-100 hover:border-blue-200 hover:bg-slate-50"}
                      `}
                    >
                      <div className={`
                        w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors
                        ${answers[currentStep] === option.points 
                          ? "border-blue-600 bg-blue-600 text-white" 
                          : "border-slate-300 group-hover:border-blue-400"}
                      `}>
                        {answers[currentStep] === option.points && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium transition-colors ${answers[currentStep] === option.points ? "text-blue-900" : "text-slate-700"}`}>
                          {option.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
                <CardFooter className="p-6 md:p-8 pt-2 flex justify-between bg-white">
                  <Button 
                    variant="ghost" 
                    onClick={prevStep} 
                    disabled={currentStep === 0}
                    className="text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                  >
                    <ArrowLeft className="mr-2 w-4 h-4" /> Tilbage
                  </Button>
                  <Button 
                    onClick={nextStep} 
                    disabled={answers[currentStep] === undefined}
                    className={`
                      bg-blue-600 hover:bg-blue-700 text-white transition-all
                      ${answers[currentStep] === undefined ? "opacity-50 cursor-not-allowed" : "shadow-lg shadow-blue-600/20"}
                    `}
                  >
                    Næste <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {currentStep === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <Card className="border-0 shadow-2xl overflow-hidden bg-white rounded-2xl">
                <div className="bg-blue-600 p-8 text-white text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
                  <div className="relative z-10">
                    <p className="text-blue-100 font-medium mb-2 uppercase tracking-wider text-sm">Dit resultat</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{getResult().title}</h2>
                    <div className="inline-flex items-center justify-center px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                      Score: {calculateScore()} / 30
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-8 space-y-8">
                  <p className="text-lg text-slate-600 leading-relaxed border-l-4 border-blue-200 pl-4">
                    {getResult().description}
                  </p>

                  <div className="grid gap-4 md:grid-cols-3">
                    {getResult().bullets.map((bullet, idx) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-xl border border-slate-100">
                        <div className="mb-3">
                          {bullet.type === "strength" && <div className="text-green-600 flex items-center gap-2 font-semibold"><CheckCircle2 className="w-5 h-5" /> Styrke</div>}
                          {bullet.type === "risk" && <div className="text-red-500 flex items-center gap-2 font-semibold"><AlertCircle className="w-5 h-5" /> Risiko</div>}
                          {bullet.type === "opportunity" && <div className="text-amber-500 flex items-center gap-2 font-semibold"><TrendingUp className="w-5 h-5" /> Mulighed</div>}
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">{bullet.text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-8 pt-0 flex flex-col items-center space-y-6 bg-white">
                  <p className="text-slate-500 text-sm text-center italic max-w-md">
                    "HR-ON Boarding kan hjælpe jer med at samle onboardingplaner, opgaver og opfølgning ét sted."
                  </p>
                  
                  <Button 
                    onClick={resetQuiz} 
                    variant="outline" 
                    size="lg"
                    className="border-slate-200 hover:bg-slate-50 text-slate-700"
                  >
                    <RefreshCcw className="mr-2 w-4 h-4" /> Start forfra
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
