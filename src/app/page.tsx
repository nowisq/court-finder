"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus, Map, List, X } from "lucide-react";
import { CourtMap } from "@/components/map/CourtMap";
import { CourtList } from "@/components/court/CourtList";
import { CourtForm } from "@/components/court/CourtForm";
import { useCourtStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { Court } from "@/types";

export default function HomePage() {
  const [isListOpen, setIsListOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const { courts, setCourts, selectedCourt, setSelectedCourt } =
    useCourtStore();

  // 농구장 목록 조회
  const { data: courtsData, isLoading } = useQuery({
    queryKey: ["courts"],
    queryFn: () => apiClient.getCourts(),
  });

  useEffect(() => {
    if (courtsData) {
      setCourts(courtsData);
    }
  }, [courtsData, setCourts]);

  const handleCourtClick = (court: Court) => {
    setSelectedCourt(court);
    setIsListOpen(true);
  };

  // 지도 우클릭 시 등록 위치 설정
  const handleRegisterLocation = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setIsFormOpen(true);
  };

  // 기존 지도 클릭 이벤트는 제거 (우클릭으로 대체)
  const handleMapClick = (lat: number, lng: number) => {
    // 지도 클릭 시 아무것도 하지 않음 (컨텍스트 메뉴 닫기만)
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedLocation(null);
    // 농구장 목록 새로고침
    window.location.reload();
  };

  const handleFormCancel = () => {
    setIsFormOpen(false);
    setSelectedLocation(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">농구장 찾기</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsListOpen(!isListOpen)}
              className="flex items-center gap-2"
            >
              {isListOpen ? (
                <Map className="w-4 h-4" />
              ) : (
                <List className="w-4 h-4" />
              )}
              {isListOpen ? "지도" : "목록"}
            </Button>
            <Button
              size="sm"
              onClick={() => setIsFormOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              등록
            </Button>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="flex-1 relative">
        {/* 지도 */}
        <div
          className={`h-full ${
            isListOpen ? "w-2/3" : "w-full"
          } transition-all duration-300`}
        >
          <CourtMap
            courts={courts}
            onCourtClick={handleCourtClick}
            onMapClick={handleMapClick}
            onRegisterLocation={handleRegisterLocation}
          />
        </div>

        {/* 농구장 목록 사이드바 */}
        {isListOpen && (
          <div className="absolute right-0 top-0 w-1/3 h-full bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">농구장 목록</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsListOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <CourtList courts={courts} onCourtClick={handleCourtClick} />
            )}
          </div>
        )}
      </main>

      {/* 농구장 등록 폼 */}
      <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
        <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>새로운 농구장 등록</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-4">
            {selectedLocation && (
              <CourtForm
                latitude={selectedLocation.lat}
                longitude={selectedLocation.lng}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
