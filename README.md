# MapboxJS Offline

Very soon we're going to need maps cached offline in a PWA

It's going to mean drawing a rectangle and offline caching whatever tiles are undeneath that

### Expected Challenges

* PWA offline cache capacity is variable. 50Mb - 20Gb or 4% of disk space (whatever is smaller). We need to fail safe so that people always have something offline (even if it's not very high res).

<https://gis.stackexchange.com/questions/133205/wmts-convert-geolocation-lat-long-to-tile-index-at-a-given-zoom-level>

```js
// Given Longitude/latitude/zoom to tile numbers :

n = 2 ^ zoom
xtile = n * ((lon_deg + 180) / 360)
ytile = n * (1 - (log(tan(lat_rad) + sec(lat_rad)) / π)) / 2

// Given Tile numbers to longitude/latitude :

n = 2 ^ zoom
lon_deg = xtile / n * 360.0 - 180.0
lat_rad = arctan(sinh(π * (1 - 2 * ytile / n)))
lat_deg = lat_rad * 180.0 / π
```