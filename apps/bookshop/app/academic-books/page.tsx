'use client'
import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { Input } from '@workspace/ui/components/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select';
import { Badge } from '@workspace/ui/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/cart';
import {
  academicBooks,
  gradelevels,
  subjects,
  curriculums,
  getAcademicBooksByGrade,
  getAcademicBooksBySubject,
  getAcademicBooksByCurriculum,
  getAcademicBooksByCategory,
  searchAcademicBooks,
  AcademicBook
} from '@/data/academicBooks';
import {
  BookOpen,
  GraduationCap,
  Search,
  Filter,
  Star,
  ShoppingCart,
  Eye,
  Users,
  Award,
  Clock,
  Bookmark,
  TrendingUp,
  Shield,
  Truck,
  Heart,
  Share2,
  BookText,
  Sparkles
} from 'lucide-react';

export default function AcademicBooks() {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('title');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (book: AcademicBook) => {
    addToCart({
      id: book.id,
      name: book.title,
      price: book.price,
      image: book.image,
      category: `${book.category} - ${book.subject}`,
    });
  };

  const toggleFavorite = (bookId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  };

  // Filter and search logic
  const getFilteredBooks = () => {
    let filtered = academicBooks;

    if (searchQuery) {
      filtered = searchAcademicBooks(searchQuery);
    }

    if (selectedGrade !== 'all') {
      filtered = filtered.filter(book => book.gradeLevel === selectedGrade);
    }

    if (selectedSubject !== 'all') {
      filtered = filtered.filter(book => book.subject === selectedSubject);
    }

    if (selectedCurriculum !== 'all') {
      filtered = filtered.filter(book => book.curriculum === selectedCurriculum);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(book => book.category === selectedCategory);
    }

    // Sort results
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'reviews':
          return b.reviews - a.reviews;
        case 'bestselling':
          return (b.salesRank || 0) - (a.salesRank || 0);
        default:
          return a.title.localeCompare(b.title);
      }
    });
  };

  const filteredBooks = getFilteredBooks();

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-amber-400 fill-current' : 'text-slate-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const getCategoryStats = () => {
    const stats = {
      textbook: academicBooks.filter(b => b.category === 'textbook').length,
      professional: academicBooks.filter(b => b.category === 'professional').length,
      reference: academicBooks.filter(b => b.category === 'reference').length,
      research: academicBooks.filter(b => b.category === 'research').length,
    };
    return stats;
  };

  const categoryStats = getCategoryStats();

  const getCategoryColor = (category: string) => {
    const colors = {
      textbook: 'bg-blue-100 text-blue-800 border-blue-200',
      professional: 'bg-green-100 text-green-800 border-green-200',
      reference: 'bg-purple-100 text-purple-800 border-purple-200',
      research: 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[category as keyof typeof colors] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="text-center mb-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-3xl -rotate-1 transform scale-105"></div>
          <div className="relative">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Academic & Professional Books
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Discover comprehensive collection of textbooks, reference materials, and professional
              resources curated for students, educators, and lifelong learners
            </p>

            {/* Quick Features */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Shield className="h-4 w-4 text-green-600" />
                Quality Guaranteed
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Truck className="h-4 w-4 text-blue-600" />
                Free Delivery Over KES 2,000
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Bookmark className="h-4 w-4 text-purple-600" />
                Save 15% on Bundles
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              icon: BookText,
              count: categoryStats.textbook,
              label: 'Textbooks',
              color: 'from-blue-500 to-blue-600',
              description: 'Core curriculum books'
            },
            {
              icon: Users,
              count: categoryStats.professional,
              label: 'Professional',
              color: 'from-green-500 to-green-600',
              description: 'Career development'
            },
            {
              icon: Award,
              count: categoryStats.reference,
              label: 'Reference',
              color: 'from-purple-500 to-purple-600',
              description: 'Study guides & more'
            },
            {
              icon: TrendingUp,
              count: categoryStats.research,
              label: 'Research',
              color: 'from-amber-500 to-amber-600',
              description: 'Advanced materials'
            },
          ].map((stat, index) => (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
              <CardContent className="p-6 text-center relative">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="text-3xl font-bold text-slate-800 mb-1">{stat.count}</div>
                <div className="text-sm font-semibold text-slate-700 mb-1">{stat.label}</div>
                <div className="text-xs text-slate-500">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-slate-100/80 rounded-2xl border border-slate-200">
            <TabsTrigger
              value="browse"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 rounded-xl transition-all"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse All
            </TabsTrigger>
            <TabsTrigger
              value="grade"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 rounded-xl transition-all"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              By Grade Level
            </TabsTrigger>
            <TabsTrigger
              value="curriculum"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200 rounded-xl transition-all"
            >
              <Award className="h-4 w-4 mr-2" />
              By Curriculum
            </TabsTrigger>
          </TabsList>

          {/* Enhanced Browse All Books Tab */}
          <TabsContent value="browse" className="space-y-8 mt-8">
            {/* Enhanced Search and Filters */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-xl">
                  <Filter className="h-5 w-5 mr-3 text-blue-600" />
                  Discover Your Next Book
                </CardTitle>
                <CardDescription>
                  Use filters to find exactly what you're looking for
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                  <Input
                    placeholder="Search books, authors, subjects, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 rounded-2xl"
                  />
                </div>

                {/* Filter Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="textbook">📚 Textbooks</SelectItem>
                      <SelectItem value="professional">💼 Professional</SelectItem>
                      <SelectItem value="reference">🔍 Reference</SelectItem>
                      <SelectItem value="research">📊 Research</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All Subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map(subject => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All Levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      {gradelevels.map(grade => (
                        <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCurriculum} onValueChange={setSelectedCurriculum}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All Curriculums" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Curriculums</SelectItem>
                      {curriculums.map(curriculum => (
                        <SelectItem key={curriculum} value={curriculum}>{curriculum}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="h-11 rounded-xl border-slate-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="title">Title A-Z</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="bestselling">Bestselling</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Active Filters */}
                <div className="flex flex-wrap gap-2">
                  {selectedCategory !== 'all' && (
                    <Badge variant="secondary" className="rounded-lg">
                      Category: {selectedCategory}
                      <button onClick={() => setSelectedCategory('all')} className="ml-2 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedGrade !== 'all' && (
                    <Badge variant="secondary" className="rounded-lg">
                      Grade: {selectedGrade}
                      <button onClick={() => setSelectedGrade('all')} className="ml-2 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="secondary" className="rounded-lg">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="ml-2 hover:text-red-600">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  {filteredBooks.length} Books Found
                </h2>
                <p className="text-slate-600 mt-1">
                  {searchQuery ? `Search results for "${searchQuery}"` : 'Browse our complete collection'}
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGrade('all');
                  setSelectedSubject('all');
                  setSelectedCurriculum('all');
                  setSelectedCategory('all');
                }}
                className="rounded-xl border-slate-300 hover:bg-slate-50"
              >
                Clear All Filters
              </Button>
            </div>

            {/* Enhanced Book Grid */}
            {filteredBooks.length === 0 ? (
              <Card className="text-center py-16 border-0 shadow-lg bg-white/80">
                <CardContent>
                  <Search className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">No books found</h3>
                  <p className="text-slate-600 mb-4">Try adjusting your search criteria or browse different categories</p>
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGrade('all');
                      setSelectedSubject('all');
                      setSelectedCurriculum('all');
                      setSelectedCategory('all');
                    }}
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                  >
                    Show All Books
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredBooks.map((book) => (
                  <Card
                    key={book.id}
                    className="group relative overflow-hidden border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(book.id)}
                      className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
                    >
                      <Heart
                        className={`h-4 w-4 transition-colors ${
                          favorites.has(book.id)
                            ? 'text-red-500 fill-current'
                            : 'text-slate-400 hover:text-red-500'
                        }`}
                      />
                    </button>

                    {/* Discount Badge */}
                    {book.originalPrice && book.originalPrice > book.price && (
                      <div className="absolute top-3 left-3 z-10">
                        <Badge className="bg-red-500 text-white border-0 shadow-lg">
                          Save {Math.round((1 - book.price / book.originalPrice) * 100)}%
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="p-0 relative">
                      <div className="aspect-[3/4] overflow-hidden rounded-t-2xl bg-slate-100">
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 space-y-4">
                      <div className="space-y-3">
                        {/* Category and Status */}
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="secondary"
                            className={`text-xs capitalize border ${getCategoryColor(book.category)} rounded-lg`}
                          >
                            {book.category}
                          </Badge>
                          {!book.inStock && (
                            <Badge variant="outline" className="text-xs text-red-600 border-red-200 bg-red-50">
                              Out of Stock
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight text-lg">
                          {book.title}
                        </h3>

                        {/* Author */}
                        <p className="text-sm text-slate-600 font-medium">
                          by {book.author}
                        </p>

                        {/* Meta Information */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>{book.publisher}</span>
                            <span>{book.edition}</span>
                          </div>
                          {(book.gradeLevel || book.curriculum) && (
                            <div className="flex items-center gap-2">
                              {book.gradeLevel && (
                                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                  {book.gradeLevel}
                                </span>
                              )}
                              {book.curriculum && (
                                <span className="text-xs text-slate-500 truncate">
                                  {book.curriculum}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Rating */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {renderStars(book.rating)}
                            <span className="text-sm text-slate-600 font-medium">
                              {book.rating}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            ({book.reviews} reviews)
                          </span>
                        </div>

                        {/* Price */}
                        <div className="space-y-1">
                          {book.originalPrice && book.originalPrice > book.price && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-slate-500 line-through">
                                {formatPrice(book.originalPrice)}
                              </span>
                              <Badge variant="outline" className="text-xs bg-red-50 text-red-600 border-red-200">
                                Save {formatPrice(book.originalPrice - book.price)}
                              </Badge>
                            </div>
                          )}
                          <div className="text-xl font-bold text-blue-600">
                            {formatPrice(book.price)}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3 pt-2">
                        <Button
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 transition-all duration-300 shadow-lg hover:shadow-xl"
                          onClick={() => handleAddToCart(book)}
                          disabled={!book.inStock}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          {book.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>

                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            className="rounded-xl h-10 border-slate-300 hover:bg-slate-50 transition-all"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button
                            variant="outline"
                            className="rounded-xl h-10 border-slate-300 hover:bg-slate-50 transition-all"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Enhanced By Grade Level Tab */}
          <TabsContent value="grade" className="space-y-8 mt-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl flex items-center justify-center gap-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  Browse by Grade Level
                </CardTitle>
                <CardDescription className="text-lg">
                  Find age-appropriate materials organized by educational stage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {gradelevels.map((grade) => {
                    const booksCount = getAcademicBooksByGrade(grade).length;
                    const books = getAcademicBooksByGrade(grade);
                    const avgPrice = books.length > 0
                      ? books.reduce((sum, book) => sum + book.price, 0) / books.length
                      : 0;

                    return (
                      <Card
                        key={grade}
                        className="group cursor-pointer border-0 bg-gradient-to-br from-white to-slate-50/80 hover:from-blue-50 hover:to-purple-50/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                        onClick={() => {
                          setSelectedGrade(grade);
                          document.querySelector('[value="browse"]')?.click();
                        }}
                      >
                        <CardContent className="p-6 text-center">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                            <GraduationCap className="h-8 w-8 text-white" />
                          </div>
                          <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                            {grade}
                          </h3>
                          <div className="text-sm text-slate-600 space-y-1">
                            <div className="font-semibold text-blue-600">{booksCount} books</div>
                            {avgPrice > 0 && (
                              <div className="text-xs text-slate-500">
                                Avg: {formatPrice(avgPrice)}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Enhanced By Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-8 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {curriculums.map((curriculum) => {
                const curriculumBooks = getAcademicBooksByCurriculum(curriculum);
                const avgRating = curriculumBooks.length > 0
                  ? curriculumBooks.reduce((sum, book) => sum + book.rating, 0) / curriculumBooks.length
                  : 0;

                return (
                  <Card
                    key={curriculum}
                    className="group hover:shadow-xl transition-all duration-500 hover:-translate-y-1 border-0 bg-white/80 backdrop-blur-sm"
                  >
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl flex items-center justify-between">
                        <span className="group-hover:text-blue-600 transition-colors">
                          {curriculum}
                        </span>
                        <Badge variant="secondary" className="rounded-lg">
                          {curriculumBooks.length} books
                        </Badge>
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2">
                        {renderStars(avgRating)}
                        <span className="text-sm text-slate-600">
                          {avgRating.toFixed(1)} avg rating
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        {curriculumBooks.slice(0, 3).map((book) => (
                          <div
                            key={book.id}
                            className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group/item"
                          >
                            <div className="relative">
                              <img
                                src={book.image}
                                alt={book.title}
                                className="w-12 h-16 object-cover rounded-lg shadow-sm group-hover/item:shadow-md transition-shadow"
                              />
                              {book.originalPrice && book.originalPrice > book.price && (
                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                  <span className="text-[10px] text-white font-bold">%</span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-slate-800 line-clamp-1 group-hover/item:text-blue-600 transition-colors">
                                {book.title}
                              </h4>
                              <p className="text-xs text-slate-600">{book.gradeLevel}</p>
                              <div className="flex items-center justify-between mt-1">
                                <p className="text-sm font-bold text-blue-600">
                                  {formatPrice(book.price)}
                                </p>
                                {renderStars(book.rating)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {curriculumBooks.length > 3 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full rounded-xl border-slate-300 hover:bg-slate-50 transition-all"
                          onClick={() => {
                            setSelectedCurriculum(curriculum);
                            document.querySelector('[value="browse"]')?.click();
                          }}
                        >
                          View all {curriculumBooks.length} books
                          <Eye className="h-4 w-4 ml-2" />
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}