declare module "maplibre-gl" {
  export interface MapStyle {
    version: number;
    sources: Record<string, unknown>;
    layers: Array<Record<string, unknown>>;
  }

  export interface MapOptions {
    container: HTMLElement;
    style: MapStyle | string;
    center?: [number, number];
    zoom?: number;
    attributionControl?: boolean;
  }

  export interface Map {
    on(event: string, listener: (e: unknown) => void): this;
    on(event: string, layerId: string, listener: (e: unknown) => void): this;
    off(event: string, listener: (e: unknown) => void): this;
    getBounds(): LngLatBounds;
    flyTo(options: FlyToOptions): this;
    remove(): void;
    getLayer(id: string): unknown;
    removeLayer(id: string): this;
    getSource(id: string): unknown;
    removeSource(id: string): this;
    addSource(id: string, source: unknown): this;
    addLayer(layer: unknown): this;
    getCanvas(): HTMLCanvasElement;
  }

  export interface Marker {
    setLngLat(lngLat: [number, number]): this;
    addTo(map: Map): this;
    remove(): void;
  }

  export interface LngLatBounds {
    getNorth(): number;
    getSouth(): number;
    getEast(): number;
    getWest(): number;
  }

  export interface FlyToOptions {
    center: [number, number];
    zoom: number;
    duration?: number;
  }

  export interface LngLat {
    lng: number;
    lat: number;
  }

  export interface MapLayerEvent {
    features?: Array<{
      properties?: {
        id?: string;
        name?: string;
        status?: string;
        isSelected?: boolean;
      };
    }>;
  }

  export const Map: {
    new (options: MapOptions): Map;
  };

  export const Marker: {
    new (options?: { element?: HTMLElement; anchor?: string }): Marker;
  };

  export const LngLatBounds: {
    new (sw: [number, number], ne: [number, number]): LngLatBounds;
  };
}

declare module "maplibre-gl/dist/maplibre-gl.css" {
  const content: string;
  export default content;
}
