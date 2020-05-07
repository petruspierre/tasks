import './node_modules/expo/build/Expo.fx';
import registerRootComponent from './node_modules/expo/build/launch/registerRootComponent';
import { activateKeepAwake } from 'expo-keep-awake';

import Navigator from './src/Navigator'

if (__DEV__) {
  activateKeepAwake();
}

registerRootComponent(Navigator);
