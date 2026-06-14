export type QuestionCategory =
  | "90s & 2000s Nostalgia"
  | "Disney"
  | "Movies & TV"
  | "Pop Culture & Music"
  | "Two Lies & A Truth"
  | "Bonus Round";

export type QuestionType =
  | "standard"
  | "multiple-choice"
  | "two-lies"
  | "image";

export interface TriviaQuestion {
  id: number;
  category: QuestionCategory;
  type?: QuestionType;
  question: string;
  answer: string;
  acceptableAnswers?: string[];
  points: number;
  /** Shown above question text when type is "image" */
  imageUrl?: string;
  imageAlt?: string;
  /** For "Two Lies & A Truth" — three statements, answer is the true one (A, B, or C) */
  statements?: [string, string, string];
}

export function resolveQuestionType(question: TriviaQuestion): QuestionType {
  if (question.type) return question.type;
  if (question.statements) return "two-lies";
  if (
    question.category === "Disney" ||
    question.category === "Pop Culture & Music"
  ) {
    return "multiple-choice";
  }
  return "standard";
}

export const triviaQuestions: TriviaQuestion[] = [
  // ── 90s & 2000s Nostalgia (10) ──────────────────────────────────────────
  {
    id: 1,
    category: "90s & 2000s Nostalgia",
    type: "image",
    question:
      "What internet service famously mailed free CDs to millions of households?",
    answer: "AOL",
    acceptableAnswers: ["America Online", "A.O.L."],
    points: 100,
    imageUrl: "/images/questions/AOL.png",
    imageAlt: "AOL free trial CD mailer from the 1990s",
  },
  {
    id: 2,
    category: "90s & 2000s Nostalgia",
    type: "image",
    question:
      "What pocket-sized virtual pet fad had kids feeding and cleaning up after a pixel creature on a keychain?",
    answer: "Tamagotchi",
    acceptableAnswers: ["Tamogatchi"],
    points: 100,
    imageUrl: "/images/questions/Tamogatchi.png",
    imageAlt: "Tamagotchi virtual pet keychain toy",
  },
  {
    id: 3,
    category: "90s & 2000s Nostalgia",
    question:
      "What social network let you customize your profile with auto-playing music and a ranked 'Top 8' friends list?",
    answer: "MySpace",
    points: 100,
  },
  {
    id: 4,
    category: "90s & 2000s Nostalgia",
    question:
      "What instant messaging service used buddy lists, away messages, and door-slam sounds on desktop computers?",
    answer: "AIM",
    acceptableAnswers: ["AOL Instant Messenger", "AOL IM"],
    points: 100,
  },
  {
    id: 5,
    category: "90s & 2000s Nostalgia",
    type: "image",
    question:
      "What video rental chain with blue-and-yellow storefronts became synonymous with Friday night movie runs?",
    answer: "Blockbuster",
    points: 100,
    imageUrl: "/images/questions/Blockbuster.png",
    imageAlt: "Blockbuster Video store exterior with blue and yellow signage",
  },
  {
    id: 6,
    category: "90s & 2000s Nostalgia",
    type: "image",
    question:
      "What school book fair catalog arrived in classrooms so kids could order paperbacks, posters, and trinkets?",
    answer: "Scholastic Book Order",
    acceptableAnswers: [
      "Scholastic",
      "Book order",
      "Scholastic book order",
      "Scholastic Book Club",
      "Scholastic book fair",
    ],
    points: 100,
    imageUrl: "/images/questions/Book order.png",
    imageAlt: "Scholastic classroom book order form",
  },
  {
    id: 7,
    category: "90s & 2000s Nostalgia",
    type: "image",
    question:
      "What handheld game device from Nintendo let you swap creatures with a link cable and 'Gotta catch 'em all' became a national obsession?",
    answer: "Game Boy",
    acceptableAnswers: ["Pokemon", "Pokémon", "Game Boy Color"],
    points: 200,
    imageUrl: "/images/questions/Gameboy.png",
    imageAlt: "Nintendo Game Boy handheld console",
  },
  {
    id: 8,
    category: "90s & 2000s Nostalgia",
    type: "image",
    question:
      "What fuzzy animatronic toy spoke its own language and became a must-have holiday craze?",
    answer: "Furby",
    points: 100,
    imageUrl: "/images/questions/Furby.png",
    imageAlt: "Furby interactive toy from the late 1990s",
  },
  {
    id: 9,
    category: "90s & 2000s Nostalgia",
    type: "image",
    question:
      "What pioneer-themed computer game taught kids about dysentery, oxen, and fording rivers?",
    answer: "Oregon Trail",
    acceptableAnswers: ["The Oregon Trail"],
    points: 200,
    imageUrl: "/images/questions/Oregon Trail.png",
    imageAlt: "The Oregon Trail educational computer game",
  },
  {
    id: 10,
    category: "90s & 2000s Nostalgia",
    type: "image",
    question:
      "What home video format used magnetic tape and made 'Be kind, rewind' a household phrase?",
    answer: "VHS",
    acceptableAnswers: ["VHS tape", "VHS tapes", "VCR tape"],
    points: 200,
    imageUrl: "/images/questions/VHS.png",
    imageAlt: "VHS videotape for home movie rentals",
  },

  // ── Disney (10) ─────────────────────────────────────────────────────────
  {
    id: 11,
    category: "Disney",
    question:
      "In The Lion King, what is the name of Simba's wise mandrill mentor?",
    answer: "Rafiki",
    points: 100,
  },
  {
    id: 12,
    category: "Disney",
    question:
      "What Disney princess gives up her voice to Ursula in exchange for legs?",
    answer: "Ariel",
    acceptableAnswers: ["The Little Mermaid"],
    points: 100,
  },
  {
    id: 13,
    category: "Disney",
    question:
      "In Frozen, what is the name of the optimistic snowman who loves warm hugs?",
    answer: "Olaf",
    points: 100,
  },
  {
    id: 14,
    category: "Disney",
    question:
      "What Disney-Pixar film features a rat named Remy who dreams of becoming a chef in Paris?",
    answer: "Ratatouille",
    points: 100,
  },
  {
    id: 15,
    category: "Disney",
    question: "What is the name of Aladdin's loyal pet monkey?",
    answer: "Abu",
    points: 100,
  },
  {
    id: 16,
    category: "Disney",
    question:
      "In Beauty and the Beast, what enchanted candelabra welcomes guests with 'Be our guest'?",
    answer: "Lumière",
    acceptableAnswers: ["Lumiere"],
    points: 200,
  },
  {
    id: 17,
    category: "Disney",
    question:
      "What Disney villain has a memorable song called 'Poor Unfortunate Souls'?",
    answer: "Ursula",
    points: 100,
  },
  {
    id: 18,
    category: "Disney",
    question:
      "In Toy Story, what is the name of the space ranger action figure who doesn't realize he's a toy?",
    answer: "Buzz Lightyear",
    acceptableAnswers: ["Buzz"],
    points: 100,
  },
  {
    id: 19,
    category: "Disney",
    question:
      "What flying baby elephant is teased for his oversized ears before learning they help him soar?",
    answer: "Dumbo",
    points: 100,
  },
  {
    id: 20,
    category: "Disney",
    question:
      "In Mulan, what tiny red dragon sidekick is voiced by Eddie Murphy?",
    answer: "Mushu",
    points: 200,
  },

  // ── Movies & TV (10) ────────────────────────────────────────────────────
  {
    id: 21,
    category: "Movies & TV",
    question:
      "In Home Alone, where is the McCallister family flying for Christmas when they accidentally leave Kevin behind?",
    answer: "Paris",
    acceptableAnswers: ["Paris, France", "France"],
    points: 100,
  },
  {
    id: 22,
    category: "Movies & TV",
    question:
      "What sitcom follows six friends who regularly hang out at Central Perk coffee shop?",
    answer: "Friends",
    points: 100,
  },
  {
    id: 23,
    category: "Movies & TV",
    question:
      "What movie trilogy features a DeLorean time machine and a scientist named Doc Brown?",
    answer: "Back to the Future",
    points: 100,
  },
  {
    id: 24,
    category: "Movies & TV",
    question:
      "In The Office (US), what is the name of the bumbling but lovable regional manager played by Steve Carell?",
    answer: "Michael Scott",
    acceptableAnswers: ["Michael"],
    points: 100,
  },
  {
    id: 25,
    category: "Movies & TV",
    type: "image",
    question:
      "What animated sponge lives in a pineapple under the sea in Bikini Bottom?",
    answer: "SpongeBob SquarePants",
    acceptableAnswers: ["SpongeBob", "Spongebob"],
    points: 100,
    imageUrl: "/images/questions/spongebob.jpg",
    imageAlt: "SpongeBob SquarePants cartoon character",
  },
  {
    id: 26,
    category: "Movies & TV",
    question:
      "In Mean Girls, what day of the week do the Plastics famously wear pink?",
    answer: "Wednesday",
    acceptableAnswers: ["Wednesdays"],
    points: 100,
  },
  {
    id: 27,
    category: "Movies & TV",
    question:
      "What reality competition show drops contestants on a remote island with the motto 'Outwit, Outplay, Outlast'?",
    answer: "Survivor",
    points: 100,
  },
  {
    id: 28,
    category: "Movies & TV",
    question:
      "In The Matrix, which colored pill does Neo take to learn the truth about the world?",
    answer: "Red pill",
    acceptableAnswers: ["Red", "The red pill"],
    points: 100,
  },
  {
    id: 29,
    category: "Movies & TV",
    question:
      "What wizarding school does Harry Potter attend in the film series?",
    answer: "Hogwarts",
    points: 100,
  },
  {
    id: 30,
    category: "Movies & TV",
    question:
      "In Seinfeld, what is the name of Jerry's eccentric neighbor who slides dramatically into Jerry's apartment?",
    answer: "Kramer",
    acceptableAnswers: ["Cosmo Kramer"],
    points: 200,
  },

  // ── Pop Culture & Music (10) ────────────────────────────────────────────
  {
    id: 31,
    category: "Pop Culture & Music",
    question:
      "What boy band sang the hit 'I Want It That Way'?",
    answer: "Backstreet Boys",
    acceptableAnswers: ["BSB", "The Backstreet Boys"],
    points: 100,
  },
  {
    id: 32,
    category: "Pop Culture & Music",
    question:
      "What pop star performed with Justin Timberlake at the Super Bowl in a now-iconic denim-on-denim outfit?",
    answer: "Britney Spears",
    acceptableAnswers: ["Britney"],
    points: 100,
  },
  {
    id: 33,
    category: "Pop Culture & Music",
    question:
      "What rapper's real name is Marshall Mathers?",
    answer: "Eminem",
    acceptableAnswers: ["Slim Shady"],
    points: 100,
  },
  {
    id: 34,
    category: "Pop Culture & Music",
    question:
      "What R&B girl group sang 'No Scrubs' and 'Waterfalls'?",
    answer: "TLC",
    points: 100,
  },
  {
    id: 35,
    category: "Pop Culture & Music",
    question:
      "What dance craze had everyone at weddings sliding their hands down an invisible wall and crossing their arms?",
    answer: "The Macarena",
    acceptableAnswers: ["Macarena"],
    points: 100,
  },
  {
    id: 36,
    category: "Pop Culture & Music",
    question:
      "What grunge band from Seattle sang 'Smells Like Teen Spirit'?",
    answer: "Nirvana",
    points: 100,
  },
  {
    id: 37,
    category: "Pop Culture & Music",
    question:
      "What MTV show took cameras inside celebrities' mansions to show off their cars, pools, and walk-in closets?",
    answer: "MTV Cribs",
    acceptableAnswers: ["Cribs"],
    points: 200,
  },
  {
    id: 38,
    category: "Pop Culture & Music",
    question:
      "What artist had massive hits with 'Umbrella,' 'We Found Love,' and 'Diamonds'?",
    answer: "Rihanna",
    points: 100,
  },
  {
    id: 39,
    category: "Pop Culture & Music",
    question:
      "What one-hit wonder rapper opened with 'Stop, collaborate and listen' on 'Ice Ice Baby'?",
    answer: "Vanilla Ice",
    acceptableAnswers: ["Rob Van Winkle"],
    points: 200,
  },
  {
    id: 40,
    category: "Pop Culture & Music",
    question:
      "What late-night segment had celebrities lip-syncing in a car, often going viral on YouTube?",
    answer: "Carpool Karaoke",
    acceptableAnswers: ["James Corden Carpool Karaoke"],
    points: 200,
  },

  // ── Two Lies & A Truth (5) ───────────────────────────────────────────────
  {
    id: 41,
    category: "Two Lies & A Truth",
    question:
      "Two of these are LIES. One is the TRUTH. Which statement is TRUE?",
    statements: [
      "In Titanic, Jack and Rose both survive and move to New York together.",
      "Rose drops the Heart of the Ocean necklace into the ocean at the end of the film.",
      "The Titanic sinks because it collides with a whale, not an iceberg.",
    ],
    answer: "B",
    acceptableAnswers: [
      "Rose drops the Heart of the Ocean necklace into the ocean at the end of the film.",
      "Statement B",
      "The second one",
    ],
    points: 300,
  },
  {
    id: 42,
    category: "Two Lies & A Truth",
    question:
      "Two of these are LIES. One is the TRUTH. Which statement is TRUE?",
    statements: [
      "Many iPod models used a click wheel to scroll through songs.",
      "The original iPod could only play songs downloaded illegally from Napster.",
      "The iPod Shuffle was famous for having the largest screen of any iPod.",
    ],
    answer: "A",
    acceptableAnswers: [
      "Many iPod models used a click wheel to scroll through songs.",
      "Statement A",
      "The first one",
    ],
    points: 300,
  },
  {
    id: 43,
    category: "Two Lies & A Truth",
    question:
      "Two of these are LIES. One is the TRUTH. Which statement is TRUE?",
    statements: [
      "In The Office (US), Michael Scott once burned his foot on a George Foreman grill while cooking bacon in bed.",
      "Dwight Schrute is secretly a vampire who only works nights.",
      "Dunder Mifflin is a paper company located in downtown Manhattan.",
    ],
    answer: "A",
    acceptableAnswers: [
      "In The Office (US), Michael Scott once burned his foot on a George Foreman grill while cooking bacon in bed.",
      "Statement A",
      "The first one",
    ],
    points: 300,
  },
  {
    id: 44,
    category: "Two Lies & A Truth",
    question:
      "Two of these are LIES. One is the TRUTH. Which statement is TRUE?",
    statements: [
      "Dunkaroos were cookies you dipped into frosting — and kids went wild for them.",
      "Gushers were so mild that nobody ever argued about the flavor burst.",
      "Lunchables originally came with a full hot meal and a tiny microwave.",
    ],
    answer: "A",
    acceptableAnswers: [
      "Dunkaroos were cookies you dipped into frosting — and kids went wild for them.",
      "Statement A",
      "The first one",
    ],
    points: 300,
  },
  {
    id: 45,
    category: "Two Lies & A Truth",
    question:
      "Two of these are LIES. One is the TRUTH. Which statement is TRUE?",
    statements: [
      "Costco's famous hot dog and soda combo has famously stayed cheap for decades.",
      "IKEA instructions never include extra screws — every piece is always used.",
      "Amazon Prime originally launched with free same-hour drone delivery only.",
    ],
    answer: "A",
    acceptableAnswers: [
      "Costco's famous hot dog and soda combo has famously stayed cheap for decades.",
      "Statement A",
      "The first one",
    ],
    points: 300,
  },

  // ── Bonus Round (5) ───────────────────────────────────────────────────────
  {
    id: 46,
    category: "Bonus Round",
    question:
      "In what courtroom drama does Jack Nicholson yell 'You can't handle the truth!'?",
    answer: "A Few Good Men",
    points: 500,
  },
  {
    id: 47,
    category: "Bonus Round",
    type: "image",
    question:
      "What Nintendo console brought us Mario Kart 64, GoldenEye 007, and four-controller multiplayer parties?",
    answer: "Nintendo 64",
    acceptableAnswers: ["N64", "N64 console"],
    points: 500,
    imageUrl: "/images/questions/N64.png",
    imageAlt: "Nintendo 64 console with controller",
  },
  {
    id: 48,
    category: "Bonus Round",
    question:
      "What band sang 'Mr. Brightside,' one of the most streamed rock songs of all time?",
    answer: "The Killers",
    acceptableAnswers: ["Killers"],
    points: 500,
  },
  {
    id: 49,
    category: "Bonus Round",
    question:
      "Before GPS lived on every phone, what kind of device did people suction-cup to their windshield and argue with when it said 'Recalculating'?",
    answer: "GPS",
    acceptableAnswers: ["Garmin", "TomTom", "GPS device", "Standalone GPS"],
    points: 500,
  },
  {
    id: 50,
    category: "Bonus Round",
    question:
      "What athletic brand's famous slogan is 'Just Do It'?",
    answer: "Nike",
    points: 500,
  },
];

export const questionsByCategory = triviaQuestions.reduce(
  (acc, q) => {
    if (!acc[q.category]) acc[q.category] = [];
    acc[q.category].push(q);
    return acc;
  },
  {} as Record<QuestionCategory, TriviaQuestion[]>,
);

export const categoryOrder: QuestionCategory[] = [
  "90s & 2000s Nostalgia",
  "Disney",
  "Movies & TV",
  "Pop Culture & Music",
  "Two Lies & A Truth",
  "Bonus Round",
];

export const totalQuestions = triviaQuestions.length;

export const totalPossiblePoints = triviaQuestions.reduce(
  (sum, q) => sum + q.points,
  0,
);
