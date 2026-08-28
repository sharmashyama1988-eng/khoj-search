const { saveDb } = require('./db_helper.js');

console.log("=== STARTING 3000+ ENTRY CORPUS SYNTHESIS ===");

// Helper to push batch entries cleanly
function addBatch(filename, entries) {
  saveDb(filename, entries);
}

// -------------------------------------------------------------
// 1. MATHEMATICS BATCH — Complete Trigonometry Table (0° to 360° by 5°)
// -------------------------------------------------------------
const mathAngleBatch = [];
for (let deg = 0; deg <= 360; deg += 5) {
  const rad = (deg * Math.PI) / 180;
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.abs(cosVal) < 1e-10 ? "Undefined (±∞)" : (sinVal / cosVal).toFixed(4);
  const sinClean = Math.abs(sinVal) < 1e-10 ? "0" : sinVal.toFixed(4);
  const cosClean = Math.abs(cosVal) < 1e-10 ? "0" : cosVal.toFixed(4);

  mathAngleBatch.push({
    id: `math-trig-angle-${deg}-deg-exact`,
    keywords: [
      `sin ${deg} cos ${deg} tan ${deg}`,
      `value of sin ${deg} degrees`,
      `value of cos ${deg} degrees`,
      `value of tan ${deg} degrees`,
      `sin ${deg} value`,
      `cos ${deg} value`,
      `tan ${deg} value`
    ],
    title: `Trigonometric Values for ${deg}° (${rad.toFixed(4)} rad)`,
    category: 'Mathematics',
    answer: `For an angle of ${deg}° (${rad.toFixed(4)} radians = ${(deg/180).toFixed(3)}π rad): sin(${deg}°) = ${sinClean}, cos(${deg}°) = ${cosClean}, tan(${deg}°) = ${tanVal}.`,
    highlights: [
      `Angle: ${deg}° = ${rad.toFixed(4)} radians`,
      `sin(${deg}°) = ${sinClean}`,
      `cos(${deg}°) = ${cosClean}`,
      `tan(${deg}°) = ${tanVal}`
    ],
    url: 'https://en.wikipedia.org/wiki/Trigonometric_functions'
  });
}
addBatch('mathematics.json', mathAngleBatch);

// -------------------------------------------------------------
// 2. MATHEMATICS BATCH — Squares, Cubes, Square Roots (1 to 100)
// -------------------------------------------------------------
const mathPowersBatch = [];
for (let n = 1; n <= 100; n++) {
  const sq = n * n;
  const cube = n * n * n;
  const sqrt = Math.sqrt(n).toFixed(4);
  const cbrt = Math.cbrt(n).toFixed(4);

  mathPowersBatch.push({
    id: `math-number-${n}-properties`,
    keywords: [
      `square of ${n}`,
      `cube of ${n}`,
      `square root of ${n}`,
      `cube root of ${n}`,
      `what is ${n} squared`,
      `${n} power 2`,
      `${n} power 3`
    ],
    title: `Properties of Number ${n} — Square (${sq}), Cube (${cube}), Roots`,
    category: 'Mathematics',
    answer: `For the integer ${n}: Square (${n}²) = ${sq}, Cube (${n}³) = ${cube}, Square Root (√${n}) ≈ ${sqrt}, Cube Root (∛${n}) ≈ ${cbrt}.`,
    highlights: [
      `Number: ${n}`,
      `Square (${n}²) = ${sq}`,
      `Cube (${n}³) = ${cube}`,
      `Square Root (√${n}) = ${sqrt}`,
      `Cube Root (∛${n}) = ${cbrt}`
    ],
    url: 'https://en.wikipedia.org/wiki/Square_number'
  });
}
addBatch('mathematics.json', mathPowersBatch);

console.log("Math batch 1 & 2 synthesized.");