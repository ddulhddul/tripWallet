import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TouchableWithoutFeedback,
  FlatList, Dimensions, ToastAndroid, Alert } from 'react-native';
import Util from '../Util'
import { MapView, Icon } from 'expo';
import { withNavigation } from 'react-navigation';
import { connect } from 'react-redux'
import DBUtil from '../database/DBUtil'

class ExpenseComponent extends DBUtil {
  constructor(props) {
    super(props)
    this.state = {
      expand: false
    }
  }

  componentDidUpdate(prevProps, prevState){
    const expandAll = this.props.expandAll
    if(expandAll != prevProps.expandAll){
      this.setState({expand: expandAll})
    }
  }

  _onPressEdit(item={}){
    this.props.navigation.navigate('AddExpenses', {
      item: item
    })
  }

  _onPressCopy(item={}){
    this.props.navigation.navigate('AddExpenses', {
      item: Object.assign({copy: true}, item)
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
            Util.toast('삭제되었습니다.')
            this.props.search()
          })
        }},
      ],
      { cancelable: true }
    )    
  }

  changeExpand(item={}){
    if(this.props.onComponentSelected){
      this.props.onComponentSelected(item)
    }
    this.setState({
      expand: !this.state.expand
    })
  }

  render() {
    const { expand } = this.state
    const item = this.props.item || {}
    const imageList = (String(item.images || '').split('|') || []).filter((obj)=>obj)
    if(!expand){
      return (
        <TouchableWithoutFeedback 
            delayLongPress={1000}  
            onLongPress={()=>this._onDelete(item)}
            onPress={()=>this.changeExpand(item)}>
          <View style={[styles.smallContent]}>
            <View style={{flex:1, flexDirection: 'column', marginLeft: 10}}>
              <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                <View style={{flex:1}}>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>
                    {Util.comma(item.amount)} {this.props.amount_unit}
                  </Text>
                </View>
                <View style={{width: 70, marginRight: 5}}>
                  <Text style={{fontSize: 12, color:'grey'}}>
                    {item.hh}:{item.mm} {Util.getNoon(Number(item.hh))}
                  </Text>
                </View>
                {
                  imageList && imageList[0]
                  ? <Image 
                      source={{uri: imageList[0]}}
                      style={styles.smallContentThumbnailImg} />
                  : undefined
                }
              </View>
              {
                (!item.remark && !item.locationText)? null:
                <View style={[{marginTop: 5, flexDirection: 'row'}]}>
                  <View style={[{flex:1}]}>
                    <Text numberOfLines={1} style={{color: 'grey', fontSize: 12}}>{item.remark.replace(/\n/g, ' ')}</Text>
                    {
                      !item.locationText? null:
                      <Text numberOfLines={1} style={{color: 'rgb(192, 57, 43)', fontSize: 10}}>
                        <Icon.Entypo size={12} name='location-pin' color={'rgb(192, 57, 43)'} />
                        { item.locationText }
                        {/* {item.latitude} {item.longitude} */}
                      </Text>
                    }
                  </View>
                </View>
              }
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    }else{
      return (
        <View style={[styles.smallContent, {flexDirection: 'column'}]}>
          <TouchableWithoutFeedback onPress={()=>this.changeExpand(item)}>
            <View style={{flex:1}}>
              <View style={[{flexDirection: 'row', justifyContent: 'space-between'}]}>
                <Text style={{fontSize: 15, marginTop: 5, fontWeight: 'bold'}}>{Util.comma(item.amount)} {this.props.amount_unit}</Text>
                <Text style={{fontSize: 12, marginTop: 5, color:'grey'}}>
                  {item.hh}:{item.mm} {Util.getNoon(Number(item.hh))}
                </Text>
              </View>
              <Text style={{color: 'grey', marginTop: 5, fontSize: 12}}>{item.remark}</Text>
              {
                !item.locationText? null:
                <Text style={{color: 'rgb(192, 57, 43)', marginTop: 10, fontSize: 10, marginBottom: 3}}>
                  <Icon.Entypo size={12} name='location-pin' color={'rgb(192, 57, 43)'} />
                  {/* 수원시 영통구 삼성사거리 111-11 */}
                  {item.locationText}
                  {/* {item.latitude} {item.longitude} */}
                </Text>
              }
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
            </View>
          </TouchableWithoutFeedback>
          {
            (imageList && imageList.length && imageList[0])
            ? <FlatList
              style={{marginTop: 15}}
              snapToAlignment={"center"}
              horizontal={true}
              data={imageList}
              key={JSON.stringify(item)}
              renderItem={({item, index}) => (
                <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('Image', {uri: item})}>
                  <Image key={[JSON.stringify(item),index].join('_')} source={{uri:item}} style={styles.bigContentThumbnailImg} />
                </TouchableWithoutFeedback>
              )}
              keyExtractor={(item, index) => item + index}
            />
            : undefined
          }
          <View style={[{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginTop: 15}]}>
            <TouchableOpacity style={[styles.editButtonArea, {height:20, width: 40, backgroundColor: 'green'}]} onPress={()=>this._onPressCopy(item)}>
              <Text style={{color: 'white', fontSize: 11}}>복사</Text>
            </TouchableOpacity>
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
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 30,
    marginRight: 30,
    padding: 15,
    elevation: 5,
    backgroundColor: 'white',
    flexDirection: 'row'
  },
  smallContentThumbnailImg: {
    width: 60,
    height: 60,
    resizeMode: 'stretch',
    borderRadius: 100,
  },
  bigContentThumbnailImg: {
    width: 200,
    height: 200,
    resizeMode: 'stretch',
    borderRadius: 30,
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

function select(state) {
  return {
    trip_id: state.tripReducer.trip_id,
    amount_unit: state.tripReducer.amount_unit
  }
}
export default connect(select)(withNavigation(ExpenseComponent))