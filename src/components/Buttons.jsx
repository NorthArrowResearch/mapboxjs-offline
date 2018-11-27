import React from 'react'
import PropTypes from 'prop-types'
import { Button } from 'semantic-ui-react'

export const DownloadBtn = ({ cb }) => (
  <Button
    className='funcButton'
    onClick={(e) => {
      e.preventDefault()
      cb()
    }}
    content='Download'
    icon='download'
    size='massive'
    style={{ zIndex: 1000 }}
    color='blue'
  />
)
DownloadBtn.propTypes = {
  cb: PropTypes.func
}

export const CancelBtn = ({ cb }) => (
  <Button
    className='funcButton'
    onClick={(e) => {
      e.preventDefault()
      cb()
    }}
    content='Cancel'
    icon='cancel'
    size='massive'
    style={{ zIndex: 1000 }}
    color='red'
  />
)
CancelBtn.propTypes = {
  cb: PropTypes.func
}

export const UnlockBtn = ({ cb }) => (
  <Button
    className='funcButton'
    onClick={(e) => {
      e.preventDefault()
      cb()
    }}
    content='Unlock'
    icon='lock'
    size='massive'
    style={{ zIndex: 1000 }}
    color='black'
  />
)
UnlockBtn.propTypes = {
  cb: PropTypes.func
}
