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
        <Progress value={progress[0]} total={progress[1]} inverted progress='value' success={progress[0] >= 100}>
          Downloading Tiles
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
