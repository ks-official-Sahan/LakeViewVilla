import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wifi, Car, PawPrint, Utensils, Shield, Clock } from "lucide-react"
import { PROPERTY } from "@/data/content"

export function PropertyOverview() {
  const highlights = [
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: `${PROPERTY.wifi.speed_mbps} Mbps throughout the villa`,
    },
    {
      icon: Car,
      title: "Free Parking",
      description: "Private on-site parking included",
    },
    {
      icon: PawPrint,
      title: "Pet Friendly",
      description: "Pets welcome at no extra charge",
    },
    {
      icon: Utensils,
      title: "On-Site Restaurant",
      description: "Fresh local cuisine available",
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "Round-the-clock security and safety",
    },
    {
      icon: Clock,
      title: "Flexible Check-in",
      description: "24-hour check-in available",
    },
  ]

  return (
    <section id="overview" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Your Perfect Getaway Awaits</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-balance">
            Experience the perfect blend of luxury and comfort in our {PROPERTY.size.area_sqft} sq ft villa, just{" "}
            {PROPERTY.location.nearest_beach_distance_ft} feet from the pristine beaches of Tangalle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {highlights.map((highlight, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <highlight.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{highlight.title}</h3>
                <p className="text-gray-600">{highlight.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-blue-100 text-blue-800 mb-4">{PROPERTY.type}</Badge>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Spacious & Comfortable</h3>
              <div className="space-y-4 text-gray-600">
                <p>
                  Our villa features {PROPERTY.occupancy.bedrooms} beautifully appointed bedrooms and{" "}
                  {PROPERTY.occupancy.bathrooms} full bathrooms, comfortably accommodating up to{" "}
                  {PROPERTY.occupancy.max_guests} guests.
                </p>
                <p>
                  Located in the serene area of {PROPERTY.address.line1}, you'll enjoy the perfect balance of
                  tranquility and accessibility to Tangalle's attractions.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{PROPERTY.occupancy.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{PROPERTY.occupancy.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={PROPERTY.images_sample[1] || "/placeholder.svg"}
                alt="Villa interior"
                className="w-full h-80 object-cover rounded-xl shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-xl shadow-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-900">{PROPERTY.size.area_sqft}</div>
                  <div className="text-sm text-gray-600">sq ft</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
