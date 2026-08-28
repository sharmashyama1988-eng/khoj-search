const { saveDb } = require('../db_helper.js');

const ncertMegaEntries = [
  // --- CLASS 9 & 10 SCIENCE ---
  {
    id: 'ncert-laws-of-motion-newton',
    keywords: ['newton three laws of motion class 9', 'law of inertia first law', 'f=ma second law of motion', 'action reaction third law', 'momentum conservation'],
    title: 'Newton\'s Three Laws of Motion & Momentum Conservation (Class 9)',
    category: 'NCERT Science',
    answer: 'Sir Isaac Newton formulated 3 laws of motion: (1) First Law (Inertia): An object remains at rest or uniform motion in a straight line unless acted upon by an external net force. (2) Second Law: Force F = dp/dt = ma (rate of change of momentum is proportional to applied force). (3) Third Law: To every action there is an equal and opposite reaction (F_AB = -F_BA). Law of Conservation of Momentum: Total momentum before collision equals total momentum after collision (m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂).',
    highlights: [
      'First Law defines Inertia (mass is quantitative measure of inertia)',
      'Second Law gives mathematical definition and unit of Force: 1 Newton = 1 kg·m/s²',
      'Third Law explains rocket propulsion, recoiling of gun, and walking',
      'Momentum p = mv (vector quantity with SI unit kg·m/s)',
      'Impulse J = F · Δt = Change in momentum (Δp)'
    ],
    url: 'https://en.wikipedia.org/wiki/Newton%27s_laws_of_motion'
  },
  {
    id: 'ncert-archimedes-principle-density',
    keywords: ['archimedes principle buoyant force', 'relative density formula', 'law of floatation hydrometer lactometer', 'buoyancy class 9'],
    title: 'Archimedes\' Principle, Buoyancy & Relative Density (Class 9)',
    category: 'NCERT Science',
    answer: 'Archimedes\' Principle states that when an object is immersed fully or partially in a fluid, it experiences an upward buoyant force (upthrust) equal to the weight of the fluid displaced: F_b = ρ_fluid · V_displaced · g. Relative Density = Density of substance / Density of water at 4°C (dimensionless ratio).',
    highlights: [
      'Buoyant force F_b = V · ρ · g (acts upward through center of buoyancy)',
      'Law of Floatation: An object floats if buoyant force equals its total weight (or if density < fluid density)',
      'Lactometers (milk purity) and Hydrometers (liquid density) are built on Archimedes\' principle',
      'Relative density of iron ~7.8, gold ~19.3, water = 1.0 (substances with RD > 1 sink in water; RD < 1 float)'
    ],
    url: 'https://en.wikipedia.org/wiki/Archimedes%27_principle'
  },
  {
    id: 'ncert-mole-concept-avogadro',
    keywords: ['mole concept formulas class 9', 'avogadro number 6.022x1023', 'molar mass calculations', 'number of moles n=m/M', 'number of particles n=N/NA'],
    title: 'The Mole Concept and Avogadro\'s Number (Class 9 & 11)',
    category: 'NCERT Science',
    answer: 'A mole is the amount of substance containing exactly 6.02214076 × 10²³ elementary entities (Avogadro\'s Constant N_A). Formulas: (1) Number of moles n = Mass (m) / Molar Mass (M), (2) Number of particles N = n · N_A = (m/M) · N_A, (3) Volume of 1 mole of any ideal gas at STP (Standard Temperature and Pressure: 0°C, 1 atm) is 22.4 Litres (or 22.7 L at 1 bar).',
    highlights: [
      'Avogadro Constant: N_A = 6.022 × 10²³ particles/mol',
      '1 mole of Carbon-12 has a mass of exactly 12 grams',
      'Molar volume of ideal gas at STP (273.15 K, 1 atm) = 22.4 L/mol',
      'Percentage composition = (Mass of element in 1 mole of compound / Molar mass of compound) × 100%'
    ],
    url: 'https://en.wikipedia.org/wiki/Mole_(unit)'
  },
  {
    id: 'ncert-human-excretory-nephron',
    keywords: ['human excretory system nephron structure', 'ultrafiltration bowman capsule glomerulus', 'urine formation steps class 10', 'kidney dialysis hemodialysis'],
    title: 'Human Excretory System and Nephron Physiology (Class 10)',
    category: 'NCERT Science',
    answer: 'The human excretory system consists of a pair of kidneys, ureters, urinary bladder, and urethra. The Nephron is the structural and functional filtration unit of the kidney (~1 million nephrons per kidney). Urine formation occurs in 3 steps: (1) Ultrafiltration in Glomerulus into Bowman\'s capsule (GFR ~125 mL/min or 180 L/day), (2) Selective Reabsorption along Proximal Convoluted Tubule (PCT) and Loop of Henle (reabsorbing glucose, amino acids, salts, 99% of water), (3) Tubular Secretion in Distal Convoluted Tubule (DCT) releasing K+, H+, and ammonia into urine (~1.5 L/day produced).',
    highlights: [
      'Glomerulus + Bowman\'s Capsule = Malpighian Body / Renal Corpuscle',
      'Selective Reabsorption: PCT reabsorbs 70–80% of electrolytes and water',
      'Loop of Henle (descending limb permeable to water; ascending limb permeable to electrolytes) maintains hyperosmolarity',
      'Hemodialysis (artificial kidney) removes nitrogenous metabolic waste (urea, creatinine) across semipermeable cellophane membranes'
    ],
    url: 'https://en.wikipedia.org/wiki/Nephron'
  },
  {
    id: 'ncert-plant-hormones-phytohormones',
    keywords: ['plant hormones phytohormones class 10', 'auxin gibberellin cytokinin ethylene abscisic acid', 'phototropism geotropism hydrotropism', 'apical dominance fruit ripening hormone'],
    title: 'Plant Hormones (Phytohormones) and Tropic Movements (Class 10)',
    category: 'NCERT Science',
    answer: 'Plant growth and responses are regulated by 5 major classes of Phytohormones: (1) Auxins (cell elongation, phototropism, apical dominance), (2) Gibberellins (stem elongation, breaking seed dormancy, bolting), (3) Cytokinins (cell division promotion, delaying senescence), (4) Abscisic Acid / ABA (growth inhibitor, stress hormone, stomatal closure during drought, leaf abscission), and (5) Ethylene (only gaseous plant hormone, promotes fruit ripening). Tropic movements: Phototropism (light), Geotropism (gravity), Hydrotropism (water), Chemotropism (pollen tube growth towards ovule), Thigmotropism (touch response in tendrils).',
    highlights: [
      'Auxin: Synthesized at shoot tips; diffuses to shaded side causing cells to elongate faster, bending shoot toward light',
      'Gibberellin: Induces internode elongation in rosette plants (bolting)',
      'Cytokinins: Promote rapid cell division in fruits, seeds, and root tips; counteracts apical dominance',
      'Abscisic Acid (ABA): Stress hormone closing stomata under water deficit',
      'Ethylene (C₂H₄): Gaseous hormone accelerating fruit ripening and flower fading'
    ],
    url: 'https://en.wikipedia.org/wiki/Plant_hormone'
  },
  {
    id: 'ncert-human-heart-cardiac-cycle',
    keywords: ['human heart cardiac cycle double circulation', 'sinoatrial node sa node pacemaker', 'systole diastole blood flow path', 'ecg p qrs t wave'],
    title: 'Human Heart, Double Circulation & Cardiac Cycle (Class 10 & 11)',
    category: 'NCERT Science',
    answer: 'The human heart is myogenic, regulated by the SA (Sinoatrial) Node ("natural pacemaker" generating 70–75 action potentials/min in right atrium). Double Circulation comprises Pulmonary Circulation (Right Ventricle → Pulmonary Artery → Lungs → Pulmonary Vein → Left Atrium) and Systemic Circulation (Left Ventricle → Aorta → Body Tissues → Vena Cava → Right Atrium). The Cardiac Cycle lasts 0.8 seconds (Atrial Systole 0.1s, Ventricular Systole 0.3s, Joint Diastole 0.4s).',
    highlights: [
      'Pacemaker pathway: SA Node → AV (Atrioventricular) Node → Bundle of His → Purkinje Fibers',
      'Cardiac output = Stroke Volume (~70 mL) × Heart Rate (~72 bpm) ≈ 5.0 Litres/minute',
      'Heart Sounds: "LUB" (closure of tricuspid and bicuspid/mitral valves) and "DUB" (closure of semilunar valves)',
      'ECG Waves: P-wave (Atrial depolarization), QRS-complex (Ventricular depolarization), T-wave (Ventricular repolarization)',
      'Coronary arteries supply oxygenated blood directly to cardiac muscle tissue'
    ],
    url: 'https://en.wikipedia.org/wiki/Cardiac_cycle'
  },
  {
    id: 'ncert-carbon-allotropes-diamond-graphite-fullerene',
    keywords: ['allotropes of carbon diamond graphite fullerene graphene', 'structure of diamond vs graphite', 'buckminsterfullerene c60 bッキーボール', 'sp3 vs sp2 carbon allotropes'],
    title: 'Allotropes of Carbon — Diamond, Graphite, Fullerenes & Graphene',
    category: 'NCERT Science',
    answer: 'Carbon exhibits allotropy in crystalline forms: (1) Diamond (each C atom is sp³ hybridized and tetrahedrally bonded to 4 other C atoms in a rigid 3D lattice, hardest natural substance, electrical insulator, refractive index 2.42), (2) Graphite (each C atom is sp² hybridized, bonded to 3 C atoms forming hexagonal layers held by weak van der Waals forces, free π-electrons make it a good conductor, soft and slippery lubricant), (3) Buckminsterfullerene C₆₀ (spherical cage of 20 hexagons and 12 pentagons like a football), (4) Graphene (single 2D atomic layer of sp² carbon with record tensile strength and electrical mobility).',
    highlights: [
      'Diamond: sp³ hybridization, bond length 1.54 Å, no free electrons (electrical insulator), thermal conductor',
      'Graphite: sp² hybridization, planar hexagonal sheets with delocalized π-electrons (conducts electricity), layer spacing 3.35 Å',
      'Fullerenes (C₆₀): Discovered by Kroto, Curl, and Smalley (1996 Nobel Prize)',
      'Graphene: Discovered by Geim and Novoselov (2010 Nobel Prize); 200× stronger than steel and ballistic conductor'
    ],
    url: 'https://en.wikipedia.org/wiki/Allotropes_of_carbon'
  },
  {
    id: 'ncert-modern-periodic-trends-detailed',
    keywords: ['periodic table periodic trends detailed', 'atomic radius metallic character trends', 'effective nuclear charge zeff screening effect', 'electronegativity electropositivity variations'],
    title: 'Detailed Periodic Table Trends & Anomalies (Class 10 & 11)',
    category: 'NCERT Science',
    answer: 'Across a Period (Left to Right): Atomic radius decreases, Effective nuclear charge (Z_eff) increases, Ionization Enthalpy increases (with anomalies: N > O due to half-filled 2p³ stability, and Be > B due to fully-filled 2s² stability), Electronegativity increases, Non-metallic character increases. Down a Group (Top to Bottom): Atomic radius increases, Screening/shielding effect increases, Ionization Enthalpy decreases, Metallic character increases, Electropositivity increases.',
    highlights: [
      'Atomic Radii decrease across period due to increasing nuclear attraction pulling outer electrons inward',
      'Ionization Enthalpy exception: Nitrogen (1402 kJ/mol) has higher IE than Oxygen (1314 kJ/mol) due to extra stability of half-filled 2p³ subshell',
      'Electron Gain Enthalpy exception: Chlorine (-349 kJ/mol) is more negative than Fluorine (-328 kJ/mol) because F has small 2p orbital causing strong inter-electronic repulsion',
      'Diagonal Relationships: Lithium-Magnesium, Beryllium-Aluminum, and Boron-Silicon share similar ionic size and charge density'
    ],
    url: 'https://en.wikipedia.org/wiki/Periodic_trends'
  }
];

saveDb('ncert_class6_10.json', ncertMegaEntries);