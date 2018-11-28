import React from 'react'
import PropTypes from 'prop-types'
import MapGL, { HTMLOverlay } from 'react-map-gl'
import Rectangle from './Rectangle'
import Bottleneck from 'bottleneck'
import { compose, withStateHandlers, withHandlers, withState, lifecycle, pure } from 'recompose'
import { DownloadBtn, CancelBtn, UnlockBtn } from './Buttons'
import { getTiles, getArea, numericArrayCompare } from '../lib/util'
import mapStyle from './map-style-basic.json'

const MAXAREA = 4000 // sq km
const ZOOMRANGE = [8, 16]

export const STATES = {
  LOCKED: 'locked',
  NAVIGATING: 'navigating',
  ERROR: 'error',
  DOWNLOADING: 'downloading',
  CANCELED: 'canceled'
}

const Map = ({ viewport, setViewport, state, setUnlock, startDownload, setCancel, onRedraw }) => (
  <MapGL
    {...viewport}
    width='100%'
    height='100%'
    mapStyle={mapStyle}
    onViewportChange={viewport => state === STATES.NAVIGATING ? setViewport(viewport) : null}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
  >

    <HTMLOverlay redraw={onRedraw} />

    { state === STATES.LOCKED || state === STATES.CANCELED ? <UnlockBtn cb={setUnlock} /> : null }
    { state === STATES.NAVIGATING ? <DownloadBtn cb={startDownload} /> : null }
    { state === STATES.DOWNLOADING ? <CancelBtn cb={setCancel} /> : null }

  </MapGL>
)

Map.propTypes = {
  viewport: PropTypes.object,
  setViewport: PropTypes.func,
  setUnlock: PropTypes.func,
  setCancel: PropTypes.func,
  startDownload: PropTypes.func
}

export default compose(
  withStateHandlers(
    {
      state: STATES.LOCKED,
      tiles: [],
      area: 0,
      windowCoords: null,
      progress: [0, 0]
    },
    {
      setWindowCoords: ({ progress }) => windowCoords => {
        const area = getArea(...windowCoords)
        const tiles = getTiles(...windowCoords, ZOOMRANGE)
        return {
          windowCoords: windowCoords,
          area,
          tiles,
          progress: [progress[0], tiles.length]
        }
      },
      // Now here are some functions for changing the state
      setTotal: ({ progress }) => (total) => ({ progress: [progress[0], total] }),
      setUnlock: () => () => ({ state: STATES.NAVIGATING }),
      setDownload: () => () => ({ state: STATES.DOWNLOADING }),
      setCancel: () => () => ({ state: STATES.CANCELED, progress: [0, 0] }),
      tick: ({ progress }) => () => {
        if (progress[0] + 1 >= progress[1]) return ({ state: STATES.LOCKED, progress: [0, 0] })
        else return ({ progress: [progress[0] + 1, progress[1]] })
      }
    }
  ),
  // The HTMLOverlay component serves everything through a redraw callback so...
  withHandlers({
    onRedraw: ({ state, area, progress, windowCoords, setWindowCoords }) =>
      ({ height, width, project, unproject, isDragging }) => {
        if (!height || !width) return null
        const [left, top] = unproject([width * 0.125, height * 0.125])
        const [right, bottom] = unproject([width * 0.875, height * 0.875])

        const retVal = <WrappedRectangle
          state={state}
          area={area}
          maxArea={MAXAREA}
          forceUpdate={!isDragging && !numericArrayCompare([top, right, bottom, left], windowCoords)}
          windowCoords={[top, right, bottom, left]}
          setWindowCoords={setWindowCoords}
          progress={progress}
        />
        return retVal
      },
    startDownload: ({ tiles, tick, setDownload }) => () => {
      // Set the download state
      setDownload()
      // Set us up a rate limiter
      const limiter = new Bottleneck({ maxConcurrent: 5 })

      tiles.forEach(tile => {
        limiter.schedule(() => makeRequest('GET', tile))
          .then(tick)
          .catch(tick)
      })
    }
  }),
  // This state changes much more often so keep it lower on the stack
  withState('viewport', 'setViewport', {
    zoom: 12,
    latitude: 49.3050394,
    longitude: -123.1398254
  })
)(Map)

const WrappedRectangle = compose(
  pure,
  lifecycle({
    componentDidMount () {
      if (this.props.forceUpdate && this.props.windowCoords) {
        this.props.setWindowCoords(this.props.windowCoords)
      }
    },
    shouldComponentUpdate () {
      if (this.props.forceUpdate && this.props.windowCoords) {
        this.props.setWindowCoords(this.props.windowCoords)
      }
      return true
    }
  })
)(Rectangle)

/**
 * Promisify our XMLHttpRequests
 * @param {*} method
 * @param {*} url
 */
function makeRequest (method, url) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response)
      else reject(new Error(xhr.statusText))
    }
    xhr.onerror = () => {
      reject(new Error(xhr.statusText))
    }
    xhr.send()
  })
}
