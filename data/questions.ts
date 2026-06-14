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
  /** Predefined multiple-choice options (used as-is when provided) */
  choices?: string[];
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
    question:
      "What internet service famously mailed free CDs to millions of households?",
    answer: "AOL",
    acceptableAnswers: ["America Online", "A.O.L."],
    points: 100,
  },
  {
    id: 2,
    category: "90s & 2000s Nostalgia",
    question:
      "What pocket-sized virtual pet fad had kids feeding and cleaning up after a pixel creature on a keychain?",
    answer: "Tamagotchi",
    acceptableAnswers: ["Tamogatchi"],
    points: 100,
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
    question:
      "What video rental chain with blue-and-yellow storefronts became synonymous with Friday night movie runs?",
    answer: "Blockbuster",
    points: 100,
  },
  {
    id: 6,
    category: "90s & 2000s Nostalgia",
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
  },
  {
    id: 7,
    category: "90s & 2000s Nostalgia",
    question:
      "What handheld game device from Nintendo let you swap creatures with a link cable and 'Gotta catch 'em all' became a national obsession?",
    answer: "Game Boy",
    acceptableAnswers: ["Pokemon", "Pokémon", "Game Boy Color"],
    points: 200,
  },
  {
    id: 8,
    category: "90s & 2000s Nostalgia",
    question:
      "What fuzzy animatronic toy spoke its own language and became a must-have holiday craze?",
    answer: "Furby",
    points: 100,
  },
  {
    id: 9,
    category: "90s & 2000s Nostalgia",
    question:
      "What pioneer-themed computer game taught kids about dysentery, oxen, and fording rivers?",
    answer: "Oregon Trail",
    acceptableAnswers: ["The Oregon Trail"],
    points: 200,
  },
  {
    id: 10,
    category: "90s & 2000s Nostalgia",
    question:
      "What home video format used magnetic tape and made 'Be kind, rewind' a household phrase?",
    answer: "VHS",
    acceptableAnswers: ["VHS tape", "VHS tapes", "VCR tape"],
    points: 200,
  },

  // ── Disney (10) ─────────────────────────────────────────────────────────
  {
    id: 11,
    category: "Disney",
    question:
      "In The Lion King, what carefree phrase do Timon and Pumbaa teach Simba to stop worrying?",
    answer: "Hakuna Matata",
    acceptableAnswers: ["Hakuna matata", "No worries"],
    points: 100,
    choices: [
      "Circle of Life",
      "Hakuna Matata",
      "Can You Feel the Love Tonight",
      "Be Prepared",
    ],
  },
  {
    id: 12,
    category: "Disney",
    question:
      "Which Disney heroine sings about wanting to be 'part of your world' from her underwater treasure grotto?",
    answer: "Ariel",
    acceptableAnswers: ["The Little Mermaid"],
    points: 100,
    choices: ["Belle", "Ariel", "Moana", "Rapunzel"],
  },
  {
    id: 13,
    category: "Disney",
    question:
      "In Frozen, what power ballad does Elsa belt out while building her ice palace?",
    answer: "Let It Go",
    acceptableAnswers: ["Let it go"],
    points: 100,
    choices: [
      "Do You Want to Build a Snowman?",
      "For the First Time in Forever",
      "Let It Go",
      "Love Is an Open Door",
    ],
  },
  {
    id: 14,
    category: "Disney",
    question:
      "What Pixar movie made adults openly cry within the first ten minutes of the opening montage?",
    answer: "Up",
    points: 100,
    choices: ["Wall-E", "Inside Out", "Up", "Toy Story 3"],
  },
  {
    id: 15,
    category: "Disney",
    question:
      "In Aladdin, during 'Friend Like Me,' Genie briefly transforms into a celebrity talk-show host — who?",
    answer: "Arsenio Hall",
    acceptableAnswers: ["Arsenio"],
    points: 100,
    choices: ["Oprah Winfrey", "Jay Leno", "Arsenio Hall", "David Letterman"],
  },
  {
    id: 16,
    category: "Disney",
    question:
      "In Beauty and the Beast, what household object is Lumière?",
    answer: "Candelabra",
    acceptableAnswers: ["A candlestick", "Candlestick"],
    points: 200,
    choices: ["Wardrobe", "Candelabra", "Teapot", "Feather duster"],
  },
  {
    id: 17,
    category: "Disney",
    question:
      "In The Little Mermaid, what does Ariel give up so she can walk on land?",
    answer: "Her voice",
    acceptableAnswers: ["Ariel's voice", "Her singing voice", "Voice"],
    points: 100,
    choices: ["Her crown", "Her tail", "Her voice", "Her collection"],
  },
  {
    id: 18,
    category: "Disney",
    question:
      "In Toy Story, what's Buzz Lightyear's signature catchphrase when he thinks he's really flying?",
    answer: "To infinity and beyond",
    acceptableAnswers: ["To infinity and beyond!"],
    points: 100,
    choices: [
      "Reach for the sky",
      "To infinity and beyond",
      "You're a toy!",
      "Buzz off",
    ],
  },
  {
    id: 19,
    category: "Disney",
    question:
      "What Disney movie opens with a dramatic sunrise over the Pride Lands?",
    answer: "The Lion King",
    acceptableAnswers: ["Lion King"],
    points: 100,
    choices: ["Bambi", "Tarzan", "The Lion King", "The Jungle Book"],
  },
  {
    id: 20,
    category: "Disney",
    question:
      "Which Disney movie sends its heroine to boot camp to the tune of 'I'll Make a Man Out of You'?",
    answer: "Mulan",
    points: 200,
    choices: ["Pocahontas", "Brave", "Mulan", "Moana"],
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
      "In Friends, what unusual pet did Ross briefly keep in his apartment — causing chaos for the whole group?",
    answer: "Marcel",
    acceptableAnswers: ["A monkey", "The monkey"],
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
      "In The Office, Michael Scott organizes a charity fun run — what disease is he hilariously trying to raise awareness for?",
    answer: "Rabies",
    points: 100,
  },
  {
    id: 25,
    category: "Movies & TV",
    question:
      "In SpongeBob SquarePants, what fast-food restaurant does SpongeBob proudly flip patties at?",
    answer: "The Krusty Krab",
    acceptableAnswers: ["Krusty Krab"],
    points: 100,
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
      "In Harry Potter, what hidden platform at King's Cross do students use to catch the Hogwarts Express?",
    answer: "Platform 9 and 3/4",
    acceptableAnswers: [
      "Platform 9 3/4",
      "Platform nine and three quarters",
      "9 and 3/4",
    ],
    points: 100,
  },
  {
    id: 30,
    category: "Movies & TV",
    question:
      "In Seinfeld, what made-up holiday does George's dad invent with feats of strength and an airing of grievances?",
    answer: "Festivus",
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
    choices: ["*NSYNC", "98 Degrees", "Backstreet Boys", "New Kids on the Block"],
  },
  {
    id: 32,
    category: "Pop Culture & Music",
    question:
      "What pop star performed with Justin Timberlake at the Super Bowl in a now-iconic denim-on-denim outfit?",
    answer: "Britney Spears",
    acceptableAnswers: ["Britney"],
    points: 100,
    choices: ["Christina Aguilera", "Pink", "Britney Spears", "Shakira"],
  },
  {
    id: 33,
    category: "Pop Culture & Music",
    question:
      "Before Spotify, what peer-to-peer service had college kids downloading songs one track at a time — and nervously watching for lawsuits?",
    answer: "Napster",
    points: 100,
    choices: ["Limewire", "Kazaa", "Napster", "iTunes"],
  },
  {
    id: 34,
    category: "Pop Culture & Music",
    question:
      "What R&B girl group sang 'No Scrubs' and 'Waterfalls'?",
    answer: "TLC",
    points: 100,
    choices: ["Destiny's Child", "En Vogue", "TLC", "SWV"],
  },
  {
    id: 35,
    category: "Pop Culture & Music",
    question:
      "What dance craze had everyone at weddings sliding their hands down an invisible wall and crossing their arms?",
    answer: "The Macarena",
    acceptableAnswers: ["Macarena"],
    points: 100,
    choices: [
      "The Cha-Cha Slide",
      "The Electric Slide",
      "The Macarena",
      "The Hokey Pokey",
    ],
  },
  {
    id: 36,
    category: "Pop Culture & Music",
    question:
      "What grunge band from Seattle sang 'Smells Like Teen Spirit'?",
    answer: "Nirvana",
    points: 100,
    choices: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"],
  },
  {
    id: 37,
    category: "Pop Culture & Music",
    question:
      "What MTV show took cameras inside celebrities' mansions to show off their cars, pools, and walk-in closets?",
    answer: "MTV Cribs",
    acceptableAnswers: ["Cribs"],
    points: 200,
    choices: ["Pimp My Ride", "Room Raiders", "MTV Cribs", "TRL"],
  },
  {
    id: 38,
    category: "Pop Culture & Music",
    question:
      "What artist had massive hits with 'Umbrella,' 'We Found Love,' and 'Diamonds'?",
    answer: "Rihanna",
    points: 100,
    choices: ["Beyoncé", "Lady Gaga", "Rihanna", "Katy Perry"],
  },
  {
    id: 39,
    category: "Pop Culture & Music",
    question:
      "What one-hit wonder rapper opened with 'Stop, collaborate and listen' on 'Ice Ice Baby'?",
    answer: "Vanilla Ice",
    acceptableAnswers: ["Rob Van Winkle"],
    points: 200,
    choices: ["MC Hammer", "Sir Mix-A-Lot", "Vanilla Ice", "Snow"],
  },
  {
    id: 40,
    category: "Pop Culture & Music",
    question:
      "What late-night segment had celebrities lip-syncing in a car, often going viral on YouTube?",
    answer: "Carpool Karaoke",
    acceptableAnswers: ["James Corden Carpool Karaoke"],
    points: 200,
    choices: [
      "Lip Sync Battle",
      "Sing Along with Mic",
      "Carpool Karaoke",
      "Karaoke Cab",
    ],
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
    question:
      "What Nintendo console brought us Mario Kart 64, GoldenEye 007, and four-controller multiplayer parties?",
    answer: "Nintendo 64",
    acceptableAnswers: ["N64", "N64 console"],
    points: 500,
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
      "What blockbuster made us all think twice about going in the ocean — with a two-note theme everyone still hums?",
    answer: "Jaws",
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
