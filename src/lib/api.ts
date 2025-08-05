import { Court, CourtFormData, MapBounds } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// 테스트용 농구장 데이터
const MOCK_COURTS: Court[] = [
  {
    id: "1",
    name: "서울농구장",
    address: "서울특별시 강남구 테헤란로 123",
    latitude: 37.5665,
    longitude: 126.978,
    review: "좋은 농구장입니다!",
    imageUrl: "https://picsum.photos/400/300?random=1",
    isIndoor: true,
    status: "approved",
    createdBy: "user1",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "강남농구장",
    address: "서울특별시 강남구 역삼동 456",
    latitude: 37.5013,
    longitude: 127.0396,
    review: "실외 농구장이지만 조명이 잘 되어있어요",
    imageUrl: "https://picsum.photos/400/300?random=2",
    isIndoor: false,
    status: "approved",
    createdBy: "user2",
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "홍대농구장",
    address: "서울특별시 마포구 홍대로 789",
    latitude: 37.5572,
    longitude: 126.9234,
    review: "대학가 근처라 젊은 사람들이 많아요",
    imageUrl: "https://picsum.photos/400/300?random=3",
    isIndoor: true,
    status: "pending",
    createdBy: "user3",
    createdAt: "2024-01-03T00:00:00Z",
    updatedAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "잠실농구장",
    address: "서울특별시 송파구 올림픽로 321",
    latitude: 37.5139,
    longitude: 127.1006,
    review: "올림픽공원 근처의 넓은 농구장",
    imageUrl: "https://picsum.photos/400/300?random=4",
    isIndoor: false,
    status: "approved",
    createdBy: "user4",
    createdAt: "2024-01-04T00:00:00Z",
    updatedAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "강북농구장",
    address: "서울특별시 강북구 도봉로 654",
    latitude: 37.6396,
    longitude: 127.0257,
    review: "조용한 동네의 깔끔한 농구장",
    imageUrl: "https://picsum.photos/400/300?random=5",
    isIndoor: true,
    status: "approved",
    createdBy: "user5",
    createdAt: "2024-01-05T00:00:00Z",
    updatedAt: "2024-01-05T00:00:00Z",
  },
];

class ApiClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // 농구장 목록 조회 (테스트용 모크 데이터 반환)
  async getCourts(bounds?: MapBounds): Promise<Court[]> {
    // 실제 API가 없으므로 모크 데이터 반환
    console.log("Fetching courts with bounds:", bounds);

    // 지도 영역에 따른 필터링 (간단한 구현)
    if (bounds) {
      return MOCK_COURTS.filter(
        (court) =>
          court.latitude >= bounds.south &&
          court.latitude <= bounds.north &&
          court.longitude >= bounds.west &&
          court.longitude <= bounds.east
      );
    }

    return MOCK_COURTS;
  }

  // 농구장 상세 조회
  async getCourt(id: string): Promise<Court> {
    const court = MOCK_COURTS.find((c) => c.id === id);
    if (!court) {
      throw new Error("Court not found");
    }
    return court;
  }

  // 농구장 등록
  async createCourt(data: CourtFormData): Promise<Court> {
    const newCourt: Court = {
      id: Date.now().toString(),
      name: data.name,
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      review: data.review,
      imageUrl: data.imageUrl,
      isIndoor: data.isIndoor,
      status: "pending",
      createdBy: "current-user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Creating new court:", newCourt);
    return newCourt;
  }

  // 농구장 투표
  async voteCourt(
    courtId: string,
    voteType: "approve" | "reject"
  ): Promise<void> {
    console.log(`Voting ${voteType} for court ${courtId}`);
    // 실제 구현에서는 서버에 투표 정보를 전송
  }

  // 주소로 좌표 조회 (Kakao Maps API)
  async getCoordinates(address: string): Promise<{ lat: number; lng: number }> {
    const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
    if (!kakaoApiKey) {
      throw new Error("Kakao API key is not configured");
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        address
      )}`,
      {
        headers: {
          Authorization: `KakaoAK ${kakaoApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get coordinates");
    }

    const data = await response.json();
    if (data.documents.length === 0) {
      throw new Error("Address not found");
    }

    const { x, y } = data.documents[0];
    return { lat: parseFloat(y), lng: parseFloat(x) };
  }

  // 좌표로 주소 조회 (Kakao Maps API)
  async getAddress(lat: number, lng: number): Promise<string> {
    const kakaoApiKey = process.env.NEXT_PUBLIC_KAKAO_API_KEY;
    if (!kakaoApiKey) {
      throw new Error("Kakao API key is not configured");
    }

    const response = await fetch(
      `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`,
      {
        headers: {
          Authorization: `KakaoAK ${kakaoApiKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to get address");
    }

    const data = await response.json();
    if (data.documents.length === 0) {
      throw new Error("Address not found");
    }

    return data.documents[0].address.address_name;
  }
}

export const apiClient = new ApiClient();
