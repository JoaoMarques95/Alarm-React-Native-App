import React, { Component } from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import Login from './components/Login.js';
import Profile from './components/Profile.js';

const Aplication = createStackNavigator(
        {
                Home: { screen: Login },
                Profile: { screen: Profile },
        },
        { headerMode: 'none' }
);

const AppContainer = createAppContainer(Aplication);

export default class App extends Component {
        render() {
                return <AppContainer />;
        }
}
