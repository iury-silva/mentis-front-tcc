import { PageCustom } from "@/components/Layout/PageCustom";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { type LatLngTuple } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CardItem } from "@/components/Maps/Card/CardItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/api";
import L from "leaflet";
interface MapsNearbyProps {
  lat: number;
  lon: number;
  amenity: string;
}
export interface Place {
  id: number;
  type: string;
  name: string;
  lat: number;
  lon: number;
  amenity: string;
  phone: string | null;
  website: string | null;
}

export default function MapsNearby() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState<LatLngTuple | null>(null);
  const [refusedLocation, setRefusedLocation] = useState(false);

// Ajusta o caminho das imagens
  // delete L.Icon.Default.prototype._options.iconUrl;

  const iconOptions = new L.Icon({
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    iconUrl: "/leaflet/marker-icon.png",
    shadowUrl: "/leaflet/marker-shadow.png",
  });

  const customIcon = new L.Icon({
    iconUrl: "/images/icone-mentisV2.png",
    iconSize: [25, 31],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });

  const { data, isPending, mutateAsync } = useMutation({
    mutationFn: (newLocation: MapsNearbyProps) =>
      api.post("/maps/nearby-places", newLocation),
    onSuccess: () => {
      console.log("Localização enviada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao enviar localização:", error);
    },
    mutationKey: ["nearby-places"],
  });

  const getUserLocation = useCallback(async () => {
    const status = await navigator.permissions.query({ name: "geolocation" });
    if (navigator.geolocation) {
      if (status.state === "prompt") {
        setOpen(true);
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation([latitude, longitude]);
          mutateAsync({
            lat: latitude,
            lon: longitude,
            amenity: "hospital|clinic",
          });
          setOpen(false);
        },
        (error) => {
          setRefusedLocation(true);
          setOpen(false);
          console.error("Erro ao obter localização:", error);
        }
      );
    } else {
      console.error("Geolocalização não é suportada por este navegador.");
    }
  }, [mutateAsync]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);
  return (
    <>
      <PageCustom
        title="Locais Próximos"
        subtitle="Encontre serviços e locais de interesse próximos a você"
        icon={
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
        }
      >
        {refusedLocation ? (
          <div className="flex flex-col items-center justify-center h-[500px] w-full rounded-xl bg-red-50 p-6 text-center shadow-lg">
            <h2 className="text-2xl font-semibold text-red-700 mb-4">
              Acesso à Localização Negado
            </h2>
            <p className="text-red-600">
              Para utilizar este recurso, por favor permita o acesso à sua
              localização nas configurações do seu navegador.
            </p>
          </div>
        ) : isPending || location === null ? (
          <div className="flex flex-col items-center justify-center h-[500px] w-full rounded-xl overflow-hidden shadow-lg z-0">
            <Skeleton className="h-full w-full" />
          </div>
        ) : (
          <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg z-0">
            <MapContainer
              center={location}
              zoom={13}
              style={{ height: "100%", width: "100%", zIndex: 0 }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={location} icon={customIcon}>
                <Popup>Você está aqui!</Popup>
              </Marker>
              {data &&
                data.map((place: Place) => (
                  <Marker key={place.id} position={[place.lat, place.lon]} icon={iconOptions}>
                    <Popup>
                      <strong>{place.name || "Nome não disponível"}</strong>
                      <br />
                      Tipo: {place.amenity}
                      <br />
                      {place.phone && (
                        <>
                          Telefone:{" "}
                          <a href={`tel:${place.phone}`}>{place.phone}</a>
                          <br />
                        </>
                      )}
                      {place.website && (
                        <>
                          Website:{" "}
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                          >
                            {place.website}
                          </a>
                        </>
                      )}
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        )}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="col-span-full">
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Locais Encontrados
            </h2>
          </div>
          {data && !isPending && location !== null
            ? data.map((place: Place) => (
                <CardItem key={place.id} place={place} loading={isPending} />
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <CardItem
                  key={index}
                  place={{
                    id: index,
                    type: "",
                    name: "",
                    lat: 0,
                    lon: 0,
                    amenity: "",
                    phone: null,
                    website: null,
                  }}
                  loading={true}
                />
              ))}
        </div>
      </PageCustom>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Locais Próximos</DialogTitle>
            <DialogDescription>
              <div className="flex flex-col items-center justify-center space-y-4 mt-2">
                <img
                  src="/images/address-pana.svg"
                  alt="localização"
                  className="bg-primary/10 rounded-xl w-full h-48"
                />
                <p className="text-justify text-foreground">
                  Este recurso utiliza sua localização para encontrar serviços e
                  locais de interesse próximos a você. Por favor, permita o
                  acesso à sua localização quando solicitado pelo navegador.
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
