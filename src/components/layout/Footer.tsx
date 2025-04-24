
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Translation dictionary for the footer
const translations = {
  en: {
    rights: "All rights reserved.",
    services: "Services",
    about: "About Us",
    contact: "Contact Us",
  },
  fil: {
    rights: "Lahat ng karapatan ay nakalaan.",
    services: "Mga Serbisyo",
    about: "Tungkol sa Amin",
    contact: "Makipag-ugnayan",
  }
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { language } = useLanguage();
  const t = translations[language];
  
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="text-xl font-bold font-outfit">
              Barangay Mo
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              ©{currentYear} Barangay Mo. {t.rights}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t.services}</h3>
            <ul className="mt-4 space-y-3">
              {[
                ['Products', '/products'],
                ['Pricing', '/pricing'],
                ['Login', '/login'],
                ['Request Access', '/request-access'],
                ['Partnerships', '/partnerships']
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-500 hover:text-gray-900">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t.about}</h3>
            <ul className="mt-4 space-y-3">
              {[
                ['About Barangay Mo', '/about'],
                ['Contact', '/contact'],
                ['Features', '/features'],
                ['Careers', '/careers']
              ].map(([label, path]) => (
                <li key={path}>
                  <Link to={path} className="text-sm text-gray-500 hover:text-gray-900">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t.contact}</h3>
            <p className="mt-4 text-sm text-gray-500">Questions or feedback?</p>
            <p className="text-sm text-gray-500">We'd love to hear from you</p>
            <div className="flex gap-4 mt-4">
              <Link to="#" className="text-gray-400 hover:text-gray-500">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-gray-500">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link to="#" className="text-gray-400 hover:text-gray-500">
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
