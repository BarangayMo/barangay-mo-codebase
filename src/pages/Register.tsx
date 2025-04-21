
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e4ecfc] via-[#fff] to-[#fbedda] px-4 py-8">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-6 md:p-8">
        <h1 className="font-outfit text-2xl md:text-3xl font-bold mb-6 text-gray-900 text-center">
          Register Account
        </h1>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            name="fullname"
            required
            placeholder="Full Name"
            className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-200 font-inter"
          />
          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-200 font-inter"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 focus:ring-2 focus:ring-blue-200 font-inter"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 font-semibold text-white rounded-lg px-4 py-3 font-inter transition disabled:opacity-60 mt-2"
            disabled
          >
            Register
          </button>
        </form>
        <p className="text-gray-500 text-sm text-center mt-4 font-inter">
          Already have an account?{" "}
          <Link to="/login" className="underline font-medium text-blue-700 hover:text-blue-900 transition">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
