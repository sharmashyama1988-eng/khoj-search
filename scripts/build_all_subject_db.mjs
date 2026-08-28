import fs from "fs";
import path from "path";

const dbDir = "f:\\Dekstop\\search engine\\db";

// 1. Physics Knowledge Base
const physics = [
  {
    id: "phys-newton-laws",
    keywords: ["newton laws of motion", "newton first law", "newton second law", "newton third law", "laws of motion", "f=ma"],
    title: "Newton's Three Laws of Motion",
    category: "Physics",
    answer: "Newton's Three Laws of Motion describe the relationship between an object's motion and the forces acting on it. First Law: Inertia; Second Law: F = ma; Third Law: Action and equal/opposite reaction.",
    highlights: [
      "1st Law (Inertia): An object remains at rest or in uniform motion unless acted upon by an external net force.",
      "2nd Law (F = ma): The acceleration of an object is directly proportional to net force and inversely proportional to its mass.",
      "3rd Law (Action-Reaction): For every action, there is an equal and opposite reaction (F_AB = -F_BA)."
    ],
    url: "https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion"
  },
  {
    id: "phys-thermodynamics",
    keywords: ["laws of thermodynamics", "first law of thermodynamics", "second law of thermodynamics", "entropy", "zeroth law"],
    title: "The Four Laws of Thermodynamics",
    category: "Physics",
    answer: "The laws of thermodynamics define fundamental physical quantities (temperature, energy, entropy) that characterize thermodynamic systems at thermal equilibrium.",
    highlights: [
      "Zeroth Law: Defines temperature and thermal equilibrium transitivity (If A=B and B=C, then A=C).",
      "1st Law (Energy Conservation): Energy cannot be created or destroyed, only transformed (Delta U = Q - W).",
      "2nd Law (Entropy): The total entropy of an isolated system always increases over time (Delta S_total >= 0).",
      "3rd Law (Absolute Zero): As temperature approaches absolute zero (0 K or -273.15 C), entropy approaches a constant minimum."
    ],
    url: "https://en.wikipedia.org/wiki/Laws_of_thermodynamics"
  },
  {
    id: "phys-relativity",
    keywords: ["theory of relativity", "special relativity", "general relativity", "e=mc2", "einstein relativity", "spacetime"],
    title: "Einstein's Theory of Relativity (Special & General)",
    category: "Physics",
    answer: "Albert Einstein's Theory of Relativity encompasses Special Relativity (1905, establishing that speed of light is constant in all frames and E = mc²) and General Relativity (1915, explaining gravity as curvature of spacetime by mass/energy).",
    highlights: [
      "Special Relativity (1905): Time dilation, length contraction, and mass-energy equivalence (E = mc²).",
      "General Relativity (1915): Gravity is not a force but geometric curvature of 4D spacetime caused by mass.",
      "Key Predictions: Gravitational lensing, gravitational time dilation, black holes, gravitational waves (confirmed by LIGO)."
    ],
    url: "https://en.wikipedia.org/wiki/Theory_of_relativity"
  },
  {
    id: "phys-quantum-mechanics",
    keywords: ["quantum mechanics", "schrodinger equation", "heisenberg uncertainty principle", "wave particle duality", "quantum physics"],
    title: "Quantum Mechanics & Fundamental Principles",
    category: "Physics",
    answer: "Quantum mechanics is the fundamental theory in physics describing nature at atomic and subatomic scales, where energy, momentum, and angular momentum are quantized.",
    highlights: [
      "Wave-Particle Duality: Matter and light exhibit behaviors of both waves and particles (De Broglie relation lambda = h/p).",
      "Heisenberg Uncertainty Principle: It is impossible to simultaneously measure position (x) and momentum (p) with arbitrary precision (Delta x * Delta p >= h_bar / 2).",
      "Schrodinger Equation: Governs the time evolution of a quantum wave function Psi(x, t)."
    ],
    url: "https://en.wikipedia.org/wiki/Quantum_mechanics"
  },
  {
    id: "phys-planck-constant",
    keywords: ["planck constant", "value of h", "plancks constant value", "planck constant joule seconds"],
    title: "Planck Constant (h)",
    category: "Physics",
    answer: "The Planck constant (h) is a fundamental physical constant defined exactly as 6.62607015 * 10^-34 Joule-seconds (J*s). It relates the energy of a photon to its frequency (E = h*f).",
    highlights: [
      "Exact Value: h = 6.62607015 * 10^-34 J*s (or m²*kg/s)",
      "Reduced Planck Constant: h_bar = h / (2*pi) approx 1.054571817 * 10^-34 J*s",
      "Formula: E = h * nu (Energy of a photon = Planck constant * frequency)"
    ],
    url: "https://en.wikipedia.org/wiki/Planck_constant"
  }
];

// 2. Economics Knowledge Base
const economics = [
  {
    id: "econ-gdp",
    keywords: ["what is gdp", "gross domestic product", "gdp definition", "how is gdp calculated", "nominal gdp vs real gdp"],
    title: "Gross Domestic Product (GDP) — Definition & Formula",
    category: "Economics",
    answer: "Gross Domestic Product (GDP) is the total monetary value of all finished goods and services produced within a country's borders in a specific time period. Formula: GDP = C + I + G + (X - M).",
    highlights: [
      "Expenditure Formula: GDP = Consumption (C) + Investment (I) + Government Spending (G) + Net Exports (X - M)",
      "Nominal vs Real GDP: Nominal measures at current market prices; Real GDP is adjusted for inflation",
      "Per Capita GDP: GDP divided by total population, indicating average standard of living"
    ],
    url: "https://en.wikipedia.org/wiki/Gross_domestic_product"
  },
  {
    id: "econ-inflation",
    keywords: ["what is inflation", "inflation definition", "cpi", "consumer price index", "causes of inflation", "hyperinflation"],
    title: "Inflation — Concept, Causes & Measurement",
    category: "Economics",
    answer: "Inflation is the general, sustained increase in the prices of goods and services in an economy over time, which reduces the purchasing power of money. Measured primarily via the Consumer Price Index (CPI).",
    highlights: [
      "Demand-Pull Inflation: Occurs when aggregate demand for goods exceeds aggregate supply ('too much money chasing too few goods').",
      "Cost-Push Inflation: Occurs when production costs rise (e.g. oil price surges, wages), decreasing supply.",
      "Control Mechanism: Central banks raise benchmark interest rates (Repo rate) to cool inflation."
    ],
    url: "https://en.wikipedia.org/wiki/Inflation"
  },
  {
    id: "econ-fiscal-vs-monetary",
    keywords: ["fiscal policy vs monetary policy", "difference between fiscal and monetary", "fiscal policy", "monetary policy", "repo rate"],
    title: "Fiscal Policy vs Monetary Policy",
    category: "Economics",
    answer: "Fiscal policy is managed by the government through taxation and public spending. Monetary policy is managed by the central bank (e.g. RBI, Federal Reserve) by controlling interest rates and money supply.",
    highlights: [
      "Fiscal Policy: Controlled by Government / Ministry of Finance via Taxes, Budget Deficits, and Infrastructure Spending.",
      "Monetary Policy: Controlled by Central Bank via Interest Rates, Reserve Ratios (CRR/SLR), and Open Market Operations.",
      "Goal: Both aim to stabilize inflation, maximize employment, and achieve economic growth."
    ],
    url: "https://en.wikipedia.org/wiki/Monetary_policy"
  },
  {
    id: "econ-supply-demand",
    keywords: ["law of supply and demand", "supply and demand", "equilibrium price", "supply curve", "demand curve"],
    title: "Law of Supply and Demand & Market Equilibrium",
    category: "Economics",
    answer: "The law of supply and demand states that in a free market, price is determined by the balance between the quantity supplied by producers and the quantity demanded by consumers, reaching an equilibrium price.",
    highlights: [
      "Law of Demand: As price rises, quantity demanded falls (inverse relationship, downward sloping curve).",
      "Law of Supply: As price rises, quantity supplied increases (direct relationship, upward sloping curve).",
      "Market Equilibrium: The price point where Quantity Demanded equals Quantity Supplied (no surplus or shortage)."
    ],
    url: "https://en.wikipedia.org/wiki/Supply_and_demand"
  }
];

// 3. AI & Machine Learning Knowledge Base
const ai = [
  {
    id: "ai-what-is-llm",
    keywords: ["what is llm", "large language model", "how llm works", "transformer model", "generative ai", "chatgpt"],
    title: "Large Language Models (LLMs) & Transformer Architecture",
    category: "Artificial Intelligence",
    answer: "A Large Language Model (LLM) is an AI neural network trained on vast text datasets to understand, reason, and generate human language. Powered by the Transformer architecture with self-attention mechanisms.",
    highlights: [
      "Core Mechanism: Self-Attention mechanism introduced in the 2017 Google paper 'Attention Is All You Need'.",
      "Training Stages: Pre-training (Next token prediction on billions of tokens) followed by RLHF / Instruction Fine-Tuning.",
      "Key Examples: Gemini (Google), GPT-4/ChatGPT (OpenAI), Claude (Anthropic), LLaMA (Meta), DeepSeek."
    ],
    url: "https://en.wikipedia.org/wiki/Large_language_model"
  },
  {
    id: "ai-neural-network",
    keywords: ["what is neural network", "artificial neural network", "deep learning", "how neural network works", "backpropagation"],
    title: "Artificial Neural Networks (ANN) & Deep Learning",
    category: "Artificial Intelligence",
    answer: "An Artificial Neural Network is a computational model inspired by biological brains, composed of interconnected layers of artificial neurons (nodes) that learn representations from data through backpropagation.",
    highlights: [
      "Layer Structure: Input Layer -> Hidden Layers (features & weights) -> Output Layer.",
      "Learning Algorithm: Backpropagation with Gradient Descent calculates loss and updates synaptic weights.",
      "Architectures: CNNs (Computer Vision), RNNs/LSTMs (Sequential data), Transformers (Language & Multi-modal)."
    ],
    url: "https://en.wikipedia.org/wiki/Artificial_neural_network"
  },
  {
    id: "ai-agi",
    keywords: ["what is agi", "artificial general intelligence", "agi definition", "difference between ai and agi"],
    title: "Artificial General Intelligence (AGI)",
    category: "Artificial Intelligence",
    answer: "Artificial General Intelligence (AGI) is a theoretical form of AI that possesses human-equivalent or superior intellectual capability across all cognitive, creative, and technical domains.",
    highlights: [
      "Narrow AI vs AGI: Current AI (Narrow) excels at specific tasks (chess, translation); AGI can generalize across any intellectual task.",
      "Key Milestones: Multimodal reasoning, autonomous agency, scientific discovery synthesis, meta-learning.",
      "Safety Research: Alignment, interpretability, reinforcement learning from human feedback (RLHF)."
    ],
    url: "https://en.wikipedia.org/wiki/Artificial_general_intelligence"
  }
];

// 4. Social Media Knowledge Base
const socialMedia = [
  {
    id: "sm-youtube",
    keywords: ["who founded youtube", "youtube founded date", "youtube founders", "most subscribed youtube channel", "mrbeast youtube"],
    title: "YouTube — Online Video Platform",
    category: "Social Media",
    answer: "YouTube was founded on February 14, 2005 by Steve Chen, Chad Hurley, and Jawed Karim. Acquired by Google in November 2006 for $1.65 billion. It is the world's largest video-sharing platform.",
    highlights: [
      "Founded: February 14, 2005 (San Mateo, California)",
      "Founders: Steve Chen, Chad Hurley, Jawed Karim",
      "First Video: 'Me at the zoo' uploaded by Jawed Karim on April 23, 2005",
      "Parent Company: Alphabet Inc. / Google"
    ],
    url: "https://en.wikipedia.org/wiki/YouTube"
  },
  {
    id: "sm-instagram",
    keywords: ["who founded instagram", "instagram founded date", "instagram founders", "meta instagram", "kevin systrom"],
    title: "Instagram — Photo & Video Sharing Platform",
    category: "Social Media",
    answer: "Instagram was founded on October 6, 2010 by Kevin Systrom and Mike Krieger. Acquired by Facebook (now Meta) in April 2012 for approximately $1 billion.",
    highlights: [
      "Launched: October 6, 2010 (iOS) and April 3, 2012 (Android)",
      "Founders: Kevin Systrom and Mike Krieger",
      "Parent Company: Meta Platforms, Inc.",
      "Key Features: Stories, Reels, Direct Messaging, IGTV"
    ],
    url: "https://en.wikipedia.org/wiki/Instagram"
  },
  {
    id: "sm-twitter-x",
    keywords: ["who founded twitter", "twitter x", "elon musk twitter", "jack dorsey", "when was twitter founded"],
    title: "X (formerly Twitter) — Microblogging Platform",
    category: "Social Media",
    answer: "Twitter was created in March 2006 by Jack Dorsey, Noah Glass, Biz Stone, and Evan Williams, launching in July 2006. Acquired by Elon Musk in October 2022 for $44 billion and rebranded to X in July 2023.",
    highlights: [
      "Founded: March 21, 2006",
      "Rebranded: Rebranded to 'X' in July 2023 by Elon Musk",
      "Original Character Limit: 140 characters (later expanded to 280, and long-form for premium)",
      "Key Features: Real-time trends, Spaces audio, Grok AI integration"
    ],
    url: "https://en.wikipedia.org/wiki/Twitter"
  }
];

// 5. Politics Knowledge Base
const politics = [
  {
    id: "pol-indian-constitution",
    keywords: ["indian constitution", "father of indian constitution", "when was indian constitution adopted", "article 370", "fundamental rights india", "dr br ambedkar"],
    title: "Constitution of India — Supreme Law of India",
    category: "Politics",
    answer: "The Constitution of India is the supreme law of India, drafted by the Constituent Assembly under drafting committee chairman Dr. B.R. Ambedkar. Adopted on 26 November 1949 and came into effect on 26 January 1950 (Republic Day).",
    highlights: [
      "Chief Architect: Dr. B. R. Ambedkar (Chairman of Drafting Committee)",
      "Adopted: 26 November 1949 (Constitution Day) | Effective: 26 January 1950 (Republic Day)",
      "Length: Longest written national constitution in the world (originally 395 articles in 22 parts)",
      "Preamble: Declares India a Sovereign, Socialist, Secular, Democratic Republic"
    ],
    url: "https://en.wikipedia.org/wiki/Constitution_of_India"
  },
  {
    id: "pol-lok-sabha-rajya-sabha",
    keywords: ["lok sabha vs rajya sabha", "parliament of india", "lok sabha seats", "rajya sabha seats", "lower house upper house"],
    title: "Parliament of India (Lok Sabha & Rajya Sabha)",
    category: "Politics",
    answer: "The Parliament of India is the bicameral legislature consisting of the President of India and two houses: the Lok Sabha (House of the People / Lower House) and the Rajya Sabha (Council of States / Upper House).",
    highlights: [
      "Lok Sabha (Lower House): Maximum 543 elected members, 5-year term, directly elected by citizens (First-past-the-post).",
      "Rajya Sabha (Upper House): Maximum 250 members (238 elected by state MLAs + 12 nominated by President), permanent body with 6-year terms (1/3rd retire every 2 years).",
      "Presiding Officers: Speaker for Lok Sabha; Vice President of India (ex-officio Chairman) for Rajya Sabha."
    ],
    url: "https://en.wikipedia.org/wiki/Parliament_of_India"
  },
  {
    id: "pol-democracy-vs-republic",
    keywords: ["difference between democracy and republic", "what is democracy", "what is republic", "types of government"],
    title: "Democracy vs Republic — Political Systems",
    category: "Politics",
    answer: "A democracy is a system of government where citizens exercise power directly or through elected representatives. A republic is a state in which supreme power is held by the people and their elected representatives, with an elected head of state (not a monarch).",
    highlights: [
      "Pure Democracy: Majority rule decides policy directly without constitutional constraints.",
      "Constitutional Republic: Power is governed by a constitution that protects minority rights from majority tyranny.",
      "Example: India and the United States are both constitutional democratic republics."
    ],
    url: "https://en.wikipedia.org/wiki/Democratic_republic"
  }
];

// 6. Technology Knowledge Base
const technology = [
  {
    id: "tech-cloud-computing",
    keywords: ["what is cloud computing", "aws vs azure vs gcp", "cloud service models", "iaas paas saas", "cloud computing definition"],
    title: "Cloud Computing (IaaS, PaaS, SaaS)",
    category: "Technology",
    answer: "Cloud computing is the on-demand availability of computer system resources—especially data storage and computing power—over the internet without direct active management by the user.",
    highlights: [
      "IaaS (Infrastructure as a Service): Renting raw virtual servers and storage (AWS EC2, Google Compute Engine).",
      "PaaS (Platform as a Service): Hardware and software tools provided over internet for building apps (AWS Elastic Beanstalk, Vercel, Heroku).",
      "SaaS (Software as a Service): Complete software accessible via browser (Google Workspace, Microsoft 365, Salesforce)."
    ],
    url: "https://en.wikipedia.org/wiki/Cloud_computing"
  },
  {
    id: "tech-semiconductor",
    keywords: ["what is semiconductor", "semiconductor chips", "moore law", "tsmc", "nanometer chip"],
    title: "Semiconductor Chips & Moore's Law",
    category: "Technology",
    answer: "Semiconductors (primarily Silicon) are materials with electrical conductivity between conductors and insulators. They form the basis of all modern microchips, CPUs, GPUs, and solar cells.",
    highlights: [
      "Moore's Law: Observation by Gordon Moore that the number of transistors on a microchip doubles roughly every two years.",
      "Modern Process Nodes: 3nm and 2nm gate-all-around (GAA) semiconductor nodes.",
      "Leading Foundry: TSMC (Taiwan Semiconductor Manufacturing Company) produces over 90% of advanced global chips."
    ],
    url: "https://en.wikipedia.org/wiki/Semiconductor"
  }
];

// Write all JSON files
fs.writeFileSync(path.join(dbDir, "physics.json"), JSON.stringify(physics, null, 2), "utf8");
fs.writeFileSync(path.join(dbDir, "economics.json"), JSON.stringify(economics, null, 2), "utf8");
fs.writeFileSync(path.join(dbDir, "ai.json"), JSON.stringify(ai, null, 2), "utf8");
fs.writeFileSync(path.join(dbDir, "social_media.json"), JSON.stringify(socialMedia, null, 2), "utf8");
fs.writeFileSync(path.join(dbDir, "politics.json"), JSON.stringify(politics, null, 2), "utf8");
fs.writeFileSync(path.join(dbDir, "technology.json"), JSON.stringify(technology, null, 2), "utf8");

console.log("✔ Successfully generated all subject knowledge files in /db!");
