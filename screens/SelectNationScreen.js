import React, { Component } from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import DBUtil from '../components/database/DBUtil';

export default class SelectNationScreen extends DBUtil {
  constructor(props) {
    super(props)
    this.state = {
      nations: this.getNationList()
    }
  }

  render() {
    // const nations = require('../components/database/nation')
    // if(!this.state.nations) return null
    console.log('nations', this.state.nations)
    return (
      <View>
        <Text> textInComponent </Text>
        <ScrollView>{
          (this.state.nations || []).map((obj)=>{
            return (
              <View key={JSON.stringify(obj)}>
                {/* <Image source={require(obj.uri)} style={{width: 100, aspectRatio: 1.4}}></Image> */}
                {/* <Image source={require("../assets/images/countries/ca.png")} style={{width: 20, height: 20}}></Image> */}
                {/* <Image source={require(obj.uri)} style={{width: 20, height: 20}}></Image> */}
                {/* <Image source={obj.requiredUri} style={{width: 20, height: 20}}></Image> */}
                <Text>{obj.title} {obj.uri}</Text>
              </View>
            )
          })
        }</ScrollView>
      </View>
    )
  }
}
