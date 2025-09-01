"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Court } from "@/types";
import { useCourtStore } from "@/lib/store";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ContextMenu } from "./ContextMenu";

interface CourtMapProps {
  courts: Court[];
  onCourtClick: (court: Court) => void;
  onRegisterLocation: (lat: number, lng: number) => void;
  pickMode?: boolean;
  onPick?: (lat: number, lng: number) => void;
}

export const CourtMap = ({
  courts,
  onCourtClick,
  onRegisterLocation,
  pickMode = false,
  onPick,
}: CourtMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    lat: number;
    lng: number;
  } | null>(null);
  const { selectedCourt } = useCourtStore();

  // Maplibre GL 지도 초기화
  useEffect(() => {
    if (!mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [126.978, 37.5665], // 서울 시청
      zoom: 10,
      attributionControl: true,
    });

    map.on("load", () => {
      setIsLoading(false);
    });

    // 지도 클릭 이벤트 (컨텍스트 메뉴 닫기용)
    map.on("click", () => {
      setContextMenu(null);
    });

    // 지도 우클릭 이벤트 (컨텍스트 메뉴 표시)
    map.on("contextmenu", (ev) => {
      const e = ev as {
        preventDefault: () => void;
        lngLat: { lng: number; lat: number };
        point: { x: number; y: number };
      };
      e.preventDefault();
      const { lng, lat } = e.lngLat;

      setContextMenu({
        x: e.point.x,
        y: e.point.y,
        lat,
        lng,
      });
    });

    // 지도 이동 이벤트 (마커 업데이트용)
    map.on("moveend", () => {
      const bounds = map.getBounds();
      const mapBounds = {
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      };
      console.log("Map bounds changed:", mapBounds);
    });

    setMap(map);

    return () => {
      map.remove();
    };
  }, []);

  // 마커 레이어 추가 함수
  const addMarkerLayers = useCallback(
    (mapInstance: maplibregl.Map) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = mapInstance as any;

      // 기존 마커 레이어 제거
      if (map.getLayer("court-markers")) {
        map.removeLayer("court-markers");
      }
      if (map.getSource("court-markers")) {
        map.removeSource("court-markers");
      }

      // 마커 데이터 준비: 상세 진입 시 선택된 코트만 표시
      const visibleCourts = selectedCourt
        ? courts.filter((c) => c.id === selectedCourt.id)
        : courts;

      const markerData = visibleCourts.map((court) => ({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [court.longitude, court.latitude],
        },
        properties: {
          id: court.id,
          name: court.name,
          status: court.status,
          isSelected: selectedCourt?.id === court.id,
        },
      }));

      // 마커 소스 추가
      map.addSource("court-markers", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: markerData,
        },
      });

      // 마커 레이어 추가
      map.addLayer({
        id: "court-markers",
        type: "circle",
        source: "court-markers",
        // 선택된 코트가 있을 때 해당 id만 표시, 없으면 전체 표시(["all"])로 유효한 배열 유지
        filter: selectedCourt
          ? ["==", ["get", "id"], selectedCourt.id]
          : ["all"],
        paint: {
          "circle-radius": ["case", ["==", ["get", "isSelected"], true], 8, 6],
          "circle-color": [
            "case",
            ["==", ["get", "status"], "approved"],
            "#3b82f6",
            ["==", ["get", "status"], "pending"],
            "#f59e0b",
            "#ef4444",
          ],
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
        },
      });

      // 마커 클릭 이벤트
      map.on("click", "court-markers", (ev: unknown) => {
        const e = ev as {
          features?: Array<{ properties?: { id?: string } }>;
        };
        if (e.features && e.features[0]) {
          const courtId = e.features[0].properties?.id;
          const court = courts.find((c) => c.id === courtId);
          if (court) {
            onCourtClick(court);
          }
        }
      });

      // 마커 호버 효과
      map.on("mouseenter", "court-markers", () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", "court-markers", () => {
        map.getCanvas().style.cursor = "";
      });
    },
    [courts, selectedCourt, onCourtClick]
  );

  // 마커 업데이트
  useEffect(() => {
    if (map && !isLoading) {
      addMarkerLayers(map);
    }
  }, [map, isLoading, addMarkerLayers]);

  // 위치 선택 모드에서 지도 클릭 처리
  useEffect(() => {
    if (!map) return;

    const handlePickClick = (ev: unknown) => {
      if (!pickMode) return;
      const e = ev as { lngLat: { lat: number; lng: number } };
      if (e && e.lngLat) {
        onPick?.(e.lngLat.lat, e.lngLat.lng);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (map as any).on("click", handlePickClick);
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (map as any).off("click", handlePickClick);
    };
  }, [map, pickMode, onPick]);

  // 선택된 농구장으로 지도 이동
  useEffect(() => {
    if (map && selectedCourt) {
      map.flyTo({
        center: [selectedCourt.longitude, selectedCourt.latitude],
        zoom: 15,
        duration: 1000,
      });
    }
  }, [map, selectedCourt]);

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const handleRegisterLocation = () => {
    if (contextMenu) {
      onRegisterLocation(contextMenu.lat, contextMenu.lng);
      setContextMenu(null);
    }
  };

  return (
    <div className={`relative w-full h-full ${pickMode ? "pick-cursor" : ""}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="flex flex-col items-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-600">지도를 불러오는 중...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />

      {/* 컨텍스트 메뉴 */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onRegister={handleRegisterLocation}
          onClose={handleContextMenuClose}
        />
      )}

      {/* Maplibre GL CSS 스타일 */}
      <style jsx global>{`
        .maplibregl-popup {
          font-family: inherit;
        }
        .pick-cursor .maplibregl-canvas {
          cursor: url("data:image/svg+xml;utf8,<?xml version='1.0' encoding='UTF-8'?><svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none'><path d='M12 2C8.686 2 6 4.686 6 8c0 4.5 6 12 6 12s6-7.5 6-12c0-3.314-2.686-6-6-6z' fill='%23f59e0b'/><path d='M12 6v4M10 8h4' stroke='%23ffffff' stroke-width='2' stroke-linecap='round'/></svg>")
              16 16,
            crosshair !important;
        }
      `}</style>
    </div>
  );
};
