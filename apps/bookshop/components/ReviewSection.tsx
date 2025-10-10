import { useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import { Badge } from "@workspace/ui/components/badge";
import { Separator } from "@workspace/ui/components/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Star, ThumbsUp, Verified, Edit3, Filter } from "lucide-react";
import {
  getProductReviews,
  getAverageRating,
  getReviewCount,
  Review,
} from "@/data/reviews";

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(
    getProductReviews(productId)
  );
  const [sortBy, setSortBy] = useState<
    "newest" | "oldest" | "highest" | "lowest" | "helpful"
  >("newest");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    content: "",
    userName: "",
  });

  const averageRating = getAverageRating(productId);
  const reviewCount = getReviewCount(productId);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    const review: Review = {
      id: `r${Date.now()}`,
      productId,
      userId: `u${Date.now()}`,
      userName: newReview.userName || "Anonymous",
      userAvatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face`,
      rating: newReview.rating,
      title: newReview.title,
      content: newReview.content,
      date: new Date().toISOString().split("T")[0],
      verified: false,
      helpful: 0,
    };

    setReviews([review, ...reviews]);
    setNewReview({ rating: 5, title: "", content: "", userName: "" });
    setIsWritingReview(false);
  };

  const sortedAndFilteredReviews = reviews
    .filter((review) => filterRating === null || review.rating === filterRating)
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "helpful":
          return b.helpful - a.helpful;
        default:
          return 0;
      }
    });

  const renderStars = (
    rating: number,
    interactive = false,
    onRate?: (rating: number) => void
  ) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating ? "text-amber-400 fill-current" : "text-slate-300"
            } ${interactive ? "cursor-pointer hover:text-amber-400" : ""}`}
            onClick={() => interactive && onRate && onRate(star)}
          />
        ))}
      </div>
    );
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customer Reviews</span>
            <Dialog open={isWritingReview} onOpenChange={setIsWritingReview}>
              <DialogTrigger asChild>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Write Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                  <DialogDescription>
                    Share your experience with this product to help other
                    customers
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmitReview} className="space-y-6">
                  <div>
                    <Label htmlFor="reviewerName">Your Name</Label>
                    <Input
                      id="reviewerName"
                      value={newReview.userName}
                      onChange={(e) =>
                        setNewReview({ ...newReview, userName: e.target.value })
                      }
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <Label>Rating</Label>
                    <div className="mt-2">
                      {renderStars(newReview.rating, true, (rating) =>
                        setNewReview({ ...newReview, rating })
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reviewTitle">Review Title</Label>
                    <Input
                      id="reviewTitle"
                      value={newReview.title}
                      onChange={(e) =>
                        setNewReview({ ...newReview, title: e.target.value })
                      }
                      placeholder="Summarize your experience"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="reviewContent">Your Review</Label>
                    <Textarea
                      id="reviewContent"
                      value={newReview.content}
                      onChange={(e) =>
                        setNewReview({ ...newReview, content: e.target.value })
                      }
                      placeholder="Tell us about your experience with this product..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsWritingReview(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      Submit Review
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="mb-2">
                {renderStars(Math.round(averageRating))}
              </div>
              <div className="text-slate-600">
                Based on {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{rating}★</span>
                  <div className="flex-1 bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-400 h-2 rounded-full"
                      style={{
                        width: `${reviewCount > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / reviewCount) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-8">
                    {
                      ratingDistribution[
                        rating as keyof typeof ratingDistribution
                      ]
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <span className="text-sm font-medium">Filter:</span>
          </div>
          <Select
            value={filterRating?.toString() || "all"}
            onValueChange={(value) =>
              setFilterRating(value === "all" ? null : parseInt(value))
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Select
            value={sortBy}
            onValueChange={(
              value: "newest" | "oldest" | "highest" | "lowest" | "helpful"
            ) => setSortBy(value)}
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedAndFilteredReviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-slate-500">
                No reviews match your current filters.
              </p>
            </CardContent>
          </Card>
        ) : (
          sortedAndFilteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold">{review.userName}</h4>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            <Verified className="h-3 w-3 mr-1" />
                            Verified Purchase
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-3">
                      {renderStars(review.rating)}
                      <span className="font-semibold">{review.title}</span>
                    </div>

                    <p className="text-slate-700 mb-4 leading-relaxed">
                      {review.content}
                    </p>

                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-600"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Helpful ({review.helpful})
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
