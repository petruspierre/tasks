import React from 'react'

import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import { createDrawerNavigator } from 'react-navigation-drawer';

import Auth from './screens/Auth'
import Agenda from './screens/Agenda'
import Menu from './screens/Menu'
import commonStyles from './commonStyles'
import AuthOrApp from './screens/AuthOrApp'

const menuConfig = {
    unmountInactiveRoutes : true,
    initialRouteName: 'Today',
    contentComponent: Menu,
    contentOptions: {
        labelStyle: {
            fontFamily: commonStyles.fontFamily,
            fontWeight: 'normal',
            fontSize: 20
        },
        activeLabelStyle: {
            color: '#080',
            fontWeight: 'bold',
        }
    }
}

const menuRoutes = {
    Today: {
        name: 'Today',
        screen: props => <Agenda title='Hoje' daysAhead={0} {...props} />,
        navigationOptions: {
            title: 'Hoje'
        } 
    },
    Tomorrow: {
        name: 'Tomorrow',
        screen: props => <Agenda title='Amanhã' daysAhead={1} {...props} />,
        navigationOptions: {
            title: 'Amanhã'
        }
    },
    Week: {
        name: 'Week',
        screen: props => <Agenda title='Semana' daysAhead={7} {...props} />,
        navigationOptions: {
            title: 'Em 7 dias'
        }
    },
    Month: {
        name: 'Month',
        screen: props => <Agenda title='Mês' daysAhead={30} {...props} />,
        navigationOptions: {
            title: 'Em 30 dias'
        }
    },
    Archive: {
        name: 'Arquivo',
        screen: props => <Agenda title='Arquivo' daysAhead={365} {...props} />,
        navigationOptions: {
            title: 'Arquivo'
        }
    }
}

const menuNavigator = createDrawerNavigator(menuRoutes, menuConfig)






const mainRoutes = {
    Auth: {
        name: 'Auth',
        screen: Auth
    },
    Home: {
        name: 'Home',
        screen: menuNavigator
    },
    AuthOrApp: {
        name: 'AuthOrApp',
        screen: AuthOrApp
    }
}

const mainNavigator = createSwitchNavigator(mainRoutes, {
    initialRouteName: 'AuthOrApp'
})

export default createAppContainer(mainNavigator)