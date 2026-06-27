export type ElementCategory = 'skill' | 'subject' | 'degree' | 'experience' | 'certification' | 'career';

export interface CraftElement {
  id: string;
  name: string;
  category: ElementCategory;
  isStarter?: boolean;
  isCustom?: boolean;
  rarity?: number; // 0 to 100
  discoveryNumber?: number; // Worldwide discovery index
  description?: string;
}

export interface CareerRequirement {
  name: string;
  category: ElementCategory;
}

export interface CareerBlueprint {
  id: string;
  name: string;
  description: string;
  mandatory: string[];     // Array of element names
  recommended: string[];   // Array of element names
  bonus: string[];         // Array of element names
  pathways: string[][];    // Recommended crafting steps, e.g. ["Math + Finance = Quant Finance", ...]
}

// 1. Initial starter elements
export const STARTER_ELEMENTS: CraftElement[] = [
  { id: 'math', name: 'Mathematics', category: 'subject', isStarter: true, rarity: 0 },
  { id: 'logic', name: 'Logic', category: 'skill', isStarter: true, rarity: 0 },
  { id: 'curiosity', name: 'Curiosity', category: 'skill', isStarter: true, rarity: 0 },
  { id: 'business', name: 'Business', category: 'subject', isStarter: true, rarity: 0 },
  { id: 'science', name: 'Science', category: 'subject', isStarter: true, rarity: 0 },
  { id: 'writing', name: 'Writing', category: 'skill', isStarter: true, rarity: 0 },
  { id: 'creativity', name: 'Creativity', category: 'skill', isStarter: true, rarity: 0 },
  { id: 'finance', name: 'Finance', category: 'subject', isStarter: true, rarity: 0 },
  { id: 'computers', name: 'Computers', category: 'subject', isStarter: true, rarity: 0 },
  { id: 'people', name: 'People', category: 'skill', isStarter: true, rarity: 0 }
];

// 2. Predefined recipe database mapping "elementA_id + elementB_id" -> Combined CraftElement
// We store sorted pairs alphabetically to make lookup order-independent (e.g. "computers+logic" and "logic+computers" both map to "programming")
export const PREDEFINED_RECIPES: Record<string, Omit<CraftElement, 'isStarter'>> = {
  // Skills
  'computers+logic': { id: 'programming', name: 'Programming', category: 'skill' },
  'math+logic': { id: 'statistics', name: 'Statistics', category: 'subject' },
  'computers+writing': { id: 'documentation', name: 'Documentation', category: 'skill' },
  'math+programming': { id: 'algorithm', name: 'Algorithms', category: 'skill' },
  'programming+statistics': { id: 'datascience', name: 'Data Science', category: 'skill' },
  'computers+programming': { id: 'software', name: 'Software', category: 'skill' },
  'logic+software': { id: 'software_engineering', name: 'Software Engineering', category: 'skill' },
  'algorithm+programming': { id: 'data_structures', name: 'Data Structures', category: 'skill' },
  'data_structures+programming': { id: 'dsa', name: 'Data Structures & Algorithms', category: 'skill' },
  
  // Advanced Skills & AI
  'computers+curiosity': { id: 'hacking', name: 'Hacking', category: 'skill' },
  'computers+learning': { id: 'machine_learning', name: 'Machine Learning', category: 'skill' },
  'machine_learning+statistics': { id: 'ai', name: 'Artificial Intelligence', category: 'skill' },
  'ai+creativity': { id: 'generative_ai', name: 'Generative AI', category: 'skill' },
  
  // Degrees
  'computer_science+science': { id: 'btech_cs', name: 'BTech Computer Science', category: 'degree' },
  'computers+science': { id: 'computer_science', name: 'Computer Science', category: 'subject' },
  'science+university': { id: 'bsc', name: 'BSc Science', category: 'degree' },
  'math+university': { id: 'msc_math', name: 'MSc Mathematics', category: 'degree' },
  'physics+university': { id: 'msc_physics', name: 'MSc Physics', category: 'degree' },
  'msc_physics+research': { id: 'phd', name: 'PhD', category: 'degree' },
  'business+management': { id: 'mba', name: 'MBA', category: 'degree' },
  'science+health': { id: 'medicine', name: 'Medicine', category: 'subject' },
  'medicine+university': { id: 'mbbs', name: 'MBBS', category: 'degree' },
  'mbbs+research': { id: 'md', name: 'MD', category: 'degree' },
  
  // Academic Subjects
  'math+physics': { id: 'quantum_physics', name: 'Quantum Physics', category: 'subject' },
  'computers+quantum_physics': { id: 'quantum_computing', name: 'Quantum Computing', category: 'subject' },
  'computers+physics': { id: 'embedded_systems', name: 'Embedded Systems', category: 'subject' },
  'computers+embedded_systems': { id: 'hardware_engineering', name: 'Hardware Engineering', category: 'subject' },
  'hardware_engineering+logic': { id: 'robotics', name: 'Robotics', category: 'subject' },
  'robotics+ai': { id: 'embedded_ai', name: 'Embedded AI', category: 'subject' },
  'biology+chemistry': { id: 'biochemistry', name: 'Biochemistry', category: 'subject' },
  'science+writing': { id: 'research', name: 'Research', category: 'experience' },
  'creativity+writing': { id: 'design', name: 'Design', category: 'skill' },
  'computers+design': { id: 'uiux', name: 'UI/UX Design', category: 'skill' },
  'uiux+programming': { id: 'frontend', name: 'Frontend Development', category: 'skill' },
  'programming+servers': { id: 'backend', name: 'Backend Development', category: 'skill' },
  'backend+frontend': { id: 'fullstack', name: 'Fullstack Development', category: 'skill' },
  'computers+servers': { id: 'cloud_computing', name: 'Cloud Computing', category: 'subject' },
  'computers+security': { id: 'cybersecurity', name: 'Cybersecurity', category: 'skill' },
  'business+finance': { id: 'investment', name: 'Investment', category: 'subject' },
  'business+economics': { id: 'commerce', name: 'Commerce', category: 'subject' },
  'finance+statistics': { id: 'quantitative_finance', name: 'Quantitative Finance', category: 'subject' },
  'ai+agriculture': { id: 'precision_agri', name: 'Precision Agriculture', category: 'subject' },
  
  // Experiences
  'business+people': { id: 'management', name: 'Management', category: 'skill' },
  'curiosity+learning': { id: 'learning', name: 'Learning', category: 'skill' },
  'computers+internet': { id: 'open_source', name: 'Open Source', category: 'experience' },
  'computers+creativity': { id: 'hackathons', name: 'Hackathons', category: 'experience' },
  'people+writing': { id: 'communication', name: 'Communication', category: 'skill' },
  'people+management': { id: 'leadership', name: 'Leadership', category: 'skill' },
  'software_engineering+industry': { id: 'internship', name: 'Internship', category: 'experience' },
  'internship+experience': { id: 'work_experience', name: 'Work Experience', category: 'experience' },
  'research+writing': { id: 'publications', name: 'Publications', category: 'experience' },
  'research+publications': { id: 'research_papers', name: 'Research Papers', category: 'experience' },
  'hackathons+open_source': { id: 'projects', name: 'Projects', category: 'experience' },
  'programming+projects': { id: 'portfolio', name: 'Portfolio', category: 'experience' },
  
  // Certifications
  'cloud_computing+test': { id: 'aws_cert', name: 'AWS Certification', category: 'certification' },
  'cloud_computing+learning': { id: 'gcp_cert', name: 'Google Cloud Certification', category: 'certification' },
  'finance+learning': { id: 'cfa', name: 'CFA', category: 'certification' },
  'management+learning': { id: 'pmp', name: 'PMP', category: 'certification' },

  // Base intermediate components
  'science+science': { id: 'laboratory', name: 'Laboratory', category: 'experience' },
  'business+science': { id: 'industry', name: 'Industry', category: 'subject' },
  'business+business': { id: 'startup', name: 'Startup', category: 'experience' },
  'people+people': { id: 'networking', name: 'Networking', category: 'skill' },
  'computers+computers': { id: 'internet', name: 'Internet', category: 'subject' },
  'internet+servers': { id: 'cloud', name: 'Cloud', category: 'subject' },
  'computers+networking': { id: 'servers', name: 'Servers', category: 'subject' },
  'finance+finance': { id: 'economy', name: 'Economy', category: 'subject' },
  'logic+logic': { id: 'reasoning', name: 'Reasoning', category: 'skill' },
  'writing+writing': { id: 'journalism', name: 'Journalism', category: 'experience' },
  'math+math': { id: 'algebra', name: 'Algebra', category: 'subject' },
  'science+math': { id: 'physics', name: 'Physics', category: 'subject' },
  'science+physics': { id: 'chemistry', name: 'Chemistry', category: 'subject' },
  'science+chemistry': { id: 'biology', name: 'Biology', category: 'subject' },
  'science+star': { id: 'astronomy', name: 'Astronomy', category: 'subject' },
  'physics+astronomy': { id: 'space', name: 'Space', category: 'subject' },
  'people+logic': { id: 'psychology', name: 'Psychology', category: 'subject' },
  
  // Connectors
  'study+learning': { id: 'university', name: 'University', category: 'experience' },
  'curiosity+science': { id: 'study', name: 'Study', category: 'experience' },
  'creativity+creativity': { id: 'art', name: 'Art', category: 'subject' },
  'logic+security': { id: 'test', name: 'Test', category: 'skill' },
  'programming+internet': { id: 'security', name: 'Security', category: 'skill' },
  
  // Careers
  'btech_cs+internship': { id: 'software_engineer', name: 'Software Engineer', category: 'career' },
  'programming+dsa': { id: 'software_engineer_alt', name: 'Software Engineer', category: 'career' },
  'datascience+industry': { id: 'data_scientist', name: 'Data Scientist', category: 'career' },
  'quantitative_finance+research': { id: 'quant_researcher', name: 'Quant Researcher', category: 'career' },
  'md+work_experience': { id: 'doctor', name: 'Doctor', category: 'career' },
  'mbbs+work_experience': { id: 'doctor_alt', name: 'Doctor', category: 'career' },
  'space+hardware_engineering': { id: 'aerospace_engineer', name: 'Aerospace Engineer', category: 'career' },
  'robotics+embedded_ai': { id: 'robotics_engineer', name: 'Robotics Engineer', category: 'career' },
  'investment+mba': { id: 'investment_banker', name: 'Investment Banker', category: 'career' },
  'investment+cfa': { id: 'investment_banker_alt', name: 'Investment Banker', category: 'career' },
  'startup+leadership': { id: 'entrepreneur', name: 'Entrepreneur', category: 'career' },
  'precision_agri+robotics': { id: 'precision_agri_eng', name: 'Precision Agriculture Engineer', category: 'career' },
  'quantitative_finance+statistics': { id: 'quant_analyst', name: 'Quantitative Analyst', category: 'career' },
  'quantum_computing+research': { id: 'quantum_researcher', name: 'Quantum Researcher', category: 'career' },
  'quantum_physics+research': { id: 'quantum_physicist', name: 'Quantum Physicist', category: 'career' },
  'biochemistry+medicine': { id: 'biochemist', name: 'Biochemist', category: 'career' },
  'cybersecurity+fullstack': { id: 'devsecops_eng', name: 'DevSecOps Engineer', category: 'career' },
  'uiux+management': { id: 'product_manager', name: 'Product Manager', category: 'career' },
  'mba+projects': { id: 'product_manager_alt', name: 'Product Manager', category: 'career' }
};

// Helper to check and resolve recipes
export const combineElements = (
  elementA: CraftElement,
  elementB: CraftElement,
  existingElementsCount: number
): { element: CraftElement; isNew: boolean; isFirstWorldwide: boolean } => {
  const sortedIds = [elementA.id, elementB.id].sort().join('+');
  
  // Check predefined recipes
  const predefined = PREDEFINED_RECIPES[sortedIds];
  if (predefined) {
    const isNew = true; // caller will verify if it's already in unlocked elements
    return {
      element: {
        ...predefined,
        rarity: Math.max(10, 100 - (predefined.name.length * 3) - Math.floor(Math.random() * 15)),
      },
      isNew,
      isFirstWorldwide: false
    };
  }

  // Dynamic Generator: Fallback for combinatorics that are not hardcoded
  // Makes the game infinite and extremely responsive to player creativity.
  const nameA = elementA.name;
  const nameB = elementB.name;
  
  // Determine new ID and Name based on patterns
  let newId = '';
  let newName = '';
  let newCategory: ElementCategory = 'skill';
  
  if (elementA.category === 'subject' && elementB.category === 'subject') {
    newName = `${nameA}-${nameB} Hybrid`;
    newCategory = 'subject';
  } else if (elementA.category === 'degree' || elementB.category === 'degree') {
    const deg = elementA.category === 'degree' ? nameA : nameB;
    const subj = elementA.category === 'degree' ? nameB : nameA;
    newName = `${deg} in ${subj}`;
    newCategory = 'degree';
  } else if (elementA.category === 'career' || elementB.category === 'career') {
    const career = elementA.category === 'career' ? nameA : nameB;
    const modifier = elementA.category === 'career' ? nameB : nameA;
    newName = `${modifier} ${career}`;
    newCategory = 'career';
  } else if (elementA.category === 'certification' || elementB.category === 'certification') {
    const cert = elementA.category === 'certification' ? nameA : nameB;
    const mod = elementA.category === 'certification' ? nameB : nameA;
    newName = `${mod}-certified ${cert}`;
    newCategory = 'certification';
  } else if (elementA.category === 'experience' || elementB.category === 'experience') {
    const exp = elementA.category === 'experience' ? nameA : nameB;
    const mod = elementA.category === 'experience' ? nameB : nameA;
    newName = `${mod} ${exp}`;
    newCategory = 'experience';
  } else {
    newName = `${nameA} & ${nameB}`;
    newCategory = 'skill';
  }

  // Sanitize ID
  newId = newName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
  if (!newId) newId = `custom_${Date.now()}`;

  // Random chance of "First Discovery Worldwide!" for dynamic combinations
  // In Infinite Craft, obscure combinations trigger first discoveries.
  const hash = (newId.length * 7) + (existingElementsCount * 3);
  const isFirstWorldwide = hash % 7 === 0;

  return {
    element: {
      id: newId,
      name: newName,
      category: newCategory,
      isCustom: true,
      rarity: Math.floor(Math.random() * 40) + 60, // Custom combinations are rarer (higher percentage)
      description: `A unique craft of ${nameA} and ${nameB}.`
    },
    isNew: true,
    isFirstWorldwide
  };
};

// 3. Career Path Blueprints for Dream Job Mode
export const CAREER_BLUEPRINTS: CareerBlueprint[] = [
  {
    id: 'software_engineer',
    name: 'Software Engineer',
    description: 'Builds, designs, and maintains software applications and operating systems using software engineering principles and computer science.',
    mandatory: ['Programming', 'Data Structures & Algorithms', 'Computers'],
    recommended: ['Internship', 'Open Source', 'BTech Computer Science'],
    bonus: ['Hackathons', 'AWS Certification', 'Fullstack Development'],
    pathways: [
      ['Computers + Logic = Programming'],
      ['Computers + Science = Computer Science'],
      ['Computer Science + Science = BTech Computer Science'],
      ['Algorithm + Programming = Data Structures'],
      ['Data Structures + Programming = Data Structures & Algorithms'],
      ['BTech Computer Science + Internship = Software Engineer']
    ]
  },
  {
    id: 'data_scientist',
    name: 'Data Scientist',
    description: 'Analyzes and interprets complex data sets to help organizations make data-driven decisions using machine learning and statistics.',
    mandatory: ['Statistics', 'Programming', 'Machine Learning'],
    recommended: ['Data Science', 'Research', 'BTech Computer Science'],
    bonus: ['Hackathons', 'Publications', 'Artificial Intelligence'],
    pathways: [
      ['Math + Logic = Statistics'],
      ['Computers + Logic = Programming'],
      ['Programming + Statistics = Data Science'],
      ['Computers + Learning = Machine Learning'],
      ['Data Science + Industry = Data Scientist']
    ]
  },
  {
    id: 'quant_researcher',
    name: 'Quant Researcher',
    description: 'Applies sophisticated mathematical and statistical models to identify and exploit financial market opportunities for trading firms.',
    mandatory: ['Mathematics', 'Quantitative Finance', 'Statistics'],
    recommended: ['Programming', 'Research', 'PhD'],
    bonus: ['Finance', 'Publications', 'Machine Learning'],
    pathways: [
      ['Finance + Statistics = Quantitative Finance'],
      ['Science + Writing = Research'],
      ['Physics + University = MSc Physics'],
      ['MSc Physics + Research = PhD'],
      ['Quantitative Finance + Research = Quant Researcher']
    ]
  },
  {
    id: 'doctor',
    name: 'Doctor',
    description: 'Diagnoses, treats, and prevents diseases, physiological disorders, and injuries, maintaining public health and medical standards.',
    mandatory: ['Medicine', 'MBBS', 'Biology'],
    recommended: ['Chemistry', 'Research', 'Internship'],
    bonus: ['MD', 'Publications', 'Leadership'],
    pathways: [
      ['Science + Health = Medicine'],
      ['Science + Chemistry = Biology'],
      ['Medicine + University = MBBS'],
      ['MBBS + Research = MD'],
      ['MD + Work Experience = Doctor']
    ]
  },
  {
    id: 'aerospace_engineer',
    name: 'Aerospace Engineer',
    description: 'Designs, manufactures, and tests aircraft, spacecraft, satellites, and missiles using physics and advanced materials.',
    mandatory: ['Space', 'Physics', 'Mathematics'],
    recommended: ['Hardware Engineering', 'Research', 'MSc Physics'],
    bonus: ['PhD', 'Leadership', 'AWS Certification'],
    pathways: [
      ['Science + Math = Physics'],
      ['Science + Chemistry = Biology'],
      ['Physics + Astronomy = Space'],
      ['Computers + Physics = Embedded Systems'],
      ['Computers + Embedded Systems = Hardware Engineering'],
      ['Space + Hardware Engineering = Aerospace Engineer']
    ]
  },
  {
    id: 'robotics_engineer',
    name: 'Robotics Engineer',
    description: 'Designs, builds, and maintains robots and robotic systems, combining software, electrical engineering, and mechanics.',
    mandatory: ['Robotics', 'Programming', 'Embedded Systems'],
    recommended: ['Hardware Engineering', 'Internship', 'Logic'],
    bonus: ['Hackathons', 'Research', 'Embedded AI'],
    pathways: [
      ['Computers + Physics = Embedded Systems'],
      ['Computers + Embedded Systems = Hardware Engineering'],
      ['Hardware Engineering + Logic = Robotics'],
      ['Robotics + Embedded AI = Robotics Engineer']
    ]
  },
  {
    id: 'investment_banker',
    name: 'Investment Banker',
    description: 'Helps corporations, governments, and other entities raise capital and provides advisory services for mergers, acquisitions, and restructuring.',
    mandatory: ['Finance', 'Investment', 'Business'],
    recommended: ['MBA', 'Internship', 'Economics'],
    bonus: ['CFA', 'Leadership', 'Networking'],
    pathways: [
      ['Business + Finance = Investment'],
      ['Business + Management = MBA'],
      ['Investment + MBA = Investment Banker']
    ]
  },
  {
    id: 'entrepreneur',
    name: 'Entrepreneur',
    description: 'Builds and launches a new startup or business enterprise, managing risk, leadership, and operational strategies to create value.',
    mandatory: ['Business', 'Leadership', 'Startup'],
    recommended: ['MBA', 'Management', 'Networking'],
    bonus: ['Finance', 'Marketing', 'PMP'],
    pathways: [
      ['Business + Business = Startup'],
      ['People + Management = Leadership'],
      ['Startup + Leadership = Entrepreneur']
    ]
  }
];
