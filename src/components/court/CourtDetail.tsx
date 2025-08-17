"use client";

import { Court } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Carousel } from "@/components/ui/carousel";
import { ReviewItem } from "@/components/court/ReviewItem";
import { MapPin, Star, Clock, Globe, Share } from "lucide-react";
import { match } from "ts-pattern";

interface CourtDetailProps {
  court: Court;
}

const mockReviews = [
  {
    userName: "농구러버",
    userColor: "#3B82F6",
    rating: 5,
    text: "정말 좋은 농구장입니다! 코트 상태가 깔끔하고 바스켓이 잘 맞습니다. 주차도 편리하고 조명도 밝아서 야간에도 농구하기 좋아요.가나다라마",
    visitDate: "2024. 1. 15",
  },
  {
    userName: "점프맨",
    userColor: "#10B981",
    rating: 4,
    text: "코트가 넓고 바운드가 좋습니다. 실외라서 날씨에 따라 이용이 제한될 수 있지만, 맑은 날에는 정말 최고입니다.",
    visitDate: "2024. 1. 10",
  },
  {
    userName: "슈터킹",
    userColor: "#8B5CF6",
    rating: 5,
    text: "이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다. 이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다.",
    visitDate: "2024. 1. 8",
  },
  {
    userName: "슈터킹",
    userColor: "#8B5CF6",
    rating: 5,
    text: "이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다. 이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다.",
    visitDate: "2024. 1. 8",
  },
  {
    userName: "슈터킹",
    userColor: "#8B5CF6",
    rating: 5,
    text: "이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다. 이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다.",
    visitDate: "2024. 1. 8",
  },
  {
    userName: "슈터킹",
    userColor: "#8B5CF6",
    rating: 5,
    text: "이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다. 이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다.",
    visitDate: "2024. 1. 8",
  },
  {
    userName: "슈터킹",
    userColor: "#8B5CF6",
    rating: 5,
    text: "이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다. 이 농구장은 정말 추천합니다! 코트 상태가 훌륭하고, 특히 3점 라인과 프리드로우 라인이 정확하게 그려져 있어서 연습하기 좋습니다.",
    visitDate: "2024. 1. 8",
  },
];

const mockImages = [
  "https://picsum.photos/400/300?random=1",
  "https://picsum.photos/400/300?random=2",
  "https://picsum.photos/400/300?random=3",
];

export const CourtDetail = ({ court }: CourtDetailProps) => {
  const getStatusBadge = (status: Court["status"]) => {
    return match(status)
      .with("approved", () => (
        <Badge variant="default" className="bg-green-500 text-xs px-2 py-1">
          승인
        </Badge>
      ))
      .with("pending", () => (
        <Badge variant="secondary" className="bg-yellow-500 text-xs px-2 py-1">
          검토
        </Badge>
      ))
      .with("rejected", () => (
        <Badge variant="destructive" className="text-xs px-2 py-1">
          거부
        </Badge>
      ))
      .exhaustive();
  };

  const getIndoorBadge = (isIndoor: boolean) => {
    return isIndoor ? (
      <Badge
        variant="outline"
        className="text-blue-600 border-blue-600 text-xs px-2 py-1"
      >
        실내
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="text-green-600 border-green-600 text-xs px-2 py-1"
      >
        실외
      </Badge>
    );
  };

  const averageRating =
    mockReviews.reduce((sum, review) => sum + review.rating, 0) /
    mockReviews.length;

  return (
    <div className="p-4 space-y-4">
      {/* 농구장 이름과 배지 */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{court.name}</h1>
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}?court=${court.id}`;
              navigator.clipboard.writeText(shareUrl);
              alert("링크가 클립보드에 복사되었습니다!");
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
            title="링크 복사"
          >
            <Share className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          {getIndoorBadge(court.isIndoor)}
          {getStatusBadge(court.status)}
        </div>
      </div>

      {/* 주소 */}
      <div className="flex items-start gap-2">
        <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-600">{court.address}</p>
        </div>
      </div>

      {/* 추가 정보 */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">등록일</span>
          <span className="text-gray-900">
            {new Date(court.createdAt).toLocaleDateString("ko-KR")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-500" />
          <span className="text-gray-600">상태</span>
          <span className="text-gray-900">
            {court.status === "approved" ? "운영중" : "검토중"}
          </span>
        </div>
      </div>

      {/* 이미지 캐러셀 */}
      <Carousel images={mockImages} alt={court.name} />

      {/* 리뷰 및 별점 */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold text-gray-800">리뷰 및 별점</h3>
        <div className="space-y-3">
          {/* 평균 별점 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className="w-5 h-5 text-yellow-500 fill-current"
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-600">
              (리뷰 {mockReviews.length}개)
            </span>
          </div>

          {/* 리뷰 목록 */}
          <div className="space-y-3 max-h-200 overflow-y-auto pr-2">
            {mockReviews.map((review, index) => (
              <ReviewItem
                key={index}
                userName={review.userName}
                userColor={review.userColor}
                rating={review.rating}
                text={review.text}
                visitDate={review.visitDate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
