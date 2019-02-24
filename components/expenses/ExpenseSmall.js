import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Util from '../Util'
import { Icon } from 'expo';

export default class ExpenseSmall extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _onPressEdit(){
    alert('_onPressEdit')
  }

  render() {
    return (
      <View style={styles.smallContent}>
        <View style={[{flex:0.3}]}>
          <Image source={require('../../assets/images/robot-dev.png')} style={styles.smallContentThumbnailImg} />
        </View>
        <View style={[{flex:0.7, flexDirection: 'column'}]}>
          <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>{Util.comma(2000)} 원</Text>
            <Text style={{fontSize: 12, color:'grey'}}>
              {Util.getTimeForm(new Date())} {Util.getNoon(new Date())}
            </Text>
          </View>
          <View style={[{marginTop: 10, flexDirection: 'row'}]}>
            <View style={[{flex:0.8}]}>
              <Text numberOfLines={1} style={{color: 'rgb(192, 57, 43)', fontSize: 12, marginBottom: 3}}>
                <Icon.Entypo size={12} name='location-pin' color={'rgb(192, 57, 43)'} />
                수원시 영통구 삼성사거리 111-11
              </Text>
              <Text numberOfLines={1} style={{color: 'grey', fontSize: 12}}>음료수 음료수 음료수 음료수 음료수 음료수 음료수 음료수 음료수</Text>
            </View>
            <View style={[{flex:0.2, alignItems: 'flex-end', justifyContent: 'flex-end'}]}>
              <TouchableOpacity style={styles.editButtonArea} onPress={()=>this._onPressEdit()}>
                <Text style={{color: 'white', fontSize: 10}}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  // smallContent
  smallContent: {
    width: '90%',
    padding: 15,
    elevation: 5,
    backgroundColor: 'white',

    flexDirection: 'row'
  },
  smallContentThumbnailImg: {
    width: 100,
    height: 80,
    resizeMode: 'stretch',
  },

  editButtonArea: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20, 
    width: 40,
    backgroundColor: 'rgb(52, 152, 219)'
  }
})