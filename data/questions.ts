export type QuestionCategory =
  | "Millennial Artifacts"
  | "Disney Deep Cuts"
  | "Movies & TV Connections"
  | "Pop Culture Chain Reactions"
  | "Picture Round / Visual Clues";

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
    question.category === "Disney Deep Cuts" ||
    question.category === "Pop Culture Chain Reactions"
  ) {
    return "multiple-choice";
  }
  return "standard";
}

export const triviaQuestions: TriviaQuestion[] = [
  // ── Millennial Artifacts (10) ─────────────────────────────────────────────
  {
    id: 1,
    category: "Millennial Artifacts",
    question:
      "Somewhere in the junk drawer: shiny discs nobody requested, a connection sound like an alien argument, and one voice that made checking email feel like winning the lottery.",
    answer: "AOL",
    acceptableAnswers: ["America Online", "A.O.L."],
    points: 100,
  },
  {
    id: 2,
    category: "Millennial Artifacts",
    question:
      "Facebook eventually let you make it official — but this site was already ending friendships over profile songs and who made the public cut for top eight.",
    answer: "MySpace",
    points: 100,
  },
  {
    id: 3,
    category: "Millennial Artifacts",
    question:
      "Away messages were comedy, drama, and passive aggression in one line — and when the door slammed, everyone at the sleepover knew exactly who just logged on.",
    answer: "AIM",
    acceptableAnswers: ["AOL Instant Messenger", "AOL IM"],
    points: 100,
  },
  {
    id: 4,
    category: "Millennial Artifacts",
    question:
      "You went for the movie, stayed for the Sour Patch Kids, and drove home praying Monday morning wouldn't include a lecture about late fees.",
    answer: "Blockbuster",
    points: 200,
  },
  {
    id: 5,
    category: "Millennial Artifacts",
    question:
      "Read enough pages and suddenly literature had a reward better than a gold star — a personal pan deal that made classmates wildly jealous.",
    answer: "Book It!",
    acceptableAnswers: ["Book It", "BOOK IT!", "Pizza Hut Book It"],
    points: 200,
  },
  {
    id: 6,
    category: "Millennial Artifacts",
    question:
      "Mom couldn't call. Dad couldn't call. The whole house was held hostage until someone either finished uploading or finally signed off.",
    answer: "Dial-up",
    acceptableAnswers: ["Dial-up internet", "Dial up", "Modem"],
    points: 200,
  },
  {
    id: 7,
    category: "Millennial Artifacts",
    question:
      "Before playlists lived in the cloud, teenagers traded MP3s like mixtapes and prayed the download wasn't also installing something nasty on the family PC.",
    answer: "Napster",
    acceptableAnswers: ["Napster.com"],
    points: 200,
  },
  {
    id: 8,
    category: "Millennial Artifacts",
    question:
      "It lived on a keychain, ate through button presses, and turned a quiet math class into a very public guilt trip.",
    answer: "Tamagotchi",
    acceptableAnswers: ["Tamogatchi"],
    points: 100,
  },
  {
    id: 9,
    category: "Millennial Artifacts",
    question:
      "Recess became Wall Street. All you needed was a cord, a cartridge, and the confidence to trade away someone's favorite.",
    answer: "Game Boy",
    acceptableAnswers: ["Pokemon", "Pokémon", "Game Boy Color"],
    points: 200,
  },
  {
    id: 10,
    category: "Millennial Artifacts",
    question:
      "The wagon left Independence. The river looked fine. Three clicks later, everyone is arguing about whether you should have caulked instead.",
    answer: "Oregon Trail",
    acceptableAnswers: ["The Oregon Trail"],
    points: 300,
  },

  // ── Disney Deep Cuts (10) ─────────────────────────────────────────────────
  {
    id: 11,
    category: "Disney Deep Cuts",
    question:
      "Disney built a Swiss peak tall enough for bobsleds but oddly short on actual climbing — Cast Members shoot hoops inside, and something abominable waits in the dark.",
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
    id: 12,
    category: "Disney Deep Cuts",
    question:
      "You think you're admiring portrait frames in a drawing room. By the time the lights return, you've already descended toward doom-wagons without taking a single visible step.",
    answer: "Haunted Mansion",
    acceptableAnswers: ["The Haunted Mansion"],
    points: 200,
    choices: [
      "Haunted Mansion",
      "Tower of Terror",
      "Pirates of the Caribbean",
      "Indiana Jones Adventure",
    ],
  },
  {
    id: 13,
    category: "Disney Deep Cuts",
    question:
      "There's fine dining in New Orleans Square — and then there's the upstairs place your cousin swears exists but nobody you know has ever walked through.",
    answer: "Club 33",
    points: 200,
    choices: ["Club 33", "Blue Bayou", "Carnation Cafe", "The Golden Horseshoe"],
  },
  {
    id: 14,
    category: "Disney Deep Cuts",
    question:
      "Instruments hover. Candles flicker. In the séance circle, one woman's face floats inside glass while the others keep bumping into you in the dark.",
    answer: "Madame Leota",
    acceptableAnswers: ["Leota"],
    points: 200,
    choices: ["Madame Leota", "Constance Hatchaway", "Ezra", "Gus"],
  },
  {
    id: 15,
    category: "Disney Deep Cuts",
    question:
      "Imagineers hide a three-circle signature in carpets, queues, and murals — park veterans treat spotting one like finding buried treasure.",
    answer: "Hidden Mickey",
    acceptableAnswers: ["A Hidden Mickey", "Hidden Mickeys"],
    points: 100,
    choices: ["Hidden Mickey", "Pixie Dust", "Disney Vault", "Magic Band"],
  },
  {
    id: 16,
    category: "Disney Deep Cuts",
    question:
      "You check into a Hollywood hotel that hasn't had happy guests since the 1930s. The bellhop smiles. The elevator drops you somewhere the Twilight Zone would recognize.",
    answer: "Tower of Terror",
    acceptableAnswers: [
      "The Twilight Zone Tower of Terror",
      "Hollywood Tower Hotel",
    ],
    points: 300,
    choices: [
      "Tower of Terror",
      "Haunted Mansion",
      "Rock 'n' Roller Coaster",
      "Expedition Everest",
    ],
  },
  {
    id: 17,
    category: "Disney Deep Cuts",
    question:
      "Blueprints, animatronics, forced perspective, and rides that feel impossible — this division's name sounds like imagination and engineering had a very serious meeting.",
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
    id: 18,
    category: "Disney Deep Cuts",
    question:
      "Before superheroes had their own lands, guests cooled off with singing tropical birds in a show Walt once used to test robotic performers.",
    answer: "Enchanted Tiki Room",
    acceptableAnswers: ["Walt Disney's Enchanted Tiki Room", "Tiki Room"],
    points: 200,
    choices: [
      "Enchanted Tiki Room",
      "Country Bear Jamboree",
      "Hall of Presidents",
      "Carousel of Progress",
    ],
  },
  {
    id: 19,
    category: "Disney Deep Cuts",
    question:
      "EPCOT's giant golf ball isn't just architecture — step inside and you'll travel from cave walls to fiber optics without leaving your seat.",
    answer: "Spaceship Earth",
    points: 200,
    choices: [
      "Spaceship Earth",
      "Mission: SPACE",
      "Soarin'",
      "Living with the Land",
    ],
  },
  {
    id: 20,
    category: "Disney Deep Cuts",
    question:
      "Every day on Main Street, a light stays on upstairs — not for show, but as if the park's founder might still be working late.",
    answer: "Walt Disney",
    acceptableAnswers: ["Walt"],
    points: 300,
    choices: ["Walt Disney", "Roy Disney", "Ub Iwerks", "Mickey Mouse"],
  },

  // ── Movies & TV Connections (10) ──────────────────────────────────────────
  {
    id: 21,
    category: "Movies & TV Connections",
    question:
      "Paris in the winter. A mansion full of traps. Two criminals learning the hard way that the smallest McCallister is the most dangerous.",
    answer: "Home Alone",
    points: 100,
  },
  {
    id: 22,
    category: "Movies & TV Connections",
    question:
      "Doc says the flux capacitor is what makes time travel possible. Marty says nobody calls him chicken. The clock tower says you're cutting this very close.",
    answer: "Back to the Future",
    points: 200,
  },
  {
    id: 23,
    category: "Movies & TV Connections",
    question:
      "Sales reports nobody reads, awards nobody earned, and one branch manager whose passion project involves running until a completely misunderstood disease gets awareness.",
    answer: "The Office",
    acceptableAnswers: ["The Office (US)", "The Office US"],
    points: 200,
  },
  {
    id: 24,
    category: "Movies & TV Connections",
    question:
      "A monkey in a Manhattan apartment. A couch that required geometry. Six adults somehow still unable to afford splitting apps fairly.",
    answer: "Friends",
    points: 100,
  },
  {
    id: 25,
    category: "Movies & TV Connections",
    question:
      "North Shore High has cliques, gossip, and one plastic rule about a weekday color that still gets quoted at brunch.",
    answer: "Mean Girls",
    points: 200,
  },
  {
    id: 26,
    category: "Movies & TV Connections",
    question:
      "Forty days, one torch, and a phrase that forever changed how office coworkers say they got betrayed in a meeting.",
    answer: "Survivor",
    points: 100,
  },
  {
    id: 27,
    category: "Movies & TV Connections",
    question:
      "Take the blue and stay comfortable. Take the red and discover your entire life might be a lie — plus bent spoons and very cool leather.",
    answer: "The Matrix",
    points: 200,
  },
  {
    id: 28,
    category: "Movies & TV Connections",
    question:
      "Platform nine is normal. Platform ten is normal. If you're running late for a wizard school express, the trick is the brick wall between them.",
    answer: "Platform 9 and 3/4",
    acceptableAnswers: [
      "Platform 9 3/4",
      "Platform nine and three quarters",
      "9 and 3/4",
    ],
    points: 300,
  },
  {
    id: 29,
    category: "Movies & TV Connections",
    question:
      "Forget tinsel. Forget gifts. Bring your grievances list, your aluminum pole, and relatives ready to wrestle for dominance after dinner.",
    answer: "Festivus",
    points: 200,
  },
  {
    id: 30,
    category: "Movies & TV Connections",
    question:
      "Michael Scott believes awareness saves lives. His coworkers believe the fun run itself might need medical attention. The disease he's fundraising for starts with frothing, not paper cuts.",
    answer: "Rabies",
    points: 300,
  },

  // ── Pop Culture Chain Reactions (10) ──────────────────────────────────────
  {
    id: 31,
    category: "Pop Culture Chain Reactions",
    question:
      "Times Square. Post-school sprint to the TV. Carson Daly counting down while your favorite video either wins or gets roasted in the group chat.",
    answer: "TRL",
    acceptableAnswers: ["Total Request Live", "Total Request Live (TRL)"],
    points: 200,
    choices: ["TRL", "106 & Park", "Direct Effect", "Headbangers Ball"],
  },
  {
    id: 32,
    category: "Pop Culture Chain Reactions",
    question:
      "Full albums were expensive. Headphones were optional. A one-minute clip on a carabiner was somehow enough to dominate every school hallway.",
    answer: "Hit Clips",
    acceptableAnswers: ["HitClip"],
    points: 200,
    choices: ["Hit Clips", "MiniDisc", "Walkman", "Discman"],
  },
  {
    id: 33,
    category: "Pop Culture Chain Reactions",
    question:
      "They weren't asking for your heart back — they were asking whether you wanted it 'that way,' and cafeteria philosophers still can't agree what that means.",
    answer: "Backstreet Boys",
    acceptableAnswers: ["BSB", "The Backstreet Boys"],
    points: 100,
    choices: ["*NSYNC", "98 Degrees", "Backstreet Boys", "New Kids on the Block"],
  },
  {
    id: 34,
    category: "Pop Culture Chain Reactions",
    question:
      "Denim on denim. Matching outfits. One red carpet later, and every tabloid knew exactly who had coordinated with Justin Timberlake stitch for stitch.",
    answer: "Britney Spears",
    acceptableAnswers: ["Britney"],
    points: 200,
    choices: ["Christina Aguilera", "Pink", "Britney Spears", "Shakira"],
  },
  {
    id: 35,
    category: "Pop Culture Chain Reactions",
    question:
      "Bills, phone, car note, dinner — an Atlanta trio turned dating standards into car-stereo law, and every late-'90s road trip still knows the chorus.",
    answer: "TLC",
    points: 100,
    choices: ["Destiny's Child", "En Vogue", "TLC", "SWV"],
  },
  {
    id: 36,
    category: "Pop Culture Chain Reactions",
    question:
      "Before Zillow became national therapy, MTV let you tour celebrity shoe closets from your couch — pool table optional, humble brag mandatory.",
    answer: "MTV Cribs",
    acceptableAnswers: ["Cribs"],
    points: 200,
    choices: ["Pimp My Ride", "Room Raiders", "MTV Cribs", "TRL"],
  },
  {
    id: 37,
    category: "Pop Culture Chain Reactions",
    question:
      "Your uncle at every wedding. A Spanish chorus. A hop-step everyone pretended to know until they were already trapped in the conga line.",
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
    id: 38,
    category: "Pop Culture Chain Reactions",
    question:
      "Hairspray lost. Flannel won. One Pacific Northwest riff and suddenly nobody at your high school felt like ironing their shirt anymore.",
    answer: "Nirvana",
    points: 200,
    choices: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"],
  },
  {
    id: 39,
    category: "Pop Culture Chain Reactions",
    question:
      "A borrowed Queen bass line. A novelty rap hit. A lawsuit that turned one white rapper into everyone's favorite punchline for a decade.",
    answer: "Vanilla Ice",
    acceptableAnswers: ["Rob Van Winkle"],
    points: 300,
    choices: ["MC Hammer", "Sir Mix-A-Lot", "Vanilla Ice", "Snow"],
  },
  {
    id: 40,
    category: "Pop Culture Chain Reactions",
    question:
      "Detroit trailer parks. Parking-lot rap battles. A film about losing yourself — the real story started long before Hollywood put it on a poster.",
    answer: "Eminem",
    acceptableAnswers: ["Marshall Mathers", "Slim Shady"],
    points: 300,
    choices: ["Eminem", "50 Cent", "Dr. Dre", "Jay-Z"],
  },

  // ── Picture Round / Visual Clues (10) ─────────────────────────────────────
  {
    id: 41,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "No late fees until Monday — but only if you remembered the most polite thing a renter could do before sliding this back through the slot.",
    answer: "Rewind it",
    acceptableAnswers: [
      "Rewind",
      "Be kind rewind",
      "Be kind, rewind",
      "Rewind the tape",
    ],
    points: 100,
    imageUrl: "/images/questions/VHS.png",
    imageAlt: "A VHS tape in a rental case",
  },
  {
    id: 42,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "Friday meant new releases behind this blue-and-yellow awning. Then one monthly subscription let you skip the drive entirely — what finally killed the Friday night pilgrimage?",
    answer: "Streaming",
    acceptableAnswers: ["Netflix", "Streaming services", "Video streaming"],
    points: 200,
    imageUrl: "/images/questions/Blockbuster.png",
    imageAlt: "A Blockbuster video store storefront",
  },
  {
    id: 43,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "Sleepover trading sessions depended on this accessory — without it, your pocket monsters stayed lonely on opposite sides of the bus aisle.",
    answer: "Link cable",
    acceptableAnswers: ["A link cable", "Game Link Cable", "Link Cable"],
    points: 200,
    imageUrl: "/images/questions/Gameboy.png",
    imageAlt: "A classic Nintendo Game Boy handheld",
  },
  {
    id: 44,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "Christmas morning: pure gibberish at midnight. By Tuesday, toddler English. Your parents were positive they'd accidentally imported a gremlin — which language came first?",
    answer: "Furbish",
    acceptableAnswers: ["Furbish language"],
    points: 200,
    imageUrl: "/images/questions/Furby.png",
    imageAlt: "A Furby animatronic toy",
  },
  {
    id: 45,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "This screen taught an entire generation that westward expansion was mostly bad water and worse luck — finish the famous death message every kid eventually saw.",
    answer: "You have died of dysentery",
    acceptableAnswers: ["Dysentery", "Died of dysentery"],
    points: 300,
    imageUrl: "/images/questions/Oregon Trail.png",
    imageAlt: "Oregon Trail computer game screen",
  },
  {
    id: 46,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "Long division on the board, guilt in your pocket, and a beeping keychain you were pretending didn't exist — ignore it through fifth period and you'd come home to a tiny digital tragedy.",
    answer: "It dies",
    acceptableAnswers: ["It died", "Death", "It dies", "Your pet dies"],
    points: 100,
    imageUrl: "/images/questions/Tamogatchi.png",
    imageAlt: "A Tamagotchi virtual pet keychain",
  },
  {
    id: 47,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "Sleepovers meant four controllers, a three-pronged grip nobody could explain, and one friend always stuck with the mushy analog stick nobody wanted.",
    answer: "Nintendo 64",
    acceptableAnswers: ["N64", "N64 console"],
    points: 300,
    imageUrl: "/images/questions/N64.png",
    imageAlt: "A Nintendo 64 console with controllers",
  },
  {
    id: 48,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "Once a month glossy flyers arrived and suddenly Goosebumps, erasers shaped like pizza, and your allowance all pointed toward one thing from the teacher's packet.",
    answer: "Books",
    acceptableAnswers: ["Book order", "Scholastic books", "Paperbacks"],
    points: 100,
    imageUrl: "/images/questions/Book order.png",
    imageAlt: "A Scholastic book order catalog",
  },
  {
    id: 49,
    category: "Picture Round / Visual Clues",
    type: "image",
    question:
      "After the modem finished screaming and the connection finally held, one cheerful voice made logging in feel like winning the lottery — give the two-word phrase.",
    answer: "You've got mail",
    acceptableAnswers: ["Youve got mail", "You've Got Mail"],
    points: 300,
    imageUrl: "/images/questions/AOL.png",
    imageAlt: "An AOL free trial CD mailer",
  },
  {
    id: 50,
    category: "Picture Round / Visual Clues",
    question:
      "Sticky rental sleeves, magnetic tape, and a clunky player under the TV — the home video format that tied Friday night together before discs took over.",
    answer: "VHS",
    acceptableAnswers: ["VHS tape", "VHS tapes", "VCR tape"],
    points: 200,
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
  "Millennial Artifacts",
  "Disney Deep Cuts",
  "Movies & TV Connections",
  "Pop Culture Chain Reactions",
  "Picture Round / Visual Clues",
];

export const totalQuestions = triviaQuestions.length;

export const totalPossiblePoints = triviaQuestions.reduce(
  (sum, q) => sum + q.points,
  0,
);
