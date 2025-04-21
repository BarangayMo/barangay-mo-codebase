
import { ArrowLeft, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const coverPhoto = "/lovable-uploads/c7d7f7a8-491d-49f1-910c-bb4dd5a85996.png";
const avatarPhoto = "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=facearea&w=300&q=80";
const name = "Kim Parkinson";
const username = "theunderdog";
const verified = true;
const bio = "I will inspire 10 million people to do what they love the best they can!";
const posts = 404;
const likes = "1.6k";
const reviews = 26;
const rating = 5;
const rate = 3.00;
const minTalkMins = 5;
const sessions = 36;

export default function ResidentProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e3eafc] via-[#f9fafc] to-[#fae5df] px-0 pb-10 pt-0 w-full font-inter">
      {/* Header with Image */}
      <div className="relative rounded-b-[32px] overflow-hidden shadow-lg bg-white mb-0">
        {/* Cover photo */}
        <img src={coverPhoto} alt="Cover" className="w-full h-[210px] sm:h-[240px] object-cover" />
        {/* Nav and Buttons */}
        <div className="absolute top-0 left-0 w-full flex items-center justify-between px-2 py-2">
          <Link to="/" className="bg-white/80 rounded-full p-[6px]">
            <ArrowLeft className="w-6 h-6 text-gray-800" />
          </Link>
          <button className="bg-white/80 rounded-full p-[6px]">
            <MoreHorizontal className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        {/* Profile picture - overlaps */}
        <div className="absolute left-1/2 -bottom-16 -translate-x-1/2">
          <div className="relative">
            <img src={avatarPhoto} alt="Avatar" className="w-32 h-32 rounded-full border-[5px] border-white object-cover shadow-xl" />
            <span className="w-5 h-5 bg-[#44c154] border-4 border-white rounded-full absolute bottom-2 right-2 z-10" />
          </div>
        </div>
      </div>
      <main className="max-w-lg w-full mx-auto mt-20 p-4 bg-white rounded-3xl shadow-lg z-10 relative">
        {/* Stats row at top */}
        <div className="flex justify-end space-x-6 text-gray-400 pb-2 text-sm font-medium">
          <span>{posts} posts</span>
          <span>•</span>
          <span>{likes} likes</span>
        </div>
        {/* Name + Like row */}
        <div className="flex items-center justify-between mt-1">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-outfit text-gray-900">{name}</h1>
              {verified && (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" aria-label="Verified">
                  <circle cx="12" cy="12" r="12" fill="#228be6" />
                  <path d="M8.5 12.5l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div className="text-gray-400 -mt-1 font-medium text-base">@{username}</div>
          </div>
          <button className="flex items-center gap-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full shadow text-base font-semibold font-inter text-gray-700 border border-gray-200">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 mr-1" aria-label="Like">
              <path d="M21 12.2C21 17.1 12 22 12 22S3 17.1 3 12.2A5.3 5.3 0 0 1 12 7a5.3 5.3 0 0 1 9 5.2z" stroke="currentColor" strokeWidth="2" fill="white" />
            </svg>
            <span>Like</span>
          </button>
        </div>
        {/* Bio */}
        <div className="text-gray-700 my-4 text-base">{bio}</div>
        {/* Overview: stats */}
        <div className="flex items-center space-x-4 mb-2">
          {[...Array(rating)].map((_, i) => (
            <svg key={i} className="w-5 h-5 text-[#fec84b]" fill="currentColor" viewBox="0 0 20 20">
              <polygon points="10,1 12.5,7.6 19.5,7.8 14,12.2 16,19 10,15.5 4,19 6,12.2 0.5,7.8 7.5,7.6"/>
            </svg>
          ))}
          <span className="text-gray-600 underline ml-2 cursor-pointer">{reviews} reviews</span>
        </div>
        {/* Metrics Row */}
        <div className="flex flex-row justify-between items-center gap-1 mt-1">
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 text-gray-800 font-semibold">
              <span className="inline-block font-medium">
                ₱{rate.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-500">rate per min</div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 font-semibold text-gray-800">
              <span>{minTalkMins}</span>
            </div>
            <span className="text-xs text-gray-500">min talk time</span>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="flex items-center gap-1 font-semibold text-gray-800">
              <span>{sessions}</span>
            </div>
            <span className="text-xs text-gray-500">sessions</span>
          </div>
        </div>
      </main>
    </div>
  );
}
