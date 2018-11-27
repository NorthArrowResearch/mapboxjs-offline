import turf from 'turf'

/**
 * Misc Math helper functions
 */

Math.sec = x => 1 / Math.cos(x)

/**
 * Loop over all the tiles and zoom levels and build
 * us an array of URLs
 * @param {*} top
 * @param {*} left
 * @param {*} bottom
 * @param {*} right
 */
export function getTiles (top, left, bottom, right, zoomRange) {
  const tiles = []

  for (let zoom = zoomRange[0]; zoom <= zoomRange[1]; zoom++) {
    const xtileLeft = long2tile(left, zoom)
    const xtileRight = long2tile(right, zoom)

    const ytileTop = lat2tile(top, zoom)
    const ytileBottom = lat2tile(bottom, zoom)

    for (let x = xtileLeft; x <= xtileRight; x++) {
      for (let y = ytileTop; y <= ytileBottom; y++) {
        tiles.push(getTileURL(zoom, x, y))
      }
    }
  }
  console.log('Starting Coords', { tiles, top, left, bottom, right })
}

/**
 * Returns an area in square km
 * @param {*} top
 * @param {*} right
 * @param {*} bottom
 * @param {*} left
 */
export const getArea = (top, right, bottom, left) => {
  var polygon = turf.polygon([[
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
    [left, top]
  ]])
  return turf.area(polygon) / (1000 * 1000)
}

export const long2tile = (lon, zoom) => Math.floor(
  (lon + 180) / 360 * Math.pow(2, zoom)
)

export const lat2tile = (lat, zoom) => Math.floor(
  (1 - Math.log(
    Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)
  ) / Math.PI) / 2 * Math.pow(2, zoom)
)

export const getTileURL = (x, y, z) => {
  let url = process.env.REACT_APP_MAPBOX_TILEURL + `?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
  url.replace('{x}/{y}/{z}', `${z}/${x}/${y}`)
  return url
}
