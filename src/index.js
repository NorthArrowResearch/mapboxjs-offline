import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

import 'semantic-ui-css/semantic.min.css'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapComponent from './components/Map'

import './styles.scss'

ReactDOM.render(<MapComponent />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register()
navigator.serviceWorker.register('tileWorker.js')
