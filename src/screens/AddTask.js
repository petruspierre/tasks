import React, { Component } from 'react';

import { 
    Platform,
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
} from 'react-native';

import commonStyles from '../commonStyles'

import moment from 'moment'
import DateTimePicker from '@react-native-community/datetimepicker'

const initialState = { desc: '', date: new Date(), showDatePicker: false }

const Overlay = props => {
    return(
         <TouchableWithoutFeedback onPress={props.onCancel}>
            <View style = {styles.background}></View>
        </TouchableWithoutFeedback>
    )
}

export default class AddTask extends Component {

    state = {
        ...initialState
    }

    save = () => {
        const newTask = {
            desc: this.state.desc,
            date: this.state.date
        }

        this.props.onSave && this.props.onSave(newTask)
        this.setState({ ...initialState })
    }

    getDatePicker = () => {
        let datePicker = (
        <DateTimePicker value={this.state.date} 
            onChange={(_, date) => this.setState({ date, showDatePicker: false })}
            mode='date'/>
        )
        
        const dateString = moment(this.state.date).format('dddd, D [de] MMMM [de] YYYY')

        if(Platform.OS === 'android') {
            datePicker = (
                <View>
                    <TouchableOpacity onPress={() => this.setState( {showDatePicker: true} )}>
                        <Text style={styles.date}>
                            {dateString}
                        </Text>
                    </TouchableOpacity>
                    {this.state.showDatePicker ? datePicker : false}
                </View>
            )
        }

        return datePicker
    }

  render() {
    return (
        <Modal transparent={true} visible={this.props.isVisible} onRequestClose={this.props.onCancel} animationType='fade'>
            <Overlay onCancel={this.props.onCancel}/>
            <View style={styles.container}>
                <Text style={styles.header}>Nova tarefa</Text>

                <TextInput style={styles.input} 
                    placeholder='Informe a descrição' 
                    onChangeText={desc => this.setState( {desc} )} 
                    value={this.state.desc}/>

                {this.getDatePicker()}

                <View style={styles.buttons}>
                    <TouchableOpacity onPress={this.props.onCancel}>
                        <Text style={styles.button}>Cancelar</Text>    
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.save}>
                        <Text style={styles.button}>Salvar</Text>
                    </TouchableOpacity>
                </View>

            </View>
            <Overlay onCancel={this.props.onCancel}/>
        </Modal>
    )
  }
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0, 0.7)'
    },
    container: {
        // flex:1,
        backgroundColor: '#fff'
    },
    header: {
        fontFamily: commonStyles.fontFamily,
        backgroundColor: commonStyles.colors.today,
        color: commonStyles.colors.secondary,
        textAlign: 'center',
        padding: 15,
        fontSize: 18,
    },
    input: {
        paddingLeft: 10,
        fontFamily: commonStyles.fontFamily,
        height: 40,
        margin: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e3e3e3',
        borderRadius: 6,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: "flex-end",
    },
    button: {
        margin: 20,
        marginRight: 30,
        color: commonStyles.colors.today,
    },
    date: {
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        textAlign: "center",
        marginVertical: 15
    }
})
