/* @refresh reload */
import 'windi.css'
import './style.css'
import { render } from 'solid-js/web'
import App from './App'

render(() => <App />, document.querySelector('#root')!)
