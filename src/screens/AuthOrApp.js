import React, { Component } from 'react'
import {
    View,
    ActivityIndicator,
    StyleSheet,
    AsyncStorage
} from 'react-native'

import * as Font from 'expo-font';
import axios from 'axios'

export default class AuthOrApp extends Component {

    componentDidMount = async () => {

        await Font.loadAsync({
            'Lato': require('../../assets/fonts/Lato.ttf'),
        });

        const userDataJson = await AsyncStorage.getItem('userData')
        let userData = null
        
        try {
            userData = JSON.parse(userDataJson)
        } catch (e) {
            // userData está inválido
        }

        if(userData && userData.token) {
            axios.defaults.headers.common['Authorization'] = `bearer ${userData.token}`
            this.props.navigation.navigate('Home', userData)
        } else {
            this.props.navigation.navigate('Auth')
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large'/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'black',
    },
})