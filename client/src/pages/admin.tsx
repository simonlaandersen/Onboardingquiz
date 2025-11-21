import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";
import { questions as defaultQuestions, results as defaultResults } from "@/data/questions";

export default function AdminPanel() {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      const data = await res.json();
      
      // Initialize with defaults if empty
      if (!data.questionsData || data.questionsData.length === 0) {
        data.questionsData = defaultQuestions;
      }
      if (!data.resultsData || data.resultsData.length === 0) {
        data.resultsData = defaultResults;
      }
      
      setConfig(data);
    } catch (error) {
      console.error("Failed to load config:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryColor: config.primaryColor,
          secondaryColor: config.secondaryColor,
          title: config.title,
          subtitle: config.subtitle,
          description: config.description,
          buttonText: config.buttonText,
          questionsData: config.questionsData,
          resultsData: config.resultsData,
        }),
      });

      if (res.ok) {
        alert("Ændringer gemt!");
        await fetchConfig();
      }
    } catch (error) {
      alert("Fejl ved gemning: " + error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Indlæser...</div>;
  if (!config) return <div className="p-8 text-center">Fejl ved indlæsning af config</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Tilbage til quiz
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4" /> {saving ? "Gemmer..." : "Gem alle ændringer"}
          </Button>
        </motion.div>

        <div className="space-y-8">
          {/* Colors Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold mb-4 text-slate-900">Farver</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Primær farve (Ice Blue)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sekundær farve (Navy)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="w-16 h-10 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={config.secondaryColor}
                    onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                    className="flex-1 px-3 py-2 border rounded text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Text Content Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h2 className="text-xl font-bold mb-4 text-slate-900">Tekst og indhold</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Undertitel</label>
                <input
                  type="text"
                  value={config.subtitle}
                  onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Titel</label>
                <textarea
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Beskrivelse</label>
                <textarea
                  value={config.description}
                  onChange={(e) => setConfig({ ...config, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm h-20"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Knaptekst</label>
                <input
                  type="text"
                  value={config.buttonText}
                  onChange={(e) => setConfig({ ...config, buttonText: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>
            </div>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800"
          >
            <p className
="font-medium mb-2">💡 Tips:</p>
            <p>Når du gemmer ændringer, vil de straks være synlige på quiz-siden. Du kan redigere spørgsmål direkte i `client/src/data/questions.ts`.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
