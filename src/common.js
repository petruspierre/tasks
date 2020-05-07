import {Alert, Platform} from 'react-native'

const server = Platform.OS === 'ios'
    ? 'http://localhost:3000' : 'http://192.168.0.27:3000'

function showError(err) {
    if(err.response && err.response.data) {
        Alert.alert('Ocorreu um problema', `${err.response.data}`)
    }
}

function showSuccess(msg){
    Alert.alert('Sucesso', msg)
}

export { server, showError, showSuccess }
