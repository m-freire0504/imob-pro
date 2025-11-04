import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

interface Imovel {
  id: number;
  titulo: string;
  endereco: string;
  cidade: string;
  latitude?: number;
  longitude?: number;
  preco?: number;
}

interface MapImoveisProps {
  imoveis: Imovel[];
  onImovelSelect?: (imovel: Imovel) => void;
}

export function MapImoveis({ imoveis, onImovelSelect }: MapImoveisProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    // Inicializar mapa
    if (!mapRef.current) return;

    const mapInstance = new (window as any).google.maps.Map(mapRef.current, {
      zoom: 12,
      center: { lat: -23.5505, lng: -46.6333 }, // São Paulo como padrão
      mapTypeControl: true,
      fullscreenControl: true,
    });

    setMap(mapInstance);

    return () => {
      // Cleanup
    };
  }, []);

  useEffect(() => {
    if (!map) return;

    // Limpar markers antigos
    markers.forEach((marker) => marker.setMap(null));

    // Adicionar novos markers
    const newMarkers = imoveis.map((imovel) => {
      const lat = imovel.latitude || -23.5505;
      const lng = imovel.longitude || -46.6333;

      const marker = new (window as any).google.maps.Marker({
        position: { lat, lng },
        map,
        title: imovel.titulo,
      });

      // Info window
      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div class="p-3 max-w-xs">
            <h3 class="font-semibold text-sm">${imovel.titulo}</h3>
            <p class="text-xs text-gray-600">${imovel.endereco}</p>
            ${imovel.preco ? `<p class="text-sm font-medium mt-2">R$ ${imovel.preco.toLocaleString("pt-BR")}</p>` : ""}
            <button class="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600">
              Ver Detalhes
            </button>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        onImovelSelect?.(imovel);
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Ajustar zoom para mostrar todos os markers
    if (newMarkers.length > 0) {
      const bounds = new (window as any).google.maps.LatLngBounds();
      newMarkers.forEach((marker) => {
        bounds.extend(marker.getPosition());
      });
      map.fitBounds(bounds);
    }
  }, [map, imoveis]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Mapa de Imóveis
        </CardTitle>
        <CardDescription>Visualize os imóveis no mapa</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          ref={mapRef}
          className="w-full h-96 rounded-lg border"
          style={{ minHeight: "400px" }}
        />
        <div className="mt-4 text-sm text-muted-foreground">
          <p>Total de imóveis no mapa: <strong>{imoveis.length}</strong></p>
        </div>
      </CardContent>
    </Card>
  );
}
