import express from "express";
import axios from "axios";
import path from "path";

const app = express();

app.use(express.static(path.resolve(__dirname, "../client/build/")));

const ApiRouter = express.Router();

ApiRouter.get("/weather", (req, res) => {
  const { lat, long } = req.query;

  if (!(lat || long)) {
    return res.status(400).json({ message: "Latitude and longitude required" });
  }

  axios
    .get(
      `https://thingproxy.freeboard.io/fetch/https://www.metaweather.com/api/location/search/?lattlong=${lat},${long}`
    )
    .then(({ data }) => {
      return axios.get(
        `https://thingproxy.freeboard.io/fetch/https://www.metaweather.com/api/location/${data[0].woeid}`
      );
    })
    .then(({ data }) => {
      return res.json({
        name: data.title,
        weather: data.consolidated_weather[0].weather_state_name,
        icon: `https://www.metaweather.com/static/img/weather/${data.consolidated_weather[0].weather_state_abbr}.svg`,
      });
    })
    .catch((e) => {
      console.error(e);
      return res.status(500).json(null);
    });
});

app.use("/api", ApiRouter);

app.get("/", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../client/build/", "index.html"))
);

app.listen(3001, () => {
  console.log("> Server listening on port 3001");
});
