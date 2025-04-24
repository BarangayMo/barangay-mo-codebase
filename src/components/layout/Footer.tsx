
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="hidden md:block bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-2">
            <Link to="/" className="text-xl font-bold font-outfit">
              Barangay Mo
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              ©{currentYear} Barangay Mo. Lahat ng karapatan ay nakalaan.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Serbisyo</h3>
            <ul className="mt-4 space-y-3">
              {[
                ['Mga Produkto', '/products'],
                ['Presyo', '/pricing'],
                ['Mag-login', '/login'],
                ['Humiling ng Access', '/request-access'],
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
            <h3 className="text-sm font-semibold text-gray-900">Tungkol sa Amin</h3>
            <ul className="mt-4 space-y-3">
              {[
                ['Tungkol sa Barangay Mo', '/about'],
                ['Makipag-ugnayan', '/contact'],
                ['Mga Features', '/features'],
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
            <h3 className="text-sm font-semibold text-gray-900">Makipag-ugnayan</h3>
            <p className="mt-4 text-sm text-gray-500">May mga tanong o feedback?</p>
            <p className="text-sm text-gray-500">Gusto naming marinig ang inyong saloobin</p>
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
