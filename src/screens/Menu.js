import React from 'react'
import {
    ScrollView,
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    TouchableOpacity
} from 'react-native'
import { DrawerItems } from 'react-navigation-drawer'
import { FontAwesome } from '@expo/vector-icons'
import { Gravatar, GravatarApi } from 'react-native-gravatar'
import commonStyles from '../commonStyles'
import axios from 'axios'

export default props => {

    const logout = () => {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        props.navigation.navigate('AuthOrApp')
    }

    const optionsGravatar = {
        email: props.navigation.getParam('email'),
        secure: true
    }

    return (
        <ScrollView>
            <View style={{alignItems: "center"}}>
                <Text style={styles.title}>Tasks</Text>
            </View>
    
            <View style={styles.header}>

                <Gravatar style={styles.avatar}
                    options={optionsGravatar} />

                <View styles={styles.userInfo}>
                    <Text style={styles.name}> {props.navigation.getParam('name')} </Text>
                    <Text style={styles.email}> {props.navigation.getParam('email')} </Text>
                </View>

                <TouchableOpacity onPress={logout}>
                    <View style={{marginLeft: 13}}>
                        <FontAwesome name='sign-out' size={30} color="#800"/>
                    </View>
                </TouchableOpacity>

            </View>
            <DrawerItems {...props}/>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: '#ddd',    
        alignItems: "center"
    },
    title: {
        color: '#000',
        fontFamily: commonStyles.fontFamily,
        fontSize: 30,
        paddingTop: 30,
        padding: 10,
    },
    avatar: {
        width: 60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        backgroundColor: '#222',
        margin: 10,
    },
    userInfo: {
        marginLeft: 15,
    },
    name: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        marginBottom: 5,
        color: commonStyles.colors.mainText
    },
    email: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: commonStyles.colors.subText,
        marginBottom: 5,
    }
})
