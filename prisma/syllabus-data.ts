export interface TopicData {
  name: string;
}

export interface ChapterData {
  name: string;
  slug: string;
  classLevel: number;
  historicalPriority: number; // 0-100 score
  estimatedHours: number; // Average required hours
  hoursRange: string; // e.g. "18–22 Hours"
  defaultQuestionTarget: number;
  defaultPYQTarget: number;
  prerequisiteSlugs?: string[];
  topics: string[];
}

export interface SubjectData {
  name: string;
  shortName: string;
  displayOrder: number;
  color: string;
  chapters: ChapterData[];
}

export const SYLLABUS_DATA: SubjectData[] = [
  // 1. PHYSICS (21 Chapters — 251 Total Mastery Hours)
  {
    name: "Physics",
    shortName: "PHY",
    displayOrder: 1,
    color: "#3b82f6",
    chapters: [
      {
        name: "Rotational Motion",
        slug: "rotational-motion",
        classLevel: 11,
        historicalPriority: 96,
        estimatedHours: 20,
        hoursRange: "18–22 Hours",
        defaultQuestionTarget: 160,
        defaultPYQTarget: 80,
        topics: [
          "Torque and Couple",
          "Moment of Inertia and Radius of Gyration",
          "Parallel and Perpendicular Axes Theorems",
          "Angular Momentum and Conservation of Angular Momentum",
          "Pure Rolling Motion dynamics",
          "Work, Energy and Power in Rotational Motion",
          "Rolling on an Inclined Plane"
        ]
      },
      {
        name: "Electrostatics",
        slug: "electrostatics",
        classLevel: 12,
        historicalPriority: 95,
        estimatedHours: 18,
        hoursRange: "16–20 Hours",
        defaultQuestionTarget: 150,
        defaultPYQTarget: 75,
        topics: [
          "Coulomb's Law and Superposition Principle",
          "Electric Field and Electric Dipole",
          "Gauss's Law and Flux Applications",
          "Electric Potential and Potential Energy",
          "Capacitance, Dielectrics and Capacitor Combinations",
          "Energy Stored in Capacitor and Van de Graaff Generator"
        ]
      },
      {
        name: "Current Electricity",
        slug: "current-electricity",
        classLevel: 12,
        historicalPriority: 94,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Electric Current, Drift Velocity and Mobility",
          "Ohm's Law, Resistance and Temperature Dependence",
          "Resistor Combinations and Color Coding",
          "Kirchhoff's Rules and Applications",
          "Wheatstone Bridge and Meter Bridge",
          "Potentiometer and EMF Comparison"
        ]
      },
      {
        name: "Magnetic Effect of Current & Magnetism",
        slug: "magnetic-effects-and-magnetism",
        classLevel: 12,
        historicalPriority: 93,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Biot-Savart Law and Magnetic Field Calculations",
          "Ampere's Circuital Law and Applications (Solenoid, Toroid)",
          "Lorentz Force on Moving Charges and Cyclotron",
          "Force on Current-Carrying Conductor & Torque on Magnetic Dipole",
          "Moving Coil Galvanometer and Shunts",
          "Magnetic Materials: Dia, Para and Ferromagnetism",
          "Earth's Magnetism and Magnetic Elements"
        ]
      },
      {
        name: "Electromagnetic Induction & AC",
        slug: "emi-and-ac",
        classLevel: 12,
        historicalPriority: 92,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Magnetic Flux and Faraday's Laws of Induction",
          "Lenz's Law, Conservation of Energy and Eddy Currents",
          "Motional EMF and Induced Electric Fields",
          "Self Inductance and Mutual Inductance",
          "Alternating Currents, RMS and Peak Values",
          "LCR Series Circuit, Phasors and Impedance",
          "Resonance, Q-Factor, Power in AC Circuits and Transformers"
        ]
      },
      {
        name: "Laws of Motion (NLM)",
        slug: "laws-of-motion",
        classLevel: 11,
        historicalPriority: 91,
        estimatedHours: 13,
        hoursRange: "12–14 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Newton's First, Second and Third Laws",
          "Free Body Diagrams and Equilibrium",
          "Constraint Relations and Pulley-Block Systems",
          "Static and Kinetic Friction",
          "Circular Motion Dynamics and Banking of Roads",
          "Pseudo Forces in Non-Inertial Frames"
        ]
      },
      {
        name: "Kinematics (1D & 2D)",
        slug: "kinematics",
        classLevel: 11,
        historicalPriority: 90,
        estimatedHours: 13,
        hoursRange: "12–14 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Motion in a Straight Line and Calculus Relations",
          "Graphs (s-t, v-t, a-t) and Motion under Gravity",
          "Relative Velocity in 1D and 2D",
          "Projectile Motion on Horizontal Ground",
          "Projectile Motion on Inclined Plane",
          "Uniform and Non-Uniform Circular Motion Kinematics"
        ]
      },
      {
        name: "Work, Energy & Power",
        slug: "work-energy-power",
        classLevel: 11,
        historicalPriority: 89,
        estimatedHours: 13,
        hoursRange: "12–14 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Work Done by Constant and Variable Forces",
          "Kinetic Energy and Work-Energy Theorem",
          "Conservative and Non-Conservative Forces",
          "Potential Energy Curves and Stable Equilibrium",
          "Vertical Circular Motion",
          "Power and Collisions (1D & 2D Elastic/Inelastic)"
        ]
      },
      {
        name: "Ray Optics & Optical Instruments",
        slug: "ray-optics",
        classLevel: 12,
        historicalPriority: 90,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Reflection at Plane and Spherical Mirrors",
          "Refraction at Plane Surfaces and Total Internal Reflection",
          "Refraction at Spherical Surfaces and Lens Maker's Formula",
          "Thin Lenses in Contact and Lens Combinations",
          "Prism Theory and Dispersion of Light",
          "Optical Instruments: Compound Microscope and Telescope"
        ]
      },
      {
        name: "Gravitation",
        slug: "gravitation",
        classLevel: 11,
        historicalPriority: 86,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Newton's Universal Law of Gravitation",
          "Acceleration due to Gravity variations (Altitude, Depth, Rotation)",
          "Gravitational Potential and Potential Energy",
          "Escape Velocity and Orbital Velocity",
          "Kepler's Laws of Planetary Motion",
          "Geostationary and Polar Satellites"
        ]
      },
      {
        name: "Properties of Solids & Fluids",
        slug: "properties-of-solids-and-fluids",
        classLevel: 11,
        historicalPriority: 85,
        estimatedHours: 13,
        hoursRange: "12–14 Hours",
        defaultQuestionTarget: 110,
        defaultPYQTarget: 55,
        topics: [
          "Stress-Strain Curve and Hooke's Law",
          "Young's, Bulk and Shear Modulus",
          "Hydrostatic Pressure and Pascal's Law",
          "Archimedes' Principle and Buoyancy",
          "Equation of Continuity and Bernoulli's Theorem",
          "Viscosity, Poiseuille's Formula and Stokes' Law",
          "Surface Tension, Angle of Contact and Capillarity"
        ]
      },
      {
        name: "Thermodynamics",
        slug: "thermodynamics-physics",
        classLevel: 11,
        historicalPriority: 88,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Thermal Equilibrium and Zeroth Law of Thermodynamics",
          "First Law of Thermodynamics and Internal Energy",
          "Isothermal, Adiabatic, Isochoric and Isobaric Processes",
          "Work Done in Thermodynamic Cycles and Indicator Diagrams",
          "Second Law of Thermodynamics and Reversible Processes",
          "Carnot Engine Efficiency and Refrigerators"
        ]
      },
      {
        name: "Kinetic Theory of Gases (KTG)",
        slug: "kinetic-theory-of-gases",
        classLevel: 11,
        historicalPriority: 84,
        estimatedHours: 9,
        hoursRange: "8–10 Hours",
        defaultQuestionTarget: 80,
        defaultPYQTarget: 40,
        topics: [
          "Molecular Nature of Matter and Ideal Gas Laws",
          "Kinetic Interpretation of Pressure and Temperature",
          "RMS, Average and Most Probable Speeds",
          "Degrees of Freedom and Law of Equipartition of Energy",
          "Specific Heat Capacities (Cp, Cv) and Mean Free Path"
        ]
      },
      {
        name: "Oscillations (SHM)",
        slug: "oscillations-shm",
        classLevel: 11,
        historicalPriority: 86,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Simple Harmonic Motion Equation and Phase",
          "Velocity, Acceleration and Energy in SHM",
          "Spring-Mass Systems and Series/Parallel Combinations",
          "Simple Pendulum and Physical Pendulum",
          "Damped Oscillations and Forced Oscillations / Resonance"
        ]
      },
      {
        name: "Mechanical Waves & Sound",
        slug: "waves-and-sound",
        classLevel: 11,
        historicalPriority: 85,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Wave Motion, Longitudinal and Transverse Waves",
          "Speed of Transverse and Sound Waves (Laplace Correction)",
          "Superposition Principle and Interference of Waves",
          "Standing Waves in Strings and Organ Pipes (Harmonics/Overtones)",
          "Beats Phenomenon and Doppler Effect in Sound"
        ]
      },
      {
        name: "Wave Optics",
        slug: "wave-optics",
        classLevel: 12,
        historicalPriority: 87,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Huygens' Principle and Wavefront Construction",
          "Interference of Light and Young's Double Slit Experiment (YDSE)",
          "Fringe Width and Optical Path Difference",
          "Diffraction at a Single Slit and Resolving Power",
          "Polarization, Brewster's Law and Malus's Law"
        ]
      },
      {
        name: "Atoms & Nuclei",
        slug: "atoms-and-nuclei",
        classLevel: 12,
        historicalPriority: 87,
        estimatedHours: 9,
        hoursRange: "8–10 Hours",
        defaultQuestionTarget: 90,
        defaultPYQTarget: 45,
        topics: [
          "Rutherford Scattering and Bohr's Atomic Model",
          "Hydrogen Energy Levels and Spectral Series",
          "Composition and Size of Nucleus",
          "Mass Defect, Binding Energy and Binding Energy per Nucleon",
          "Nuclear Fission, Nuclear Fusion and Radioactivity Decay Laws"
        ]
      },
      {
        name: "Dual Nature of Radiation & Matter",
        slug: "dual-nature-radiation-matter",
        classLevel: 12,
        historicalPriority: 86,
        estimatedHours: 7,
        hoursRange: "6–8 Hours",
        defaultQuestionTarget: 80,
        defaultPYQTarget: 40,
        topics: [
          "Photoelectric Effect and Hertz-Lenard Observations",
          "Einstein's Photoelectric Equation and Cut-off Potential",
          "Photon Properties and Momentum",
          "de Broglie Hypothesis and Matter Waves",
          "Davisson-Germer Experiment Significance"
        ]
      },
      {
        name: "Semiconductor Electronics",
        slug: "semiconductor-electronics",
        classLevel: 12,
        historicalPriority: 88,
        estimatedHours: 9,
        hoursRange: "8–10 Hours",
        defaultQuestionTarget: 90,
        defaultPYQTarget: 45,
        topics: [
          "Energy Bands in Solids (Conductors, Insulators, Semiconductors)",
          "Intrinsic and Extrinsic Semiconductors (P-type, N-type)",
          "P-N Junction Diode Characteristics (Forward and Reverse Bias)",
          "Diode as a Rectifier (Half-wave & Full-wave)",
          "Zener Diode as Voltage Regulator and LEDs",
          "Logic Gates (AND, OR, NOT, NAND, NOR, XOR)"
        ]
      },
      {
        name: "Units, Dimensions & Measurement",
        slug: "units-dimensions-measurement",
        classLevel: 11,
        historicalPriority: 82,
        estimatedHours: 7,
        hoursRange: "6–8 Hours",
        defaultQuestionTarget: 75,
        defaultPYQTarget: 40,
        topics: [
          "SI Fundamental and Derived Units",
          "Significant Figures and Rounding Off Rules",
          "Error Analysis: Absolute, Relative and Percentage Errors",
          "Error Propagation in Mathematical Operations",
          "Dimensional Analysis and Applications",
          "Measuring Instruments: Vernier Calipers and Screw Gauge"
        ]
      },
      {
        name: "Electromagnetic Waves",
        slug: "electromagnetic-waves",
        classLevel: 12,
        historicalPriority: 80,
        estimatedHours: 5,
        hoursRange: "4–6 Hours",
        defaultQuestionTarget: 50,
        defaultPYQTarget: 30,
        topics: [
          "Displacement Current and Maxwell's Modification",
          "Electromagnetic Wave Nature and Transverse Character",
          "Energy Density, Intensity and Momentum of EM Waves",
          "Electromagnetic Spectrum (Radio, Micro, IR, Visible, UV, X-ray, Gamma)"
        ]
      }
    ]
  },

  // 2. CHEMISTRY (25 Chapters — 279 Total Mastery Hours)
  {
    name: "Chemistry",
    shortName: "CHE",
    displayOrder: 2,
    color: "#10b981",
    chapters: [
      {
        name: "General Organic Chemistry (GOC)",
        slug: "general-organic-chemistry",
        classLevel: 11,
        historicalPriority: 98,
        estimatedHours: 20,
        hoursRange: "18–22 Hours",
        defaultQuestionTarget: 170,
        defaultPYQTarget: 85,
        topics: [
          "Inductive Effect and Applications",
          "Resonance, Mesomeric Effect and Resonance Energy",
          "Hyperconjugation and Baker-Nathan Effect",
          "Carbocation, Carbanion and Free Radical Stability",
          "Acidic and Basic Strength Comparisons",
          "Electrophiles, Nucleophiles and Reaction Intermediates",
          "Isomerism: Structural, Geometrical and Optical"
        ]
      },
      {
        name: "Aldehydes, Ketones & Carboxylic Acids",
        slug: "aldehydes-ketones-carboxylic-acids",
        classLevel: 12,
        historicalPriority: 95,
        estimatedHours: 18,
        hoursRange: "16–20 Hours",
        defaultQuestionTarget: 150,
        defaultPYQTarget: 75,
        topics: [
          "Nomenclature and Structure of Carbonyl Group",
          "Preparation of Aldehydes and Ketones",
          "Nucleophilic Addition Reactions and Mechanisms",
          "Aldol Condensation and Cross-Aldol Reaction",
          "Cannizzaro Reaction and Haloform Test",
          "Carboxylic Acids Preparation and Acidity",
          "Hell-Volhard-Zelinsky (HVZ) Reaction"
        ]
      },
      {
        name: "Equilibrium (Chemical & Ionic)",
        slug: "equilibrium-chemical-ionic",
        classLevel: 11,
        historicalPriority: 94,
        estimatedHours: 18,
        hoursRange: "16–20 Hours",
        defaultQuestionTarget: 150,
        defaultPYQTarget: 75,
        topics: [
          "Law of Mass Action, Kp and Kc relations",
          "Le Chatelier's Principle and Factors Affecting Equilibrium",
          "Ostwald's Dilution Law and Degree of Dissociation",
          "pH Calculations of Strong and Weak Acids/Bases",
          "Salt Hydrolysis and Hydrolysis Constant",
          "Buffer Solutions and Henderson-Hasselbalch Equation",
          "Solubility Product (Ksp) and Common Ion Effect"
        ]
      },
      {
        name: "Chemical Bonding & Molecular Structure",
        slug: "chemical-bonding-molecular-structure",
        classLevel: 11,
        historicalPriority: 96,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 140,
        defaultPYQTarget: 70,
        topics: [
          "Ionic and Covalent Bonds, Fajan's Rules",
          "VSEPR Theory and Molecular Geometry",
          "Valence Bond Theory and Hybridization (sp, sp2, sp3, sp3d, sp3d2)",
          "Molecular Orbital Theory (MOT) and Bond Order",
          "Dipole Moment and Percentage Ionic Character",
          "Hydrogen Bonding (Intermolecular and Intramolecular)"
        ]
      },
      {
        name: "Redox Reactions & Electrochemistry",
        slug: "redox-and-electrochemistry",
        classLevel: 12,
        historicalPriority: 93,
        estimatedHours: 16,
        hoursRange: "14–18 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Oxidation Number and Balancing Redox Reactions (Ion-Electron)",
          "Galvanic Cells and Standard Electrode Potentials",
          "Nernst Equation and Equilibrium Constant",
          "Kohlrausch's Law and Molar Conductivity",
          "Faraday's Laws of Electrolysis",
          "Batteries, Fuel Cells and Corrosion"
        ]
      },
      {
        name: "Hydrocarbons",
        slug: "hydrocarbons",
        classLevel: 11,
        historicalPriority: 91,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Alkanes: Free Radical Halogenation and Wurtz Reaction",
          "Alkenes: Preparation, Electrophilic Addition (Markovnikov/Anti-Markovnikov)",
          "Ozonolysis, Hydroboration-Oxidation and Polymerization",
          "Alkynes: Acidity of Terminal Alkynes and Addition Reactions",
          "Aromatic Hydrocarbons: Benzene Structure and Aromaticity (Huckel's Rule)",
          "Electrophilic Aromatic Substitution (Nitration, Sulphonation, Friedel-Crafts)"
        ]
      },
      {
        name: "Haloalkanes & Haloarenes",
        slug: "haloalkanes-and-haloarenes",
        classLevel: 12,
        historicalPriority: 89,
        estimatedHours: 13,
        hoursRange: "12–14 Hours",
        defaultQuestionTarget: 110,
        defaultPYQTarget: 55,
        topics: [
          "Nomenclature and C-X Bond Nature",
          "SN1 and SN2 Mechanisms, Stereochemistry and Walden Inversion",
          "Elimination Reactions (E1, E2) and Saytzeff's Rule",
          "Grignard Reagents and Organometallic Reactions",
          "Nucleophilic Substitution in Haloarenes and Dow Process",
          "Electrophilic Substitution Reactions of Haloarenes"
        ]
      },
      {
        name: "Coordination Compounds",
        slug: "coordination-compounds",
        classLevel: 12,
        historicalPriority: 93,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Werner's Theory and IUPAC Nomenclature of Complex Compounds",
          "Isomerism: Structural and Stereoisomerism (Geometrical, Optical)",
          "Valence Bond Theory (Inner and Outer Orbital Complexes)",
          "Crystal Field Theory (CFT) and Crystal Field Splitting Energy (CFSE)",
          "Magnetic Properties and Color in Coordination Complexes",
          "Stability of Complexes and Organometallic Carbonyls"
        ]
      },
      {
        name: "Chemical Kinetics",
        slug: "chemical-kinetics",
        classLevel: 12,
        historicalPriority: 90,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Rate of Reaction: Average and Instantaneous",
          "Order and Molecularity of Reaction",
          "Integrated Rate Equations for Zero, First and nth Order Reactions",
          "Half-Life (t1/2) and Pseudo First Order Reactions",
          "Arrhenius Equation and Activation Energy",
          "Collision Theory and Catalyst Effects"
        ]
      },
      {
        name: "Chemical Thermodynamics",
        slug: "chemical-thermodynamics",
        classLevel: 11,
        historicalPriority: 91,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Concepts of System, Surroundings, State Functions and Extensive/Intensive Variables",
          "First Law of Thermodynamics, Enthalpy (H) and Heat Capacity (Cp, Cv)",
          "Thermochemistry: Hess's Law, Enthalpy of Formation, Combustion, Bond Enthalpy",
          "Second Law: Entropy (S) and Spontaneity",
          "Gibbs Free Energy (ΔG) and Equilibrium Constant Relation",
          "Third Law of Thermodynamics"
        ]
      },
      {
        name: "Mole Concept & Stoichiometry",
        slug: "mole-concept-stoichiometry",
        classLevel: 11,
        historicalPriority: 88,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Atomic Mass, Molecular Mass and Mole Concept",
          "Percentage Composition and Empirical/Molecular Formula",
          "Concentration Terms: Molarity, Molality, Normality, Mole Fraction, ppm",
          "Stoichiometry, Limiting Reagent and Percentage Yield",
          "Volumetric Analysis and Titrations"
        ]
      },
      {
        name: "p-Block Elements (Class 11 & 12)",
        slug: "p-block-elements",
        classLevel: 12,
        historicalPriority: 89,
        estimatedHours: 14,
        hoursRange: "12–16 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Group 13 & 14 (Boron, Carbon families) Trends and Anomalies",
          "Group 15 (Nitrogen family): Allotropes, Oxides, Nitric Acid, Phosphine",
          "Group 16 (Oxygen family): Ozone, Allotropes of Sulphur, Sulphuric Acid",
          "Group 17 (Halogens): Interhalogen Compounds and Oxoacids",
          "Group 18 (Noble Gases): Xenon Fluorides and Oxides structures"
        ]
      },
      {
        name: "Alcohols, Phenols & Ethers",
        slug: "alcohols-phenols-ethers",
        classLevel: 12,
        historicalPriority: 88,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Preparation of Alcohols from Alkenes, Carbonyls and Grignard",
          "Lucas Test and Oxidation of 1°, 2°, 3° Alcohols",
          "Preparation and Acidic Strength of Phenols",
          "Reimer-Tiemann and Kolbe's Reactions",
          "Williamson's Ether Synthesis and Cleavage by HI"
        ]
      },
      {
        name: "Amines & Diazonium Salts",
        slug: "amines-diazonium-salts",
        classLevel: 12,
        historicalPriority: 87,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Preparation of Amines (Gabriel Phthalimide, Hoffmann Bromamide)",
          "Basic Strength of Aliphatic and Aromatic Amines",
          "Chemical Tests: Carbylamine Test and Hinsberg's Reagent Test",
          "Diazotisation and Preparation of Benzene Diazonium Chloride",
          "Sandmeyer, Gattermann and Coupling Reactions"
        ]
      },
      {
        name: "Atomic Structure",
        slug: "atomic-structure",
        classLevel: 11,
        historicalPriority: 87,
        estimatedHours: 9,
        hoursRange: "8–10 Hours",
        defaultQuestionTarget: 90,
        defaultPYQTarget: 45,
        topics: [
          "Dual Nature of Light, Photoelectric Effect and Bohr's Model",
          "Hydrogen Spectrum and Rydberg's Formula",
          "de Broglie Relationship and Heisenberg's Uncertainty Principle",
          "Quantum Numbers (n, l, m, s) and Shapes of Orbitals",
          "Aufbau Principle, Pauli's Exclusion and Hund's Rule"
        ]
      },
      {
        name: "Periodic Table & Periodicity",
        slug: "periodic-table-periodicity",
        classLevel: 11,
        historicalPriority: 86,
        estimatedHours: 7,
        hoursRange: "6–8 Hours",
        defaultQuestionTarget: 75,
        defaultPYQTarget: 40,
        topics: [
          "Modern Periodic Law and Long Form of Periodic Table",
          "Periodic Trends: Atomic Radii, Ionic Radii, Screening Effect (Slater Rules)",
          "Ionization Enthalpy and Anomalous Trends",
          "Electron Gain Enthalpy and Electronegativity (Pauling/Mulliken Scales)",
          "Valency and Diagonal Relationships"
        ]
      },
      {
        name: "d- and f-Block Elements",
        slug: "d-and-f-block-elements",
        classLevel: 12,
        historicalPriority: 88,
        estimatedHours: 9,
        hoursRange: "8–10 Hours",
        defaultQuestionTarget: 90,
        defaultPYQTarget: 45,
        topics: [
          "General Electronic Configuration and Oxidation States of 3d Series",
          "Catalytic Properties, Magnetic Moments and Interstitial Compounds",
          "Preparation, Properties and Reactions of KMnO4 and K2Cr2O7",
          "Lanthanoid Contraction and Causes/Consequences",
          "General Properties of Actinoids"
        ]
      },
      {
        name: "Solutions",
        slug: "solutions-chemistry",
        classLevel: 12,
        historicalPriority: 88,
        estimatedHours: 9,
        hoursRange: "8–10 Hours",
        defaultQuestionTarget: 90,
        defaultPYQTarget: 45,
        topics: [
          "Types of Solutions and Henry's Law for Gas Solubility",
          "Raoult's Law for Volatile Liquids and Ideal/Non-Ideal Solutions",
          "Azeotropes and Positive/Negative Deviations",
          "Colligative Properties: RLVP, Elevation in BP, Depression in FP, Osmotic Pressure",
          "Van't Hoff Factor (i) and Abnormal Molar Masses"
        ]
      },
      {
        name: "States of Matter (Gaseous State)",
        slug: "states-of-matter",
        classLevel: 11,
        historicalPriority: 81,
        estimatedHours: 7,
        hoursRange: "6–8 Hours",
        defaultQuestionTarget: 70,
        defaultPYQTarget: 35,
        topics: [
          "Gas Laws: Boyle's, Charles', Gay-Lussac's, Avogadro's",
          "Ideal Gas Equation and Dalton's Law of Partial Pressures",
          "Graham's Law of Diffusion and Kinetic Molecular Theory",
          "Van der Waals Equation for Real Gases and Critical Constants",
          "Compressibility Factor (Z) and Liquefaction of Gases"
        ]
      },
      {
        name: "s-Block Elements",
        slug: "s-block-elements",
        classLevel: 11,
        historicalPriority: 80,
        estimatedHours: 7,
        hoursRange: "6–8 Hours",
        defaultQuestionTarget: 70,
        defaultPYQTarget: 35,
        topics: [
          "Group 1 (Alkali Metals) Physical and Chemical Properties",
          "Group 2 (Alkaline Earth Metals) Properties and Anomalous Lithium/Beryllium",
          "Important Compounds: Sodium Carbonate, Sodium Chloride, Sodium Hydroxide",
          "Calcium Oxide, Calcium Carbonate and Plaster of Paris",
          "Biological Importance of Sodium, Potassium, Magnesium, Calcium"
        ]
      },
      {
        name: "Biomolecules",
        slug: "biomolecules",
        classLevel: 12,
        historicalPriority: 86,
        estimatedHours: 7,
        hoursRange: "6–8 Hours",
        defaultQuestionTarget: 75,
        defaultPYQTarget: 40,
        topics: [
          "Carbohydrates: Monosaccharides (Glucose, Fructose), Glycosidic Linkage",
          "Disaccharides, Polysaccharides (Starch, Cellulose, Glycogen)",
          "Proteins: Amino Acids, Zwitterion, Peptide Bond, Denaturation",
          "Nucleic Acids: DNA, RNA, Nucleotides, Double Helix Structure",
          "Vitamins, Enzymes and Hormones"
        ]
      },
      {
        name: "Hydrogen & its Compounds",
        slug: "hydrogen",
        classLevel: 11,
        historicalPriority: 76,
        estimatedHours: 5,
        hoursRange: "4–6 Hours",
        defaultQuestionTarget: 50,
        defaultPYQTarget: 25,
        topics: [
          "Position of Hydrogen in Periodic Table and Isotopes",
          "Preparation, Properties and Uses of Dihydrogen",
          "Hydrides: Ionic, Covalent and Interstitial",
          "Water: Structure, Hard and Soft Water, Heavy Water (D2O)",
          "Hydrogen Peroxide (H2O2) Preparation, Structure and Properties"
        ]
      },
      {
        name: "General Principles of Metallurgy",
        slug: "metallurgy",
        classLevel: 12,
        historicalPriority: 79,
        estimatedHours: 7,
        hoursRange: "6–8 Hours",
        defaultQuestionTarget: 65,
        defaultPYQTarget: 35,
        topics: [
          "Occurrence of Metals and Concentration of Ores (Froth Flotation)",
          "Thermodynamic Principles of Metallurgy and Ellingham Diagrams",
          "Extraction of Iron (Blast Furnace), Copper, Zinc and Aluminium (Hall-Heroult)",
          "Refining Methods: Liquation, Zone Refining, Mond's and Van Arkel Processes"
        ]
      },
      {
        name: "Polymers & Chemistry in Everyday Life",
        slug: "polymers-everyday-life",
        classLevel: 12,
        historicalPriority: 78,
        estimatedHours: 7,
        hoursRange: "6–8 Hours",
        defaultQuestionTarget: 65,
        defaultPYQTarget: 35,
        topics: [
          "Classification of Polymers: Natural, Synthetic, Addition and Condensation",
          "Preparation and Uses of Polythene, Nylon, Dacron, Bakelite, Buna-S/N",
          "Biodegradable Polymers (PHBV, Nylon-2-Nylon-6)",
          "Drugs: Analgesics, Antipyretics, Antibiotics, Antiseptics",
          "Cleansing Agents: Soaps, Synthetic Detergents, Artificial Sweeteners"
        ]
      },
      {
        name: "Surface Chemistry / Colloids",
        slug: "surface-chemistry",
        classLevel: 12,
        historicalPriority: 77,
        estimatedHours: 5,
        hoursRange: "4–6 Hours",
        defaultQuestionTarget: 55,
        defaultPYQTarget: 30,
        topics: [
          "Adsorption: Physisorption vs Chemisorption, Freundlich Isotherm",
          "Catalysis: Homogeneous, Heterogeneous, Enzyme Catalysis",
          "Colloids: Lyophilic and Lyophobic Sols, Micelle Formation",
          "Properties of Colloids: Tyndall Effect, Brownian Movement, Electrophoresis",
          "Coagulation, Hardy-Schulze Rule and Emulsions"
        ]
      }
    ]
  },

  // 3. MATHEMATICS (16 Chapters — 235 Total Mastery Hours)
  {
    name: "Mathematics",
    shortName: "MATH",
    displayOrder: 3,
    color: "#f43f5e",
    chapters: [
      {
        name: "Integral Calculus (Indefinite, Definite, Area)",
        slug: "integral-calculus",
        classLevel: 12,
        historicalPriority: 98,
        estimatedHours: 26,
        hoursRange: "24–28 Hours",
        defaultQuestionTarget: 180,
        defaultPYQTarget: 90,
        topics: [
          "Standard Indefinite Integrals and Substitution Methods",
          "Integration by Parts and Partial Fractions",
          "Special Trigonometric and Algebraic Integrals",
          "Fundamental Theorem of Calculus and Definite Integral as Limit of Sum",
          "Properties of Definite Integrals (King's Property, Periodic Functions)",
          "Leibniz Rule for Differentiation under Integral Sign",
          "Area Under Curves and Area Bounded Between Two Curves"
        ]
      },
      {
        name: "Coordinate Geometry: Conic Sections",
        slug: "conic-sections",
        classLevel: 11,
        historicalPriority: 95,
        estimatedHours: 22,
        hoursRange: "20–24 Hours",
        defaultQuestionTarget: 160,
        defaultPYQTarget: 80,
        topics: [
          "Standard Equation and Properties of Parabola",
          "Tangents, Normals, Focal Chords and Parameterisation of Parabola",
          "Standard Equation, Eccentricity and Foci of Ellipse",
          "Auxiliary Circle, Director Circle and Tangents/Normals to Ellipse",
          "Standard Equation, Asymptotes and Rectangular Hyperbola",
          "Common Tangents and Locus Problems in Conics"
        ]
      },
      {
        name: "Differential Calculus (Limits, Continuity, AOD)",
        slug: "differential-calculus",
        classLevel: 12,
        historicalPriority: 96,
        estimatedHours: 22,
        hoursRange: "20–24 Hours",
        defaultQuestionTarget: 160,
        defaultPYQTarget: 80,
        topics: [
          "Limits: Indeterminate Forms, L'Hopital's Rule, Expansion Series",
          "Continuity and Types of Discontinuity",
          "Differentiability, Left/Right Hand Derivatives and Functional Equations",
          "Tangents and Normals to Curves",
          "Rate Measure, Mean Value Theorems (Rolle's & LMVT)",
          "Monotonicity (Increasing/Decreasing Functions)",
          "Maxima and Minima: First and Second Derivative Tests, Point of Inflection"
        ]
      },
      {
        name: "Three-Dimensional (3D) Geometry",
        slug: "three-dimensional-geometry",
        classLevel: 12,
        historicalPriority: 96,
        estimatedHours: 17,
        hoursRange: "16–18 Hours",
        defaultQuestionTarget: 140,
        defaultPYQTarget: 70,
        topics: [
          "Direction Cosines and Direction Ratios of Lines",
          "Vector and Cartesian Equations of Lines in Space",
          "Angle Between Lines, Coplanar Lines and Skew Lines",
          "Shortest Distance Between Two Skew Lines",
          "Vector and Cartesian Equations of Planes",
          "Angle Between Line and Plane, Distance of a Point from Plane",
          "Intersection of Line and Plane, Image of Point in Plane"
        ]
      },
      {
        name: "Vector Algebra",
        slug: "vector-algebra",
        classLevel: 12,
        historicalPriority: 94,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Types of Vectors, Position Vector and Section Formula",
          "Scalar (Dot) Product and Vector Projection",
          "Vector (Cross) Product and Geometrical Applications (Area)",
          "Scalar Triple Product (Box Product) and Coplanarity of Vectors",
          "Vector Triple Product and Lagrange's Identity",
          "Linear Combination and Linear Independence of Vectors"
        ]
      },
      {
        name: "Matrices & Determinants",
        slug: "matrices-and-determinants",
        classLevel: 12,
        historicalPriority: 93,
        estimatedHours: 13,
        hoursRange: "12–14 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Types of Matrices, Matrix Operations and Multiplication Properties",
          "Transpose, Symmetric, Skew-Symmetric and Orthogonal Matrices",
          "Properties of Determinants and Minors/Cofactors",
          "Adjoint and Inverse of a Square Matrix",
          "System of Linear Equations: Cramer's Rule",
          "Matrix Inversion Method and Consistency (Homogeneous & Non-Homogeneous)"
        ]
      },
      {
        name: "Permutations & Combinations (P&C)",
        slug: "permutations-and-combinations",
        classLevel: 11,
        historicalPriority: 92,
        estimatedHours: 13,
        hoursRange: "12–14 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Fundamental Principles of Counting (Addition & Multiplication)",
          "Permutation of Distinct and Non-Distinct Objects",
          "Combinations and Selection Principles",
          "Division and Distribution into Groups",
          "Circular Permutations and Necklace Problems",
          "Derangements and Multinomial Selection / Exponent of Prime in n!"
        ]
      },
      {
        name: "Binomial Theorem",
        slug: "binomial-theorem",
        classLevel: 11,
        historicalPriority: 89,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Binomial Theorem for Positive Integral Index",
          "General Term and Middle Term(s) in Binomial Expansion",
          "Properties of Binomial Coefficients and Series Summations",
          "Divisibility, Remainder and Fractional Part Problems",
          "Multinomial Theorem and Any Index Binomial Expansion"
        ]
      },
      {
        name: "Complex Numbers & Quadratic Equations",
        slug: "complex-numbers-and-quadratics",
        classLevel: 11,
        historicalPriority: 93,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Algebra of Complex Numbers, Modulus, Conjugate and Argument",
          "Polar Form, Euler's Formula and De Moivre's Theorem",
          "Cube Roots of Unity (1, omega, omega^2) and nth Roots of Unity",
          "Geometry of Complex Numbers (Circles, Lines, Conics in Argand Plane)",
          "Quadratic Equations: Nature of Roots, Relations Between Roots and Coefficients",
          "Common Roots Condition and Location of Roots"
        ]
      },
      {
        name: "Sequences & Series",
        slug: "sequences-and-series",
        classLevel: 11,
        historicalPriority: 90,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Arithmetic Progression (AP) and Arithmetic Mean",
          "Geometric Progression (GP), Infinite GP and Geometric Mean",
          "Arithmetico-Geometric Progression (AGP)",
          "Harmonic Progression (HP) and AM-GM-HM Inequalities",
          "Sum of Special Series (Sigma n, Sigma n^2, Sigma n^3)",
          "Telescoping Series (Vn Method of Differences)"
        ]
      },
      {
        name: "Coordinate Geometry: Straight Lines & Circles",
        slug: "straight-lines-and-circles",
        classLevel: 11,
        historicalPriority: 92,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Slope of a Line and Various Forms of Equations of a Line",
          "Distance of a Point from Line and Distance Between Parallel Lines",
          "Family of Lines and Angle Bisectors",
          "Standard Equation of a Circle and Diametric Form",
          "Position of Point/Line w.r.t Circle, Tangents, Normal and Chord of Contact",
          "Director Circle, Family of Circles and Radical Axis"
        ]
      },
      {
        name: "Trigonometry & Inverse Trig Functions (ITF)",
        slug: "trigonometry-and-itf",
        classLevel: 11,
        historicalPriority: 91,
        estimatedHours: 15,
        hoursRange: "14–16 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Trigonometric Ratios, Compound Angles and Multiple/Sub-multiple Angles",
          "Trigonometric Equations and General Solutions",
          "Domain, Range and Principal Value Branches of ITF",
          "Properties of Inverse Trigonometric Functions",
          "Sum and Difference of Inverse Trigonometric Functions"
        ]
      },
      {
        name: "Probability & Statistics",
        slug: "probability-and-statistics",
        classLevel: 12,
        historicalPriority: 91,
        estimatedHours: 13,
        hoursRange: "12–14 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Classical and Axiomatic Probability, Addition and Multiplication Theorems",
          "Conditional Probability and Independent Events",
          "Total Probability Theorem and Bayes' Theorem",
          "Random Variable, Probability Distribution and Binomial Distribution",
          "Statistics: Mean, Median, Mode, Variance, Standard Deviation and Mean Deviation"
        ]
      },
      {
        name: "Differential Equations",
        slug: "differential-equations",
        classLevel: 12,
        historicalPriority: 90,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Order and Degree of Differential Equations",
          "Formation of Differential Equations",
          "Variable Separable Method",
          "Homogeneous Differential Equations",
          "Linear Differential Equations (dy/dx + Py = Q) and Integrating Factor",
          "Bernoulli's Differential Equations and Geometric Applications"
        ]
      },
      {
        name: "Sets, Relations & Functions",
        slug: "sets-relations-functions",
        classLevel: 11,
        historicalPriority: 89,
        estimatedHours: 11,
        hoursRange: "10–12 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Sets, Subsets, Power Set, Union, Intersection and Venn Diagrams",
          "Cartesian Product, Relations, Domain and Range",
          "Types of Relations: Reflexive, Symmetric, Transitive, Equivalence",
          "Functions: Domain, Codomain, Range",
          "Types of Functions: One-One (Injective), Onto (Surjective), Bijective",
          "Composite Functions and Inverse Functions"
        ]
      },
      {
        name: "Mathematical Reasoning & Logic",
        slug: "mathematical-reasoning",
        classLevel: 11,
        historicalPriority: 78,
        estimatedHours: 5,
        hoursRange: "4–6 Hours",
        defaultQuestionTarget: 50,
        defaultPYQTarget: 25,
        topics: [
          "Statements and Negation of Statements",
          "Compound Statements: Conjunction, Disjunction, Conditional and Biconditional",
          "Truth Tables Construction and Analysis",
          "Tautology and Contradiction",
          "Converse, Inverse and Contrapositive Statements"
        ]
      }
    ]
  }
];
