const { saveDb } = require('./db_helper.js');

// 1. GENERAL KNOWLEDGE
const gkEntries = [
  {
    id: 'gk-seven-wonders-world',
    keywords: ['new seven wonders of the world', 'seven wonders of the ancient world', 'great wall of china taj mahal petra colosseum chichen itza machu picchu christ the redeemer'],
    title: 'New 7 Wonders of the World',
    category: 'General Knowledge',
    answer: 'The New 7 Wonders of the World (chosen by global poll in 2007) are: (1) Great Wall of China, (2) Petra (Jordan), (3) Colosseum (Rome, Italy), (4) Chichén Itzá (Mexico), (5) Machu Picchu (Peru), (6) Taj Mahal (Agra, India), and (7) Christ the Redeemer (Rio de Janeiro, Brazil). Great Pyramid of Giza was given honorary status as the only surviving Ancient Wonder.',
    highlights: ['Great Wall of China: Over 21,196 km long; built across centuries for northern frontier defense', 'Petra: Ancient Nabataean city carved into rose-red sandstone cliffs in Jordan', 'Colosseum: Flavian amphitheatre in Rome, completed in 80 CE, held 50,000–80,000 spectators', 'Taj Mahal: White marble mausoleum in Agra built by Mughal Emperor Shah Jahan (1632–1653) for Mumtaz Mahal', 'Machu Picchu: 15th-century Inca citadel on mountain ridge in Andes, Peru (2,430 m above sea level)'],
    url: 'https://en.wikipedia.org/wiki/New7Wonders_of_the_World'
  },
  {
    id: 'gk-unesco-world-heritage-india',
    keywords: ['unesco world heritage sites in india', 'total unesco sites india', 'ajanta ellora taj mahal kaziranga', 'unesco sites list india'],
    title: 'UNESCO World Heritage Sites in India (42 Sites)',
    category: 'General Knowledge',
    answer: 'India has 42 UNESCO World Heritage Sites (34 Cultural, 7 Natural, and 1 Mixed: Khangchendzonga National Park) as of 2024. India ranks 6th in the world for most UNESCO heritage properties. The first sites inscribed in 1983 were Ajanta Caves, Ellora Caves, Agra Fort, and the Taj Mahal. The latest additions (2023) are Santiniketan (West Bengal) and Sacred Ensembles of the Hoysalas (Karnataka).',
    highlights: ['First Indian sites inscribed (1983): Ajanta Caves, Ellora Caves, Agra Fort, Taj Mahal', 'Only Mixed World Heritage Site: Khangchendzonga National Park (Sikkim, inscribed 2016)', 'Natural Sites (7): Kaziranga, Keoladeo, Manas, Sundarbans, Nanda Devi & Valley of Flowers, Western Ghats, Great Himalayan National Park', 'Latest (2023): Santiniketan (Rabindranath Tagore\'s university town) and Hoysala temples of Belur, Halebidu, and Somnathapura'],
    url: 'https://en.wikipedia.org/wiki/List_of_World_Heritage_Sites_in_India'
  },
  {
    id: 'gk-nobel-prizes-facts',
    keywords: ['nobel prize categories facts', 'who established nobel prize alfred nobel', 'nobel peace prize oslo', 'youngest oldest nobel prize winner'],
    title: 'The Nobel Prize — History, Categories & Records',
    category: 'General Knowledge',
    answer: 'The Nobel Prize was established in 1895 by the will of Swedish chemist and dynamite inventor Alfred Nobel. Prizes are awarded annually in 6 categories: Physics, Chemistry, Physiology or Medicine, Literature, Peace, and Economic Sciences (established 1968 by Sveriges Riksbank). Nobel Peace Prize is awarded in Oslo, Norway; all other 5 prizes are presented in Stockholm, Sweden on 10 December (Nobel\'s death anniversary).',
    highlights: ['First awarded: 10 December 1901 (Wilhelm Röntgen won first Physics Nobel for discovering X-rays)', 'Marie Curie: First woman to win a Nobel Prize, and only person to win in two different scientific fields (Physics 1903, Chemistry 1911)', 'Youngest winner: Malala Yousafzai (Nobel Peace Prize 2014 at age 17, shared with Kailash Satyarthi)', 'Oldest winner: John B. Goodenough (Nobel Chemistry Prize 2019 at age 97 for Lithium-ion batteries)', 'International Committee of the Red Cross (ICRC) has won the Nobel Peace Prize 3 times (1917, 1944, 1963)'],
    url: 'https://en.wikipedia.org/wiki/Nobel_Prize'
  },
  {
    id: 'gk-solar-system-planets',
    keywords: ['solar system planets order facts', 'mercury venus earth mars jupiter saturn uranus neptune', 'largest smallest hottest coldest planet', 'pluto dwarf planet 2006 iau'],
    title: 'Solar System — Order of Planets and Key Facts',
    category: 'General Knowledge',
    answer: 'The Solar System has 8 official planets ordered by distance from the Sun: Mercury (closest, smallest), Venus (hottest ~465°C, brightest, rotates clockwise), Earth (only known life), Mars (Red Planet, Olympus Mons volcano), Jupiter (largest, Great Red Spot, 95 moons), Saturn (prominent ring system, Titan moon), Uranus (ice giant, rotates on its side at 98° tilt), and Neptune (farthest, fastest winds ~2,100 km/h). Pluto was reclassified as a Dwarf Planet by the IAU in August 2006.',
    highlights: ['Inner/Terrestrial planets (rocky): Mercury, Venus, Earth, Mars | Outer/Jovian planets (gas/ice giants): Jupiter, Saturn, Uranus, Neptune', 'Hottest planet: Venus (~465°C due to dense 96% CO₂ runaway greenhouse atmosphere)', 'Largest planet & moon: Jupiter is largest planet; Ganymede (Jupiter\'s moon) is largest moon in solar system (bigger than Mercury)', 'Tallest volcano: Olympus Mons on Mars (22 km high — nearly 3 times height of Mt. Everest)', 'Asteroid belt lies between Mars and Jupiter; Kuiper belt lies beyond Neptune'],
    url: 'https://en.wikipedia.org/wiki/Solar_System'
  }
];

// 2. WORLD GEOGRAPHY ADVANCED
const geoAdvEntries = [
  {
    id: 'geo-deepest-ocean-trenches',
    keywords: ['deepest trench in world', 'mariana trench challenger deep', 'ocean depths trench list', 'deepest point on earth'],
    title: 'Mariana Trench — Deepest Point on Earth',
    category: 'Geography',
    answer: 'The Mariana Trench in the western Pacific Ocean is the deepest oceanic trench on Earth. Its deepest point, Challenger Deep, reaches approximately 10,994 metres (~36,070 feet or nearly 11 km) below sea level. Water pressure at the bottom exceeds 1,086 bar (over 1,000 times standard atmospheric pressure).',
    highlights: ['Deepest point: Challenger Deep (~10,994 m / 36,070 ft)', 'Located in western Pacific Ocean near Mariana Islands and Guam', 'First descent: Jacques Piccard and Don Walsh in bathyscaphe Trieste on 23 January 1960', 'Film director James Cameron completed solo dive in Deepsea Challenger in March 2012', 'Second deepest ocean trench: Tonga Trench (Horizon Deep, 10,882 m) in SW Pacific'],
    url: 'https://en.wikipedia.org/wiki/Mariana_Trench'
  },
  {
    id: 'geo-great-lakes-caspian-sea',
    keywords: ['largest lakes in the world', 'caspian sea superior baikal victoria tanganyika', 'deepest lake in the world lake baikal', 'freshwater vs saltwater lake'],
    title: 'Largest and Deepest Lakes on Earth',
    category: 'Geography',
    answer: 'The Caspian Sea (371,000 km²) is the world\'s largest lake/inland sea (endorheic saltwater). Lake Superior (82,100 km², North America) is the world\'s largest freshwater lake by surface area. Lake Baikal (Siberia, Russia) is the world\'s deepest lake (1,642 m / 5,387 ft) and largest freshwater lake by volume (containing ~20% of Earth\'s unfrozen surface fresh water).',
    highlights: ['Caspian Sea: Largest overall lake (371,000 km²), bordered by Russia, Kazakhstan, Turkmenistan, Iran, Azerbaijan', 'Lake Superior: Largest freshwater lake by surface area (82,100 km²)', 'Lake Baikal: Deepest lake (1,642 m), oldest lake (~25 million years), holds 20% of world fresh surface water', 'Lake Tanganyika (Africa): Longest freshwater lake (673 km) and second deepest (1,470 m)', 'Lake Victoria (Africa): Largest tropical lake and main reservoir of the Nile River'],
    url: 'https://en.wikipedia.org/wiki/List_of_lakes_by_area'
  }
];

// 3. HEALTH & MEDICINE
const healthEntries = [
  {
    id: 'health-cardiovascular-blood-pressure',
    keywords: ['blood pressure normal range', 'systolic vs diastolic blood pressure', 'hypertension hypotension mmhg', 'sphygmomanometer blood pressure'],
    title: 'Human Blood Pressure — Normal Ranges and Physiology',
    category: 'Health & Medicine',
    answer: 'Normal resting blood pressure for a healthy adult is approximately 120/80 mmHg (Systolic 120 mmHg during ventricular contraction / Diastolic 80 mmHg during ventricular relaxation). Measured using a Sphygmomanometer and stethoscope. Hypertension is diagnosed when blood pressure consistently exceeds 140/90 mmHg (or 130/80 mmHg under AHA guidelines).',
    highlights: ['Systolic pressure: Maximum pressure in arteries during ventricular systole (~120 mmHg)', 'Diastolic pressure: Minimum pressure in arteries during ventricular diastole (~80 mmHg)', 'Pulse pressure = Systolic - Diastolic (normal ~40 mmHg)', 'Hypertension stages: Stage 1 (130-139 / 80-89 mmHg), Stage 2 (≥140 / ≥90 mmHg), Hypertensive crisis (>180 / >120 mmHg)', 'Cardiac output = Heart rate (72 bpm) × Stroke volume (70 mL) ≈ 5.0 Litres/min'],
    url: 'https://en.wikipedia.org/wiki/Blood_pressure'
  },
  {
    id: 'health-endocrine-hormones',
    keywords: ['endocrine glands hormones list', 'master gland pituitary', 'insulin glucagon pancreas', 'thyroxine adrenaline cortisol melatonin'],
    title: 'Human Endocrine System — Glands and Hormones',
    category: 'Health & Medicine',
    answer: 'The endocrine system secretes hormones directly into the bloodstream. Key glands: Pituitary (Master gland at base of brain, secretes GH, TSH, ACTH, LH, FSH, Oxytocin, Vasopressin), Thyroid (Thyroxine T₄ and Triiodothyronine T₃ regulating basal metabolic rate), Pancreas (Insulin from β-cells lowers blood sugar; Glucagon from α-cells raises blood sugar), Adrenal (Adrenaline/Epinephrine for fight-or-flight; Cortisol for stress), Pineal (Melatonin for sleep-wake circadian rhythm).',
    highlights: ['Pituitary gland: Called master gland; controlled by Hypothalamus via releasing hormones', 'Pancreatic Islets of Langerhans: Beta cells secrete Insulin; Alpha cells secrete Glucagon', 'Diabetes mellitus: Type 1 (autoimmune destruction of β-cells); Type 2 (insulin resistance and secretory defect)', 'Thyroid gland requires Iodine to synthesize Thyroxine; deficiency causes Goitre', 'Adrenal medulla secretes Adrenaline (emergency hormone increasing heart rate, blood pressure, and glycogen breakdown)'],
    url: 'https://en.wikipedia.org/wiki/Endocrine_system'
  }
];

// 4. ART & CULTURE INDIA
const artCultureEntries = [
  {
    id: 'art-indian-classical-music-ragas',
    keywords: ['hindustani vs carnatic music', 'indian classical music ragas taalas', 'saptak svara swara sa re ga ma pa dha ni', 'major gharanas hindustani music'],
    title: 'Hindustani and Carnatic Classical Music Systems',
    category: 'Art & Culture',
    answer: 'Indian classical music has two primary traditions: Hindustani (North India, influenced by Persian/Arab traditions, focused on improvisation and Raga-time associations) and Carnatic (South India, strictly composition/Kriti based, formulated by Trinity of Carnatic Music: Tyagaraja, Muthuswami Dikshitar, and Syama Sastri). Both systems are based on 7 basic Swaras (Sa, Re, Ga, Ma, Pa, Dha, Ni) spanning 22 Shrutis (microtones).',
    highlights: ['Seven basic swaras: Shadja (Sa), Rishabha (Re), Gandhara (Ga), Madhyama (Ma), Panchama (Pa), Dhaivata (Dha), Nishada (Ni)', 'Major Hindustani Gharanas: Gwalior (oldest), Agra, Kirana, Jaipur-Atrauli, Patiala, Delhi', 'Trinity of Carnatic Music: Saint Tyagaraja, Muthuswami Dikshitar, and Syama Sastri (18th century)', 'Hindustani musical forms: Dhrupad (oldest classical form), Khayal (most popular), Thumri, Dadra, Tarana', 'Prominent instruments: Sitar (Pt. Ravi Shankar), Sarod (Ustad Amjad Ali Khan), Shehnai (Ustad Bismillah Khan), Flute/Bansuri (Pt. Hariprasad Chaurasia), Tabla (Ustad Zakir Hussain)'],
    url: 'https://en.wikipedia.org/wiki/Indian_classical_music'
  },
  {
    id: 'art-indian-temple-architecture',
    keywords: ['nagara vs dravida vs vesara temple architecture', 'shikhara vimana gopuram garbhagriha', 'khajuraho konark sun temple brihadisvara temple thanjavur'],
    title: 'Indian Temple Architecture — Nagara, Dravida & Vesara',
    category: 'Art & Culture',
    answer: 'Indian temple architecture is categorized into three major styles: (1) Nagara (North India: beehive-curved Shikhara over Garbhagriha, Amalaka crown, raised plinth; e.g. Khajuraho, Sun Temple Konark, Dilwara Jain temples), (2) Dravida (South India: stepped-pyramidal Vimana, monumental gateway Gopurams, Mandapas, temple water tank; e.g. Brihadisvara Temple Thanjavur, Meenakshi Amman Temple Madurai), and (3) Vesara (Hybrid style of Deccan under Chalukyas and Hoysalas; e.g. Belur, Halebidu, Pattadakal).',
    highlights: ['Core components of Hindu temple: Garbhagriha (sanctum sanctorum housing main deity), Mandapa (pillared assembly hall), Shikhara/Vimana (superstructure tower), Vahana (mount/vehicle of deity)', 'Brihadisvara Temple (Thanjavur, built 1010 CE by Raja Raja Chola I): World\'s first complete granite temple; 66 m high Vimana with 80-tonne single granite capstone (Kumbam)', 'Konark Sun Temple (Odisha, 13th century under King Narasimhadeva I): Conceived as colossal chariot with 24 carved stone wheels pulled by 7 horses', 'Kailash Temple at Ellora (Cave 16, built by Rashtrakuta King Krishna I, 8th century): World\'s largest monolithic rock-cut structure carved top-down from single basalt cliff'],
    url: 'https://en.wikipedia.org/wiki/Hindu_temple_architecture'
  }
];

// 5. PHILOSOPHY & ETHICS
const philosophyEntries = [
  {
    id: 'phil-six-orthodox-darshanas',
    keywords: ['six schools of indian philosophy shad darshana', 'nyaya vaisheshika samkhya yoga mimamsa vedanta', 'adi shankara advaita vedanta'],
    title: 'Six Orthodox Schools of Indian Philosophy (Shad-Darshana)',
    category: 'Philosophy',
    answer: 'The six orthodox (Astika — accepting Vedic authority) schools of classical Hindu philosophy are: (1) Nyaya (Logic and Epistemology by Sage Gautama), (2) Vaisheshika (Atomic naturalism and Metaphysics by Sage Kanada), (3) Samkhya (Dualism of Purusha/consciousness and Prakriti/matter by Sage Kapila), (4) Yoga (Mind control and Eight Limbs/Ashtanga Yoga by Sage Patanjali), (5) Purva Mimamsa (Vedic ritualism and Hermeneutics by Sage Jaimini), and (6) Uttara Mimamsa / Vedanta (Non-dualism/Advaita by Badarayana and Adi Shankaracharya).',
    highlights: ['Adi Shankaracharya (788–820 CE) consolidated Advaita Vedanta: Brahman alone is real, world is Maya (illusion), Jiva is non-different from Brahman (Aham Brahmasmi)', 'Ramanujacharya (Vishishtadvaita / Qualified Non-Dualism) and Madhvacharya (Dvaita / Strict Dualism)', 'Sage Kanada in Vaisheshika proposed that all matter is composed of indivisible atoms called Paramāṇu centuries before Democritus', 'Patanjali\'s 8 Limbs of Yoga: Yama (restraints), Niyama (observances), Asana (postures), Pranayama (breath control), Pratyahara (withdrawal of senses), Dharana (concentration), Dhyana (meditation), Samadhi (absorption)'],
    url: 'https://en.wikipedia.org/wiki/Hindu_philosophy'
  },
  {
    id: 'phil-western-ethics-kant-utilitarianism',
    keywords: ['utilitarianism vs deontology', 'immanuel kant categorical imperative', 'jeremy bentham john stuart mill greatest happiness principle', 'virtue ethics aristotle'],
    title: 'Major Western Ethical Theories — Deontology, Utilitarianism, Virtue Ethics',
    category: 'Philosophy',
    answer: 'The three predominant branches of normative ethics are: (1) Deontology (Duty-based ethics of Immanuel Kant — actions are inherently right or wrong based on the Categorical Imperative: act only according to maxims you can will to become universal laws), (2) Consequentialism / Utilitarianism (Jeremy Bentham and John Stuart Mill — actions are judged solely by outcomes; maximize greatest happiness for greatest number), and (3) Virtue Ethics (Aristotle — cultivation of moral character and practical wisdom/Phronesis achieving Eudaimonia/human flourishing via the Golden Mean).',
    highlights: ['Kant\'s Categorical Imperative: Treat humanity always as an end in itself, never merely as a means', 'Utilitarian principle: Utility = Pleasure/Wellbeing - Pain; Bentham (quantitative hedonic calculus) vs Mill (qualitative higher vs lower pleasures)', 'Aristotle\'s Golden Mean: Moral virtue is desirable middle state between excess and deficiency (e.g. Courage is mean between Rashness and Cowardice)', 'Trolley Problem (Philippa Foot, 1967): Classic thought experiment contrasting utilitarian decision (pull lever to save 5 kill 1) with deontological duty (do not actively cause harm)'],
    url: 'https://en.wikipedia.org/wiki/Ethics'
  }
];

saveDb('general_knowledge.json', gkEntries);
saveDb('world_geography_advanced.json', geoAdvEntries);
saveDb('health_medicine.json', healthEntries);
saveDb('art_culture_india.json', artCultureEntries);
saveDb('philosophy_ethics.json', philosophyEntries);