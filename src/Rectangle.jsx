import React from 'react'
import PropTypes from 'prop-types'
// import { Button } from 'semantic-ui-react'
import { HTMLOverlay } from 'react-map-gl'
import { compose, withHandlers } from 'recompose'
import turf from 'turf'
import numeral from 'numeral'

const MAXAREA = 4000 // sq km
const MAXZOOM = 17
const MINZOOM = 8

const Rectangle = ({ onRedraw }) => (
  <HTMLOverlay redraw={onRedraw} isDragging={false} />
)

Rectangle.propTypes = {
  onRedraw: PropTypes.func,
  locked: PropTypes.bool
}

export default compose(
  withHandlers({
    onRedraw: ({ locked }) => ({ height, width, project, unproject, isDragging }) => {
      if (!height || !width) return null
      const [left, top] = unproject([width * 0.125, height * 0.125])
      const [right, bottom] = unproject([width * 0.875, height * 0.875])

      var polygon = turf.polygon([[
        [left, top],
        [right, top],
        [right, bottom],
        [left, bottom],
        [left, top]
      ]])
      const area = turf.area(polygon) / (1000 * 1000)
      const tiles = getTiles(top, left, bottom, right)
      const classes = ['selectRect']
      if (locked) classes.push('locked')
      else classes.push(area >= MAXAREA ? 'negative' : 'positive')

      const rect = <div className={classes.join(' ')}>
        <div className='areaLabel'>
          {numeral(area).format('0,0')} km²
        </div>
        {area >= MAXAREA ? <div className='warning'>> {MAXAREA} km²</div> : null}

      </div>
      console.log('HERE I AM', area, locked)
      return rect
    }
  })
)(Rectangle)

Math.sec = function (x) {
  return 1 / Math.cos(x)
}

function getTiles (top, left, bottom, right) {
  for (let zoom = MINZOOM; zoom <= MAXZOOM; zoom++) {
    const n = 2 ^ zoom
    const xtileLeft = Math.floor(n * ((left + 180) / 360))
    const xtileRight = Math.ceil(n * ((right + 180) / 360))
    const ytileTop = Math.floor(n * (1 - (Math.log(Math.tan(top) + Math.sec(top)) / Math.PI)) / 2)
    const ytileBottom = Math.ceil(n * (1 - (Math.log(Math.tan(bottom) + Math.sec(bottom)) / Math.PI)) / 2)
    console.log(`Tiles: ZOOM: ${zoom} X: [${xtileLeft}-${xtileRight}] Y: [${ytileTop}-${ytileBottom}]`)
  }
}
