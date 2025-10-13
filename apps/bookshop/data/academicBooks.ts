export interface AcademicBook {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  edition: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'textbook' | 'reference' | 'research' | 'professional';
  subject: string;
  gradeLevel?: string;
  curriculum?: string;
  description: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  features: string[];
  specifications: { [key: string]: string };
}

export const academicBooks: AcademicBook[] = [
  // Primary School Textbooks
  {
    id: "textbook_1",
    title: "New Primary Mathematics Grade 1",
    author: "Kenya Institute of Curriculum Development",
    isbn: "978-9966-25-123-4",
    publisher: "Kenya Literature Bureau",
    edition: "2023 Edition",
    price: 450,
    originalPrice: 500,
    image: "https://images.unsplash.com/photo-1509266272358-7701da638078?w=500&h=500&fit=crop",
    category: "textbook",
    subject: "Mathematics",
    gradeLevel: "Grade 1",
    curriculum: "Competency Based Curriculum (CBC)",
    description: "Comprehensive mathematics textbook aligned with CBC for Grade 1 learners",
    inStock: true,
    rating: 4.7,
    reviews: 234,
    features: [
      "CBC aligned content",
      "Colorful illustrations",
      "Activity-based learning",
      "Assessment exercises"
    ],
    specifications: {
      "Pages": "120 pages",
      "Language": "English",
      "Format": "Paperback",
      "Curriculum": "CBC",
      "Subject": "Mathematics"
    }
  },
  {
    id: "textbook_2",
    title: "English Activities Grade 3",
    author: "Longhorn Publishers",
    isbn: "978-9966-56-789-0",
    publisher: "Longhorn Publishers",
    edition: "Revised 2023",
    price: 520,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
    category: "textbook",
    subject: "English",
    gradeLevel: "Grade 3",
    curriculum: "Competency Based Curriculum (CBC)",
    description: "Interactive English language activities for Grade 3 CBC curriculum",
    inStock: true,
    rating: 4.5,
    reviews: 189,
    features: [
      "Interactive exercises",
      "Speaking and listening activities",
      "Reading comprehension",
      "Writing practice"
    ],
    specifications: {
      "Pages": "150 pages",
      "Language": "English",
      "Format": "Paperback",
      "Curriculum": "CBC",
      "Subject": "English Language"
    }
  },
  // Secondary School Textbooks
  {
    id: "textbook_3",
    title: "Secondary Mathematics Form 1",
    author: "KLB Mathematics Team",
    isbn: "978-9966-44-567-8",
    publisher: "Kenya Literature Bureau",
    edition: "2023 Edition",
    price: 780,
    originalPrice: 850,
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&h=500&fit=crop",
    category: "textbook",
    subject: "Mathematics",
    gradeLevel: "Form 1",
    curriculum: "8-4-4 System",
    description: "Comprehensive mathematics textbook for Form 1 students",
    inStock: true,
    rating: 4.8,
    reviews: 456,
    features: [
      "KNEC syllabus aligned",
      "Worked examples",
      "Practice exercises",
      "Revision questions"
    ],
    specifications: {
      "Pages": "280 pages",
      "Language": "English",
      "Format": "Paperback",
      "Curriculum": "8-4-4",
      "Subject": "Mathematics"
    }
  },
  {
    id: "textbook_4",
    title: "Chemistry Form 3 Student's Book",
    author: "Dr. Sarah Wanjiku & Prof. John Mwangi",
    isbn: "978-9966-78-901-2",
    publisher: "Oxford University Press East Africa",
    edition: "3rd Edition 2023",
    price: 1250,
    originalPrice: 1400,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&h=500&fit=crop",
    category: "textbook",
    subject: "Chemistry",
    gradeLevel: "Form 3",
    curriculum: "8-4-4 System",
    description: "Advanced chemistry concepts for Form 3 students with practical experiments",
    inStock: true,
    rating: 4.9,
    reviews: 312,
    features: [
      "Laboratory experiments",
      "Chemical equations",
      "Real-world applications",
      "KCSE preparation"
    ],
    specifications: {
      "Pages": "350 pages",
      "Language": "English",
      "Format": "Paperback with CD",
      "Curriculum": "8-4-4",
      "Subject": "Chemistry"
    }
  },
  // University/Professional Books
  {
    id: "professional_1",
    title: "Advanced Engineering Mathematics",
    author: "Erwin Kreyszig",
    isbn: "978-0-470-45836-5",
    publisher: "Wiley",
    edition: "10th Edition",
    price: 8500,
    originalPrice: 9500,
    image: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?w=500&h=500&fit=crop",
    category: "professional",
    subject: "Engineering Mathematics",
    description: "Comprehensive mathematical methods for engineering students and professionals",
    inStock: true,
    rating: 4.6,
    reviews: 89,
    features: [
      "Comprehensive coverage",
      "Real engineering applications",
      "Problem-solving techniques",
      "Online resources"
    ],
    specifications: {
      "Pages": "1264 pages",
      "Language": "English",
      "Format": "Hardcover",
      "Level": "University/Professional",
      "Subject": "Engineering Mathematics"
    }
  },
  {
    id: "professional_2",
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    isbn: "978-1-305-58512-4",
    publisher: "Cengage Learning",
    edition: "8th Edition",
    price: 7200,
    originalPrice: 8000,
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&h=500&fit=crop",
    category: "professional",
    subject: "Economics",
    description: "Foundational economics textbook for university students",
    inStock: true,
    rating: 4.4,
    reviews: 156,
    features: [
      "Real-world examples",
      "Case studies",
      "Economic principles",
      "Policy analysis"
    ],
    specifications: {
      "Pages": "888 pages",
      "Language": "English",
      "Format": "Paperback",
      "Level": "University",
      "Subject": "Economics"
    }
  },
  {
    id: "reference_1",
    title: "Medical Microbiology Reference",
    author: "Patrick R. Murray, Ken S. Rosenthal",
    isbn: "978-0-323-29956-5",
    publisher: "Elsevier",
    edition: "8th Edition",
    price: 12500,
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=500&h=500&fit=crop",
    category: "reference",
    subject: "Medical Microbiology",
    description: "Comprehensive reference for medical students and healthcare professionals",
    inStock: true,
    rating: 4.8,
    reviews: 67,
    features: [
      "Clinical correlations",
      "Diagnostic procedures",
      "Pathogen identification",
      "Treatment guidelines"
    ],
    specifications: {
      "Pages": "960 pages",
      "Language": "English",
      "Format": "Hardcover",
      "Level": "Professional/Graduate",
      "Subject": "Medical Microbiology"
    }
  },
  {
    id: "research_1",
    title: "Research Methods in Psychology",
    author: "John J. Shaughnessy, Eugene B. Zechmeister",
    isbn: "978-0-077-86187-8",
    publisher: "McGraw-Hill Education",
    edition: "10th Edition",
    price: 6800,
    originalPrice: 7500,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop",
    category: "research",
    subject: "Psychology Research Methods",
    description: "Comprehensive guide to psychological research methodology",
    inStock: true,
    rating: 4.5,
    reviews: 123,
    features: [
      "Research design",
      "Statistical analysis",
      "Ethical considerations",
      "Data interpretation"
    ],
    specifications: {
      "Pages": "640 pages",
      "Language": "English",
      "Format": "Paperback",
      "Level": "University/Graduate",
      "Subject": "Psychology"
    }
  }
];

export const gradelevels = [
  "Pre-Primary",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9",
  "Form 1", "Form 2", "Form 3", "Form 4",
  "University", "Professional", "Graduate"
];

export const subjects = [
  "Mathematics", "English", "Kiswahili", "Science", "Social Studies",
  "Chemistry", "Physics", "Biology", "Geography", "History",
  "Computer Science", "Business Studies", "Economics", "Accounting",
  "Engineering", "Medicine", "Psychology", "Education", "Law"
];

export const curriculums = [
  "Competency Based Curriculum (CBC)",
  "8-4-4 System",
  "International Baccalaureate (IB)",
  "Cambridge International",
  "University Level"
];

export function getAcademicBooksByGrade(gradeLevel: string): AcademicBook[] {
  return academicBooks.filter(book => book.gradeLevel === gradeLevel);
}

export function getAcademicBooksBySubject(subject: string): AcademicBook[] {
  return academicBooks.filter(book => book.subject === subject);
}

export function getAcademicBooksByCurriculum(curriculum: string): AcademicBook[] {
  return academicBooks.filter(book => book.curriculum === curriculum);
}

export function getAcademicBooksByCategory(category: string): AcademicBook[] {
  return academicBooks.filter(book => book.category === category);
}

export function searchAcademicBooks(query: string): AcademicBook[] {
  const lowercaseQuery = query.toLowerCase();
  return academicBooks.filter(book =>
    book.title.toLowerCase().includes(lowercaseQuery) ||
    book.author.toLowerCase().includes(lowercaseQuery) ||
    book.subject.toLowerCase().includes(lowercaseQuery) ||
    book.publisher.toLowerCase().includes(lowercaseQuery)
  );
}