export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
}

export const reviews: Review[] = [
  // MacBook Pro M3 Reviews
  {
    id: "r1",
    productId: "1",
    userId: "u1",
    userName: "Sarah Kimani",
    userAvatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Perfect for my design work",
    content:
      "This MacBook Pro has transformed my workflow. The M3 chip handles complex design projects effortlessly, and the display quality is outstanding. Battery life easily lasts a full workday. Highly recommend for creative professionals.",
    date: "2024-01-15",
    verified: true,
    helpful: 24,
  },
  {
    id: "r2",
    productId: "1",
    userId: "u2",
    userName: "James Ochieng",
    userAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Excellent performance",
    content:
      "Fast delivery from BookHub and the laptop exceeded expectations. Perfect for software development and the build quality is premium. Worth every shilling.",
    date: "2024-01-10",
    verified: true,
    helpful: 18,
  },
  {
    id: "r3",
    productId: "1",
    userId: "u3",
    userName: "Grace Wanjiku",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    title: "Great laptop, minor issues",
    content:
      "Overall excellent machine. The only downside is it gets warm during intensive tasks, but performance is still top-notch. Customer service from BookHub was very helpful.",
    date: "2024-01-08",
    verified: true,
    helpful: 12,
  },

  // Think and Grow Rich Reviews
  {
    id: "r4",
    productId: "2",
    userId: "u4",
    userName: "Dr. Mary Njeri",
    userAvatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Life-changing book",
    content:
      "This classic has influenced my mindset tremendously. Napoleon Hill's principles are timeless and applicable to any field. A must-read for anyone serious about success.",
    date: "2024-01-12",
    verified: true,
    helpful: 31,
  },
  {
    id: "r5",
    productId: "2",
    userId: "u5",
    userName: "Peter Mwangi",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Essential reading",
    content:
      "Bought this for my book club. The concepts are profound and the writing is engaging. BookHub's delivery was prompt and the book quality is excellent.",
    date: "2024-01-05",
    verified: true,
    helpful: 15,
  },

  // Office Chair Reviews
  {
    id: "r6",
    productId: "3",
    userId: "u6",
    userName: "Linda Akinyi",
    userAvatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    title: "Comfortable and sturdy",
    content:
      "Great chair for long work sessions. The lumbar support is excellent and assembly was straightforward. Only wish the armrests were more adjustable.",
    date: "2024-01-14",
    verified: true,
    helpful: 22,
  },
  {
    id: "r7",
    productId: "3",
    userId: "u7",
    userName: "Michael Kiprop",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Perfect for home office",
    content:
      "Exactly what I needed for my home office setup. The chair is well-built and comfortable for 8+ hour work days. Great value for money.",
    date: "2024-01-11",
    verified: true,
    helpful: 19,
  },

  // Scientific Calculator Reviews
  {
    id: "r8",
    productId: "4",
    userId: "u8",
    userName: "Faith Wanjiru",
    userAvatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Perfect for engineering studies",
    content:
      "This calculator has all the functions I need for my engineering coursework. The display is clear and the build quality is solid. Highly recommended for STEM students.",
    date: "2024-01-13",
    verified: true,
    helpful: 16,
  },

  // Notebook Set Reviews
  {
    id: "r9",
    productId: "5",
    userId: "u9",
    userName: "David Kamau",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    rating: 4,
    title: "Good quality notebooks",
    content:
      "Nice paper quality and the covers are durable. Perfect for note-taking in lectures. The set offers good value and the delivery from BookHub was fast.",
    date: "2024-01-09",
    verified: true,
    helpful: 13,
  },

  // Art Supplies Reviews
  {
    id: "r10",
    productId: "6",
    userId: "u10",
    userName: "Rebecca Nyong'o",
    userAvatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face",
    rating: 5,
    title: "Excellent art supplies",
    content:
      "The colored pencils are vibrant and blend well. The sketchbooks have good paper weight. Everything I needed to start my art journey. BookHub's packaging was also very careful.",
    date: "2024-01-07",
    verified: true,
    helpful: 21,
  },
];

export function getProductReviews(productId: string): Review[] {
  return reviews.filter((review) => review.productId === productId);
}

export function getAverageRating(productId: string): number {
  const productReviews = getProductReviews(productId);
  if (productReviews.length === 0) return 0;

  const sum = productReviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((sum / productReviews.length).toFixed(1));
}

export function getReviewCount(productId: string): number {
  return getProductReviews(productId).length;
}
