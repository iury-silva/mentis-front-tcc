import { type Place } from "@/pages/Maps/MapsNearby";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPinIcon, EarthIcon, PhoneCallIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
export function CardItem({
  place,
  loading,
}: {
  place: Place;
  loading: boolean;
}) {
  return (
    <>
      {loading ? (
        <Card className="p-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-1" />
          <Skeleton className="h-4 w-1/3" />
        </Card>
      ) : (
        <Card className="bg-card/70 backdrop-blur-sm shadow-md hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="truncate w-3/4">{place.name || "Nome não disponível"}</CardTitle>
            </div>
            <CardDescription>{place.amenity}</CardDescription>
          </CardHeader>
          <CardContent>
            {place.phone ? (
              <div className="flex items-center gap-2 mb-2">
                <PhoneCallIcon className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`tel:${place.phone}`}
                  className="text-primary underline"
                >
                  {place.phone}
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <PhoneCallIcon className="h-4 w-4 text-muted-foreground" />
                <p
                  className="text-sm text-muted-foreground italic">
                  Telefone não disponível
                </p>
              </div>
            )}
            {place.website ? (
              <div className="flex items-center gap-2">
                <EarthIcon className="h-4 w-4 text-muted-foreground" />
                <a
                  href={place.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  {place.website}
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <EarthIcon className="h-4 w-4 text-muted-foreground" />
                <p
                  className="text-sm text-muted-foreground italic">
                  Website não disponível
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
}
