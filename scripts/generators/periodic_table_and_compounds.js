const { saveDb } = require('../db_helper.js');

const rawElements = [
  [1, "H", "Hydrogen", 1.008, "Nonmetal", "1s1", -259.1, -252.9, "Henry Cavendish (1766)", "Most abundant element in universe; fuel, ammonia synthesis, fuel cells"],
  [2, "He", "Helium", 4.0026, "Noble gas", "1s2", -272.2, -268.9, "Pierre Janssen (1868)", "Inert gas; cryogenics, MRI magnets, balloons, deep-sea diving breathing mixtures"],
  [3, "Li", "Lithium", 6.94, "Alkali metal", "[He] 2s1", 180.5, 1342, "Johan August Arfwedson (1817)", "Lightest metal; rechargeable lithium-ion batteries, mood stabilizing medication"],
  [4, "Be", "Beryllium", 9.0122, "Alkaline earth metal", "[He] 2s2", 1287, 2470, "Louis-Nicolas Vauquelin (1798)", "Lightweight aerospace alloys, X-ray tube windows, copper-beryllium springs"],
  [5, "B", "Boron", 10.81, "Metalloid", "[He] 2s2 2p1", 2076, 3927, "Joseph Louis Gay-Lussac (1808)", "Borosilicate glass (Pyrex), semiconductor dopant, fiberglass, bulletproof vests"],
  [6, "C", "Carbon", 12.011, "Nonmetal", "[He] 2s2 2p2", 3550, 4827, "Ancient antiquity", "Basis of all organic life; allotropes include diamond, graphite, graphene, fullerenes"],
  [7, "N", "Nitrogen", 14.007, "Nonmetal", "[He] 2s2 2p3", -210.0, -195.8, "Daniel Rutherford (1772)", "Makes up 78% of Earth's atmosphere; fertilizers (Haber process ammonia), cryogenic freezing"],
  [8, "O", "Oxygen", 15.999, "Nonmetal", "[He] 2s2 2p4", -218.8, -183.0, "Carl Wilhelm Scheele & Joseph Priestley (1774)", "Essential for aerobic respiration and combustion; 21% of Earth's atmosphere, 46% of Earth's crust"],
  [9, "F", "Fluorine", 18.998, "Halogen", "[He] 2s2 2p5", -219.7, -188.1, "Henri Moissan (1886)", "Most electronegative and reactive element; Teflon (PTFE), toothpaste fluoridation, uranium enrichment"],
  [10, "Ne", "Neon", 20.180, "Noble gas", "[He] 2s2 2p6", -248.6, -246.1, "William Ramsay & Morris Travers (1898)", "Inert gas; reddish-orange glow in high-voltage neon discharge signs, cryogenic refrigerant"],
  [11, "Na", "Sodium", 22.990, "Alkali metal", "[Ne] 3s1", 97.8, 883, "Humphry Davy (1807)", "Soft reactive metal; table salt (NaCl), nerve transmission electrolyte, street vapor lamps"],
  [12, "Mg", "Magnesium", 24.305, "Alkaline earth metal", "[Ne] 3s2", 650, 1090, "Joseph Black (1755)", "Lightweight structural alloys, chlorophyll central atom in plants, flares, antacids"],
  [13, "Al", "Aluminum", 26.982, "Post-transition metal", "[Ne] 3s2 3p1", 660.3, 2470, "Hans Christian Ørsted (1825)", "Most abundant metal in Earth's crust; aircraft, beverage cans, construction, electrical cables"],
  [14, "Si", "Silicon", 28.085, "Metalloid", "[Ne] 3s2 3p2", 1414, 3265, "Jöns Jacob Berzelius (1824)", "Semiconductor chip industry foundation, quartz, solar panels, silicones, glass"],
  [15, "P", "Phosphorus", 30.974, "Nonmetal", "[Ne] 3s2 3p3", 44.1, 280.5, "Hennig Brand (1669)", "DNA and ATP backbone, bones and teeth, agricultural fertilizers (NPK), matchsticks"],
  [16, "S", "Sulfur", 32.06, "Nonmetal", "[Ne] 3s2 3p4", 115.2, 444.6, "Ancient antiquity", "Sulfuric acid production (H2SO4 - #1 chemical worldwide), rubber vulcanization, gunpowder"],
  [17, "Cl", "Chlorine", 35.45, "Halogen", "[Ne] 3s2 3p5", -101.5, -34.0, "Carl Wilhelm Scheele (1774)", "Water purification/disinfection, PVC plastics, bleaches, table salt (NaCl), stomach acid (HCl)"],
  [18, "Ar", "Argon", 39.948, "Noble gas", "[Ne] 3s2 3p6", -189.3, -185.8, "Lord Rayleigh & William Ramsay (1894)", "Most abundant noble gas in atmosphere (~0.93%); inert shielding gas in TIG/MIG welding and incandescent bulbs"],
  [19, "K", "Potassium", 39.098, "Alkali metal", "[Ar] 4s1", 63.5, 759, "Humphry Davy (1807)", "Essential intracellular electrolyte, cellular sodium-potassium pump, NPK fertilizers, soap making"],
  [20, "Ca", "Calcium", 40.078, "Alkaline earth metal", "[Ar] 4s2", 842, 1484, "Humphry Davy (1808)", "Major component of bones, teeth, limestone (CaCO3), cement, cement concrete, muscle contraction signaling"],
  [21, "Sc", "Scandium", 44.956, "Transition metal", "[Ar] 3d1 4s2", 1541, 2836, "Lars Fredrik Nilson (1879)", "High-strength aerospace aluminum alloys, sports equipment (baseball bats, bicycle frames)"],
  [22, "Ti", "Titanium", 47.867, "Transition metal", "[Ar] 3d2 4s2", 1668, 3287, "William Gregor (1791)", "High strength-to-weight ratio, corrosion resistance; aerospace, dental/joint implants, TiO2 white pigment"],
  [23, "V", "Vanadium", 50.942, "Transition metal", "[Ar] 3d3 4s2", 1910, 3407, "Andrés Manuel del Río (1801)", "Vanadium-steel alloys for high-strength tools, vanadium redox flow batteries for grid storage"],
  [24, "Cr", "Chromium", 51.996, "Transition metal", "[Ar] 3d5 4s1", 1907, 2671, "Louis-Nicolas Vauquelin (1797)", "Stainless steel (>10.5% Cr content prevents rust), decorative chrome plating, refractory bricks"],
  [25, "Mn", "Manganese", 54.938, "Transition metal", "[Ar] 3d5 4s2", 1246, 2061, "Johan Gottlieb Gahn (1774)", "Essential steel additive (deoxidizer/desulfurizer), dry cell alkaline batteries (MnO2), photosynthesis enzyme"],
  [26, "Fe", "Iron", 55.845, "Transition metal", "[Ar] 3d6 4s2", 1538, 2862, "Ancient antiquity", "Most used metal on Earth (>90% of global metal production); steel, hemoglobin oxygen carrier in blood"],
  [27, "Co", "Cobalt", 58.933, "Transition metal", "[Ar] 3d7 4s2", 1495, 2927, "Georg Brandt (1735)", "Lithium-ion battery cathodes (NMC/LCO), superalloys for jet engines, Vitamin B12 (cobalamin), blue pigment"],
  [28, "Ni", "Nickel", 58.693, "Transition metal", "[Ar] 3d8 4s2", 1455, 2913, "Axel Fredrik Cronstedt (1751)", "Stainless steel alloys, EV batteries, electroplating, coins, corrosion-resistant Monel/Inconel alloys"],
  [29, "Cu", "Copper", 63.546, "Transition metal", "[Ar] 3d10 4s1", 1084.6, 2562, "Ancient antiquity", "Exceptional electrical and thermal conductivity; wiring, plumbing, brass (Cu+Zn) and bronze (Cu+Sn) alloys"],
  [30, "Zn", "Zinc", 65.38, "Transition metal", "[Ar] 3d10 4s2", 419.5, 907, "Andreas Sigismund Marggraf (1746)", "Galvanizing iron/steel against corrosion, brass alloy, die casting, human immune enzyme cofactor"],
  [31, "Ga", "Gallium", 69.723, "Post-transition metal", "[Ar] 3d10 4s2 4p1", 29.76, 2204, "Paul-Émile Lecoq de Boisbaudran (1875)", "Melts in human hand (29.8°C); Gallium Arsenide (GaAs) and Gallium Nitride (GaN) high-speed/power semiconductors and blue LEDs"],
  [32, "Ge", "Germanium", 72.630, "Metalloid", "[Ar] 3d10 4s2 4p2", 938.2, 2833, "Clemens Winkler (1886)", "Early transistor material, infrared optics, fiber-optic communication cables, solar cells"],
  [33, "As", "Arsenic", 74.922, "Metalloid", "[Ar] 3d10 4s2 4p3", 817, 614, "Albertus Magnus (1250)", "Semiconductor dopant, gallium arsenide circuits, historical wood preservative and toxic compound"],
  [34, "Se", "Selenium", 78.971, "Nonmetal", "[Ar] 3d10 4s2 4p4", 221, 685, "Jöns Jacob Berzelius (1817)", "Photocopying photoreceptors, solar cells, glass decolorization, essential trace dietary antioxidant"],
  [35, "Br", "Bromine", 79.904, "Halogen", "[Ar] 3d10 4s2 4p5", -7.2, 58.8, "Antoine Jérôme Balard (1826)", "Only liquid nonmetallic element at room temp (red-brown fuming liquid); flame retardants, pharmaceuticals"],
  [36, "Kr", "Krypton", 83.798, "Noble gas", "[Ar] 3d10 4s2 4p6", -157.4, -153.2, "William Ramsay & Morris Travers (1898)", "Fluorescent lighting, high-speed photography flash lamps, insulated window panes"],
  [47, "Ag", "Silver", 107.868, "Transition metal", "[Kr] 4d10 5s1", 961.8, 2162, "Ancient antiquity", "Highest electrical and thermal conductivity and highest optical reflectivity of all metals; jewelry, solar panels, electronics"],
  [50, "Sn", "Tin", 118.710, "Post-transition metal", "[Kr] 4d10 5s2 5p2", 231.9, 2602, "Ancient antiquity", "Tin plating (tin cans), solder alloy for electronics (Sn-Pb / lead-free Sn-Ag-Cu), bronze alloy"],
  [53, "I", "Iodine", 126.904, "Halogen", "[Kr] 4d10 5s2 5p5", 113.7, 184.3, "Bernard Courtois (1811)", "Essential for thyroid hormone synthesis (preventing goitre), antiseptic disinfectant (tincture of iodine), X-ray contrast media"],
  [74, "W", "Tungsten", 183.84, "Transition metal", "[Xe] 4f14 5d4 6s2", 3422, 5555, "Carl Wilhelm Scheele (1781)", "Highest melting point of all metals (3,422°C); incandescent light bulb filaments, tungsten carbide cutting tools, rocket nozzles"],
  [78, "Pt", "Platinum", 195.084, "Transition metal", "[Xe] 4f14 5d9 6s1", 1768.3, 3825, "Antonio de Ulloa (1735)", "Precious catalyst for automotive catalytic converters, laboratory equipment, jewelry, anticancer chemotherapy drugs (cisplatin)"],
  [79, "Au", "Gold", 196.967, "Transition metal", "[Xe] 4f14 5d10 6s1", 1064.2, 2970, "Ancient antiquity", "Most malleable and ductile metal (1 gram can be beaten into 1 square meter sheet); monetary standard, jewelry, corrosion-free electronics"],
  [80, "Hg", "Mercury", 200.592, "Transition metal", "[Xe] 4f14 5d10 6s2", -38.83, 356.73, "Ancient antiquity", "Only metal that is liquid at room temperature (quicksilver); historical thermometers, barometers, dental amalgams, fluorescent lamps"],
  [82, "Pb", "Lead", 207.2, "Post-transition metal", "[Xe] 4f14 5d10 6s2 6p2", 327.5, 1749, "Ancient antiquity", "Dense, soft metal; lead-acid car batteries, radiation shielding (X-rays, nuclear reactors), historical weights and plumbing"],
  [92, "U", "Uranium", 238.029, "Actinide", "[Rn] 5f3 6d1 7s2", 1132.2, 4131, "Martin Heinrich Klaproth (1789)", "Primary fissile fuel for nuclear power plants (fission of U-235) and nuclear weapons; dense armor-piercing depleted uranium munitions"],
  [94, "Pu", "Plutonium", 244, "Actinide", "[Rn] 5f6 7s2", 639.4, 3228, "Glenn T. Seaborg (1940)", "Fissile isotope Pu-239 used in nuclear weapons and breeder reactors; Pu-238 radioisotope thermoelectric generators (RTGs) powering deep space probes (Voyager, Perseverance rover)"]
];

const chemAdvancedData = rawElements.map(el => {
  const [num, sym, name, mass, group, config, mp, bp, discoverer, uses] = el;
  return {
    id: `chem-elem-${num}-${sym.toLowerCase()}`,
    keywords: [
      `${name.toLowerCase()} element`,
      `atomic number ${num}`,
      `symbol ${sym.toLowerCase()}`,
      `chemical element ${sym.toLowerCase()}`,
      `properties of ${name.toLowerCase()}`,
      `${name.toLowerCase()} facts`
    ],
    title: `${name} (${sym}, Atomic No. ${num}) — Properties & Applications`,
    category: 'Chemistry',
    answer: `${name} (chemical symbol ${sym}, atomic number ${num}, standard atomic weight ${mass} u) is a ${group.toLowerCase()} with electron configuration ${config}. Discovered by ${discoverer}. Key uses: ${uses}.`,
    highlights: [
      `Atomic Number: ${num} | Symbol: ${sym} | Standard Atomic Weight: ${mass} u`,
      `Classification: ${group} | Electron Configuration: ${config}`,
      `Melting Point: ${mp}°C | Boiling Point: ${bp}°C`,
      `Discovered by: ${discoverer}`,
      `Primary Applications: ${uses}`
    ],
    url: `https://en.wikipedia.org/wiki/${name}`
  };
});

// Common Chemical Compounds
const compounds = [
  {
    id: 'chem-cmpd-water',
    keywords: ['water chemical formula h2o', 'properties of water', 'density of water at 4c', 'structure of water molecule'],
    title: 'Water (H₂O) — Chemical Properties & Universal Solvent',
    category: 'Chemistry',
    answer: 'Water (H₂O, molar mass 18.015 g/mol) is a polar molecule with bent geometry (104.5° bond angle) and extensive hydrogen bonding. Known as the universal solvent, it exhibits maximum density at 3.98°C (~4°C) of 1.000 g/cm³, high specific heat capacity (4.184 J/g·K), and high latent heat of vaporization (2260 J/g).',
    highlights: ['Molecular Formula: H₂O | Molar Mass: 18.015 g/mol | Polar covalent bonds with 104.5° angle', 'Hydrogen bonding gives water high boiling point (100°C), surface tension, and heat capacity', 'Anomalous expansion: Water expands when freezing into ice, making ice less dense than liquid water', 'Autoionization of water: 2H₂O ⇌ H₃O⁺ + OH⁻ with Kw = 1.0 × 10⁻¹⁴ at 25°C (pH 7 = neutral)'],
    url: 'https://en.wikipedia.org/wiki/Properties_of_water'
  },
  {
    id: 'chem-cmpd-sulfuric-acid',
    keywords: ['sulfuric acid chemical formula h2so4', 'king of chemicals sulfuric acid', 'contact process sulfuric acid', 'uses of sulfuric acid'],
    title: 'Sulfuric Acid (H₂SO₄) — King of Chemicals',
    category: 'Chemistry',
    answer: 'Sulfuric acid (H₂SO₄, molar mass 98.079 g/mol) is a dense, colorless, highly corrosive mineral acid known as the King of Chemicals. Manufactured industrially via the Contact Process (oxidizing SO₂ to SO₃ over V₂O₅ catalyst), it is the single most produced chemical worldwide, primarily used in phosphate fertilizer manufacturing.',
    highlights: ['Molecular Formula: H₂SO₄ | Molar Mass: 98.079 g/mol | Strong diprotic acid (pKa1 ≈ -3, pKa2 = 1.99)', 'Manufactured via Contact Process: S + O₂ → SO₂; 2SO₂ + O₂ (V₂O₅ catalyst) ⇌ 2SO₃; SO₃ + H₂SO₄ → H₂S₂O₇ (Oleum); Oleum + H₂O → 2H₂SO₄', 'Strong dehydrating agent (charring sugar C₁₂H₂₂O₁₁ into pure black carbon foam)', 'Key uses: Phosphate fertilizers (superphosphate), petroleum refining, lead-acid car battery electrolyte, chemical synthesis'],
    url: 'https://en.wikipedia.org/wiki/Sulfuric_acid'
  },
  {
    id: 'chem-cmpd-sodium-chloride',
    keywords: ['sodium chloride formula nacl', 'table salt crystal lattice structure', 'fcc lattice sodium chloride', 'electrolysis of brine chloralkali'],
    title: 'Sodium Chloride (NaCl) — Table Salt & Crystal Lattice',
    category: 'Chemistry',
    answer: 'Sodium Chloride (NaCl, molar mass 58.44 g/mol), commonly known as table salt, is an ionic compound forming a Face-Centered Cubic (FCC / Rock Salt) crystal lattice where each Na⁺ ion is octahedrally coordinated by 6 Cl⁻ ions and vice-versa. Chloralkali electrolysis of aqueous brine produces chlorine gas (Cl₂), sodium hydroxide (NaOH), and hydrogen gas (H₂).',
    highlights: ['Formula: NaCl | Molar Mass: 58.44 g/mol | Ionic lattice with 6:6 coordination number', 'Lattice enthalpy: 787 kJ/mol; Melting point: 801°C; Boiling point: 1,465°C', 'Chloralkali Process (Electrolysis of Brine): 2NaCl + 2H₂O → 2NaOH + Cl₂↑ (anode) + H₂↑ (cathode)', 'Essential physiological electrolyte regulating osmotic pressure, blood volume, and action potentials in nerves'],
    url: 'https://en.wikipedia.org/wiki/Sodium_chloride'
  },
  {
    id: 'chem-cmpd-baking-soda-washing-soda',
    keywords: ['baking soda formula nahco3', 'washing soda formula na2co3 10h2o', 'solvay process sodium bicarbonate', 'difference between baking soda and washing soda'],
    title: 'Baking Soda (NaHCO₃) and Washing Soda (Na₂CO₃·10H₂O)',
    category: 'Chemistry',
    answer: 'Baking soda is Sodium Bicarbonate (NaHCO₃, mildly alkaline, produces CO₂ bubbles with acids/heat for leavening). Washing soda is Sodium Carbonate Decahydrate (Na₂CO₃·10H₂O, strongly alkaline, used for water softening and laundry). Both are produced industrially via the Solvay Process using brine (NaCl), ammonia (NH₃), and limestone (CaCO₃).',
    highlights: ['Baking Soda: NaHCO₃ (Sodium hydrogen carbonate) — antacid, fire extinguisher, leavening agent', 'Washing Soda: Na₂CO₃·10H₂O (Sodium carbonate decahydrate) — softens hard water by precipitating Ca²⁺ and Mg²⁺ as carbonates', 'Thermal decomposition of baking soda: 2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑', 'Solvay Process reaction: NaCl + NH₃ + CO₂ + H₂O → NaHCO₃↓ + NH₄Cl'],
    url: 'https://en.wikipedia.org/wiki/Sodium_bicarbonate'
  },
  {
    id: 'chem-cmpd-calcium-carbonate',
    keywords: ['calcium carbonate formula caco3', 'limestone marble chalk quicklime slaked lime', 'calcium cycle limestone thermal decomposition'],
    title: 'Calcium Carbonate (CaCO₃) and Lime Cycle',
    category: 'Chemistry',
    answer: 'Calcium Carbonate (CaCO₃, molar mass 100.086 g/mol) occurs naturally as limestone, marble, chalk, and seashells. Heating limestone produces Quicklime (Calcium Oxide, CaO) and CO₂ in calcination. Adding water to quicklime yields Slaked Lime (Calcium Hydroxide, Ca(OH)₂), completing the industrial Lime Cycle.',
    highlights: ['1. Calcination: CaCO₃ (Limestone) + Heat (900°C) → CaO (Quicklime) + CO₂↑', '2. Slaking: CaO + H₂O → Ca(OH)₂ (Slaked lime) + Heat (strongly exothermic)', '3. Carbonation: Ca(OH)₂ + CO₂ → CaCO₃ (Limestone) + H₂O (lime water turns milky due to insoluble CaCO₃ precipitate)', 'Used extensively in Portland cement production, iron smelting flux in blast furnace, antacids, and paper coating'],
    url: 'https://en.wikipedia.org/wiki/Calcium_carbonate'
  }
];

saveDb('chemistry_advanced.json', [...chemAdvancedData, ...compounds]);