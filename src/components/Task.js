import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';

import Swipeable from 'react-native-gesture-handler/Swipeable'
import { FontAwesome } from '@expo/vector-icons'

import moment from 'moment'
import 'moment/locale/pt-br'

import commonStyles from '../commonStyles'

export default props => {

    let check = null
    if(props.doneAt !== null) {
        check = (<View style={styles.done}>
            <FontAwesome name="check" size={20} color={commonStyles.colors.secondary} />
        </View>)
    } else {
        check = <View style={styles.pending} />
    }

    const descStyle=props.doneAt !== null ? { textDecorationLine: 'line-through' } : {}

    const getRightContent = () => {
        return (
            <View style={styles.right}>
                <Text style={styles.excludeText}>Arquivar</Text>
                <FontAwesome name='archive' size={20} color='#fff'/>
            </View>
        )
    }

    const getLeftContent = () => {
        return (
            <View style={styles.left}>
                <FontAwesome name='trash' size={20} color='#fff' style={styles.excludeIcon}/>
                <Text style={styles.excludeText}>Excluir</Text>
            </View>
        )
    }

    return (
        <Swipeable renderRightActions={getRightContent}
            renderLeftActions={getLeftContent}
            onSwipeableLeftOpen={() => props.onDelete(props.id)}
            onSwipeableRightOpen={() => props.onArchiveTask(props.id)}>
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => props.onToggleTask(props.id)}>
                    <View style={styles.checkContainer}>{check}</View>
                </TouchableWithoutFeedback>
                <View>
                    <Text style={[styles.description, descStyle]}>{props.desc}</Text>
                    <Text style={styles.date}>{moment(props.estimateAt).locale('pt-br').format('ddd D [de] MMMM')}</Text>
                </View>
            </View>
        </Swipeable>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#AAA',
        backgroundColor: '#fff'
    },
    checkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
    },
    pending: {
        borderWidth: 1,
        height: 25,
        width: 25,
        borderRadius: 15,
        borderColor: '#555',
    },
    done: {
        height: 25,
        width: 25,
        borderRadius: 15,
        backgroundColor: '#4d7031',
        alignItems: 'center',
        justifyContent: "center"
    },
    description: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 15
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.mainText,
        fontSize: 12
    },
    right: {
        flex:1,
        backgroundColor: '#080',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        paddingRight: 10
    },
    left: {
        flex: 1,
        backgroundColor: 'red',
        flexDirection: "row",
        alignItems: "center",
    },
    excludeText: {
        fontFamily: commonStyles.fontFamily,
        color: '#fff',
        fontSize: 20,
        margin: 10,
    },
    excludeIcon: {
        marginLeft: 10
    },
    archiveIcon: {
        marginLeft: 10,
    }
})