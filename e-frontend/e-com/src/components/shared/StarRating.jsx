import React from 'react';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';

export const StarRating = ({ rating, size = 14, className }) => {
  const stars = [];
  const floorRating = Math.floor(rating);
  const hasHalf = rating - floorRating >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= floorRating) {
      stars.push(<IoStar key={i} size={size} className="text-amber-400" />);
    } else if (i === floorRating + 1 && hasHalf) {
      stars.push(<IoStarHalf key={i} size={size} className="text-amber-400" />);
    } else {
      stars.push(<IoStarOutline key={i} size={size} className="text-slate-300" />);
    }
  }

  return (
    <div className={`flex items-center gap-0.5 ${className}`}>
      {stars}
      <span className="text-[10px] font-semibold text-secondary ml-1 font-sans">
        {rating.toFixed(1)}
      </span>
    </div>
  );
};
