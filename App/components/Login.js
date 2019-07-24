import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Image,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import call from 'react-native-phone-call';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-community/async-storage';

// Net Casa-Aveiro:192.168.1.127
// Net phone:192.168.43.163
// PCI:192.168.128.1
// PCI_Coworking:192.168.183.25
// Net Casa:192.168.1.93

const Server_IP = 'http://192.168.1.127';

const args = {
  number: '911584404', // String value with the number to call
  prompt: false, // Optional boolean property. Determines if the user should be prompt prior to the call
};

// EMAIL HERE

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      isModalVisible: false,
    };
  }

  async componentDidMount() {
    this._loadInitialState().done();
  }

  _loadInitialState = async () => {
    const value = await AsyncStorage.getItem('user'); // getting username from storage
    if (value !== null) {
      // user already loged in
      // Aqui sempre que ele entra tenho que fazer um pedido a base de dados com este valor para perceber se tem a toma feita
      // Dps chamar a função para passar as props para o profile. Para isso é preciso criar um endpoint no servidor diferente.
      this.props.navigation.navigate('Profile', {
        Username: value /* params go here */,
      }); // go to the member area page
    }
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  login = () => {
    fetch(`${Server_IP}:3000/login`, {
      // fetch localhost server adress
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        // what is the body of the sended message?
        username: this.state.username, // username is the variable used on node
      }),
    })
      .then(response => response.json()) // conver to json the messsage received
      .then(res => {
        if (res.success === true) {
          // check if user exists
          AsyncStorage.setItem('user', this.state.username);
          console.log(this.state.username);
          this.props.navigation.navigate('Profile', {
            Username: this.state.username,
          });
        } else {
          this.setState({ username: '' });
          alert(res.message); // send alert
        }
      })
      .done();
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.wrapper}>
        <ScrollView style={styles.wrapper}>
          <View style={styles.container}>
            <Image source={require('../assets/logo2.png')} style={styles.logo} />

            <Text style={styles.header2}>Insira o seu nome!</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Username"
              onChangeText={username => this.setState({ username })}
              value={this.state.username}
            />

            <TouchableOpacity style={styles.btn} onPress={this.login}>
              <Text>Enter</Text>
            </TouchableOpacity>
            {/* onPress={() => {
                call(args).catch(console.error)
              }} */}
            <Text style={styles.header3} onPress={this.toggleModal}>
              Não se lembra? Contacte-nos
            </Text>

            <Modal
              useNativeDriver
              transparent
              isVisible={this.state.isModalVisible}
              onBackdropPress={() => this.setState({ isModalVisible: false })}
            >
              <View style={styles.PopupWraper}>
                <View style={styles.Popup}>
                  <View style={{ flexDirection: 'row' }}>
                    <Image
                      onPress={() => {
                        call(args).catch(console.error);
                      }}
                      source={require('../assets/phone.png')}
                      style={styles.Icon}
                    />
                    <Image source={require('../assets/gmail.png')} style={styles.Icon} />
                  </View>
                  <Text style={styles.Close} onPress={this.toggleModal}>
                    {' '}
                    Close{' '}
                  </Text>
                </View>
              </View>
            </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  PopupWraper: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  Popup: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  wrapper: {
    flexGrow: 1,
    backgroundColor: '#ecf0f1',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    paddingLeft: 40,
    paddingRight: 40,
  },
  header: {
    fontSize: 45,
    marginBottom: 60,
    color: '#3498db',
    fontWeight: 'bold',
  },
  header1: {
    fontSize: 24,
    paddingTop: 22,
    marginBottom: 60,
    color: '#3498db',
    fontWeight: 'bold',
  },
  header2: {
    fontSize: 16,
    marginBottom: 20,
    color: '#3498db',
    fontWeight: 'bold',
  },
  header3: {
    fontSize: 12,
    marginTop: 20,
    padding: 30,
    textDecorationLine: 'underline',
    color: '#3498db',
    fontWeight: 'bold',
  },
  textInput: {
    alignSelf: 'stretch',
    padding: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  btn: {
    backgroundColor: '#3498db',
    paddingLeft: 50,
    paddingRight: 50,
    padding: 15,
    alignItems: 'center',
    borderRadius: 20,
  },
  logo: {
    height: 300,
    marginBottom: 20,
    marginTop: 50,
    padding: 10,
    width: 300,
  },
  Icon: {
    height: 50,
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    width: 50,
  },
  Close: {
    fontSize: 16,
    marginTop: 20,
    color: '#3498db',
    fontWeight: 'bold',
  },
});