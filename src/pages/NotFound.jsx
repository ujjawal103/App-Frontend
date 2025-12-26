import { Link } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-700 from-purple-400 via-pink-500 to-red-500 text-white p-6">
      <ExclamationTriangleIcon className="w-20 h-20 text-yellow-300 mb-6 animate-bounce" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6 text-center">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:bg-purple-100 transition-all"
      >
        Go Back Home
      </Link>
      <div className="mt-10 text-center text-sm opacity-80">
        If you think this is a mistake, contact support.
      </div>
    </div>
  );
}
