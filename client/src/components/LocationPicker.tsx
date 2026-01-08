import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MapPin, Loader2, Navigation, Search, Edit2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LocationPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (location: {
    house?: string;
    street?: string;
    city?: string;
    pincode?: string;
    fullAddress?: string;
    latitude?: number;
    longitude?: number;
  }) => void;
  darkMode?: boolean;
  initialValues?: {
    house?: string;
    street?: string;
    city?: string;
    pincode?: string;
  };
}

export function LocationPicker({ open, onOpenChange, onLocationSelect, darkMode = false, initialValues }: LocationPickerProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [manualEntry, setManualEntry] = useState({
    house: "",
    street: "",
    city: "",
    pincode: "",
    fullAddress: ""
  });

  useEffect(() => {
    if (open && initialValues) {
      setManualEntry({
        house: initialValues.house || "",
        street: initialValues.street || "",
        city: initialValues.city || "",
        pincode: initialValues.pincode || "",
        fullAddress: [initialValues.house, initialValues.street, initialValues.city, initialValues.pincode]
          .filter(Boolean).join(", ")
      });
    }
  }, [open, initialValues]);

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
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          if (data && data.address) {
            const address = data.address;
            const house = address.house_number || "";
            const street = address.road || address.neighbourhood || "";
            const city = address.city || address.town || address.village || address.state_district || "";
            const pincode = address.postcode || "";
            const fullAddress = data.display_name || "";
            
            setManualEntry({
              house,
              street,
              city,
              pincode,
              fullAddress
            });
            
            toast({ 
              title: "Location Found", 
              description: "Address auto-filled. You can edit if needed." 
            });
          }
        } catch (error) {
          toast({ 
            title: "Geocoding Error", 
            description: "Could not fetch address. Please enter manually.", 
            variant: "destructive" 
          });
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

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({ title: "Enter Address", description: "Please enter an address to search.", variant: "destructive" });
      return;
    }

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&addressdetails=1`
      );
      const data = await response.json();
      setSearchResults(data);
      
      if (data.length === 0) {
        toast({ title: "No Results", description: "No addresses found. Try a different search.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Search Error", description: "Could not search. Please try again.", variant: "destructive" });
    }

    setIsSearching(false);
  };

  const handleSelectSearchResult = (result: any) => {
    const address = result.address || {};
    const house = address.house_number || "";
    const street = address.road || address.neighbourhood || "";
    const city = address.city || address.town || address.village || address.state_district || "";
    const pincode = address.postcode || "";
    
    setManualEntry({
      house,
      street,
      city,
      pincode,
      fullAddress: result.display_name || ""
    });
    
    setShowSearchResults(false);
    setSearchQuery("");
    toast({ title: "Address Selected", description: "You can edit the fields if needed." });
  };

  const handleManualSubmit = () => {
    if (!manualEntry.city && !manualEntry.fullAddress) {
      toast({ title: "Address Required", description: "Please enter at least the city or full address.", variant: "destructive" });
      return;
    }
    
    onLocationSelect({
      house: manualEntry.house,
      street: manualEntry.street,
      city: manualEntry.city,
      pincode: manualEntry.pincode,
      fullAddress: manualEntry.fullAddress
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
      <DialogContent className={`${baseClasses} max-w-md max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className={darkMode ? "text-white" : ""}>
            <div className="flex items-center gap-2">
              <MapPin className={darkMode ? "text-cyan-400" : "text-blue-600"} />
              Select Location
            </div>
          </DialogTitle>
          <DialogDescription className={darkMode ? "text-slate-400" : ""}>
            Use GPS, search, or enter address manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Use Current Location */}
          <Button
            onClick={handleGetCurrentLocation}
            disabled={isLoading}
            className={`w-full h-12 rounded-xl ${
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
            {isLoading ? "Getting Location..." : "Use My Current Location"}
          </Button>

          {/* Search Box */}
          <div className="space-y-2">
            <Label className={`text-xs ${labelClasses}`}>Search Address</Label>
            <div className="flex gap-2">
              <Input
                className={`h-11 rounded-lg flex-1 ${inputClasses}`}
                placeholder="Search any address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                data-testid="input-search-address"
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                size="icon"
                className={`h-11 w-11 rounded-lg ${
                  darkMode 
                    ? "bg-cyan-500 hover:bg-cyan-600" 
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                data-testid="button-search-address"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Search Results */}
          {showSearchResults && searchResults.length > 0 && (
            <div className={`rounded-lg border max-h-40 overflow-y-auto ${darkMode ? "bg-slate-700 border-slate-600" : "bg-gray-50 border-gray-200"}`}>
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectSearchResult(result)}
                  className={`w-full text-left p-3 text-sm border-b last:border-0 ${
                    darkMode 
                      ? "border-slate-600 hover:bg-slate-600 text-white" 
                      : "border-gray-100 hover:bg-gray-100"
                  }`}
                  data-testid={`search-result-${index}`}
                >
                  <MapPin className={`w-3 h-3 inline mr-2 ${darkMode ? "text-cyan-400" : "text-blue-600"}`} />
                  {result.display_name?.substring(0, 80)}...
                </button>
              ))}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className={`w-full border-t ${darkMode ? "border-slate-700" : "border-gray-200"}`} />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`px-2 ${darkMode ? "bg-slate-800 text-slate-500" : "bg-white text-gray-500"}`}>
                Address Details
              </span>
            </div>
          </div>

          {/* Full Address Textarea */}
          <div className="space-y-1">
            <Label className={`text-xs ${labelClasses}`}>Full Address</Label>
            <Textarea
              className={`min-h-[80px] rounded-lg ${inputClasses}`}
              placeholder="Enter complete address (auto-filled from GPS/search, editable)"
              value={manualEntry.fullAddress}
              onChange={(e) => setManualEntry({ ...manualEntry, fullAddress: e.target.value })}
              data-testid="input-full-address"
            />
          </div>

          {/* Individual Fields */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className={`text-xs ${labelClasses}`}>House/Flat No.</Label>
                <Input
                  className={`h-10 rounded-lg ${inputClasses}`}
                  placeholder="e.g. 12A"
                  value={manualEntry.house}
                  onChange={(e) => setManualEntry({ ...manualEntry, house: e.target.value })}
                  data-testid="input-loc-house"
                />
              </div>
              <div className="space-y-1">
                <Label className={`text-xs ${labelClasses}`}>Pincode</Label>
                <Input
                  className={`h-10 rounded-lg ${inputClasses}`}
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
                className={`h-10 rounded-lg ${inputClasses}`}
                placeholder="e.g. Park Street"
                value={manualEntry.street}
                onChange={(e) => setManualEntry({ ...manualEntry, street: e.target.value })}
                data-testid="input-loc-street"
              />
            </div>
            <div className="space-y-1">
              <Label className={`text-xs ${labelClasses}`}>City *</Label>
              <Input
                className={`h-10 rounded-lg ${inputClasses}`}
                placeholder="e.g. Kolkata"
                value={manualEntry.city}
                onChange={(e) => setManualEntry({ ...manualEntry, city: e.target.value })}
                data-testid="input-loc-city"
              />
            </div>
          </div>

          <Button
            onClick={handleManualSubmit}
            className={`w-full h-12 rounded-xl ${
              darkMode 
                ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white" 
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
            data-testid="button-confirm-address"
          >
            <Check className="w-5 h-5 mr-2" />
            Confirm Address
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
