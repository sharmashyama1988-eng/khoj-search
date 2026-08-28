const { saveDb } = require('./db_helper.js');

const ncert11_12_entries = [
  // --- PHYSICS 11-12 ---
  {
    id: 'ncert12-coulombs-law',
    keywords: ['coulombs law formula', 'electrostatic force constant', 'permittivity of free space epsilon naught', 'electrostatics class 12'],
    title: 'Coulomb\'s Law of Electrostatics',
    category: 'NCERT Physics',
    answer: 'Coulomb\'s Law states that the electrostatic force (F) between two point charges q₁ and q₂ separated by distance r is F = (1 / 4πε₀) · (|q₁q₂| / r²), where ε₀ = 8.854 × 10⁻¹² C²/(N·m²) and 1/(4πε₀) ≈ 8.988 × 10⁹ N·m²/C².',
    highlights: ['Inverse square law: Force is directly proportional to product of charges and inversely proportional to r²', 'Vector form: F₁₂ = -F₂₁ (obeys Newton\'s Third Law)', 'Dielectric medium of constant K reduces force by factor K: F_med = F_vac / K', 'Valid strictly for static point charges in vacuum or uniform dielectric'],
    url: 'https://en.wikipedia.org/wiki/Coulomb%27s_law'
  },
  {
    id: 'ncert12-gauss-law',
    keywords: ['gauss law electrostatics', 'electric flux formula', 'closed surface integral electric field', 'gauss theorem applications'],
    title: 'Gauss\'s Law in Electrostatics',
    category: 'NCERT Physics',
    answer: 'Gauss\'s Law states that the total electric flux (Φ_E) through any closed Gaussian surface equals the net charge enclosed (q_enc) divided by the permittivity of free space: ∮ E · dA = q_enc / ε₀.',
    highlights: ['One of Maxwell\'s four fundamental equations of electromagnetism', 'Electric field due to infinite line charge: E = λ / (2πε₀r)', 'Electric field due to infinite plane sheet of charge: E = σ / (2ε₀) (independent of distance)', 'Electric field inside a uniformly charged conducting sphere or hollow shell is ZERO (E = 0)'],
    url: 'https://en.wikipedia.org/wiki/Gauss%27s_law'
  },
  {
    id: 'ncert12-faraday-lenz-law',
    keywords: ['faradays laws of electromagnetic induction', 'lenzs law direction', 'induced emf formula', 'e=-dphi/dt emi'],
    title: 'Faraday\'s and Lenz\'s Laws of Electromagnetic Induction',
    category: 'NCERT Physics',
    answer: 'Faraday\'s Law states that the magnitude of induced electromotive force (EMF) is proportional to the time rate of change of magnetic flux: ε = -dΦ_B/dt. Lenz\'s Law (represented by the negative sign) states that the induced current always flows in such a direction as to oppose the change in flux producing it (consequence of conservation of energy).',
    highlights: ['Magnetic Flux: Φ_B = B · A · cosθ (measured in Webers; 1 Wb = 1 T·m²)', 'Induced EMF in a rotating coil: ε = NBAω sin(ωt) (foundation of AC generators)', 'Self-inductance (L): Induced EMF ε = -L(dI/dt) (measured in Henrys)', 'Mutual inductance (M): ε₂ = -M(dI₁/dt) (foundation of electrical transformers)'],
    url: 'https://en.wikipedia.org/wiki/Faraday%27s_law_of_induction'
  },
  {
    id: 'ncert12-photoelectric-effect',
    keywords: ['photoelectric effect equation', 'einsteins photoelectric equation', 'work function threshold frequency', 'photon energy hf', 'nobel prize einstein'],
    title: 'Einstein\'s Photoelectric Effect & Equation',
    category: 'NCERT Physics',
    answer: 'Einstein\'s Photoelectric Equation: K_max = hν - Φ₀ = hc/λ - hν₀, where hν is photon energy, Φ₀ = hν₀ is the work function of the metal, and K_max is the maximum kinetic energy of emitted photoelectrons. Albert Einstein won the 1921 Nobel Prize in Physics for explaining this phenomenon.',
    highlights: ['Emission occurs instantaneously (< 10⁻⁹ s) if light frequency ν ≥ threshold frequency ν₀', 'Number of photoelectrons emitted per second is directly proportional to light INTENSITY', 'Maximum kinetic energy depends strictly on light FREQUENCY, completely independent of intensity', 'Provides definitive experimental proof of the particle/photon nature of light (E = hν, where h = 6.626 × 10⁻³⁴ J·s)'],
    url: 'https://en.wikipedia.org/wiki/Photoelectric_effect'
  },
  {
    id: 'ncert12-bohr-model',
    keywords: ['bohr model of hydrogen atom', 'bohr radius 0.529 angstrom', 'rydberg formula hydrogen spectrum', 'quantized angular momentum nh/2pi'],
    title: 'Bohr\'s Model of the Hydrogen Atom (1913)',
    category: 'NCERT Physics',
    answer: 'Niels Bohr postulated that electrons revolve in non-radiating discrete circular orbits where orbital angular momentum is quantized: L = mvr = nh / 2π (n = 1, 2, 3...). Energy of electron in nth orbit: E_n = -13.6 / n² eV. Radius of nth orbit: r_n = 0.529 · n² / Z Å.',
    highlights: ['Bohr radius for hydrogen (n=1, Z=1): a₀ = 0.529 Å (0.0529 nm)', 'Ground state energy of hydrogen: E₁ = -13.6 eV; Ionization energy = +13.6 eV', 'Hydrogen Spectral Series: Lyman (UV, n₁=1), Balmer (Visible, n₁=2), Paschen (IR, n₁=3), Brackett (IR, n₁=4), Pfund (IR, n₁=5)', 'Rydberg formula: 1/λ = R_H · Z² · (1/n₁² - 1/n₂²), where R_H ≈ 1.097 × 10⁷ m⁻¹'],
    url: 'https://en.wikipedia.org/wiki/Bohr_model'
  },
  {
    id: 'ncert12-pn-junction-transistor',
    keywords: ['pn junction diode working', 'forward and reverse bias', 'npn pnp transistor operation', 'rectifier half wave full wave'],
    title: 'Semiconductor Devices — P-N Junctions and Transistors',
    category: 'NCERT Physics',
    answer: 'A P-N junction diode forms a depletion region with a barrier potential (~0.7 V for Si, ~0.3 V for Ge). Forward bias reduces the barrier allowing high current; reverse bias widens the barrier, blocking current (used for rectification). A BJT (Bipolar Junction Transistor) has Emitter, Base, and Collector terminals functioning as an amplifier or electronic switch.',
    highlights: ['Forward bias: P to positive terminal, N to negative — conducts with exponential current rise', 'Reverse bias: P to negative, N to positive — only tiny microampere leakage current flows until Zener breakdown', 'Zener diode: Operates in reverse breakdown as a precise voltage regulator', 'Half-wave rectifier efficiency = 40.6%; Full-wave center-tapped/bridge rectifier efficiency = 81.2%'],
    url: 'https://en.wikipedia.org/wiki/P%E2%80%93n_junction'
  },

  // --- CHEMISTRY 11-12 ---
  {
    id: 'ncert12-chemical-equilibrium',
    keywords: ['le chateliers principle', 'chemical equilibrium constant kc kp', 'equilibrium reaction conditions', 'haber process equilibrium'],
    title: 'Chemical Equilibrium and Le Chatelier\'s Principle',
    category: 'NCERT Chemistry',
    answer: 'Chemical equilibrium is a dynamic state where the rate of forward reaction equals the rate of reverse reaction. Le Chatelier\'s Principle states that if a dynamic equilibrium is disturbed by changing temperature, pressure, or concentration, the system adjusts to counteract the change.',
    highlights: ['Equilibrium constant relation: K_p = K_c · (RT)^(Δn_g), where Δn_g = moles of gaseous products - moles of gaseous reactants', 'Haber Process for Ammonia: N₂(g) + 3H₂(g) ⇌ 2NH₃(g) + 92.4 kJ (exothermic; favored by high pressure ~200 atm and moderate temp ~450°C with Fe catalyst)', 'Catalyst accelerates rate of both forward and backward reactions equally without shifting equilibrium position K_eq', 'Adding inert gas at constant volume has NO effect on equilibrium'],
    url: 'https://en.wikipedia.org/wiki/Le_Chatelier%27s_principle'
  },
  {
    id: 'ncert12-electrochemistry-nernst',
    keywords: ['nernst equation formula', 'standard electrode potential', 'galvanic cell emf', 'faradays laws of electrolysis'],
    title: 'Electrochemistry — Nernst Equation and Galvanic Cells',
    category: 'NCERT Chemistry',
    answer: 'The Nernst Equation calculates cell potential under non-standard conditions: E_cell = E°_cell - (2.303 RT / nF) · log₁₀(Q). At 298 K (25°C): E_cell = E°_cell - (0.0591 / n) · log₁₀(Q). Standard hydrogen electrode (SHE) is assigned E° = 0.00 V as universal reference.',
    highlights: ['Galvanic cell converts chemical energy to electrical energy: Anode is negative (Oxidation), Cathode is positive (Reduction) [AnOx - RedCat]', 'Gibbs Free Energy relation: ΔG° = -nFE°_cell = -2.303 RT log₁₀(K_eq)', 'Faraday\'s First Law: Mass deposited m = Z · I · t, where Z is electrochemical equivalent (Z = M / (nF))', '1 Faraday (F) = 96,485 Coulombs (charge on 1 mole of electrons)'],
    url: 'https://en.wikipedia.org/wiki/Nernst_equation'
  },
  {
    id: 'ncert12-chemical-kinetics',
    keywords: ['chemical kinetics order of reaction', 'rate law rate constant k', 'arrhenius equation activation energy', 'half life first order reaction'],
    title: 'Chemical Kinetics — Rate Laws and Arrhenius Equation',
    category: 'NCERT Chemistry',
    answer: 'Chemical kinetics studies reaction rates and mechanisms. For a First Order reaction: Rate = k[A]¹, integrated rate law k = (2.303/t) · log₁₀([A]₀/[A]), and half-life t₁/₂ = 0.693 / k (independent of initial concentration). Arrhenius Equation: k = A · e^(-E_a / RT).',
    highlights: ['Zero order: Rate = k; t₁/₂ = [A]₀ / (2k) (half-life directly proportional to initial concentration)', 'First order: Half-life t₁/₂ = ln(2)/k ≈ 0.693/k (constant, used in radioactive decay)', 'Arrhenius equation linear form: ln(k₂/k₁) = (E_a / R) · (1/T₁ - 1/T₂)', 'Pseudo-first-order: High excess of one reactant makes second-order reaction behave as first-order (e.g. acid hydrolysis of ester)'],
    url: 'https://en.wikipedia.org/wiki/Chemical_kinetics'
  },
  {
    id: 'ncert12-coordination-compounds',
    keywords: ['coordination compounds werners theory', 'crystal field theory cft', 'spectrochemical series ligands', 'iupac naming coordination complexes'],
    title: 'Coordination Compounds and Crystal Field Theory',
    category: 'NCERT Chemistry',
    answer: 'Coordination compounds consist of a central transition metal atom or ion bonded to surrounding electron-donating ligands via coordinate covalent bonds. Crystal Field Theory (CFT) explains colour and magnetism via d-orbital splitting in octahedral (t₂g and e_g) and tetrahedral geometries.',
    highlights: ['Werner\'s Theory (1893): Primary valency is ionizable (oxidation state); Secondary valency is non-ionizable (coordination number)', 'Octahedral splitting: Five d-orbitals split into lower energy triplet t₂g (d_xy, d_yz, d_zx) and higher energy doublet e_g (d_x²-y², d_z²)', 'Spectrochemical series (increasing ligand field strength): I⁻ < Br⁻ < Cl⁻ < F⁻ < OH⁻ < H₂O < NH₃ < en < CN⁻ < CO', 'Strong field ligands (CN⁻, CO) cause pairing of electrons (low spin complexes); weak field ligands form high spin complexes'],
    url: 'https://en.wikipedia.org/wiki/Coordination_complex'
  },
  {
    id: 'ncert12-organic-reactions-named',
    keywords: ['aldol condensation mechanism', 'cannizzaro reaction', 'wurtz reaction', 'reimer tiemann reaction', 'kolbe reaction organic chemistry'],
    title: 'Key Named Reactions in Organic Chemistry',
    category: 'NCERT Chemistry',
    answer: 'Crucial organic named reactions include: (1) Aldol Condensation (aldehydes/ketones with α-hydrogen in dilute base form β-hydroxy aldehydes), (2) Cannizzaro Reaction (aldehydes without α-hydrogen in conc. base undergo disproportionation), (3) Reimer-Tiemann Reaction (phenol + CHCl3 + aq NaOH yields salicylaldehyde), (4) Kolbe Reaction (phenol + CO2 + NaOH yields salicylic acid).',
    highlights: ['Wurtz Reaction: 2R-X + 2Na (in dry ether) → R-R + 2NaX (synthesizes symmetrical higher alkanes)', 'Clemmensen Reduction: Carbonyl (C=O) + Zn-Hg/conc. HCl → CH₂ (methylene group)', 'Wolff-Kishner Reduction: Carbonyl + Hydrazine (NH₂NH₂) + KOH/ethylene glycol → CH₂', 'Friedel-Crafts Alkylation/Acylation: Benzene + R-X (with anhydrous AlCl₃ catalyst) → Alkylbenzene / Acylbenzene'],
    url: 'https://en.wikipedia.org/wiki/List_of_organic_reactions'
  },

  // --- BIOLOGY 11-12 ---
  {
    id: 'ncert12-dna-structure-replication',
    keywords: ['watson and crick dna double helix', 'dna replication semiconservative', 'chargaffs rule base pairing', 'central dogma of molecular biology'],
    title: 'DNA Double Helix, Chargaff\'s Rule & Replication',
    category: 'NCERT Biology',
    answer: 'James Watson and Francis Crick (1953) elucidated the DNA double helix based on Rosalind Franklin\'s X-ray diffraction. Chargaff\'s Rules state: [A] = [T] and [G] = [C] with purines = pyrimidines. DNA replicates semi-conservatively (demonstrated by Meselson and Stahl in 1958 using ¹⁵N isotope).',
    highlights: ['Double helix has right-handed antiparallel strands (5\'→3\' and 3\'→5\') with pitch = 3.4 nm and 10 bp per turn', 'Adenine pairs with Thymine via 2 hydrogen bonds (A=T); Guanine pairs with Cytosine via 3 hydrogen bonds (G≡C)', 'Central Dogma (Crick): DNA → (Transcription) → mRNA → (Translation) → Protein; Reverse transcription occurs in retroviruses', 'Key replication enzymes: Helicase (unwinds DNA), Primase (RNA primer), DNA Polymerase III (synthesizes 5\'→3\'), Ligase (joins Okazaki fragments)'],
    url: 'https://en.wikipedia.org/wiki/Molecular_biology'
  },
  {
    id: 'ncert12-biotechnology-pcr-r-dna',
    keywords: ['pcr polymerase chain reaction steps', 'restriction enzymes molecular scissors', 'recombinant dna technology', 'gel electrophoresis dna'],
    title: 'Biotechnology — Recombinant DNA and PCR',
    category: 'NCERT Biology',
    answer: 'Recombinant DNA technology uses Restriction Endonucleases ("molecular scissors" discovering palindromic recognition sequences) and DNA ligase to insert foreign genes into cloning vectors (e.g. pBR322). Polymerase Chain Reaction (PCR, invented by Kary Mullis in 1983) amplifies DNA billions of times using Taq polymerase across 3 steps: Denaturation (94°C), Annealing (~54°C), and Extension (72°C).',
    highlights: ['Restriction endonucleases cut specific palindromic sequences (e.g. EcoRI cuts 5\'-GAATTC-3\') producing sticky ends', 'Agarose gel electrophoresis separates DNA fragments by size toward positive anode (DNA is negatively charged)', 'PCR cycles: Denaturation (strands separate at 94°C) → Annealing (primers bind at ~55°C) → Extension (Taq polymerase from Thermus aquaticus extends at 72°C)', 'Applications: Bt cotton (pest resistance via cry genes), recombinant human insulin (Humulin by Eli Lilly in 1983), Gene therapy for ADA deficiency (1990)'],
    url: 'https://en.wikipedia.org/wiki/Polymerase_chain_reaction'
  },
  {
    id: 'ncert12-human-reproduction',
    keywords: ['human reproduction gametogenesis', 'spermatogenesis oogenesis', 'menstrual cycle hormones lh surge', 'fertilization blastocyst implantation'],
    title: 'Human Reproduction and Menstrual Cycle Hormones',
    category: 'NCERT Biology',
    answer: 'Human reproduction is viviparous and sexual. Spermatogenesis in testes seminiferous tubules produces 4 viable spermatozoa from 1 spermatogonium. Oogenesis produces 1 ovum and 2-3 polar bodies. The 28-day menstrual cycle is regulated by GnRH, FSH, LH, Estrogen, and Progesterone; LH surge on day 14 triggers ovulation.',
    highlights: ['Follicular phase (days 1-13): FSH stimulates follicle growth; Estrogen thickens endometrium', 'Ovulatory phase (day 14): Rapid LH surge causes rupture of Graafian follicle and release of secondary oocyte', 'Luteal phase (days 15-28): Corpus luteum secretes high Progesterone to maintain uterine lining for pregnancy', 'Fertilization occurs in the Ampullary-isthmic junction of Fallopian tube; Blastocyst implants in endometrium ~7 days post-fertilization'],
    url: 'https://en.wikipedia.org/wiki/Human_reproduction'
  },

  // --- MATHEMATICS 11-12 ---
  {
    id: 'ncert12-calculus-continuity-differentiability',
    keywords: ['continuity differentiability definition', 'rolles theorem mean value theorem lmvt', 'limits continuity calculus class 12'],
    title: 'Continuity, Differentiability, and Mean Value Theorems',
    category: 'NCERT Mathematics',
    answer: 'A function f(x) is continuous at x=c if lim(x→c) f(x) = f(c). Differentiability implies continuity (converse is not true, e.g. f(x)=|x| is continuous but not differentiable at x=0). Rolle\'s Theorem states if f is continuous on [a,b], differentiable on (a,b), and f(a)=f(b), then ∃ c ∈ (a,b) where f\'(c) = 0. Lagrange\'s Mean Value Theorem (LMVT): f\'(c) = [f(b) - f(a)] / (b - a).',
    highlights: ['Differentiability test: Left-hand derivative (LHD) must equal Right-hand derivative (RHD)', 'LMVT: Geometrically means tangent at some point c is parallel to the secant joining (a,f(a)) and (b,f(b))', 'Indeterminate forms: 0/0, ∞/∞, 0·∞, ∞-∞, 0⁰, ∞⁰, 1^∞ — evaluated using L\'Hôpital\'s Rule: lim f(x)/g(x) = lim f\'(x)/g\'(x)', 'Intermediate Value Theorem: Continuous function on [a,b] takes every value between f(a) and f(b)'],
    url: 'https://en.wikipedia.org/wiki/Mean_value_theorem'
  },
  {
    id: 'ncert12-vector-3d-geometry',
    keywords: ['dot product cross product vector algebra', 'direction cosines ratios 3d line', 'shortest distance between skew lines', 'plane equation 3d geometry'],
    title: 'Vector Algebra and Three-Dimensional (3D) Geometry',
    category: 'NCERT Mathematics',
    answer: 'Vectors: Dot product a · b = |a||b| cosθ (scalar; zero if perpendicular); Cross product a × b = |a||b| sinθ n̂ (vector; magnitude gives area of parallelogram). In 3D geometry, direction cosines satisfy l² + m² + n² = 1. Shortest distance between two skew lines r = a₁ + λb₁ and r = a₂ + μb₂ is d = |(a₂ - a₁) · (b₁ × b₂)| / |b₁ × b₂|.',
    highlights: ['Vector triple product: a × (b × c) = (a · c)b - (a · b)c', 'Scalar triple product: [a b c] = a · (b × c) represents volume of parallelepiped', 'Equation of line passing through (x₁,y₁,z₁) with direction ratios (a,b,c): (x-x₁)/a = (y-y₁)/b = (z-z₁)/c', 'Angle between two lines with direction ratios a₁,b₁,c₁ and a₂,b₂,c₂: cosθ = (a₁a₂ + b₁b₂ + c₁c₂) / (√(Σa₁²) √(Σa₂²))'],
    url: 'https://en.wikipedia.org/wiki/Euclidean_vector'
  }
];

saveDb('ncert_class11_12.json', ncert11_12_entries);