import { useEffect, useState } from "react";

export default function RestaurantCollector() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const allRestaurants = new Map();

    async function init() {
      await loadGoogleMapsScript();
      await collect();
    }
    init();

    async function loadCoordinates() {
      try {
        const response = await fetch("/coordinates.json");
        return await response.json();
      } catch (err) {
        console.error("Error loading coordinates:", err);
        return [];
      }
    }

    async function nearbySearch(center) {
      const { Place, SearchNearbyRankPreference } = await window.google.maps.importLibrary("places");
      const placeCenter = new window.google.maps.LatLng(center.lat, center.lng);

      const request = {
        fields: ["id", "displayName", "location", "formattedAddress", "rating"],
        locationRestriction: {
          center: placeCenter,
          radius: 50,
        },
        includedPrimaryTypes: ["restaurant"],
        maxResultCount: 20,
        rankPreference: SearchNearbyRankPreference.DISTANCE,
        region: "kr",
      };

      const { places } = await Place.searchNearby(request);
      return places || [];
    }

    async function  collect() {
      const coordinates = await loadCoordinates();
      if (!coordinates) return;

      for (const coordinate of coordinates) {
        const results = await nearbySearch(coordinate);

        results.forEach(place => {
          const id = place.id;
          const name = place.displayName;
          const rating = place.rating;
          const lat = typeof place.location?.lat === "function" ? place.location.lat() : place.location?.lat;
          const lng = typeof place.location?.lng === "function" ? place.location.lng() : place.location?.lng;
          const address = place.formattedAddress;
          if (!id || !name || typeof lat !== "number" || typeof lng !== "number"|| !rating|| !address) {
            console.warn("Missing data exist:", { id, name, lat, lng, rating, address  });
          }

          if (!allRestaurants.has(id)) {
            allRestaurants.set(id, {
              id,
              name,
              location: { lat, lng },
              rating,
              address,
            });
          }
        });
      }

      const list = Array.from(allRestaurants.values());
      setRestaurants(list);
      saveToJSONFile(list);
    }
    
    function loadGoogleMapsScript() {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve(); // 이미 로드됨
          return;
        }
    
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject("Google Maps JS API 로드 실패");
        document.head.appendChild(script);
      });
    }
    

    let saved = false;
    function saveToJSONFile(data, filename = "restaurants.json") {
      if (saved) return; 
      saved = true;

      const jsonStr = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json; charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      alert("저장 완료");
    }

    collect();
  }, []);

  return (
    <div>
      <h1> Found {restaurants.length} Restaurants</h1>
      <pre style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {JSON.stringify(restaurants, null, 2)}
      </pre>
    </div>
  );
}
