import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, Car } from "lucide-react"
import { PROPERTY } from "@/data/content"

export function Location() {
  const nearbyAttractions = [
    ...PROPERTY.location.noted_nearby,
    { place: "Tangalle Town Center", distance_mi: PROPERTY.location.distance_to_center_mi },
    { place: "Nearest Beach", distance_mi: PROPERTY.location.nearest_beach_distance_ft / 5280 },
  ]

  const activities = PROPERTY.activities_services.activities.slice(0, 8)

  return (
    <section id="location" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Perfect Location</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the beauty of Tangalle from our prime beachfront location
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map and Address */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Villa Address</h3>
                    <p className="text-gray-600">
                      {PROPERTY.address.line1}
                      <br />
                      {PROPERTY.address.city}, {PROPERTY.address.postal_code}
                      <br />
                      {PROPERTY.address.country}
                    </p>
                  </div>
                </div>

                <Badge className="bg-green-100 text-green-800 mb-4">
                  <Navigation className="w-4 h-4 mr-1" />
                  Beachfront Property
                </Badge>

                <a
                  href={PROPERTY.location.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <MapPin className="w-4 h-4" />
                  View on Google Maps
                </a>
              </CardContent>
            </Card>

            {/* Nearby Attractions */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nearby Attractions</h3>
                <div className="space-y-3">
                  {nearbyAttractions.map((attraction, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700">{attraction.place}</span>
                      <Badge variant="outline">
                        {attraction.distance_mi < 1
                          ? `${Math.round(attraction.distance_mi * 5280)} ft`
                          : `${attraction.distance_mi} mi`}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Activities and Transportation */}
          <div className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Activities & Experiences</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activities.map((activity, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-orange-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{activity}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Car className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Transportation</h3>
                </div>
                <div className="space-y-3">
                  {PROPERTY.activities_services.transportation.map((transport, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{transport}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location Score */}
            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {PROPERTY.property_highlights.top_location_score}/10
                </div>
                <p className="text-gray-700 font-medium">Location Score</p>
                <p className="text-sm text-gray-600 mt-2">Rated by guests for convenience and attractions</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
