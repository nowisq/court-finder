"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";

interface ContextMenuProps {
  x: number;
  y: number;
  onRegister: () => void;
  onClose: () => void;
}

export const ContextMenu = ({
  x,
  y,
  onRegister,
  onClose,
}: ContextMenuProps) => {
  const [position, setPosition] = useState({ x, y });

  useEffect(() => {
    // 화면 크기 고려하여 위치 조정
    const menuWidth = 160;
    const menuHeight = 40;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let adjustedX = x;
    let adjustedY = y;

    // 오른쪽으로 넘어가는 경우
    if (x + menuWidth > windowWidth) {
      adjustedX = x - menuWidth;
    }

    // 아래쪽으로 넘어가는 경우
    if (y + menuHeight > windowHeight) {
      adjustedY = y - menuHeight;
    }

    setPosition({ x: adjustedX, y: adjustedY });
  }, [x, y]);

  useEffect(() => {
    const handleClickOutside = () => {
      onClose();
    };

    // 약간의 지연을 두어 메뉴가 바로 닫히지 않도록 함
    const timeoutId = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onClose]);

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegister();
  };

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[160px]"
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={handleRegisterClick}
        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
      >
        <MapPin className="w-4 h-4" />
        장소 등록
      </button>
    </div>
  );
};
