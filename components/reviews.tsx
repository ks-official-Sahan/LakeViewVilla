import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { PROPERTY } from "@/data/booking"

export function Reviews() {
  const categories = Object.entries(PROPERTY.scores_reviews.category_scores)

  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Guest Reviews</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what our guests say about their unforgettable experiences
          </p>
        </div>

        {/* Overall Score */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-4 bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-blue-600 mb-2">{PROPERTY.scores_reviews.overall_score}</div>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600">Based on {PROPERTY.scores_reviews.reviews_count} reviews</p>
            </div>
          </div>
        </div>

        {/* Category Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {categories.map(([category, score], index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 capitalize">{category.replace("_", " ")}</h3>
                  <Badge
                    variant={score >= 9.5 ? "default" : score >= 9.0 ? "secondary" : "outline"}
                    className={score >= 9.5 ? "bg-green-600" : score >= 9.0 ? "bg-blue-600" : ""}
                  >
                    {score}/10
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${score * 10}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Sample Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah M.",
              rating: 10,
              comment:
                "Absolutely stunning villa with breathtaking views! The beachfront location is perfect and the amenities exceeded our expectations. Will definitely return!",
              highlight: "Perfect location",
            },
            {
              name: "James L.",
              rating: 10,
              comment:
                "The staff went above and beyond to make our stay memorable. The villa is spacious, clean, and beautifully decorated. Highly recommend for families!",
              highlight: "Exceptional service",
            },
            {
              name: "Maria K.",
              rating: 9,
              comment:
                "Wonderful experience! The on-site restaurant serves delicious local cuisine. The villa has everything you need for a comfortable stay.",
              highlight: "Great amenities",
            },
          ].map((review, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating / 2 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{review.name}</span>
                </div>
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">"{review.comment}"</p>
                <Badge variant="outline" className="text-xs">
                  {review.highlight}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
