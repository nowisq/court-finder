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
import { Input } from "@/components/ui/input";
import { Plus, ChevronRight, ChevronLeft, Search } from "lucide-react";
import { CourtMap } from "@/components/map/CourtMap";
import { CourtList } from "@/components/court/CourtList";
import { CourtDetail } from "@/components/court/CourtDetail";
import { CourtForm } from "@/components/court/CourtForm";
import { useCourtStore } from "@/lib/store";
import { apiClient } from "@/lib/api";
import { Court } from "@/types";

export default function HomePage() {
  const [isListOpen, setIsListOpen] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  // URL 경로(/court/{id})와 선택 상태 동기화 (초기 진입 및 뒤로가기/앞으로가기)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const applyFromLocation = async () => {
      const path = window.location.pathname;
      const match = path.match(/^\/court\/(.+)$/);
      if (match) {
        const id = match[1];
        let court = courts.find((c) => c.id === id) || null;
        if (!court) {
          try {
            court = await apiClient.getCourt(id);
          } catch {
            // ignore fetch errors for fallback UX
          }
        }
        if (court) {
          setSelectedCourt(court);
          setIsListOpen(true);
        }
        return;
      }
      setSelectedCourt(null);
    };

    applyFromLocation();
    const onPopState = () => {
      applyFromLocation();
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [courts, setSelectedCourt]);

  // 검색된 농구장 필터링
  const filteredCourts = courts.filter(
    (court) =>
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCourtClick = (court: Court) => {
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/court/${court.id}`);
    }
    setIsListOpen(true);
    setSelectedCourt(court);
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
    <div className="h-screen flex">
      {/* LNB 사이드바 (왼쪽) */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isListOpen ? "translate-x-0" : "-translate-x-full"
        } w-80 flex-shrink-0 absolute left-0 top-0 h-full z-10`}
      >
        {/* LNB 컨텐츠 */}
        <div className="h-full flex flex-col">
          {/* 검색 영역 (목록 화면일 때만 표시) */}
          {!selectedCourt && (
            <>
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-600" />
                  <Input
                    type="text"
                    placeholder="농구장 이름 또는 주소 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border-amber-600 focus:border-amber-600 focus:ring-amber-600"
                  />
                </div>
              </div>

              {/* 등록 버튼 (목록 화면일 때만 표시) */}
              <div className="p-4 border-b border-gray-200">
                <Button
                  size="sm"
                  onClick={() => setIsFormOpen(true)}
                  className="w-full flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <Plus className="w-4 h-4" />
                  농구장 등록
                </Button>
              </div>
            </>
          )}

          {/* 농구장 목록 또는 상세 화면 */}
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : selectedCourt ? (
              <>
                {/* 뒤로가기 버튼 */}
                <div className="p-4 border-b border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedCourt(null);
                      if (typeof window !== "undefined") {
                        window.history.pushState({}, "", "/");
                      }
                    }}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    목록으로 돌아가기
                  </button>
                </div>
                <CourtDetail court={selectedCourt} />
              </>
            ) : (
              <CourtList
                courts={filteredCourts}
                onCourtClick={handleCourtClick}
              />
            )}
          </div>
        </div>

        {/* LNB 토글 버튼 (우측 바깥에 붙음) */}
        <div className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsListOpen(!isListOpen)}
            className="p-2 h-12 w-6 rounded-r-lg rounded-l-none shadow-sm bg-white border-l-0 border-gray-200 hover:bg-gray-50 transition-all duration-200"
          >
            {isListOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* 지도 영역 (전체 화면) */}
      <div className="flex-1 relative">
        <CourtMap
          courts={filteredCourts}
          onCourtClick={handleCourtClick}
          onMapClick={handleMapClick}
          onRegisterLocation={handleRegisterLocation}
        />
      </div>

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
