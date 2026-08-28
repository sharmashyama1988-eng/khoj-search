const { saveDb } = require('./db_helper.js');

const ncert6_10_entries = [
  // --- CLASS 6-10 SCIENCE ---
  {
    id: 'ncert-cell-theory',
    keywords: ['cell theory', 'who proposed cell theory', 'schleiden schwann virchow', 'omnis cellula e cellula'],
    title: 'Cell Theory — Schleiden, Schwann & Virchow',
    category: 'NCERT Science',
    answer: 'Cell Theory states: (1) All living organisms are composed of one or more cells, (2) The cell is the basic unit of structure and organisation in organisms, (3) All cells arise from pre-existing cells (Omnis cellula-e-cellula proposed by Rudolf Virchow in 1855).',
    highlights: ['Proposed by Matthias Schleiden (1838) and Theodor Schwann (1839)', 'Rudolf Virchow added 3rd postulate in 1855: cells come from pre-existing cells', 'Viruses are notable exception to cell theory (acellular)'],
    url: 'https://en.wikipedia.org/wiki/Cell_theory'
  },
  {
    id: 'ncert-mitochondria',
    keywords: ['powerhouse of the cell', 'mitochondria function', 'atp production organelle', 'mitochondria kya hai'],
    title: 'Mitochondria — Powerhouse of the Cell',
    category: 'NCERT Science',
    answer: 'Mitochondria are known as the powerhouse of the cell because they produce cellular energy in the form of ATP (Adenosine Triphosphate) through aerobic respiration. They possess their own circular DNA and 70S ribosomes, making them semi-autonomous.',
    highlights: ['Produces ATP (energy currency of the cell) via oxidative phosphorylation', 'Has double membrane: outer smooth, inner folded into cristae (increases surface area)', 'Contains own DNA and ribosomes (maternally inherited in humans)'],
    url: 'https://en.wikipedia.org/wiki/Mitochondrion'
  },
  {
    id: 'ncert-chloroplast',
    keywords: ['kitchen of the cell', 'chloroplast function', 'chlorophyll pigment', 'plastids types'],
    title: 'Chloroplast and Plastids in Plant Cells',
    category: 'NCERT Science',
    answer: 'Chloroplasts are known as the kitchen of the plant cell because they conduct photosynthesis. They contain the green pigment chlorophyll which traps solar energy. Plastids are found only in plant cells: Chloroplasts (green), Chromoplasts (coloured), and Leucoplasts (colourless storage).',
    highlights: ['Chloroplasts contain thylakoids arranged in stacks called grana, surrounded by stroma', 'Chromoplasts give flowers and fruits yellow, orange, and red colours (carotenoids)', 'Leucoplasts store starch (amyloplasts), oils (elaioplasts), or proteins (aleuroplasts)'],
    url: 'https://en.wikipedia.org/wiki/Chloroplast'
  },
  {
    id: 'ncert-nucleus-cell',
    keywords: ['nucleus of cell', 'brain of the cell', 'nucleolus chromatin', 'who discovered nucleus'],
    title: 'Nucleus — Control Centre of the Cell',
    category: 'NCERT Science',
    answer: 'The nucleus is the control centre (brain) of eukaryotic cells, discovered by Robert Brown in 1831. It contains genetic material in the form of chromatin (DNA + histone proteins) and the nucleolus, which synthesizes ribosomal RNA (rRNA).',
    highlights: ['Discovered by Robert Brown in 1831 in orchid root cells', 'Surrounded by double membrane nuclear envelope with nuclear pores', 'Directs protein synthesis and cell division'],
    url: 'https://en.wikipedia.org/wiki/Cell_nucleus'
  },
  {
    id: 'ncert-endoplasmic-reticulum',
    keywords: ['endoplasmic reticulum', 'rough er vs smooth er', 'rer ser function', 'ribosomes on er'],
    title: 'Endoplasmic Reticulum (RER & SER)',
    category: 'NCERT Science',
    answer: 'The Endoplasmic Reticulum (ER) is a network of membranous tubules within the cytoplasm. Rough ER (RER) has ribosomes on its surface and synthesizes proteins; Smooth ER (SER) lacks ribosomes and synthesizes lipids, steroids, and detoxifies drugs/poisons in liver cells.',
    highlights: ['Rough ER: Protein synthesis and folding with bound 80S ribosomes', 'Smooth ER: Lipid synthesis, steroid hormone production, and detoxification', 'Forms skeletal framework of cytoplasm and helps in membrane biogenesis'],
    url: 'https://en.wikipedia.org/wiki/Endoplasmic_reticulum'
  },
  {
    id: 'ncert-golgi-apparatus',
    keywords: ['golgi apparatus', 'golgi complex function', 'post office of the cell', 'camillo golgi'],
    title: 'Golgi Apparatus — Packaging and Dispatch Unit',
    category: 'NCERT Science',
    answer: 'The Golgi apparatus (discovered by Camillo Golgi in 1898) consists of flattened membrane-bound sacs called cisternae. It functions as the post office of the cell by packaging, modifying, and sorting proteins and lipids received from the ER for secretion or intracellular delivery.',
    highlights: ['Discovered by Camillo Golgi in 1898 using silver nitrate staining', 'Two distinct faces: Cis face (forming/receiving) and Trans face (maturing/shipping)', 'Produces lysosomes and helps in complex sugar synthesis'],
    url: 'https://en.wikipedia.org/wiki/Golgi_apparatus'
  },
  {
    id: 'ncert-lysosomes',
    keywords: ['suicide bags of the cell', 'lysosome function', 'hydrolytic enzymes organelle', 'who discovered lysosomes'],
    title: 'Lysosomes — Suicide Bags of the Cell',
    category: 'NCERT Science',
    answer: 'Lysosomes are membrane-bound vesicles containing acidic hydrolytic enzymes (optimal pH ~4.5-5.0) capable of breaking down all biological polymers. Discovered by Christian de Duve, they are called suicide bags because if a cell is damaged, lysosomes may burst and digest their own cell.',
    highlights: ['Discovered by Christian de Duve in 1955', 'Contain ~50 hydrolytic enzymes including proteases, lipases, nucleases, and glycosidases', 'Perform autophagy (eating damaged organelles) and phagocytosis (eating foreign pathogens)'],
    url: 'https://en.wikipedia.org/wiki/Lysosome'
  },
  {
    id: 'ncert-mendel-genetics',
    keywords: ['gregor mendel laws', 'father of genetics', 'monohybrid dihybrid cross', 'law of segregation', 'law of independent assortment'],
    title: 'Mendel\'s Laws of Inheritance (Genetics)',
    category: 'NCERT Science',
    answer: 'Gregor Johann Mendel, the Father of Genetics, formulated the laws of inheritance using garden pea plants (Pisum sativum): (1) Law of Dominance, (2) Law of Segregation (purity of gametes, 3:1 phenotypic ratio in monohybrid cross), and (3) Law of Independent Assortment (9:3:3:1 ratio in dihybrid cross).',
    highlights: ['Selected Pisum sativum (garden pea) with 7 pairs of contrasting traits', 'Monohybrid cross phenotypic ratio: 3:1; Genotypic ratio: 1:2:1', 'Dihybrid cross phenotypic ratio: 9:3:3:1 (Yellow Round, Yellow Wrinkled, Green Round, Green Wrinkled)'],
    url: 'https://en.wikipedia.org/wiki/Mendelian_inheritance'
  },
  {
    id: 'ncert-human-eye',
    keywords: ['human eye anatomy', 'cornea retina pupil iris', 'accommodation power eye', 'myopia hypermetropia', 'presbyopia astigmatism'],
    title: 'Human Eye and Defects of Vision',
    category: 'NCERT Science',
    answer: 'The human eye works like a camera forming inverted real images on the retina. Cornea refracts light, Iris controls pupil diameter, Ciliary muscles change lens focal length (power of accommodation, near point 25 cm). Myopia (short-sightedness) is corrected with concave lenses; Hypermetropia (far-sightedness) with convex lenses.',
    highlights: ['Near point of normal human eye: 25 cm; Far point: Infinity', 'Retina has Rod cells (night/dim light vision) and Cone cells (colour/daylight vision)', 'Myopia: Image forms in front of retina; corrected by Concave lens', 'Hypermetropia: Image forms behind retina; corrected by Convex lens', 'Presbyopia: Old-age loss of accommodation; corrected by Bifocal lens'],
    url: 'https://en.wikipedia.org/wiki/Human_eye'
  },
  {
    id: 'ncert-dispersion-spectrum',
    keywords: ['dispersion of light prism', 'spectrum vibgyor', 'newton glass prism experiment', 'rainbow formation physics'],
    title: 'Dispersion of Light and Rainbow Formation',
    category: 'NCERT Science',
    answer: 'Dispersion is the splitting of white light into its 7 constituent colours (VIBGYOR: Violet, Indigo, Blue, Green, Yellow, Orange, Red) when passing through a glass prism, first demonstrated by Sir Isaac Newton. Red deviates the least (longest wavelength ~700 nm), Violet deviates the most (shortest wavelength ~400 nm).',
    highlights: ['VIBGYOR: Violet (max deviation, min wavelength) to Red (min deviation, max wavelength)', 'Rainbow caused by dispersion, refraction, and internal reflection in spherical raindrops', 'Atmospheric refraction causes twinkling of stars and advance sunrise/delayed sunset by 2 minutes'],
    url: 'https://en.wikipedia.org/wiki/Dispersion_(optics)'
  },
  {
    id: 'ncert-chemical-reactions-types',
    keywords: ['types of chemical reactions', 'combination reaction', 'decomposition reaction', 'displacement double displacement', 'redox reaction class 10'],
    title: 'Types of Chemical Reactions (Class 10)',
    category: 'NCERT Chemistry',
    answer: 'The five primary chemical reaction types are: (1) Combination: A + B → AB (e.g. CaO + H2O → Ca(OH)2), (2) Decomposition: AB → A + B (thermal, electrolytic, or photolytic), (3) Displacement: A + BC → AC + B (e.g. Fe + CuSO4 → FeSO4 + Cu), (4) Double Displacement: AB + CD → AD + CB (precipitation), (5) Redox (simultaneous oxidation and reduction).',
    highlights: ['Combination: Exothermic quicklime slaking produces slaked lime', 'Thermal decomposition: 2FeSO4 (green) → Fe2O3 (brown) + SO2 + SO3', 'Electrolytic decomposition: 2H2O → 2H2 (cathode) + O2 (anode) in 2:1 volume ratio', 'Photolytic decomposition: 2AgCl (white) → 2Ag (grey) + Cl2 in sunlight (used in black-and-white photography)'],
    url: 'https://en.wikipedia.org/wiki/Chemical_reaction'
  },
  {
    id: 'ncert-atomic-structure-models',
    keywords: ['thomson rutherford bohr model', 'atomic structure class 9', 'rutherford gold foil experiment', 'alpha particle scattering'],
    title: 'Atomic Structure Models — Thomson, Rutherford, Bohr',
    category: 'NCERT Chemistry',
    answer: 'Atomic models evolved from: (1) Thomson\'s Plum Pudding model (electrons in positive sphere, 1897), (2) Rutherford\'s Gold Foil α-particle experiment (1911) discovering the dense positive nucleus, and (3) Bohr\'s Model (1913) where electrons occupy discrete stationary orbits with quantized angular momentum (L = nh/2π).',
    highlights: ['Rutherford\'s experiment showed most space in atom is empty, with mass concentrated in tiny nucleus', 'Discovery of subatomic particles: Electron (J.J. Thomson 1897), Proton (Goldstein/Rutherford 1886/1919), Neutron (James Chadwick 1932)', 'Bohr-Bury scheme: Maximum electrons in nth shell = 2n² (K=2, L=8, M=18, N=32)'],
    url: 'https://en.wikipedia.org/wiki/Atomic_theory'
  },
  {
    id: 'ncert-states-of-matter',
    keywords: ['states of matter', 'solid liquid gas plasma bose einstein', 'sublimation deposition', 'latent heat of fusion vaporization'],
    title: 'States of Matter and Phase Transitions',
    category: 'NCERT Chemistry',
    answer: 'Matter exists in 5 states: Solid (fixed shape and volume), Liquid (fixed volume, variable shape), Gas (variable shape and volume), Plasma (ionized gas at extreme temperatures), and Bose-Einstein Condensate (matter at near absolute zero 0 K).',
    highlights: ['Sublimation: Direct transition from solid to gas without liquid phase (e.g. Camphor, Ammonium chloride, Dry Ice)', 'Deposition: Direct transition from gas to solid', 'Latent Heat: Heat absorbed/released during phase change without temperature rise', '0°C = 273.15 K; Boiling point of water = 100°C = 373.15 K'],
    url: 'https://en.wikipedia.org/wiki/State_of_matter'
  },
  {
    id: 'ncert-work-energy-power',
    keywords: ['work energy power formulas', 'kinetic energy formula', 'potential energy mgh', 'law of conservation of energy', 'power unit watt'],
    title: 'Work, Energy and Power (Class 9)',
    category: 'NCERT Physics',
    answer: 'Work (W) = F · s · cosθ (measured in Joules). Kinetic Energy (KE) = ½mv². Gravitational Potential Energy (PE) = mgh. Law of Conservation of Energy: Energy cannot be created or destroyed, only converted. Power (P) = Work/Time (measured in Watts; 1 HP = 746 W).',
    highlights: ['Work is zero if displacement is perpendicular to force (e.g. Earth orbiting Sun)', 'Work-Energy Theorem: Net work done on an object equals change in its kinetic energy (W = ΔKE)', 'Commercial unit of energy: 1 kWh = 1 unit = 3.6 × 10⁶ Joules', '1 Horsepower (HP) = 746 Watts'],
    url: 'https://en.wikipedia.org/wiki/Work_(physics)'
  },
  {
    id: 'ncert-sound-physics',
    keywords: ['sound waves properties', 'longitudinal vs transverse waves', 'echo reverberation formula', 'sonar ultrasound frequency'],
    title: 'Sound Waves — Propagation, Echo and SONAR',
    category: 'NCERT Physics',
    answer: 'Sound is a mechanical longitudinal wave requiring a material medium to propagate (cannot travel in vacuum). Speed in air at 20°C is ~343 m/s (fastest in solids, slowest in gases). Echo requires minimum obstacle distance of 17.2 m for distinct hearing. SONAR uses ultrasonic sound waves to measure underwater depths.',
    highlights: ['Audible range for human ear: 20 Hz to 20,000 Hz (20 kHz)', 'Infrasound (<20 Hz): Elephants, whales, earthquakes; Ultrasound (>20 kHz): Bats, dolphins, SONAR, echocardiography', 'Echo minimum distance = (v × t)/2 = (344 m/s × 0.1 s)/2 = 17.2 metres', 'SONAR: Sound Navigation and Ranging (Distance d = (v × t) / 2)'],
    url: 'https://en.wikipedia.org/wiki/Sound'
  },
  // --- CLASS 6-10 SOCIAL SCIENCE / HISTORY / CIVICS / GEOGRAPHY ---
  {
    id: 'ncert-indus-valley',
    keywords: ['indus valley civilization', 'harappa mohenjo daro', 'great bath granary', 'lothal port ivc'],
    title: 'Indus Valley Civilization (Bronze Age 2500–1900 BCE)',
    category: 'NCERT History',
    answer: 'The Indus Valley Civilization (Harappan Civilization, ~2500–1900 BCE) was a Bronze Age urban civilization known for grid-plan cities, advanced covered drainage systems, standardized baked bricks, and maritime trade. Harappa was excavated by Daya Ram Sahni (1921) and Mohenjo-daro by R.D. Banerjee (1922).',
    highlights: ['Key sites: Harappa (Ravi river, Pakistan), Mohenjo-daro (Indus, Great Bath & Granary), Lothal (Gujarat, dockyard/port), Kalibangan (Rajasthan, ploughed fields)', 'Script: Boustrophedon / pictographic (undeciphered till date)', 'Bronze Dancing Girl and Steatite Bearded Priest found at Mohenjo-daro', 'Declined ~1900 BCE likely due to climate shift, drying of Saraswati river, and floods'],
    url: 'https://en.wikipedia.org/wiki/Indus_Valley_Civilisation'
  },
  {
    id: 'ncert-vedic-period',
    keywords: ['vedic period rigveda', 'four vedas names', 'early vs later vedic period', 'upanishads epics'],
    title: 'The Vedic Period and Four Vedas',
    category: 'NCERT History',
    answer: 'The Vedic Period (~1500–500 BCE) is divided into Early Vedic (Rigvedic, ~1500–1000 BCE) and Later Vedic (~1000–500 BCE). The four Vedas are: Rigveda (oldest, 1,028 hymns), Samaveda (music/chants), Yajurveda (rituals/sacrifices), and Atharvaveda (charms, medicine, spells).',
    highlights: ['Rigveda: Oldest religious text, contains Gayatri Mantra (dedicated to Savitr)', 'Upanishads: Philosophical commentaries (108 total); Satyameva Jayate taken from Mundaka Upanishad', 'Early Vedic society was pastoral and egalitarian; Sabha and Samiti were popular assemblies', 'Later Vedic saw rise of Janapadas, iron usage (Krishna Ayas), and rigid Varna system'],
    url: 'https://en.wikipedia.org/wiki/Vedic_period'
  },
  {
    id: 'ncert-buddhism-jainism',
    keywords: ['gautama buddha teachings', 'four noble truths eightfold path', 'mahavira jainism tirthankara', 'ahimsa anekantavada'],
    title: 'Buddhism and Jainism — 6th Century BCE Sramana Traditions',
    category: 'NCERT History',
    answer: 'Buddhism was founded by Siddhartha Gautama (Lord Buddha, 563–483 BCE) who attained enlightenment at Bodh Gaya and taught Four Noble Truths and the Eightfold Path (Ashtangika Marga). Jainism was systematized by Vardhamana Mahavira (24th Tirthankara, 599–527 BCE) emphasizing Ahimsa (non-violence) and Anekantavada.',
    highlights: ['Buddha: First sermon at Sarnath (Dhammacakkappavattana); Parinirvana at Kushinagar; Tripitakas (Vinaya, Sutta, Abhidhamma)', 'Four Buddhist Councils: Rajgriha (483 BCE), Vaishali (383 BCE), Pataliputra (250 BCE under Ashoka), Kundalvana (72 CE under Kanishka)', 'Mahavira: 24th Tirthankara; Three Jewels (Triratna): Right Faith, Right Knowledge, Right Conduct', 'Two main sects: Buddhism (Hinayana, Mahayana); Jainism (Digambara, Svetambara)'],
    url: 'https://en.wikipedia.org/wiki/Buddhism'
  },
  {
    id: 'ncert-gupta-empire',
    keywords: ['gupta empire golden age', 'chandragupta samudragupta vikramaditya', 'kalidasa aryabhata gupta period'],
    title: 'Gupta Empire — Golden Age of Ancient India (320–550 CE)',
    category: 'NCERT History',
    answer: 'The Gupta Empire (320–550 CE) founded by Sri Gupta and consolidated by Chandragupta I, Samudragupta (Napoleon of India), and Chandragupta II (Vikramaditya), is known as the Golden Age of India for revolutionary achievements in science, mathematics, astronomy, and Sanskrit literature.',
    highlights: ['Samudragupta: Prayag Prashasti (Allahabad Pillar inscription by Harisena) records his unbroken conquests', 'Chandragupta II (Vikramaditya): Court had Navratnas including great poet Kalidasa and physician Dhanvantari', 'Aryabhata (Aryabhatiya): Computed π ≈ 3.1416, proposed Earth rotates on axis and eclipses are shadows', 'Ajanta cave paintings and Mehrauli Iron Pillar (rustless metallurgy) belong to this era'],
    url: 'https://en.wikipedia.org/wiki/Gupta_Empire'
  },
  {
    id: 'ncert-french-revolution',
    keywords: ['french revolution 1789', 'storming of the bastille', 'liberty equality fraternity', 'louis xvi reign of terror robespierre'],
    title: 'The French Revolution (1789–1799)',
    category: 'NCERT History',
    answer: 'The French Revolution began on 14 July 1789 with the Storming of the Bastille fortress prison in Paris, overthrowing the Bourbon monarchy of King Louis XVI. It introduced the revolutionary ideals of Liberty, Equality, and Fraternity (Liberté, égalité, fraternité) to modern democracy.',
    highlights: ['Three Estates of Old Regime: Clergy (1st), Nobility (2nd), Commoners (3rd Estate — bore all taxes)', 'Tennis Court Oath (20 June 1789): National Assembly pledged to write a new Constitution', 'Reign of Terror (1793–1794): Maximilien Robespierre executed thousands via Guillotine', 'Ended in 1799 when Napoleon Bonaparte staged a coup d\'état and became First Consul'],
    url: 'https://en.wikipedia.org/wiki/French_Revolution'
  },
  {
    id: 'ncert-russian-revolution',
    keywords: ['russian revolution 1917', 'vladimir lenin bolsheviks', 'october revolution tsar nicholas ii', 'ussr formation 1922'],
    title: 'Russian Revolution of 1917 and Rise of the USSR',
    category: 'NCERT History',
    answer: 'The Russian Revolution of 1917 consisted of the February Revolution (overthrew Tsar Nicholas II and Romanov dynasty) and the October Revolution led by Vladimir Lenin and the Bolsheviks, establishing the world\'s first communist state which became the USSR (Soviet Union) in 1922.',
    highlights: ['February 1917: Food shortages and WWI losses forced Tsar Nicholas II to abdicate', 'October 1917: Lenin\'s Bolsheviks seized power with slogan "Peace, Land, and Bread"', 'April Theses: Lenin\'s program to end war, transfer land to peasants, and nationalize banks', 'Civil War (Reds vs Whites) ended in 1922 with the formation of the USSR under Bolshevik rule'],
    url: 'https://en.wikipedia.org/wiki/Russian_Revolution'
  },
  {
    id: 'ncert-nationalism-europe',
    keywords: ['nationalism in europe', 'unification of germany bismarck', 'unification of italy mazzini garibaldi cavour', 'treaty of vienna 1815'],
    title: 'Rise of Nationalism in Europe and Unifications',
    category: 'NCERT History',
    answer: 'Nationalism in 19th-century Europe transformed multi-ethnic empires into modern nation-states. Key milestones: Unification of Germany (1871 under Otto von Bismarck via "Blood and Iron" policy) and Unification of Italy (1861 led by Giuseppe Mazzini, Count Cavour, and Giuseppe Garibaldi).',
    highlights: ['Treaty of Vienna (1815): Restored Bourbon monarchy under conservative order after Napoleon\'s defeat at Waterloo', 'Giuseppe Mazzini founded secret society "Young Italy" in Marseilles in 1831', 'Otto von Bismarck orchestrated three wars (against Denmark, Austria, and France) to unify Germany in 1871', 'Kaiser Wilhelm I proclaimed German Emperor in the Hall of Mirrors at Versailles (1871)'],
    url: 'https://en.wikipedia.org/wiki/Rise_of_nationalism_in_Europe'
  },
  {
    id: 'ncert-indian-constitution-preamble',
    keywords: ['preamble indian constitution', 'sovereign socialist secular democratic republic', 'justice liberty equality fraternity', 'dr br ambedkar father of constitution'],
    title: 'Preamble and Architecture of Indian Constitution',
    category: 'NCERT Civics',
    answer: 'The Preamble is the introductory statement of the Constitution of India declaring India a "Sovereign, Socialist, Secular, Democratic Republic" securing Justice, Liberty, Equality, and Fraternity. Dr. B.R. Ambedkar was Chairman of the Drafting Committee. The Constitution was adopted on 26 November 1949 and enacted on 26 January 1950.',
    highlights: ['Key words added by 42nd Amendment (1976): "Socialist", "Secular", and "Integrity"', 'Constituent Assembly took 2 years, 11 months, and 18 days to draft the Constitution', 'Adopted 26 November 1949 (National Constitution Day); In effect from 26 January 1950 (Republic Day)', 'Dr. B.R. Ambedkar regarded Article 32 (Constitutional Remedies) as the Heart and Soul of the Constitution'],
    url: 'https://en.wikipedia.org/wiki/Preamble_to_the_Constitution_of_India'
  },
  {
    id: 'ncert-power-sharing-federalism',
    keywords: ['power sharing class 10', 'federalism in india', 'union state concurrent list', 'belgium sri lanka model civics'],
    title: 'Power Sharing and Federalism (Civics Class 10)',
    category: 'NCERT Civics',
    answer: 'Federalism is a system of government where power is divided between a central authority and constituent units (States). India has a 3-tier federal system (Union, State, Local Panchayati Raj) with legislative powers divided into Union List (100 items), State List (61 items), and Concurrent List (52 items).',
    highlights: ['Union List: Defence, Foreign Affairs, Banking, Currency (Union Parliament only)', 'State List: Police, Public Health, Agriculture, Prisons (State Legislature)', 'Concurrent List: Education, Forests, Marriage, Trade Unions (Both make laws; Union prevails in conflict)', 'Residuary Powers (e.g. Cyber Law) vest exclusively with the Union Parliament in India (Article 248)'],
    url: 'https://en.wikipedia.org/wiki/Federalism_in_India'
  },
  {
    id: 'ncert-monsoon-climate-india',
    keywords: ['monsoon in india', 'southwest monsoon onset', 'western disturbances', 'el nino climate effect india'],
    title: 'Climate of India and the South-West Monsoon',
    category: 'NCERT Geography',
    answer: 'India has a tropical monsoon climate dominated by seasonal reversal of winds. The South-West Monsoon arrives in Kerala around 1 June and covers the entire subcontinent by mid-July, providing over 75% of India\'s annual rainfall across two branches: Arabian Sea branch and Bay of Bengal branch.',
    highlights: ['Onset: 1 June in Kerala; retreats starting September from NW India', 'Mawsynram in Meghalaya receives the highest average annual rainfall in the world (~11,872 mm)', 'Western Disturbances: Cyclonic storms from Mediterranean bring winter rain to NW India (vital for Rabi wheat crop)', 'El Niño causes weak monsoons/droughts in India; La Niña brings normal to excess rainfall'],
    url: 'https://en.wikipedia.org/wiki/Monsoon_of_South_Asia'
  }
];

saveDb('ncert_class6_10.json', ncert6_10_entries);