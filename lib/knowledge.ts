export interface KnowledgeAnswer {
  title: string;
  extract: string;
  keyPoints?: string[];
  type: string;
  source: string;
}

export function resolveInstantMathOrFact(query: string, lang = 'en'): KnowledgeAnswer | null {
  const q = query.toLowerCase().replace(/[\s\-\_\(\)\^]+/g, ' ').trim();

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
      extract: `(a + b)² = a² + 2ab + b² (or a² + b² + 2ab). It is the standard algebraic identity for the square of a binomial sum. Expanding step-by-step: (a + b)(a + b) = a² + ab + ba + b² = a² + 2ab + b².`,
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
        'Application: Fast mental math and polynomial factorization',
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

  return null;
}
