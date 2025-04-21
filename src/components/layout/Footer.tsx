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
              Smart Barangay
            </Link>
            <p className="mt-4 text-sm text-gray-500">
              ©{currentYear} Smart Barangay. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Products</h3>
            <ul className="mt-4 space-y-3">
              {['Product', 'Pricing', 'Log in', 'Request access', 'Partnerships'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-500 hover:text-gray-900">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">About us</h3>
            <ul className="mt-4 space-y-3">
              {['About Barangay Mo', 'Contact us', 'Features', 'Careers'].map((item) => (
                <li key={item}>
                  <Link to="#" className="text-sm text-gray-500 hover:text-gray-900">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Get in touch</h3>
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
