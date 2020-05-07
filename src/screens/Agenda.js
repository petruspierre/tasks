import React, { Component } from 'react';
import { View,
    StyleSheet,
    Text,
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform,
    Alert,
    AsyncStorage } from 'react-native';

import moment from 'moment'
import 'moment/locale/pt-br'
import * as Font from 'expo-font'
import { FontAwesome } from '@expo/vector-icons'
import axios from 'axios'

import {server, showError} from '../common'
import todayImage from '../../assets/imgs/today.jpg'
import tomorrowImage from '../../assets/imgs/tomorrow.jpg'
import weekImage from '../../assets/imgs/week.jpg'
import monthImage from '../../assets/imgs/month.jpg'
import commonStyles from '../commonStyles'
import Task from '../components/Task'
import AddTask from './AddTask'

const initialState = {
    tasks: [],
    visibleTasks: [],
    showDoneTasks: true,
    fontLoaded: false,
    showAddTaskModal: false,
}

export default class Agenda extends Component {

    state = {
        ...initialState
    }

    async componentDidMount() {
        const stateString = await AsyncStorage.getItem('tasksState')
        const savedState = JSON.parse(stateString) || initialState
        this.setState({showDoneTasks: savedState.showDoneTasks}, this.filterTasks)

        this.loadTasks()
    }

    loadTasks = async () => {
        try {
            const maxDate = moment().add({days: this.props.daysAhead}).format('YYYY-MM-DD 23:59:59')
            const res = await axios.get(`${server}/tasks?date=${maxDate}`)
            this.setState({ tasks: res.data }, this.filterTasks)
        } catch(e) {
            showError(e)
        }
    }

    filterTasks = () => {
        let visibleTasks = null
        if(this.props.daysAhead === 365){
            const pending = task => task.archived === true
            visibleTasks = this.state.tasks.filter(pending)
        }
        else if(this.state.showDoneTasks) {
            const pending = task => task.archived !== true
            visibleTasks = this.state.tasks.filter(pending)
        } else {
            const pending = task => task.doneAt === null && task.archived !== true
            visibleTasks = this.state.tasks.filter(pending)
        }
        this.setState({ visibleTasks })
        AsyncStorage.setItem('tasksState', JSON.stringify({showDoneTasks: this.state.showDoneTasks}))
    }

    toggleFilter = () => {
        this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
    }

    toggleTask = async taskId => {
        
        try {
            await axios.put(`${server}/tasks/${taskId}/toggle`)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
        
    }

    archiveTask = async taskId => {
        try {
            await axios.put(`${server}/tasks/${taskId}/archive`)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    addTask = async newTask => {
        if(!newTask.desc.trim()) {
            Alert.alert('Dados inválidos', 'Descrição não informada.')
            return
        }
        
        try {
            await axios.post(`${server}/tasks`, {
                desc: newTask.desc,
                estimateAt: newTask.date
            })

            this.setState( {showAddTaskModal: false}, this.loadTasks )
        } catch (e) {
            showError(e)
        }

    }

    deleteTask = async taskId => {
        try {
            await axios.delete(`${server}/tasks/${taskId}`)
            this.loadTasks()
        } catch(e) {
            showError(e)
        }
    }

    getImage = () => {
        switch(this.props.daysAhead) {
            case 0: return todayImage
            case 1: return tomorrowImage
            case 7: return weekImage
            default: return monthImage
        }
    }

    getColor = () => {
        switch(this.props.daysAhead) {
            case 0: return commonStyles.colors.today
            case 1: return commonStyles.colors.tomorrow
            case 7: return commonStyles.colors.week
            default: return commonStyles.colors.month
        }
    }

    render() {
    return (
        <View style={styles.container}>

            <AddTask isVisible={this.state.showAddTaskModal}
                onCancel={() => this.setState( {showAddTaskModal: false} )}
                onSave={this.addTask} />

            <ImageBackground source={this.getImage()} style={styles.background}>

                <View style={styles.iconBar}>
                    <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                        <FontAwesome name={'bars'} 
                            size={25} color={commonStyles.colors.secondary} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.toggleFilter}>
                        <FontAwesome name={this.state.showDoneTasks ? 'eye-slash' : 'eye'} 
                            size={20} color={commonStyles.colors.secondary} />
                    </TouchableOpacity>
                </View>

                <View style={styles.titleBar}>
                    <Text style={styles.title}>{this.props.title}</Text>
                    <Text style={styles.subtitle}>{moment().locale('pt-br').format('ddd, D [de] MMMM')}</Text>
                </View>

            </ImageBackground>

            <View style={styles.tasksContainer}>
                <FlatList data={this.state.visibleTasks} keyExtractor={item => `${item.id}`} 
                    renderItem={({item}) => <Task {...item} onToggleTask={this.toggleTask} onDelete={this.deleteTask} onArchiveTask={this.archiveTask} />} />
            </View>

            <TouchableOpacity style={[styles.addButton, {backgroundColor: this.getColor()}]} 
                onPress={() => this.setState( { showAddTaskModal: true })}
                activeOpacity={0.7}>
                <FontAwesome name='plus' size={20} color={commonStyles.colors.secondary}/>
            </TouchableOpacity>

        </View>
    )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 3,
    },
    titleBar:{
        flex:1,
        justifyContent: 'flex-end',
    },
    title:{
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.secondary,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    tasksContainer: {
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    addButton: {
        position: "absolute",
        right: 30,
        bottom: 30,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    }
})
