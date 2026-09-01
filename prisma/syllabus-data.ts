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
  },

  // 4. BIOLOGY (31 Chapters — Botany & Zoology Comprehensive Mastery Track)
  {
    name: "Biology",
    shortName: "BIO",
    displayOrder: 4,
    color: "#a855f7",
    chapters: [
      // Class 11 Biology
      {
        name: "The Living World & Biological Classification",
        slug: "living-world-and-classification",
        classLevel: 11,
        historicalPriority: 85,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Characteristics of Living Organisms and Taxonomic Hierarchy",
          "Binomial Nomenclature, Systematics and Taxonomical Aids",
          "Five Kingdom Classification (Monera, Protista, Fungi, Plantae, Animalia)",
          "Kingdom Monera: Archaebacteria, Eubacteria and Cyanobacteria",
          "Kingdom Protista: Chrysophytes, Dinoflagellates, Euglenoids, Slime moulds, Protozoans",
          "Kingdom Fungi: Phycomycetes, Ascomycetes, Basidiomycetes, Deuteromycetes",
          "Viruses, Viroids, Prions and Lichens"
        ]
      },
      {
        name: "Plant Kingdom",
        slug: "plant-kingdom",
        classLevel: 11,
        historicalPriority: 90,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 140,
        defaultPYQTarget: 70,
        topics: [
          "Algae: Chlorophyceae, Phaeophyceae, Rhodophyceae characteristics & reproduction",
          "Bryophytes: Liverworts and Mosses lifecycle and economic importance",
          "Pteridophytes: Homosporous & Heterosporous lifecycle, Prothallus, Stelar system",
          "Gymnosperms: Cycas, Pinus morphology, lifecycle, and naked seeds",
          "Angiosperms: Monocots vs Dicots, Double fertilization overview",
          "Plant Life Cycles and Alternation of Generations (Haplontic, Diplontic, Haplodiplontic)"
        ]
      },
      {
        name: "Animal Kingdom",
        slug: "animal-kingdom",
        classLevel: 11,
        historicalPriority: 94,
        estimatedHours: 14,
        hoursRange: "12–16 Hours",
        defaultQuestionTarget: 160,
        defaultPYQTarget: 80,
        topics: [
          "Basis of Classification: Symmetry, Coelom, Germ layers, Segmentation",
          "Non-Chordates: Porifera, Coelenterata (Cnidaria), Ctenophora, Platyhelminthes",
          "Aschelminthes, Annelida, Arthropoda, Mollusca, Echinodermata, Hemichordata",
          "Phylum Chordata: Urochordata, Cephalochordata, Vertebrata",
          "Class Cyclostomata, Chondrichthyes, Osteichthyes",
          "Class Amphibia, Reptilia, Aves, and Mammalia with key examples"
        ]
      },
      {
        name: "Morphology of Flowering Plants",
        slug: "morphology-flowering-plants",
        classLevel: 11,
        historicalPriority: 91,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 140,
        defaultPYQTarget: 70,
        topics: [
          "Root System: Tap root, Fibrous root, Adventitious root, Modifications",
          "Stem: Nodes, Internodes, Subaerial, Aerial, and Underground stem modifications",
          "Leaf: Venation (Reticulate, Parallel), Types of leaves, Phyllotaxy, Modifications",
          "Inflorescence: Racemose and Cymose types",
          "Flower: Parts (Calyx, Corolla, Androecium, Gynoecium), Aestivation, Placentation",
          "Fruit and Seed: True, False, Parthenocarpic fruits, Dicot vs Monocot seed",
          "Description of Families: Solanaceae, Fabaceae, Liliaceae, Brassicaceae"
        ]
      },
      {
        name: "Anatomy of Flowering Plants",
        slug: "anatomy-flowering-plants",
        classLevel: 11,
        historicalPriority: 88,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Meristematic Tissues: Apical, Intercalary, Lateral meristems",
          "Permanent Tissues: Simple (Parenchyma, Collenchyma, Sclerenchyma) and Complex (Xylem, Phloem)",
          "Tissue Systems: Epidermal, Ground, and Vascular tissue systems",
          "Anatomy of Dicotyledonous and Monocotyledonous Root and Stem",
          "Anatomy of Dorsiventral (Dicot) and Isobilateral (Monocot) Leaf",
          "Secondary Growth: Vascular cambium, Cork cambium (Phellogen), Heartwood and Sapwood"
        ]
      },
      {
        name: "Structural Organisation in Animals",
        slug: "structural-organisation-animals",
        classLevel: 11,
        historicalPriority: 86,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 110,
        defaultPYQTarget: 55,
        topics: [
          "Epithelial Tissue: Simple (Squamous, Cuboidal, Columnar, Ciliated) and Compound",
          "Connective Tissue: Loose (Areolar, Adipose), Dense (Tendons, Ligaments), Specialized (Cartilage, Bone, Blood)",
          "Muscular Tissue: Skeletal, Smooth, and Cardiac muscle fibers",
          "Neural Tissue: Neurons and Neuroglial cells",
          "Morphology, Anatomy, Digestive, Circulatory, Nervous, and Reproductive systems of Frog",
          "Cockroach morphology and internal anatomy overview"
        ]
      },
      {
        name: "Cell: The Unit of Life",
        slug: "cell-the-unit-of-life",
        classLevel: 11,
        historicalPriority: 95,
        estimatedHours: 14,
        hoursRange: "12–16 Hours",
        defaultQuestionTarget: 150,
        defaultPYQTarget: 75,
        topics: [
          "Cell Theory and Overview of Prokaryotic vs Eukaryotic Cell",
          "Prokaryotic Cell: Cell envelope, Mesosomes, Plasmids, Flagella, Ribosomes",
          "Cell Membrane: Fluid Mosaic Model of Singer and Nicolson, Membrane Transport",
          "Endomembrane System: Endoplasmic Reticulum (RER, SER), Golgi Apparatus, Lysosomes, Vacuoles",
          "Mitochondria and Plastids (Chloroplast, Chromoplast, Leucoplast) structure and semiautonomous nature",
          "Ribosomes, Cytoskeleton, Cilia, Flagella, Centrosome and Centrioles",
          "Nucleus: Nuclear envelope, Chromatin, Nucleolus, Types of Chromosomes (Metacentric, etc.)"
        ]
      },
      {
        name: "Biomolecules (Biology)",
        slug: "biomolecules-bio",
        classLevel: 11,
        historicalPriority: 92,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Chemical Analysis of Living Tissues, Primary and Secondary Metabolites",
          "Biomacromolecules: Proteins structure (Primary, Secondary, Tertiary, Quaternary)",
          "Polysaccharides: Starch, Glycogen, Cellulose, Chitin",
          "Lipids: Fatty acids, Glycerides, Phospholipids (Lecithin)",
          "Nucleic Acids: DNA and RNA structure, Nucleosides, Nucleotides, Base pairing",
          "Enzymes: Properties, Factors affecting activity, Mechanism of action, Classification, Co-factors and Co-enzymes"
        ]
      },
      {
        name: "Cell Cycle and Cell Division",
        slug: "cell-cycle-and-cell-division",
        classLevel: 11,
        historicalPriority: 94,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Phases of Cell Cycle: Interphase (G1, S, G2 phases) and G0 (Quiescent) stage",
          "M Phase (Mitosis): Prophase, Metaphase, Anaphase, Telophase, and Cytokinesis",
          "Significance of Mitosis in growth and repair",
          "Meiosis: Meiosis I (Prophase I: Leptotene, Zygotene, Pachytene, Diplotene, Diakinesis, Crossing over)",
          "Metaphase I, Anaphase I, Telophase I, Interkinesis and Meiosis II stages",
          "Significance of Meiosis in genetic variation and evolution"
        ]
      },
      {
        name: "Photosynthesis in Higher Plants",
        slug: "photosynthesis",
        classLevel: 11,
        historicalPriority: 94,
        estimatedHours: 14,
        hoursRange: "12–16 Hours",
        defaultQuestionTarget: 150,
        defaultPYQTarget: 75,
        topics: [
          "Site of Photosynthesis, Chloroplast pigments (Chlorophyll a, b, Carotenoids), Absorption vs Action spectra",
          "Light Reaction (Photochemical phase): Photosystems I and II, Light harvesting complexes",
          "Electron Transport: Non-cyclic and Cyclic Photophosphorylation, Z-scheme",
          "Splitting of Water and Chemiosmotic Hypothesis (Peter Mitchell)",
          "Dark Reaction (Biosynthetic phase): Calvin Cycle (C3 pathway) - Carboxylation, Reduction, Regeneration",
          "C4 Pathway (Hatch & Slack): Kranz anatomy, PEP carboxylase, Advantages over C3",
          "Photorespiration (C2 cycle) and Factors affecting photosynthesis (Blackman's Law)"
        ]
      },
      {
        name: "Respiration in Plants",
        slug: "respiration-in-plants",
        classLevel: 11,
        historicalPriority: 92,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Cellular Respiration overview, Aerobic vs Anaerobic respiration",
          "Glycolysis (EMP Pathway): 10 steps, ATP investment and yield, Phosphorylation",
          "Fermentation: Alcoholic and Lactic acid fermentation",
          "Aerobic Respiration: Link reaction (Oxidative decarboxylation of Pyruvate to Acetyl-CoA)",
          "Tricarboxylic Acid Cycle (TCA / Krebs Cycle / Citric Acid Cycle) steps and energetics",
          "Electron Transport System (ETS) and Oxidative Phosphorylation, Complex I-V, ATP Synthase",
          "Respiratory Balance Sheet, Amphibolic Pathway, and Respiratory Quotient (RQ)"
        ]
      },
      {
        name: "Plant Growth and Development",
        slug: "plant-growth-development",
        classLevel: 11,
        historicalPriority: 89,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 110,
        defaultPYQTarget: 55,
        topics: [
          "Characteristics of Plant Growth: Phases (Meristematic, Elongation, Maturation), Arithmetic & Geometric growth",
          "Differentiation, Dedifferentiation, and Redifferentiation",
          "Development and Plasticity in plants (Heterophylly)",
          "Plant Growth Regulators (Phytohormones): Auxins, Gibberellins (GA), Cytokinins",
          "Ethylene and Abscisic Acid (ABA / Stress hormone) physiological effects and applications",
          "Photoperiodism (Short-day, Long-day, Day-neutral plants) and Vernalization"
        ]
      },
      {
        name: "Breathing and Exchange of Gases",
        slug: "breathing-exchange-gases",
        classLevel: 11,
        historicalPriority: 90,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Human Respiratory System: Nostrils, Pharynx, Larynx, Trachea, Bronchi, Alveoli and Lungs",
          "Mechanism of Breathing: Inspiration and Expiration, Diaphragm, Intercostal muscles",
          "Respiratory Volumes and Capacities (TV, IRV, ERV, RV, IC, EC, FRC, VC, TLC)",
          "Exchange of Gases: Partial pressures (pO2, pCO2) at alveoli and tissues",
          "Transport of Gases: Transport of Oxygen (Oxyhaemoglobin, Oxygen dissociation curve, Bohr effect)",
          "Transport of Carbon dioxide (Carbaminohaemoglobin, Bicarbonate ions, Chloride shift)",
          "Regulation of Respiration (Respiratory rhythm centre, Pneumotaxic centre, Chemosensitive area)",
          "Disorders: Asthma, Emphysema, Occupational Respiratory Disorders"
        ]
      },
      {
        name: "Body Fluids and Circulation",
        slug: "body-fluids-circulation",
        classLevel: 11,
        historicalPriority: 92,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Composition of Blood: Plasma and Formed Elements (Erythrocytes, Leucocytes, Platelets)",
          "Blood Groups: ABO system and Rh grouping, Erythroblastosis foetalis",
          "Coagulation of Blood (Clotting cascade, Thromboplastin, Thrombin, Fibrin)",
          "Lymph (Tissue fluid) composition and functions",
          "Human Circulatory System: Structure of Heart, Cardiac muscle, Pacemaker (SA node, AV node)",
          "Cardiac Cycle: Auricular systole, Ventricular systole, Joint diastole, Heart sounds (Lub, Dub)",
          "Electrocardiogram (ECG): P-wave, QRS complex, T-wave interpretation",
          "Double Circulation: Systemic and Pulmonary circuits, Hepatic portal system",
          "Regulation of Cardiac Activity and Disorders: Hypertension, CAD, Angina, Heart failure"
        ]
      },
      {
        name: "Excretory Products and their Elimination",
        slug: "excretory-products-elimination",
        classLevel: 11,
        historicalPriority: 92,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Modes of Excretion: Ammonotelism, Ureotelism, Uricotelism with examples",
          "Human Excretory System: Kidneys, Ureters, Urinary bladder, Urethra",
          "Structure of Nephron: Bowman's capsule, Glomerulus, PCT, Henle's Loop, DCT, Collecting duct",
          "Urine Formation: Glomerular Filtration (GFR), Tubular Reabsorption, Tubular Secretion",
          "Function of Tubules and Counter-Current Mechanism in Henle's loop and Vasa recta",
          "Regulation of Kidney Function: Renin-Angiotensin-Aldosterone System (RAAS), ADH, ANF",
          "Micturition reflex and Disorders: Uremia, Renal calculi, Glomerulonephritis, Dialysis"
        ]
      },
      {
        name: "Locomotion and Movement",
        slug: "locomotion-and-movement",
        classLevel: 11,
        historicalPriority: 89,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Types of Movement: Amoeboid, Ciliary, Flagellar, Muscular",
          "Skeletal Muscle structure: Epimysium, Perimysium, Sarcomere, Actin (Thin) and Myosin (Thick) myofilaments",
          "Mechanism of Muscle Contraction: Sliding Filament Theory, Neuromuscular junction, Calcium release, Cross-bridge cycle",
          "Human Skeletal System: Axial skeleton (Skull, Vertebral column, Ribs, Sternum) and Appendicular skeleton (Girdles, Limbs)",
          "Joints: Fibrous, Cartilaginous, Synovial joints (Ball & socket, Hinge, Pivot, Gliding, Saddle)",
          "Disorders: Myasthenia gravis, Tetany, Muscular dystrophy, Arthritis, Osteoporosis, Gout"
        ]
      },
      {
        name: "Neural Control and Coordination",
        slug: "neural-control-coordination",
        classLevel: 11,
        historicalPriority: 92,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Structure of Neuron: Dendrites, Cyton, Axon, Myelinated vs Unmyelinated nerve fibers",
          "Generation and Conduction of Nerve Impulse: Resting membrane potential, Depolarization, Action potential, Repolarization",
          "Transmission of Impulses: Electrical and Chemical Synapses, Neurotransmitters",
          "Central Nervous System (CNS): Brain structure (Forebrain: Cerebrum, Thalamus, Hypothalamus; Midbrain; Hindbrain: Cerebellum, Pons, Medulla)",
          "Spinal Cord and Reflex Action / Reflex Arc",
          "Sensory Reception and Processing: Structure and mechanism of Eye (Vision) and Ear (Hearing & Balance)"
        ]
      },
      {
        name: "Chemical Coordination and Integration",
        slug: "chemical-coordination-integration",
        classLevel: 11,
        historicalPriority: 93,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Endocrine Glands and Hormones: Difference between Exocrine and Endocrine",
          "Hypothalamus hormones (Releasing and Inhibiting hormones)",
          "Pituitary Gland: Adenohypophysis (GH, PRL, TSH, ACTH, LH, FSH) and Neurohypophysis (Oxytocin, Vasopressin)",
          "Thyroid Gland (T3, T4, Calcitonin) and Parathyroid Gland (PTH)",
          "Adrenal Gland: Adrenal Cortex (Corticoids) and Adrenal Medulla (Adrenaline, Noradrenaline)",
          "Pancreas (Islets of Langerhans: Insulin, Glucagon), Gonads (Testes: Testosterone; Ovaries: Estrogen, Progesterone)",
          "Hormones of Heart (ANF), Kidney (Erythropoietin), and GI Tract (Gastrin, Secretin, CCK, GIP)",
          "Mechanism of Hormone Action: Protein hormones (Second messengers: cAMP, IP3) vs Steroid hormones (Nuclear receptors)",
          "Endocrine Disorders: Dwarfism, Acromegaly, Goitre, Diabetes mellitus, Diabetes insipidus, Addison's, Cushing's"
        ]
      },

      // Class 12 Biology
      {
        name: "Sexual Reproduction in Flowering Plants",
        slug: "sexual-reproduction-flowering-plants",
        classLevel: 12,
        historicalPriority: 95,
        estimatedHours: 14,
        hoursRange: "12–16 Hours",
        defaultQuestionTarget: 150,
        defaultPYQTarget: 75,
        topics: [
          "Flower structure and Pre-fertilization events",
          "Microsporogenesis and Pollen grain structure, viability, and pollen allergy",
          "Megasporogenesis and Female Gametophyte (Embryo sac) development, 7-celled 8-nucleate structure",
          "Pollination: Autogamy, Geitonogamy, Xenogamy; Agents of pollination (Wind, Water, Insects)",
          "Outbreeding devices and Pollen-pistil interaction",
          "Double Fertilization: Syngamy and Triple Fusion (PEN formation)",
          "Post-fertilization events: Endosperm development (Free nuclear, Cellular), Embryo development (Dicot & Monocot)",
          "Seed, Fruit development, Perisperm, Apomixis and Polyembryony"
        ]
      },
      {
        name: "Human Reproduction",
        slug: "human-reproduction",
        classLevel: 12,
        historicalPriority: 96,
        estimatedHours: 14,
        hoursRange: "12–16 Hours",
        defaultQuestionTarget: 160,
        defaultPYQTarget: 80,
        topics: [
          "Male Reproductive System: Testes, Seminiferous tubules, Leydig cells, Sertoli cells, Accessory ducts & glands",
          "Female Reproductive System: Ovaries, Fallopian tubes, Uterus, Cervix, Vagina, Mammary glands",
          "Spermatogenesis: Hormonal control, Sperm morphology (Acrosome, Nucleus, Middle piece, Tail)",
          "Oogenesis: Primary oocyte, Graafian follicle, Corpus luteum formation",
          "Menstrual Cycle: Menstrual, Follicular (Proliferative), Ovulatory, and Luteal (Secretory) phases, Hormonal regulation (LH surge, FSH, Estrogen, Progesterone)",
          "Fertilization, Capacitation, Cortical reaction, Cleavage, Blastocyst formation, and Implantation",
          "Pregnancy, Placenta structure and endocrine function (hCG, hPL, Relaxin)",
          "Parturition (Foetal ejection reflex, Oxytocin) and Lactation (Colostrum)"
        ]
      },
      {
        name: "Reproductive Health",
        slug: "reproductive-health",
        classLevel: 12,
        historicalPriority: 88,
        estimatedHours: 8,
        hoursRange: "6–10 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Reproductive Health problems, Amniocentesis and its statutory ban",
          "Population Explosion and Birth Control methods: Natural, Barrier, IUDs, Oral pills (Saheli), Injectables, Implants, Surgical (Vasectomy, Tubectomy)",
          "Medical Termination of Pregnancy (MTP) and legal provisions",
          "Sexually Transmitted Infections (STIs): Gonorrhoea, Syphilis, Genital herpes, Chlamydiasis, Hepatitis-B, HIV-AIDS",
          "Infertility and Assisted Reproductive Technologies (ART): IVF-ET (ZIFT, IUT), GIFT, ICSI, AI, IUI, Surrogacy"
        ]
      },
      {
        name: "Principles of Inheritance and Variation (Genetics)",
        slug: "principles-of-inheritance",
        classLevel: 12,
        historicalPriority: 98,
        estimatedHours: 18,
        hoursRange: "16–20 Hours",
        defaultQuestionTarget: 180,
        defaultPYQTarget: 90,
        topics: [
          "Mendel's Experiments: Monohybrid cross, Law of Dominance, Law of Segregation, Punnett square",
          "Dihybrid cross and Law of Independent Assortment",
          "Incomplete Dominance (Snapdragon / Antirrhinum) and Co-dominance (ABO blood groups)",
          "Pleiotropy and Polygenic Inheritance (Human skin colour)",
          "Chromosomal Theory of Inheritance (Sutton and Boveri)",
          "Linkage and Recombination (T.H. Morgan experiments on Drosophila), Gene mapping",
          "Sex Determination in Humans, Birds, Insects (Grasshopper), Honey bees (Haplodiploidy)",
          "Mutation: Point mutation, Frame-shift mutation, Chromosomal aberrations",
          "Pedigree Analysis and Mendelian Disorders: Haemophilia, Sickle-cell anaemia, Phenylketonuria, Thalassemia, Colour blindness",
          "Chromosomal Disorders: Down's syndrome, Turner's syndrome, Klinefelter's syndrome"
        ]
      },
      {
        name: "Molecular Basis of Inheritance",
        slug: "molecular-basis-of-inheritance",
        classLevel: 12,
        historicalPriority: 99,
        estimatedHours: 20,
        hoursRange: "18–22 Hours",
        defaultQuestionTarget: 200,
        defaultPYQTarget: 100,
        topics: [
          "DNA as Genetic Material: Griffith's Transformation experiment, Avery-MacLeod-McCarty experiment, Hershey-Chase experiment",
          "Structure of DNA: Double helix model of Watson and Crick, Chargaff's rules, Packaging of DNA (Nucleosome, Euchromatin, Heterochromatin)",
          "DNA Replication: Semiconservative replication, Meselson and Stahl experiment, Enzymes involved (DNA Polymerase, Helicase, Ligase)",
          "Transcription: Transcription unit (Promoter, Structural gene, Terminator), Prokaryotic vs Eukaryotic transcription (Capping, Tailing, Splicing)",
          "Genetic Code: Properties of genetic code, Wobble hypothesis, tRNA as adapter molecule",
          "Translation: Aminoacylation of tRNA, Initiation, Elongation, Termination, Ribosome function",
          "Regulation of Gene Expression: Operon concept, Lac Operon in E. coli (Inducer, Repressor, Promoter, Operator)",
          "Human Genome Project (HGP): Goals, Methodologies (ESTs, Sequence Annotation), Features",
          "DNA Fingerprinting: VNTRs, Southern Blotting technique, Applications in forensics"
        ]
      },
      {
        name: "Evolution",
        slug: "evolution-bio",
        classLevel: 12,
        historicalPriority: 90,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 130,
        defaultPYQTarget: 65,
        topics: [
          "Origin of Life: Big Bang theory, Miller-Urey experiment, Chemical evolution (Oparin-Haldane theory)",
          "Evidences for Evolution: Paleontological, Comparative anatomy (Homologous & Analogous organs, Divergent & Convergent evolution), Embryological, Biochemical",
          "Adaptive Radiation: Darwin's Finches, Australian Marsupials",
          "Biological Evolution and Theories: Lamarckism, Darwinian Theory of Natural Selection, Mutation Theory of Hugo de Vries (Saltation)",
          "Mechanism of Evolution: Hardy-Weinberg Principle, Factors affecting equilibrium (Gene flow, Genetic drift, Mutation, Recombination, Natural selection)",
          "Types of Natural Selection: Stabilizing, Directional, Disruptive",
          "Brief account of Evolution: Geological time scale, Evolution of plants and animals",
          "Human Evolution: Dryopithecus, Ramapithecus, Australopithecines, Homo habilis, Homo erectus, Neanderthal man, Homo sapiens"
        ]
      },
      {
        name: "Human Health and Disease",
        slug: "human-health-disease",
        classLevel: 12,
        historicalPriority: 94,
        estimatedHours: 14,
        hoursRange: "12–16 Hours",
        defaultQuestionTarget: 150,
        defaultPYQTarget: 75,
        topics: [
          "Common Pathogens and Infectious Diseases: Typhoid (Salmonella), Pneumonia, Common Cold, Malaria (Plasmodium lifecycle in mosquito & human), Amoebiasis, Ascariasis, Filariasis, Ringworm",
          "Immunity: Innate immunity (Physical, Physiological, Cellular, Cytokine barriers)",
          "Acquired Immunity: Humoral (B-lymphocytes, Antibodies structure: IgG, IgA, IgM, IgE, IgD) and Cell-Mediated (T-lymphocytes, Graft rejection)",
          "Active vs Passive Immunity, Vaccination and Immunization",
          "Allergies (IgE, Histamine, Mast cells) and Autoimmunity (Rheumatoid arthritis)",
          "Immune System in Body: Primary lymphoid organs (Bone marrow, Thymus) and Secondary lymphoid organs (Spleen, Lymph nodes, MALT)",
          "AIDS: Pathogen (HIV / Retrovirus), Transmission, Replication cycle (Reverse transcriptase), Symptoms, Diagnosis (ELISA), Prevention",
          "Cancer: Types (Carcinoma, Sarcoma, Leukaemia), Transformation, Contact inhibition loss, Metastasis, Oncogenes, Detection, Treatment",
          "Drugs and Alcohol Abuse: Opioids (Heroin/Morphine), Cannabinoids (Marijuana/Hashish), Coca alkaloids (Cocaine), Hallucinogens, Addiction and Adolescence"
        ]
      },
      {
        name: "Microbes in Human Welfare",
        slug: "microbes-human-welfare",
        classLevel: 12,
        historicalPriority: 86,
        estimatedHours: 8,
        hoursRange: "6–10 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Microbes in Household Food Processing: LAB (Curd), Baker's Yeast (Bread), Toddy, Cheese (Swiss cheese - Propionibacterium, Roquefort cheese)",
          "Microbes in Industrial Products: Fermented Beverages, Antibiotics (Penicillin - Alexander Fleming), Organic acids (Citric, Acetic, Butyric, Lactic acid), Enzymes (Lipases, Streptokinase / Clot buster), Bioactive molecules (Cyclosporin A, Statins)",
          "Microbes in Sewage Treatment: Primary treatment, Secondary (Biological) treatment, Activated sludge, BOD, Anaerobic sludge digesters",
          "Microbes in Production of Biogas: Methanogens (Methanobacterium), Gobar gas plant design",
          "Microbes as Biocontrol Agents: Bacillus thuringiensis (Bt), Trichoderma, Baculoviruses (NPV)",
          "Microbes as Biofertilizers: Rhizobium, Azotobacter, Azospirillum, Mycorrhiza (Glomus), Cyanobacteria (Anabaena, Nostoc, Oscillatoria)"
        ]
      },
      {
        name: "Biotechnology: Principles and Processes",
        slug: "biotechnology-principles",
        classLevel: 12,
        historicalPriority: 94,
        estimatedHours: 12,
        hoursRange: "10–14 Hours",
        defaultQuestionTarget: 140,
        defaultPYQTarget: 70,
        topics: [
          "Principles of Biotechnology: Genetic engineering and Bioprocess engineering",
          "Tools of Recombinant DNA Technology: Restriction Enzymes (Endonucleases & Exonucleases, Palindromic sequences, Sticky ends)",
          "DNA Ligase, Polymerases, and Modifying enzymes",
          "Cloning Vectors: Characteristics (Ori, Selectable markers: ampR, tetR, Insertional inactivation, Cloning sites), pBR322 vector map, Ti plasmid of Agrobacterium, Retroviral vectors",
          "Competent Host: Chemical treatment (CaCl2), Heat shock, Microinjection, Gene gun (Biolistics), Disarmed pathogen vectors",
          "Processes of Recombinant DNA Technology: Isolation of Genetic material, Cutting DNA, Gel Electrophoresis (Agarose gel, EtBr staining, UV visualization, Elution)",
          "Polymerase Chain Reaction (PCR): Denaturation, Annealing, Extension, Taq Polymerase",
          "Insertion of Recombinant DNA into Host, Obtaining Foreign Gene Product, Bioreactors (Simple stirred-tank, Sparged stirred-tank), Downstream Processing"
        ]
      },
      {
        name: "Biotechnology and its Applications",
        slug: "biotechnology-applications",
        classLevel: 12,
        historicalPriority: 92,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Biotechnological Applications in Agriculture: Bt Cotton (Cry genes: cryIAc, cryIIAb, cryIAb), Pest Resistant Plants (RNA interference / RNAi mechanism against Meloidogyne incognita in tobacco roots)",
          "Biotechnological Applications in Medicine: Genetically Engineered Insulin (Humulin - Eli Lilly), Gene Therapy (ADA deficiency treatment)",
          "Molecular Diagnosis: ELISA, PCR, Recombinant DNA probes",
          "Transgenic Animals: Reasons for creation (Normal physiology, Study of disease, Biological products - alpha-1-antitrypsin, Rosie cow, Vaccine safety, Chemical safety testing)",
          "Ethical Issues: GEAC, Biopiracy (Basmati rice, Neem, Turmeric patents)"
        ]
      },
      {
        name: "Organisms and Populations",
        slug: "organisms-and-populations",
        classLevel: 12,
        historicalPriority: 90,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Organism and its Environment: Major abiotic factors (Temperature, Water, Light, Soil)",
          "Responses to Abiotic Factors: Regulate (Homeostasis), Conform, Migrate, Suspend (Hibernation, Aestivation, Diapause)",
          "Adaptations: Morphological, Physiological, and Behavioural adaptations (Kangaroo rat, Desert plants, Allen's rule, Altitude sickness)",
          "Populations: Population Attributes (Birth rate, Death rate, Sex ratio, Age pyramids: Expanding, Stable, Declining)",
          "Population Growth: Natality, Mortality, Immigration, Emigration; Exponential Growth (J-shaped curve) vs Logistic Growth (S-shaped / Verhulst-Pearl curve, Carrying capacity K)",
          "Population Interactions: Mutualism, Commensalism, Parasitism (Ecto & Endoparasites, Brood parasitism), Predation, Competition (Gause's Competitive Exclusion Principle, Resource partitioning), Amensalism"
        ]
      },
      {
        name: "Ecosystem",
        slug: "ecosystem",
        classLevel: 12,
        historicalPriority: 89,
        estimatedHours: 10,
        hoursRange: "8–12 Hours",
        defaultQuestionTarget: 120,
        defaultPYQTarget: 60,
        topics: [
          "Ecosystem Structure and Function: Terrestrial and Aquatic ecosystems, Productivity (GPP, NPP, Secondary productivity)",
          "Decomposition: Steps (Fragmentation, Leaching, Catabolism, Humification, Mineralization) and factors affecting it",
          "Energy Flow: Photosynthetically Active Radiation (PAR), Grazing Food Chain (GFC), Detritus Food Chain (DFC), 10% Law of Lindeman",
          "Ecological Pyramids: Pyramid of Number, Pyramid of Biomass (Upright vs Inverted), Pyramid of Energy (Always upright), Limitations of ecological pyramids",
          "Nutrient Cycling: Gaseous (Carbon cycle) and Sedimentary (Phosphorus cycle), Ecosystem Services"
        ]
      },
      {
        name: "Biodiversity and Conservation",
        slug: "biodiversity-conservation",
        classLevel: 12,
        historicalPriority: 88,
        estimatedHours: 8,
        hoursRange: "6–10 Hours",
        defaultQuestionTarget: 100,
        defaultPYQTarget: 50,
        topics: [
          "Biodiversity: Genetic, Species, and Ecological diversity; Global species estimates (Robert May estimate)",
          "Patterns of Biodiversity: Latitudinal gradients, Species-Area Relationships (Alexander von Humboldt, S = CA^z)",
          "Importance of Species Diversity to Ecosystem: David Tilman experiments, Rivet Popper Hypothesis (Paul Ehrlich)",
          "Loss of Biodiversity: Causes - The Evil Quartet (Habitat loss & fragmentation, Over-exploitation, Alien species invasions - Nile perch, Water hyacinth, Lantana, African catfish, Co-extinctions)",
          "Biodiversity Conservation: Why conserve (Narrowly utilitarian, Broadly utilitarian, Ethical)",
          "How to conserve: In-situ Conservation (Biosphere Reserves, National Parks, Sanctuaries, Sacred Groves, Biodiversity Hotspots - Western Ghats, Indo-Burma, Himalayas) and Ex-situ Conservation (Zoological parks, Botanical gardens, Cryopreservation, Seed banks)"
        ]
      }
    ]
  }
];
