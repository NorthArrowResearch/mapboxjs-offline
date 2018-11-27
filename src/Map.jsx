import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'
import MapGL from 'react-map-gl'
import Rectangle from './Rectangle'
import { compose, withState } from 'recompose'
import mapStyle from './map-style-basic.json'

const Map = ({ viewport, setViewport, locked, setLocked }) => (
  <MapGL
    {...viewport}
    width='100%'
    height='100%'
    mapStyle={mapStyle}
    onViewportChange={viewport => !locked ? setViewport(viewport) : null}
    mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
  >
    {console.log('ZOOM', viewport.zoom)}
    <ToggleButton locked={locked} setLocked={setLocked} />
    <Rectangle viewport={viewport} locked={locked} />
  </MapGL>
)

Map.propTypes = {
  viewport: PropTypes.object,
  setViewport: PropTypes.func
}
Map.defaultProps = {
  viewport: {
    zoom: 12,
    latitude: 49.3050394,
    longitude: -123.1398254
  }
}

export default compose(
  withState('viewport', 'setViewport'),
  withState('locked', 'setLocked', true)
)(Map)

const ToggleButton = ({ locked, setLocked }) => {
  return !locked
    ? <Button
      className='downloadBtn'
      onClick={(e) => {
        e.preventDefault()
        setLocked(true)
      }}
      content='Download'
      icon='download'
      size='massive'
      style={{ zIndex: 1000 }}
      color='blue'
    />
    : <Button
      className='downloadBtn'
      onClick={(e) => {
        e.preventDefault()
        setLocked(false)
      }}
      content='Unlock'
      icon='lock'
      size='massive'
      style={{ zIndex: 1000 }}
      color='black'
    />
}

ToggleButton.propTypes = {
  locked: PropTypes.bool,
  setLocked: PropTypes.func
}
