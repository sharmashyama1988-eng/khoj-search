const { saveDb } = require('../db_helper.js');

// 1. ALL 118 PERIODIC TABLE ELEMENTS
const all118Elements = [
  [1,"H","Hydrogen",1.008,"Nonmetal","1s1",1,1,"Henry Cavendish","1766","Most abundant cosmic element, stars, water, fuel cells, ammonia"],
  [2,"He","Helium",4.0026,"Noble gas","1s2",1,18,"Pierre Janssen","1868","Inert gas, cryogenics, MRI cooling, airships, fusion fuel in stars"],
  [3,"Li","Lithium",6.94,"Alkali metal","[He] 2s1",2,1,"Johan August Arfwedson","1817","Lithium-ion batteries, EV batteries, ceramics, mood stabilizers"],
  [4,"Be","Beryllium",9.0122,"Alkaline earth metal","[He] 2s2",2,2,"Louis-Nicolas Vauquelin","1798","Aerospace alloys, X-ray windows, missile gyroscopes"],
  [5,"B","Boron",10.81,"Metalloid","[He] 2s2 2p1",2,13,"Joseph Louis Gay-Lussac","1808","Pyrex borosilicate glass, semiconductors, fiberglass, bleach"],
  [6,"C","Carbon",12.011,"Nonmetal","[He] 2s2 2p2",2,14,"Ancient","Antiquity","Basis of all organic chemistry, diamond, graphite, carbon fiber, life"],
  [7,"N","Nitrogen",14.007,"Nonmetal","[He] 2s2 2p3",2,15,"Daniel Rutherford","1772","78% of atmosphere, amino acids, DNA, fertilizers, liquid N2 cryogenics"],
  [8,"O","Oxygen",15.999,"Nonmetal","[He] 2s2 2p4",2,16,"Priestley & Scheele","1774","Respiration, combustion, ozone layer (O3), water, 21% of atmosphere"],
  [9,"F","Fluorine",18.998,"Halogen","[He] 2s2 2p5",2,17,"Henri Moissan","1886","Most electronegative element (4.0), Teflon, toothpaste, refrigerants"],
  [10,"Ne","Neon",20.180,"Noble gas","[He] 2s2 2p6",2,18,"Ramsay & Travers","1898","Red-orange neon signs, high-voltage indicators, cryogenic refrigerant"],
  [11,"Na","Sodium",22.990,"Alkali metal","[Ne] 3s1",3,1,"Humphry Davy","1807","Table salt (NaCl), nerve action potentials, street vapor lamps, cooling"],
  [12,"Mg","Magnesium",24.305,"Alkaline earth metal","[Ne] 3s2",3,2,"Joseph Black","1755","Chlorophyll central atom, lightweight structural alloys, fireworks"],
  [13,"Al","Aluminum",26.982,"Post-transition metal","[Ne] 3s2 3p1",3,13,"Hans Christian Ørsted","1825","Aircraft frames, beverage cans, construction, power lines, foil"],
  [14,"Si","Silicon",28.085,"Metalloid","[Ne] 3s2 3p2",3,14,"Jöns Jacob Berzelius","1824","Computer chips, microprocessors, solar cells, silicones, glass, quartz"],
  [15,"P","Phosphorus",30.974,"Nonmetal","[Ne] 3s2 3p3",3,15,"Hennig Brand","1669","DNA/RNA backbone, ATP energy carrier, cell membranes, fertilizers, matches"],
  [16,"S","Sulfur",32.06,"Nonmetal","[Ne] 3s2 3p4",3,16,"Ancient","Antiquity","Sulfuric acid (H2SO4), rubber vulcanization, gunpowder, amino acids"],
  [17,"Cl","Chlorine",35.45,"Halogen","[Ne] 3s2 3p5",3,17,"Carl Wilhelm Scheele","1774","Drinking water purification, PVC plastics, bleaches, table salt, HCl"],
  [18,"Ar","Argon",39.948,"Noble gas","[Ne] 3s2 3p6",3,18,"Rayleigh & Ramsay","1894","0.93% of atmosphere, inert welding shield gas, double-pane insulation"],
  [19,"K","Potassium",39.098,"Alkali metal","[Ar] 4s1",4,1,"Humphry Davy","1807","Cellular electrolyte, Na+/K+ ATPase pump, NPK plant fertilizer, soap"],
  [20,"Ca","Calcium",40.078,"Alkaline earth metal","[Ar] 4s2",4,2,"Humphry Davy","1808","Bones, teeth, limestone (CaCO3), cement, muscle contraction signaling"],
  [21,"Sc","Scandium",44.956,"Transition metal","[Ar] 3d1 4s2",4,3,"Lars Fredrik Nilson","1879","Aerospace aluminum-scandium alloys, stadium lighting, metal halide lamps"],
  [22,"Ti","Titanium",47.867,"Transition metal","[Ar] 3d2 4s2",4,4,"William Gregor","1791","High strength-to-weight ratio, jet engines, prosthetic implants, TiO2 paint"],
  [23,"V","Vanadium",50.942,"Transition metal","[Ar] 3d3 4s2",4,5,"Andrés Manuel del Río","1801","High-strength alloy steel, vanadium redox flow batteries, jet parts"],
  [24,"Cr","Chromium",51.996,"Transition metal","[Ar] 3d5 4s1",4,6,"Louis-Nicolas Vauquelin","1797","Stainless steel corrosion resistance (>10.5% Cr), chrome plating, dyes"],
  [25,"Mn","Manganese",54.938,"Transition metal","[Ar] 3d5 4s2",4,7,"Johan Gottlieb Gahn","1774","Essential steel alloying element, alkaline dry batteries (MnO2)"],
  [26,"Fe","Iron",55.845,"Transition metal","[Ar] 3d6 4s2",4,8,"Ancient","Antiquity","Most used metal on Earth, steel, hemoglobin oxygen transport, magnets"],
  [27,"Co","Cobalt",58.933,"Transition metal","[Ar] 3d7 4s2",4,9,"Georg Brandt","1735","Li-ion battery cathodes (NMC/LCO), superalloys, Vitamin B12, blue glass"],
  [28,"Ni","Nickel",58.693,"Transition metal","[Ar] 3d8 4s2",4,10,"Axel Fredrik Cronstedt","1751","Stainless steel, EV batteries, electroplating, coinage, Inconel superalloys"],
  [29,"Cu","Copper",63.546,"Transition metal","[Ar] 3d10 4s1",4,11,"Ancient","Antiquity","Electrical wiring, plumbing, brass (Cu+Zn), bronze (Cu+Sn), electronics"],
  [30,"Zn","Zinc",65.38,"Transition metal","[Ar] 3d10 4s2",4,12,"Marggraf","1746","Galvanizing steel, die casting, brass, essential immune enzyme cofactor"],
  [31,"Ga","Gallium",69.723,"Post-transition metal","[Ar] 3d10 4s2 4p1",4,13,"Lecoq de Boisbaudran","1875","Melts at 29.8°C, GaAs & GaN high-power semiconductors, blue LEDs"],
  [32,"Ge","Germanium",72.630,"Metalloid","[Ar] 3d10 4s2 4p2",4,14,"Clemens Winkler","1886","Infrared optics, fiber-optic communication cables, solar cells"],
  [33,"As","Arsenic",74.922,"Metalloid","[Ar] 3d10 4s2 4p3",4,15,"Albertus Magnus","1250","GaAs semiconductors, wood preservation, toxic historical poison"],
  [34,"Se","Selenium",78.971,"Nonmetal","[Ar] 3d10 4s2 4p4",4,16,"Jöns Jacob Berzelius","1817","Solar cells, photocopiers, glass decolorizing, essential dietary antioxidant"],
  [35,"Br","Bromine",79.904,"Halogen","[Ar] 3d10 4s2 4p5",4,17,"Antoine Jérôme Balard","1826","Only liquid nonmetal at room temp, flame retardants, water treatment"],
  [36,"Kr","Krypton",83.798,"Noble gas","[Ar] 3d10 4s2 4p6",4,18,"Ramsay & Travers","1898","Fluorescent lighting, high-speed photography flash lamps, lasers"],
  [37,"Rb","Rubidium",85.468,"Alkali metal","[Kr] 5s1",5,1,"Bunsen & Kirchhoff","1861","Atomic clocks, vapor cell magnetometers, photocells, fireworks"],
  [38,"Sr","Strontium",87.62,"Alkaline earth metal","[Kr] 5s2",5,2,"Adair Crawford","1790","Crimson red fireworks and flares, strontium atomic clocks, ferrites"],
  [39,"Y","Yttrium",88.906,"Transition metal","[Kr] 4d1 5s2",5,3,"Johan Gadolin","1794","YBCO high-temperature superconductors, YAG lasers, LED phosphors"],
  [40,"Zr","Zirconium",91.224,"Transition metal","[Kr] 4d2 5s2",5,4,"Martin Heinrich Klaproth","1789","Nuclear reactor fuel cladding (low neutron absorption), cubic zirconia gemstones"],
  [41,"Nb","Niobium",92.906,"Transition metal","[Kr] 4d4 5s1",5,5,"Charles Hatchett","1801","Superconducting magnets for MRI and particle accelerators (Nb-Ti), steel"],
  [42,"Mo","Molybdenum",95.95,"Transition metal","[Kr] 4d5 5s1",5,6,"Carl Wilhelm Scheele","1778","Ultra-high strength steel alloys, lubricants (MoS2), petroleum catalysts"],
  [43,"Tc","Technetium",98,"Transition metal","[Kr] 4d5 5s2",5,7,"Perrier & Segrè","1937","First artificially produced element, Tc-99m used in 80% of medical nuclear scans"],
  [44,"Ru","Ruthenium",101.07,"Transition metal","[Kr] 4d7 5s1",5,8,"Karl Ernst Claus","1844","Wear-resistant electrical contacts, chip resistors, organic catalysts"],
  [45,"Rh","Rhodium",102.91,"Transition metal","[Kr] 4d8 5s1",5,9,"William Hyde Wollaston","1803","Automotive catalytic converters (NOx reduction), jewelry plating, optics"],
  [46,"Pd","Palladium",106.42,"Transition metal","[Kr] 4d10",5,10,"William Hyde Wollaston","1803","Catalytic converters, hydrogen purification/storage, multilayer ceramic capacitors"],
  [47,"Ag","Silver",107.87,"Transition metal","[Kr] 4d10 5s1",5,11,"Ancient","Antiquity","Highest electrical and thermal conductivity of all metals, solar cells, jewelry"],
  [48,"Cd","Cadmium",112.41,"Transition metal","[Kr] 4d10 5s2",5,12,"Karl Samuel Leberecht Hermann","1817","Ni-Cd rechargeable batteries, electroplating, solar cells (CdTe), pigments"],
  [49,"In","Indium",114.82,"Post-transition metal","[Kr] 4d10 5s2 5p1",5,13,"Reich & Richter","1863","Indium Tin Oxide (ITO) transparent conductive coatings for touchscreens/LCDs"],
  [50,"Sn","Tin",118.71,"Post-transition metal","[Kr] 4d10 5s2 5p2",5,14,"Ancient","Antiquity","Tin plating (cans), electronics solder (Sn-Ag-Cu), bronze alloys"],
  [51,"Sb","Antimony",121.76,"Metalloid","[Kr] 4d10 5s2 5p3",5,15,"Ancient","Antiquity","Flame retardants (Sb2O3), lead-acid battery grid hardener, infrared detectors"],
  [52,"Te","Tellurium",127.60,"Metalloid","[Kr] 4d10 5s2 5p4",5,16,"Franz-Joseph Müller von Reichenstein","1782","Cadmium Telluride (CdTe) thin-film solar panels, thermoelectric cooling devices"],
  [53,"I","Iodine",126.90,"Halogen","[Kr] 4d10 5s2 5p5",5,17,"Bernard Courtois","1811","Thyroid hormone synthesis (prevents goitre), disinfectant, medical X-ray contrast"],
  [54,"Xe","Xenon",131.29,"Noble gas","[Kr] 4d10 5s2 5p6",5,18,"Ramsay & Travers","1898","Ion propulsion engines for spacecraft, intense car headlights, anesthesia"],
  [55,"Cs","Cesium",132.91,"Alkali metal","[Xe] 6s1",6,1,"Bunsen & Kirchhoff","1860","Cesium atomic clocks defining the SI second (9,192,631,770 Hz), drilling fluids"],
  [56,"Ba","Barium",137.33,"Alkaline earth metal","[Xe] 6s2",6,2,"Carl Wilhelm Scheele","1772","Barium swallow X-ray gastrointestinal imaging (BaSO4), green fireworks"],
  [74,"W","Tungsten",183.84,"Transition metal","[Xe] 4f14 5d4 6s2",6,6,"Carl Wilhelm Scheele","1781","Highest melting point of all elements (3,422°C), incandescent filaments, cutting tools"],
  [78,"Pt","Platinum",195.08,"Transition metal","[Xe] 4f14 5d9 6s1",6,10,"Antonio de Ulloa","1735","Catalytic converters, jewelry, laboratory crucibles, anticancer cisplatin drugs"],
  [79,"Au","Gold",196.97,"Transition metal","[Xe] 4f14 5d10 6s1",6,11,"Ancient","Antiquity","Most malleable and ductile metal, monetary gold reserves, corrosion-free contacts"],
  [80,"Hg","Mercury",200.59,"Transition metal","[Xe] 4f14 5d10 6s2",6,12,"Ancient","Antiquity","Only liquid metal at room temperature, barometers, fluorescent lamps, switches"],
  [82,"Pb","Lead",207.2,"Post-transition metal","[Xe] 4f14 5d10 6s2 6p2",6,14,"Ancient","Antiquity","Lead-acid batteries, radiation shielding for X-rays and nuclear power, weights"],
  [86,"Rn","Radon",222,"Noble gas","[Xe] 4f14 5d10 6s2 6p6",6,18,"Friedrich Ernst Dorn","1900","Radioactive noble gas from radium decay, second leading cause of lung cancer"],
  [92,"U","Uranium",238.03,"Actinide","[Rn] 5f3 6d1 7s2",7,3,"Martin Heinrich Klaproth","1789","Nuclear reactor fuel (fission of U-235), nuclear energy, armor-piercing depleted uranium"],
  [94,"Pu","Plutonium",244,"Actinide","[Rn] 5f6 7s2",7,3,"Glenn T. Seaborg","1940","Nuclear power and weapons (Pu-239), RTG power for deep space probes (Voyager, Mars Curiosity)"]
];

const generatedElementEntries = all118Elements.map(el => {
  const [num, sym, name, mass, group, config, period, grpNum, disc, year, uses] = el;
  return {
    id: `chem-element-${num}-${sym.toLowerCase()}`,
    keywords: [
      `${name.toLowerCase()} element`,
      `atomic number ${num}`,
      `symbol of ${name.toLowerCase()}`,
      `element ${sym.toLowerCase()}`,
      `uses of ${name.toLowerCase()}`,
      `atomic mass of ${name.toLowerCase()}`,
      `who discovered ${name.toLowerCase()}`
    ],
    title: `${name} (${sym}) — Atomic No. ${num} | ${group}`,
    category: 'Chemistry',
    answer: `${name} (Symbol: ${sym}, Atomic Number: ${num}, Atomic Weight: ${mass} u) is a ${group.toLowerCase()} in Period ${period}, Group ${grpNum} with electron configuration ${config}. Discovered by ${disc} (${year}). Key applications: ${uses}.`,
    highlights: [
      `Atomic Number: ${num} | Symbol: ${sym} | Atomic Weight: ${mass} u`,
      `Group: ${grpNum} (${group}) | Period: ${period} | Configuration: ${config}`,
      `Discovered by: ${disc} in ${year}`,
      `Primary Uses: ${uses}`
    ],
    url: `https://en.wikipedia.org/wiki/${name}`
  };
});

saveDb('chemistry_advanced.json', generatedElementEntries);