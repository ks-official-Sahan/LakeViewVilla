import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChefHat,
  Bed,
  Bath,
  Sofa,
  TreePine,
  Utensils,
  Shield,
  Users,
  Gamepad2,
  ShoppingCart,
} from "lucide-react";
import { PROPERTY } from "@/data/content";

export function Amenities() {
  const amenityCategories = [
    {
      title: "Kitchen & Dining",
      icon: ChefHat,
      color: "bg-orange-100 text-orange-600",
      items: PROPERTY.amenities_in_unit.kitchen.slice(0, 8),
    },
    {
      title: "Bedrooms",
      icon: Bed,
      color: "bg-blue-100 text-blue-600",
      items: PROPERTY.amenities_in_unit.bedroom,
    },
    {
      title: "Bathrooms",
      icon: Bath,
      color: "bg-cyan-100 text-cyan-600",
      items: PROPERTY.amenities_in_unit.bathroom.slice(0, 8),
    },
    {
      title: "Living Areas",
      icon: Sofa,
      color: "bg-purple-100 text-purple-600",
      items: PROPERTY.amenities_in_unit.living_area,
    },
    {
      title: "Outdoor Spaces",
      icon: TreePine,
      color: "bg-green-100 text-green-600",
      items: PROPERTY.amenities_in_unit.outdoors.slice(0, 8),
    },
    {
      title: "Food & Beverage",
      icon: Utensils,
      color: "bg-red-100 text-red-600",
      items: PROPERTY.amenities_in_unit.food_and_drink.slice(0, 8),
    },
  ];

  const serviceCategories = [
    {
      title: "Safety & Security",
      icon: Shield,
      items: PROPERTY.activities_services.safety_security,
    },
    {
      title: "Family Services",
      icon: Users,
      items: PROPERTY.activities_services.family,
    },
    {
      title: "Entertainment",
      icon: Gamepad2,
      items: ["Shared lounge/TV area", "Board games/puzzles"],
    },
    {
      title: "Convenience",
      icon: ShoppingCart,
      items: PROPERTY.activities_services.shops,
    },
  ];

  return (
    <section id="amenities" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Premium Amenities
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need for a comfortable and memorable stay
          </p>
        </div>

        {/* In-Unit Amenities */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            In-Villa Amenities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {amenityCategories.map((category, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${category.color}`}
                    >
                      <category.icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item, itemIndex) => (
                      <Badge
                        key={itemIndex}
                        variant="secondary"
                        className="text-xs"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Services & Facilities */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Services & Facilities
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <category.icon className="w-5 h-5 text-gray-600" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        className="text-sm text-gray-600 flex items-start"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Restaurant Highlight */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {PROPERTY.restaurant_on_site.name}
            </h3>
            <p className="text-lg text-gray-600">
              Savor authentic Sri Lankan flavors and international cuisine
              prepared fresh daily
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-3">Cuisines</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {PROPERTY.restaurant_on_site.cuisines.map((cuisine, index) => (
                  <Badge key={index} variant="outline">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-3">Meals</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {PROPERTY.restaurant_on_site.open_for.map((meal, index) => (
                  <Badge key={index} variant="outline">
                    {meal}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="text-center">
              <h4 className="font-semibold text-gray-900 mb-3">
                Dietary Options
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {PROPERTY.restaurant_on_site.dietary_options.map(
                  (option, index) => (
                    <Badge key={index} variant="outline">
                      {option}
                    </Badge>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
