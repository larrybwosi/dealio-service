export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  category: string;
  image: string;
  images: string[];
  rating: number;
  reviews: number;
  inStock: boolean;
  featured: boolean;
  tags: string[];
  specifications?: { [key: string]: string };
  features?: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "MacBook Pro M3 14-inch",
    price: 299999,
    originalPrice: 329999,
    description: "Powerful laptop with M3 chip for professionals and creatives",
    longDescription:
      "The MacBook Pro with M3 chip delivers exceptional performance for demanding workflows. With its advanced neural engine, stunning Liquid Retina XDR display, and all-day battery life, it's perfect for video editing, 3D rendering, software development, and creative work. The Space Black finish adds a premium touch to this professional-grade machine.",
    category: "Laptops",
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop",
      "https://unsplash.com/photos/an-open-laptop-computer-sitting-on-top-of-a-table-WPQF4r0JUcg",
      "https://unsplash.com/photos/a-cell-phone-on-a-table-RGxLchVZA20",
    ],
    rating: 4.8,
    reviews: 127,
    inStock: true,
    featured: true,
    tags: ["Apple", "M3 Chip", "Professional", "Creative", "Premium"],
    specifications: {
      Processor: "Apple M3 8-core CPU",
      Memory: "16GB Unified Memory",
      Storage: "512GB SSD",
      Display: "14.2-inch Liquid Retina XDR",
      Graphics: "10-core GPU",
      Battery: "Up to 22 hours",
      Weight: "1.55 kg",
      Ports: "3x Thunderbolt 4, HDMI, MagSafe 3",
    },
    features: [
      "M3 chip with 8-core CPU and 10-core GPU",
      "16GB unified memory for smooth multitasking",
      "512GB SSD storage with blazing-fast performance",
      "14.2-inch Liquid Retina XDR display with 1000 nits brightness",
      "Up to 22 hours of battery life",
      "Advanced camera and audio for video calls",
      "Three Thunderbolt 4 ports for versatile connectivity",
      "MagSafe 3 charging for quick and secure power",
    ],
  },
  {
    id: "2",
    name: "Think and Grow Rich by Napoleon Hill",
    price: 1299,
    originalPrice: 1599,
    description:
      "Classic personal development book on wealth and success principles",
    longDescription:
      "Napoleon Hill's timeless masterpiece reveals the secrets of success used by the world's most accomplished individuals. Based on interviews with over 500 successful people including Andrew Carnegie, Henry Ford, and Thomas Edison, this book outlines the 13 principles of success that can transform your life and career. A must-read for entrepreneurs, professionals, and anyone seeking personal growth.",
    category: "Books",
    image:
      "https://images.unsplash.com/photo-1671774637925-c11dd0051b60?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
    ],
    rating: 4.9,
    reviews: 89,
    inStock: true,
    featured: true,
    tags: ["Self-Help", "Business", "Success", "Classic", "Bestseller"],
    specifications: {
      Author: "Napoleon Hill",
      Pages: "320 pages",
      Publisher: "Sound Wisdom",
      Language: "English",
      ISBN: "978-1937879501",
      Format: "Paperback",
      Dimensions: "14 x 21 cm",
      Weight: "350g",
    },
    features: [
      "13 proven principles of success and wealth building",
      "Based on interviews with 500+ successful individuals",
      "Timeless wisdom applicable to any era or industry",
      "Practical exercises and action steps",
      "Classic personal development foundation",
      "Easy-to-read format with clear chapter structure",
      "Inspirational quotes and real-life examples",
      "Perfect for book clubs and study groups",
    ],
  },
  {
    id: "3",
    name: "Ergonomic Office Chair with Lumbar Support",
    price: 12999,
    originalPrice: 15999,
    description:
      "Professional office chair designed for comfort and productivity",
    longDescription:
      "This premium ergonomic office chair is engineered for professionals who spend long hours at their desk. Featuring adjustable lumbar support, breathable mesh backing, and multiple adjustment points, it promotes proper posture and reduces fatigue. The high-quality materials and sturdy construction ensure durability, while the sleek design complements any modern office environment.",
    category: "Office Supplies",
    image:
      "https://images.unsplash.com/photo-1688578735997-32626d2babd4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
    images: [
      "https://images.unsplash.com/photo-1683836809851-9e3aad661ffd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1461",
      "https://images.unsplash.com/photo-1580479928703-71ae234048bd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      "https://images.unsplash.com/photo-1701937188915-ec0dbcbe3963?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=765",
    ],
    rating: 4.6,
    reviews: 156,
    inStock: true,
    featured: true,
    tags: ["Ergonomic", "Office", "Comfort", "Professional", "Adjustable"],
    specifications: {
      Material: "Breathable mesh and premium fabric",
      "Weight Capacity": "150 kg",
      "Seat Height": "42-52 cm adjustable",
      Armrests: "3D adjustable",
      Base: "5-star aluminum base with smooth casters",
      "Lumbar Support": "Adjustable height and depth",
      Warranty: "5 years manufacturer warranty",
      Assembly: "Easy assembly with included tools",
    },
    features: [
      "Adjustable lumbar support for optimal spine alignment",
      "Breathable mesh back prevents heat buildup",
      "3D adjustable armrests for personalized comfort",
      "Seat height adjustment from 42-52 cm",
      "360-degree swivel with smooth-rolling casters",
      "High-density foam seat cushion for long-term comfort",
      "Tilt mechanism with tension control",
      "Professional appearance suitable for any office",
    ],
  },
  {
    id: "4",
    name: "Casio FX-991EX Scientific Calculator",
    price: 3499,
    description:
      "Advanced scientific calculator for students and professionals",
    longDescription:
      "The Casio FX-991EX is a powerful scientific calculator designed for advanced mathematics, engineering, and scientific applications. With over 550 functions, a high-resolution LCD display, and intuitive operation, it's perfect for students, engineers, and professionals. The calculator features natural textbook display, making complex calculations easier to input and verify.",
    category: "Calculators",
    image:
      "https://images.unsplash.com/photo-1574607383077-47ddc2dc51c4?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=736",
    images: [
      "https://plus.unsplash.com/premium_photo-1729005326801-d9c7b3f9f838?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fENhc2lvJTIwQ2FsY3VsYXRvcnxlbnwwfHwwfHx8MA%3D%3D",
      "https://unsplash.com/photos/a-person-holding-a-blue-calculator-in-their-hand-qSUQifQbu0g",
    ],
    rating: 4.7,
    reviews: 203,
    inStock: true,
    featured: false,
    tags: ["Scientific", "Student", "Engineering", "Mathematics", "Casio"],
    specifications: {
      Functions: "552 functions",
      Display: "Natural textbook display",
      Power: "Solar + battery (LR44)",
      Memory: "9 variable memories",
      Dimensions: "11.1 x 85.5 x 165.5 mm",
      Weight: "95g",
      Warranty: "2 years",
      Approved: "Exam approved in many countries",
    },
    features: [
      "552 built-in functions for advanced calculations",
      "Natural textbook display shows expressions as they appear in textbooks",
      "High-resolution LCD with improved readability",
      "Solar power with battery backup",
      "QR Code function for connecting to online resources",
      "Spreadsheet calculations capability",
      "Advanced statistics and regression analysis",
      "Approved for use in many standardized exams",
    ],
  },
  {
    id: "5",
    name: "Premium Notebook Set (5 Pack)",
    price: 899,
    originalPrice: 1199,
    description:
      "High-quality notebooks perfect for students and professionals",
    longDescription:
      "This premium notebook set includes five high-quality notebooks with different ruling styles to meet all your note-taking needs. Each notebook features thick, smooth paper that prevents ink bleed-through, durable covers, and lay-flat binding. Perfect for students, professionals, and anyone who values quality stationery for their daily writing needs.",
    category: "Stationery",
    image:
      "https://images.unsplash.com/photo-1611571741792-edb58d0ceb67?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8UHJlbWl1bSUyME5vdGVib29rJTIwU2V0fGVufDB8fDB8fHww",
    images: [
      "https://unsplash.com/photos/three-notebooks-sitting-next-to-each-other-on-a-table-R2ffCkYlpJ8",
      "https://images.unsplash.com/photo-1636014701699-f086cd23fab6?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8UHJlbWl1bSUyME5vdGVib29rJTIwU2V0fGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1722929025573-3d461531ac4d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fFByZW1pdW0lMjBOb3RlYm9vayUyMFNldHxlbnwwfHwwfHx8MA%3D%3D",
    ],
    rating: 4.4,
    reviews: 78,
    inStock: true,
    featured: false,
    tags: ["Notebooks", "Stationery", "Student", "Professional", "Premium"],
    specifications: {
      Quantity: "5 notebooks",
      Pages: "200 pages per notebook",
      "Paper Weight": "80 GSM",
      Size: "A5 (14.8 x 21 cm)",
      Ruling: "Lined, dotted, grid, blank, and ruled",
      Binding: "Perfect bound with lay-flat design",
      Cover: "Durable cardstock with matte finish",
      Paper: "Acid-free, fountain pen friendly",
    },
    features: [
      "Five different ruling styles for various uses",
      "200 pages per notebook for extended use",
      "80 GSM paper prevents ink bleed-through",
      "Lay-flat binding for comfortable writing",
      "Durable covers with elegant matte finish",
      "Fountain pen and marker friendly paper",
      "Perfect A5 size for portability",
      "Acid-free paper for long-term preservation",
    ],
  },
  {
    id: "6",
    name: "Professional Art Supplies Kit",
    price: 4599,
    originalPrice: 5999,
    description:
      "Complete art kit with colored pencils, markers, and sketchbooks",
    longDescription:
      "This comprehensive art supplies kit is perfect for artists, students, and creative enthusiasts. The kit includes professional-grade colored pencils, fine-tip markers, graphite pencils, erasers, and premium sketchbooks. All supplies are organized in a convenient carrying case, making it perfect for studio work, plein air painting, or travel. Whether you're a beginner or experienced artist, this kit provides everything needed to create beautiful artwork.",
    category: "Art Supplies",
    image:
      "https://images.unsplash.com/photo-1618275341069-262c9ddc62ec?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fEFydCUyMFN1cHBsaWVzJTIwS2l0fGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
    images: [
      "https://images.unsplash.com/photo-1759523081055-05bcf5d10787?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fEFydCUyMFN1cHBsaWVzJTIwS2l0fGVufDB8fDB8fHww",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1596548438137-d51ea5c83ca4?w=800&h=600&fit=crop",
    ],
    rating: 4.5,
    reviews: 92,
    inStock: true,
    featured: false,
    tags: ["Art", "Creative", "Drawing", "Professional", "Complete Kit"],
    specifications: {
      "Colored Pencils": "48 professional-grade pencils",
      Markers: "24 fine-tip markers",
      "Graphite Pencils": "12 pencils (2H to 8B)",
      Sketchbooks: "3 books (different paper textures)",
      Erasers: "Kneaded and white erasers included",
      Case: "Durable zippered carrying case",
      "Blending Tools": "Tortillons and blending stumps",
      Accessories: "Pencil sharpener and ruler",
    },
    features: [
      "48 vibrant colored pencils with smooth application",
      "24 fine-tip markers for detailed work",
      "Complete range of graphite pencils from 2H to 8B",
      "Three sketchbooks with different paper textures",
      "Professional blending tools for smooth gradients",
      "Durable carrying case for organization and portability",
      "High-quality erasers for clean corrections",
      "Perfect for beginners and experienced artists",
    ],
  },
  {
    id: "7",
    name: "Wireless Bluetooth Headphones",
    price: 7999,
    originalPrice: 9999,
    description: "Premium noise-canceling headphones for music and calls",
    longDescription:
      "Experience superior audio quality with these premium wireless Bluetooth headphones. Featuring active noise cancellation, 30-hour battery life, and crystal-clear call quality, they're perfect for music lovers, professionals, and students. The comfortable over-ear design and premium materials ensure all-day comfort, while the quick-charge feature provides hours of playback with just minutes of charging.",
    category: "Electronics",
    image:
      "https://plus.unsplash.com/premium_photo-1679865289918-b21aae5a9559?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fEJsdWV0b290aCUyMEhlYWRwaG9uZXN8ZW58MHx8MHx8fDA%3D&auto=format",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800&h=600&fit=crop",
    ],
    rating: 4.6,
    reviews: 134,
    inStock: true,
    featured: false,
    tags: ["Wireless", "Bluetooth", "Noise Canceling", "Premium", "Audio"],
    specifications: {
      "Battery Life": "30 hours with ANC on",
      Charging: "USB-C quick charge",
      Bluetooth: "5.0 with multipoint connection",
      "Noise Cancellation": "Active noise cancellation",
      Drivers: "40mm dynamic drivers",
      Weight: "250g",
      Range: "Up to 10 meters",
      Microphone: "Built-in for calls",
    },
    features: [
      "Active noise cancellation blocks external sounds",
      "30-hour battery life for extended listening",
      "Quick charge: 15 minutes = 3 hours playback",
      "Bluetooth 5.0 with stable connection",
      "Premium 40mm drivers for rich sound",
      "Comfortable over-ear design with soft padding",
      "Built-in microphone for clear calls",
      "Foldable design for easy storage and travel",
    ],
  },
  {
    id: "8",
    name: "Mechanical Gaming Keyboard",
    price: 8999,
    description: "RGB backlit mechanical keyboard for gaming and typing",
    longDescription:
      "This premium mechanical gaming keyboard features tactile switches, customizable RGB lighting, and durable construction. Perfect for gamers and professionals who demand precision and reliability. The keyboard includes programmable keys, multiple lighting effects, and a comfortable wrist rest for extended use sessions.",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1626155399627-86488538895d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8R2FtaW5nJTIwS2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    images: [
      "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop",
    ],
    rating: 4.7,
    reviews: 89,
    inStock: true,
    featured: false,
    tags: ["Gaming", "Mechanical", "RGB", "Keyboard", "Professional"],
    specifications: {
      Switches: "Mechanical tactile switches",
      Backlighting: "RGB with 16.7M colors",
      Connection: "USB-C wired",
      "Key Layout": "Full-size 104 keys",
      "Polling Rate": "1000Hz",
      "Key Life": "50 million keystrokes",
      Cable: "1.8m braided cable",
      Compatibility: "Windows, Mac, Linux",
    },
    features: [
      "Mechanical switches for tactile feedback",
      "Customizable RGB lighting with multiple effects",
      "Programmable keys and macros",
      "Anti-ghosting and N-key rollover",
      "Durable aluminum frame construction",
      "Comfortable wrist rest included",
      "Software for customization",
      "Compatible with multiple operating systems",
    ],
  },
  {
    id: "9",
    name: "Digital Drawing Tablet",
    price: 15999,
    originalPrice: 19999,
    description:
      "Professional drawing tablet for digital artists and designers",
    longDescription:
      "This professional-grade drawing tablet is perfect for digital artists, graphic designers, and illustrators. Featuring 8192 levels of pressure sensitivity, a large active area, and customizable express keys, it provides natural drawing experience. Compatible with major design software and includes a battery-free stylus with tilt recognition.",
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=500&h=500&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1637243218672-d338945efdf7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8R2FtaW5nJTIwS2V5Ym9hcmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop",
    ],
    rating: 4.8,
    reviews: 67,
    inStock: true,
    featured: false,
    tags: ["Digital Art", "Drawing", "Tablet", "Professional", "Creative"],
    specifications: {
      "Active Area": "10 x 6.25 inches",
      "Pressure Levels": "8192 levels",
      Resolution: "5080 LPI",
      "Report Rate": "233 PPS",
      "Express Keys": "8 customizable keys",
      Stylus: "Battery-free with tilt recognition",
      Compatibility: "Windows, Mac, Android",
      Connectivity: "USB-C",
    },
    features: [
      "8192 pressure sensitivity levels for natural drawing",
      "Large 10x6.25 inch active drawing area",
      "Battery-free stylus with tilt recognition",
      "8 customizable express keys for shortcuts",
      "Compatible with Photoshop, Illustrator, and more",
      "Works with Windows, Mac, and Android devices",
      "Slim and portable design",
      "Includes drawing software bundle",
    ],
  },
  {
    id: "10",
    name: "Business Presentation Remote",
    price: 2999,
    description:
      "Wireless presenter remote with laser pointer for presentations",
    longDescription:
      "This professional presentation remote is essential for business presentations, lectures, and meetings. Features wireless connectivity up to 30 meters, red laser pointer, and intuitive controls. The ergonomic design fits comfortably in your hand, and the USB receiver stores conveniently in the device. Perfect for professionals, teachers, and public speakers.",
    category: "Office Supplies",
    image:
      "https://images.unsplash.com/photo-1750768145390-f0ad18d3e65b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8QnVzaW5lc3MlMjBQcmVzZW50YXRpb24lMjBSZW1vdGV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=500",
    images: [
      "https://images.unsplash.com/photo-1745266073009-6aa3a4d7446b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fEJ1c2luZXNzJTIwUHJlc2VudGF0aW9uJTIwUmVtb3RlfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
      "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=800&h=600&fit=crop",
    ],
    rating: 4.3,
    reviews: 45,
    inStock: true,
    featured: false,
    tags: [
      "Presentation",
      "Remote",
      "Business",
      "Laser Pointer",
      "Professional",
    ],
    specifications: {
      Range: "Up to 30 meters",
      Laser: "Red laser pointer (Class 2)",
      Battery: "AAA x 2 (included)",
      Connectivity: "2.4GHz wireless",
      Compatibility: "Windows, Mac, Linux",
      Dimensions: "14 x 3 x 2 cm",
      Weight: "85g",
      Storage: "USB receiver storage slot",
    },
    features: [
      "Wireless range up to 30 meters",
      "Built-in red laser pointer for highlighting",
      "Intuitive slide navigation controls",
      "Ergonomic design for comfortable grip",
      "USB receiver with convenient storage",
      "Compatible with PowerPoint, Keynote, and more",
      "Long battery life with power-saving mode",
      "Plug-and-play setup with no software required",
    ],
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function searchProducts(query: string): Product[] {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
  );
}
