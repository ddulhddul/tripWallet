import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Icon } from 'expo'

export default class TripScreen extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidMount(){
    this.props.navigation.navigate('Nation')
  }

  _selectTrip(param){
    this.props.navigation.navigate('Expenses')
  }
  
  _pressAdd(){
    this.props.navigation.navigate('Nation')
  }

  render() {
    const data = [
      [{},{}],
      [{},{}],
      [{},{}],
      [{},{}],
      [{}],
    ]
    return (
      <View style={{flex:1}}>
        <View style={styles.header}>
          <Text style={styles.headerText}>나의 여행 기록</Text>
        </View>
        <View style={styles.body}>
          <ScrollView>{
            data.map((item, itemIndex)=>{
              return (
                <View key={itemIndex} style={{flexDirection: 'row'}}>{
                  (item || []).map((obj, index)=>{
                    return (
                      <TouchableOpacity key={index} onPress={()=>this._selectTrip(obj)} style={styles.componentContainer}>
                        <View>
                          <View style={{flex: 1, aspectRatio: 1, backgroundColor: 'grey', borderRadius: 20}}></View>
                          <Text style={{fontSize: 13, textAlign: 'center', marginTop: 5}}>19.01.01~19.03.03</Text>
                          <Text style={{fontSize: 20, fontWeight: 'bold', textAlign: 'center'}}>한국</Text>
                          <Text style={{fontSize: 11, textAlign: 'center'}}>(부산부산부산)</Text>
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