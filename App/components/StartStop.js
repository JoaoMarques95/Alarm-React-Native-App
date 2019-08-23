import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import PropTypes from 'prop-types';

export default class ImgComprimidos extends Component {
  constructor(props) {
    super(props);
    // <====================================================>STATE INITIALIZATION
    this.state = {
      CycleState: false,
    };
  }

  componentDidMount() {
    const { CycleState } = this.props;
    this.setState({ CycleState });
    // get CycleState in the database
  }

  UpdateDataCiclo = () => {
    const { CycleState } = this.state;
    const { ServerIPGlobal, username } = this.props;

    fetch(`${ServerIPGlobal}:3000/UpdateDataCiclo`, {
      // fetch localhost server adress
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-type': 'Application/json',
      },
      body: JSON.stringify({
        // what is the body of the sended message?
        Name: username, // Data atual
        CycleState,
      }),
    })
      .then(response => response.json()) // conver to js the messsage received
      .then(res => {
        if (res.success === true) {
          // Update the state
          console.log(res.message);
        } else {
          console.log(res.message);
        }
      })
      .done();
  };

  StopCycle = () => {
    this.setState({ CycleState: false }, () => {
      this.UpdateDataCiclo();
    });
  };

  StartCycle = () => {
    this.setState({ CycleState: true }, () => {
      this.UpdateDataCiclo();
    });
  };

  render() {
    const { CycleState } = this.state;
    return (
      <View>
        {CycleState ? (
          <View style={{ flexDirection: 'row' }}>
            <View>
              <TouchableOpacity style={styles.BtnStart}>
                <Text>Começe o Mês</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.BtnStop} onPress={this.StopCycle}>
                <Text>Pare o Ciclo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row' }}>
            <View>
              <TouchableOpacity style={styles.BtnStart} onPress={this.StartCycle}>
                <Text>Começe o Mês</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity style={styles.BtnStop}>
                <Text>Pare o Ciclo</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: '#ecf0f1',
  },
  BtnStart: {
    backgroundColor: '#2ecc71',
    paddingLeft: 50,
    paddingRight: 50,
    padding: 15,
    alignItems: 'center',
    borderRadius: 20,
  },
  BtnStop: {
    backgroundColor: '#e74c3c',
    paddingLeft: 50,
    paddingRight: 50,
    padding: 15,
    alignItems: 'center',
    borderRadius: 20,
  },
});

ImgComprimidos.propTypes = {
  ServerIPGlobal: PropTypes.any,
  username: PropTypes.any,
  CycleState: PropTypes.any,
};
