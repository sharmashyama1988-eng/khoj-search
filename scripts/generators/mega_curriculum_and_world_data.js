const { saveDb } = require('../db_helper.js');

// 1. NCERT CLASS 11-12
const ncert11_12_deep = [
  {
    id: 'ncert12-maxwells-equations',
    keywords: ['maxwells four equations electromagnetism', 'gauss law magnetism amperes circuital law displacement current', 'electromagnetic waves speed c=1/sqrt(mu0 epsilon0)'],
    title: 'Maxwell\'s Four Equations of Electromagnetism',
    category: 'NCERT Physics',
    answer: 'James Clerk Maxwell unified electricity and magnetism into 4 fundamental differential/integral equations: (1) Gauss\'s Law for Electricity: ∮ E·dA = q/ε₀, (2) Gauss\'s Law for Magnetism: ∮ B·dA = 0 (no magnetic monopoles exist), (3) Faraday\'s Law: ∮ E·dl = -dΦ_B/dt, (4) Ampère-Maxwell Law with Displacement Current (I_d = ε₀ dΦ_E/dt): ∮ B·dl = μ₀(I_c + ε₀ dΦ_E/dt).',
    highlights: [
      'Predicted existence of Electromagnetic Waves propagating at speed of light: c = 1 / √(μ₀ε₀) ≈ 3.0 × 10⁸ m/s',
      'Displacement Current (I_d = ε₀ dΦ_E/dt) resolved Ampère\'s law contradiction during capacitor charging',
      'EM waves are transverse waves with E and B oscillating perpendicular to each other and to the direction of propagation (S = (1/μ₀) E × B Poynting Vector)',
      'Heinrich Hertz experimentally verified EM waves in 1887; J.C. Bose generated millimeter microwaves in Kolkata in 1895'
    ],
    url: 'https://en.wikipedia.org/wiki/Maxwell%27s_equations'
  },
  {
    id: 'ncert12-huygens-wave-theory-optics',
    keywords: ['huygens wave theory of light', 'wavefront secondary wavelets', 'youngs double slit experiment ydse interference', 'diffraction single slit central maxima'],
    title: 'Wave Optics — Huygens\' Principle, Interference & Diffraction',
    category: 'NCERT Physics',
    answer: 'Huygens\' Principle states that every point on a wavefront acts as a secondary source of spherical wavelets spreading in all directions at the wave speed. Young\'s Double Slit Experiment (YDSE) demonstrates wave interference: Fringe width β = λD / d. Single-slit diffraction produces a central maximum of angular width 2λ/a.',
    highlights: [
      'YDSE Fringe Width: β = λD/d (where λ=wavelength, D=screen distance, d=slit separation; bright and dark fringes have equal width)',
      'YDSE Constructive Interference (Bright): Path difference Δx = nλ (n = 0, 1, 2...); Destructive (Dark): Δx = (2n-1)λ/2',
      'Single-slit Diffraction Minima condition: a sinθ = nλ; Central maximum width = 2λD/a (twice the width of secondary maxima)',
      'Brewster\'s Law (Polarization by Reflection): tan(i_p) = μ (reflected ray is 100% plane-polarized and perpendicular to refracted ray)'
    ],
    url: 'https://en.wikipedia.org/wiki/Wave_optics'
  },
  {
    id: 'ncert12-thermodynamics-carnot-engine',
    keywords: ['carnot engine efficiency formula', 'second law of thermodynamics entropy', 'reversible heat engine carnot cycle', 'kelvin planck clausius statement'],
    title: 'Thermodynamics — Carnot Engine Efficiency & Second Law',
    category: 'NCERT Physics',
    answer: 'The Carnot Cycle is an idealized reversible thermodynamic cycle operating between two temperatures (Hot source T_H and Cold sink T_C). Carnot Efficiency: η = 1 - (T_C / T_H) = (T_H - T_C) / T_H (using absolute temperatures in Kelvin). Carnot\'s Theorem proves that no heat engine operating between two given temperatures can be more efficient than a Carnot engine.',
    highlights: [
      'Carnot Cycle 4 Steps: (1) Isothermal Expansion at T_H, (2) Reversible Adiabatic Expansion, (3) Isothermal Compression at T_C, (4) Reversible Adiabatic Compression',
      'Carnot Efficiency η depends strictly on source and sink temperatures: η = 1 - T_C/T_H < 100% (100% efficiency requires T_C = 0 K / Absolute Zero)',
      'Kelvin-Planck Statement: It is impossible to construct a heat engine that absorbs heat and converts 100% of it into work with no other effect',
      'Clausius Statement: Heat cannot spontaneously flow from a cooler body to a warmer body without external work input',
      'Entropy (S): Measure of molecular disorder; for any spontaneous irreversible process, universe entropy increases: ΔS_universe > 0'
    ],
    url: 'https://en.wikipedia.org/wiki/Carnot_heat_engine'
  },
  {
    id: 'ncert12-nuclear-physics-fission-fusion',
    keywords: ['nuclear fission vs nuclear fusion', 'mass defect binding energy per nucleon curve', 'einstein mass energy equivalence e=mc2', 'uranium fission chain reaction'],
    title: 'Nuclear Physics — Binding Energy Curve, Fission & Fusion',
    category: 'NCERT Physics',
    answer: 'Nuclear binding energy is the energy required to disassemble a nucleus into constituent protons and neutrons, calculated from mass defect Δm via Einstein\'s mass-energy equation: E = Δm · c² (where 1 amu = 931.5 MeV). Binding Energy per Nucleon (BE/A) peaks at Iron-56 (Fe-56, ~8.75 MeV/nucleon), making it the most stable nucleus. Nuclear Fission (splitting heavy nuclei like U-235) and Nuclear Fusion (merging light nuclei like H-2 + H-3 → He-4 + n + 17.6 MeV in the Sun) both release immense energy by moving toward the Fe-56 stability peak.',
    highlights: [
      'Mass Defect: Δm = [Z·m_p + (A-Z)·m_n] - M_nucleus; Binding Energy BE = Δm · 931.5 MeV',
      'Nuclear Fission of Uranium-235: ²³⁵U + n → ¹⁴⁴Ba + ⁸⁹Kr + 3n + ~200 MeV energy (multiplies exponentially in uncontrolled chain reaction)',
      'Controlled Fission in Nuclear Reactors: Control rods (Cadmium/Boron absorb neutrons) and Moderator (Heavy water D₂O / Graphite slows neutrons to thermal speeds)',
      'Nuclear Fusion in Stars: Proton-Proton chain and CNO cycle fuse hydrogen into helium at core temperatures > 15 million K'
    ],
    url: 'https://en.wikipedia.org/wiki/Nuclear_physics'
  }
];

// 2. BIOGRAPHIES EXPANSION
const biographiesExpanded = [
  {
    id: 'bio-subhash-chandra-bose',
    keywords: ['netaji subhas chandra bose biography', 'ina indian national army azad hind fauj', 'give me blood i will give you freedom', 'dilli chalo slogan netaji'],
    title: 'Netaji Subhas Chandra Bose — Azad Hind Fauj Leader',
    category: 'Biography',
    answer: 'Netaji Subhas Chandra Bose (23 January 1897 – 18 August 1945) was a charismatic nationalist leader who sought India\'s complete independence from British colonial rule. He served as Congress President (1938 Haripura, 1939 Tripuri) and founded the All India Forward Bloc before escaping house arrest in 1941. In Singapore, he assumed leadership of the Indian National Army (INA / Azad Hind Fauj) with iconic slogans "Give me blood, and I shall give you freedom!" and "Dilli Chalo!".',
    highlights: [
      'Born 23 January 1897 in Cuttack, Odisha (celebrated annually as Parakram Diwas)',
      'Passed prestigious Indian Civil Service (ICS) examination in England in 1920 but resigned to join freedom struggle',
      'Established Provisional Government of Free India (Azad Hind) in Singapore on 21 October 1943 with Japanese support',
      'Formed Rani of Jhansi Regiment (one of the world\'s first all-female combat military units led by Captain Lakshmi Sahgal)'
    ],
    url: 'https://en.wikipedia.org/wiki/Subhas_Chandra_Bose'
  },
  {
    id: 'bio-bhagat-singh',
    keywords: ['shaheed bhagat singh biography', 'inqilab zindabad slogan bhagat singh', 'lahore conspiracy case 23 march 1931', 'hsra hindustan socialist republican association'],
    title: 'Shaheed Bhagat Singh — Revolutionary Freedom Fighter',
    category: 'Biography',
    answer: 'Shaheed Bhagat Singh (28 September 1907 – 23 March 1931) was an iconic Indian socialist revolutionary who popularized the slogan "Inquilab Zindabad!" (Long Live the Revolution!). A key leader of the HSRA (Hindustan Socialist Republican Association), he assassinated British police officer John Saunders in 1928 to avenge the death of Lala Lajpat Rai and threw non-lethal smoke bombs into the Central Legislative Assembly on 8 April 1929 "to make the deaf hear". He was executed by hanging in Lahore Central Jail on 23 March 1931 at age 23 (Martyrs\' Day / Shaheed Diwas).',
    highlights: [
      'Born in Banga village (Lyallpur, Punjab) to a patriotic Sikh family',
      'Formed Naujawan Bharat Sabha in 1926 to mobilize youth and workers across communal divides',
      'Maintained a historic 116-day hunger strike in Lahore Central Jail demanding equal rights for political prisoners',
      'Authored influential philosophical essay "Why I Am an Atheist" in jail (1930)',
      'Martyred on 23 March 1931 alongside comrades Shivaram Rajguru and Sukhdev Thapar'
    ],
    url: 'https://en.wikipedia.org/wiki/Bhagat_Singh'
  },
  {
    id: 'bio-srinivasa-ramanujan',
    keywords: ['srinivasa ramanujan mathematician biography', 'ramanujan hardy 1729 taxicab number', 'mock theta functions modular forms', 'national mathematics day 22 december'],
    title: 'Srinivasa Ramanujan — Mathematical Genius',
    category: 'Biography',
    answer: 'Srinivasa Ramanujan FRS (22 December 1887 – 26 April 1920) was a legendary Indian mathematician who made extraordinary contributions to mathematical analysis, number theory, infinite series, continued fractions, and mock theta functions with almost no formal training in pure mathematics. Collaborated with G.H. Hardy at Cambridge University from 1914. His birthday, 22 December, is celebrated in India as National Mathematics Day.',
    highlights: [
      'Born in Erode, Tamil Nadu; discovered thousands of groundbreaking formulas independently in his notebooks',
      'Elected Fellow of the Royal Society (FRS) in 1918 at age 30, becoming one of the youngest Fellows in history and first Indian elected Trinity College Fellow',
      'Ramanujan-Hardy Number 1729: Smallest integer expressible as the sum of two cubes in two different ways (1729 = 1³ + 12³ = 9³ + 10³)',
      'Ramanujan\'s formulas for π (e.g. series converging at 8 decimal digits per term) form the basis of modern supercomputer algorithms'
    ],
    url: 'https://en.wikipedia.org/wiki/Srinivasa_Ramanujan'
  },
  {
    id: 'bio-sam-manekshaw',
    keywords: ['field marshal sam manekshaw biography', '1971 indo pak war liberation of bangladesh', 'first field marshal of india sam bahadur', '93000 pakistani soldiers surrender'],
    title: 'Field Marshal Sam Manekshaw (Sam Bahadur) — Military Legend',
    category: 'Biography',
    answer: 'Field Marshal Sam Hormusji Framji Jamshedji Manekshaw MC (3 April 1914 – 27 June 2008), popularly known as "Sam Bahadur", was the Chief of the Army Staff of the Indian Army who masterminded India\'s decisive victory in the 1971 Indo-Pakistani War, leading to the liberation of Bangladesh and the unconditional surrender of 93,000 Pakistani soldiers under General A.A.K. Niazi (the largest military surrender since World War II). He became India\'s first Field Marshal on 1 January 1973.',
    highlights: [
      'Commissioned from the first batch of the Indian Military Academy (IMA), Dehradun in 1934',
      'Awarded Military Cross (MC) for gallantry in Burma during World War II after surviving 9 bullet wounds to his torso',
      'Planned 1971 military campaign across 3 fronts with meticulous logistics, air superiority, and Mukti Bahini coordination over 13 days',
      'Awarded Padma Vibhushan (1972) and elevated to 5-star rank of Field Marshal in 1973'
    ],
    url: 'https://en.wikipedia.org/wiki/Sam_Manekshaw'
  }
];

// 3. ARTIFICIAL INTELLIGENCE & TECHNOLOGY
const aiDeepEntries = [
  {
    id: 'ai-diffusion-models-image-generation',
    keywords: ['diffusion models stable diffusion dall-e', 'forward and reverse diffusion process score based generative modeling', 'classifier free guidance u-net noise predictor', 'text to image generative ai'],
    title: 'Diffusion Models & Latent Diffusion Architecture',
    category: 'Artificial Intelligence',
    answer: 'Diffusion Models (DDPM, Score-based SDEs, Stable Diffusion) generate high-fidelity images, audio, and video via a two-stage process: (1) Forward Process adds Gaussian noise incrementally to data until it becomes pure isotropic Gaussian noise, (2) Reverse Process trains a U-Net / Diffusion Transformer (DiT) with cross-attention to iteratively predict and remove noise conditioned on text prompts. Latent Diffusion Models (LDMs) run the diffusion process in compressed latent space using a VQ-VAE / autoencoder, reducing compute costs by orders of magnitude.',
    highlights: [
      'Forward SDE / Markov Chain: q(x_t | x_{t-1}) = N(x_t; √(1 - β_t) x_{t-1}, β_t I)',
      'Reverse Denoising: Trained U-Net / DiT predicts added noise ε_θ(x_t, t, c) parameterized by timestep t and text conditioning c',
      'Classifier-Free Guidance (CFG): Linearly extrapolates conditioned prediction away from unconditioned prediction: ε_guided = ε_uncond + w · (ε_cond - ε_uncond)',
      'Powers state-of-the-art generators: Midjourney, Stable Diffusion, DALL-E 3, Sora video generator, Imagen'
    ],
    url: 'https://en.wikipedia.org/wiki/Diffusion_model'
  },
  {
    id: 'ai-reinforcement-learning-ppo-mcts',
    keywords: ['reinforcement learning ppo proximal policy optimization', 'monte carlo tree search mcts alphago', 'markov decision process mdp bellman equation', 'q learning policy gradient'],
    title: 'Reinforcement Learning — Bellman Equation, PPO & MCTS',
    category: 'Artificial Intelligence',
    answer: 'Reinforcement Learning (RL) trains agents to maximize cumulative rewards in a Markov Decision Process (MDP: S, A, P, R, γ) via the Bellman Equation: V(s) = max_a [R(s,a) + γ Σ P(s\'|s,a) V(s\')]. Proximal Policy Optimization (PPO, Schulman 2017) stabilizes policy gradient updates using a clipped surrogate objective to prevent destructively large policy changes. Monte Carlo Tree Search (MCTS) combined with deep neural networks enabled AlphaGo to defeat world champions in Go.',
    highlights: [
      'PPO Clipped Objective: L_CLIP(θ) = E [ min( r_t(θ) A_t, clip(r_t(θ), 1 - ε, 1 + ε) A_t ) ] where r_t(θ) = π_θ(a_t|s_t) / π_old(a_t|s_t)',
      'Actor-Critic Architecture: Actor updates action policy π(a|s); Critic estimates state-value function V(s) to compute advantage A(s,a) = Q(s,a) - V(s)',
      'MCTS 4 Steps: (1) Selection (UCB1 tree traversal), (2) Expansion, (3) Simulation / Evaluation (neural network rollout), (4) Backpropagation',
      'Foundation of AlphaGo, AlphaZero, OpenAI o1/o3 reasoning models, and LLM RLHF alignment'
    ],
    url: 'https://en.wikipedia.org/wiki/Reinforcement_learning'
  }
];

saveDb('ncert_class11_12.json', ncert11_12_deep);
saveDb('biographies.json', biographiesExpanded);
saveDb('ai.json', aiDeepEntries);