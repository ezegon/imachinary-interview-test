import React, { useEffect, useState } from "react";
import "./App.css";
import { Location } from "../../shared/interfaces/Location";
import axios from "axios";
import { ApiLocation } from "../../shared/interfaces/ApiLocation";

const App: React.FC = () => {
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");
  const [locations, setLocations] = useState<Location[]>([
    {
      lat: "-34.603722",
      long: "-58.381592",
    },
    {
      lat: "-33.459229",
      long: "-70.645348",
    },
    {
      lat: "40.730610",
      long: "-73.935242",
    },
    {
      lat: "35.6684415",
      long: "139.6007804",
    },
  ]);

  const [currentLocation, setCurrentLocation] = useState(0);
  const [locationData, setLocationData] = useState<ApiLocation>();

  const getCurrentLocationData = (currentLocation: any) => {
    axios
      .get("/api/weather", {
        params: {
          lat: locations[currentLocation].lat,
          long: locations[currentLocation].long,
        },
      })
      .then(({ data }) => setLocationData(data))
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentLocation((currentLocation + 1) % locations.length);
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [locations, currentLocation]);

  useEffect(() => {
    getCurrentLocationData(currentLocation);
  }, [currentLocation]);

  return (
    <div className="App">
      <h1>{locationData?.name}</h1>
      <img src={locationData?.icon} alt="" />
      {locationData?.weather}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLocations([...locations, { lat: lat, long: long }]);
          setLat("");
          setLong("");
        }}
      >
        <label htmlFor="lat">Latitud</label>
        <input
          required
          name="lat"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
        />
        <label htmlFor="long">Longitud</label>
        <input
          required
          value={long}
          onChange={(e) => setLong(e.target.value)}
        />
        <button>Agregar Locacion</button>
      </form>
    </div>
  );
};

export default App;
