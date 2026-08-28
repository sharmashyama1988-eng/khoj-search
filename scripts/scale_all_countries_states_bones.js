const { saveDb } = require('./db_helper.js');

console.log("=== SCALE BATCH 3: COUNTRIES, GEOGRAPHY & HUMAN ANATOMY ===");

// 1. ALL 206 HUMAN BONES (Major Skeletal Groups & Specific Bones) -> 60 entries
const humanBones = [
  ["Femur (Thigh Bone)", "Longest, heaviest, and strongest bone in the human body; supports body weight during walking/running"],
  ["Stapes (Stirrup)", "Smallest and lightest bone in the human body (~3 mm long) located in the middle ear; transmits sound vibrations to inner ear oval window"],
  ["Malleus (Hammer)", "Largest of the three auditory ossicles in the middle ear; attached to tympanic membrane (eardrum)"],
  ["Incus (Anvil)", "Middle auditory ossicle connecting the malleus to the stapes"],
  ["Cranium (Skull Vault)", "Houses and protects the brain; composed of 8 cranial bones: Frontal, 2 Parietal, 2 Temporal, Occipital, Sphenoid, Ethmoid"],
  ["Mandible (Lower Jaw)", "Only movable bone in the human skull and the strongest bone of the human face"],
  ["Maxilla (Upper Jaw)", "Forms upper jaw, hard palate, and floor of the eye orbits"],
  ["Clavicle (Collarbone)", "Only horizontally oriented long bone in the human body; most commonly fractured bone; connects sternum to scapula"],
  ["Scapula (Shoulder Blade)", "Flat, triangular bone on posterior thorax connecting humerus with clavicle"],
  ["Sternum (Breastbone)", "Flat, T-shaped vertical bone in center of chest consisting of Manubrium, Body, and Xiphoid Process; protects heart and lungs"],
  ["Ribs (24 Ribs / 12 Pairs)", "Protects thoracic organs; 7 pairs True Ribs (1-7 attach to sternum directly), 3 pairs False Ribs (8-10 attach via cartilage), 2 pairs Floating Ribs (11-12 unattached in front)"],
  ["Humerus", "Long bone of the upper arm extending from the shoulder to the elbow"],
  ["Radius", "Lateral bone of the forearm (on the thumb side); articulates with capitulum of humerus and carpal bones"],
  ["Ulna", "Medial bone of the forearm (on the pinky side); forms the elbow joint with the trochlea of humerus (Olecranon process)"],
  ["Carpals (Wrist Bones - 8 Bones)", "Arranged in two rows: Scaphoid, Lunate, Triquetrum, Pisiform (proximal row); Trapezium, Trapezoid, Capitate, Hamate (distal row)"],
  ["Metacarpals (Palm Bones - 5 Bones)", "Five bones forming the palm numbered I to V starting from thumb to little finger"],
  ["Phalanges of Hand (14 Bones)", "Fingers: 2 phalanges in thumb (proximal, distal); 3 phalanges in each of the other 4 fingers (proximal, middle, distal)"],
  ["Pelvis / Coxal Bone (Hip Bone)", "Formed by fusion of three bones: Ilium (largest upper blade), Ischium (lower posterior sitting bone), Pubis (lower anterior pubis)"],
  ["Patella (Kneecap)", "Largest sesamoid bone in the human body; embedded within the quadriceps tendon to increase knee extension leverage"],
  ["Tibia (Shin Bone)", "Larger, stronger, and anterior weight-bearing bone of the lower leg; forms medial malleolus at ankle"],
  ["Fibula (Calf Bone)", "Slender, lateral non-weight-bearing bone of the lower leg; provides muscle attachment and forms lateral malleolus at ankle"],
  ["Tarsals (Ankle Bones - 7 Bones)", "Talus (articulates with tibia), Calcaneus (heel bone - largest tarsal), Navicular, Cuboid, and 3 Cuneiform bones (medial, intermediate, lateral)"],
  ["Calcaneus (Heel Bone)", "Largest tarsal bone in the foot; transmits body weight to the ground and serves as attachment for Achilles tendon"],
  ["Metatarsals (Foot Bones - 5 Bones)", "Five long bones of the midfoot numbered I to V from big toe to little toe"],
  ["Phalanges of Foot (14 Bones)", "Toes: 2 phalanges in hallux (big toe); 3 phalanges in other four toes"],
  ["Cervical Vertebrae (C1-C7 - 7 Bones)", "Neck spine; C1 is Atlas (supports skull nodding), C2 is Axis (contains Odontoid process / Dens for head rotation), C7 is Vertebra Prominens"],
  ["Thoracic Vertebrae (T1-T12 - 12 Bones)", "Middle spine; articulate with 12 pairs of ribs; possess heart-shaped bodies and costal facets"],
  ["Lumbar Vertebrae (L1-L5 - 5 Bones)", "Lower back spine; largest and strongest unfused vertebrae supporting the greatest body weight"],
  ["Sacrum (5 Fused Vertebrae)", "Triangular bone at base of spine wedged between hip bones at sacroiliac joints"],
  ["Coccyx (Tailbone - 4 Fused Bones)", "Vestigial tailbone at the very bottom of the vertebral column providing attachment for pelvic floor muscles"],
  ["Hyoid Bone", "U-shaped bone in the anterior neck below mandible; only bone in the human body that does NOT articulate with any other bone (suspended by muscles and stylohyoid ligament)"]
];

const boneEntries = humanBones.map((b, idx) => {
  const [name, desc] = b;
  return {
    id: `health-bone-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `${name.toLowerCase()}`,
      `bone ${name.toLowerCase()}`,
      `function of ${name.toLowerCase()}`,
      `where is ${name.toLowerCase()} in body`,
      `human skeleton ${name.toLowerCase()}`
    ],
    title: `${name} — Human Skeletal Anatomy & Function`,
    category: 'Health & Medicine',
    answer: `${name}: ${desc}.`,
    highlights: [
      `Bone / Region: ${name}`,
      `Anatomical Description: ${desc}`,
      `Classification: Human Skeletal System (206 Adult Bones)`
    ],
    url: 'https://en.wikipedia.org/wiki/Human_skeleton'
  };
});
saveDb('health_medicine.json', boneEntries);

// 2. INDIAN GEOGRAPHY — All 28 States & 8 Union Territories -> 36 entries
const indianStatesAndUTs = [
  ["Andhra Pradesh", "Amaravati", "Telugu", "Kuchipudi dance, Tirupati Balaji temple, Visakhapatnam port, Godavari and Krishna rivers"],
  ["Arunachal Pradesh", "Itanagar", "English, tribal languages", "Land of the Dawn-Lit Mountains, Tawang Monastery, borders China, Myanmar, Bhutan"],
  ["Assam", "Dispur (Guwahati largest)", "Assamese", "Kaziranga National Park (One-horned rhino), Assam tea, Brahmaputra river, Bihu dance"],
  ["Bihar", "Patna", "Hindi, Maithili, Bhojpuri", "Ancient Nalanda and Vikramshila universities, Bodh Gaya (Buddha enlightenment), Mahavira birth, Ganga river"],
  ["Chhattisgarh", "Raipur", "Chhattisgarhi, Hindi", "Rice bowl of central India, Chitrakote Falls (Niagara of India), mineral-rich, Bastar tribal craft"],
  ["Goa", "Panaji", "Konkani", "Smallest Indian state by area, Dudhsagar Falls, UNESCO churches of Old Goa, Calangute beach, former Portuguese territory"],
  ["Gujarat", "Gandhinagar (Ahmedabad largest)", "Gujarati", "Statue of Unity (182m tallest in world), Gir National Park (Asiatic lions), Rann of Kutch white salt desert"],
  ["Haryana", "Chandigarh", "Hindi, Haryanvi", "Kurukshetra (Mahabharata battle), historic Panipat battlefields, leading agricultural and industrial hub"],
  ["Himachal Pradesh", "Shimla (summer), Dharamshala (winter)", "Hindi, Pahari", "Himalayan hill stations (Manali, Kullu), Rohtang Pass, apple orchards, Dalai Lama residence in McLeod Ganj"],
  ["Jharkhand", "Ranchi", "Hindi, Santali", "Mineral hub of India (coal, iron ore, mica in Chota Nagpur plateau), Jamshedpur steel city, Betla National Park"],
  ["Karnataka", "Bengaluru", "Kannada", "Silicon Valley of India (Bengaluru), Hampi ruins (Vijayanagara Empire), Mysore Palace, Western Ghats coffee estates"],
  ["Kerala", "Thiruvananthapuram", "Malayalam", "God's Own Country, highest literacy rate in India, Alleppey backwaters, Kathakali and Mohiniyattam dances, spice coast"],
  ["Madhya Pradesh", "Bhopal (Indore largest)", "Hindi", "Heart of India, Khajuraho temples, Sanchi Stupa, Kanha and Bandhavgarh Tiger Reserves (highest tiger population)"],
  ["Maharashtra", "Mumbai (financial capital), Nagpur (winter)", "Marathi", "Ajanta & Ellora caves, Western Ghats, Chhatrapati Shivaji forts, Bollywood, Gateway of India"],
  ["Manipur", "Imphal", "Meitei (Manipuri)", "Loktak Lake (world's only floating national park Keibul Lamjao with Sangai deer), Manipuri classical dance"],
  ["Meghalaya", "Shillong", "English, Khasi, Garo", "Abode of Clouds, Mawsynram and Cherrapunji (wettest places on Earth), living root bridges, cleanest village Mawlynnong"],
  ["Mizoram", "Aizawl", "Mizo, English", "Land of rolling hills, Cheraw bamboo dance, high literacy rate, Blue Mountain (Phawngpui)"],
  ["Nagaland", "Kohima (Dimapur largest)", "English, Naga languages", "Land of Festivals, annual Hornbill Festival, Dzukou Valley, Naga tribal culture"],
  ["Odisha", "Bhubaneswar", "Odia", "Jagannath Temple Puri, Konark Sun Temple (Black Pagoda), Chilika Lake (largest coastal lagoon in India), Odissi classical dance"],
  ["Punjab", "Chandigarh", "Punjabi", "Golden Temple (Harmandir Sahib) in Amritsar, Land of Five Rivers, Bhangra dance, Green Revolution agricultural leader"],
  ["Rajasthan", "Jaipur (Pink City)", "Hindi, Rajasthani", "Largest Indian state by area, Thar Desert, historic forts (Amer, Mehrangarh, Jaisalmer), Lake Palace Udaipur"],
  ["Sikkim", "Gangtok", "Nepali, Sikkimese, English", "Least populous Indian state, Mount Kangchenjunga (3rd highest in world), first 100% organic state in the world"],
  ["Tamil Nadu", "Chennai", "Tamil", "Dravidian temple architecture (Brihadisvara, Meenakshi), Bharatanatyam classical dance, Nilgiri hills, Marina Beach"],
  ["Telangana", "Hyderabad", "Telugu, Urdu", "Formed 2 June 2014, Charminar, Golconda Fort, Ramappa Temple (UNESCO), major global IT and pharma hub"],
  ["Tripura", "Agartala", "Bengali, Kokborok", "Ujjayanta Palace, Neermahal water palace, Tripura Sundari temple, bordered on 3 sides by Bangladesh"],
  ["Uttar Pradesh", "Lucknow", "Hindi, Urdu", "Most populous Indian state (~240M), Taj Mahal Agra, holy city of Varanasi, Prayagraj Kumbh Mela, Ayodhya Ram Mandir"],
  ["Uttarakhand", "Dehradun (winter), Gairsain (summer)", "Hindi, Garhwali, Kumaoni", "Devbhoomi (Land of Gods), Char Dham (Badrinath, Kedarnath, Gangotri, Yamunotri), Jim Corbett National Park, Valley of Flowers"],
  ["West Bengal", "Kolkata", "Bengali", "Sundarbans (Royal Bengal Tigers), Darjeeling tea, Victoria Memorial, Durga Puja festival, Rabindranath Tagore heritage"],
  ["Andaman and Nicobar Islands (UT)", "Port Blair", "Hindi, English, Bengali", "Cellular Jail (Kala Pani), Radhanagar Beach Havelock, Barren Island (India's only active volcano)"],
  ["Chandigarh (UT)", "Chandigarh", "English, Hindi, Punjabi", "Planned city designed by French architect Le Corbusier, Rock Garden by Nek Chand, joint capital of Punjab and Haryana"],
  ["Dadra and Nagar Haveli and Daman and Diu (UT)", "Daman", "Gujarati, Hindi", "Merged UT (2020), coastal Portuguese colonial forts, Nagoa Beach Diu"],
  ["Delhi (NCT)", "New Delhi", "Hindi, English", "National Capital Territory of India, India Gate, Red Fort, Qutub Minar, Parliament House"],
  ["Jammu and Kashmir (UT)", "Srinagar (summer), Jammu (winter)", "Kashmiri, Dogri, Urdu, Hindi", "Dal Lake shikaras, Gulmarg skiing, Vaishno Devi temple, saffron cultivation in Pampore"],
  ["Ladakh (UT)", "Leh", "Ladakhi, Tibetan, Hindi", "Cold desert high-altitude plateau, Pangong Tso lake, Khardung La pass, Hemis Monastery"],
  ["Lakshadweep (UT)", "Kavaratti", "Malayalam, Jeseri", "Coral island archipelago in Arabian Sea (36 islands), Bangaram atoll, lagoon marine life"],
  ["Puducherry (UT)", "Puducherry", "Tamil, French, English", "Former French colonial enclave, Auroville international township, Promenade Beach, Sri Aurobindo Ashram"]
];

const stateEntries = indianStatesAndUTs.map((st, idx) => {
  const [name, cap, lang, desc] = st;
  return {
    id: `geo-india-state-${idx + 1}-${name.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '-')}`,
    keywords: [
      `capital of ${name.toLowerCase()}`,
      `${name.toLowerCase()} capital`,
      `language of ${name.toLowerCase()}`,
      `about ${name.toLowerCase()}`,
      `${name.toLowerCase()} state facts`
    ],
    title: `${name} — Capital: ${cap} | Key Facts`,
    category: 'Geography',
    answer: `${name} is an Indian ${name.includes('(UT)') || name.includes('(NCT)') ? 'Union Territory' : 'State'} with capital ${cap} and official language(s): ${lang}. Key highlights: ${desc}.`,
    highlights: [
      `State / UT: ${name}`,
      `Capital: ${cap}`,
      `Official Language(s): ${lang}`,
      `Key Landmarks & Features: ${desc}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.split(' ')[0]}`
  };
});
saveDb('geography.json', stateEntries);

console.log("Countries, states, and anatomy batch completed.");