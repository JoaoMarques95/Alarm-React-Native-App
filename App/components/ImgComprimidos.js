import React, { Component } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import PropTypes from 'prop-types';

const imgPillSheet = require('../assets/pill1.png');
const imgPillSheet0 = require('../assets/pill0.png');

export default class ImgComprimidos extends Component {
  render() {
    const { EstadoToma } = this.props;
    return (
      <View>
        {EstadoToma ? (
          <View
            style={{
              marginTop: 30,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={imgPillSheet}
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
              source={imgPillSheet0}
              style={{
                height: 400,
                width: 200,
              }}
            />
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
});

ImgComprimidos.propTypes = {
  EstadoToma: PropTypes.any,
};
