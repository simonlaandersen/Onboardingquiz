import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConfigSchema } from "@shared/schema";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, "..", "quiz-data.json");

const defaultQuizData = {
  badge_text: "GRATIS VURDERING",
  header_title: "",
  description_text: "Få et konkret billede af jeres HR-onboarding niveau",
  button_text: "Start vurdering",
  stat1_title: "Datadrevet Indsigt",
  stat1_text: "Få konkrete tal på jeres HR-indsats.",
  stat1_emoji: "📊",
  stat2_title: "Medarbejderrejse",
  stat2_text: "Optimér oplevelsen fra dag 1.",
  stat2_emoji: "👥",
  cta_title: "Få styr på jeres onboarding",
  cta_description: "Saml planer, opgaver og opfølgning ét sted med HR-ON Boarding.",
  cta_link: "https://hr-on.com/onboardingplatform/",
  cta_logo_text: "HR-ON",
  color_primary: "#2563eb",
  color_primary_dark: "#1d4ed8",
  header_padding: 8,
  questions: [
    { id: 1, category: "Plan og struktur", text: "Har I en standardiseret plan for de første 30 dage for nye medarbejdere?", options: [{ text: "Ja, for alle relevante stillinger og vi opdaterer den jævnligt.", points: 3 }, { text: "Ja, for de fleste nøglestillinger.", points: 2 }, { text: "Kun for enkelte roller.", points: 1 }, { text: "Nej, det løses fra gang til gang.", points: 0 }] },
    { id: 2, category: "Kultur og værdier", text: "Hvordan introducerer I kultur og værdier i onboardingforløbet?", options: [{ text: "Der er et struktureret forløb med konkrete aktiviteter og eksempler.", points: 3 }, { text: "Der er en præsentation eller et oplæg, men ikke meget mere.", points: 2 }, { text: "Det sker primært uformelt i hverdagen.", points: 1 }, { text: "Vi har ikke en klar tilgang til det.", points: 0 }] },
    { id: 3, category: "Netværk og relationer", text: "Hvordan sikrer I, at nye medarbejdere får opbygget et relevant internt netværk?", options: [{ text: "Vi har planlagte møder med nøglepersoner og tværgående kolleger.", points: 3 }, { text: "Vi introducerer dem til nærmeste team og enkelte nøglepersoner.", points: 2 }, { text: "Det forventes at ske naturligt over tid.", points: 1 }, { text: "Vi har ikke fokus på det.", points: 0 }] },
    { id: 4, category: "Rolle- og ansvarsfordeling", text: "Hvor tydeligt er ansvaret for onboarding fordelt mellem HR, leder og kolleger?", options: [{ text: "Meget tydeligt og dokumenteret.", points: 3 }, { text: "Nogenlunde tydeligt, men ikke formelt beskrevet.", points: 2 }, { text: "Det er primært implicit og afhænger af den enkelte leder.", points: 1 }, { text: "Det er uklart, hvem der har ansvaret.", points: 0 }] },
    { id: 5, category: "Opfølgning og måling", text: "Evaluerer I systematisk, om onboardingforløbet har været en succes?", options: [{ text: "Ja, via faste målinger og samtaler på bestemte tidspunkter.", points: 3 }, { text: "Ja, men mere ad hoc og uregelmæssigt.", points: 2 }, { text: "Kun hvis der opstår problemer.", points: 1 }, { text: "Nej, vi evaluerer ikke struktureret.", points: 0 }] },
    { id: 6, category: "Forberedelse før første dag", text: "Hvor meget er på plads før første arbejdsdag for en ny medarbejder?", options: [{ text: "Udstyr, systemadgang, program og velkomstmateriale er klart.", points: 3 }, { text: "Det meste er klar, men enkelte ting mangler ofte.", points: 2 }, { text: "Noget er klar, men mange ting ordnes først på dagen.", points: 1 }, { text: "Det meste bliver ordnet, efter medarbejderen er startet.", points: 0 }] },
    { id: 7, category: "Digital støtte", text: "Hvordan understøtter I onboarding digitalt i dag?", options: [{ text: "Vi bruger et dedikeret onboardingværktøj med opgaver, planer og opfølgning.", points: 3 }, { text: "Vi bruger HR-system, intranet eller andre værktøjer med simple skabeloner.", points: 2 }, { text: "Vi bruger primært mails, dokumenter og regneark.", points: 1 }, { text: "Der er ingen samlet digital løsning.", points: 0 }] },
    { id: 8, category: "Ledelsesinvolvering", text: "Hvor tydeligt er lederens rolle i onboarding?", options: [{ text: "Lederens rolle er klart defineret med konkrete opgaver og touchpoints.", points: 3 }, { text: "Lederen ved nogenlunde hvad der forventes, men uden fast struktur.", points: 2 }, { text: "Det afhænger meget af den enkelte leder.", points: 1 }, { text: "Der er ingen fælles forventninger til lederens rolle.", points: 0 }] },
    { id: 9, category: "Varighed og helhed", text: "Hvor længe betragter I onboardingforløbet som aktivt?", options: [{ text: "Vi har en tydelig plan der strækker sig mindst 3 måneder.", points: 3 }, { text: "Vi har en plan for 2 til 4 uger.", points: 2 }, { text: "Vi fokuserer mest på første uge.", points: 1 }, { text: "Onboarding er primært første dag.", points: 0 }] },
    { id: 10, category: "Løbende forbedring", text: "Hvordan arbejder I med at forbedre jeres onboarding over tid?", options: [{ text: "Vi bruger data og feedback til at justere programmet løbende.", points: 3 }, { text: "Vi justerer indimellem baseret på oplevelser og enkeltstående input.", points: 2 }, { text: "Vi ændrer kun noget hvis der har været en meget dårlig oplevelse.", points: 1 }, { text: "Onboardingforløbet har stort set været det samme i flere år.", points: 0 }] }
  ],
  results: [
    { min: 0, max: 10, title: "Jeres onboarding er primært ad hoc", description: "Onboarding afhænger i høj grad af den enkelte leder og situation. Nye medarbejdere kan få meget forskellige oplevelser, og vigtige elementer risikerer at blive glemt.", bullets: [{ type: "strength", label: "Styrke", text: "I kan tilpasse jer hurtigt fra gang til gang." }, { type: "risk", label: "Risiko", text: "Uensartet kvalitet og større risiko for dårlige oplevelser." }, { type: "opportunity", label: "Mulighed", text: "Ved at samle onboarding i en enkel struktur kan I hurtigt løfte niveauet." }] },
    { min: 11, max: 18, title: "Jeres onboarding har et grundlæggende fundament", description: "I har flere gode elementer i onboarding, men de er ikke fuldt ud standardiseret og skaleret. Oplevelsen kan stadig variere alt efter rolle og leder.", bullets: [{ type: "strength", label: "Styrke", text: "Nye medarbejdere får typisk en fornuftig start." }, { type: "risk", label: "Risiko", text: "Manglende konsistens og begrænset opfølgning." }, { type: "opportunity", label: "Mulighed", text: "Med en samlet plan og digitale værktøjer kan I skabe en mere ensartet oplevelse." }] },
    { min: 19, max: 24, title: "Jeres onboarding er struktureret", description: "I har et solidt fundament med planer, faste elementer og tydelige roller. De største muligheder ligger i at gøre onboarding mere datadrevet og let at skalere på tværs af organisationen.", bullets: [{ type: "strength", label: "Styrke", text: "Klare rammer og genkendelige forløb." }, { type: "risk", label: "Risiko", text: "Afhængighed af enkelte nøglepersoner og manuelle processer." }, { type: "opportunity", label: "Mulighed", text: "Ved at samle onboarding digitalt kan I spare tid og få bedre overblik." }] },
    { min: 25, max: 30, title: "Jeres onboarding er på et strategisk niveau", description: "Onboarding er integreret i jeres måde at drive forretning og HR på. I arbejder struktureret med forløb, roller og opfølgning og bruger viden til at forbedre oplevelsen løbende.", bullets: [{ type: "strength", label: "Styrke", text: "En stærk, konsistent oplevelse for nye medarbejdere." }, { type: "risk", label: "Risiko", text: "At kompleksitet og vedligeholdelse kan vokse over tid." }, { type: "opportunity", label: "Mulighed", text: "I kan bruge data til at koble onboarding endnu tættere til performance og fastholdelse." }] }
  ]
};

function loadQuizData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading quiz data:", error);
  }
  return defaultQuizData;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Config endpoints
  app.get("/api/config", async (req, res) => {
    const config = await storage.getConfig();
    res.json(config);
  });

  app.post("/api/config", async (req, res) => {
    try {
      const validated = insertConfigSchema.parse(req.body);
      const config = await storage.updateConfig(validated);
      res.json(config);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Quiz endpoints
  app.get("/quiz", (req, res) => {
    try {
      const htmlPath = path.join(__dirname, "..", "original-quiz.html");
      const html = fs.readFileSync(htmlPath, "utf8");
      res.header("Content-Type", "text/html; charset=utf-8");
      res.header("X-Frame-Options", "ALLOWALL");
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      res.header("Pragma", "no-cache");
      res.header("Expires", "0");
      res.send(html);
    } catch (error) {
      res.status(500).send("Quiz not found");
    }
  });

  app.get("/admin", (req, res) => {
    try {
      const htmlPath = path.join(__dirname, "..", "admin-panel.html");
      const html = fs.readFileSync(htmlPath, "utf8");
      res.header("Content-Type", "text/html; charset=utf-8");
      res.header("Cache-Control", "no-cache, no-store, must-revalidate");
      res.send(html);
    } catch (error) {
      res.status(500).send("Admin panel not found");
    }
  });

  app.get("/api/quiz-data", (req, res) => {
    const data = loadQuizData();
    res.json(data);
  });

  app.post("/api/quiz-data", (req, res) => {
    try {
      const data = req.body;
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
