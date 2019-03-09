import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, ToastAndroid, Alert } from 'react-native';
import Util from '../Util'
import { MapView, Icon } from 'expo';
import { withNavigation } from 'react-navigation';
import DBUtil from '../database/DBUtil'

class ExpenseComponent extends DBUtil {
  constructor(props) {
    super(props)
    this.state = {
      expand: false
    }
  }

  _onPressEdit(item={}){
    this.props.navigation.navigate('AddExpenses', {
      item: item
    })
  }

  _onDelete(item){
    Alert.alert(
      '경고',
      '삭제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', onPress: () => {
          this.deleteTnExpense(item, (tx, res)=>{
            ToastAndroid.showWithGravity(
              '삭제되었습니다.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            )
            this.props.search()
          })
        }},
      ],
      { cancelable: true }
    )    
  }

  changeExpand(){
    this.setState({
      expand: !this.state.expand
    })
  }

  render() {
    const { expand } = this.state
    const item = this.props.item || {}
    const imageList = String(item.images || '').split('|') || []
    if(!expand){
      return (
        <View style={[styles.smallContent]}>
          {
            imageList && imageList[0]
            ? <TouchableOpacity 
                delayLongPress={1500}  
                onLongPress={()=>this._onDelete(item)}
                onPress={()=>this.changeExpand()} 
                style={[{flex:0.3}]}>
                <Image 
                  source={
                    imageList[0]
                    ? {uri: imageList[0]}
                    : require('../../assets/images/robot-dev.png')}
                  style={styles.smallContentThumbnailImg} />
              </TouchableOpacity>
            : undefined
          }
          <TouchableOpacity 
            delayLongPress={1500}  
            onLongPress={()=>this._onDelete(item)}
            onPress={()=>this.changeExpand()} 
            style={[{flex:1, flexDirection: 'column', marginLeft: 20}]}>
            <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>{Util.comma(item.amount)} {Util.amountUnit}</Text>
              <Text style={{fontSize: 12, color:'grey'}}>
              {item.hh}:{item.mm} {Util.getNoon(Number(item.hh))}
              </Text>
            </View>
            <View style={[{marginTop: 10, flexDirection: 'row'}]}>
              <View style={[{flex:0.8}]}>
                {/* <Text numberOfLines={1} style={{color: 'rgb(192, 57, 43)', fontSize: 12, marginBottom: 3}}>
                  <Icon.Entypo size={12} name='location-pin' color={'rgb(192, 57, 43)'} />
                  수원시 영통구 삼성사거리 111-11
                  {item.latitude} {item.longitude}
                </Text> */}
                <Text numberOfLines={1} style={{color: 'grey', fontSize: 12}}>{item.remark.replace(/\n/g, ' ')}</Text>
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
              <Text style={{fontSize: 15, marginTop: 5, fontWeight: 'bold'}}>{Util.comma(item.amount)} {Util.amountUnit}</Text>
              <Text style={{fontSize: 12, marginTop: 5, color:'grey'}}>
                {item.hh}:{item.mm} {Util.getNoon(Number(item.hh))}
              </Text>
            </View>
            <Text style={{color: 'grey', marginTop: 5, fontSize: 12}}>{item.remark}</Text>
            {/* <Text style={{color: 'rgb(192, 57, 43)', marginTop: 10, fontSize: 12, marginBottom: 3}}>
              <Icon.Entypo size={12} name='location-pin' color={'rgb(192, 57, 43)'} />
              수원시 영통구 삼성사거리 111-11
              {item.latitude} {item.longitude}
            </Text> */}
            <View pointerEvents="none" style={{marginTop: 10}}>
            {
              item.latitude && item.longitude && <MapView
                style={{ alignSelf: 'stretch', height: Dimensions.get('window').width * 0.4 }}
                provider={MapView.PROVIDER_GOOGLE}
                region={{ 
                  latitude: item.latitude, 
                  longitude: item.longitude, 
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005
                }}
                >
                <MapView.Marker
                  coordinate={{
                    latitude: item.latitude, 
                    longitude: item.longitude, 
                  }}
                />
              </MapView>
            }
            </View>
          </TouchableOpacity>
          {
            (imageList && imageList.length && imageList[0])
            ? <FlatList
              style={{marginTop: 15}}
              horizontal={true}
              data={imageList}
              renderItem={({item, index}) => (
                <Image source={item? {uri:item}: require('../../assets/images/robot-dev.png')} style={styles.bigContentThumbnailImg} />
              )}
              keyExtractor={(item, index) => item + index}
            />
            : undefined
          }
          <View style={[{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 15}]}>
            <TouchableOpacity style={[styles.editButtonArea, {height:20, width: 40}]} onPress={()=>this._onPressEdit(item)}>
              <Text style={{color: 'white', fontSize: 11}}>수정</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.editButtonArea, {height:20, width: 40, backgroundColor: 'red'}]} onPress={()=>this._onDelete(item)}>
              <Text style={{color: 'white', fontSize: 11}}>삭제</Text>
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
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    padding: 15,
    elevation: 5,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  smallContentThumbnailImg: {
    width: 80,
    height: 80,
    resizeMode: 'stretch',
    borderRadius: 50,
  },
  bigContentThumbnailImg: {
    width: 200,
    height: 200,
    resizeMode: 'stretch',
    marginRight: 5
  },

  editButtonArea: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 20, 
    width: 40,
    marginLeft: 10,
    backgroundColor: 'rgb(52, 152, 219)'
  }
})

export default withNavigation(ExpenseComponent)