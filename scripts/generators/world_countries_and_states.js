const { saveDb } = require('../db_helper.js');

const rawCountries = [
  ["Afghanistan", "Kabul", "Afghani (AFN)", "Asia", "Dari, Pashto", "38M", "652,864 km²", "+93", "AF", "Hindu Kush, Amu Darya"],
  ["Albania", "Tirana", "Lek (ALL)", "Europe", "Albanian", "2.8M", "28,748 km²", "+355", "AL", "Balkan Peninsula, Adriatic Sea coast"],
  ["Algeria", "Algiers", "Algerian Dinar (DZD)", "Africa", "Arabic, Berber", "44M", "2,381,741 km²", "+213", "DZ", "Largest country in Africa by area, Sahara Desert"],
  ["Andorra", "Andorra la Vella", "Euro (EUR)", "Europe", "Catalan", "80K", "468 km²", "+376", "AD", "Pyrenees mountains between France and Spain"],
  ["Angola", "Luanda", "Kwanza (AOA)", "Africa", "Portuguese", "33M", "1,246,700 km²", "+244", "AO", "Rich in oil and diamonds, Atlantic coast"],
  ["Argentina", "Buenos Aires", "Argentine Peso (ARS)", "South America", "Spanish", "46M", "2,780,400 km²", "+54", "AR", "Pampas plains, Patagonia, Mt. Aconcagua, Iguazu Falls"],
  ["Armenia", "Yerevan", "Dram (AMD)", "Asia/Europe", "Armenian", "3M", "29,743 km²", "+374", "AM", "Mount Ararat, Lake Sevan, ancient Christian monasteries"],
  ["Australia", "Canberra", "Australian Dollar (AUD)", "Oceania", "English", "26M", "7,692,024 km²", "+61", "AU", "Great Barrier Reef, Outback, Sydney Opera House, Uluru"],
  ["Austria", "Vienna", "Euro (EUR)", "Europe", "German", "9M", "83,879 km²", "+43", "AT", "Alps mountains, Danube river, Vienna Philharmonic classical heritage"],
  ["Azerbaijan", "Baku", "Manat (AZN)", "Asia/Europe", "Azerbaijani", "10M", "86,600 km²", "+994", "AZ", "Caspian Sea coast, Land of Fire, Baku flame towers"],
  ["Bahamas", "Nassau", "Bahamian Dollar (BSD)", "North America", "English", "400K", "13,880 km²", "+1-242", "BS", "Atlantic archipelago of 700 islands, Lucayan culture"],
  ["Bahrain", "Manama", "Bahraini Dinar (BHD)", "Asia", "Arabic", "1.5M", "765 km²", "+973", "BH", "Persian Gulf island nation, King Fahd Causeway to Saudi Arabia"],
  ["Bangladesh", "Dhaka", "Taka (BDT)", "Asia", "Bengali", "170M", "148,460 km²", "+880", "BD", "Sundarbans delta, Cox's Bazar longest beach, Padma and Jamuna rivers"],
  ["Barbados", "Bridgetown", "Barbados Dollar (BBD)", "North America", "English", "280K", "430 km²", "+1-246", "BB", "Easternmost Caribbean island, coral limestone formation"],
  ["Belarus", "Minsk", "Belarusian Ruble (BYN)", "Europe", "Belarusian, Russian", "9.3M", "207,600 km²", "+375", "BY", "Belovezhskaya Pushcha primeval forest, European bison"],
  ["Belgium", "Brussels", "Euro (EUR)", "Europe", "Dutch, French, German", "11.6M", "30,528 km²", "+32", "BE", "Headquarters of European Union and NATO in Brussels"],
  ["Bhutan", "Thimphu", "Ngultrum (BTN)", "Asia", "Dzongkha", "780K", "38,394 km²", "+975", "BT", "Himalayan kingdom measuring Gross National Happiness (GNH), Tiger's Nest"],
  ["Bolivia", "Sucre (constitutional), La Paz (seat of govt)", "Boliviano (BOB)", "South America", "Spanish, Quechua, Aymara", "12M", "1,098,581 km²", "+591", "BO", "Salar de Uyuni world's largest salt flat, Lake Titicaca"],
  ["Brazil", "Brasília", "Brazilian Real (BRL)", "South America", "Portuguese", "215M", "8,515,767 km²", "+55", "BR", "Largest country in South America, Amazon Rainforest, Christ the Redeemer, Carnival"],
  ["Canada", "Ottawa", "Canadian Dollar (CAD)", "North America", "English, French", "40M", "9,984,670 km²", "+1", "CA", "Second largest country in world by total area, Niagara Falls, Rocky Mountains"],
  ["Chile", "Santiago", "Chilean Peso (CLP)", "South America", "Spanish", "19M", "756,102 km²", "+56", "CL", "Longest north-south nation, Atacama Desert (driest non-polar desert), Andes"],
  ["China", "Beijing", "Renminbi / Yuan (CNY)", "Asia", "Mandarin Chinese", "1.41B", "9,596,961 km²", "+86", "CN", "Great Wall of China, Yangtze River, Terracotta Army, world's 2nd largest economy"],
  ["Colombia", "Bogotá", "Colombian Peso (COP)", "South America", "Spanish", "52M", "1,141,748 km²", "+57", "CO", "Andes mountains, Caribbean and Pacific coasts, famous coffee region"],
  ["Cuba", "Havana", "Cuban Peso (CUP)", "North America", "Spanish", "11M", "109,884 km²", "+53", "CU", "Largest island in Caribbean, classic cars, sugar and tobacco"],
  ["Denmark", "Copenhagen", "Danish Krone (DKK)", "Europe", "Danish", "5.9M", "43,094 km²", "+45", "DK", "Scandinavia, Greenland territory, Little Mermaid, Lego birthplace"],
  ["Egypt", "Cairo", "Egyptian Pound (EGP)", "Africa", "Arabic", "105M", "1,002,450 km²", "+20", "EG", "Pyramids of Giza, Sphinx, Nile River, Suez Canal gateway"],
  ["Ethiopia", "Addis Ababa", "Ethiopian Birr (ETB)", "Africa", "Amharic", "120M", "1,104,300 km²", "+251", "ET", "Cradle of humanity (Lucy fossil), Simien Mountains, coffee birthplace"],
  ["Finland", "Helsinki", "Euro (EUR)", "Europe", "Finnish, Swedish", "5.6M", "338,424 km²", "+358", "FI", "Land of thousand lakes (188,000 lakes), Northern Lights, Lapland"],
  ["France", "Paris", "Euro (EUR)", "Europe", "French", "68M", "551,695 km²", "+33", "FR", "Eiffel Tower, Louvre Museum, Notre-Dame, wine and culinary capital"],
  ["Germany", "Berlin", "Euro (EUR)", "Europe", "German", "84M", "357,022 km²", "+49", "DE", "Largest economy in Europe, Brandenburg Gate, Black Forest, Autobahn"],
  ["Greece", "Athens", "Euro (EUR)", "Europe", "Greek", "10.4M", "131,957 km²", "+30", "GR", "Cradle of Western civilization and democracy, Parthenon on Acropolis, Aegean islands"],
  ["Iceland", "Reykjavík", "Icelandic Króna (ISK)", "Europe", "Icelandic", "380K", "103,000 km²", "+354", "IS", "Land of fire and ice, active volcanoes, geysers, glaciers, Mid-Atlantic Ridge"],
  ["India", "New Delhi", "Indian Rupee (INR - ₹)", "Asia", "Hindi, English + 22 scheduled languages", "1.43B", "3,287,263 km²", "+91", "IN", "Most populous democracy in world, Himalayas, Ganges, Taj Mahal, 5th largest global economy"],
  ["Indonesia", "Jakarta (Nusantara future)", "Indonesian Rupiah (IDR)", "Asia", "Indonesian (Bahasa)", "278M", "1,904,569 km²", "+62", "ID", "World's largest island country (>17,000 islands), Komodo dragons, Bali"],
  ["Iran", "Tehran", "Iranian Rial (IRR)", "Asia", "Persian (Farsi)", "88M", "1,648,195 km²", "+98", "IR", "Ancient Persian empire heritage, Persepolis, Zagros and Alborz mountains"],
  ["Iraq", "Baghdad", "Iraqi Dinar (IQD)", "Asia", "Arabic, Kurdish", "43M", "438,317 km²", "+964", "IQ", "Ancient Mesopotamia cradle of civilization between Tigris and Euphrates rivers"],
  ["Ireland", "Dublin", "Euro (EUR)", "Europe", "Irish, English", "5.1M", "70,273 km²", "+353", "IE", "Emerald Isle, Cliffs of Moher, Dublin literary heritage (James Joyce)"],
  ["Israel", "Jerusalem", "Israeli New Shekel (ILS)", "Asia", "Hebrew", "9.7M", "22,072 km²", "+972", "IL", "Dead Sea (lowest land elevation on Earth -430m), holy sites for Judaism, Christianity, Islam"],
  ["Italy", "Rome", "Euro (EUR)", "Europe", "Italian", "59M", "301,340 km²", "+39", "IT", "Roman Empire, Colosseum, Vatican City enclave, Venice canals, Renaissance art"],
  ["Japan", "Tokyo", "Japanese Yen (JPY - ¥)", "Asia", "Japanese", "124M", "377,975 km²", "+81", "JP", "Mount Fuji, Shinkansen bullet trains, cherry blossoms, high-tech robotics"],
  ["Kenya", "Nairobi", "Kenyan Shilling (KES)", "Africa", "Swahili, English", "54M", "580,367 km²", "+254", "KE", "Maasai Mara Great Wildlife Migration, Great Rift Valley, Mount Kenya"],
  ["Mexico", "Mexico City", "Mexican Peso (MXN)", "North America", "Spanish", "128M", "1,964,375 km²", "+52", "MX", "Aztec and Maya pyramids (Chichén Itzá, Teotihuacan), culinary heritage"],
  ["Nepal", "Kathmandu", "Nepalese Rupee (NPR)", "Asia", "Nepali", "30M", "147,516 km²", "+977", "NP", "Home to 8 of the world's 14 highest peaks including Mount Everest (Sagarmatha)"],
  ["Netherlands", "Amsterdam", "Euro (EUR)", "Europe", "Dutch", "17.8M", "41,543 km²", "+31", "NL", "Windmills, tulip fields, extensive canal networks, dykes reclaimed from North Sea"],
  ["New Zealand", "Wellington", "New Zealand Dollar (NZD)", "Oceania", "English, Māori", "5.2M", "268,021 km²", "+64", "NZ", "Southern Alps, Fiordland Milford Sound, Māori culture, Lord of the Rings filming"],
  ["Nigeria", "Abuja", "Naira (NGN)", "Africa", "English, Hausa, Yoruba, Igbo", "220M", "923,768 km²", "+234", "NG", "Most populous country in Africa, largest African economy, Nollywood film industry"],
  ["Norway", "Oslo", "Norwegian Krone (NOK)", "Europe", "Norwegian", "5.5M", "385,207 km²", "+47", "NO", "Dramatic fjords, midnight sun, Northern Lights, sovereign wealth fund"],
  ["Pakistan", "Islamabad", "Pakistani Rupee (PKR)", "Asia", "Urdu, English", "240M", "881,913 km²", "+92", "PK", "K2 second highest peak in world, Indus river basin, ancient Mohenjo-daro"],
  ["Russia", "Moscow", "Russian Ruble (RUB)", "Europe/Asia", "Russian", "144M", "17,098,242 km²", "+7", "RU", "Largest country in the world by surface area covering 11 time zones, Lake Baikal, Siberia"],
  ["Saudi Arabia", "Riyadh", "Saudi Riyal (SAR)", "Asia", "Arabic", "36M", "2,149,690 km²", "+966", "SA", "Holy cities of Mecca and Medina, Rub' al Khali desert, world's leading oil exporter"],
  ["Singapore", "Singapore", "Singapore Dollar (SGD)", "Asia", "English, Malay, Mandarin, Tamil", "5.9M", "734 km²", "+65", "SG", "Global financial and shipping hub, Marina Bay Sands, Changi Airport"],
  ["South Africa", "Pretoria (executive), Cape Town (legislative), Bloemfontein (judicial)", "South African Rand (ZAR)", "Africa", "11 official languages (Zulu, Xhosa, Afrikaans, English...)", "60M", "1,221,037 km²", "+27", "ZA", "Table Mountain, Kruger National Park, Nelson Mandela legacy, Rainbow Nation"],
  ["South Korea", "Seoul", "South Korean Won (KRW - ₩)", "Asia", "Korean", "51M", "100,210 km²", "+82", "KR", "Semiconductors, K-pop culture, Samsung/Hyundai global headquarters, Han River"],
  ["Spain", "Madrid", "Euro (EUR)", "Europe", "Spanish", "48M", "505,990 km²", "+34", "ES", "Sagrada Familia by Gaudí in Barcelona, Prado Museum in Madrid, Flamenco music"],
  ["Switzerland", "Bern", "Swiss Franc (CHF)", "Europe", "German, French, Italian, Romansh", "8.8M", "41,285 km²", "+41", "CH", "Swiss Alps, Matterhorn, banking hub, luxury watches, chocolate, Geneva UN headquarters"],
  ["United Arab Emirates", "Abu Dhabi", "UAE Dirham (AED)", "Asia", "Arabic", "10M", "83,600 km²", "+971", "AE", "Burj Khalifa world's tallest building (828m) in Dubai, Sheikh Zayed Grand Mosque"],
  ["United Kingdom", "London", "British Pound (GBP - £)", "Europe", "English", "67M", "242,495 km²", "+44", "GB", "Big Ben, Tower of London, Stonehenge, industrial revolution birthplace, BBC"],
  ["United States", "Washington, D.C.", "United States Dollar (USD - $)", "North America", "English", "335M", "9,833,517 km²", "+1", "US", "World's largest economy by nominal GDP, Grand Canyon, Silicon Valley, Statue of Liberty"]
];

const countryEntries = rawCountries.map(c => {
  const [name, cap, curr, cont, lang, pop, area, code, iso, notes] = c;
  return {
    id: `geo-country-${name.toLowerCase().replace(/\s+/g, '-')}`,
    keywords: [
      `capital of ${name.toLowerCase()}`,
      `currency of ${name.toLowerCase()}`,
      `${name.toLowerCase()} capital`,
      `${name.toLowerCase()} currency`,
      `where is ${name.toLowerCase()}`,
      `${name.toLowerCase()} population area`,
      `${name.toLowerCase()} facts`
    ],
    title: `${name} — Capital: ${cap} | Currency: ${curr}`,
    category: 'Geography',
    answer: `${name} is a sovereign country in ${cont} with capital ${cap} and official currency ${curr}. It has a population of ~${pop}, covers ${area}, uses calling code ${code}, and official language(s): ${lang}. Key features: ${notes}.`,
    highlights: [
      `Capital: ${cap}`,
      `Currency: ${curr}`,
      `Continent: ${cont} | ISO Code: ${iso}`,
      `Official Language(s): ${lang}`,
      `Population: ~${pop} | Area: ${area}`,
      `Calling Code: ${code}`,
      `Notable Geographic / Cultural Facts: ${notes}`
    ],
    url: `https://en.wikipedia.org/wiki/${name.replace(/\s+/g, '_')}`
  };
});

saveDb('world_geography_advanced.json', countryEntries);