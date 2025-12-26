import React from 'react';
import { FaStar } from 'react-icons/fa';

// Dummy reviews
const dummyReviews = [
  { id: 1, name: 'Alice', rating: 5, comment: 'Great service!' },
  { id: 2, name: 'Bob', rating: 4, comment: 'Good experience.' },
  { id: 3, name: 'Charlie', rating: 5, comment: 'Loved it!' },
];

const Reviews = () => {
  return (
    <div className="m-4 bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Reviews</h3>
      <div className="space-y-3">
        {dummyReviews.map((review) => (
          <div key={review.id} className="border-b pb-2 last:border-b-0">
            <div className="flex items-center mb-1">
              <p className="font-medium mr-2">{review.name}</p>
              <div className="flex text-yellow-400">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
