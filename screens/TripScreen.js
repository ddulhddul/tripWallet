import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ToastAndroid } from 'react-native'
import { Icon } from 'expo'
import DBUtil from '../components/database/DBUtil'
import { connect } from 'react-redux'
import { setTripId } from '../actions/action'

class TripScreen extends DBUtil {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.initNationTable()
    this.state = {
      nationList: this.getNationList(),
      tripList: []
    }
  }

  componentDidMount(){
    const { navigation } = this.props
    this.focusListener = navigation.addListener("didFocus", () => {
      this.search()
    })
  }

  search(){
    this.listTnTrip({},
      (tx, res)=>{
        const nationList = this.state.nationList||[]
        this.setState({
          tripList: (res.rows._array || []).reduce((entry, obj)=>{
            obj.requiredUri = (nationList.find((nation)=>nation.id==obj.nation_id) || {}).requiredUri
            if(entry[entry.length-1].length < 2){
              entry[entry.length-1].push(obj)
            }else{
              entry.push([obj])
            }
            return entry
          }, [[]])
        })
      }
    )
  }

  _selectTrip(param){
    const { dispatch } = this.props
    dispatch(setTripId(param.trip_id))
    this.props.navigation.navigate('Expenses')
  }

  _deleteTrip(param){
    Alert.alert(
      '경고',
      '삭제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', onPress: () => {
          this.deleteTnTrip(param, (tx, res)=>{
            ToastAndroid.showWithGravity(
              '삭제되었습니다.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            )
            this.search()
          })
        }},
      ],
      { cancelable: true }
    )
  }
  
  _pressAdd(){
    this.props.navigation.navigate('Nation')
  }

  render() {
    const data = this.state.tripList
    return (
      <View style={{flex:1}}>
        <View style={styles.header}>
          <Text style={styles.headerText}>여행 기록</Text>
        </View>
        <View style={styles.body}>
          <ScrollView>{
            data.map((item, itemIndex)=>{
              return (
                <View key={itemIndex} style={{flexDirection: 'row'}}>{
                  (item || []).map((obj, index)=>{
                    return (
                      <TouchableOpacity key={index} 
                        delayLongPress={1000}
                        onPress={()=>this._selectTrip(obj)} 
                        onLongPress={()=>this._deleteTrip(obj)} 
                        style={styles.componentContainer}>
                        <View>
                          <View style={{flex: 1, aspectRatio: 1, backgroundColor: 'grey', borderRadius: 20}}>
                            <Image source={obj.requiredUri} style={{flex:1, aspectRatio: 1, borderRadius: 20}} />
                          </View>
                          {/* <Text style={{fontSize: 13, textAlign: 'center', marginTop: 5}}>19.01.01~19.03.03</Text> */}
                          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>{obj.nation_title}</Text>
                          <Text style={{fontSize: 11, textAlign: 'center'}}>{obj.city_name}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }</View>
              )
            })
          }</ScrollView>
        </View>
        <TouchableOpacity style={styles.plusIcon} onPress={(event)=>this._pressAdd(event)}>
          <Icon.AntDesign 
            name="pluscircle" 
            size={45}
            color="rgb(74, 190, 202)"
            />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 40,
    fontWeight: 'bold',
  },

  body: {
    flex: 1,
    margin: 30,
  },
  componentContainer: {
    flex: 0.5,
    margin: 10,
  },
  
  plusIcon: {
    backgroundColor: 'white',
    borderRadius: 50,
    position: 'absolute',
    right: 20,
    bottom: 20
  }
})

export default connect()(TripScreen)