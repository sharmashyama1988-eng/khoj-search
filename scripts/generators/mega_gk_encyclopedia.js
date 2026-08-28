const { saveDb } = require('../db_helper.js');

console.log("=== BUILDING MASSIVE GENERAL KNOWLEDGE (GK) ENCYCLOPEDIA ===");

// 1. SOBRIQUETS / NICKNAMES OF FAMOUS INDIANS (30 nodes)
const sobriquets = [
  ["Mahatma Gandhi", "Father of the Nation (Bapu)", "Conferred by Subhas Chandra Bose in 1944 over Singapore radio; also called Mahatma by Rabindranath Tagore"],
  ["Sardar Vallabhbhai Patel", "Iron Man of India / Bismarck of India", "Integrated 565 princely states into unified India; title 'Sardar' given by women of Bardoli Satyagraha (1928)"],
  ["Rabindranath Tagore", "Gurudev / Bard of Bengal", "Conferred by Mahatma Gandhi; Nobel Literature laureate (1913 for Gitanjali); composed Jana Gana Mana and Amar Shonar Bangla"],
  ["Subhas Chandra Bose", "Netaji / Patriot of Patriots", "Given by Indian soldiers in Germany in 1942; called Patriot of Patriots by Mahatma Gandhi; leader of Azad Hind Fauj"],
  ["Bal Gangadhar Tilak", "Lokmanya / Father of Indian Unrest", "British called him Father of Indian Unrest; popularized slogan 'Swaraj is my birthright and I shall have it'; started Kesari and Mahratta newspapers"],
  ["Lala Lajpat Rai", "Punjab Kesari (Lion of Punjab)", "Key leader of Lal-Bal-Pal trio; founded Servants of the People Society; led non-violent protest against Simon Commission in 1928"],
  ["Chittaranjan Das", "Deshbandhu (Friend of the Nation)", "Prominent lawyer and nationalist leader; mentor to Subhas Chandra Bose; co-founded Swaraj Party in 1923 with Motilal Nehru"],
  ["C.F. Andrews", "Deenbandhu (Friend of the Poor)", "Given by Mahatma Gandhi for his selfless dedication to poor Indian indentured labourers and freedom cause"],
  ["Jayaprakash Narayan", "Loknayak (People's Leader)", "Led the JP Total Revolution Movement (Sampoorna Kranti) in 1974 against government corruption and Emergency; Bharat Ratna (1999)"],
  ["Madan Mohan Malaviya", "Mahamana", "Conferred by Mahatma Gandhi; founded Banaras Hindu University (BHU) in 1916; Bharat Ratna (2014)"],
  ["Sarojini Naidu", "Nightingale of India (Bharat Kokila)", "Given by Mahatma Gandhi for her poetic lyrics (The Golden Threshold); first Indian woman President of INC (1925 Kanpur) and first woman Governor (UP)"],
  ["Dadabhai Naoroji", "Grand Old Man of India", "Pioneered 'Drain of Wealth' theory in 'Poverty and Un-British Rule in India'; first Indian elected to British House of Commons (1892)"],
  ["Khan Abdul Ghaffar Khan", "Frontier Gandhi (Badshah Khan)", "Pashtun leader of Khudai Khidmatgar (Red Shirts) movement; practiced non-violence; first non-Indian awarded Bharat Ratna (1987)"],
  ["Dr. APJ Abdul Kalam", "Missile Man of India / People's President", "Led development of India's indigenous missile defense program (Agni, Prithvi) and Pokhran-II nuclear tests; 11th President of India"],
  ["E. Sreedharan", "Metro Man of India", "Civil engineer who spearheaded the construction of Konkan Railway and Delhi Metro network ahead of schedule"],
  ["Salim Ali", "Birdman of India", "Eminent ornithologist and naturalist who conducted systematic bird surveys across India; authored 'The Book of Indian Birds'"],
  ["Rajendra Singh", "Waterman of India", "Water conservationist and environmentalist from Alwar, Rajasthan; won Ramon Magsaysay Award (2001) and Stockholm Water Prize (2015) for building Johads (rainwater storage tanks)"],
  ["Milkha Singh", "The Flying Sikh", "Legendary Indian track and field sprinter; 4-time Asian Games gold medallist; finished 4th in 400m at 1960 Rome Olympics (45.6s)"],
  ["P.T. Usha", "Payyoli Express / Queen of Indian Track", "Legendary sprinter; won 4 gold medals at 1986 Seoul Asian Games; missed Olympic bronze by 1/100th of a second in 400m hurdles at Los Angeles 1984; President of Indian Olympic Association (IOA)"],
  ["Dhyan Chand", "The Wizard / Magician of Hockey", "Greatest field hockey player in history; scored 570+ goals; led India to 3 consecutive Olympic Gold medals (1928 Amsterdam, 1932 Los Angeles, 1936 Berlin); birthday 29 Aug is National Sports Day"],
  ["Sunil Gavaskar", "Little Master / Sunny", "First batsman to score 10,000 Test runs and 34 Test centuries; member of 1983 World Cup winning team"],
  ["Kapil Dev", "Haryana Hurricane", "Legendary all-rounder who captained India to its maiden ICC Cricket World Cup victory in 1983; took 434 Test wickets"],
  ["Lata Mangeshkar", "Queen of Melody / Nightingale of India", "Legendary playback singer recording songs in over 36 languages across 7 decades; awarded Bharat Ratna (2001), Dadasaheb Phalke Award (1989), Legion of Honour"],
  ["M.S. Subbulakshmi", "Queen of Music (Carnatic Music Legend)", "First musician ever awarded Bharat Ratna (1998) and first Indian musician to perform at UN General Assembly (1966)"],
  ["Mother Teresa", "Saint of the Gutters", "Founded Missionaries of Charity in Kolkata (1950) serving poor, sick, and dying; Nobel Peace Prize (1979), Bharat Ratna (1980), canonized as Saint Teresa of Calcutta (2016)"],
  ["Homi J. Bhabha", "Father of the Indian Nuclear Program", "Nuclear physicist who founded Tata Institute of Fundamental Research (TIFR) and Atomic Energy Commission of India"],
  ["Vikram Sarabhai", "Father of the Indian Space Program", "Physicist and astronomer who founded ISRO (1969) and Physical Research Laboratory (PRL) in Ahmedabad"],
  ["M.S. Swaminathan", "Father of the Green Revolution in India", "Geneticist who introduced high-yielding semi-dwarf wheat and rice varieties (Norman Borlaug collaboration), transforming India into a food-secure nation; Bharat Ratna (2024)"],
  ["Verghese Kurien", "Father of the White Revolution (Milkman of India)", "Architect of 'Operation Flood' (world's largest agricultural dairy development program) and founder of Amul (Anand Milk Union Limited)"],
  ["Sam Pitroda", "Father of India's Telecom Revolution", "Pioneered indigenous C-DOT telephone exchanges and public call offices (PCOs) in the 1980s under PM Rajiv Gandhi"]
];

const sobriquetNodes = sobriquets.map((s, idx) => {
  const [name, title, desc] = s;
  return {
    id: `gk-sobriquet-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `who is known as ${title.toLowerCase()}`,
      `nickname of ${name.toLowerCase()}`,
      `title of ${name.toLowerCase()}`,
      `who is ${title.toLowerCase()}`,
      `${name.toLowerCase()} sobriquet`
    ],
    title: `${name} — ${title}`,
    category: 'General Knowledge',
    answer: `${name} is famously known as the "${title}". ${desc}.`,
    highlights: [
      `Person: ${name}`,
      `Sobriquet / Title: ${title}`,
      `Historical Context: ${desc}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.split(' ')[0]}`
  };
});
saveDb('general_knowledge.json', sobriquetNodes);

// 2. FAMOUS DAMS AND RIVER VALLEY PROJECTS IN INDIA (25 nodes)
const indianDams = [
  ["Tehri Dam", "Bhagirathi River", "Uttarakhand", "Tallest dam in India (height 260.5 m / 855 ft); rock and earth-fill embankment dam; 2,400 MW hydroelectric capacity"],
  ["Bhakra Nangal Dam", "Sutlej River", "Himachal Pradesh & Punjab", "Second tallest dam in India (height 226 m); highest straight gravity dam in Asia; forms Gobind Sagar reservoir"],
  ["Hirakud Dam", "Mahanadi River", "Odisha (Sambalpur)", "Longest major earthen dam in India and world (total length 25.8 km; main dam 4.8 km); forms 743 km² Hirakud reservoir"],
  ["Sardar Sarovar Dam", "Narmada River", "Gujarat (Navagam)", "Gravity dam providing water to Gujarat, MP, Maharashtra, Rajasthan; Statue of Unity located 3.2 km downstream"],
  ["Nagarjuna Sagar Dam", "Krishna River", "Andhra Pradesh & Telangana", "World's largest masonry dam built with stone mortar; 124 m high with 26 crest gates"],
  ["Idukki Dam", "Periyar River", "Kerala", "Double curvature parabolic concrete arch dam (height 168.9 m) constructed between Kuravan and Kurathi hills"],
  ["Koyna Dam", "Koyna River", "Maharashtra (Satara)", "Largest completed hydroelectric plant in Maharashtra (1,960 MW capacity); rubble-concrete dam in seismic zone"],
  ["Rihand Dam (Govind Ballabh Pant Sagar)", "Rihand River", "Uttar Pradesh (Sonbhadra)", "Largest artificial reservoir lake by volume in India (Govind Ballabh Pant Sagar)"],
  ["Mettur Dam (Stanley Reservoir)", "Kaveri (Cauvery) River", "Tamil Nadu (Salem)", "One of the oldest large dams in India (built 1934); main irrigation source for fertile Cauvery Delta"],
  ["Almatti Dam (Lal Bahadur Shastri Dam)", "Krishna River", "Karnataka (Bagalkot)", "Main reservoir of Upper Krishna Irrigation Project with 290 MW hydroelectric generation"],
  ["Tungabhadra Dam (Pampa Sagar)", "Tungabhadra River", "Karnataka (Hosapete)", "Multipurpose composite gravity and earthen dam near historic Hampi ruins"],
  ["Indira Sagar Dam", "Narmada River", "Madhya Pradesh (Khandwa)", "Largest water storage capacity reservoir in India (12.22 billion cubic metres) with 1,000 MW hydro capacity"],
  ["Maithon Dam", "Barakar River", "Jharkhand (Dhanbad)", "Damodar Valley Corporation (DVC) dam with unique underground hydroelectric power station"],
  ["Panchet Dam", "Damodar River", "Jharkhand & West Bengal border", "Damodar Valley Corporation flood control dam built in 1959"],
  ["Farakka Barrage", "Ganga (Ganges) River", "West Bengal (Murshidabad)", "Feeder canal diverting 40,000 cusecs water into Hooghly River to flush silt from Kolkata Port"],
  ["Pravarsagar Dam / Bhandardara", "Pravara River", "Maharashtra (Ahmednagar)", "One of the oldest stone dams in India; Arthur Lake reservoir and Wilson Dam"],
  ["Ujjani Dam (Bhima Dam)", "Bhima River", "Maharashtra (Solapur)", "Earthfill-cum-masonry gravity dam supporting extensive sugarcane irrigation in western Maharashtra"],
  ["Ranjit Sagar Dam (Thein Dam)", "Ravi River", "Punjab & Jammu and Kashmir border", "Highest earth-core gravel shell dam in India (160 m high); 600 MW hydroelectric capacity"],
  ["Baglihar Dam", "Chenab River", "Jammu and Kashmir (Ramban)", "Run-of-the-river hydroelectric power project (900 MW) on Chenab River built under Indus Waters Treaty provisions"],
  ["Salal Dam", "Chenab River", "Jammu and Kashmir (Reasi)", "Run-of-the-river power project (690 MW) on Chenab River near Dhyangarh rock"],
  ["Kallanai Dam (Grand Anicut)", "Kaveri (Cauvery) River", "Tamil Nadu (Thanjavur)", "World's oldest functional water-diversion water-regulator structure; built by Chola King Karikalan in 2nd century CE"],
  ["Bisalpur Dam", "Banas River", "Rajasthan (Tonk)", "Gravity dam serving as primary drinking water lifeline for Jaipur, Ajmer, and Tonk cities"],
  ["Gandhi Sagar Dam", "Chambal River", "Madhya Pradesh (Mandsaur)", "One of four major dams on Chambal River; masonry gravity dam built in 1960"],
  ["Ukai Dam (Vallabh Sagar)", "Tapti (Tapi) River", "Gujarat (Surat)", "Second largest reservoir in Gujarat after Sardar Sarovar; earth-cum-masonry dam"],
  ["Jayakwadi Dam (Nath Sagar)", "Godavari River", "Maharashtra (Chhatrapati Sambhajinagar / Paithan)", "One of the largest earthen irrigation dams in Asia (earthen embankment length ~10 km) on holy Godavari River"]
];

const damNodes = indianDams.map((d, idx) => {
  const [name, river, state, desc] = d;
  return {
    id: `gk-dam-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `${name.toLowerCase()}`,
      `${name.toLowerCase()} river`,
      `${name.toLowerCase()} state`,
      `which river is ${name.toLowerCase()} built on`,
      `where is ${name.toLowerCase()}`
    ],
    title: `${name} — Built on ${river} (${state})`,
    category: 'Geography',
    answer: `${name} is located in ${state} across the ${river}. ${desc}.`,
    highlights: [
      `Dam Name: ${name}`,
      `River: ${river}`,
      `State / Location: ${state}`,
      `Key Technical Details: ${desc}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.split(' ')[0]}`
  };
});
saveDb('geography.json', damNodes);

// 3. FAMOUS NATIONAL PARKS & TIGER RESERVES OF INDIA (25 nodes)
const nationalParks = [
  ["Jim Corbett National Park", "Uttarakhand (Nainital)", "First National Park of India (established 1936 as Hailey National Park); first park under Project Tiger (1973); Royal Bengal tigers, Asian elephants"],
  ["Kaziranga National Park", "Assam (Golaghat & Nagaon)", "UNESCO World Heritage Site; hosts two-thirds of the world's Great One-horned Rhinoceroses (~2,600+ rhinos), wild water buffalo, swamp deer"],
  ["Ranthambore National Park", "Rajasthan (Sawai Madhopur)", "Famous tiger reserve known for diurnal Bengal tigers hunting near historic 10th-century Ranthambore Fort and Padam Talao lake"],
  ["Sundarbans National Park", "West Bengal", "UNESCO World Heritage Site & Ramsar Wetland; world's largest coastal mangrove forest; swimming Royal Bengal Tigers, saltwater crocodiles, Sundari trees"],
  ["Gir National Park and Wildlife Sanctuary", "Gujarat (Junagadh)", "Only wild habitat of the endangered Asiatic Lion (Panthera leo leo) in the entire world"],
  ["Bandipur National Park", "Karnataka (Chamarajanagar)", "Part of Nilgiri Biosphere Reserve; major tiger reserve along Kabini and Moyar rivers with large Asian elephant herds"],
  ["Kanha National Park (Kanha Tiger Reserve)", "Madhya Pradesh (Mandla & Balaghat)", "Inspiration for Rudyard Kipling's 'The Jungle Book'; saved the endangered Hard-ground Barasingha (swamp deer - state animal of MP)"],
  ["Periyar National Park and Wildlife Sanctuary", "Kerala (Idukki & Pathanamthitta)", "Elephant and tiger reserve in Cardamom Hills of Western Ghats around scenic Periyar Lake; boat safaris"],
  ["Silent Valley National Park", "Kerala (Palakkad)", "Undisturbed tropical evergreen rainforest in Nilgiri Hills; famous for endangered Lion-tailed Macaque; protected after historic 1970s environmental movement"],
  ["Hemis National Park", "Ladakh", "Largest National Park in India (~4,400 km²) and highest in altitude; global stronghold of the elusive Snow Leopard"],
  ["Keibul Lamjao National Park", "Manipur (Bishnupur)", "World's ONLY floating national park located on Loktak Lake; habitat of the endangered Sangai brow-antlered dancing deer on floating biomass (Phumdis)"],
  ["Keoladeo National Park (Bharatpur Bird Sanctuary)", "Rajasthan (Bharatpur)", "UNESCO World Heritage Site; man-made wetland bird paradise hosting over 370 bird species including migratory Siberian cranes in winter"],
  ["Manas National Park", "Assam", "UNESCO World Heritage Site, Biosphere Reserve & Tiger Reserve on Manas River bordering Bhutan; habitat of Pygmy Hog, Golden Langur, Hispid Hare"],
  ["Dudhwa National Park", "Uttar Pradesh (Lakhimpur Kheri)", "Terai marshland ecosystem in Indo-Nepal border region; tigers, rhinos, swamp deer, leopards"],
  ["Tadoba Andhari Tiger Reserve", "Maharashtra (Chandrapur)", "Oldest and largest national park in Maharashtra; dense teak forests with high tiger density"],
  ["Bandhavgarh National Park", "Madhya Pradesh (Umaria)", "Highest known tiger density in India; historic Bandhavgarh Fort; ancestral home of white tigers (first captured Mohan 1951)"],
  ["Nagarhole National Park (Rajiv Gandhi National Park)", "Karnataka (Kodagu & Mysore)", "Part of Nilgiri Biosphere Reserve; rich predator-prey density (tigers, leopards, dholes, elephants) along Kabini reservoir"],
  ["Great Himalayan National Park", "Himachal Pradesh (Kullu)", "UNESCO World Heritage Site; alpine meadows, glaciers; home to Western Tragopan pheasant, Snow Leopard, Himalayan Tahr, Musk Deer"],
  ["Khangchendzonga National Park", "Sikkim", "India's ONLY Mixed (Natural & Cultural) UNESCO World Heritage Site; surrounds Mount Kangchenjunga (8,586 m); red panda, snow leopard"],
  ["Valley of Flowers National Park", "Uttarakhand (Chamoli)", "UNESCO World Heritage Site in West Himalaya; endemic alpine floral meadows and medicinal plants against Nanda Devi backdrop"],
  ["Desert National Park", "Rajasthan (Jaisalmer & Barmer)", "Thar desert ecosystem; critical breeding ground of critically endangered Great Indian Bustard (Godawan) and desert fox"],
  ["Simlipal National Park", "Odisha (Mayurbhanj)", "Tiger reserve and Biosphere reserve with red silk cotton trees, Joranda and Barehipani waterfalls; melanistic (black) tigers found here"],
  ["Satpura National Park", "Madhya Pradesh (Hoshangabad)", "Rich biodiversity in Satpura range; gorges, sandstone peaks (Dhoopgarh highest peak in MP), leopard and sloth bear habitat"],
  ["Pench National Park", "Madhya Pradesh & Maharashtra border", "Named after Pench river; settings of Kipling's Jungle Book; teak forests with high concentration of chital and tigers"],
  ["Namdapha National Park", "Arunachal Pradesh (Changlang)", "Fourth largest national park in India; only park in the world with four feline predator species: Tiger, Leopard, Snow Leopard, and Clouded Leopard"]
];

const parkNodes = nationalParks.map((p, idx) => {
  const [name, loc, desc] = p;
  return {
    id: `gk-park-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `${name.toLowerCase()}`,
      `where is ${name.toLowerCase()}`,
      `${name.toLowerCase()} famous for`,
      `state of ${name.toLowerCase()}`,
      `national park ${name.toLowerCase()}`
    ],
    title: `${name} — ${loc}`,
    category: 'General Knowledge',
    answer: `${name} is situated in ${loc}. ${desc}.`,
    highlights: [
      `Park Name: ${name}`,
      `Location: ${loc}`,
      `Significance & Wildlife: ${desc}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.split(' ')[0]}`
  };
});
saveDb('general_knowledge.json', parkNodes);

// 4. IMPORTANT INTERNATIONAL ORGANIZATIONS & HEADQUARTERS (25 nodes)
const internationalOrgs = [
  ["United Nations (UN)", "New York City, USA", "Established 24 October 1945 (UN Charter); 193 member states; Secretary-General: António Guterres; 6 principal organs"],
  ["World Health Organization (WHO)", "Geneva, Switzerland", "UN specialized agency for international public health founded 7 April 1948 (World Health Day); Director-General: Tedros Adhanom Ghebreyesus"],
  ["UNESCO", "Paris, France", "UN Educational, Scientific and Cultural Organization founded 16 November 1945; protects World Heritage Sites, promotes education and science"],
  ["UNICEF", "New York City, USA", "UN Children's Fund created 11 December 1946; provides humanitarian and developmental aid to children and mothers worldwide; 1965 Nobel Peace Prize"],
  ["International Monetary Fund (IMF)", "Washington, D.C., USA", "Bretton Woods institution founded 1944; 190 member countries; promotes global monetary stability and macroeconomic lending; Managing Director: Kristalina Georgieva"],
  ["World Bank Group (WBG)", "Washington, D.C., USA", "Bretton Woods twin institution founded 1944; consists of IBRD and IDA; provides loans and grants for infrastructure and poverty reduction in developing nations"],
  ["World Trade Organization (WTO)", "Geneva, Switzerland", "Established 1 January 1995 under Marrakesh Agreement replacing GATT (1947); regulates international trade agreements and dispute resolution"],
  ["International Labour Organization (ILO)", "Geneva, Switzerland", "Established 1919 under Treaty of Versailles; UN agency promoting international labor standards and decent work; 1969 Nobel Peace Prize"],
  ["Food and Agriculture Organization (FAO)", "Rome, Italy", "UN agency leading international efforts to defeat hunger and improve food security; founded 16 October 1945 (World Food Day)"],
  ["International Atomic Energy Agency (IAEA)", "Vienna, Austria", "World's Atoms for Peace organization founded 1957; promotes peaceful nuclear energy and inspects nuclear non-proliferation; 2005 Nobel Peace Prize"],
  ["International Court of Justice (ICJ)", "The Hague, Netherlands (Peace Palace)", "Principal judicial organ of the UN founded 1945; 15 judges elected for 9-year terms; settles legal disputes between sovereign states"],
  ["International Criminal Court (ICC)", "The Hague, Netherlands", "Permanent international tribunal governed by Rome Statute (2002); prosecutes individuals for genocide, crimes against humanity, war crimes, and aggression"],
  ["INTERPOL (International Criminal Police Organization)", "Lyon, France", "World's largest international police organization with 196 member countries facilitating cross-border police cooperation and Red Notices"],
  ["North Atlantic Treaty Organization (NATO)", "Brussels, Belgium", "Intergovernmental military alliance established by North Atlantic Treaty (4 April 1949); Article 5 collective defense commitment; 32 member nations (Sweden joined 2024)"],
  ["European Union (EU)", "Brussels, Belgium (de facto capital)", "Economic and political union of 27 European countries; single market, Euro currency (used by 20 countries in Eurozone), Schengen border-free area"],
  ["Association of Southeast Asian Nations (ASEAN)", "Jakarta, Indonesia", "Regional intergovernmental organization established 8 August 1967 (Bangkok Declaration); 10 member states in Southeast Asia promoting economic and security growth"],
  ["South Asian Association for Regional Cooperation (SAARC)", "Kathmandu, Nepal", "Regional organization of 8 South Asian nations (India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, Maldives, Afghanistan) founded 8 December 1985 in Dhaka"],
  ["Shanghai Cooperation Organisation (SCO)", "Beijing, China (Secretariat) / Tashkent (RATS)", "Eurasian political, economic, and defense alliance founded 2001; 10 member states including India, China, Russia, Pakistan, Iran, Belarus"],
  ["BRICS", "No permanent secretariat (Rotating presidency)", "Intergovernmental alliance of major emerging economies (Brazil, Russia, India, China, South Africa) expanded in 2024 to include Egypt, Ethiopia, Iran, UAE; New Development Bank (NDB) in Shanghai"],
  ["Organization of the Petroleum Exporting Countries (OPEC)", "Vienna, Austria", "Cartel of 12 oil-exporting developing nations founded in Baghdad (1960) coordinating petroleum production quotas and market pricing"],
  ["Organisation for Economic Co-operation and Development (OECD)", "Paris, France", "Intergovernmental economic forum of 38 high-income developed countries founded in 1961 to promote global market democracy policies"],
  ["Commonwealth of Nations", "London, United Kingdom (Marlborough House)", "Political association of 56 member states, almost all former territories of the British Empire; Head: King Charles III; biennial CHOGM summits"],
  ["World Intellectual Property Organization (WIPO)", "Geneva, Switzerland", "UN agency founded 1967 administering international patent (PCT), trademark (Madrid System), and copyright treaties"],
  ["International Maritime Organization (IMO)", "London, United Kingdom", "UN specialized agency responsible for regulating maritime shipping safety, security, and ocean pollution prevention (MARPOL)"],
  ["Universal Postal Union (UPU)", "Bern, Switzerland", "Second oldest international organization (established 1874 by Treaty of Bern); coordinates postal policies and global mailing systems among member nations"]
];

const orgNodes = internationalOrgs.map((o, idx) => {
  const [name, hq, desc] = o;
  return {
    id: `gk-org-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `headquarters of ${name.toLowerCase()}`,
      `where is ${name.toLowerCase()} located`,
      `${name.toLowerCase()} hq`,
      `about ${name.toLowerCase()}`,
      `${name.toLowerCase()} facts`
    ],
    title: `${name} — Headquarters: ${hq}`,
    category: 'General Knowledge',
    answer: `${name} is headquartered in ${hq}. ${desc}.`,
    highlights: [
      `Organization: ${name}`,
      `Headquarters: ${hq}`,
      `Charter / Role: ${desc}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.split(' ')[0]}`
  };
});
saveDb('general_knowledge.json', orgNodes);

// 5. IMPORTANT ANNUAL NATIONAL & INTERNATIONAL DAYS (30 nodes)
const annualDays = [
  ["National Youth Day (India)", "12 January", "Celebrated on birthday of Swami Vivekananda (pioneering Hindu monk who introduced Vedanta/Yoga to West at 1893 Chicago Parliament)"],
  ["National Army Day (India)", "15 January", "Commemorates Field Marshal K.M. Cariappa taking over as first Indian Commander-in-Chief of the Indian Army in 1949"],
  ["National Girl Child Day (India)", "24 January", "Promotes awareness on rights of girl children, education, health, and gender equality in India"],
  ["National Voters Day (India)", "25 January", "Marks the foundation day of the Election Commission of India (established 25 January 1950)"],
  ["World Wetlands Day", "2 February", "Commemorates the adoption of the Ramsar Convention on Wetlands in Ramsar, Iran (2 February 1971)"],
  ["World Cancer Day", "4 February", "Global initiative led by UICC to raise cancer awareness, early screening, prevention, and equitable care"],
  ["National Science Day (India)", "28 February", "Commemorates Sir C.V. Raman's discovery of the Raman Effect (scattering of light) on 28 February 1928, which won 1930 Nobel Physics Prize"],
  ["International Women's Day", "8 March", "Global UN day celebrating social, economic, cultural, and political achievements of women; theme of gender equity"],
  ["World Water Day", "22 March", "UN day highlighting importance of freshwater and advocating for sustainable management of freshwater resources"],
  ["World Health Day", "7 April", "Marks the founding of the World Health Organization (WHO) in 1948; raises global priority health awareness"],
  ["World Earth Day", "22 April", "Global environmental protection movement initiated in 1970; highlights climate action, reforestation, plastic reduction"],
  ["National Panchayati Raj Day (India)", "24 April", "Marks the enactment of the 73rd Constitutional Amendment Act, 1992, granting constitutional status to Panchayats"],
  ["International Labour Day (May Day)", "1 May", "Celebrates the historical struggles and victories of workers and labor unions; 8-hour workday movement"],
  ["World Press Freedom Day", "3 May", "UN day commemorating the Declaration of Windhoek (1991) promoting freedom of the press and journalist safety"],
  ["World Environment Day", "5 June", "Principal UN environmental vehicle established at 1972 Stockholm Conference; fosters global action on ecosystem restoration"],
  ["World Oceans Day", "8 June", "UN day highlighting role of oceans as lungs of planet, major food source, and climate regulator"],
  ["International Day of Yoga", "21 June", "Adopted by UN General Assembly in 2014 following PM Narendra Modi's proposal; celebrated on summer solstice"],
  ["National Doctors Day (India)", "1 July", "Honours Dr. Bidhan Chandra Roy (legendary physician, Bharat Ratna, and 2nd Chief Minister of West Bengal on his birth/death anniversary)"],
  ["World Population Day", "11 July", "Established by UNDP in 1989 on Day of Five Billion (11 July 1987) to focus on reproductive health and population issues"],
  ["Kargil Vijay Diwas (India)", "26 July", "Commemorates India's victory over Pakistani intruding forces in Operation Vijay during 1999 Kargil War"],
  ["International Tiger Day", "29 July", "Established at 2010 Saint Petersburg Tiger Summit to promote wild tiger conservation (Tx2 tiger doubling goal)"],
  ["National Handloom Day (India)", "7 August", "Commemorates the launch of the Swadeshi Handloom Movement in Calcutta Town Hall on 7 August 1905"],
  ["National Sports Day (India)", "29 August", "Celebrated on birthday of hockey wizard Major Dhyan Chand; National sports awards presented by President"],
  ["Teachers' Day (India)", "5 September", "Celebrates birthday of Dr. Sarvepalli Radhakrishnan (distinguished philosopher, 2nd President of India, Bharat Ratna 1954)"],
  ["International Literacy Day", "8 September", "Declared by UNESCO in 1966 to highlight literacy as a matter of dignity and fundamental human right"],
  ["Hindi Diwas (India)", "14 September", "Commemorates the Constituent Assembly adopting Hindi in Devanagari script as the official language of the Union on 14 September 1949"],
  ["International Day of Non-Violence", "2 October", "UN day observed on the birthday of Mahatma Gandhi promoting peace, tolerance, and non-violent conflict resolution"],
  ["United Nations Day", "24 October", "Marks the entry into force of the UN Charter on 24 October 1945 following ratification by majority of signatories"],
  ["National Unity Day (Rashtriya Ekta Diwas)", "31 October", "Celebrated on birthday of Sardar Vallabhbhai Patel, recognizing his role in unifying India; Run for Unity"],
  ["National Constitution Day (Samvidhan Diwas)", "26 November", "Commemorates the adoption of the Constitution of India by the Constituent Assembly on 26 November 1949"],
  ["Human Rights Day", "10 December", "Marks the adoption of the Universal Declaration of Human Rights (UDHR) by the UN General Assembly in Paris (10 December 1948); Nobel Prizes presented on this day"]
];

const dayNodes = annualDays.map((d, idx) => {
  const [name, date, desc] = d;
  return {
    id: `gk-day-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `when is ${name.toLowerCase()}`,
      `${name.toLowerCase()} date`,
      `what is celebrated on ${date.toLowerCase()}`,
      `importance of ${name.toLowerCase()}`
    ],
    title: `${name} — ${date}`,
    category: 'General Knowledge',
    answer: `${name} is observed annually on ${date}. ${desc}.`,
    highlights: [
      `Commemoration: ${name}`,
      `Annual Date: ${date}`,
      `Significance & Background: ${desc}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.split(' ')[0]}`
  };
});
saveDb('general_knowledge.json', dayNodes);

console.log("=== GK ENCYCLOPEDIA BATCH COMPLETED ===");