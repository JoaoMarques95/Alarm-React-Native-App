import React from 'react';
import { StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Header, ListItem, Icon, Divider, CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import io from 'socket.io-client';
/* import { registerForPushNotificationsAsync } from "./functions/registerForPushNotificationsAsync.js";
import {
  Notifications,
} from 'expo'; */

// Net Casa-Aveiro:192.168.1.127
// Net phone:192.168.43.163
// PCI:192.168.128.1
// PCI_Coworking:192.168.183.25
// Net Casa:192.168.1.93

const Server_IP = 'http://192.168.43.163';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    // <====================================================>STATE INITIALIZATION
    this.state = {
      isModalVisible: false,
      isModalVisibleComprimidos: false,
      isTimePickerVisible: false,
      checked21: false,
      checked28: false,
      username: '',
      Time: '',
      Time_show: '',
      Comprimidos_Show: '',
      Last_Click: '',
      Estado_Toma: false,
      notification: {},
    };
  }

  componentDidMount = () => {
    // <====================================================> UPDATE INITAL DATA
    const { navigation } = this.props;
    const Name = navigation.getParam('Username', 'no-name');
    this.setState({ username: Name });
    this.Update_Initial_Data(Name);

    // <====================================================> Calling notification register
    registerForPushNotificationsAsync(Server_IP, Name);
    // Handle notifications that are received or selected while the app
    // is open. If the app was closed and then opened by tapping the
    // notification (rather than just tapping the app icon to open it),
    // this function will fire on the next tick after the app starts
    // with the notification data.
    /*  this._notificationSubscription = Notifications.addListener(this._handleNotification); */

    // <====================================================> WEB sockets CONFIG
    // we gonna do this.soket because we need to acess this varibale in any place in our component
    this.socket = io(`${Server_IP}:3000`); // just like this.state

    // <====================================================> WEB sockets RECEIVING DATA
    this.socket.on('teste', data => {
      console.log(data, 'Data from sokets');
      this.setState({
        Last_Click: data.Click,
        Estado_Toma: data.Toma,
      });
    });
  };

  /* _handleNotification = ({ origin, data }) => {
    console.log(origin, data);
  }; */

  // <====================================================> UPDATE INITAL DATA
  Update_Initial_Data = Name => {
    fetch(`${Server_IP}:3000/Update_Initial_Data?username=${Name}`)
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          console.log('Initial Data Updated');

          this.setState({
            Comprimidos_Show: json.Comprimidos_Show,
            checked21: json.check21,
            checked28: json.check28,
            Time: json.time,
            Time_show: json.time_show,
          });
        }
      });
  };

  // <====================================================>  Update Comprimidos to the Database (POST)

  Update_Comprimidos = () => {
    fetch(`${Server_IP}:3000/Update_Comprimidos`, {
      // fetch localhost server adress
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        // what is the body of the sended message?
        Name: this.state.username,
        Comprimidos28: this.state.checked28,
        Comprimidos21: this.state.checked21,
      }),
    })
      .then(response => response.json()) // conver to js the messsage received
      .then(res => {
        if (res.success === true) {
          // Update the state
          console.log(res.message);
          this.setState({ Comprimidos_Show: res.comprimidos });
        } else {
          console.log(res.message);
        }
      })
      .done();
  };

  // <====================================================> Update to the Database Pref_Time (POST)

  Update_Time = () => {
    fetch(`${Server_IP}:3000/Update_Time`, {
      // fetch localhost server adress
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        // what is the body of the sended message?
        Name: this.state.username,
        Time: this.state.Time,
      }),
    })
      .then(response => response.json()) // conver to json the messsage received
      .then(res => {
        if (res.success === true) {
          // check if user exists
          console.log(res.message);
          this.setState({ Time_show: res.time });
        } else {
          console.log('some error ocurred');
        }
      })
      .done();
  };

  // <====================================================> check if comprimidos 21 are pressed to Update
  check21 = () => {
    this.setState({
      isModalVisibleComprimidos: !this.state.isModalVisibleComprimidos,
    });
    this.setState({ checked21: !this.state.checked21 }, () => {
      // only call this funtion when state is updated!
      if (this.state.checked28) {
        // if true
        this.setState({ checked28: false }, () => {
          if (this.state.checked21) {
            // if true
            this.Update_Comprimidos();
          }
        });
      }

      if (!this.state.checked28 && this.state.checked21) {
        this.Update_Comprimidos();
      }
    }); // change state
  };

  // <====================================================> check if comprimidos 28 are pressed to Update
  check28 = () => {
    this.setState({
      isModalVisibleComprimidos: !this.state.isModalVisibleComprimidos,
    });
    this.setState(
      { checked28: !this.state.checked28 }, // change state
      // only call this funtion when state is updated!
      // the render will happen first but it doesnt matter
      () => {
        if (this.state.checked21) {
          // if true
          this.setState({ checked21: false }, () => {
            if (this.state.checked28) {
              this.Update_Comprimidos();
            }
          });
        }

        if (!this.state.checked21 && this.state.checked28) {
          this.Update_Comprimidos();
        }
        // Make the request to the database!!!
      }
    );
  };

  // <====================================================> Handle Time and Update;
  _handleTimePicked = time => {
    console.log('A time has been picked: ', time);
    this._hideTimePicker();
    this.setState({ Time: time }, () => {
      this.Update_Time();
    });
  };

  // <====================================================> Timer POP-UP
  _showTimePicker = () => {
    this.setState({ isTimePickerVisible: true });
  };

  _hideTimePicker = () => {
    this.setState({ isTimePickerVisible: false });
  };

  // <====================================================> Going back to home
  goBack = () => {
    this.props.navigation.navigate('Home'); // go to the member area page
  };

  // <====================================================> Comprimidos POP-UP
  toggleModalComprimidos = () => {
    this.setState({
      isModalVisibleComprimidos: !this.state.isModalVisibleComprimidos,
    });
  };

  // <====================================================> Setings POP_UP
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  render() {
    return (
      <ScrollView style={styles.wrapper}>
        {/* BODY  <=========================================================================> */}
        <Header //
          color="#ecf0f1"
          leftComponent={<Icon name="arrow-back" color="#ecf0f1" onPress={this.goBack} Component={TouchableOpacity} />}
          centerComponent={{
            text: `OLA ${this.state.username.toUpperCase()}`,
            style: { color: '#fff' },
          }}
          rightComponent={
            <Icon name="settings" color="#ecf0f1" onPress={this.toggleModal} Component={TouchableOpacity} />
          }
        />
        <View>
          {this.state.Estado_Toma ? (
            <View
              style={{
                marginTop: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('../assets/pill1.png')}
                style={{
                  height: 400,
                  width: 200,
                }}
              />
            </View>
          ) : (
            <View
              style={{
                marginTop: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Image
                source={require('../assets/pill0.png')}
                style={{
                  height: 400,
                  width: 200,
                }}
              />
            </View>
          )}
        </View>

        {/* POP-UP OF SETTINGS  <=========================================================================> */}
        <Modal
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          transparent
          isVisible={this.state.isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          <ListItem
            title="Que horas custumas tomar?"
            subtitle={`${this.state.Time_show}`}
            titleStyle={{}}
            subtitleStyle={{ alignItems: 'center', justifyContent: 'center' }}
            leftIcon={{ name: 'timer' }} // timer
            RightIcon={{ name: 'arrow-forward' }} // timer
            onPress={this._showTimePicker}
            Component={TouchableOpacity}
          />
          <View>
            <Divider style={{ height: 3, backgroundColor: '#ecf0f1' }} />
          </View>
          <ListItem
            title="Quantos comprimidos tem a sua caixa?"
            subtitle={`${this.state.Comprimidos_Show}`}
            titleStyle={{}}
            subtitleStyle={{ alignItems: 'center', justifyContent: 'center' }}
            leftIcon={{ name: 'system-update' }} // timer
            RightIcon={{ name: 'arrow-forward' }} // timer
            onPress={this.toggleModalComprimidos}
            Component={TouchableOpacity}
          />
        </Modal>

        {/* MODAL OF COMPRIMIDOS <=========================================================================> */}
        <Modal
          style={styles.ToogleComprimidos}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          backdropOpacity={0}
          isVisible={this.state.isModalVisibleComprimidos}
          onBackdropPress={() => this.setState({ isModalVisibleComprimidos: false })}
        >
          <CheckBox
            center
            title="21 Comprimidos"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={this.check21}
            checked={this.state.checked21}
          />
          <CheckBox
            center
            title="28 Comprimidos"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={this.check28}
            checked={this.state.checked28}
          />
        </Modal>

        {/* DateTimePicker <=========================================================================> */}

        <DateTimePicker // I need to swift the hour +1 because of the timezone (tranquilo)
          isVisible={this.state.isTimePickerVisible}
          onConfirm={this._handleTimePicked}
          onCancel={this._hideTimePicker}
          mode="time"
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
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
  ToogleComprimidos: {
    marginTop: 350,
  },
  logo: {
    height: 200,
    marginBottom: 20,
    marginTop: 50,
    padding: 10,
    width: 200,
  },
});

// IMP info--------------------
/*
code edenting --> Shift+Alt+F

*/

/* SOLUTIONS FOR TIME SHOW! And comprimidos Show.
                subtitle={
                  <View>
      {this.state.Time ? (
        <View><Text>Ainda não escolheu!</Text></View>
      ) : (
        <View><Text>{this.state.time}</Text></View>
      )}
    </View>}



    {unreadMessages.length > 0 &&
                <h2>
                  You have {unreadMessages.length} unread messages.
                </h2>
              }
                */
