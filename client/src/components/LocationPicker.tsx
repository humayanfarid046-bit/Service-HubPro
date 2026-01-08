import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Loader2, Navigation, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: {
    house?: string;
    street?: string;
    city?: string;
    pincode?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  darkMode?: boolean;
}

export function LocationPicker({ open, onOpenChange, onLocationSelect, darkMode = false }: LocationPickerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [manualEntry, setManualEntry] = useState({
    house: "",
    street: "",
    city: "",
    pincode: ""
  });

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({ 
        title: "Not Supported", 
        description: "Geolocation is not supported by your browser.", 
        variant: "destructive" 
      });
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Use reverse geocoding with OpenStreetMap Nominatim API (free, no API key required)
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const address = data.address;
            onLocationSelect({
              house: address.house_number || "",
              street: address.road || address.neighbourhood || "",
              city: address.city || address.town || address.village || address.state_district || "",
              pincode: address.postcode || "",
              latitude,
              longitude
            });
            
            toast({ 
              title: "Location Found", 
              description: `${address.road || ""}, ${address.city || address.town || ""}` 
            });
            onOpenChange(false);
          }
        } catch (error) {
          // If geocoding fails, just use coordinates
          onLocationSelect({
            latitude,
            longitude,
            street: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`
          });
          toast({ title: "Location Found", description: "Using GPS coordinates." });
          onOpenChange(false);
        }
        
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === 1) errorMsg = "Location access denied. Please enable location permissions.";
        else if (error.code === 2) errorMsg = "Location unavailable. Please try again.";
        else if (error.code === 3) errorMsg = "Location request timed out.";
        
        toast({ title: "Location Error", description: errorMsg, variant: "destructive" });
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleManualSubmit = () => {
    if (!manualEntry.city) {
      toast({ title: "City Required", description: "Please enter at least the city name.", variant: "destructive" });
      return;
    }
    
    onLocationSelect({
      house: manualEntry.house,
      street: manualEntry.street,
      city: manualEntry.city,
      pincode: manualEntry.pincode
    });
    onOpenChange(false);
  };

  const baseClasses = darkMode 
    ? "bg-slate-800 border-slate-700 text-white" 
    : "bg-white border-gray-200 text-gray-900";

  const inputClasses = darkMode
    ? "bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-cyan-500"
    : "bg-gray-50 border-gray-200 focus:border-blue-500";

  const labelClasses = darkMode ? "text-slate-400" : "text-gray-600";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${baseClasses} max-w-md`}>
        <DialogHeader>
          <DialogTitle className={darkMode ? "text-white" : ""}>
            <div className="flex items-center gap-2">
              <MapPin className={darkMode ? "text-cyan-400" : "text-blue-600"} />
              Select Location
            </div>
          </DialogTitle>
          <DialogDescription className={darkMode ? "text-slate-400" : ""}>
            Use your current location or enter address manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Use Current Location */}
          <Button
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className={`w-full h-14 rounded-xl ${
              darkMode 
                ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            data-testid="button-use-current-location"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Navigation className="w-5 h-5 mr-2" />
            )}
            {isLoading ? "Getting Location..." : "Use Current Location"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className={`w-full border-t ${darkMode ? "border-slate-700" : "border-gray-200"}`} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-2 ${darkMode ? "bg-slate-800 text-slate-500" : "bg-white text-gray-500"}`}>
                Or enter manually
              </span>
            </div>
          </div>

          {/* Manual Entry Form */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className={`text-xs ${labelClasses}`}>House/Flat No.</Label>
                <Input
                  className={`h-11 rounded-lg ${inputClasses}`}
                  placeholder="e.g. 12A"
                  value={manualEntry.house}
                  onChange={(e) => setManualEntry({ ...manualEntry, house: e.target.value })}
                  data-testid="input-loc-house"
                />
              </div>
              <div className="space-y-1">
                <Label className={`text-xs ${labelClasses}`}>Pincode</Label>
                <Input
                  className={`h-11 rounded-lg ${inputClasses}`}
                  placeholder="e.g. 700001"
                  value={manualEntry.pincode}
                  onChange={(e) => setManualEntry({ ...manualEntry, pincode: e.target.value })}
                  data-testid="input-loc-pincode"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className={`text-xs ${labelClasses}`}>Street / Area</Label>
              <Input
                className={`h-11 rounded-lg ${inputClasses}`}
                placeholder="e.g. Park Street"
                value={manualEntry.street}
                onChange={(e) => setManualEntry({ ...manualEntry, street: e.target.value })}
                data-testid="input-loc-street"
              />
            </div>
            <div className="space-y-1">
              <Label className={`text-xs ${labelClasses}`}>City *</Label>
              <Input
                className={`h-11 rounded-lg ${inputClasses}`}
                placeholder="e.g. Kolkata"
                value={manualEntry.city}
                onChange={(e) => setManualEntry({ ...manualEntry, city: e.target.value })}
                data-testid="input-loc-city"
              />
            </div>
          </div>

          <Button
            onClick={handleManualSubmit}
            variant="outline"
            className={`w-full h-12 rounded-xl ${
              darkMode 
                ? "border-slate-600 text-white hover:bg-slate-700" 
                : "border-gray-300 hover:bg-gray-50"
            }`}
            data-testid="button-confirm-address"
          >
            Confirm Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
