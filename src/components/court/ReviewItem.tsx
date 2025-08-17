"use client";

import { Star, Clock } from "lucide-react";
import { useMemo, useState } from "react";

interface ReviewItemProps {
  userName: string;
  userColor: string;
  rating: number;
  text: string;
  visitDate: string;
}

const TEXT_LENGTH_FIRST_RENDERING = 75;

export const ReviewItem = ({
  userName,
  userColor,
  rating,
  text,
  visitDate,
}: ReviewItemProps) => {
  const [isOpenLongReview, setIsOpenLongReview] = useState(false);

  const userInitial = userName.slice(0, 1);

  const reviewText = useMemo(() => {
    return text.length > TEXT_LENGTH_FIRST_RENDERING && !isOpenLongReview
      ? text.slice(0, 70) + "..."
      : text;
  }, [text, isOpenLongReview]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`w-3 h-3 ${
          index < rating ? "text-yellow-500 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const openLongReview = () => {
    setIsOpenLongReview(true);
  };

  return (
    <div className="bg-gray-50 p-3 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: userColor }}
        >
          <span className="text-xs font-medium text-white">{userInitial}</span>
        </div>
        <span className="text-sm font-medium text-gray-900">{userName}</span>
        <div className="flex items-center gap-1">{renderStars(rating)}</div>
      </div>
      <p className="text-sm text-gray-700 mb-2">
        {reviewText}{" "}
        {!isOpenLongReview && text.length > TEXT_LENGTH_FIRST_RENDERING && (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={openLongReview}
          >
            더보기
          </span>
        )}
      </p>

      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{visitDate}</span>
      </div>
    </div>
  );
};
