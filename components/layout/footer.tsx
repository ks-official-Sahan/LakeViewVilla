import { SITE_CONFIG } from "@/data/content";
import { MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Lake View Villa Tangalle</h3>
            <p className="text-gray-300 mb-4">
              Experience tranquility at our private villa on a serene lagoon in
              Tangalle, Sri Lanka.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Lagoon Road, Tangalle, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>
                  {SITE_CONFIG?.whatsappNumberText || "+94 71 744 8391"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@lakeviewvillatangalle.com</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-gray-300">
              <a
                href="#villa"
                className="block hover:text-white transition-colors"
              >
                Villa
              </a>
              <a
                href="#amenities"
                className="block hover:text-white transition-colors"
              >
                Amenities
              </a>
              <a
                href="#location"
                className="block hover:text-white transition-colors"
              >
                Location
              </a>
              <a
                href="#contact"
                className="block hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Lake View Villa Tangalle. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
