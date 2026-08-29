export interface ParsedActivity {
  id: string;
  rawSnippet: string;
  chapterId?: string;
  chapterName?: string;
  subjectName?: string;
  subjectColor?: string;
  durationMinutes: number;
  activityType: "MCQ" | "THEORY" | "LECTURE" | "REVISION";
  source: string;
  questions: number;
  correctIndependent: number;
  assisted: number;
  wrong: number;
  notes: string;
  confidence: number; // 0 to 100
}

export interface ChapterCatalogItem {
  id: string;
  name: string;
  subjectName: string;
  slug: string;
  aliases?: string[];
}

// Canonical Aliases for all JEE chapters for fuzzy and synonym matching
const CHAPTER_ALIASES: Record<string, string[]> = {
  // Physics
  "units-and-measurements": ["units and measurements", "units & measurements", "units", "dimensions", "dimensional analysis", "error analysis", "errors"],
  "kinematics": ["kinematics", "motion in a straight line", "motion in 1d", "motion in 2d", "projectile motion", "relative motion", "1d motion", "2d motion"],
  "laws-of-motion": ["laws of motion", "newton laws of motion", "nlm", "friction", "circular motion", "pseudo force"],
  "work-energy-and-power": ["work energy and power", "work power and energy", "wep", "work energy power", "work and energy", "potential energy", "power"],
  "rotational-motion": ["rotational motion", "rotation", "moment of inertia", "moi", "torque", "angular momentum", "rolling motion", "rolling", "center of mass", "com"],
  "gravitation": ["gravitation", "gravity", "gravitational potential", "orbital velocity", "escape velocity", "kepler laws"],
  "mechanical-properties-of-solids": ["mechanical properties of solids", "solids", "elasticity", "stress strain", "youngs modulus", "bulk modulus"],
  "mechanical-properties-of-fluids": ["mechanical properties of fluids", "fluids", "fluid mechanics", "viscosity", "surface tension", "bernoulli", "pascal law", "buoyancy"],
  "thermal-properties-of-matter": ["thermal properties of matter", "calorimetry", "thermal expansion", "heat transfer", "conduction", "convection", "radiation", "stefan law"],
  "thermodynamics": ["thermodynamics", "thermo", "first law of thermo", "second law of thermo", "heat engine", "carnot engine", "carnot cycle", "entropy"],
  "kinetic-theory-of-gases": ["kinetic theory of gases", "kinetic theory", "ktg", "ideal gas equation", "rms speed", "mean free path"],
  "oscillations": ["oscillations", "simple harmonic motion", "shm", "spring pendulum", "simple pendulum"],
  "waves": ["waves", "sound waves", "wave motion", "doppler effect", "standing waves", "beats", "organ pipes"],
  "electrostatics": ["electrostatics", "electro", "coulomb law", "electric field", "electric potential", "gauss law", "capacitance", "capacitors", "capacitor"],
  "current-electricity": ["current electricity", "current", "circuits", "kirchhoff laws", "meter bridge", "potentiometer", "drift velocity", "wheatstone bridge"],
  "magnetic-effect-of-current-and-magnetism": ["magnetic effect of current", "magnetism", "biot savart", "ampere law", "lorentz force", "magnetic field", "dipole", "moving charges"],
  "electromagnetic-induction-and-ac": ["electromagnetic induction and ac", "electromagnetic induction", "emi", "alternating current", "ac", "faraday law", "lenz law", "lcr circuits", "lcr", "transformer"],
  "electromagnetic-waves": ["electromagnetic waves", "em waves", "emw", "displacement current", "electromagnetic spectrum"],
  "optics": ["optics", "ray optics", "wave optics", "geometric optics", "reflection", "refraction", "lenses", "prisms", "interference", "diffraction", "ydse", "polarisation"],
  "dual-nature-of-matter-and-radiation": ["dual nature of matter and radiation", "dual nature", "photoelectric effect", "photoelectric", "de broglie", "matter waves"],
  "atoms-and-nuclei": ["atoms and nuclei", "atoms", "nuclei", "bohr model", "rutherford model", "radioactivity", "nuclear fission", "nuclear fusion", "mass defect"],
  "electronic-devices": ["electronic devices", "semiconductors", "semiconductor", "pn junction", "diodes", "transistors", "logic gates", "led", "zener diode"],

  // Chemistry
  "some-basic-concepts-of-chemistry": ["some basic concepts of chemistry", "basic concepts of chemistry", "mole concept", "mole", "stoichiometry", "empirical formula"],
  "structure-of-atom": ["structure of atom", "atomic structure", "quantum numbers", "bohr model chem", "heisenberg", "electronic configuration"],
  "classification-of-elements-and-periodicity": ["classification of elements", "periodic table", "periodicity", "periodic properties", "ionization energy", "electron gain enthalpy"],
  "chemical-bonding-and-molecular-structure": ["chemical bonding", "chemical bonding and molecular structure", "molecular structure", "vsepr", "hybridization", "hybridisation", "mot", "molecular orbital theory", "dipole moment"],
  "chemical-thermodynamics": ["chemical thermodynamics", "chem thermo", "enthalpy", "gibbs free energy", "hess law", "spontaneity", "thermochemistry"],
  "equilibrium": ["equilibrium", "chemical equilibrium", "ionic equilibrium", "ph calculation", "buffer solutions", "solubility product", "ksp", "le chatelier"],
  "redox-reactions": ["redox reactions", "redox", "oxidation state", "balancing redox", "oxidation number"],
  "p-block-elements": ["p-block elements", "p block", "group 13", "group 14", "group 15", "group 16", "group 17", "group 18"],
  "organic-chemistry-some-basic-principles-and-techniques": ["general organic chemistry", "goc", "organic chemistry basic principles", "iupac", "iupac nomenclature", "isomerism", "inductive effect", "resonance effect", "hyperconjugation"],
  "hydrocarbons": ["hydrocarbons", "alkanes", "alkenes", "alkynes", "aromatic hydrocarbons", "benzene", "ozonolysis", "markovnikov"],
  "solutions": ["solutions", "colligative properties", "raoult law", "van t hoff factor", "osmotic pressure", "elevation in boiling point", "depression in freezing point"],
  "electrochemistry": ["electrochemistry", "nernst equation", "galvanic cell", "kohlrausch law", "faraday laws of electrolysis", "electrochemical cell"],
  "chemical-kinetics": ["chemical kinetics", "kinetics", "rate of reaction", "order of reaction", "arrhenius equation", "half life", "activation energy"],
  "d-and-f-block-elements": ["d and f block elements", "d and f block", "d-block", "f-block", "transition elements", "lanthanides", "actinides"],
  "coordination-compounds": ["coordination compounds", "coordination", "complex compounds", "cft", "crystal field theory", "vbt", "ligands", "isomers coordination", "iupac coordination"],
  "haloalkanes-and-haloarenes": ["haloalkanes and haloarenes", "haloalkanes", "haloarenes", "alkyl halides", "sn1", "sn2", "elimination reactions"],
  "alcohols-phenols-and-ethers": ["alcohols phenols and ethers", "alcohols", "phenols", "ethers", "grignard reagent reactions", "reimer tiemann", "kolbe reaction"],
  "aldehydes-ketones-and-carboxylic-acids": ["aldehydes ketones and carboxylic acids", "aldehydes", "ketones", "carboxylic acids", "carbonyl compounds", "aldol condensation", "cannizzaro", "clemmensen"],
  "amines": ["amines", "diazonium salts", "hoffmann bromamide", "gabriel phthalimide", "carbylamine"],
  "biomolecules": ["biomolecules", "carbohydrates", "amino acids", "proteins", "nucleic acids", "dna rna", "vitamins"],

  // Mathematics
  "sets-relations-and-functions": ["sets relations and functions", "sets", "relations", "functions", "domain range", "composite functions", "inverse functions"],
  "trigonometric-functions": ["trigonometric functions", "trigonometry", "trigo", "trigonometric equations", "trig identities", "inverse trigo", "itf"],
  "complex-numbers-and-quadratic-equations": ["complex numbers and quadratic equations", "complex numbers", "complex number", "quadratic equations", "quadratics", "roots of equations", "modulus amplitude", "de moivre"],
  "permutations-and-combinations": ["permutations and combinations", "pnc", "p and c", "combinations", "permutations", "arrangements"],
  "binomial-theorem": ["binomial theorem", "binomial", "binomial expansion", "general term binomial"],
  "sequences-and-series": ["sequences and series", "sequence and series", "ap", "gp", "arithmetic progression", "geometric progression", "agp", "harmonic progression", "sum of series"],
  "straight-lines": ["straight lines", "straight line", "coordinate geometry", "slope", "pair of straight lines", "distance formula", "locus"],
  "conic-sections": ["conic sections", "conics", "circles", "circle", "parabola", "ellipse", "hyperbola", "tangents normals"],
  "limits-continuity-and-differentiability": ["limits continuity and differentiability", "limits", "continuity", "differentiability", "lcd", "lhopital", "indeterminate forms"],
  "differentiation": ["differentiation", "derivatives", "chain rule", "parametric differentiation", "implicit differentiation"],
  "applications-of-derivatives": ["applications of derivatives", "application of derivatives", "aod", "tangents and normals", "monotonicity", "maxima and minima", "mean value theorem", "lmvt", "rolle theorem"],
  "integrals": ["integrals", "integration", "indefinite integration", "definite integration", "definite integrals", "properties of definite integrals", "by parts"],
  "applications-of-integrals": ["applications of integrals", "application of integrals", "area under curves", "area under the curve", "auc"],
  "differential-equations": ["differential equations", "differential equation", "de", "variable separable", "homogeneous de", "linear differential equation", "integrating factor"],
  "vector-algebra": ["vector algebra", "vectors", "vector", "dot product", "cross product", "scalar triple product", "vector triple product"],
  "three-dimensional-geometry": ["three dimensional geometry", "3d geometry", "3d", "planes", "lines in 3d", "direction cosines", "direction ratios", "shortest distance"],
  "matrices-and-determinants": ["matrices and determinants", "matrices", "determinants", "matrix", "cramer rule", "adjoint matrix", "system of linear equations"],
  "probability": ["probability", "prob", "bayes theorem", "conditional probability", "probability distribution", "binomial distribution"],
  "statistics": ["statistics", "mean median mode", "variance", "standard deviation"],
  "mathematical-reasoning": ["mathematical reasoning", "logic", "tautology", "contrapositive"],
};

export function parseNaturalLanguageInput(
  rawText: string,
  allChapters: ChapterCatalogItem[] = []
): ParsedActivity[] {
  if (!rawText || !rawText.trim()) return [];

  // Split multi-session entries: by newlines, numbered lists (1. 2.), or bullet points
  const rawSegments = rawText
    .split(/\n+|\r+|(?:\b(?:\d+\.|\*|\-)\s+)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3);

  const segments = rawSegments.length > 0 ? rawSegments : [rawText.trim()];
  const parsedActivities: ParsedActivity[] = [];

  for (const segment of segments) {
    const activity = parseSingleSegment(segment, allChapters);
    if (activity) {
      parsedActivities.push(activity);
    }
  }

  // If no segment yielded a valid parsed activity, do a best-effort fallback on the whole text
  if (parsedActivities.length === 0) {
    const fallback = parseSingleSegment(rawText, allChapters);
    if (fallback) parsedActivities.push(fallback);
  }

  return parsedActivities;
}

function parseSingleSegment(
  text: string,
  allChapters: ChapterCatalogItem[]
): ParsedActivity | null {
  const lower = text.toLowerCase();

  // 1. Chapter Detection
  let matchedChapter: ChapterCatalogItem | null = null;
  let bestMatchScore = 0;

  for (const chapter of allChapters) {
    const aliases = CHAPTER_ALIASES[chapter.slug] || [];
    const searchTerms = [chapter.name.toLowerCase(), ...aliases];

    for (const term of searchTerms) {
      if (term.length < 2) continue;
      const regex = new RegExp(`\\b${escapeRegExp(term)}\\b`, "i");
      if (regex.test(lower)) {
        const score = term.length;
        if (score > bestMatchScore) {
          bestMatchScore = score;
          matchedChapter = chapter;
        }
      } else if (lower.includes(term)) {
        const score = term.length * 0.8;
        if (score > bestMatchScore) {
          bestMatchScore = score;
          matchedChapter = chapter;
        }
      }
    }
  }

  // Fallback to first chapter if nothing matched
  const activeChapter = matchedChapter || allChapters[0];

  // 2. Duration Detection (e.g. "2 hours", "1.5h", "45 mins", "90 minutes", "1 hr 30 mins")
  let durationMinutes = 45; // default fallback

  const hourMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|h)\b/i);
  const minMatch = lower.match(/(\d+)\s*(?:minutes?|mins?|min|m)\b/i);
  const combinedMatch = lower.match(/(\d+)\s*(?:hours?|hrs?|hr|h)\s*(?:and)?\s*(\d+)\s*(?:minutes?|mins?|min|m)?\b/i);

  if (combinedMatch) {
    const h = parseFloat(combinedMatch[1]) || 0;
    const m = parseFloat(combinedMatch[2]) || 0;
    durationMinutes = Math.max(10, Math.round(h * 60 + m));
  } else if (hourMatch) {
    const h = parseFloat(hourMatch[1]) || 1;
    durationMinutes = Math.max(10, Math.round(h * 60));
  } else if (minMatch) {
    const m = parseInt(minMatch[1]) || 45;
    durationMinutes = Math.max(5, m);
  }

  // 3. Question Count & Accuracy Extraction
  let totalQuestions = 0;
  let independent = 0;
  let assisted = 0;
  let wrong = 0;

  const qMatch = lower.match(/(\d+)\s*(?:questions?|pyqs?|mcqs?|qs?|problems?|numerical)\b/i);
  if (qMatch) {
    totalQuestions = parseInt(qMatch[1]) || 0;
  }

  // Check detailed breakdown
  const correctMatch = lower.match(/(\d+)\s*(?:correct|right|independent|indep|done right)\b/i);
  const assistMatch = lower.match(/(\d+)\s*(?:assisted|hints?|with help|solutions?)\b/i);
  const wrongMatch = lower.match(/(\d+)\s*(?:wrong|incorrect|mistakes?|lost)\b/i);
  const fractionMatch = lower.match(/(\d+)\s*\/\s*(\d+)/);

  if (fractionMatch) {
    const num = parseInt(fractionMatch[1]);
    const denom = parseInt(fractionMatch[2]);
    if (denom >= num && denom > 0) {
      totalQuestions = denom;
      independent = num;
      wrong = denom - num;
    }
  } else {
    if (correctMatch) independent = parseInt(correctMatch[1]) || 0;
    if (assistMatch) assisted = parseInt(assistMatch[1]) || 0;
    if (wrongMatch) wrong = parseInt(wrongMatch[1]) || 0;
  }

  if (totalQuestions > 0 && independent === 0 && assisted === 0 && wrong === 0) {
    independent = totalQuestions;
  } else if (totalQuestions === 0 && (independent > 0 || wrong > 0 || assisted > 0)) {
    totalQuestions = independent + assisted + wrong;
  } else if (totalQuestions > 0 && independent + assisted + wrong < totalQuestions) {
    const remainder = totalQuestions - (independent + assisted + wrong);
    independent += remainder;
  }

  // 4. Activity Type Detection
  let activityType: "MCQ" | "THEORY" | "LECTURE" | "REVISION" = totalQuestions > 0 ? "MCQ" : "THEORY";

  if (/\b(?:lecture|class|video|watched|session|coaching lecture)\b/i.test(lower)) {
    activityType = "LECTURE";
  } else if (/\b(?:revis(?:ed|ion)|formula|active recall|forgotten|cheat sheet)\b/i.test(lower)) {
    activityType = "REVISION";
  } else if (totalQuestions > 0 || /\b(?:pyq|mcq|solve|practic(?:e|ed)|questions?)\b/i.test(lower)) {
    activityType = "MCQ";
  } else if (/\b(?:read|notes|theory|concept|ncert|module read)\b/i.test(lower)) {
    activityType = "THEORY";
  }

  // 5. Source Detection
  let source = "JEE_MAIN_PYQ";
  if (/\b(?:adv|advanced|jee advanced)\b/i.test(lower)) {
    source = "JEE_ADV_PYQ";
  } else if (/\b(?:hcv|h\.c\. verma|hc verma)\b/i.test(lower)) {
    source = "HCV";
  } else if (/\b(?:cengage|bm sharma|tewani)\b/i.test(lower)) {
    source = "CENGAGE_MODULE";
  } else if (/\b(?:allen|resonance|fiitjee|coaching|module)\b/i.test(lower)) {
    source = "CENGAGE_MODULE";
  } else if (/\b(?:irodov|krotov|pathfinder)\b/i.test(lower)) {
    source = "JEE_ADV_PYQ";
  }

  const confidence = matchedChapter ? 95 : 60;

  return {
    id: Math.random().toString(36).substring(2, 9),
    rawSnippet: text,
    chapterId: activeChapter?.id,
    chapterName: activeChapter?.name || "General Study",
    subjectName: activeChapter?.subjectName || "Physics",
    durationMinutes,
    activityType,
    source,
    questions: totalQuestions,
    correctIndependent: independent,
    assisted,
    wrong,
    notes: text,
    confidence,
  };
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
