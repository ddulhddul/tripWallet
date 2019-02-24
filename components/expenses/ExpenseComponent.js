import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import Util from '../Util'
import { Icon } from 'expo';

export default class ExpenseComponent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expand: false
    }
  }

  _onPressEdit(){
    alert('_onPressEdit')
  }

  changeExpand(){
    this.setState({
      expand: !this.state.expand
    })
  }

  render() {
    const { expand } = this.state
    if(!expand){
      return (
        <View style={[styles.smallContent]}>
          <TouchableOpacity onPress={()=>this.changeExpand()} style={[{flex:0.3}]}>
            <Image source={require('../../assets/images/robot-dev.png')} style={styles.smallContentThumbnailImg} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.changeExpand()} style={[{flex:0.7, flexDirection: 'column'}]}>
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
                  <Text style={{color: 'white', fontSize: 10}}>수정</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )
    }else{
      return (
        <View style={[styles.smallContent, {flexDirection: 'column'}]}>
          <TouchableOpacity onPress={()=>this.changeExpand()}>
            <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
              <Text style={{fontSize: 15, marginTop: 5, fontWeight: 'bold'}}>{Util.comma(2000)} 원</Text>
              <Text style={{fontSize: 12, marginTop: 5, color:'grey'}}>
                {Util.getTimeForm(new Date())} {Util.getNoon(new Date())}
              </Text>
            </View>
            <Text style={{color: 'rgb(192, 57, 43)', marginTop: 10, fontSize: 12, marginBottom: 3}}>
              <Icon.Entypo size={12} name='location-pin' color={'rgb(192, 57, 43)'} />
              수원시 영통구 삼성사거리 111-11
            </Text>
            <Text style={{color: 'grey', marginTop: 5, fontSize: 12}}>음료수 음료수 음료수 음료수 음료수 음료수 음료수 음료수 음료수</Text>
          </TouchableOpacity>
          <FlatList
            style={{marginTop: 15}}
            horizontal={true}
            data={[{key: 'a'}, {key: 'b'}, {key: 'c'}, {key: 'd'}]}
            renderItem={({item}) => (
              <Image source={require('../../assets/images/robot-dev.png')} style={styles.bigContentThumbnailImg} />
            )}
          />
          <View style={[{alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 15}]}>
            <TouchableOpacity style={[styles.editButtonArea, {height:30, width: 60}]} onPress={()=>this._onPressEdit()}>
              <Text style={{color: 'white', fontSize: 13}}>수정</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  smallContent: {
    flex: 0.9,
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 30,
    marginRight: 30,
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
  bigContentThumbnailImg: {
    width: 200,
    height: 160,
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