import { searchKnowledgeDB } from '@/lib/knowledge_db';

export interface KnowledgeAnswer {
  title: string;
  extract: string;
  keyPoints?: string[];
  type: string;
  source: string;
}

export function resolveInstantMathOrFact(query: string, lang = 'en'): KnowledgeAnswer | null {
  // 0. Search local high-density /db knowledge store
  const dbMatch = searchKnowledgeDB(query);
  if (dbMatch) {
    return {
      title: dbMatch.title,
      extract: dbMatch.answer,
      keyPoints: dbMatch.highlights,
      type: dbMatch.category.toLowerCase(),
      source: `Khoj Knowledge DB (${dbMatch.category})`,
    };
  }

  const rawQ = query.trim().toLowerCase();
  const q = rawQ.replace(/[\s\-\_\(\)\^]+/g, ' ').trim();

  // ─────────────────────────────────────────────────────────────────────────
  // 1. Prominent Public Figures: Age, Birth & Bio Resolution
  // ─────────────────────────────────────────────────────────────────────────
  // Narendra Modi
  if ((q.includes('modi') || q.includes('narendra modi')) && (q.includes('age') || q.includes('umar') || q.includes('old') || q.includes('born') || q.includes('birth') || q.includes('kaun') || q.includes('who is'))) {
    return {
      title: 'Narendra Modi — Age & Details',
      extract: `Narendra Modi is 75 years old (born 17 September 1950 in Vadnagar, Gujarat). He has been serving as the 14th Prime Minister of India since May 2014.`,
      keyPoints: [
        'Current Age: 75 years old',
        'Date of Birth: 17 September 1950 (Vadnagar, Mehsana, Bombay State / Gujarat)',
        'Office: Prime Minister of India (since 26 May 2014)',
        'Political Party: Bharatiya Janata Party (BJP)',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // Elon Musk
  if (q.includes('elon musk') && (q.includes('age') || q.includes('old') || q.includes('born') || q.includes('who is'))) {
    return {
      title: 'Elon Musk — Age & Profile',
      extract: `Elon Musk is 55 years old (born June 28, 1971 in Pretoria, South Africa). He is the CEO of Tesla, SpaceX, and owner/CTO of X (Twitter).`,
      keyPoints: [
        'Current Age: 55 years old',
        'Date of Birth: June 28, 1971 (Pretoria, South Africa)',
        'Leadership: CEO of Tesla, SpaceX, xAI, Neuralink; Owner of X',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // Virat Kohli
  if (q.includes('virat') && (q.includes('age') || q.includes('old') || q.includes('born') || q.includes('who is'))) {
    return {
      title: 'Virat Kohli — Age & Profile',
      extract: `Virat Kohli is 37 years old (born 5 November 1988 in Delhi, India). He is an Indian international cricketer and former captain of the Indian cricket team.`,
      keyPoints: [
        'Current Age: 37 years old',
        'Date of Birth: 5 November 1988 (Delhi, India)',
        'Role: Right-handed top-order batsman',
        'International Centuries: 80+ international centuries across formats',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // Shah Rukh Khan
  if ((q.includes('shah rukh khan') || q.includes('shahrukh khan') || q.includes('srk')) && (q.includes('age') || q.includes('old') || q.includes('born') || q.includes('who is'))) {
    return {
      title: 'Shah Rukh Khan — Age & Profile',
      extract: `Shah Rukh Khan (SRK) is 60 years old (born 2 November 1965 in New Delhi). Widely known as the "King of Bollywood" or "King Khan", he is one of the world's most successful film stars.`,
      keyPoints: [
        'Current Age: 60 years old',
        'Date of Birth: 2 November 1965 (New Delhi, India)',
        'Profession: Actor, Film Producer, Entrepreneur (Red Chillies Entertainment)',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // MS Dhoni
  if ((q.includes('dhoni') || q.includes('ms dhoni')) && (q.includes('age') || q.includes('old') || q.includes('born') || q.includes('who is'))) {
    return {
      title: 'MS Dhoni — Age & Profile',
      extract: `MS Dhoni (Mahendra Singh Dhoni) is 45 years old (born 7 July 1981 in Ranchi, Jharkhand). He is the former captain of the Indian cricket team who led India to victories in the 2007 T20 World Cup, 2011 ODI World Cup, and 2013 Champions Trophy.`,
      keyPoints: [
        'Current Age: 45 years old',
        'Date of Birth: 7 July 1981 (Ranchi, Bihar / Jharkhand)',
        'Major Honours: 2011 ICC Cricket World Cup, 2007 ICC World Twenty20, 2013 ICC Champions Trophy',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // Donald Trump
  if (q.includes('trump') && (q.includes('age') || q.includes('old') || q.includes('born') || q.includes('who is'))) {
    return {
      title: 'Donald Trump — Age & Profile',
      extract: `Donald Trump is 80 years old (born June 14, 1946 in Queens, New York City). He is the 45th and 47th President of the United States.`,
      keyPoints: [
        'Current Age: 80 years old',
        'Date of Birth: June 14, 1946 (Queens, New York City, USA)',
        'Office: President of the United States (45th & 47th President)',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // Sundar Pichai
  if (q.includes('sundar pichai') && (q.includes('age') || q.includes('old') || q.includes('who is'))) {
    return {
      title: 'Sundar Pichai — Age & Profile',
      extract: `Sundar Pichai is 54 years old (born 10 June 1972 in Madurai, Tamil Nadu). He is the Chief Executive Officer (CEO) of Alphabet Inc. and Google.`,
      keyPoints: [
        'Current Age: 54 years old',
        'Date of Birth: 10 June 1972 (Madurai, Tamil Nadu, India)',
        'Role: CEO of Google and Alphabet Inc.',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // Satya Nadella
  if (q.includes('satya nadella') && (q.includes('age') || q.includes('old') || q.includes('who is'))) {
    return {
      title: 'Satya Nadella — Age & Profile',
      extract: `Satya Nadella is 59 years old (born 19 August 1967 in Hyderabad, India). He is the Chairman and Chief Executive Officer (CEO) of Microsoft.`,
      keyPoints: [
        'Current Age: 59 years old',
        'Date of Birth: 19 August 1967 (Hyderabad, Andhra Pradesh / Telangana, India)',
        'Role: CEO and Chairman of Microsoft',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // Rahul Gandhi
  if (q.includes('rahul gandhi') && (q.includes('age') || q.includes('old') || q.includes('who is'))) {
    return {
      title: 'Rahul Gandhi — Age & Profile',
      extract: `Rahul Gandhi is 56 years old (born 19 June 1970 in New Delhi). He is an Indian politician and currently the Leader of the Opposition in the Lok Sabha.`,
      keyPoints: [
        'Current Age: 56 years old',
        'Date of Birth: 19 June 1970 (New Delhi, India)',
        'Current Office: Leader of Opposition in the 18th Lok Sabha',
      ],
      type: 'direct_fact',
      source: 'Verified Biographical Data',
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 2. Geography & National Capitals
  // ─────────────────────────────────────────────────────────────────────────
  if (q.includes('capital of') || q.includes('rajdhani')) {
    const capitalMap: Record<string, { country: string; capital: string; detail: string }> = {
      'france': { country: 'France', capital: 'Paris', detail: 'Paris is the capital and largest city of France, located on the Seine River.' },
      'india': { country: 'India', capital: 'New Delhi', detail: 'New Delhi is the national capital of India and the seat of all three branches of the Government of India.' },
      'japan': { country: 'Japan', capital: 'Tokyo', detail: 'Tokyo is the capital of Japan and the world\'s most populous metropolitan area.' },
      'usa': { country: 'United States of America', capital: 'Washington, D.C.', detail: 'Washington, D.C. is the capital city of the United States of America.' },
      'united states': { country: 'United States', capital: 'Washington, D.C.', detail: 'Washington, D.C. is the capital of the United States.' },
      'america': { country: 'United States of America', capital: 'Washington, D.C.', detail: 'Washington, D.C. is the capital of the United States.' },
      'uk': { country: 'United Kingdom', capital: 'London', detail: 'London is the capital and largest city of England and the United Kingdom.' },
      'england': { country: 'England', capital: 'London', detail: 'London is the capital of England and the United Kingdom.' },
      'germany': { country: 'Germany', capital: 'Berlin', detail: 'Berlin is the capital and largest city of Germany by both area and population.' },
      'australia': { country: 'Australia', capital: 'Canberra', detail: 'Canberra is the capital city of Australia, situated in the Australian Capital Territory.' },
      'canada': { country: 'Canada', capital: 'Ottawa', detail: 'Ottawa is the capital city of Canada, located in the province of Ontario.' },
      'russia': { country: 'Russia', capital: 'Moscow', detail: 'Moscow is the capital and largest city of the Russian Federation.' },
      'china': { country: 'China', capital: 'Beijing', detail: 'Beijing is the capital of the People\'s Republic of China.' },
      'italy': { country: 'Italy', capital: 'Rome', detail: 'Rome is the capital city of Italy and of the Lazio region.' },
      'brazil': { country: 'Brazil', capital: 'Brasília', detail: 'Brasília is the federal capital of Brazil and seat of government of the Federal District.' },
      'saudi arabia': { country: 'Saudi Arabia', capital: 'Riyadh', detail: 'Riyadh is the capital and largest city of Saudi Arabia.' },
      'uae': { country: 'United Arab Emirates', capital: 'Abu Dhabi', detail: 'Abu Dhabi is the capital and second-most populous city of the United Arab Emirates.' },
      'pakistan': { country: 'Pakistan', capital: 'Islamabad', detail: 'Islamabad is the capital city of Pakistan.' },
      'bangladesh': { country: 'Bangladesh', capital: 'Dhaka', detail: 'Dhaka is the capital and largest city of Bangladesh.' },
      'nepal': { country: 'Nepal', capital: 'Kathmandu', detail: 'Kathmandu is the capital and most populous city of Nepal.' },
      'sri lanka': { country: 'Sri Lanka', capital: 'Sri Jayawardenepura Kotte', detail: 'Sri Jayawardenepura Kotte is the legislative capital and Colombo is the executive/judicial capital of Sri Lanka.' },
    };

    for (const [key, val] of Object.entries(capitalMap)) {
      if (q.includes(key)) {
        return {
          title: `Capital of ${val.country} — ${val.capital}`,
          extract: `${val.capital} is the capital of ${val.country}. ${val.detail}`,
          keyPoints: [
            `Capital City: ${val.capital}`,
            `Country: ${val.country}`,
          ],
          type: 'direct_fact',
          source: 'Geographical Knowledge Graph',
        };
      }
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 3. Mathematical Identities & Algebra
  // ─────────────────────────────────────────────────────────────────────────
  // (a + b)^2
  if (
    q.includes('a b whole square') ||
    q.includes('a plus b whole square') ||
    q.includes('a b ka whole square') ||
    q.includes('a+b whole square') ||
    q.includes('a+b 2') ||
    q.includes('a+b square') ||
    q.includes('a plus b square')
  ) {
    return {
      title: '(a + b)² — Algebraic Identity',
      extract: `(a + b)² = a² + 2ab + b² (or a² + b² + 2ab). It is the fundamental algebraic identity for the square of a binomial sum. Expanding step-by-step: (a + b)(a + b) = a² + ab + ba + b² = a² + 2ab + b².`,
      keyPoints: [
        'Formula: (a + b)² = a² + 2ab + b²',
        'Expansion: (a + b)(a + b) = a² + 2ab + b²',
        'Geometric Meaning: The area of a square with side length (a + b)',
        'Related Formula: (a - b)² = a² - 2ab + b²',
      ],
      type: 'math_identity',
      source: 'Khoj Mathematical Knowledge Base',
    };
  }

  // (a - b)^2
  if (
    q.includes('a b whole square minus') ||
    q.includes('a minus b whole square') ||
    q.includes('a b minus square') ||
    q.includes('a-b whole square') ||
    q.includes('a-b square')
  ) {
    return {
      title: '(a - b)² — Algebraic Identity',
      extract: `(a - b)² = a² - 2ab + b² (or a² + b² - 2ab). It is the standard algebraic identity for the square of a binomial difference. Expanding step-by-step: (a - b)(a - b) = a² - ab - ba + b² = a² - 2ab + b².`,
      keyPoints: [
        'Formula: (a - b)² = a² - 2ab + b²',
        'Expansion: (a - b)(a - b) = a² - 2ab + b²',
        'Related Identity: a² - b² = (a + b)(a - b)',
      ],
      type: 'math_identity',
      source: 'Khoj Mathematical Knowledge Base',
    };
  }

  // a^2 - b^2
  if (q.includes('a2 b2') || q.includes('a square minus b square') || q.includes('a 2 minus b 2') || q.includes('a square b square')) {
    return {
      title: 'a² - b² (Difference of Two Squares)',
      extract: `a² - b² = (a + b)(a - b). This identity states that the difference of two squared terms factors into the product of their sum and difference.`,
      keyPoints: [
        'Formula: a² - b² = (a + b)(a - b)',
        'Example: 5² - 3² = (5 + 3)(5 - 3) = 8 × 2 = 16 (25 - 9 = 16)',
        'Application: Polynomial factorization and mental math',
      ],
      type: 'math_identity',
      source: 'Khoj Mathematical Knowledge Base',
    };
  }

  // (a + b)^3
  if (q.includes('a b whole cube') || q.includes('a plus b whole cube') || q.includes('a+b whole cube') || q.includes('a+b cube')) {
    return {
      title: '(a + b)³ — Algebraic Cube Identity',
      extract: `(a + b)³ = a³ + 3a²b + 3ab² + b³ = a³ + b³ + 3ab(a + b). It represents the volume of a cube with edge length (a + b).`,
      keyPoints: [
        'Standard Form: (a + b)³ = a³ + 3a²b + 3ab² + b³',
        'Factored Form: (a + b)³ = a³ + b³ + 3ab(a + b)',
        'Related Identity: (a - b)³ = a³ - 3a²b + 3ab² - b³',
      ],
      type: 'math_identity',
      source: 'Khoj Mathematical Knowledge Base',
    };
  }

  // Pythagoras theorem
  if (q.includes('pythagoras') || q.includes('pythagorean theorem')) {
    return {
      title: 'Pythagorean Theorem (a² + b² = c²)',
      extract: `In a right-angled triangle, the square of the hypotenuse (c) is equal to the sum of the squares of the other two sides (a and b): a² + b² = c².`,
      keyPoints: [
        'Formula: a² + b² = c² (where c is the hypotenuse)',
        'Example: 3² + 4² = 9 + 16 = 25 = 5²',
        'Common Triples: (3, 4, 5), (5, 12, 13), (8, 15, 17)',
      ],
      type: 'math_identity',
      source: 'Khoj Mathematical Knowledge Base',
    };
  }

  // Quadratic formula
  if (q.includes('quadratic formula') || q.includes('quadratic equation formula')) {
    return {
      title: 'Quadratic Formula',
      extract: `For any quadratic equation ax² + bx + c = 0, the roots are given by x = (-b ± √(b² - 4ac)) / (2a). The term (b² - 4ac) is the discriminant (D).`,
      keyPoints: [
        'Formula: x = [-b ± √(b² - 4ac)] / (2a)',
        'Discriminant (D = b² - 4ac): D > 0 (2 real roots), D = 0 (1 repeated root), D < 0 (2 complex roots)',
      ],
      type: 'math_identity',
      source: 'Khoj Mathematical Knowledge Base',
    };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // 4. Fundamental Scientific Constants
  // ─────────────────────────────────────────────────────────────────────────
  if (q.includes('speed of light') || q.includes('prakash ki chaal')) {
    return {
      title: 'Speed of Light in Vacuum (c)',
      extract: `The speed of light in vacuum is exactly 299,792,458 meters per second (approx. 3 × 10⁸ m/s or 186,282 miles per second). It is denoted by the universal constant 'c'.`,
      keyPoints: [
        'Exact Value: 299,792,458 m/s',
        'Approximate Value: 3 × 10⁸ m/s (300,000 km/s)',
        'Imperial: ~186,282 miles/second',
        'Significance: The universal physical constant and ultimate speed limit of information transfer',
      ],
      type: 'science_constant',
      source: 'National Institute of Standards and Technology (NIST)',
    };
  }

  if (q.includes('value of pi') || q.includes('pi value') || q.includes('pi ki value')) {
    return {
      title: 'Value of Pi (π)',
      extract: `The value of Pi (π) is approximately 3.14159265359 (commonly approximated as 22/7 or 3.14). It is the ratio of a circle's circumference to its diameter.`,
      keyPoints: [
        'Decimal Approximation: 3.14159265359...',
        'Fractional Approximation: 22/7',
        'Mathematical Definition: Ratio of Circumference (C) to Diameter (d) -> C / d',
      ],
      type: 'math_constant',
      source: 'Mathematical Constants Reference',
    };
  }

  return null;
}
