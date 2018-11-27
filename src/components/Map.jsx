import React from 'react'
import PropTypes from 'prop-types'
import MapGL, { HTMLOverlay } from 'react-map-gl'
import Rectangle from './Rectangle'
import { compose, withStateHandlers, withHandlers, withState } from 'recompose'
import { DownloadBtn, CancelBtn, UnlockBtn } from './Buttons'
import { getTiles, getArea } from '../lib/util'
import mapStyle from './map-style-basic.json'

const MAXAREA = 4000 // sq km
const ZOOMRANGE = [8, 16]

export const STATES = {
  LOCKED: 'locked',
  NAVIGATING: 'navigating',
  ERROR: 'error',
  DOWNLOADING: 'downloading',
  CANCELED: 'canceled',
  COMPLETE: 'complete'
}

const Map = ({ viewport, setViewport, state, unlock, download, cancel, onRedraw }) => (
  <MapGL
    {...viewport}
    width='100%'
    height='100%'
    mapStyle={mapStyle}
    onViewportChange={viewport => state === STATES.NAVIGATING ? setViewport(viewport) : null}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
  >

    <HTMLOverlay redraw={onRedraw} />

    { state === STATES.LOCKED || state === STATES.CANCELED ? <UnlockBtn cb={unlock} /> : null }
    { state === STATES.NAVIGATING ? <DownloadBtn cb={download} /> : null }
    { state === STATES.DOWNLOADING ? <CancelBtn cb={cancel} /> : null }

  </MapGL>
)

Map.propTypes = {
  viewport: PropTypes.object,
  setViewport: PropTypes.func,
  unlock: PropTypes.func,
  cancel: PropTypes.func,
  download: PropTypes.func
}

export default compose(
  withStateHandlers(
    {
      state: STATES.LOCKED,
      tiles: [],
      progress: [0, 0]
    },
    {
      setTiles: () => tiles => ({ tiles }),
      // Now here are some functions for changing the state
      setTotal: ({ progress }) => (total) => ({ progress: [progress[0], total] }),
      unlock: () => () => ({ state: STATES.NAVIGATING }),
      download: () => () => ({ state: STATES.DOWNLOADING }),
      cancel: () => () => ({ state: STATES.CANCELED, progress: [0, 0] }),
      tick: ({ progress }) => () => {
        if (progress[0] + 1 >= progress[1]) return ({ state: STATES.COMPLETE, progress: [0, 0] })
        else return ({ progress: [progress[0] + 1, progress[1]] })
      }
    }
  ),
  // The HTMLOverlay component serves everything through a redraw callback so...
  withHandlers({
    onRedraw: ({ setTiles, state, progress }) => ({ height, width, project, unproject, isDragging }) => {
      if (!height || !width) return null
      const [left, top] = unproject([width * 0.125, height * 0.125])
      const [right, bottom] = unproject([width * 0.875, height * 0.875])

      let area = null
      if (!isDragging) {
        area = getArea(top, right, bottom, left)
        const tiles = getTiles(top, left, bottom, right, ZOOMRANGE)
        // setTiles(tiles)
      }

      const retVal = <Rectangle
        state={state}
        progress={progress}
        area={area}
        maxArea={MAXAREA}
      />
      return retVal
    }
  }),
  // This state changes much more often so keep it lower on the stack
  withState('viewport', 'setViewport', {
    zoom: 12,
    latitude: 49.3050394,
    longitude: -123.1398254
  })
)(Map)
