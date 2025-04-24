
import { FC } from 'react';
import { Link } from "react-router-dom";
import { LoginForm } from './LoginForm';
import { LoginReview } from './LoginReview';

const REVIEWS = [
  {
    text: "Much better than calling the barangay office—love it!",
    author: "Jon A.",
    subtitle: "Official",
    avatar: "https://randomuser.me/api/portraits/men/76.jpg"
  },
  {
    text: "The portal is a game changer for our community. Thank you!",
    author: "Ellen P.",
    subtitle: "Resident",
    avatar: "https://randomuser.me/api/portraits/women/80.jpg"
  }
];

export const MobileLoginView: FC = () => {
  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mb-6">
        <Link to="/" className="text-blue-600 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back
        </Link>
      </div>

      <div className="text-center mb-8">
        <img 
          src="/lovable-uploads/6960369f-3a6b-4d57-ab0f-f7db77f16152.png" 
          alt="Logo" 
          className="h-16 w-auto mx-auto" 
        />
        <h1 className="text-2xl font-bold mt-4">Welcome Back</h1>
        <p className="text-gray-600">Log in to your account</p>
      </div>

      <LoginForm />
      
      <div className="mt-8">
        {REVIEWS.map((review, index) => (
          <LoginReview 
            key={index}
            review={review}
            className={index === 0 ? "bg-[#f5f7ff]" : "bg-[#e8f5e9] mt-2"}
          />
        ))}
      </div>
    </div>
  );
};
