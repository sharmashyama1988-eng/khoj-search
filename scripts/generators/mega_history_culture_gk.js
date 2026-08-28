const { saveDb } = require('../db_helper.js');

console.log("=== BUILDING HISTORICAL BATTLES, CULTURE & FESTIVALS GK ===");

// 1. HISTORICAL BATTLES OF INDIA (25 nodes)
const indianBattles = [
  ["Battle of the Hydaspes", "326 BCE", "Jhelum River, Punjab", "Alexander the Great of Macedonia defeated King Porus (Puru) of Paurava kingdom; Alexander was impressed by Porus's bravery and reinstated him as satrap; Macedonian troops subsequently refused to march further into India against the Nanda Empire"],
  ["Kalinga War", "261 BCE", "Dhauli / Daya River, Odisha", "Fought between Maurya Emperor Ashoka the Great and the state of Kalinga; colossal bloodshed (100,000 slain, 150,000 captured) led Ashoka to deep remorse, prompting his conversion to Buddhism, abandonment of Digvijaya (military conquest) for Dhammavijaya (conquest by righteousness), and issuance of Rock Edicts"],
  ["First Battle of Tarain", "1191 CE", "Tarain (near Karnal, Haryana)", "Prithviraj Chauhan (ruler of Ajmer and Delhi) decisively defeated the Ghurid invader Muhammad Ghori, who was wounded and fled the battlefield"],
  ["Second Battle of Tarain", "1192 CE", "Tarain (Haryana)", "Muhammad Ghori returned with superior cavalry archery and defeated Prithviraj Chauhan, leading to the capture of Delhi and Ajmer and the establishment of the Delhi Sultanate (Mamluk dynasty under Qutb-ud-din Aibak in 1206)"],
  ["Battle of Khanwa", "16 March 1527", "Khanwa (near Agra, Rajasthan)", "Mughal Emperor Babur defeated the Rajput confederacy led by Rana Sanga of Mewar using Ottoman artillery and matchlock musketeers, securing Mughal control over northern India"],
  ["Battle of Ghaghra", "6 May 1529", "Ghaghra River, Bihar", "Babur defeated the combined forces of the Eastern Afghan sultans led by Mahmud Lodi and the Sultanate of Bengal under Nusrat Shah, consolidating the entire Gangetic plains"],
  ["Battle of Chausa", "26 June 1539", "Chausa (near Buxar, Bihar)", "Sher Shah Suri (Sher Khan) defeated Mughal Emperor Humayun; Humayun narrowly escaped by jumping on horseback into the swollen Ganges River and was saved by a water-carrier (Nizam)"],
  ["Battle of Kannauj (Bilgram)", "17 May 1540", "Kannauj, Uttar Pradesh", "Sher Shah Suri decisively routed Humayun, forcing him into a 15-year exile in Persia and establishing the Suri Empire (introduced Rupiya currency, renovated Grand Trunk Road / Sadak-e-Azam)"],
  ["Battle of Talikota (Rakkasagi-Tangadagi)", "23 January 1565", "Talikota (Karnataka)", "Alliance of Deccan Sultanates (Bijapur, Golconda, Ahmadnagar, Bidar) defeated the Vijayanagara Empire army led by Aliya Rama Raya, leading to the sacking, burning, and destruction of the magnificent capital city of Hampi"],
  ["Battle of Haldighati", "18 June 1576", "Haldighati Pass (Aravalli Range, Rajasthan)", "Mughal army led by Man Singh I of Amber defeated Maharana Pratap of Mewar; Maharana Pratap's legendary warhorse Chetak sacrificed his life saving his master; Maharana continued guerrilla resistance from the forests of Mewar"],
  ["Battle of Samugarh", "29 May 1658", "Samugarh (near Agra)", "Decisive battle for Mughal succession where Prince Aurangzeb and Murad Baksh defeated their elder brother Crown Prince Dara Shikoh, securing the Mughal throne for Aurangzeb (Alamgir I)"],
  ["Battle of Karnal", "24 February 1739", "Karnal, Haryana", "Persian Emperor Nader Shah decisively defeated Mughal Emperor Muhammad Shah Rangeela; Nader Shah plundered Delhi, massacred citizens, and carried off the Peacock Throne (Takht-i-Taus) and Koh-i-Noor diamond to Persia"],
  ["Battle of Plassey", "23 June 1757", "Palashi (Nadia, West Bengal)", "British East India Company under Robert Clive defeated Nawab Siraj-ud-Daulah of Bengal after Commander-in-Chief Mir Jafar defected; established British political dominance in India"],
  ["Battle of Wandiwash", "22 January 1760", "Vandavasi (Tamil Nadu)", "Third Carnatic War battle where British General Sir Eyre Coote decisively defeated French forces under Count de Lally, ending French imperial ambitions in India"],
  ["Fourth Anglo-Mysore War (Siege of Seringapatam)", "1799", "Srirangapatna (Karnataka)", "British forces under General George Harris and Arthur Wellesley stormed Tipu Sultan's capital island fortress; Tipu Sultan ('Tiger of Mysore') died heroically defending the water gate on 4 May 1799"],
  ["Second Anglo-Maratha War (Battle of Assaye)", "23 September 1803", "Assaye (Maharashtra)", "Major General Arthur Wellesley (later Duke of Wellington) defeated the Maratha armies of Scindia and Berar; Wellesley considered this battle his finest military victory (even greater than Waterloo)"],
  ["Battle of Sobraon (First Anglo-Sikh War)", "10 February 1846", "Sobraon (Sutlej River, Punjab)", "Decisive British victory under Sir Hugh Gough over the Sikh Khalsa Army; led to the Treaty of Lahore (1846) and British annexation of Jalandhar Doab and Jammu & Kashmir (sold to Gulab Singh)"],
  ["Battle of Gujrat (Second Anglo-Sikh War)", "21 February 1849", "Gujrat (Punjab, Pakistan)", "'Battle of Guns' where British artillery routed the Sikh forces, leading to Governor-General Lord Dalhousie annexing the entire Sikh Empire (Punjab) on 29 March 1849"],
  ["Revolt of 1857 (Sepoy Mutiny / First War of Independence)", "10 May 1857", "Meerut, Delhi, Kanpur, Lucknow, Jhansi", "Triggered by greased cartridges (Enfield rifle); Indian soldiers proclaimed Bahadur Shah Zafar Emperor of India; led by Rani Lakshmibai (Jhansi), Nana Saheb & Tatya Tope (Kanpur), Begum Hazrat Mahal (Lucknow), Kunwar Singh (Arrah, Bihar)"],
  ["Battle of Saragarhi", "12 September 1897", "Tirah region, NW Frontier (Pakistan)", "Heroic last stand of 21 soldiers of 36th Sikhs (British Indian Army) led by Havildar Ishar Singh against 10,000+ Afghan Pashtun tribesmen; all 21 soldiers perished after inflicting heavy casualties; posthumously awarded Indian Order of Merit (IOM)"],
  ["Battle of Kohima & Imphal (WWII)", "April–June 1944", "Nagaland & Manipur", "'Stalingrad of the East'; British Indian Army (XIV Army under General William Slim) decisively stopped the Japanese U-Go offensive and INA forces, turning the tide of the Pacific War in South Asia"],
  ["Battle of Asal Uttar (1965 War)", "8–10 September 1965", "Khem Karan, Punjab", "Largest tank battle since WWII; Indian Army (equipped with Centurion and AMX-13 tanks) created a 'Patton Nagar' destroying or capturing over 97 Pakistani M48 Patton tanks; Company Quartermaster Havildar Abdul Hamid awarded Param Vir Chakra"],
  ["Battle of Longewala (1971 War)", "4–7 December 1971", "Thar Desert, Jaisalmer, Rajasthan", "120 Indian soldiers of 23rd Battalion Punjab Regiment led by Major Kuldip Singh Chandpuri, supported by IAF Hawker Hunter aircraft from Jaisalmer, successfully defended the post against 2,000+ Pakistani troops and 45 tanks, destroying 34 enemy tanks"],
  ["Operation Meghdoot (1984 Siachen Glacier)", "13 April 1984", "Siachen Glacier, Ladakh (Karakoram)", "Preemptive Indian military operation that established permanent Indian control over the entire Siachen Glacier (76 km long), the highest battlefield in the world (up to 22,000 ft)"],
  ["Battle of Tololing & Tiger Hill (1999 Kargil War)", "June–July 1999", "Kargil, Dras, Ladakh", "Operation Vijay: Indian Army infantry (18 Grenadiers, 2 Rajputana Rifles, 8 Sikh, 1/11 Gorkha Rifles) supported by IAF Operation Safed Sagar and Bofors 155mm howitzers recaptured strategic mountain peaks Tololing, Point 5140, and Tiger Hill (Point 4660)"]
];

const battleNodes = indianBattles.map((b, idx) => {
  const [name, year, loc, desc] = b;
  return {
    id: `hist-battle-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `${name.toLowerCase()}`,
      `when was ${name.toLowerCase()} fought`,
      `${name.toLowerCase()} date winner`,
      `where was ${name.toLowerCase()}`,
      `details of ${name.toLowerCase()}`
    ],
    title: `${name} (${year}) — ${loc}`,
    category: 'History',
    answer: `${name} was fought in ${year} at ${loc}. ${desc}.`,
    highlights: [
      `Battle Name: ${name}`,
      `Year / Date: ${year}`,
      `Location: ${loc}`,
      `Historical Significance: ${desc}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.split(' ')[0]}`
  };
});
saveDb('history.json', battleNodes);

// 2. CLASSICAL & FOLK DANCES OF INDIA (25 nodes)
const dancesOfIndia = [
  ["Bharatanatyam", "Classical Dance", "Tamil Nadu", "Oldest classical dance tradition of India based on Natya Shastra; solo dance known for crisp geometric footwork (Adavus), expressive eye and hand mudras (Abhinaya), and Carnatic musical accompaniment"],
  ["Kathak", "Classical Dance", "Uttar Pradesh / North India", "Originated from temple storytellers (Kathakars); characterized by intricate rhythmic footwork (Tatkar), rapid pirouettes (Chakkars), Ghungroo beats, and Lucknow/Jaipur/Banaras Gharanas"],
  ["Kathakali", "Classical Dance-Drama", "Kerala", "Elaborate green face makeup (Paccha for noble heroes, Kathi for villains), large headdresses, and dramatic reenactments of episodes from Mahabharata and Ramayana accompanied by Chenda and Maddalam drums"],
  ["Kuchipudi", "Classical Dance-Drama", "Andhra Pradesh (Krishna district)", "Originated in Kuchipudi village; involves graceful movements, singing by dancers, and Tarangam (dancing on the rim of a brass plate with a pot balanced on the head)"],
  ["Odissi", "Classical Dance", "Odisha", "Sensuous, lyrical classical dance originating from Maharis (temple dancers) of Jagannath temple; characterized by the Tribhanga posture (three-bend body curve at neck, waist, and knee) and Chauka stance"],
  ["Manipuri (Jagoi)", "Classical Dance", "Manipur", "Gentle, lyrical devotional dance dedicated to Radha-Krishna Raasleela; dancers wear unique stiff cylindrical skirts (Kumil / Potloi) with subtle, floating movements and Pung cholom drum accompaniment"],
  ["Mohiniyattam", "Classical Dance", "Kerala", "Dance of the Enchantress (Mohini, Vishnu's avatar); graceful swaying solo female dance characterized by white and gold bordered Kasavu saree and LASYA (delicate, feminine) aesthetic"],
  ["Sattriya", "Classical Dance", "Assam", "Introduced in 15th century by Vaishnavite saint-reformer Mahapurusha Srimanta Sankardev in Sattras (monasteries); performed with Borgeet devotional songs and Khol drum"],
  ["Bihu Dance", "Folk Dance", "Assam", "Joyful folk dance performed by young men and women during Bohag Bihu (Rongali Bihu / Assamese New Year in mid-April) with rapid hand and hip movements, Dhol, Pepa (buffalo horn flute), and Taal"],
  ["Garba", "Folk Dance", "Gujarat", "UNESCO Intangible Cultural Heritage; circular folk dance performed during Navratri around a clay lantern (Garbha Deep) or idol of Goddess Durga with synchronized claps and singing"],
  ["Dandiya Raas", "Folk Dance", "Gujarat & Rajasthan", "Energetic mock-fight folk dance with colorful polished wooden sticks (dandiyas) representing the swords of Goddess Durga fighting Mahishasura during Navratri"],
  ["Bhangra", "Folk Dance", "Punjab", "High-energy, athletic harvest folk dance traditionally performed by Punjabi men during Baisakhi celebrating wheat harvest, accompanied by pounding Dhol beats and Chimta"],
  ["Giddha", "Folk Dance", "Punjab", "Graceful female counterpart of Bhangra performed by Punjabi women during festive and social occasions with Boliyaan couplets and clapping"],
  ["Lavani", "Folk Dance", "Maharashtra", "Combination of traditional song and dance performed to the powerful beats of the Dholki; known for its fast tempo, expressive rhythm, and 9-yard Nauvari saree attire"],
  ["Ghoomar", "Folk Dance", "Rajasthan", "Traditional folk dance of the Bhil tribe later adopted by royal Rajput communities; women twirl in swirling pirouettes wearing colorful voluminous Ghagra skirts"],
  ["Kalbelia", "Folk Dance", "Rajasthan", "UNESCO Intangible Cultural Heritage; sensuous serpentine snake-charmer dance of the Kalbelia gypsy nomadic community accompanied by the Poongi (been) and Duf"],
  ["Chhau Dance", "Folk / Martial Dance", "Jharkhand (Seraikela), West Bengal (Purulia), Odisha (Mayurbhanj)", "UNESCO Intangible Cultural Heritage; acrobatic semi-classical tribal martial dance enacting episodes from epics with elaborate papier-mâché masks (Purulia/Seraikela) and warrior movements"],
  ["Rouf", "Folk Dance", "Jammu and Kashmir", "Graceful traditional Kashmiri folk dance performed by women facing each other in two parallel rows with linked arms during Eid and spring harvest"],
  ["Yakshagana", "Folk Dance-Theatre", "Karnataka (Coastal & Malenadu)", "Traditional theatre form combining elaborate colorful costumes, headgear (Pagade), makeup, high-pitched Bhagavatha singing, Chande drums, and stylized dance dialogues enacting mythological epics"],
  ["Cheraw (Bamboo Dance)", "Folk Dance", "Mizoram", "Famous bamboo dance where male performers rhythmically clap horizontal bamboo pairs on the ground while women dancers gracefully step in and out of the shifting grids without getting caught"],
  ["Karakattam", "Folk Dance", "Tamil Nadu", "Ancient folk dance dedicated to Mariamman (rain goddess); dancers balance decorated water pots (Karakam) on their heads while performing intricate acrobatic steps"],
  ["Charkula", "Folk Dance", "Uttar Pradesh (Braj region)", "Traditional folk dance where women balance a multi-tiered wooden pyramid with 108 lit oil lamps (Charkula) on their heads while dancing to Rasiya songs on Dooj"],
  ["Fugdi", "Folk Dance", "Goa & Maharashtra (Konkan)", "All-female folk dance performed during Ganesh Chaturthi and Dhalo; women dance in circles and pairs, clapping and blowing air with 'Foo' sounds at accelerating tempos"],
  ["Nati", "Folk Dance", "Himachal Pradesh (Kullu & Sirmaur)", "Largest folk dance in the world (Guinness Record); graceful slow-paced community circle dance performed during Kullu Dussehra wearing traditional Chola and Pagri"],
  ["Matki Dance", "Folk Dance", "Madhya Pradesh (Malwa region)", "Solo female folk dance where women balance multiple earthen water pots on their heads while moving to the rhythm of Dhol beats during weddings and festivals"]
];

const danceNodes = dancesOfIndia.map((d, idx) => {
  const [name, type, state, desc] = d;
  return {
    id: `art-dance-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `${name.toLowerCase()}`,
      `${name.toLowerCase()} dance state`,
      `where is ${name.toLowerCase()} performed`,
      `is ${name.toLowerCase()} classical or folk`,
      `dance of ${state.toLowerCase()}`
    ],
    title: `${name} (${type}) — ${state}`,
    category: 'Art & Culture',
    answer: `${name} is a ${type} originating from ${state}. ${desc}.`,
    highlights: [
      `Dance Name: ${name}`,
      `Category: ${type}`,
      `State / Region: ${state}`,
      `Aesthetic & Musical Features: ${desc}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.split(' ')[0]}`
  };
});
saveDb('art_culture_india.json', danceNodes);

console.log("=== BATTLES AND CULTURE GK BATCH COMPLETED ===");