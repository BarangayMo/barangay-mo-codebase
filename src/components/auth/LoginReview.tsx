
import { FC } from 'react';

interface Review {
  text: string;
  author: string;
  subtitle: string;
  avatar: string;
}

interface LoginReviewProps {
  review: Review;
  className?: string;
}

export const LoginReview: FC<LoginReviewProps> = ({ review, className = "" }) => {
  return (
    <div className={`rounded-2xl p-3 flex items-center gap-3 ${className}`}>
      <img src={review.avatar} alt="" className="w-10 h-10 rounded-full flex-shrink-0" />
      <div>
        <div className="italic text-xs">&quot;{review.text}&quot;</div>
        <div className="mt-2 flex items-center gap-2 text-[.85em] opacity-60">
          <b>{review.author}</b>
          <span className="rounded bg-[#e7e7fa] px-2 py-0.5 ml-1">{review.subtitle}</span>
        </div>
      </div>
    </div>
  );
};
