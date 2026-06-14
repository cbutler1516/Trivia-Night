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
      "Your mailbox overflowed with free trial discs promising hundreds of hours online — what internet service turned those CDs into a national punchline?",
    answer: "AOL",
    acceptableAnswers: ["America Online", "A.O.L."],
    points: 100,
  },
  {
    id: 2,
    category: "90s & 2000s Nostalgia",
    question:
      "What pocket-sized digital pet lived on a keychain and quietly died if you forgot to feed it during math class?",
    answer: "Tamagotchi",
    acceptableAnswers: ["Tamogatchi"],
    points: 100,
  },
  {
    id: 3,
    category: "90s & 2000s Nostalgia",
    question:
      "Which early social network turned friendship into drama with a ranked Top 8 and auto-playing profile songs?",
    answer: "MySpace",
    points: 100,
  },
  {
    id: 4,
    category: "90s & 2000s Nostalgia",
    question:
      "Which desktop messenger had you crafting witty away messages, juggling buddy lists, and hearing a door slam when friends signed off?",
    answer: "AIM",
    acceptableAnswers: ["AOL Instant Messenger", "AOL IM"],
    points: 100,
  },
  {
    id: 5,
    category: "90s & 2000s Nostalgia",
    question:
      "Before streaming killed date night, what blue-and-yellow rental chain meant a Friday trip down the new-releases wall?",
    answer: "Blockbuster",
    points: 100,
  },
  {
    id: 6,
    category: "90s & 2000s Nostalgia",
    question:
      "What classroom catalog had kids circling Goosebumps paperbacks and erasers, then handing a check to their teacher?",
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
      "Which Nintendo handheld had you trading creatures through a link cable until 'Gotta catch 'em all' took over every recess?",
    answer: "Game Boy",
    acceptableAnswers: ["Pokemon", "Pokémon", "Game Boy Color"],
    points: 200,
  },
  {
    id: 8,
    category: "90s & 2000s Nostalgia",
    question:
      "What fuzzy holiday craze babbled in its own language, blinked at you from the shelf, and demanded to be fed?",
    answer: "Furby",
    points: 100,
  },
  {
    id: 9,
    category: "90s & 2000s Nostalgia",
    question:
      "Which computer lab classic had you losing oxen, fording rivers, and dying of dysentery on the way west?",
    answer: "Oregon Trail",
    acceptableAnswers: ["The Oregon Trail"],
    points: 200,
  },
  {
    id: 10,
    category: "90s & 2000s Nostalgia",
    question:
      "What home video format came with magnetic tape, a clunky player, and rental stickers reminding you to 'Be kind, rewind'?",
    answer: "VHS",
    acceptableAnswers: ["VHS tape", "VHS tapes", "VCR tape"],
    points: 200,
  },

  // ── Disney (10) ─────────────────────────────────────────────────────────
  {
    id: 11,
    category: "Disney",
    question:
      "Before reservation apps and influencer brunches, park insiders whispered about an invitation-only dining club hidden above New Orleans Square at Disneyland — what's it called?",
    answer: "Club 33",
    points: 100,
    choices: ["Club 33", "Blue Bayou", "Carnation Cafe", "The Golden Horseshoe"],
  },
  {
    id: 12,
    category: "Disney",
    question:
      "Disneyland's snow-capped peak wasn't just set dressing — it became the world's first tubular steel roller coaster when it opened. Name the ride.",
    answer: "Matterhorn Bobsleds",
    acceptableAnswers: ["The Matterhorn", "Matterhorn"],
    points: 100,
    choices: [
      "Space Mountain",
      "Matterhorn Bobsleds",
      "Big Thunder Mountain",
      "Splash Mountain",
    ],
  },
  {
    id: 13,
    category: "Disney",
    question:
      "In the Haunted Mansion séance scene, whose disembodied head floats inside the crystal ball while spirits swirl around the room?",
    answer: "Madame Leota",
    acceptableAnswers: ["Leota"],
    points: 100,
    choices: ["Madame Leota", "Constance Hatchaway", "Ezra", "Gus"],
  },
  {
    id: 14,
    category: "Disney",
    question:
      "In the Pirates of the Caribbean queue, jailed buccaneers spend eternity trying to coax a dog to bring them what?",
    answer: "Keys",
    acceptableAnswers: ["The keys", "Jail keys"],
    points: 100,
    choices: ["Keys", "Gold coins", "A treasure map", "A chicken leg"],
  },
  {
    id: 15,
    category: "Disney",
    question:
      "Before every ride was a blockbuster franchise, which tropical bird show at Disneyland helped pioneer audio-animatronics in the early 1960s?",
    answer: "Enchanted Tiki Room",
    acceptableAnswers: ["Walt Disney's Enchanted Tiki Room", "Tiki Room"],
    points: 100,
    choices: [
      "Enchanted Tiki Room",
      "Country Bear Jamboree",
      "Hall of Presidents",
      "Carousel of Progress",
    ],
  },
  {
    id: 16,
    category: "Disney",
    question:
      "Disney park magic is not built by elves — what is the official name of the team of Imagineers, artists, and engineers behind the attractions?",
    answer: "Imagineering",
    acceptableAnswers: ["Walt Disney Imagineering", "Disney Imagineering"],
    points: 200,
    choices: [
      "Imagineering",
      "WED Enterprises",
      "Disney Creative",
      "Pixar Animation",
    ],
  },
  {
    id: 17,
    category: "Disney",
    question:
      "Park veterans love spotting a subtle design Easter egg — three circles arranged like Mickey's silhouette. What is it called?",
    answer: "Hidden Mickey",
    acceptableAnswers: ["A Hidden Mickey", "Hidden Mickeys"],
    points: 100,
    choices: ["Hidden Mickey", "Pixie Dust", "Disney Vault", "Magic Band"],
  },
  {
    id: 18,
    category: "Disney",
    question:
      "Inside EPCOT's giant geodesic sphere, what slow-moving ride traces the story of human communication across history?",
    answer: "Spaceship Earth",
    points: 100,
    choices: [
      "Spaceship Earth",
      "Mission: SPACE",
      "Soarin'",
      "Living with the Land",
    ],
  },
  {
    id: 19,
    category: "Disney",
    question:
      "At Hollywood Studios, what haunted hotel elevator drop ride sends you plunging into the Twilight Zone?",
    answer: "Tower of Terror",
    acceptableAnswers: [
      "The Twilight Zone Tower of Terror",
      "Hollywood Tower Hotel",
    ],
    points: 100,
    choices: [
      "Tower of Terror",
      "Haunted Mansion",
      "Rock 'n' Roller Coaster",
      "Expedition Everest",
    ],
  },
  {
    id: 20,
    category: "Disney",
    question:
      "On Main Street, U.S.A. at Disneyland, a lamp stays perpetually lit in an upstairs window — a quiet tribute to which Disney legend?",
    answer: "Walt Disney",
    acceptableAnswers: ["Walt"],
    points: 200,
    choices: ["Walt Disney", "Roy Disney", "Ub Iwerks", "Mickey Mouse"],
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
      "At every late-'90s school dance, couples argued over lyrics that might not even make sense — which boy band gave us 'I Want It That Way'?",
    answer: "Backstreet Boys",
    acceptableAnswers: ["BSB", "The Backstreet Boys"],
    points: 100,
    choices: ["*NSYNC", "98 Degrees", "Backstreet Boys", "New Kids on the Block"],
  },
  {
    id: 32,
    category: "Pop Culture & Music",
    question:
      "Which pop star stepped onto the 2001 American Music Awards red carpet in head-to-toe denim — perfectly matching Justin Timberlake and launching an eternal meme?",
    answer: "Britney Spears",
    acceptableAnswers: ["Britney"],
    points: 100,
    choices: ["Christina Aguilera", "Pink", "Britney Spears", "Shakira"],
  },
  {
    id: 33,
    category: "Pop Culture & Music",
    question:
      "Before Spotify rewired how we listen, what file-sharing service had college kids trading MP3s in dorm rooms — while record labels scrambled to sue?",
    answer: "Napster",
    points: 100,
    choices: ["Limewire", "Kazaa", "Napster", "iTunes"],
  },
  {
    id: 34,
    category: "Pop Culture & Music",
    question:
      "Which R&B trio turned dating standards into late-'90s anthems — telling us what they didn't want in a man and warning us not to chase 'Waterfalls'?",
    answer: "TLC",
    points: 100,
    choices: ["Destiny's Child", "En Vogue", "TLC", "SWV"],
  },
  {
    id: 35,
    category: "Pop Culture & Music",
    question:
      "Which wedding-reception dance had entire tables sliding their hands down an invisible wall and hopping in sync — whether they volunteered or not?",
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
      "Which Seattle grunge band's breakthrough hit — opening with that instantly recognizable riff — helped flip MTV from hair metal to flannel overnight?",
    answer: "Nirvana",
    points: 100,
    choices: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"],
  },
  {
    id: 37,
    category: "Pop Culture & Music",
    question:
      "Before Instagram Stories, what MTV series invited us into celebrity mansions to judge their pool slides, sneaker walls, and fridge contents?",
    answer: "MTV Cribs",
    acceptableAnswers: ["Cribs"],
    points: 200,
    choices: ["Pimp My Ride", "Room Raiders", "MTV Cribs", "TRL"],
  },
  {
    id: 38,
    category: "Pop Culture & Music",
    question:
      "Which artist had us spelling out 'ella, ella, eh, eh, eh' under umbrellas — and later owning the charts with 'We Found Love' and 'Diamonds'?",
    answer: "Rihanna",
    points: 100,
    choices: ["Beyoncé", "Lady Gaga", "Rihanna", "Katy Perry"],
  },
  {
    id: 39,
    category: "Pop Culture & Music",
    question:
      "Which rapper borrowed Queen and David Bowie's bass line, blew up in the early '90s with 'Ice Ice Baby,' and briefly became a pop-culture punchline?",
    answer: "Vanilla Ice",
    acceptableAnswers: ["Rob Van Winkle"],
    points: 200,
    choices: ["MC Hammer", "Sir Mix-A-Lot", "Vanilla Ice", "Snow"],
  },
  {
    id: 40,
    category: "Pop Culture & Music",
    question:
      "Which late-night segment strapped celebrities into a car for surprise sing-alongs — clips that dominated your social feed for years?",
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
