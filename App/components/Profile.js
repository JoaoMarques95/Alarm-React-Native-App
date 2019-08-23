import React from 'react';
import { StyleSheet, Platform, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Header, ListItem, Icon, Divider, CheckBox } from 'react-native-elements';
import Modal from 'react-native-modal';
import DateTimePicker from 'react-native-modal-datetime-picker';
import io from 'socket.io-client';
import PropTypes from 'prop-types';
import ImgComprimidos from './ImgComprimidos';
import StartStop from './StartStop';

// Net Casa-Aveiro:192.168.1.127
// Net phone:192.168.43.163
// PCI:192.168.128.1
// PCI_Coworking:192.168.183.25
// Net Casa:192.168.1.83
const ServerIP = 'http://192.168.1.83';

export default class Profile extends React.Component {
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
      TimeShow: '',
      ComprimidosShow: '',
      EstadoToma: false,
      ServerIPGlobal: '',
      DataCiclo: '',
    };
  }

  componentDidMount = () => {
    // <====================================================> UPDATE INITAL DATA
    const { navigation } = this.props;
    const { ServerIPGlobal } = this.state;
    this.setState({ ServerIPGlobal: ServerIP });
    const Name = navigation.getParam('Username', 'no-name');
    console.log(ServerIP, 'ServerIPvalue');
    this.setState({ username: Name });

    this.UpdateInitialData(Name);
    // <====================================================> WEB sockets CONFIG
    // we gonna do this.soket because we need to acess this varibale in any place in our component
    this.socket = io(`${ServerIP}:3000`); // just like this.state

    // <====================================================> WEB sockets RECEIVING DATA
    this.socket.on('teste', data => {
      console.log(data, 'Data from sokets');
      this.setState({
        EstadoToma: data.Toma,
      });
    });
  };

  /* _handleNotification = ({ origin, data }) => {
    console.log(origin, data);
  }; */

  // <====================================================> UPDATE INITAL DATA
  UpdateInitialData = Name => {
    fetch(`${ServerIP}:3000/Update_Initial_Data?username=${Name}`)
      .then(response => response.json())
      .then(json => {
        if (json.success) {
          console.log('Initial Data Updated');
          this.setState({
            // Adicionar DataCiclo!!!!!
            ComprimidosShow: json.ComprimidosShow,
            checked21: json.check21,
            checked28: json.check28,
            Time: json.time,
            TimeShow: json.timeShow,
          });
        }
      });
  };

  // <====================================================>  Update Comprimidos to the Database (POST)

  UpdateComprimidos = () => {
    const { username, checked21, checked28 } = this.state;
    fetch(`${ServerIP}:3000/Update_Comprimidos`, {
      // fetch localhost server adress
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        // what is the body of the sended message?
        Name: username,
        Comprimidos28: checked28,
        Comprimidos21: checked21,
      }),
    })
      .then(response => response.json()) // conver to js the messsage received
      .then(res => {
        if (res.success === true) {
          // Update the state
          console.log(res.message);
          this.setState({ ComprimidosShow: res.comprimidos });
        } else {
          console.log(res.message);
        }
      })
      .done();
  };

  // <====================================================> Update to the Database Pref_Time (POST)

  UpdateTime = () => {
    const { username, Time } = this.state;
    fetch(`${ServerIP}:3000/Update_Time`, {
      // fetch localhost server adress
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        // what is the body of the sended message?
        Name: username,
        Time,
      }),
    })
      .then(response => response.json()) // conver to json the messsage received
      .then(res => {
        if (res.success === true) {
          // check if user exists
          console.log(res.message);
          this.setState({ TimeShow: res.time });
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
            this.UpdateComprimidos();
          }
        });
      }

      if (!this.state.checked28 && this.state.checked21) {
        this.UpdateComprimidos();
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
              this.UpdateComprimidos();
            }
          });
        }

        if (!this.state.checked21 && this.state.checked28) {
          this.UpdateComprimidos();
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
      this.UpdateTime();
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
    const { navigation } = this.props;
    navigation.navigate('Home'); // go to the member area page
  };

  // <====================================================> Comprimidos POP-UP
  toggleModalComprimidos = () => {
    const { isModalVisibleComprimidos } = this.state;

    this.setState({
      isModalVisibleComprimidos: !isModalVisibleComprimidos,
    });
  };

  toggleModalInicioCiclo = () => {
    const { isModalVisibleInicioCiclo, DataCiclo } = this.state;

    if (DataCiclo) {
      // update dataciclo
    } else {
      // only update data ciclo
      this.setState({
        isModalVisibleInicioCiclo: !isModalVisibleInicioCiclo,
      });
    }
  };

  // <====================================================> Inicio Ciclo POP-UP
  toggleModalTerminarCiclo = () => {
    const { isModalVisibleTerminarCiclo } = this.state;

    this.setState({
      isModalVisibleTerminarCiclo: !isModalVisibleTerminarCiclo,
    });
  };

  // <====================================================> Terminar Ciclo POP-UP
  toggleModalComprimidos = () => {
    const { isModalVisibleComprimidos } = this.state;

    this.setState({
      isModalVisibleComprimidos: !isModalVisibleComprimidos,
    });
  };

  // <====================================================> Setings POP_UP
  toggleModal = () => {
    const { isModalVisible } = this.state;
    this.setState({ isModalVisible: !isModalVisible });
  };

  render() {
    const {
      isTimePickerVisible,
      ComprimidosShow,
      TimeShow,
      username,
      DataCiclo,
      EstadoToma,
      isModalVisible,
      isModalVisibleComprimidos,
      checked21,
      checked28,
      ServerIPGlobal,
    } = this.state;

    return (
      <ScrollView style={styles.wrapper}>
        {/* BODY  <=========================================================================> */}
        <Header
          containerStyle={{ height: Platform.OS === 'ios' ? 70 : 70 - 15, paddingTop: 5, paddingBottom: 5 }}
          color="#ecf0f1"
          leftComponent={<Icon name="arrow-back" color="#ecf0f1" onPress={this.goBack} Component={TouchableOpacity} />}
          centerComponent={{
            text: `OLA ${username.toUpperCase()}`,
            style: { color: '#fff' },
          }}
          rightComponent={
            <Icon name="settings" color="#ecf0f1" onPress={this.toggleModal} Component={TouchableOpacity} />
          }
        />

        <ImgComprimidos />
        {/* Aparecer os dados proxima toma, ultima toma */}
        {/*  <StartStop ServerIPGlobal={ServerIPGlobal} CycleState={CycleState} username={username} DataCiclo={DataCiclo} />
         */}

        {/* POP-UP OF SETTINGS  <=========================================================================> */}
        <Modal
          useNativeDriver
          swipeDirection="right"
          transparent
          isVisible={isModalVisible}
          onBackdropPress={() => this.setState({ isModalVisible: false })}
        >
          <View>
            <Icon
              name="close"
              color="#ecf0f1"
              onPress={this.toggleModal}
              backgroundColor="white"
              Component={TouchableOpacity}
              size={30}
              iconStyle={{ padding: 5 }}
            />
          </View>
          <ListItem
            title="Que horas custumas tomar?"
            subtitle={TimeShow === '' ? null : `${TimeShow}`}
            titleStyle={{}}
            subtitleStyle={{ alignItems: 'center', justifyContent: 'center' }}
            leftIcon={{ name: 'timer' }} // timer
            onPress={this._showTimePicker}
            Component={TouchableOpacity}
          />
          <View>
            <Divider style={styles.divider} />
          </View>
          <ListItem
            title="Quantos comprimidos tem a sua caixa?"
            subtitle={ComprimidosShow === '' ? null : `${ComprimidosShow}`}
            titleStyle={{}}
            subtitleStyle={{ alignItems: 'center', justifyContent: 'center' }}
            leftIcon={{ type: 'material-community', name: 'pill' }} // timer -- pills
            onPress={() => {
              this.toggleModalComprimidos();
              this.toggleModal();
            }}
            Component={TouchableOpacity}
          />
          <View>
            <Divider style={styles.divider} />
          </View>
          <ListItem
            title={DataCiclo === '' ? 'Iniciar Ciclo' : 'Reniciar ciclo'}
            subtitle={DataCiclo === '' ? null : `${DataCiclo}`}
            titleStyle={{}}
            subtitleStyle={{ alignItems: 'center', justifyContent: 'center' }}
            leftIcon={
              DataCiclo === ''
                ? { type: 'material-community', name: 'clock-start' }
                : { type: 'material-community', name: 'restart' }
            } // timer
            onPress={() => {
              this.toggleModalInicioCiclo();
              this.toggleModal();
            }}
            Component={TouchableOpacity}
          />
          <View>
            <Divider style={styles.divider} />
          </View>
          <ListItem
            title="Terminar Ciclo"
            titleStyle={{}}
            subtitleStyle={{ alignItems: 'center', justifyContent: 'center' }}
            leftIcon={{ type: 'material-community', name: 'restart-off' }} // timer
            onPress={() => {
              this.toggleModalTerminarCiclo();
              this.toggleModal();
            }}
            Component={TouchableOpacity}
          />
        </Modal>

        {/* MODAL OF COMPRIMIDOS <=========================================================================> */}
        <Modal
          useNativeDriver
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          isVisible={isModalVisibleComprimidos}
          onBackdropPress={() => this.setState({ isModalVisibleComprimidos: false })}
        >
          <CheckBox
            center
            title="21 Comprimidos"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => {
              this.check21();
              this.toggleModal();
            }}
            checked={checked21}
          />
          <CheckBox
            center
            title="28 Comprimidos"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            onPress={() => {
              this.check28();
              this.toggleModal();
            }}
            checked={checked28}
          />
        </Modal>

        {/* MODAL OF Iniciar/Reneciar ciclo <=========================================================================> */}
        {/* MODAL OF Terminar ciclo <=========================================================================> */}

        {/* DateTimePicker <=========================================================================> */}

        <DateTimePicker // I need to swift the hour +1 because of the timezone (tranquilo)
          isVisible={isTimePickerVisible}
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
  divider: { height: 3, backgroundColor: '#ecf0f1' },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    paddingLeft: 40,
    paddingRight: 40,
  },
  logo: {
    height: 200,
    marginBottom: 20,
    marginTop: 50,
    padding: 10,
    width: 200,
  },
});

Profile.propTypes = {
  navigation: PropTypes.any,
};
