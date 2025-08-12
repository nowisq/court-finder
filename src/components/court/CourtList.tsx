"use client";

import { Court } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Circle } from "lucide-react";
import { match } from "ts-pattern";

interface CourtListProps {
  courts: Court[];
  onCourtClick: (court: Court) => void;
}

export const CourtList = ({ courts, onCourtClick }: CourtListProps) => {
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

  if (courts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-gray-500">
        <Circle className="w-8 h-8 mb-3" />
        <p className="text-base font-medium">이 지역에 농구장이 없습니다</p>
        <p className="text-sm text-center">
          지도를 이동하거나 새로운 농구장을 등록해보세요
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3">
      {courts.map((court) => (
        <Card
          key={court.id}
          className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
          onClick={() => onCourtClick(court)}
        >
          <CardHeader className="pb-0 pt-3 px-4">
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {court.name}
              </CardTitle>
              <div className="flex gap-2">
                {getIndoorBadge(court.isIndoor)}
                {getStatusBadge(court.status)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-4 pb-3">
            <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{court.address}</span>
            </div>
            {court.review && (
              <p className="text-sm text-gray-700 line-clamp-2 mb-3">
                &ldquo;{court.review}&rdquo;
              </p>
            )}
            {court.imageUrl && (
              <div className="mt-3">
                <img
                  src={court.imageUrl}
                  alt={court.name}
                  className="w-full h-32 object-cover rounded-md"
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
