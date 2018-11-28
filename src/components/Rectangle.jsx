import React from 'react'
import PropTypes from 'prop-types'
import { Progress } from 'semantic-ui-react'
import numeral from 'numeral'
import { STATES } from './Map'

const Rectangle = ({ state, progress, area, maxArea }) => {
  const classes = ['selectRect']
  classes.push(state)

  return (
    <div className={classes.join(' ')}>
      <div className='areaLabel'>
        {numeral(area).format('0,0')} km²
      </div>

      {state === STATES.DOWNLOADING ? (
        <Progress
          percent={Math.floor(100 * progress[0] / progress[1])}
          color='blue'
          size='big'
          inverted
          active
          progress='percent'
          success={progress[0] >= progress[1]}
        >
          Downloading Tiles ({progress[0]}/{progress[1]})
        </Progress>
      ) : null}

      {area >= maxArea ? <div className='warning'>> {maxArea} km²</div> : null}
    </div>

  )
}

Rectangle.propTypes = {
  state: PropTypes.string,
  progress: PropTypes.array,
  area: PropTypes.number,
  maxArea: PropTypes.number
}

export default Rectangle
