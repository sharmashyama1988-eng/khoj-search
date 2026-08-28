const { saveDb } = require('../db_helper.js');

// 1. HISTORY EXPANSION
const historyExpanded = [
  {
    id: 'hist-battles-of-panipat-1-2-3',
    keywords: ['three battles of panipat dates winners', 'first second third battle of panipat 1526 1556 1761', 'babur vs ibrahim lodi akbar vs hemu ahmad shah abdali vs marathas'],
    title: 'Three Battles of Panipat (1526, 1556, 1761)',
    category: 'History',
    answer: 'The three historic Battles of Panipat (Haryana) shaped Indian history: (1) First Battle (21 April 1526): Babur defeated Ibrahim Lodi with gunpowder/artillery and Tulughma flanking tactics, establishing the Mughal Empire. (2) Second Battle (5 November 1556): Akbar\'s general Bairam Khan defeated Hemu (Hemu Vikramaditya) after an arrow struck Hemu\'s eye, restoring Mughal rule. (3) Third Battle (14 January 1761): Afghan King Ahmad Shah Abdali defeated the Maratha Empire under Sadashivrao Bhau, halting Maratha northward expansion.',
    highlights: [
      'First Battle (1526): Babur vs Ibrahim Lodi — marked end of Delhi Sultanate and birth of Mughal Empire',
      'Second Battle (1556): Akbar (age 13 under Bairam Khan) vs Hemu — consolidated Mughal dominance in North India',
      'Third Battle (1761): Ahmad Shah Durrani (Abdali) vs Marathas (Sadashivrao Bhau & Vishwasrao) — over 70,000 Marathas perished; weakened Maratha power and paved way for British East India Company expansion',
      'Panipat was chosen repeatedly due to flat terrain, proximity to Delhi, and direct route from NW frontier passes'
    ],
    url: 'https://en.wikipedia.org/wiki/Battles_of_Panipat'
  },
  {
    id: 'hist-battle-of-buxar-treaty-of-allahabad',
    keywords: ['battle of buxar 1764 treaty of allahabad 1765', 'mir qasim shuja ud daula shah alam ii vs hector munro', 'diwani rights of bengal bihar orissa british east india company'],
    title: 'Battle of Buxar (1764) and Treaty of Allahabad (1765)',
    category: 'History',
    answer: 'The Battle of Buxar (22 October 1764) was fought between the British East India Company (led by Major Hector Munro) and the combined forces of Mir Qasim (Nawab of Bengal), Shuja-ud-Daula (Nawab of Awadh), and Mughal Emperor Shah Alam II. The decisive British victory resulted in the historic Treaty of Allahabad (1765) signed by Robert Clive, granting the East India Company the Diwani (right to collect revenue) of Bengal, Bihar, and Orissa, transforming the Company from a trading entity into the sovereign ruler of India.',
    highlights: [
      'Combined Indian confederacy of ~40,000 troops defeated by disciplined British force of ~7,000 under Hector Munro',
      'Far more decisive than Battle of Plassey (1757) because it defeated the titular Mughal Emperor himself in open battlefield',
      'Treaty of Allahabad (12 August 1765): Mughal Emperor Shah Alam II granted Diwani rights in exchange for annual tribute of 26 lakh rupees',
      'Instituted Robert Clive\'s Dual Government (Dyarchy) in Bengal (1765–1772) separating Nizamat (administration) from Diwani (revenue collection)'
    ],
    url: 'https://en.wikipedia.org/wiki/Battle_of_Buxar'
  },
  {
    id: 'hist-maratha-empire-chhatrapati-shivaji-maharaj',
    keywords: ['chhatrapati shivaji maharaj maratha empire', 'coronation 1674 raigad fort', 'guerrilla warfare ganimi kava', 'ashta pradhan council of ministers'],
    title: 'Chhatrapati Shivaji Maharaj and the Maratha Empire (1674–1818)',
    category: 'History',
    answer: 'Chhatrapati Shivaji Maharaj (19 February 1630 – 3 April 1680) founded the Maratha Empire (Hindavi Swarajya) by pioneering guerrilla warfare tactics (Ganimi Kava / Shiva Sutra), capturing strategic hill forts in the Western Ghats (Torna, Raigad, Sinhagad), and establishing a disciplined administration guided by the Ashta Pradhan (Council of 8 Ministers). He was crowned Chhatrapati at Raigad Fort on 6 June 1674 in a grand Vedic ceremony.',
    highlights: [
      'Father of the Indian Navy: Built coastal sea forts (Sindhudurg, Vijaydurg) and created a formidable naval fleet under Kanhoji Angre',
      'Guerrilla Warfare (Ganimi Kava): Leveraged rugged Sahyadri topography, speed, and surprise ambushes against larger Mughal and Bijapur armies',
      'Defeated Bijapur General Afzal Khan at Pratapgad (1659) using Bagh Nakh (tiger claws) after detecting treachery',
      'Ashta Pradhan: Included Peshwa (Prime Minister), Amatya (Finance), Senapati (Commander), Sachiv (Secretary), Nyayadhish (Chief Justice)',
      'Empire reached its zenith under Peshwa Baji Rao I in the 18th century, spanning from Attock (modern Pakistan) to Cuttack and Thanjavur'
    ],
    url: 'https://en.wikipedia.org/wiki/Shivaji'
  }
];

// 2. SPORTS EXPANSION
const sportsExpanded = [
  {
    id: 'sports-fifa-world-cup-champions-records',
    keywords: ['fifa world cup all winners list', 'brazil 5 world cups pele messi maradona', 'argentina 2022 world cup qatar final', 'fifa world cup golden boot ball'],
    title: 'FIFA World Cup Champions & Historical Records',
    category: 'Sports',
    answer: 'The FIFA Men\'s World Cup (inaugurated 1930 in Uruguay) is contested every 4 years. Brazil has won the most titles (5: 1958, 1962, 1970, 1994, 2002). Germany and Italy have won 4 titles each. Argentina won 3 titles (1978, 1986, and 2022 in Qatar under Lionel Messi defeating France in a historic 3-3 (4-2 pens) final). Pelé is the only player in history to win 3 World Cups (1958, 1962, 1970).',
    highlights: [
      'Most World Cup Titles: Brazil (5), Germany (4), Italy (4), Argentina (3), France (2), Uruguay (2), England (1), Spain (1)',
      'All-time Top Goalscorer in World Cup history: Miroslav Klose (Germany) with 16 goals across 4 tournaments (2002–2014)',
      'Most goals in a single tournament: Just Fontaine (France, 1958) with 13 goals in 6 matches',
      'Fastest goal in World Cup history: Hakan Şükür (Turkey) scored in 10.89 seconds vs South Korea in 2002',
      'FIFA World Cup 2026: First 48-team tournament, co-hosted across USA, Canada, and Mexico'
    ],
    url: 'https://en.wikipedia.org/wiki/FIFA_World_Cup'
  },
  {
    id: 'sports-olympic-games-history-records',
    keywords: ['olympic games modern vs ancient records', 'michael phelps 28 medals usain bolt', 'tokyo 2020 paris 2024 olympics', 'olympic rings motto citius altius fortius communiter'],
    title: 'Olympic Games — History, Records & Legends',
    category: 'Sports',
    answer: 'The modern Olympic Games were revived by Baron Pierre de Coubertin in Athens (1896). Olympic Motto: "Citius, Altius, Fortius - Communiter" (Faster, Higher, Stronger - Together). Michael Phelps (USA swimmer) is the most decorated Olympian in history with 28 total medals (23 Gold, 3 Silver, 2 Bronze). Usain Bolt (Jamaica) is the fastest human in history holding world records in 100m (9.58s) and 200m (19.19s), winning 8 Olympic Gold medals across 3 Games (2008, 2012, 2016).',
    highlights: [
      'Five Olympic Rings represent the five inhabited continents united in athletic spirit (Blue, Yellow, Black, Green, Red on white background)',
      'Michael Phelps: Won a record 8 Gold medals in a single Olympics at Beijing 2008',
      'Usain Bolt: World records in 100m (9.58s at Berlin 2009) and 200m (19.19s at Berlin 2009)',
      'India at Olympics: 10 Gold medals total (8 in Men\'s Field Hockey: 1928–1980, Abhinav Bindra 10m Air Rifle Beijing 2008, Neeraj Chopra Javelin Tokyo 2020)',
      'First woman to win individual Olympic medal for India: Karnam Malleswari (Bronze in Weightlifting, Sydney 2000)'
    ],
    url: 'https://en.wikipedia.org/wiki/Olympic_Games'
  }
];

// 3. INVENTIONS & DISCOVERIES
const inventionsExpanded = [
  {
    id: 'inv-transistor-point-contact-bipolar',
    keywords: ['who invented transistor shockley bardeen brattain', 'bell labs 1947 transistor invention', 'point contact transistor silicon revolution', 'nobel prize physics 1956 transistor'],
    title: 'The Transistor (1947) — Foundation of Modern Electronics',
    category: 'Inventions',
    answer: 'The Transistor was invented in December 1947 at Bell Labs by John Bardeen, Walter Brattain, and William Shockley, earning them the 1956 Nobel Prize in Physics. Replacing bulky, fragile, power-hungry vacuum tubes, the solid-state semiconductor transistor amplifies electrical signals and acts as a binary electronic switch, making modern computers, smartphones, microprocessors, and the digital information age possible.',
    highlights: [
      'Invented at Bell Telephone Laboratories (Murray Hill, New Jersey) on 23 December 1947 (Point-contact transistor using germanium crystal)',
      'Shockley later developed the Bipolar Junction Transistor (BJT) and founded Shockley Semiconductor in Mountain View, spawning Silicon Valley',
      'Integrated Circuit (IC): Invented independently by Jack Kilby (Texas Instruments, 1958) and Robert Noyce (Fairchild Semiconductor, 1959)',
      'Moore\'s Law (Gordon Moore, 1965): Number of transistors on a microchip doubles roughly every two years; modern chips (e.g. Apple M-series, Nvidia H100/Blackwell) pack over 100 to 200 billion transistors on a single silicon die'
    ],
    url: 'https://en.wikipedia.org/wiki/Transistor'
  },
  {
    id: 'inv-optical-fiber-narinder-singh-kapany',
    keywords: ['father of fiber optics narinder singh kapany', 'optical fiber total internal reflection', 'high speed internet submarine cables', 'laser optical communication'],
    title: 'Fiber Optics & High-Speed Optical Communications',
    category: 'Inventions',
    answer: 'Dr. Narinder Singh Kapany (31 October 1926 – 4 December 2020), an Indian-American physicist, is widely acknowledged as the "Father of Fiber Optics", having coined the term in a 1960 Scientific American article and demonstrated high-quality image transmission through flexible glass fibers at Imperial College London in 1953. Optical fibers transmit digital information as light pulses via Total Internal Reflection (TIR) with minimal attenuation, powering over 99% of global internet traffic across undersea submarine fiber cables.',
    highlights: [
      'Dr. Narinder Singh Kapany: Born in Moga, Punjab; awarded Padma Vibhushan (posthumous) in 2021 for pioneering fiber optics',
      'Physics Principle: Total Internal Reflection occurs when light in dense core (higher refractive index n₁) strikes cladding (lower n₂) at angle exceeding Critical Angle: θ_c = arcsin(n₂ / n₁)',
      'Core diameter of Single-Mode Fiber (SMF) is tiny (~9 μm), carrying laser signals at 1550 nm wavelength over hundreds of kilometers without repeaters',
      'Submarine optical fiber cables cross all oceans carrying petabits of data per second worldwide'
    ],
    url: 'https://en.wikipedia.org/wiki/Optical_fiber'
  }
];

// 4. TECH & PROGRAMMING
const techExpanded = [
  {
    id: 'tech-linux-kernel-operating-system',
    keywords: ['linux kernel architecture linus torvalds', 'monolithic vs microkernel os', 'posix standard gnu linux', 'process management memory management vfs'],
    title: 'Linux Kernel Architecture & Operating System Internals',
    category: 'Technology',
    answer: 'The Linux Kernel (created by Linus Torvalds in 1991) is a free, open-source, POSIX-compliant, monolithic operating system kernel with modular runtime loadable kernel modules (LKMs). It directly manages hardware resources via Process Management (CFS - Completely Fair Scheduler), Memory Management (Virtual memory with demand paging), Virtual File System (VFS: ext4, btrfs, ZFS), Network Stack (Netfilter / iptables / eBPF), and Device Drivers. It powers 100% of the world\'s top 500 supercomputers, Android devices, cloud servers, and IoT systems.',
    highlights: [
      'Created by Linus Torvalds as a student in Helsinki, Finland; announced on comp.os.minix newsgroup on 25 August 1991',
      'Monolithic with dynamically Loadable Kernel Modules (`modprobe`, `insmod`, `lsmod`)',
      'Virtual File System (VFS): Abstract layer unifying all storage filesystems under a single hierarchical tree rooted at `/` ("Everything is a file" philosophy)',
      'eBPF (Extended Berkeley Packet Filter): Allows running sandboxed programmable bytecode inside the Linux kernel at native speed for tracing, observability, and networking security',
      'Powers the entire modern cloud infrastructure (AWS, Google Cloud, Azure, Kubernetes, Docker)'
    ],
    url: 'https://en.wikipedia.org/wiki/Linux_kernel'
  }
];

saveDb('history.json', historyExpanded);
saveDb('sports.json', sportsExpanded);
saveDb('inventions.json', inventionsExpanded);
saveDb('tech_programming.json', techExpanded);