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

// Comprehensive keyword & topic mapping to canonical chapter slugs
const TOPIC_KEYWORD_MAP: { slug: string; keywords: string[] }[] = [
  // PHYSICS
  {
    slug: "rotational-motion",
    keywords: [
      "rotational motion", "rotation", "moment of inertia", "moi", "torque", "angular momentum",
      "rolling motion", "rolling", "center of mass", "com", "rigid body", "parallel axis", "perpendicular axis"
    ]
  },
  {
    slug: "kinematics",
    keywords: [
      "kinematics", "motion in a straight line", "motion in 1d", "motion in 2d", "1d motion", "2d motion",
      "projectile motion", "projectile", "relative motion", "relative velocity", "speed velocity", "acceleration"
    ]
  },
  {
    slug: "laws-of-motion",
    keywords: [
      "laws of motion", "newton laws", "nlm", "friction", "circular motion", "pseudo force",
      "tension", "pulley", "free body diagram", "fbd", "banking of road", "momentum conservation"
    ]
  },
  {
    slug: "work-energy-power",
    keywords: [
      "work energy power", "work energy and power", "work power and energy", "wep", "work and energy",
      "potential energy", "kinetic energy", "work energy theorem", "conservative force", "power", "collisions", "elastic collision"
    ]
  },
  {
    slug: "gravitation",
    keywords: [
      "gravitation", "gravity", "gravitational potential", "orbital velocity", "escape velocity",
      "kepler laws", "kepler", "gravitational field", "satellite motion"
    ]
  },
  {
    slug: "electrostatics",
    keywords: [
      "electrostatics", "electro", "coulomb law", "electric field", "electric potential",
      "gauss law", "flux", "capacitance", "capacitors", "capacitor", "dielectric", "electric dipole"
    ]
  },
  {
    slug: "current-electricity",
    keywords: [
      "current electricity", "current", "circuits", "kirchhoff laws", "kvl", "kcl",
      "meter bridge", "potentiometer", "drift velocity", "wheatstone bridge", "resistance", "resistivity", "ohms law"
    ]
  },
  {
    slug: "magnetic-effects-and-magnetism",
    keywords: [
      "magnetic effect of current", "magnetic effects", "magnetism", "biot savart", "ampere law",
      "lorentz force", "magnetic field", "dipole", "moving charges", "cyclotron", "magnetic materials", "galvanometer"
    ]
  },
  {
    slug: "emi-and-ac",
    keywords: [
      "electromagnetic induction", "emi", "alternating current", "ac", "faraday law",
      "lenz law", "lcr circuits", "lcr", "transformer", "inductance", "inductor", "resonance ac", "rms voltage"
    ]
  },
  {
    slug: "ray-optics",
    keywords: [
      "ray optics", "geometric optics", "reflection", "refraction", "snell law",
      "lenses", "lens formula", "mirrors", "prisms", "dispersion", "optical instruments", "microscope", "telescope"
    ]
  },
  {
    slug: "wave-optics",
    keywords: [
      "wave optics", "interference", "diffraction", "ydse", "young double slit",
      "polarisation", "polarization", "huygens principle", "fringe width", "coherent sources"
    ]
  },
  {
    slug: "thermodynamics-physics",
    keywords: [
      "thermodynamics", "thermo", "first law of thermo", "second law of thermo", "heat engine",
      "carnot engine", "carnot cycle", "carnot", "entropy", "isothermal", "adiabatic", "isobaric", "isochoric"
    ]
  },
  {
    slug: "kinetic-theory-of-gases",
    keywords: [
      "kinetic theory of gases", "kinetic theory", "ktg", "ideal gas equation", "rms speed",
      "degrees of freedom", "mean free path", "maxwell distribution"
    ]
  },
  {
    slug: "oscillations-shm",
    keywords: [
      "oscillations", "simple harmonic motion", "shm", "spring pendulum", "simple pendulum",
      "damped oscillation", "forced oscillation", "time period shm"
    ]
  },
  {
    slug: "waves-and-sound",
    keywords: [
      "mechanical waves", "sound waves", "wave motion", "doppler effect", "standing waves",
      "beats", "organ pipes", "resonance tube", "speed of sound", "intensity of sound"
    ]
  },
  {
    slug: "atoms-and-nuclei",
    keywords: [
      "atoms and nuclei", "atoms", "nuclei", "bohr model", "rutherford model",
      "radioactivity", "nuclear fission", "nuclear fusion", "mass defect", "binding energy", "half life physics", "alpha decay"
    ]
  },
  {
    slug: "dual-nature-radiation-matter",
    keywords: [
      "dual nature", "dual nature of radiation", "photoelectric effect", "photoelectric",
      "stopping potential", "work function", "de broglie", "matter waves", "davisson germer"
    ]
  },
  {
    slug: "semiconductor-electronics",
    keywords: [
      "semiconductors", "semiconductor", "electronic devices", "pn junction", "diodes",
      "zener diode", "transistors", "logic gates", "led", "photodiode", "solar cell"
    ]
  },
  {
    slug: "units-dimensions-measurement",
    keywords: [
      "units and dimensions", "units dimensions", "dimensional analysis", "vernier caliper",
      "screw gauge", "error analysis", "significant figures", "measurements"
    ]
  },
  {
    slug: "electromagnetic-waves",
    keywords: [
      "electromagnetic waves", "em waves", "emw", "displacement current", "maxwell equations", "poynting vector"
    ]
  },
  {
    slug: "properties-of-solids-and-fluids",
    keywords: [
      "properties of solids", "properties of fluids", "fluids", "fluid mechanics", "elasticity",
      "youngs modulus", "viscosity", "surface tension", "bernoulli", "pascal law", "buoyancy", "poiseuille"
    ]
  },

  // MATHEMATICS
  {
    slug: "integral-calculus",
    keywords: [
      "integral calculus", "integration", "integrals", "integral", "indefinite integration",
      "definite integration", "definite integrals", "properties of definite integrals", "by parts",
      "substitution method", "area under curve", "area under curves", "auc", "leibnitz rule"
    ]
  },
  {
    slug: "differential-calculus",
    keywords: [
      "differential calculus", "limits", "continuity", "differentiability", "lcd", "lhopital",
      "differentiation", "derivatives", "aod", "application of derivatives", "maxima and minima",
      "tangents and normals", "monotonicity", "increasing decreasing", "rolle theorem", "lmvt"
    ]
  },
  {
    slug: "straight-lines-and-circles",
    keywords: [
      "straight lines", "straight line", "circles", "circle", "coordinate geometry",
      "slope", "distance formula", "pair of straight lines", "tangent to circle", "chord of contact", "family of circles"
    ]
  },
  {
    slug: "conic-sections",
    keywords: [
      "conic sections", "conics", "parabola", "ellipse", "hyperbola",
      "eccentricity", "tangents to conics", "normals to conics", "latus rectum", "asymptotes"
    ]
  },
  {
    slug: "matrices-and-determinants",
    keywords: [
      "matrices and determinants", "matrices", "determinants", "matrix", "determinant",
      "cramer rule", "adjoint matrix", "inverse of matrix", "system of linear equations", "eigenvalues"
    ]
  },
  {
    slug: "vector-algebra",
    keywords: [
      "vector algebra", "vectors", "vector", "dot product", "cross product",
      "scalar triple product", "stp", "vector triple product", "vtp", "projection of vector"
    ]
  },
  {
    slug: "three-dimensional-geometry",
    keywords: [
      "three dimensional geometry", "3d geometry", "3d", "planes", "lines in 3d",
      "direction cosines", "direction ratios", "shortest distance between lines", "coplanarity"
    ]
  },
  {
    slug: "complex-numbers-and-quadratics",
    keywords: [
      "complex numbers", "complex number", "quadratic equations", "quadratics",
      "roots of equations", "modulus amplitude", "argand plane", "de moivre", "cube roots of unity", "discriminant"
    ]
  },
  {
    slug: "permutations-and-combinations",
    keywords: [
      "permutations and combinations", "pnc", "p&c", "p and c", "combinations",
      "permutations", "arrangements", "selection", "derangements", "circular permutation"
    ]
  },
  {
    slug: "binomial-theorem",
    keywords: [
      "binomial theorem", "binomial", "binomial coefficients", "general term binomial",
      "middle term", "multinomial theorem"
    ]
  },
  {
    slug: "sequences-and-series",
    keywords: [
      "sequences and series", "sequence and series", "ap", "gp", "hp", "agp",
      "arithmetic progression", "geometric progression", "sum of n terms", "infinite gp", "telescopic series"
    ]
  },
  {
    slug: "trigonometry-and-itf",
    keywords: [
      "trigonometry", "trigo", "inverse trigonometric functions", "itf", "trig equations",
      "compound angles", "multiple angles", "heights and distances", "sine rule", "cosine rule"
    ]
  },
  {
    slug: "probability-and-statistics",
    keywords: [
      "probability", "statistics", "bayes theorem", "conditional probability", "probability distribution",
      "mean median mode", "variance", "standard deviation", "independent events", "bernoulli trials"
    ]
  },
  {
    slug: "differential-equations",
    keywords: [
      "differential equations", "differential equation", "de", "variable separable",
      "homogeneous differential equation", "linear differential equation", "integrating factor", "order and degree"
    ]
  },
  {
    slug: "sets-relations-functions",
    keywords: [
      "sets relations and functions", "sets", "relations", "functions", "domain range",
      "one-one onto", "composite functions", "inverse functions", "equivalence relation"
    ]
  },
  {
    slug: "mathematical-reasoning",
    keywords: [
      "mathematical reasoning", "logic", "tautology", "fallacy", "contrapositive", "converse", "truth table"
    ]
  },

  // CHEMISTRY
  {
    slug: "general-organic-chemistry",
    keywords: [
      "general organic chemistry", "goc", "organic chemistry", "iupac", "iupac nomenclature",
      "isomerism", "structural isomerism", "geometrical isomerism", "optical isomerism", "chirality",
      "inductive effect", "resonance effect", "mesomeric effect", "hyperconjugation", "electrophile", "nucleophile", "carbocation"
    ]
  },
  {
    slug: "chemical-bonding-molecular-structure",
    keywords: [
      "chemical bonding", "chemical bonding and molecular structure", "molecular structure", "vsepr",
      "hybridization", "hybridisation", "mot", "molecular orbital theory", "dipole moment", "hydrogen bonding", "fajans rule", "lattice energy"
    ]
  },
  {
    slug: "equilibrium-chemical-ionic",
    keywords: [
      "equilibrium", "chemical equilibrium", "ionic equilibrium", "ph calculation", "ph",
      "buffer solutions", "buffer", "solubility product", "ksp", "le chatelier", "hydrolysis of salts", "ostwald dilution"
    ]
  },
  {
    slug: "chemical-thermodynamics",
    keywords: [
      "chemical thermodynamics", "chem thermo", "enthalpy", "entropy chem", "gibbs free energy",
      "hess law", "spontaneity", "thermochemistry", "bond enthalpy"
    ]
  },
  {
    slug: "redox-and-electrochemistry",
    keywords: [
      "electrochemistry", "redox reactions", "redox", "nernst equation", "galvanic cell",
      "kohlrausch law", "faraday laws of electrolysis", "standard electrode potential", "electrochemical cell", "conductance"
    ]
  },
  {
    slug: "hydrocarbons",
    keywords: [
      "hydrocarbons", "alkanes", "alkenes", "alkynes", "aromatic hydrocarbons", "benzene",
      "ozonolysis", "markovnikov", "wurtz reaction", "friedel crafts", "electrophilic aromatic substitution"
    ]
  },
  {
    slug: "haloalkanes-and-haloarenes",
    keywords: [
      "haloalkanes and haloarenes", "haloalkanes", "haloarenes", "alkyl halides",
      "sn1", "sn2", "e1", "e2", "elimination reaction", "grignard reagent preparation", "wurtz fittig"
    ]
  },
  {
    slug: "coordination-compounds",
    keywords: [
      "coordination compounds", "coordination chemistry", "coordination", "complex compounds",
      "crystal field theory", "cft", "valence bond theory chem", "vbt", "ligands", "isomerism in coordination", "iupac coordination", "chelation"
    ]
  },
  {
    slug: "chemical-kinetics",
    keywords: [
      "chemical kinetics", "kinetics", "rate of reaction", "order of reaction",
      "first order reaction", "arrhenius equation", "half life chem", "activation energy", "collision theory"
    ]
  },
  {
    slug: "aldehydes-ketones-carboxylic-acids",
    keywords: [
      "aldehydes ketones and carboxylic acids", "aldehydes", "ketones", "carboxylic acids", "carbonyl compounds",
      "aldol condensation", "cannizzaro", "clemmensen reduction", "wolff kishner", "tollens test", "fehling test", "hell volhard zelinsky"
    ]
  },
  {
    slug: "alcohols-phenols-ethers",
    keywords: [
      "alcohols phenols and ethers", "alcohols", "phenols", "ethers", "reimer tiemann",
      "kolbe reaction", "williamson ether synthesis", "lucas test", "esterification"
    ]
  },
  {
    slug: "amines-diazonium-salts",
    keywords: [
      "amines", "diazonium salts", "hoffmann bromamide", "gabriel phthalimide",
      "carbylamine test", "hinsberg test", "sandmeyer reaction"
    ]
  },
  {
    slug: "mole-concept-stoichiometry",
    keywords: [
      "mole concept", "stoichiometry", "some basic concepts of chemistry", "molarity", "molality",
      "normality", "limiting reagent", "empirical formula"
    ]
  },
  {
    slug: "atomic-structure",
    keywords: [
      "atomic structure", "structure of atom", "quantum numbers", "bohr model chem",
      "heisenberg uncertainty", "de broglie chem", "photoelectric chem", "hunds rule", "pauli exclusion", "aufbau"
    ]
  },
  {
    slug: "periodic-table-periodicity",
    keywords: [
      "periodic table", "periodicity", "classification of elements", "ionization enthalpy",
      "electron gain enthalpy", "electronegativity", "atomic radii", "screening effect"
    ]
  },
  {
    slug: "p-block-elements",
    keywords: [
      "p block elements", "p block", "group 13", "group 14", "group 15", "group 16", "group 17", "group 18",
      "boron family", "carbon family", "nitrogen family", "oxygen family", "halogens", "noble gases"
    ]
  },
  {
    slug: "d-and-f-block-elements",
    keywords: [
      "d and f block elements", "d and f block", "d block", "f block", "transition elements",
      "lanthanides", "actinides", "potassium permanganate", "potassium dichromate"
    ]
  },
  {
    slug: "solutions-chemistry",
    keywords: [
      "solutions", "colligative properties", "raoult law", "van t hoff factor",
      "osmotic pressure", "elevation in boiling point", "depression in freezing point", "henry law"
    ]
  },
  {
    slug: "biomolecules",
    keywords: [
      "biomolecules", "carbohydrates", "glucose", "fructose", "amino acids",
      "proteins", "peptide bond", "nucleic acids", "dna rna", "vitamins"
    ]
  },

  // BIOLOGY
  {
    slug: "living-world-and-classification",
    keywords: [
      "living world", "biological classification", "taxonomic hierarchy", "binomial nomenclature",
      "monera", "protista", "fungi", "eubacteria", "archaebacteria", "protozoa", "viruses", "viroids", "prions", "lichens"
    ]
  },
  {
    slug: "plant-kingdom",
    keywords: [
      "plant kingdom", "algae", "bryophytes", "pteridophytes", "gymnosperms", "angiosperms",
      "chlorophyceae", "phaeophyceae", "rhodophyceae", "prothallus", "alternation of generations"
    ]
  },
  {
    slug: "animal-kingdom",
    keywords: [
      "animal kingdom", "porifera", "coelenterata", "cnidaria", "ctenophora", "platyhelminthes",
      "aschelminthes", "annelida", "arthropoda", "mollusca", "echinodermata", "hemichordata", "chordata", "vertebrates"
    ]
  },
  {
    slug: "morphology-flowering-plants",
    keywords: [
      "morphology of flowering plants", "morphology plants", "root modifications", "stem modifications",
      "phyllotaxy", "inflorescence", "aestivation", "placentation", "solanaceae", "fabaceae", "liliaceae"
    ]
  },
  {
    slug: "anatomy-flowering-plants",
    keywords: [
      "anatomy of flowering plants", "plant anatomy", "meristematic tissue", "xylem", "phloem",
      "dicot root", "monocot root", "dicot stem", "monocot stem", "secondary growth", "vascular cambium", "cork cambium"
    ]
  },
  {
    slug: "structural-organisation-animals",
    keywords: [
      "structural organisation in animals", "animal tissues", "epithelial tissue", "connective tissue",
      "muscular tissue", "frog anatomy", "cockroach anatomy"
    ]
  },
  {
    slug: "cell-the-unit-of-life",
    keywords: [
      "cell the unit of life", "cell biology", "prokaryotic cell", "eukaryotic cell", "fluid mosaic model",
      "plasma membrane", "endoplasmic reticulum", "golgi apparatus", "lysosomes", "mitochondria", "chloroplast", "ribosomes", "nucleus"
    ]
  },
  {
    slug: "biomolecules-bio",
    keywords: [
      "biomolecules bio", "primary metabolites", "secondary metabolites", "enzymes biology",
      "co-factors", "activation energy biology", "polysaccharides bio"
    ]
  },
  {
    slug: "cell-cycle-and-cell-division",
    keywords: [
      "cell cycle and cell division", "cell cycle", "cell division", "mitosis", "meiosis",
      "interphase", "prophase", "metaphase", "anaphase", "telophase", "crossing over", "pachytene", "chiasmata"
    ]
  },
  {
    slug: "photosynthesis",
    keywords: [
      "photosynthesis", "photosynthesis in higher plants", "light reaction", "dark reaction", "calvin cycle",
      "c3 pathway", "c4 pathway", "kranz anatomy", "photorespiration", "z scheme", "photophosphorylation", "rubisco"
    ]
  },
  {
    slug: "respiration-in-plants",
    keywords: [
      "respiration in plants", "plant respiration", "glycolysis", "emp pathway", "krebs cycle",
      "tca cycle", "ets", "oxidative phosphorylation", "fermentation bio", "respiratory quotient", "rq"
    ]
  },
  {
    slug: "plant-growth-development",
    keywords: [
      "plant growth and development", "plant growth", "phytohormones", "auxin", "gibberellin",
      "cytokinin", "ethylene", "abscisic acid", "aba", "photoperiodism", "vernalization"
    ]
  },
  {
    slug: "breathing-exchange-gases",
    keywords: [
      "breathing and exchange of gases", "breathing", "respiration human", "respiratory volumes",
      "tidal volume", "vital capacity", "gas transport", "oxygen dissociation curve", "bohr effect", "emphysema", "asthma"
    ]
  },
  {
    slug: "body-fluids-circulation",
    keywords: [
      "body fluids and circulation", "body fluids", "blood circulation", "blood groups", "abo grouping",
      "rh factor", "cardiac cycle", "ecg", "double circulation", "pacemaker", "sa node", "heart sounds"
    ]
  },
  {
    slug: "excretory-products-elimination",
    keywords: [
      "excretory products and their elimination", "excretion", "human excretory system", "nephron",
      "glomerular filtration", "gfr", "counter current mechanism", "raas", "renin", "micturition", "dialysis"
    ]
  },
  {
    slug: "locomotion-and-movement",
    keywords: [
      "locomotion and movement", "locomotion", "muscle contraction", "sliding filament theory",
      "sarcomere", "actin myosin", "skeletal system", "joints", "synovial joints", "arthritis"
    ]
  },
  {
    slug: "neural-control-coordination",
    keywords: [
      "neural control and coordination", "neural control", "neuron", "nerve impulse", "action potential",
      "synapse", "cns", "brain human", "forebrain", "reflex arc", "eye structure", "ear structure"
    ]
  },
  {
    slug: "chemical-coordination-integration",
    keywords: [
      "chemical coordination and integration", "endocrine system", "hormones", "pituitary gland",
      "thyroid gland", "adrenal gland", "pancreas insulin", "parathyroid", "hormone action mechanism"
    ]
  },
  {
    slug: "sexual-reproduction-flowering-plants",
    keywords: [
      "sexual reproduction in flowering plants", "flowering plants reproduction", "microsporogenesis",
      "megasporogenesis", "embryo sac", "pollination", "double fertilization", "triple fusion", "apomixis"
    ]
  },
  {
    slug: "human-reproduction",
    keywords: [
      "human reproduction", "male reproductive system", "female reproductive system", "spermatogenesis",
      "oogenesis", "menstrual cycle", "fertilization human", "blastocyst", "implantation", "placenta", "parturition"
    ]
  },
  {
    slug: "reproductive-health",
    keywords: [
      "reproductive health", "contraception", "birth control", "iud", "saheli", "mtp",
      "stis", "infertility", "art", "ivf", "zift", "gift", "icsi", "amniocentesis"
    ]
  },
  {
    slug: "principles-of-inheritance",
    keywords: [
      "principles of inheritance and variation", "genetics", "mendel laws", "monohybrid cross",
      "dihybrid cross", "incomplete dominance", "codominance", "linkage recombination", "pedigree analysis",
      "sex determination", "haemophilia", "sickle cell anaemia", "down syndrome", "turner syndrome"
    ]
  },
  {
    slug: "molecular-basis-of-inheritance",
    keywords: [
      "molecular basis of inheritance", "molecular genetics", "dna structure", "dna replication",
      "transcription", "genetic code", "translation protein synthesis", "lac operon", "human genome project", "hgp", "dna fingerprinting"
    ]
  },
  {
    slug: "evolution-bio",
    keywords: [
      "evolution biology", "origin of life", "miller urey experiment", "homologous organs",
      "analogous organs", "adaptive radiation", "darwinism", "hardy weinberg principle", "human evolution", "natural selection"
    ]
  },
  {
    slug: "human-health-disease",
    keywords: [
      "human health and disease", "human health", "immunity", "innate immunity", "acquired immunity",
      "antibodies", "aids", "hiv", "cancer oncology", "malaria", "typhoid", "vaccines", "drug abuse"
    ]
  },
  {
    slug: "microbes-human-welfare",
    keywords: [
      "microbes in human welfare", "microbes", "fermentation industrial", "antibiotics",
      "sewage treatment", "biogas", "methanogens", "biocontrol agents", "biofertilizers", "bt"
    ]
  },
  {
    slug: "biotechnology-principles",
    keywords: [
      "biotechnology principles and processes", "biotechnology", "recombinant dna", "restriction enzymes",
      "cloning vectors", "pbr322", "gel electrophoresis", "pcr", "polymerase chain reaction", "bioreactors"
    ]
  },
  {
    slug: "biotechnology-applications",
    keywords: [
      "biotechnology and its applications", "biotech applications", "bt cotton", "rnai",
      "rna interference", "genetically engineered insulin", "gene therapy", "transgenic animals", "biopiracy"
    ]
  },
  {
    slug: "organisms-and-populations",
    keywords: [
      "organisms and populations", "ecology", "adaptations", "population growth",
      "exponential growth", "logistic growth", "mutualism", "commensalism", "parasitism", "predation", "competition ecology"
    ]
  },
  {
    slug: "ecosystem",
    keywords: [
      "ecosystem", "ecological pyramids", "productivity ecology", "decomposition",
      "food chain", "food web", "trophic levels", "energy flow 10 percent", "nutrient cycling", "carbon cycle"
    ]
  },
  {
    slug: "biodiversity-conservation",
    keywords: [
      "biodiversity and conservation", "biodiversity", "species area relationship", "evil quartet",
      "in situ conservation", "ex situ conservation", "national parks", "biosphere reserves", "biodiversity hotspots", "red data book"
    ]
  }
];

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
  const lower = text.toLowerCase().replace(/['".,\/#!$%\^&\*;:{}=\-_`~()]/g, " ");

  // 1. Chapter Detection (Scoring Algorithm across DB chapters + Keyword Index)
  let bestChapter: ChapterCatalogItem | null = null;
  let bestScore = 0;

  // Build lookup map by slug
  const chapterBySlug = new Map<string, ChapterCatalogItem>();
  for (const ch of allChapters) {
    chapterBySlug.set(ch.slug, ch);
    // Also index normalized name
    chapterBySlug.set(ch.name.toLowerCase().replace(/[^a-z0-9]/g, ""), ch);
  }

  // A. Check against TOPIC_KEYWORD_MAP
  for (const topic of TOPIC_KEYWORD_MAP) {
    const targetChapter = chapterBySlug.get(topic.slug);
    if (!targetChapter) continue;

    for (const kw of topic.keywords) {
      const cleanKw = kw.toLowerCase();
      // Match word boundary or exact phrase
      if (lower.includes(cleanKw)) {
        // Score based on keyword specificity (longer phrase = much higher score)
        const score = cleanKw.length * 2 + (cleanKw.split(" ").length * 5);
        if (score > bestScore) {
          bestScore = score;
          bestChapter = targetChapter;
        }
      }
    }
  }

  // B. Check direct DB chapter names and words
  for (const ch of allChapters) {
    const cleanName = ch.name.toLowerCase();
    if (lower.includes(cleanName)) {
      const score = cleanName.length * 3;
      if (score > bestScore) {
        bestScore = score;
        bestChapter = ch;
      }
    } else {
      // Check significant words in chapter name
      const words = cleanName.split(/\s+/).filter((w) => w.length > 3 && !["and", "the", "for", "with", "class"].includes(w));
      for (const w of words) {
        if (lower.includes(w)) {
          const score = w.length * 1.5;
          if (score > bestScore) {
            bestScore = score;
            bestChapter = ch;
          }
        }
      }
    }
  }

  // If still no chapter found, fallback to first chapter but with low confidence
  const activeChapter = bestChapter || allChapters[0];

  // 2. Duration Detection (e.g. "2 hours", "1.5h", "45 mins", "90 minutes", "1 hr 30 mins")
  let durationMinutes = 45; // default fallback

  const hourMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|hr|h)\b/i);
  const minMatch = text.match(/(\d+)\s*(?:minutes?|mins?|min|m)\b/i);
  const combinedMatch = text.match(/(\d+)\s*(?:hours?|hrs?|hr|h)\s*(?:and)?\s*(\d+)\s*(?:minutes?|mins?|min|m)?\b/i);

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

  const qMatch = text.match(/(\d+)\s*(?:questions?|pyqs?|mcqs?|qs?|problems?|numerical)\b/i);
  if (qMatch) {
    totalQuestions = parseInt(qMatch[1]) || 0;
  }

  // Check detailed breakdown
  const correctMatch = text.match(/(\d+)\s*(?:correct|right|independent|indep|done right)\b/i);
  const assistMatch = text.match(/(\d+)\s*(?:assisted|hints?|with help|solutions?)\b/i);
  const wrongMatch = text.match(/(\d+)\s*(?:wrong|incorrect|mistakes?|lost)\b/i);
  const fractionMatch = text.match(/(\d+)\s*\/\s*(\d+)/);

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

  if (/\b(?:lecture|class|video|watched|session|coaching lecture)\b/i.test(text)) {
    activityType = "LECTURE";
  } else if (/\b(?:revis(?:ed|ion)|formula|active recall|forgotten|cheat sheet)\b/i.test(text)) {
    activityType = "REVISION";
  } else if (totalQuestions > 0 || /\b(?:pyq|mcq|solve|practic(?:e|ed)|questions?)\b/i.test(text)) {
    activityType = "MCQ";
  } else if (/\b(?:read|notes|theory|concept|ncert|module read)\b/i.test(text)) {
    activityType = "THEORY";
  }

  // 5. Source Detection
  let source = "JEE_MAIN_PYQ";
  if (/\b(?:adv|advanced|jee advanced)\b/i.test(text)) {
    source = "JEE_ADV_PYQ";
  } else if (/\b(?:hcv|h\.c\. verma|hc verma)\b/i.test(text)) {
    source = "HCV";
  } else if (/\b(?:cengage|bm sharma|tewani)\b/i.test(text)) {
    source = "CENGAGE_MODULE";
  } else if (/\b(?:allen|resonance|fiitjee|coaching|module|ms chouhan)\b/i.test(text)) {
    source = "CENGAGE_MODULE";
  } else if (/\b(?:irodov|krotov|pathfinder)\b/i.test(text)) {
    source = "JEE_ADV_PYQ";
  }

  const confidence = bestChapter ? 98 : 40;

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
