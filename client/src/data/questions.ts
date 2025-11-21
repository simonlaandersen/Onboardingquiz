export interface Question {
  id: number;
  category: string;
  text: string;
  options: {
    text: string;
    points: number;
    label: string; // A, B, C, D
  }[];
}

export const questions: Question[] = [
  {
    id: 1,
    category: "Plan og struktur",
    text: "Har I en standardiseret plan for de første 30 dage for nye medarbejdere?",
    options: [
      { label: "A", text: "Ja, for alle relevante stillinger og vi opdaterer den jævnligt.", points: 3 },
      { label: "B", text: "Ja, for de fleste nøglestillinger.", points: 2 },
      { label: "C", text: "Kun for enkelte roller.", points: 1 },
      { label: "D", text: "Nej, det løses fra gang til gang.", points: 0 },
    ],
  },
  {
    id: 2,
    category: "Kultur og værdier",
    text: "Hvordan introducerer I kultur og værdier i onboardingforløbet?",
    options: [
      { label: "A", text: "Der er et struktureret forløb med konkrete aktiviteter og eksempler.", points: 3 },
      { label: "B", text: "Der er en præsentation eller et oplæg, men ikke meget mere.", points: 2 },
      { label: "C", text: "Det sker primært uformelt i hverdagen.", points: 1 },
      { label: "D", text: "Vi har ikke en klar tilgang til det.", points: 0 },
    ],
  },
  {
    id: 3,
    category: "Netværk og relationer",
    text: "Hvordan sikrer I, at nye medarbejdere får opbygget et relevant internt netværk?",
    options: [
      { label: "A", text: "Vi har planlagte møder med nøglepersoner og tværgående kolleger.", points: 3 },
      { label: "B", text: "Vi introducerer dem til nærmeste team og enkelte nøglepersoner.", points: 2 },
      { label: "C", text: "Det forventes at ske naturligt over tid.", points: 1 },
      { label: "D", text: "Vi har ikke fokus på det.", points: 0 },
    ],
  },
  {
    id: 4,
    category: "Rolle- og ansvarsfordeling",
    text: "Hvor tydeligt er ansvaret for onboarding fordelt mellem HR, leder og kolleger?",
    options: [
      { label: "A", text: "Meget tydeligt og dokumenteret.", points: 3 },
      { label: "B", text: "Nogenlunde tydeligt, men ikke formelt beskrevet.", points: 2 },
      { label: "C", text: "Det er primært implicit og afhænger af den enkelte leder.", points: 1 },
      { label: "D", text: "Det er uklart, hvem der har ansvaret.", points: 0 },
    ],
  },
  {
    id: 5,
    category: "Opfølgning og måling",
    text: "Evaluerer I systematisk, om onboardingforløbet har været en succes?",
    options: [
      { label: "A", text: "Ja, via faste målinger og samtaler på bestemte tidspunkter.", points: 3 },
      { label: "B", text: "Ja, men mere ad hoc og uregelmæssigt.", points: 2 },
      { label: "C", text: "Kun hvis der opstår problemer.", points: 1 },
      { label: "D", text: "Nej, vi evaluerer ikke struktureret.", points: 0 },
    ],
  },
  {
    id: 6,
    category: "Forberedelse før første dag",
    text: "Hvor meget er på plads før første arbejdsdag for en ny medarbejder?",
    options: [
      { label: "A", text: "Udstyr, systemadgang, program og velkomstmateriale er klart.", points: 3 },
      { label: "B", text: "Det meste er klar, men enkelte ting mangler ofte.", points: 2 },
      { label: "C", text: "Noget er klar, men mange ting ordnes først på dagen.", points: 1 },
      { label: "D", text: "Det meste bliver ordnet, efter medarbejderen er startet.", points: 0 },
    ],
  },
  {
    id: 7,
    category: "Digital støtte",
    text: "Hvordan understøtter I onboarding digitalt i dag?",
    options: [
      { label: "A", text: "Vi bruger et dedikeret onboardingværktøj med opgaver, planer og opfølgning.", points: 3 },
      { label: "B", text: "Vi bruger HR-system, intranet eller andre værktøjer med simple skabeloner.", points: 2 },
      { label: "C", text: "Vi bruger primært mails, dokumenter og regneark.", points: 1 },
      { label: "D", text: "Der er ingen samlet digital løsning.", points: 0 },
    ],
  },
  {
    id: 8,
    category: "Ledelsesinvolvering",
    text: "Hvor tydeligt er lederens rolle i onboarding?",
    options: [
      { label: "A", text: "Lederens rolle er klart defineret med konkrete opgaver og touchpoints.", points: 3 },
      { label: "B", text: "Lederen ved nogenlunde hvad der forventes, men uden fast struktur.", points: 2 },
      { label: "C", text: "Det afhænger meget af den enkelte leder.", points: 1 },
      { label: "D", text: "Der er ingen fælles forventninger til lederens rolle.", points: 0 },
    ],
  },
  {
    id: 9,
    category: "Varighed og helhed",
    text: "Hvor længe betragter I onboardingforløbet som aktivt?",
    options: [
      { label: "A", text: "Vi har en tydelig plan der strækker sig mindst 3 måneder.", points: 3 },
      { label: "B", text: "Vi har en plan for 2 til 4 uger.", points: 2 },
      { label: "C", text: "Vi fokuserer mest på første uge.", points: 1 },
      { label: "D", text: "Onboarding er primært første dag.", points: 0 },
    ],
  },
  {
    id: 10,
    category: "Løbende forbedring",
    text: "Hvordan arbejder I med at forbedre jeres onboarding over tid?",
    options: [
      { label: "A", text: "Vi bruger data og feedback til at justere programmet løbende.", points: 3 },
      { label: "B", text: "Vi justerer indimellem baseret på oplevelser og enkeltstående input.", points: 2 },
      { label: "C", text: "Vi ændrer kun noget hvis der har været en meget dårlig oplevelse.", points: 1 },
      { label: "D", text: "Onboardingforløbet har stort set været det samme i flere år.", points: 0 },
    ],
  },
];

export interface ResultLevel {
  min: number;
  max: number;
  title: string;
  description: string;
  bullets: {
    type: "strength" | "risk" | "opportunity";
    text: string;
  }[];
}

export const results: ResultLevel[] = [
  {
    min: 0,
    max: 10,
    title: "Jeres onboarding er primært ad hoc",
    description: "Onboarding afhænger i høj grad af den enkelte leder og situation. Nye medarbejdere kan få meget forskellige oplevelser, og vigtige elementer risikerer at blive glemt.",
    bullets: [
      { type: "strength", text: "I kan tilpasse jer hurtigt fra gang til gang." },
      { type: "risk", text: "Uensartet kvalitet og større risiko for dårlige oplevelser." },
      { type: "opportunity", text: "Ved at samle onboarding i en enkel struktur kan I hurtigt løfte niveauet." },
    ]
  },
  {
    min: 11,
    max: 18,
    title: "Jeres onboarding har et grundlæggende fundament",
    description: "I har flere gode elementer i onboarding, men de er ikke fuldt ud standardiseret og skaleret. Oplevelsen kan stadig variere alt efter rolle og leder.",
    bullets: [
      { type: "strength", text: "Nye medarbejdere får typisk en fornuftig start." },
      { type: "risk", text: "Manglende konsistens og begrænset opfølgning." },
      { type: "opportunity", text: "Med en samlet plan og digitale værktøjer kan I skabe en mere ensartet oplevelse." },
    ]
  },
  {
    min: 19,
    max: 24,
    title: "Jeres onboarding er struktureret",
    description: "I har et solidt fundament med planer, faste elementer og tydelige roller. De største muligheder ligger i at gøre onboarding mere datadrevet og let at skalere på tværs af organisationen.",
    bullets: [
      { type: "strength", text: "Klare rammer og genkendelige forløb." },
      { type: "risk", text: "Afhængighed af enkelte nøglepersoner og manuelle processer." },
      { type: "opportunity", text: "Ved at samle onboarding digitalt kan I spare tid og få bedre overblik." },
    ]
  },
  {
    min: 25,
    max: 30,
    title: "Jeres onboarding er på et strategisk niveau",
    description: "Onboarding er integreret i jeres måde at drive forretning og HR på. I arbejder struktureret med forløb, roller og opfølgning og bruger viden til at forbedre oplevelsen løbende.",
    bullets: [
      { type: "strength", text: "En stærk, konsistent oplevelse for nye medarbejdere." },
      { type: "risk", text: "At kompleksitet og vedligeholdelse kan vokse over tid." },
      { type: "opportunity", text: "I kan bruge data til at koble onboarding endnu tættere til performance og fastholdelse." },
    ]
  }
];
