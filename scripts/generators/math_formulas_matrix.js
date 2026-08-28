const { saveDb } = require('../db_helper.js');

const mathEntries = [
  {
    id: 'math-algebra-identities-complete',
    keywords: ['algebraic identities list', 'a+b whole square formula', 'a-b whole cube formula', 'a3+b3+c3-3abc identity', 'factorization formulas algebra'],
    title: 'Standard Algebraic Identities & Factorization Formulas',
    category: 'Mathematics',
    answer: 'Essential algebraic identities: (1) (a+b)² = a² + 2ab + b², (2) (a-b)² = a² - 2ab + b², (3) a² - b² = (a-b)(a+b), (4) (a+b)³ = a³ + 3a²b + 3ab² + b³ = a³ + b³ + 3ab(a+b), (5) a³ + b³ = (a+b)(a² - ab + b²), (6) a³ - b³ = (a-b)(a² + ab + b²), (7) a³ + b³ + c³ - 3abc = (a+b+c)(a² + b² + c² - ab - bc - ca).',
    highlights: [
      '(a + b)² = a² + 2ab + b²',
      '(a - b)² = a² - 2ab + b²',
      'a² - b² = (a - b)(a + b)',
      '(a + b + c)² = a² + b² + c² + 2(ab + bc + ca)',
      'a³ + b³ = (a + b)(a² - ab + b²)',
      'a³ - b³ = (a - b)(a² + ab + b²)',
      'Special condition: If a + b + c = 0, then a³ + b³ + c³ = 3abc'
    ],
    url: 'https://en.wikipedia.org/wiki/Factorization'
  },
  {
    id: 'math-trigonometry-exact-values-table',
    keywords: ['sin cos tan values table', 'exact values of sin 0 30 45 60 90', 'trigonometric ratios table radians degrees', 'tan 45 sin 60 cos 30 value'],
    title: 'Standard Trigonometric Ratios Table (0° to 90°)',
    category: 'Mathematics',
    answer: 'Standard trigonometric values: sin(0°)=0, sin(30°)=1/2, sin(45°)=1/√2, sin(60°)=√3/2, sin(90°)=1. cos(0°)=1, cos(30°)=√3/2, cos(45°)=1/√2, cos(60°)=1/2, cos(90°)=0. tan(0°)=0, tan(30°)=1/√3, tan(45°)=1, tan(60°)=√3, tan(90°)=Undefined (∞).',
    highlights: [
      '0° (0 rad): sin=0, cos=1, tan=0, csc=Undef, sec=1, cot=Undef',
      '30° (π/6 rad): sin=1/2 (0.5), cos=√3/2 (~0.866), tan=1/√3 (~0.577)',
      '45° (π/4 rad): sin=1/√2 (~0.707), cos=1/√2 (~0.707), tan=1',
      '60° (π/3 rad): sin=√3/2 (~0.866), cos=1/2 (0.5), tan=√3 (~1.732)',
      '90° (π/2 rad): sin=1, cos=0, tan=Undefined (±∞)'
    ],
    url: 'https://en.wikipedia.org/wiki/Trigonometric_constants_expressed_in_real_radicals'
  },
  {
    id: 'math-geometry-surface-area-volumes',
    keywords: ['surface area and volume formulas', 'volume of sphere cylinder cone cuboid', 'curved surface area formulas geometry', 'total surface area sphere hemisphere'],
    title: 'Surface Area and Volume Formulas for 3D Geometric Solids',
    category: 'Mathematics',
    answer: 'Key 3D solid formulas: Cube (V = a³, TSA = 6a²), Cuboid (V = lbh, TSA = 2(lb+bh+hl)), Cylinder (V = πr²h, CSA = 2πrh, TSA = 2πr(r+h)), Cone (V = ⅓πr²h, CSA = πrl where l=√(r²+h²), TSA = πr(r+l)), Sphere (V = ⁴⁄₃πr³, TSA = 4πr²), Hemisphere (V = ⅔πr³, CSA = 2πr², TSA = 3πr²).',
    highlights: [
      'Sphere (radius r): Volume = (4/3)πr³ | Surface Area = 4πr²',
      'Hemisphere: Volume = (2/3)πr³ | Curved Surface = 2πr² | Total Surface Area = 3πr²',
      'Cylinder (radius r, height h): Volume = πr²h | CSA = 2πrh | TSA = 2πr(r + h)',
      'Cone (radius r, height h, slant height l=√(r²+h²)): Volume = (1/3)πr²h | CSA = πrl | TSA = πr(r + l)',
      'Frustum of Cone: Volume = (1/3)πh(r₁² + r₂² + r₁r₂) | CSA = πl(r₁ + r₂)'
    ],
    url: 'https://en.wikipedia.org/wiki/Volume'
  },
  {
    id: 'math-conic-sections-equations',
    keywords: ['conic sections equations standard forms', 'circle parabola ellipse hyperbola formula', 'eccentricity e of conic sections', 'foci directrix vertex conics'],
    title: 'Conic Sections — Circle, Parabola, Ellipse, Hyperbola',
    category: 'Mathematics',
    answer: 'Conic sections are curves formed by intersecting a plane with a double cone, defined by eccentricity e: Circle (e=0: x²+y²=r²), Parabola (e=1: y²=4ax), Ellipse (0<e<1: x²/a² + y²/b² = 1, e=√(1-b²/a²)), Hyperbola (e>1: x²/a² - y²/b² = 1, e=√(1+b²/a²), rectangular hyperbola xy=c²).',
    highlights: [
      'Circle (center (h,k), radius r): (x - h)² + (y - k)² = r² | Eccentricity e = 0',
      'Parabola (focus (a,0), directrix x = -a): y² = 4ax | Length of Latus Rectum = 4a | e = 1',
      'Ellipse (major axis 2a, minor axis 2b): x²/a² + y²/b² = 1 | Foci (±ae, 0) | e = √(1 - b²/a²) < 1',
      'Hyperbola (transverse axis 2a, conjugate 2b): x²/a² - y²/b² = 1 | Foci (±ae, 0) | e = √(1 + b²/a²) > 1',
      'Asymptotes of hyperbola: y = ±(b/a)x'
    ],
    url: 'https://en.wikipedia.org/wiki/Conic_section'
  }
];

saveDb('mathematics_advanced.json', mathEntries);