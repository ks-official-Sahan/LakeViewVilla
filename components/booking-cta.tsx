import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, MapPin, Star, Phone, Mail } from "lucide-react"
import { PROPERTY } from "@/data/booking"

export function BookingCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Book Your Stay?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Experience luxury and comfort at Lake View Villa. Book now for an unforgettable getaway.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Booking Info */}
          <Card className="border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <Badge className="bg-green-100 text-green-800">
                  <Star className="w-4 h-4 mr-1 fill-green-600" />
                  {PROPERTY.scores_reviews.overall_score}/10 Rated
                </Badge>
                <Badge variant="outline">{PROPERTY.scores_reviews.reviews_count} Reviews</Badge>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-6">{PROPERTY.name}</h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span>
                    {PROPERTY.address.city}, {PROPERTY.address.country}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>
                    Up to {PROPERTY.occupancy.max_guests} guests • {PROPERTY.occupancy.bedrooms} bedrooms
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <span>Check-in: {PROPERTY.house_rules.checkin}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  Book Now
                </Button>
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  Check Availability
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="text-white space-y-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Need Help with Your Booking?</h3>
              <p className="text-blue-100 text-lg leading-relaxed">
                Our friendly team is here to assist you with any questions about your stay. We're available 24/7 to
                ensure your experience is perfect from start to finish.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">24/7 Support</p>
                  <p className="text-blue-100">+94 XX XXX XXXX</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-semibold">Email Us</p>
                  <p className="text-blue-100">info@lakeviewvilla.com</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6">
              <h4 className="font-semibold mb-3">Quick Facts</h4>
              <ul className="space-y-2 text-blue-100">
                <li>• Free cancellation up to 24 hours</li>
                <li>• {PROPERTY.house_rules.payment}</li>
                <li>• Free private parking included</li>
                <li>• Pet-friendly with no extra charges</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
