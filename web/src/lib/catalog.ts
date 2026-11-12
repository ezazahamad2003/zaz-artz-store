import type {
  Collection,
  Garment,
  GarmentColor,
  ImageLayer,
  Layer,
  Template,
  TextLayer,
} from "./types";
import generated from "./generated-images.json";
import photos from "./generated-photos.json";

const PHOTOS = photos as Record<string, string>;
export const photoFor = (slug: string): string | undefined => PHOTOS[slug];

const GEN = generated as Record<string, string>;

/* ---------------------------------- fonts --------------------------------- */

export const FONTS = [
  "Bebas Neue",
  "Anton",
  "Archivo Black",
  "Bangers",
  "Black Ops One",
  "Rubik Mono One",
  "Shrikhand",
  "Monoton",
  "Press Start 2P",
  "Permanent Marker",
  "Rock Salt",
  "Pacifico",
  "Lobster",
  "Dancing Script",
  "Mountains of Christmas",
  "Cinzel",
  "Rajdhani",
  "Zen Tokyo Zoo",
  "Courier Prime",
] as const;

export const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?" +
  FONTS.map((f) => `family=${f.replace(/ /g, "+")}:wght@400;700`).join("&") +
  "&display=swap";

/* --------------------------------- colors --------------------------------- */

export const COLORS: GarmentColor[] = [
  { id: "black", name: "Black", hex: "#141416", dark: true },
  { id: "pepper", name: "Pepper (faded black)", hex: "#3a3a3d", dark: true },
  { id: "white", name: "White", hex: "#f5f5f2", dark: false },
  { id: "ivory", name: "Vintage Ivory", hex: "#eee7d6", dark: false },
  { id: "sand", name: "Sand", hex: "#d9c7a7", dark: false },
  { id: "butter", name: "Butter", hex: "#f2e394", dark: false },
  { id: "heather", name: "Heather Grey", hex: "#9a9a9e", dark: false },
  { id: "navy", name: "Navy", hex: "#1d2440", dark: true },
  { id: "bluejean", name: "Blue Jean", hex: "#6e8fb3", dark: true },
  { id: "forest", name: "Forest", hex: "#1f3d2b", dark: true },
  { id: "mint", name: "Chalky Mint", hex: "#b8e0cc", dark: false },
  { id: "maroon", name: "Maroon", hex: "#5a1f2b", dark: true },
  { id: "red", name: "Red", hex: "#b7202c", dark: true },
  { id: "berry", name: "Berry", hex: "#7a2f6b", dark: true },
  { id: "orchid", name: "Orchid", hex: "#c79ad6", dark: false },
  { id: "pink", name: "Blossom Pink", hex: "#f3c4d3", dark: false },
  { id: "watermelon", name: "Watermelon", hex: "#ef6a7e", dark: true },
];

export const colorById = (id: string) =>
  COLORS.find((c) => c.id === id) ?? COLORS[0];

const ALL = COLORS.map((c) => c.id);
const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

/* -------------------------------- garments -------------------------------- */

export const GARMENTS: Garment[] = [
  {
    id: "tee",
    name: "Classic Tee",
    short: "Tee",
    description: "Everyday midweight unisex tee. Soft, true-to-size, holds color.",
    fabric: "100% ring-spun cotton, 5.3 oz",
    basePrice: 28,
    colors: ALL,
    sizes: SIZES,
    hasBack: true,
  },
  {
    id: "heavy-tee",
    name: "Heavyweight Garment-Dyed Tee",
    short: "Heavy Tee",
    description:
      "Boxy, thick, garment-dyed. The vintage-wash tee everyone is asking for.",
    fabric: "100% cotton, 6.1 oz, garment-dyed",
    basePrice: 34,
    colors: ALL,
    sizes: SIZES,
    hasBack: true,
  },
  {
    id: "oversized-tee",
    name: "Oversized Drop-Shoulder Tee",
    short: "Oversized",
    description: "Streetwear cut with dropped shoulders and a longer body.",
    fabric: "100% cotton, 7 oz",
    basePrice: 36,
    colors: ["black", "pepper", "white", "ivory", "sand", "heather", "forest", "navy", "maroon"],
    sizes: SIZES,
    hasBack: true,
  },
  {
    id: "longsleeve",
    name: "Long Sleeve Tee",
    short: "Long Sleeve",
    description: "Classic fit long sleeve with ribbed cuffs. Sleeve print ready.",
    fabric: "100% cotton, 6 oz",
    basePrice: 36,
    colors: ALL,
    sizes: SIZES,
    hasBack: true,
  },
  {
    id: "hoodie",
    name: "Heavyweight Hoodie",
    short: "Hoodie",
    description: "Thick brushed fleece, double-lined hood, kangaroo pocket.",
    fabric: "80/20 cotton-poly fleece, 10 oz",
    basePrice: 58,
    colors: ALL,
    sizes: SIZES,
    hasBack: true,
  },
  {
    id: "crewneck",
    name: "Crewneck Sweatshirt",
    short: "Crewneck",
    description: "Relaxed crewneck. The matching-set and couples favorite.",
    fabric: "80/20 cotton-poly fleece, 9 oz",
    basePrice: 52,
    colors: ALL,
    sizes: SIZES,
    hasBack: true,
  },
  {
    id: "zip-hoodie",
    name: "Full-Zip Hoodie",
    short: "Zip Hoodie",
    description: "Full zip with split front print, left chest and back prints.",
    fabric: "80/20 cotton-poly fleece, 10 oz",
    basePrice: 64,
    colors: ["black", "pepper", "heather", "navy", "forest", "maroon", "ivory"],
    sizes: SIZES,
    hasBack: true,
  },
  {
    id: "joggers",
    name: "Fleece Joggers",
    short: "Joggers",
    description: "Tapered fleece joggers. Thigh print, matches our hoodies.",
    fabric: "80/20 cotton-poly fleece, 9 oz",
    basePrice: 54,
    colors: ["black", "pepper", "heather", "navy", "forest", "maroon", "sand", "ivory"],
    sizes: SIZES,
    hasBack: false,
  },
  {
    id: "camp-shirt",
    name: "Camp Collar Shirt",
    short: "Camp Shirt",
    description: "All-over or chest print button-up. Summer, vacation, anime-core.",
    fabric: "Viscose blend, relaxed fit",
    basePrice: 48,
    colors: ["black", "white", "ivory", "navy", "forest", "sand", "butter", "mint", "pink"],
    sizes: SIZES,
    hasBack: true,
  },
  {
    id: "pj-set",
    name: "Matching Pajama Set",
    short: "PJ Set",
    description: "Long sleeve top + pants. Built for family Christmas photos.",
    fabric: "Cotton jersey top and pants",
    basePrice: 62,
    colors: ["red", "forest", "navy", "ivory", "black", "pink", "heather"],
    sizes: ["Kids 2T", "Kids 4T", "Kids 6", "Kids 8", "Kids 12", "XS", "S", "M", "L", "XL", "2XL", "3XL"],
    hasBack: false,
  },
];

export const garmentById = (id: string) =>
  GARMENTS.find((g) => g.id === id) ?? GARMENTS[0];

/* ------------------------------- collections ------------------------------ */

export const COLLECTIONS: Collection[] = [
  {
    slug: "christmas",
    name: "Christmas Matching",
    tagline: "Family sets, elf squads, pet + owner twins.",
    description:
      "Matching family pajamas and coordinated sweatshirts are the #1 holiday apparel category this season. Personalize names, add the dog, pick the family superlative.",
    accent: "#ff4d4d",
    emoji: "🎄",
    trending: "Matching family sets + personalized PJs",
    season: "Ships by Dec 20 if ordered before Dec 12",
  },
  {
    slug: "new-years",
    name: "New Year 2027",
    tagline: "Countdown crew tees and resolution humor.",
    description:
      "Party crew shirts, year-in-review photo tees and 'new year, same me' sarcasm. Group orders get matching numbers.",
    accent: "#c8ff3d",
    emoji: "🥂",
    trending: "Group party crew shirts",
    season: "Order by Dec 22 for NYE",
  },
  {
    slug: "couples",
    name: "Girlfriend / Boyfriend",
    tagline: "Bootleg partner tees, 'Est.' hoodies, his + hers.",
    description:
      "The custom 'bootleg girlfriend / boyfriend' photo tee is one of the best selling custom shirts online right now. Upload a photo, drop a date, done. Valentine's 2027 is coming.",
    accent: "#ff4fa3",
    emoji: "💘",
    trending: "Bootleg photo tees + Est. date hoodies",
  },
  {
    slug: "anime",
    name: "Anime & Manga Core",
    tagline: "Turn yourself into an anime character.",
    description:
      "Anime streetwear went mainstream: clean character-inspired hoodies, kanji typography, manga panels. Upload a selfie and our AI redraws you, your partner or your pet in shonen, 90s cel or chibi style. Original art only, no licensed characters.",
    accent: "#5ad1ff",
    emoji: "⚡",
    trending: "AI anime portraits + kanji name tees",
  },
  {
    slug: "fandom",
    name: "Series & Fandom",
    tagline: "Binge-mode, finale survivors, era tees.",
    description:
      "Fan-made, unofficial, logo-free designs for the shows everyone is watching: 80s-town retro type, demon-hunter idol era, spoiler warnings and finale survival badges. Customize your own town, era or ship name.",
    accent: "#ffb347",
    emoji: "📺",
    trending: "Retro 80s type + K-pop idol era tees",
  },
  {
    slug: "pets",
    name: "Pet Parents",
    tagline: "Dog dad, cat mom, custom pet portraits.",
    description:
      "Pet-breed designs are consistently one of the most profitable print niches. Upload a photo and get a painted, pop-art or anime portrait of your pet on a hoodie.",
    accent: "#f2e394",
    emoji: "🐾",
    trending: "AI pet portraits on crewnecks",
  },
  {
    slug: "family",
    name: "Mom, Dad & Family Roles",
    tagline: "Bonus Mom, Girl Dad, Soccer Mom, Nurse fuel.",
    description:
      "Role and occupation shirts sell year-round and spike at Mother's Day, Father's Day and the holidays. Add kids' names on the sleeve.",
    accent: "#b8e0cc",
    emoji: "👨‍👩‍👧",
    trending: "Bonus Mom / Girl Dad / Nurse humor",
  },
  {
    slug: "y2k-retro",
    name: "Y2K & Retro",
    tagline: "Chrome bubble text, 2010s revival, racer stripes.",
    description:
      "Nostalgia keeps printing money: Y2K chrome, 2010s indie sleaze, racing silhouettes and 'adventure aesthetic' travel marks on vintage-wash heavyweights.",
    accent: "#c79ad6",
    emoji: "💿",
    trending: "Y2K chrome + vintage-wash heavyweights",
  },
  {
    slug: "mental-health",
    name: "Mental Health & Neurospicy",
    tagline: "Overstimulated, anxious but cute, it's okay.",
    description:
      "Mental health and neurodivergent-pride merch searches more than doubled since 2024. Soft colors, honest words, comfort fits.",
    accent: "#f3c4d3",
    emoji: "🧠",
    trending: "Neurodivergent pride + soft affirmations",
  },
  {
    slug: "events",
    name: "Squads & Events",
    tagline: "Bride tribe, birthday crew, family reunion, trip 2027.",
    description:
      "Group orders are the highest average-order-value category we see. Numbered crew shirts, bachelorette weekends, reunions and vacation squads.",
    accent: "#ffb347",
    emoji: "🎉",
    trending: "Numbered bachelorette + trip crews",
  },
];

export const collectionBySlug = (slug: string) =>
  COLLECTIONS.find((c) => c.slug === slug);

/* ------------------------------- templates -------------------------------- */

let n = 0;
const id = () => `l${(n++).toString(36)}`;

type TextOpts = Partial<Omit<TextLayer, "id" | "type" | "text">>;
function t(text: string, o: TextOpts = {}): TextLayer {
  return {
    id: id(),
    type: "text",
    text,
    font: "Bebas Neue",
    color: "#ffffff",
    x: 0.5,
    y: 0.5,
    w: 0.8,
    rotation: 0,
    ...o,
  };
}

function img(key: string, o: Partial<Omit<ImageLayer, "id" | "type">> = {}): ImageLayer {
  return {
    id: id(),
    type: "image",
    src: GEN[key] ?? `/placeholders/${key}.svg`,
    aspect: 1,
    x: 0.5,
    y: 0.45,
    w: 0.85,
    rotation: 0,
    source: "template",
    ...o,
  };
}

export const TEMPLATES: Template[] = [
  /* ----------------------------- christmas ------------------------------ */
  {
    slug: "elf-squad-family",
    name: "Elf Squad (Mama / Papa / Tiny Elf)",
    collection: "christmas",
    description:
      "Pick your elf title per shirt. Order one per family member and the set matches.",
    tags: ["matching", "family", "christmas", "bestseller"],
    garment: "crewneck",
    color: "forest",
    bestseller: true,
    placeholders: [{ key: "role", label: "Elf title", default: "Mama Elf", maxLength: 16 }],
    front: [
      t("{role}", { font: "Mountains of Christmas", color: "#ffffff", y: 0.42, w: 0.9, weight: 700 }),
      t("official north pole crew", { font: "Rajdhani", color: "#c8ff3d", y: 0.6, w: 0.7, letterSpacing: 0.25, uppercase: true }),
      t("est. 2026", { font: "Bebas Neue", color: "#ffffff", y: 0.7, w: 0.3 }),
    ],
  },
  {
    slug: "family-name-pjs",
    name: "Personalized Family Christmas PJs",
    collection: "christmas",
    description: "Family name across the chest, plaid vibes, kids to adult sizes.",
    tags: ["pajamas", "family", "christmas"],
    garment: "pj-set",
    color: "red",
    bestseller: true,
    placeholders: [{ key: "family", label: "Family name", default: "The Garcias", maxLength: 20 }],
    front: [
      t("{family}", { font: "Lobster", color: "#ffffff", y: 0.42, w: 0.9 }),
      t("christmas 2026", { font: "Bebas Neue", color: "#f2e394", y: 0.6, w: 0.6, letterSpacing: 0.15 }),
    ],
  },
  {
    slug: "santas-favorite",
    name: "Santa's Favorite (Superlatives)",
    collection: "christmas",
    description: "Family superlatives: Santa's Favorite, Most Likely To Nap, Cookie Thief.",
    tags: ["superlative", "funny", "christmas"],
    garment: "tee",
    color: "ivory",
    placeholders: [{ key: "title", label: "Superlative", default: "Santa's Favorite", maxLength: 22 }],
    front: [
      t("{title}", { font: "Shrikhand", color: "#b7202c", y: 0.45, w: 0.9 }),
      t("as voted by the family", { font: "Courier Prime", color: "#1d2440", y: 0.62, w: 0.6 }),
    ],
  },
  {
    slug: "dog-owner-matching-xmas",
    name: "Pet + Owner Matching Christmas",
    collection: "christmas",
    description: "Your dog or cat redrawn in a Santa hat. Hoodie for you, print file for the pet bandana.",
    tags: ["pets", "matching", "christmas", "ai"],
    garment: "hoodie",
    color: "forest",
    aiPrompt:
      "Cute illustrated golden retriever wearing a red Santa hat and a knitted scarf, flat vector sticker style, thick white outline, bold colors, centered, plain transparent background, t-shirt print",
    front: [
      img("dog-owner-matching-xmas", { y: 0.42, w: 0.7 }),
      t("merry everything", { font: "Pacifico", color: "#ffffff", y: 0.84, w: 0.75 }),
    ],
  },
  {
    slug: "ugly-sweater-print",
    name: "Ugly Sweater (but it's a hoodie)",
    collection: "christmas",
    description: "Pixel-knit pattern with your own text in the middle. Office party ready.",
    tags: ["ugly sweater", "office party", "funny"],
    garment: "hoodie",
    color: "red",
    placeholders: [{ key: "line", label: "Your line", default: "Sleigh All Day", maxLength: 18 }],
    aiPrompt:
      "Ugly christmas sweater knitted pattern panel, pixel knit reindeer, snowflakes and christmas trees in white and green on red, seamless flat 8-bit knit texture, rectangular panel, no text",
    front: [
      img("ugly-sweater-print", { y: 0.42, w: 0.95, aspect: 0.75 }),
      t("{line}", { font: "Press Start 2P", color: "#ffffff", stroke: "#1f3d2b", y: 0.42, w: 0.85 }),
    ],
  },

  /* ----------------------------- new years ------------------------------ */
  {
    slug: "cheers-2027-crew",
    name: "Cheers to 2027 Crew",
    collection: "new-years",
    description: "Party crew shirt with your crew name. Numbered backs for groups.",
    tags: ["party", "group", "new years"],
    garment: "tee",
    color: "black",
    bestseller: true,
    placeholders: [
      { key: "crew", label: "Crew name", default: "Midnight Crew", maxLength: 18 },
      { key: "num", label: "Back number", default: "27", maxLength: 3 },
    ],
    front: [
      t("cheers to", { font: "Rajdhani", color: "#c8ff3d", y: 0.3, w: 0.5, letterSpacing: 0.3, uppercase: true }),
      t("2027", { font: "Rubik Mono One", color: "#ffffff", y: 0.48, w: 0.9 }),
      t("{crew}", { font: "Bebas Neue", color: "#c8ff3d", y: 0.68, w: 0.7, letterSpacing: 0.1 }),
    ],
    back: [t("{num}", { font: "Anton", color: "#ffffff", y: 0.4, w: 0.7 })],
  },
  {
    slug: "new-year-same-me",
    name: "New Year, Same Me",
    collection: "new-years",
    description: "Resolution: none. Minimal typography on a heavyweight.",
    tags: ["funny", "minimal", "new years"],
    garment: "heavy-tee",
    color: "pepper",
    front: [
      t("new year", { font: "Archivo Black", color: "#f4f2ee", y: 0.4, w: 0.8 }),
      t("same me", { font: "Archivo Black", color: "#c8ff3d", y: 0.55, w: 0.8 }),
      t("resolution: none", { font: "Courier Prime", color: "#f4f2ee", y: 0.7, w: 0.5 }),
    ],
  },
  {
    slug: "year-in-review-photo",
    name: "Year in Review Photo Tee",
    collection: "new-years",
    description: "Your best photo of 2026 as a bootleg-style tee with the year stamped on it.",
    tags: ["photo", "bootleg", "new years"],
    garment: "tee",
    color: "white",
    placeholders: [{ key: "cap", label: "Caption", default: "2026 was a movie", maxLength: 22 }],
    front: [
      img("photo-placeholder", { y: 0.42, w: 0.72, aspect: 1.25, source: "upload" }),
      t("{cap}", { font: "Permanent Marker", color: "#141416", y: 0.88, w: 0.85 }),
    ],
  },

  /* ------------------------------- couples ------------------------------ */
  {
    slug: "bootleg-girlfriend",
    name: "Bootleg Girlfriend Tee",
    collection: "couples",
    description:
      "The viral one. Her photo in a 90s bootleg rap-tee layout with name and 'I love my girlfriend'.",
    tags: ["bootleg", "photo", "couples", "bestseller"],
    garment: "heavy-tee",
    color: "pepper",
    bestseller: true,
    placeholders: [
      { key: "name", label: "Her name", default: "Jess", maxLength: 14 },
      { key: "line", label: "Bottom line", default: "I love my girlfriend", maxLength: 24 },
    ],
    front: [
      t("{name}", { font: "Anton", color: "#ff4fa3", y: 0.12, w: 0.9, uppercase: true, stroke: "#ffffff" }),
      img("photo-placeholder", { y: 0.5, w: 0.7, aspect: 1.2, source: "upload" }),
      t("{line}", { font: "Bangers", color: "#ffffff", y: 0.9, w: 0.95, uppercase: true }),
    ],
  },
  {
    slug: "bootleg-boyfriend",
    name: "Bootleg Boyfriend Tee",
    collection: "couples",
    description: "Same viral layout, for him. Add tour dates on the back.",
    tags: ["bootleg", "photo", "couples"],
    garment: "heavy-tee",
    color: "black",
    bestseller: true,
    placeholders: [
      { key: "name", label: "His name", default: "Marcus", maxLength: 14 },
      { key: "line", label: "Bottom line", default: "I love my boyfriend", maxLength: 24 },
    ],
    front: [
      t("{name}", { font: "Anton", color: "#5ad1ff", y: 0.12, w: 0.9, uppercase: true, stroke: "#ffffff" }),
      img("photo-placeholder", { y: 0.5, w: 0.7, aspect: 1.2, source: "upload" }),
      t("{line}", { font: "Bangers", color: "#ffffff", y: 0.9, w: 0.95, uppercase: true }),
    ],
    back: [
      t("world tour", { font: "Anton", color: "#ffffff", y: 0.2, w: 0.8, uppercase: true }),
      t("first date · first trip · first fight · still here", { font: "Courier Prime", color: "#ffffff", y: 0.45, w: 0.9 }),
    ],
  },
  {
    slug: "est-anniversary-hoodies",
    name: "Est. Anniversary Hoodies",
    collection: "couples",
    description: "Minimal 'Est. date' with both names. Order two, pick two colors.",
    tags: ["anniversary", "minimal", "matching"],
    garment: "hoodie",
    color: "ivory",
    placeholders: [
      { key: "names", label: "Names", default: "Ava & Noah", maxLength: 22 },
      { key: "date", label: "Date", default: "EST. 06 · 14 · 2024", maxLength: 22 },
    ],
    front: [
      t("{names}", { font: "Cinzel", color: "#141416", y: 0.42, w: 0.85 }),
      t("{date}", { font: "Rajdhani", color: "#141416", y: 0.56, w: 0.6, letterSpacing: 0.2 }),
    ],
  },
  {
    slug: "his-hers-arrows",
    name: "Property Of / Taken By",
    collection: "couples",
    description: "Classic couple pair with a twist of varsity type.",
    tags: ["varsity", "couples", "valentines"],
    garment: "crewneck",
    color: "black",
    placeholders: [{ key: "who", label: "Partner name", default: "Taken by Sam", maxLength: 20 }],
    front: [
      t("{who}", { font: "Bebas Neue", color: "#ff4fa3", y: 0.42, w: 0.9, letterSpacing: 0.05 }),
      t("since 2023 · no refunds", { font: "Courier Prime", color: "#ffffff", y: 0.58, w: 0.7 }),
    ],
  },

  /* -------------------------------- anime ------------------------------- */
  {
    slug: "anime-me-shonen",
    name: "Anime Me: Shonen Protagonist",
    collection: "anime",
    description:
      "Upload a selfie, our AI redraws you as a shonen hero with speed lines and a kanji title you choose.",
    tags: ["ai", "anime", "portrait", "bestseller"],
    garment: "hoodie",
    color: "black",
    bestseller: true,
    aiPrompt:
      "Original anime shonen protagonist, dynamic three-quarter portrait of a young hero with spiky dark hair and a determined expression, glowing blue aura, speed lines, bold cel shading, 90s anime cel style, vibrant colors, plain transparent background, t-shirt print, no text",
    placeholders: [{ key: "kanji", label: "Kanji / title", default: "主人公", maxLength: 10 }],
    front: [
      img("anime-me-shonen", { y: 0.42, w: 0.85, aspect: 1.15 }),
      t("{kanji}", { font: "Zen Tokyo Zoo", color: "#5ad1ff", y: 0.9, w: 0.5 }),
    ],
  },
  {
    slug: "anime-couple-cel",
    name: "Anime Couple: 90s Cel",
    collection: "anime",
    description: "You and your partner as a 90s cel-shaded anime pair. Cherry blossoms optional.",
    tags: ["ai", "anime", "couples"],
    garment: "crewneck",
    color: "navy",
    aiPrompt:
      "Original 90s anime couple portrait, a young man and woman standing close, soft cel shading, retro VHS film grain, cherry blossom petals, warm sunset palette, square composition, plain transparent background, no text",
    front: [img("anime-couple-cel", { y: 0.45, w: 0.85 })],
  },
  {
    slug: "chibi-pet-anime",
    name: "Chibi Pet",
    collection: "anime",
    description: "Your pet in chibi style with sparkle eyes. Devastatingly cute.",
    tags: ["ai", "anime", "pets"],
    garment: "tee",
    color: "mint",
    aiPrompt:
      "Chibi kawaii anime cat with huge sparkly eyes, tiny body, pastel colors, sticker style with thick white outline, plain transparent background, no text",
    front: [
      img("chibi-pet-anime", { y: 0.42, w: 0.7 }),
      t("best boy", { font: "Bangers", color: "#141416", y: 0.86, w: 0.5 }),
    ],
  },
  {
    slug: "kanji-name-tee",
    name: "Kanji Name Tee",
    collection: "anime",
    description: "Your name or word in bold kanji-style type with a red sun. Clean streetwear.",
    tags: ["typography", "anime", "streetwear"],
    garment: "oversized-tee",
    color: "white",
    placeholders: [{ key: "word", label: "Word / name", default: "ZAZ", maxLength: 12 }],
    front: [
      t("{word}", { font: "Zen Tokyo Zoo", color: "#141416", y: 0.42, w: 0.85 }),
      t("東京 · tokyo drift club", { font: "Rajdhani", color: "#b7202c", y: 0.6, w: 0.65, letterSpacing: 0.2, uppercase: true }),
    ],
  },
  {
    slug: "manga-panel-photo",
    name: "Manga Panel Photo",
    collection: "anime",
    description: "Your photo converted into a halftone manga panel with speech bubble text you write.",
    tags: ["ai", "manga", "photo"],
    garment: "longsleeve",
    color: "white",
    aiPrompt:
      "Black and white manga panel illustration of a young person looking over their shoulder, screentone halftone shading, dramatic ink lines, speed lines background, empty speech bubble, square composition, no text",
    placeholders: [{ key: "bubble", label: "Speech bubble", default: "it's not a phase", maxLength: 20 }],
    front: [
      img("manga-panel-photo", { y: 0.45, w: 0.9 }),
      t("{bubble}", { font: "Bangers", color: "#141416", y: 0.14, w: 0.5, rotation: -6 }),
    ],
  },

  /* ------------------------------- fandom ------------------------------- */
  {
    slug: "upside-down-town",
    name: "Retro 80s Town Tee",
    collection: "fandom",
    description:
      "That 80s small-town horror title treatment, with your own town name. Red glow type, fan-made, no logos.",
    tags: ["80s", "retro", "series", "bestseller"],
    garment: "heavy-tee",
    color: "black",
    bestseller: true,
    placeholders: [
      { key: "town", label: "Town name", default: "Hawkins", maxLength: 14 },
      { key: "sub", label: "Subtitle", default: "Indiana · 1985", maxLength: 20 },
    ],
    front: [
      t("{town}", { font: "Cinzel", color: "#ff2e2e", stroke: "#ffb3b3", y: 0.42, w: 0.9, uppercase: true }),
      t("{sub}", { font: "Rajdhani", color: "#ffffff", y: 0.58, w: 0.5, letterSpacing: 0.3, uppercase: true }),
      t("final season survivor", { font: "Courier Prime", color: "#ff2e2e", y: 0.72, w: 0.55 }),
    ],
  },
  {
    slug: "idol-hunter-era",
    name: "Demon Hunter Idol Era",
    collection: "fandom",
    description:
      "K-pop demon hunting energy: holographic type, tiger-and-magpie folk motif, your bias name. Unofficial fan art.",
    tags: ["kpop", "idol", "fan art"],
    garment: "crewneck",
    color: "berry",
    aiPrompt:
      "Original Korean folk art tiger and magpie illustration, minhwa style with bold modern neon pink and gold outlines, stylized, square composition, plain transparent background, no text",
    placeholders: [{ key: "bias", label: "Your bias / group", default: "Golden Era", maxLength: 16 }],
    front: [
      img("idol-hunter-era", { y: 0.42, w: 0.75 }),
      t("{bias}", { font: "Shrikhand", color: "#f2e394", y: 0.86, w: 0.7 }),
    ],
  },
  {
    slug: "no-spoilers",
    name: "No Spoilers / Binge Mode",
    collection: "fandom",
    description: "Universal fandom tee: binge mode on, spoilers off.",
    tags: ["funny", "series"],
    garment: "tee",
    color: "navy",
    placeholders: [{ key: "show", label: "Currently watching", default: "currently watching: everything", maxLength: 32 }],
    front: [
      t("no spoilers", { font: "Black Ops One", color: "#ffb347", y: 0.4, w: 0.9, uppercase: true }),
      t("{show}", { font: "Courier Prime", color: "#ffffff", y: 0.58, w: 0.85 }),
    ],
  },
  {
    slug: "gothic-academy",
    name: "Gothic Academy Crest",
    collection: "fandom",
    description: "Dark-academy crest with your name and motto. Outcast approved.",
    tags: ["gothic", "academy", "series"],
    garment: "hoodie",
    color: "black",
    placeholders: [
      { key: "name", label: "Academy name", default: "Nevermore Prep", maxLength: 18 },
      { key: "motto", label: "Motto", default: "allergic to color", maxLength: 22 },
    ],
    front: [
      t("{name}", { font: "Cinzel", color: "#c79ad6", y: 0.4, w: 0.85, uppercase: true }),
      t("{motto}", { font: "Courier Prime", color: "#ffffff", y: 0.56, w: 0.6 }),
    ],
  },

  /* -------------------------------- pets -------------------------------- */
  {
    slug: "pet-portrait-renaissance",
    name: "Renaissance Pet Portrait",
    collection: "pets",
    description: "Your pet painted as 17th-century royalty. Upload a photo.",
    tags: ["ai", "pets", "portrait", "bestseller"],
    garment: "crewneck",
    color: "ivory",
    bestseller: true,
    aiPrompt:
      "Renaissance oil painting portrait of a french bulldog wearing a royal red velvet robe and gold crown, dramatic chiaroscuro lighting, ornate gold frame, square composition, no text",
    placeholders: [{ key: "name", label: "Pet name", default: "Sir Biscuit", maxLength: 16 }],
    front: [
      img("pet-portrait-renaissance", { y: 0.42, w: 0.72 }),
      t("{name}", { font: "Cinzel", color: "#141416", y: 0.86, w: 0.6 }),
    ],
  },
  {
    slug: "dog-dad",
    name: "Dog Dad / Cat Mom",
    collection: "pets",
    description: "Pick your title, add the breed. Bold and simple.",
    tags: ["pets", "typography"],
    garment: "tee",
    color: "heather",
    placeholders: [
      { key: "title", label: "Title", default: "Dog Dad", maxLength: 14 },
      { key: "breed", label: "Breed / names", default: "golden retriever division", maxLength: 28 },
    ],
    front: [
      t("{title}", { font: "Anton", color: "#141416", y: 0.42, w: 0.85, uppercase: true }),
      t("{breed}", { font: "Rajdhani", color: "#141416", y: 0.58, w: 0.7, letterSpacing: 0.15, uppercase: true }),
    ],
  },
  {
    slug: "pet-popart",
    name: "Pop-Art Pet",
    collection: "pets",
    description: "Four-panel Warhol-style pop art of your pet.",
    tags: ["ai", "pets", "pop art"],
    garment: "hoodie",
    color: "white",
    aiPrompt:
      "Pop art four panel grid portrait of a tabby cat face, Warhol screen print style, each panel a different bold color combination of pink, yellow, cyan and orange, high contrast, square composition, no text",
    front: [img("pet-popart", { y: 0.45, w: 0.8 })],
  },

  /* -------------------------------- family ------------------------------ */
  {
    slug: "bonus-mom",
    name: "Bonus Mom / Bonus Dad",
    collection: "family",
    description: "For the step-parents who showed up. Kids' names on the sleeve.",
    tags: ["family", "step parent", "mothers day"],
    garment: "crewneck",
    color: "sand",
    placeholders: [
      { key: "title", label: "Title", default: "Bonus Mom", maxLength: 14 },
      { key: "kids", label: "Kids' names", default: "Lily · Max · Theo", maxLength: 26 },
    ],
    front: [
      t("{title}", { font: "Pacifico", color: "#5a1f2b", y: 0.42, w: 0.85 }),
      t("{kids}", { font: "Rajdhani", color: "#5a1f2b", y: 0.6, w: 0.7, letterSpacing: 0.15, uppercase: true }),
    ],
  },
  {
    slug: "girl-dad",
    name: "Girl Dad",
    collection: "family",
    description: "Varsity block type. Also available as Boy Mom, Twin Mom, Dog Mom.",
    tags: ["family", "fathers day"],
    garment: "tee",
    color: "black",
    placeholders: [{ key: "title", label: "Title", default: "Girl Dad", maxLength: 14 }],
    front: [
      t("{title}", { font: "Archivo Black", color: "#f3c4d3", y: 0.45, w: 0.85, uppercase: true }),
      t("est. 2019 · outnumbered & thriving", { font: "Courier Prime", color: "#ffffff", y: 0.62, w: 0.8 }),
    ],
  },
  {
    slug: "nurse-fuel",
    name: "Nurse Fuel",
    collection: "family",
    description: "The most profitable occupation niche in custom apparel. Add your unit.",
    tags: ["nurse", "occupation", "funny"],
    garment: "longsleeve",
    color: "navy",
    placeholders: [{ key: "unit", label: "Unit / hospital", default: "night shift · ICU", maxLength: 24 }],
    front: [
      t("coffee · scrubs · repeat", { font: "Rajdhani", color: "#5ad1ff", y: 0.3, w: 0.7, letterSpacing: 0.2, uppercase: true }),
      t("nurse fuel", { font: "Bangers", color: "#ffffff", y: 0.47, w: 0.9, uppercase: true }),
      t("{unit}", { font: "Courier Prime", color: "#ffffff", y: 0.65, w: 0.6 }),
    ],
  },

  /* ------------------------------ y2k retro ----------------------------- */
  {
    slug: "y2k-chrome-name",
    name: "Y2K Chrome Name",
    collection: "y2k-retro",
    description: "Liquid chrome bubble letters with your word. Butterfly clip energy.",
    tags: ["y2k", "chrome", "typography", "bestseller"],
    garment: "oversized-tee",
    color: "black",
    bestseller: true,
    aiPrompt:
      "Y2K liquid chrome 3D bubble letters spelling ANGEL, shiny silver metallic with pink and blue reflections, small chrome butterflies and stars around, plain transparent background, centered",
    placeholders: [{ key: "word", label: "Your word", default: "ANGEL", maxLength: 10 }],
    front: [
      img("y2k-chrome-name", { y: 0.4, w: 0.9, aspect: 0.7 }),
      t("{word} · since 2000", { font: "Monoton", color: "#c79ad6", y: 0.78, w: 0.7 }),
    ],
  },
  {
    slug: "racer-club",
    name: "Racer Club",
    collection: "y2k-retro",
    description: "Motorsport-inspired sponsor layout with your crew name and number.",
    tags: ["racing", "motorsport", "streetwear"],
    garment: "longsleeve",
    color: "white",
    placeholders: [
      { key: "team", label: "Team name", default: "ZAZ Racing", maxLength: 16 },
      { key: "num", label: "Number", default: "07", maxLength: 3 },
    ],
    front: [
      t("{team}", { font: "Black Ops One", color: "#b7202c", y: 0.36, w: 0.85, uppercase: true, italic: true }),
      t("{num}", { font: "Rubik Mono One", color: "#141416", y: 0.58, w: 0.5 }),
      t("pit crew · est. 2026", { font: "Rajdhani", color: "#141416", y: 0.74, w: 0.55, letterSpacing: 0.2, uppercase: true }),
    ],
    back: [t("{num}", { font: "Rubik Mono One", color: "#141416", y: 0.4, w: 0.8 })],
  },
  {
    slug: "adventure-aesthetic",
    name: "Adventure Aesthetic Mark",
    collection: "y2k-retro",
    description: "Vintage national-park style badge with your favorite place.",
    tags: ["travel", "outdoors", "vintage"],
    garment: "heavy-tee",
    color: "sand",
    aiPrompt:
      "Vintage national park badge illustration, mountains, pine trees and a lake at sunset, limited retro palette of rust orange, cream and forest green, distressed screen print texture, circular badge, no text",
    placeholders: [{ key: "place", label: "Place", default: "Big Sur · CA", maxLength: 18 }],
    front: [
      img("adventure-aesthetic", { y: 0.42, w: 0.72 }),
      t("{place}", { font: "Bebas Neue", color: "#5a1f2b", y: 0.86, w: 0.6, letterSpacing: 0.1 }),
    ],
  },
  {
    slug: "indie-sleaze",
    name: "Indie Sleaze 2010s",
    collection: "y2k-retro",
    description: "Flash-photo party aesthetic with lo-fi type. Upload your blurry photo.",
    tags: ["2010s", "photo", "party"],
    garment: "tee",
    color: "white",
    placeholders: [{ key: "line", label: "Caption", default: "we were so young", maxLength: 22 }],
    front: [
      img("photo-placeholder", { y: 0.45, w: 0.8, aspect: 0.75, source: "upload" }),
      t("{line}", { font: "Courier Prime", color: "#141416", y: 0.86, w: 0.8 }),
    ],
  },

  /* ---------------------------- mental health --------------------------- */
  {
    slug: "overstimulated",
    name: "Overstimulated",
    collection: "mental-health",
    description: "Soft hoodie, honest word. Wear your boundaries.",
    tags: ["neurodivergent", "soft", "bestseller"],
    garment: "hoodie",
    color: "pink",
    bestseller: true,
    front: [
      t("overstimulated", { font: "Dancing Script", color: "#5a1f2b", y: 0.45, w: 0.9 }),
      t("please speak softly", { font: "Courier Prime", color: "#5a1f2b", y: 0.6, w: 0.6 }),
    ],
  },
  {
    slug: "anxious-but-cute",
    name: "Anxious But Cute",
    collection: "mental-health",
    description: "Pastel bubble text. Sarcastic and sweet.",
    tags: ["anxiety", "cute", "funny"],
    garment: "crewneck",
    color: "orchid",
    front: [
      t("anxious", { font: "Shrikhand", color: "#ffffff", y: 0.38, w: 0.8 }),
      t("but cute", { font: "Shrikhand", color: "#f2e394", y: 0.55, w: 0.8 }),
    ],
  },
  {
    slug: "neurospicy",
    name: "Neurospicy",
    collection: "mental-health",
    description: "ADHD / autism pride with a chili flame. Customize the subtitle.",
    tags: ["adhd", "autism", "pride"],
    garment: "tee",
    color: "butter",
    placeholders: [{ key: "sub", label: "Subtitle", default: "adhd edition", maxLength: 18 }],
    front: [
      t("neurospicy 🌶", { font: "Bangers", color: "#b7202c", y: 0.44, w: 0.9 }),
      t("{sub}", { font: "Rajdhani", color: "#141416", y: 0.6, w: 0.5, letterSpacing: 0.25, uppercase: true }),
    ],
  },

  /* -------------------------------- events ------------------------------ */
  {
    slug: "bride-tribe",
    name: "Bride Tribe Weekend",
    collection: "events",
    description: "Bachelorette crew with city and date. Bride gets a different color.",
    tags: ["bachelorette", "wedding", "group", "bestseller"],
    garment: "tee",
    color: "pink",
    bestseller: true,
    placeholders: [
      { key: "role", label: "Role", default: "Bride Tribe", maxLength: 14 },
      { key: "where", label: "City · date", default: "Nashville · Mar 2027", maxLength: 24 },
    ],
    front: [
      t("{role}", { font: "Pacifico", color: "#5a1f2b", y: 0.42, w: 0.85 }),
      t("{where}", { font: "Bebas Neue", color: "#5a1f2b", y: 0.6, w: 0.6, letterSpacing: 0.15 }),
    ],
  },
  {
    slug: "birthday-squad",
    name: "Birthday Squad",
    collection: "events",
    description: "Numbered birthday crew. Name on the back.",
    tags: ["birthday", "group"],
    garment: "tee",
    color: "black",
    placeholders: [
      { key: "age", label: "Age", default: "30", maxLength: 3 },
      { key: "name", label: "Name", default: "Priya", maxLength: 14 },
    ],
    front: [
      t("{age}", { font: "Rubik Mono One", color: "#c8ff3d", y: 0.42, w: 0.6 }),
      t("& thriving", { font: "Bebas Neue", color: "#ffffff", y: 0.62, w: 0.6, letterSpacing: 0.15 }),
    ],
    back: [t("{name}'s birthday squad", { font: "Bebas Neue", color: "#ffffff", y: 0.25, w: 0.9 })],
  },
  {
    slug: "family-reunion",
    name: "Family Reunion 2027",
    collection: "events",
    description: "Tree emblem with your family name. Bulk pricing applies at 10+.",
    tags: ["reunion", "family", "group"],
    garment: "tee",
    color: "forest",
    aiPrompt:
      "Minimal line-art family tree emblem, oak tree with roots forming a circle, single color white line illustration on transparent background, badge style, no text",
    placeholders: [{ key: "family", label: "Family name", default: "Johnson Family Reunion", maxLength: 26 }],
    front: [
      img("family-reunion", { y: 0.4, w: 0.6 }),
      t("{family}", { font: "Bebas Neue", color: "#ffffff", y: 0.8, w: 0.9, letterSpacing: 0.08 }),
      t("2027", { font: "Rajdhani", color: "#c8ff3d", y: 0.9, w: 0.3, letterSpacing: 0.3 }),
    ],
  },
  {
    slug: "trip-crew",
    name: "Trip Crew",
    collection: "events",
    description: "Vacation squad with destination and year. Camp shirt or tee.",
    tags: ["travel", "vacation", "group"],
    garment: "camp-shirt",
    color: "butter",
    placeholders: [{ key: "dest", label: "Destination · year", default: "Cancún 2027", maxLength: 20 }],
    front: [
      t("{dest}", { font: "Lobster", color: "#1d2440", y: 0.42, w: 0.85 }),
      t("what happens here stays here", { font: "Courier Prime", color: "#1d2440", y: 0.6, w: 0.8 }),
    ],
  },
];

const EXTRA_TEMPLATES: Template[] = [
  /* christmas */
  { slug: "merry-and-bright", name: "Merry & Bright Script", collection: "christmas", description: "Classic script on a cozy crewneck. Add the year.", tags: ["script", "christmas", "classic"], garment: "crewneck", color: "ivory",
    placeholders: [{ key: "year", label: "Year", default: "2026", maxLength: 6 }],
    front: [t("Merry & Bright", { font: "Dancing Script", color: "#b7202c", y: 0.42, w: 0.9 }), t("christmas {year}", { font: "Rajdhani", color: "#1f3d2b", y: 0.6, w: 0.5, letterSpacing: 0.25, uppercase: true })] },
  { slug: "most-likely-to-nap", name: "Most Likely To Nap", collection: "christmas", description: "Family superlatives, nap edition. Change the line for each person.", tags: ["superlative", "funny"], garment: "tee", color: "forest",
    placeholders: [{ key: "line", label: "Most likely to…", default: "nap after dinner", maxLength: 24 }],
    front: [t("most likely to", { font: "Bebas Neue", color: "#ffffff", y: 0.36, w: 0.7, letterSpacing: 0.1 }), t("{line}", { font: "Pacifico", color: "#f2e394", y: 0.55, w: 0.9 })] },
  { slug: "first-christmas-married", name: "First Christmas as Mr & Mrs", collection: "christmas", description: "Newlywed matching set with your names and year.", tags: ["couples", "christmas", "wedding"], garment: "crewneck", color: "red",
    placeholders: [{ key: "names", label: "Names", default: "Ava & Noah", maxLength: 22 }, { key: "year", label: "Year", default: "2026", maxLength: 6 }],
    front: [t("our first christmas", { font: "Rajdhani", color: "#ffffff", y: 0.3, w: 0.7, letterSpacing: 0.2, uppercase: true }), t("as Mr & Mrs", { font: "Dancing Script", color: "#ffffff", y: 0.47, w: 0.85 }), t("{names} · {year}", { font: "Bebas Neue", color: "#f2e394", y: 0.66, w: 0.7, letterSpacing: 0.1 })] },
  { slug: "cookie-baking-crew", name: "Cookie Baking Crew", collection: "christmas", description: "Kitchen chaos uniform for the whole family. Kids sizes on the PJ set.", tags: ["family", "baking", "matching"], garment: "pj-set", color: "ivory",
    placeholders: [{ key: "role", label: "Role", default: "Head Baker", maxLength: 16 }],
    front: [t("cookie baking crew", { font: "Lobster", color: "#b7202c", y: 0.4, w: 0.9 }), t("{role}", { font: "Bebas Neue", color: "#1f3d2b", y: 0.6, w: 0.5, letterSpacing: 0.15 })] },
  { slug: "gingerbread-gang", name: "Gingerbread Gang", collection: "christmas", description: "Illustrated gingerbread family on a hoodie. Choose your family name.", tags: ["family", "illustration", "ai"], garment: "hoodie", color: "maroon",
    aiPrompt: "Cute illustrated family of four gingerbread cookies holding hands, icing details, flat vector sticker style with thick white outline, warm colors, plain transparent background, no text",
    placeholders: [{ key: "family", label: "Family name", default: "The Nguyens", maxLength: 20 }],
    front: [img("gingerbread-gang", { y: 0.4, w: 0.8, aspect: 0.8 }), t("{family}", { font: "Mountains of Christmas", color: "#ffffff", y: 0.84, w: 0.8, weight: 700 })] },
  /* new years */
  { slug: "countdown-crew-numbered", name: "Countdown Crew (numbered)", collection: "new-years", description: "Minimal countdown tee with your crew number on the back.", tags: ["group", "numbered"], garment: "heavy-tee", color: "white",
    placeholders: [{ key: "num", label: "Number", default: "01", maxLength: 3 }],
    front: [t("3 · 2 · 1", { font: "Rubik Mono One", color: "#141416", y: 0.42, w: 0.8 }), t("countdown crew 2027", { font: "Rajdhani", color: "#b7202c", y: 0.6, w: 0.6, letterSpacing: 0.2, uppercase: true })],
    back: [t("{num}", { font: "Anton", color: "#141416", y: 0.4, w: 0.7 })] },
  { slug: "resolutions-pending", name: "Resolutions: Pending", collection: "new-years", description: "Honest typography for January.", tags: ["funny", "minimal"], garment: "crewneck", color: "heather",
    front: [t("resolutions", { font: "Archivo Black", color: "#141416", y: 0.4, w: 0.85, uppercase: true }), t("status: pending", { font: "Courier Prime", color: "#b7202c", y: 0.58, w: 0.6 })] },
  { slug: "nye-sparkle-2027", name: "Sparkle Into 2027", collection: "new-years", description: "Script with a champagne glow. Party photo guaranteed.", tags: ["party", "script"], garment: "tee", color: "black",
    front: [t("sparkle into", { font: "Dancing Script", color: "#f2e394", y: 0.36, w: 0.8 }), t("2027", { font: "Monoton", color: "#ffffff", y: 0.56, w: 0.7 })] },
  { slug: "same-crew-new-year", name: "Same Crew, New Year", collection: "new-years", description: "Friend-group tee with everyone's names listed on the back.", tags: ["friends", "group"], garment: "longsleeve", color: "navy",
    placeholders: [{ key: "names", label: "Names (back)", default: "Maya · Jo · Sam · Lee", maxLength: 40 }],
    front: [t("same crew", { font: "Bebas Neue", color: "#ffffff", y: 0.38, w: 0.8, letterSpacing: 0.08 }), t("new year", { font: "Bebas Neue", color: "#c79ad6", y: 0.55, w: 0.8, letterSpacing: 0.08 })],
    back: [t("{names}", { font: "Courier Prime", color: "#ffffff", y: 0.3, w: 0.9 })] },
  /* couples */
  { slug: "her-king-his-queen", name: "Her King / His Queen", collection: "couples", description: "Crown type for the pair. Order one of each.", tags: ["matching", "varsity"], garment: "hoodie", color: "black",
    placeholders: [{ key: "title", label: "Title", default: "Her King", maxLength: 14 }, { key: "since", label: "Since", default: "since 2021", maxLength: 14 }],
    front: [t("{title}", { font: "Cinzel", color: "#f2e394", y: 0.42, w: 0.85, uppercase: true }), t("{since}", { font: "Rajdhani", color: "#ffffff", y: 0.58, w: 0.4, letterSpacing: 0.25, uppercase: true })] },
  { slug: "if-lost-return-to", name: "If Lost, Return To…", collection: "couples", description: "The classic pair: one says 'If lost return to', the other 'I am the one'.", tags: ["funny", "matching"], garment: "tee", color: "white",
    placeholders: [{ key: "line", label: "Line", default: "If lost, return to Priya", maxLength: 28 }],
    front: [t("{line}", { font: "Permanent Marker", color: "#141416", y: 0.45, w: 0.9 })] },
  { slug: "long-distance-coords", name: "Long Distance Coordinates", collection: "couples", description: "Two cities, two sets of coordinates, one heart.", tags: ["long distance", "minimal"], garment: "crewneck", color: "ivory",
    placeholders: [{ key: "a", label: "City A", default: "Austin 30.26°N 97.74°W", maxLength: 28 }, { key: "b", label: "City B", default: "London 51.50°N 0.12°W", maxLength: 28 }],
    front: [t("{a}", { font: "Courier Prime", color: "#141416", y: 0.36, w: 0.85 }), t("♥", { font: "Bebas Neue", color: "#b7202c", y: 0.5, w: 0.1 }), t("{b}", { font: "Courier Prime", color: "#141416", y: 0.64, w: 0.85 })] },
  { slug: "wifey-hubby", name: "Wifey / Hubby", collection: "couples", description: "Honeymoon staple in soft script.", tags: ["wedding", "honeymoon"], garment: "tee", color: "pink",
    placeholders: [{ key: "word", label: "Word", default: "Wifey", maxLength: 12 }, { key: "date", label: "Date", default: "est. 06.14.26", maxLength: 16 }],
    front: [t("{word}", { font: "Dancing Script", color: "#5a1f2b", y: 0.42, w: 0.8 }), t("{date}", { font: "Rajdhani", color: "#5a1f2b", y: 0.6, w: 0.4, letterSpacing: 0.25, uppercase: true })] },
  { slug: "couple-anime-chibi", name: "Chibi Couple Portrait", collection: "couples", description: "Both of you redrawn as a chibi pair. Upload two photos in the studio.", tags: ["ai", "anime", "portrait"], garment: "crewneck", color: "white",
    aiPrompt: "Chibi kawaii anime couple holding hands, a boy and a girl with big sparkly eyes, pastel hoodies, sticker style with thick white outline, plain transparent background, no text",
    front: [img("couple-anime-chibi", { y: 0.42, w: 0.75 }), t("us.", { font: "Pacifico", color: "#141416", y: 0.86, w: 0.25 })] },
  /* anime */
  { slug: "senpai-noticed", name: "Senpai Noticed Me", collection: "anime", description: "Kanji-style typography joke on an oversized tee.", tags: ["typography", "funny"], garment: "oversized-tee", color: "black",
    front: [t("先輩", { font: "Zen Tokyo Zoo", color: "#ffffff", y: 0.36, w: 0.5 }), t("senpai noticed me", { font: "Bebas Neue", color: "#ff4fa3", y: 0.58, w: 0.85, letterSpacing: 0.08 })] },
  { slug: "training-arc", name: "Training Arc", collection: "anime", description: "Gym-meets-shonen motivational tee. Your gym on the back.", tags: ["gym", "shonen"], garment: "tee", color: "pepper",
    placeholders: [{ key: "gym", label: "Gym / crew", default: "Iron Dojo", maxLength: 16 }],
    front: [t("currently in my", { font: "Rajdhani", color: "#ffffff", y: 0.32, w: 0.6, letterSpacing: 0.2, uppercase: true }), t("training arc", { font: "Bangers", color: "#5ad1ff", y: 0.5, w: 0.9, uppercase: true })],
    back: [t("{gym}", { font: "Zen Tokyo Zoo", color: "#ffffff", y: 0.3, w: 0.8 })] },
  { slug: "mecha-pilot", name: "Mecha Pilot Unit", collection: "anime", description: "Original giant-robot pilot patch with your unit number.", tags: ["mecha", "ai", "patch"], garment: "hoodie", color: "navy",
    aiPrompt: "Original giant mecha robot head illustration, sleek white and purple armor, glowing green eyes, bold anime cel shading, square emblem composition, plain transparent background, no text",
    placeholders: [{ key: "unit", label: "Unit", default: "Unit 02", maxLength: 10 }],
    front: [img("mecha-pilot", { y: 0.4, w: 0.7 }), t("{unit} · pilot", { font: "Rajdhani", color: "#ffffff", y: 0.84, w: 0.6, letterSpacing: 0.25, uppercase: true })] },
  { slug: "magical-girl-me", name: "Magical Girl Me", collection: "anime", description: "AI restyles your selfie as a sparkly magical-girl heroine.", tags: ["ai", "portrait", "shojo"], garment: "tee", color: "orchid",
    aiPrompt: "Original 90s shojo anime magical girl portrait, long flowing pink hair, sparkles and stars, pastel sailor-style outfit, soft cel shading, plain transparent background, no text",
    front: [img("magical-girl-me", { y: 0.42, w: 0.8, aspect: 1.15 }), t("in the name of the moon", { font: "Pacifico", color: "#ffffff", y: 0.9, w: 0.8 })] },
  { slug: "ramen-club", name: "Ramen Club", collection: "anime", description: "Noodle-core camp shirt. All-over vibes, chest print.", tags: ["food", "camp shirt"], garment: "camp-shirt", color: "white",
    front: [t("ラーメン", { font: "Zen Tokyo Zoo", color: "#b7202c", y: 0.4, w: 0.9 }), t("ramen club", { font: "Bebas Neue", color: "#141416", y: 0.62, w: 0.8, letterSpacing: 0.1 })] },
  /* fandom */
  { slug: "finale-survivor", name: "I Survived The Finale", collection: "fandom", description: "Badge of honor for whatever show just ended you.", tags: ["series", "funny"], garment: "tee", color: "black",
    placeholders: [{ key: "show", label: "What ended you", default: "the finale", maxLength: 20 }],
    front: [t("i survived", { font: "Rajdhani", color: "#ffb347", y: 0.32, w: 0.6, letterSpacing: 0.25, uppercase: true }), t("{show}", { font: "Black Ops One", color: "#ffffff", y: 0.5, w: 0.9, uppercase: true }), t("and all i got was emotional damage", { font: "Courier Prime", color: "#ffffff", y: 0.68, w: 0.9 })] },
  { slug: "rewatch-club", name: "Rewatch Club", collection: "fandom", description: "Comfort-show loyalty tee with your show count.", tags: ["series", "cozy"], garment: "crewneck", color: "sand",
    placeholders: [{ key: "n", label: "Rewatch count", default: "7th rewatch", maxLength: 14 }],
    front: [t("rewatch club", { font: "Shrikhand", color: "#5a1f2b", y: 0.42, w: 0.85 }), t("{n} · no regrets", { font: "Courier Prime", color: "#5a1f2b", y: 0.6, w: 0.7 })] },
  { slug: "dungeon-dinner-club", name: "Dungeon Dinner Club", collection: "fandom", description: "Fantasy-cooking fan art: monster stew, original illustration.", tags: ["fantasy", "ai", "food"], garment: "longsleeve", color: "forest",
    aiPrompt: "Original fantasy illustration of a bubbling cauldron of stew with a dragon tail and mushrooms sticking out, cozy tavern style, warm colors, sticker style thick outline, plain transparent background, no text",
    front: [img("dungeon-dinner-club", { y: 0.4, w: 0.75 }), t("dungeon dinner club", { font: "Cinzel", color: "#f2e394", y: 0.84, w: 0.85, uppercase: true })] },
  { slug: "villain-era", name: "In My Villain Era", collection: "fandom", description: "Dramatic serif for your most unbothered season.", tags: ["funny", "era"], garment: "oversized-tee", color: "black",
    front: [t("in my", { font: "Cinzel", color: "#ffffff", y: 0.34, w: 0.4 }), t("villain era", { font: "Cinzel", color: "#b7202c", y: 0.5, w: 0.9, uppercase: true })] },
  { slug: "bias-wrecker", name: "Bias Wrecker", collection: "fandom", description: "K-pop fan tee with your group and member names.", tags: ["kpop", "fan"], garment: "tee", color: "white",
    placeholders: [{ key: "who", label: "Member / group", default: "Rumi · Huntrix", maxLength: 20 }],
    front: [t("bias wrecker", { font: "Shrikhand", color: "#ff4fa3", y: 0.42, w: 0.9 }), t("{who}", { font: "Rajdhani", color: "#141416", y: 0.6, w: 0.5, letterSpacing: 0.25, uppercase: true })] },
  /* pets */
  { slug: "cat-mom-club", name: "Cat Mom Club", collection: "pets", description: "Est. the year you got the cat. Add their names.", tags: ["cat", "typography"], garment: "crewneck", color: "pink",
    placeholders: [{ key: "names", label: "Cat names", default: "Miso & Mochi", maxLength: 22 }],
    front: [t("cat mom club", { font: "Lobster", color: "#5a1f2b", y: 0.42, w: 0.85 }), t("{names}", { font: "Rajdhani", color: "#5a1f2b", y: 0.6, w: 0.5, letterSpacing: 0.2, uppercase: true })] },
  { slug: "pet-line-art", name: "Minimal Pet Line Art", collection: "pets", description: "One-line illustration of your pet from a photo. Clean and classic.", tags: ["ai", "minimal", "line art"], garment: "heavy-tee", color: "ivory",
    aiPrompt: "Minimal continuous single-line art illustration of a sitting labrador dog, one black line on transparent background, elegant, no text",
    placeholders: [{ key: "name", label: "Pet name", default: "Luna", maxLength: 14 }],
    front: [img("pet-line-art", { y: 0.42, w: 0.7 }), t("{name}", { font: "Cinzel", color: "#141416", y: 0.84, w: 0.4 })] },
  { slug: "dog-walking-club", name: "Dog Walking Club", collection: "pets", description: "Varsity arch with your neighborhood.", tags: ["dog", "varsity"], garment: "hoodie", color: "forest",
    placeholders: [{ key: "hood", label: "Neighborhood", default: "Silver Lake", maxLength: 16 }],
    front: [t("dog walking club", { font: "Bebas Neue", color: "#ffffff", y: 0.36, w: 0.9, curve: 0.5, letterSpacing: 0.08 }), t("{hood}", { font: "Archivo Black", color: "#f2e394", y: 0.56, w: 0.7, uppercase: true }), t("rain or shine", { font: "Courier Prime", color: "#ffffff", y: 0.72, w: 0.5 })] },
  { slug: "pet-astronaut", name: "Space Pet", collection: "pets", description: "Your pet as an astronaut floating with snacks. Kid favorite.", tags: ["ai", "fun", "kids"], garment: "tee", color: "navy",
    aiPrompt: "Cute illustrated corgi astronaut floating in a white spacesuit with a bubble helmet, surrounded by stars and donuts, sticker style thick white outline, plain transparent background, no text",
    front: [img("pet-astronaut", { y: 0.42, w: 0.8 }), t("good boy in orbit", { font: "Bangers", color: "#ffffff", y: 0.88, w: 0.8 })] },
  /* family */
  { slug: "mama-est", name: "Mama Est.", collection: "family", description: "Soft script with the year you became mama and kids' initials.", tags: ["mom", "mothers day"], garment: "crewneck", color: "ivory",
    placeholders: [{ key: "year", label: "Year", default: "est. 2019", maxLength: 12 }, { key: "kids", label: "Initials", default: "L · M · T", maxLength: 16 }],
    front: [t("mama", { font: "Dancing Script", color: "#5a1f2b", y: 0.4, w: 0.6 }), t("{year}", { font: "Rajdhani", color: "#5a1f2b", y: 0.57, w: 0.35, letterSpacing: 0.25, uppercase: true }), t("{kids}", { font: "Courier Prime", color: "#5a1f2b", y: 0.68, w: 0.3 })] },
  { slug: "dad-jokes-loading", name: "Dad Jokes Loading", collection: "family", description: "Progress bar typography. 99% complete.", tags: ["dad", "funny"], garment: "tee", color: "heather",
    front: [t("dad jokes loading", { font: "Press Start 2P", color: "#141416", y: 0.4, w: 0.9 }), t("▓▓▓▓▓▓▓▓▓░ 99%", { font: "Courier Prime", color: "#b7202c", y: 0.58, w: 0.7 })] },
  { slug: "teacher-off-duty", name: "Teacher Off Duty", collection: "family", description: "Occupation humor for summer and weekends. Add your grade.", tags: ["teacher", "occupation"], garment: "tee", color: "butter",
    placeholders: [{ key: "grade", label: "Grade / subject", default: "3rd grade", maxLength: 16 }],
    front: [t("teacher", { font: "Archivo Black", color: "#141416", y: 0.36, w: 0.8, uppercase: true }), t("off duty", { font: "Pacifico", color: "#b7202c", y: 0.54, w: 0.7 }), t("{grade} · do not disturb", { font: "Courier Prime", color: "#141416", y: 0.7, w: 0.7 })] },
  { slug: "grandma-nickname", name: "Grandma Name Tee", collection: "family", description: "Nana, Gigi, Abuela, Lola. Grandkids' names on the sleeve.", tags: ["grandma", "gift"], garment: "crewneck", color: "mint",
    placeholders: [{ key: "name", label: "Grandma name", default: "Gigi", maxLength: 12 }, { key: "kids", label: "Grandkids", default: "Eli · Rosa · June", maxLength: 28 }],
    front: [t("{name}", { font: "Lobster", color: "#1f3d2b", y: 0.4, w: 0.7 }), t("{kids}", { font: "Rajdhani", color: "#1f3d2b", y: 0.58, w: 0.7, letterSpacing: 0.15, uppercase: true })] },
  { slug: "electrician-pride", name: "Skilled Trades Pride", collection: "family", description: "Electrician, plumber, welder, carpenter. Pick your trade.", tags: ["trades", "occupation"], garment: "heavy-tee", color: "pepper",
    placeholders: [{ key: "trade", label: "Trade", default: "Electrician", maxLength: 14 }, { key: "line", label: "Line", default: "powered by coffee & volts", maxLength: 28 }],
    front: [t("{trade}", { font: "Black Ops One", color: "#f2e394", y: 0.4, w: 0.9, uppercase: true }), t("{line}", { font: "Courier Prime", color: "#ffffff", y: 0.58, w: 0.8 })] },
  { slug: "soccer-mom-era", name: "Soccer Mom Era", collection: "family", description: "Sideline uniform with the kid's number on the back.", tags: ["mom", "sports"], garment: "longsleeve", color: "black",
    placeholders: [{ key: "num", label: "Jersey number", default: "10", maxLength: 3 }],
    front: [t("soccer mom era", { font: "Bangers", color: "#ffffff", y: 0.42, w: 0.9, uppercase: true }), t("loud & proud", { font: "Rajdhani", color: "#c8ff3d", y: 0.6, w: 0.45, letterSpacing: 0.25, uppercase: true })],
    back: [t("{num}", { font: "Anton", color: "#ffffff", y: 0.4, w: 0.7 })] },
  /* y2k retro */
  { slug: "butterfly-y2k", name: "Y2K Butterfly Baby Tee", collection: "y2k-retro", description: "Chrome butterfly with cursive word. Pure 2001.", tags: ["y2k", "ai", "butterfly"], garment: "tee", color: "pink",
    aiPrompt: "Y2K liquid chrome butterfly, shiny metallic silver with holographic pink and blue reflections, small sparkles, plain transparent background, no text",
    placeholders: [{ key: "word", label: "Word", default: "dreamy", maxLength: 10 }],
    front: [img("butterfly-y2k", { y: 0.4, w: 0.7 }), t("{word}", { font: "Dancing Script", color: "#5a1f2b", y: 0.82, w: 0.5 })] },
  { slug: "retro-sunset-stripes", name: "Retro Sunset Stripes", collection: "y2k-retro", description: "70s sunset bars with your city. Classic vintage wash.", tags: ["70s", "vintage"], garment: "heavy-tee", color: "sand",
    placeholders: [{ key: "city", label: "City", default: "Venice Beach", maxLength: 16 }],
    front: [t("▬▬▬▬", { font: "Archivo Black", color: "#b7202c", y: 0.3, w: 0.8 }), t("▬▬▬▬", { font: "Archivo Black", color: "#ffb347", y: 0.38, w: 0.7 }), t("▬▬▬▬", { font: "Archivo Black", color: "#f2e394", y: 0.46, w: 0.6 }), t("{city}", { font: "Shrikhand", color: "#5a1f2b", y: 0.64, w: 0.85 }), t("since 1979", { font: "Courier Prime", color: "#5a1f2b", y: 0.78, w: 0.4 })] },
  { slug: "varsity-2010", name: "Varsity 2010s", collection: "y2k-retro", description: "Collegiate arch with your name and class year.", tags: ["varsity", "2010s"], garment: "crewneck", color: "heather",
    placeholders: [{ key: "name", label: "Name", default: "Morales", maxLength: 14 }, { key: "year", label: "Year", default: "2014", maxLength: 6 }],
    front: [t("{name}", { font: "Archivo Black", color: "#1d2440", y: 0.38, w: 0.85, curve: 0.45, uppercase: true }), t("{year}", { font: "Rubik Mono One", color: "#b7202c", y: 0.6, w: 0.45 })] },
  { slug: "cassette-mixtape", name: "Mixtape Vol. 1", collection: "y2k-retro", description: "Illustrated cassette with your mixtape name on the label.", tags: ["retro", "music", "ai"], garment: "tee", color: "white",
    aiPrompt: "Retro cassette tape illustration, pastel label, slightly worn, flat vector style with thick outline, plain transparent background, no text",
    placeholders: [{ key: "title", label: "Mixtape title", default: "songs for the drive", maxLength: 22 }],
    front: [img("cassette-mixtape", { y: 0.4, w: 0.85, aspect: 0.65 }), t("{title}", { font: "Permanent Marker", color: "#141416", y: 0.72, w: 0.8 })] },
  { slug: "motel-sign", name: "Vintage Motel Sign", collection: "y2k-retro", description: "Neon-sign typography. Your name, vacancy optional.", tags: ["neon", "vintage"], garment: "longsleeve", color: "black",
    placeholders: [{ key: "name", label: "Name", default: "Zaz Motel", maxLength: 14 }],
    front: [t("{name}", { font: "Monoton", color: "#ff4fa3", y: 0.4, w: 0.9 }), t("vacancy · pool · color tv", { font: "Rajdhani", color: "#5ad1ff", y: 0.6, w: 0.7, letterSpacing: 0.2, uppercase: true })] },
  /* mental health */
  { slug: "take-up-space", name: "Take Up Space", collection: "mental-health", description: "Affirmation in a generous serif. Soft and loud.", tags: ["affirmation", "serif"], garment: "crewneck", color: "butter",
    front: [t("take up", { font: "Cinzel", color: "#141416", y: 0.38, w: 0.7 }), t("space", { font: "Cinzel", color: "#b7202c", y: 0.55, w: 0.7, uppercase: true })] },
  { slug: "social-battery-low", name: "Social Battery: Low", collection: "mental-health", description: "Introvert status report.", tags: ["introvert", "funny"], garment: "hoodie", color: "heather",
    front: [t("social battery", { font: "Rajdhani", color: "#141416", y: 0.36, w: 0.7, letterSpacing: 0.2, uppercase: true }), t("▮▯▯▯▯ 12%", { font: "Courier Prime", color: "#b7202c", y: 0.52, w: 0.6 }), t("please recharge later", { font: "Courier Prime", color: "#141416", y: 0.66, w: 0.6 })] },
  { slug: "therapy-homework", name: "Doing My Therapy Homework", collection: "mental-health", description: "Growth-era tee. Honest, a little funny.", tags: ["therapy", "growth"], garment: "tee", color: "mint",
    front: [t("doing my", { font: "Dancing Script", color: "#1f3d2b", y: 0.34, w: 0.5 }), t("therapy homework", { font: "Archivo Black", color: "#1f3d2b", y: 0.52, w: 0.9, uppercase: true })] },
  { slug: "adhd-brain-tabs", name: "47 Tabs Open", collection: "mental-health", description: "ADHD brain, visualized. Change the number.", tags: ["adhd", "funny"], garment: "tee", color: "white",
    placeholders: [{ key: "n", label: "Tab count", default: "47", maxLength: 4 }],
    front: [t("{n} tabs open", { font: "Press Start 2P", color: "#141416", y: 0.42, w: 0.9 }), t("3 are playing music · none found", { font: "Courier Prime", color: "#b7202c", y: 0.6, w: 0.85 })] },
  /* events */
  { slug: "groom-squad", name: "Groom Squad", collection: "events", description: "Bachelor party crew with city and date. Matches Bride Tribe.", tags: ["bachelor", "wedding", "group"], garment: "tee", color: "black",
    placeholders: [{ key: "role", label: "Role", default: "Groom Squad", maxLength: 14 }, { key: "where", label: "City · date", default: "Vegas · Apr 2027", maxLength: 24 }],
    front: [t("{role}", { font: "Black Ops One", color: "#ffffff", y: 0.42, w: 0.9, uppercase: true }), t("{where}", { font: "Rajdhani", color: "#c8ff3d", y: 0.6, w: 0.6, letterSpacing: 0.2, uppercase: true })] },
  { slug: "girls-trip-2027", name: "Girls Trip 2027", collection: "events", description: "Script trip tee with destination. Order for the whole group.", tags: ["travel", "group"], garment: "tee", color: "watermelon",
    placeholders: [{ key: "dest", label: "Destination", default: "Tulum", maxLength: 16 }],
    front: [t("girls trip", { font: "Dancing Script", color: "#ffffff", y: 0.38, w: 0.8 }), t("{dest} · 2027", { font: "Bebas Neue", color: "#ffffff", y: 0.58, w: 0.6, letterSpacing: 0.15 })] },
  { slug: "team-jersey-number", name: "Rec League Jersey", collection: "events", description: "Team name front, player name and number back.", tags: ["sports", "team", "numbered"], garment: "tee", color: "red",
    placeholders: [{ key: "team", label: "Team", default: "Sunday Strikers", maxLength: 18 }, { key: "player", label: "Player", default: "Okafor", maxLength: 14 }, { key: "num", label: "Number", default: "9", maxLength: 3 }],
    front: [t("{team}", { font: "Archivo Black", color: "#ffffff", y: 0.44, w: 0.9, uppercase: true, curve: 0.35 })],
    back: [t("{player}", { font: "Bebas Neue", color: "#ffffff", y: 0.18, w: 0.8, letterSpacing: 0.1 }), t("{num}", { font: "Anton", color: "#ffffff", y: 0.5, w: 0.7 })] },
  { slug: "company-retreat", name: "Company Retreat Tee", collection: "events", description: "Clean corporate-retreat tee with company name and year. Bulk pricing.", tags: ["corporate", "bulk"], garment: "tee", color: "navy",
    placeholders: [{ key: "co", label: "Company", default: "Northwind Co.", maxLength: 18 }, { key: "ev", label: "Event · year", default: "Offsite 2027", maxLength: 18 }],
    front: [t("{co}", { font: "Cinzel", color: "#ffffff", y: 0.42, w: 0.85, uppercase: true }), t("{ev}", { font: "Rajdhani", color: "#5ad1ff", y: 0.58, w: 0.5, letterSpacing: 0.25, uppercase: true })] },
  { slug: "birthday-queen", name: "Birthday Queen", collection: "events", description: "Crowned script with the age. Also: Birthday King, Birthday Boy.", tags: ["birthday"], garment: "tee", color: "pink",
    placeholders: [{ key: "title", label: "Title", default: "Birthday Queen", maxLength: 16 }, { key: "age", label: "Age", default: "25", maxLength: 3 }],
    front: [t("{title}", { font: "Shrikhand", color: "#5a1f2b", y: 0.4, w: 0.9 }), t("{age}", { font: "Rubik Mono One", color: "#ffffff", stroke: "#5a1f2b", y: 0.6, w: 0.35 })] },
  { slug: "marathon-finisher", name: "Marathon Finisher", collection: "events", description: "Race name, year and your finish time.", tags: ["running", "achievement"], garment: "longsleeve", color: "white",
    placeholders: [{ key: "race", label: "Race", default: "Chicago Marathon", maxLength: 20 }, { key: "time", label: "Finish time", default: "3:58:12", maxLength: 10 }],
    front: [t("finisher", { font: "Black Ops One", color: "#b7202c", y: 0.34, w: 0.8, uppercase: true }), t("{race}", { font: "Rajdhani", color: "#141416", y: 0.52, w: 0.8, letterSpacing: 0.15, uppercase: true }), t("{time} · 26.2", { font: "Courier Prime", color: "#141416", y: 0.68, w: 0.5 })] },
];

TEMPLATES.push(...EXTRA_TEMPLATES);

export const templateBySlug = (slug: string) =>
  TEMPLATES.find((tp) => tp.slug === slug);

export const templatesInCollection = (slug: string) =>
  TEMPLATES.filter((tp) => tp.collection === slug);

export const BESTSELLERS = TEMPLATES.filter((tp) => tp.bestseller);

/** Replace {placeholders} in template text layers. */
export function fillTemplate(layers: Layer[], values: Record<string, string>): Layer[] {
  return layers.map((l) => {
    if (l.type !== "text") return l;
    const text = l.text.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? `{${k}}`);
    return { ...l, text };
  });
}

/* ----------------------------- AI style presets --------------------------- */

export const AI_STYLES: { id: string; name: string; suffix: string }[] = [
  { id: "anime", name: "Anime / 90s cel", suffix: "90s anime cel-shaded illustration, bold outlines, vibrant colors" },
  { id: "chibi", name: "Chibi sticker", suffix: "chibi kawaii sticker style, thick white outline, pastel colors" },
  { id: "bootleg", name: "90s bootleg rap tee", suffix: "90s bootleg rap tee graphic, airbrushed, grainy, bold outlined type" },
  { id: "y2k", name: "Y2K chrome", suffix: "Y2K liquid chrome 3D graphic, metallic reflections, stars and butterflies" },
  { id: "vintage", name: "Vintage screen print", suffix: "distressed vintage screen print, limited retro palette, halftone texture" },
  { id: "renaissance", name: "Renaissance painting", suffix: "renaissance oil painting, dramatic lighting, ornate" },
  { id: "popart", name: "Pop art", suffix: "Warhol pop art screen print, high contrast, bold flat colors" },
  { id: "minimal", name: "Minimal line art", suffix: "minimal single-line art illustration, one color, clean" },
  { id: "pixel", name: "Pixel / 8-bit", suffix: "8-bit pixel art, limited palette, crisp pixels" },
  { id: "graffiti", name: "Graffiti", suffix: "wildstyle graffiti art, spray paint drips, bold colors" },
];
