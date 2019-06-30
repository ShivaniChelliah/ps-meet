import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Client as Styletron} from '../node_modules/styletron-engine-atomic';
import {Provider as StyletronProvider} from '../node_modules/styletron-react';

import {LightTheme, BaseProvider} from '../node_modules/baseui';

const engine = new Styletron();

ReactDOM.render( <StyletronProvider value={engine}>
    <BaseProvider theme={LightTheme}>
    <App />
    </BaseProvider> 
    </StyletronProvider>, 
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
 
 