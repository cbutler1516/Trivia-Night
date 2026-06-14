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
      "Your family had a stack of free trial discs that slowly became coasters. When the computer finally connected, a voice announced the most exciting moment of the week. Name the service.",
    answer: "AOL",
    acceptableAnswers: ["America Online", "A.O.L."],
    points: 100,
  },
  {
    id: 2,
    category: "Millennial Artifacts",
    question:
      "Before Facebook made relationships official, this website was already causing real-world drama by publicly ranking your closest friends.",
    answer: "MySpace",
    points: 100,
  },
  {
    id: 3,
    category: "Millennial Artifacts",
    question:
      "You couldn't sign off until the away message slapped — and everyone knew you were still online when the door slammed shut. Name the messenger.",
    answer: "AIM",
    acceptableAnswers: ["AOL Instant Messenger", "AOL IM"],
    points: 100,
  },
  {
    id: 4,
    category: "Millennial Artifacts",
    question:
      "Friday night meant a pilgrimage past the candy aisle to argue over what was left on the new-releases wall — before late fees ruined Monday morning.",
    answer: "Blockbuster",
    points: 200,
  },
  {
    id: 5,
    category: "Millennial Artifacts",
    question:
      "What annual reading program convinced millions of children that books could somehow be exchanged for pizza?",
    answer: "Book It!",
    acceptableAnswers: ["Book It", "BOOK IT!", "Pizza Hut Book It"],
    points: 200,
  },
  {
    id: 6,
    category: "Millennial Artifacts",
    question:
      "The modem screamed, the phone line went dead, and nobody could call your house until someone logged off. What connection was that?",
    answer: "Dial-up",
    acceptableAnswers: ["Dial-up internet", "Dial up", "Modem"],
    points: 200,
  },
  {
    id: 7,
    category: "Millennial Artifacts",
    question:
      "Before Spotify, before iTunes, and before most people owned MP3 players, millions of teenagers downloaded music from this service while hoping they weren't also downloading a computer virus.",
    answer: "Napster",
    acceptableAnswers: ["Napster.com"],
    points: 200,
  },
  {
    id: 8,
    category: "Millennial Artifacts",
    question:
      "Teachers banned them from classrooms. Kids hid them in pencil cases anyway. When the tiny screen started beeping during a test, you knew you'd forgotten to feed something important — name the keychain pet craze.",
    answer: "Tamagotchi",
    acceptableAnswers: ["Tamogatchi"],
    points: 100,
  },
  {
    id: 9,
    category: "Millennial Artifacts",
    question:
      "Playground negotiations, a link cable, and trades that could make or break your social status at recess — which Nintendo handheld turned schoolyards into trading floors?",
    answer: "Game Boy",
    acceptableAnswers: ["Pokemon", "Pokémon", "Game Boy Color"],
    points: 200,
  },
  {
    id: 10,
    category: "Millennial Artifacts",
    question:
      "Computer lab survivors remember broken axles, flooded rivers, and one infamous cause of death on the trail west. Name the game.",
    answer: "Oregon Trail",
    acceptableAnswers: ["The Oregon Trail"],
    points: 300,
  },

  // ── Disney Deep Cuts (10) ─────────────────────────────────────────────────
  {
    id: 11,
    category: "Disney Deep Cuts",
    question:
      "Cast Members have been known to shoot hoops inside this snow-capped peak — which has no real summit, tubular steel history, and a yeti waiting in the dark. Name the Disneyland ride.",
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
      "Your Ghost Host welcomes you into a room where portraits stretch, chandeliers rise, and nobody notices they're quietly being lowered toward their doom-wagon below. Name the attraction.",
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
      "Hidden above a beloved restaurant in New Orleans Square is a door most guests will never pass through — invitation only, whispered about for decades, and still carrying a legendary waitlist. Name the club.",
    answer: "Club 33",
    points: 200,
    choices: ["Club 33", "Blue Bayou", "Carnation Cafe", "The Golden Horseshoe"],
  },
  {
    id: 14,
    category: "Disney Deep Cuts",
    question:
      "Candlelight, floating instruments, and a disembodied head in a crystal ball — who is the medium in the Haunted Mansion séance?",
    answer: "Madame Leota",
    acceptableAnswers: ["Leota"],
    points: 200,
    choices: ["Madame Leota", "Constance Hatchaway", "Ezra", "Gus"],
  },
  {
    id: 15,
    category: "Disney Deep Cuts",
    question:
      "Park veterans hunt for three circles arranged like ears — tucked into ride queues, carpets, and murals. What is this Easter egg called?",
    answer: "Hidden Mickey",
    acceptableAnswers: ["A Hidden Mickey", "Hidden Mickeys"],
    points: 100,
    choices: ["Hidden Mickey", "Pixie Dust", "Disney Vault", "Magic Band"],
  },
  {
    id: 16,
    category: "Disney Deep Cuts",
    question:
      "A cursed Hollywood hotel, a service elevator, and a plunge into another dimension — name the drop ride at Hollywood Studios.",
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
    id: 18,
    category: "Disney Deep Cuts",
    question:
      "Before every ride needed a Marvel tie-in, which tropical bird show at Disneyland helped pioneer audio-animatronics?",
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
      "Inside EPCOT's giant geodesic sphere, a slow ride traces human communication from cave paintings to the internet. Name the attraction.",
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
      "On Main Street, U.S.A., a lamp stays lit in an upstairs window — a quiet tribute to the man who started it all. Who is it?",
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
      "A Christmas trip to Paris, one forgotten kid, two bumbling burglars, and a series of booby traps that would never pass home insurance — name the film.",
    answer: "Home Alone",
    points: 100,
  },
  {
    id: 22,
    category: "Movies & TV Connections",
    question:
      "A DeLorean, 1.21 gigawatts, and a clock tower struck by lightning — name the time-travel trilogy.",
    answer: "Back to the Future",
    points: 200,
  },
  {
    id: 23,
    category: "Movies & TV Connections",
    question:
      "A paper company, a Dundie award, Kevin's chili on the carpet, and a fun run for a disease Michael barely understands — name the series.",
    answer: "The Office",
    acceptableAnswers: ["The Office (US)", "The Office US"],
    points: 200,
  },
  {
    id: 24,
    category: "Movies & TV Connections",
    question:
      "Marcel the capuchin, 'Pivot!' on a staircase, and a couch that was never quite the same after it got carried upstairs — name the sitcom.",
    answer: "Friends",
    points: 100,
  },
  {
    id: 25,
    category: "Movies & TV Connections",
    question:
      "A Burn Book, pink on Wednesdays, and a word Gretchen Wieners tried to make happen — name the film.",
    answer: "Mean Girls",
    points: 200,
  },
  {
    id: 26,
    category: "Movies & TV Connections",
    question:
      "Stranded on an island, alliances shift at camp, and one ritual with fire decides who goes home — name the reality show that turned 'blindsided' into living-room vocabulary.",
    answer: "Survivor",
    points: 100,
  },
  {
    id: 27,
    category: "Movies & TV Connections",
    question:
      "Bullet time, a red pill, and a spoon that isn't real — name the sci-fi film that made everyone question the simulation.",
    answer: "The Matrix",
    points: 200,
  },
  {
    id: 28,
    category: "Movies & TV Connections",
    question:
      "A platform hidden between two ordinary ones, a brick wall you walk through, and a scarlet steam engine waiting on the other side — name the platform.",
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
      "An aluminum pole, feats of strength, and grievances aired over a meatloaf dinner — name the Seinfeld holiday.",
    answer: "Festivus",
    points: 200,
  },
  {
    id: 30,
    category: "Movies & TV Connections",
    question:
      "Michael Scott ran for miles to cure rabies, Pam Beesly married Jim twice, and Dwight Schrute owns a beet farm — what disease was that fun run actually for?",
    answer: "Rabies",
    points: 300,
  },

  // ── Pop Culture Chain Reactions (10) ──────────────────────────────────────
  {
    id: 31,
    category: "Pop Culture Chain Reactions",
    question:
      "Carson Daly, a countdown in Times Square, and teenagers sprinting home after school — what MTV show decided what video was number one?",
    answer: "TRL",
    acceptableAnswers: ["Total Request Live", "Total Request Live (TRL)"],
    points: 200,
    choices: ["TRL", "106 & Park", "Direct Effect", "Headbangers Ball"],
  },
  {
    id: 32,
    category: "Pop Culture Chain Reactions",
    question:
      "About sixty seconds of a radio hit, clipped onto a carabiner, swinging from every middle-school backpack — name the portable music fad that made headphones optional.",
    answer: "Hit Clips",
    acceptableAnswers: ["HitClip"],
    points: 200,
    choices: ["Hit Clips", "MiniDisc", "Walkman", "Discman"],
  },
  {
    id: 33,
    category: "Pop Culture Chain Reactions",
    question:
      "One boy band's lyrics launched a thousand lunch-table debates about what 'that way' even meant — name the group.",
    answer: "Backstreet Boys",
    acceptableAnswers: ["BSB", "The Backstreet Boys"],
    points: 100,
    choices: ["*NSYNC", "98 Degrees", "Backstreet Boys", "New Kids on the Block"],
  },
  {
    id: 34,
    category: "Pop Culture Chain Reactions",
    question:
      "Denim on denim, two pop exes, one red carpet — who matched Justin Timberlake stitch for stitch and broke the internet before that was a phrase?",
    answer: "Britney Spears",
    acceptableAnswers: ["Britney"],
    points: 200,
    choices: ["Christina Aguilera", "Pink", "Britney Spears", "Shakira"],
  },
  {
    id: 35,
    category: "Pop Culture Chain Reactions",
    question:
      "An Atlanta trio turned dating standards into car-stereo law for the late '90s — every road trip still knows the words. Name the group.",
    answer: "TLC",
    points: 100,
    choices: ["Destiny's Child", "En Vogue", "TLC", "SWV"],
  },
  {
    id: 36,
    category: "Pop Culture Chain Reactions",
    question:
      "Pool cabana tours, sneaker closets, and refrigerators judged from a safe distance — name the MTV show that started the mansion-tour craze.",
    answer: "MTV Cribs",
    acceptableAnswers: ["Cribs"],
    points: 200,
    choices: ["Pimp My Ride", "Room Raiders", "MTV Cribs", "TRL"],
  },
  {
    id: 37,
    category: "Pop Culture Chain Reactions",
    question:
      "Your uncle at every wedding, an invisible wall, and a hop-step everyone pretended to know — name the dance.",
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
      "Flannel replaced hairspray, MTV got louder, and one Pacific Northwest riff made an entire generation stop ironing their shirts — name the band.",
    answer: "Nirvana",
    points: 200,
    choices: ["Pearl Jam", "Soundgarden", "Nirvana", "Alice in Chains"],
  },
  {
    id: 39,
    category: "Pop Culture Chain Reactions",
    question:
      "A borrowed Queen bass line, a novelty rap hit, and a career that became an instant punchline — who was it?",
    answer: "Vanilla Ice",
    acceptableAnswers: ["Rob Van Winkle"],
    points: 300,
    choices: ["MC Hammer", "Sir Mix-A-Lot", "Vanilla Ice", "Snow"],
  },
  {
    id: 40,
    category: "Pop Culture Chain Reactions",
    question:
      "Detroit trailer parks, rap battles, and a film loosely about losing yourself — name the artist at the center of the chain.",
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
      "What courteous instruction did every polite renter follow before dropping this back in the return slot?",
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
      "What business model — watch anything from your couch for one flat monthly fee — eventually put this storefront out of business?",
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
      "What accessory did you need to trade creatures with the kid sitting next to you on the bus?",
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
      "It arrived under the tree speaking gibberish at midnight, learned English like a toddler, and convinced an entire generation of parents they'd made a terrible mistake — what language did it speak first?",
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
      "What three-word death message became this computer lab classic's most famous meme?",
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
      "You kept it hidden in your desk while pretending to listen to long division. Ignore the beeping long enough and you'd come home to a tiny digital tragedy — what happened?",
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
      "Sleepovers meant four controllers, a three-pronged grip nobody could explain, and arguments over who had to use the mushy analog stick — name the console.",
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
      "Once a month the teacher handed out glossy flyers and suddenly everyone needed Goosebumps, erasers shaped like food, and permission to spend their allowance — what were kids ordering?",
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
      "After the modem finished screaming and the connection finally held, a cheerful voice delivered the most exciting sentence of the dial-up era — what two-word phrase was it?",
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
      "Sticky rental sleeves, magnetic tape, and a clunky player under the TV — what home video format tied it all together?",
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
