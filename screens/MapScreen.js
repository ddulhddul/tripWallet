import React, { Component } from 'react'
import { View, Text, Dimensions, StyleSheet, ViewPagerAndroid, ScrollView, InteractionManager } from 'react-native'
import { MapView } from 'expo'
import DBUtil from '../components/database/DBUtil';
import ExpenseComponent from '../components/daypage/ExpenseComponent';
import Util from '../components/Util';

export default class MapScreen extends DBUtil {
  
  static navigationOptions = {
    title: '지도',
  }
  
  constructor(props) {
    super(props)
    this.state = {
      initialPage: 0,
      pageIndex: 0,
      thisSection: {},
      sections: []
    }
  }

  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.search()
    })
  }

  search(){
    InteractionManager.runAfterInteractions(() => {

      this.listTnExpense([],
        (tx, res)=>{
          const list = res.rows._array || []
          const objByList = list.reduce((entry, obj)=>{
            entry[obj.yyyymmdd] = entry[obj.yyyymmdd] || []
            entry[obj.yyyymmdd].push(obj)
            return entry
          }, {})
        
          this.setState({
            sections: Array.from(Object.keys(objByList)).map((key)=>{

              const locationObj = objByList[key].reduce((entry, obj)=>{
                return {
                  minLatitude: Math.min(obj.latitude, entry.minLatitude),
                  minLongitude: Math.min(obj.longitude, entry.minLongitude),
                  maxLatitude: Math.max(obj.latitude, entry.maxLatitude),
                  maxLongitude: Math.max(obj.longitude, entry.maxLongitude),  
                }
              }, {
                minLatitude: 99999999999999,
                minLongitude: 99999999999999,
                maxLatitude: 0,
                maxLongitude: 0,
              })

              return {
                yyyymmdd: key, 
                sumAmount: objByList[key].reduce((entry, obj)=>{
                  return entry + Number(obj.amount || 0)
                }, 0),
                data: objByList[key],
                ...locationObj
              }
            })
          })
        }
      )
    })
  }

  onPageSelected(event){
    if(!event || !event.nativeEvent) return
    const pageIndex = event.nativeEvent.position
    // this.dayscroll.scrollTo({animated: true, x: 20*pageIndex})
  
    this.setState({
      pageIndex: pageIndex,
      thisSection: this.state.sections[pageIndex]
    })
  }

  render() {

    const {sections, thisSection, pageIndex} = this.state
    return (
      <View style={styles.container}>
        <MapView 
          style={{ alignSelf: 'stretch', flex:1, maxHeight: Dimensions.get('window').height * 0.5 }}
          region={{ 
            latitude: (thisSection.maxLatitude + thisSection.minLatitude)/2,
            longitude: (thisSection.maxLongitude + thisSection.minLongitude)/2,
            latitudeDelta: Math.max((thisSection.maxLatitude - thisSection.minLatitude) * 1.5, 0.01),
            longitudeDelta: Math.max((thisSection.maxLongitude - thisSection.minLongitude) * 1.5, 0.01),
          }}
          >{
            ((thisSection || {}).data || []).map((sectionData, sectionIndex)=>{
              return (
                <MapView.Marker
                  key={sectionIndex}
                  coordinate={{
                    latitude: sectionData.latitude, 
                    longitude: sectionData.longitude, 
                }}/>
              )
            })
          }
        </MapView>
        <View style={styles.dayContainer} pointerEvents="none">
          <ScrollView 
            ref={(refs)=>this.dayscroll=refs}
            horizontal={true}>{
            (sections || []).map((obj, index)=>{
              if(index < pageIndex) return undefined
              else if(index == pageIndex){
                return (
                  <View key={index} 
                    ref={(refs)=>this['day'+index]=refs}
                    style={[styles.dayStyle]}>
                    <Text style={{fontSize: 10, fontWeight: 'bold'}}>{
                      Util.getDateForm(obj.yyyymmdd)
                    }</Text>
                    <Text style={{fontSize: 20, fontWeight: 'bold'}}>
                      Day {index+1}
                    </Text>
                  </View>
                )
              }else{
                return (
                  <View key={index} 
                    ref={(refs)=>this['day'+index]=refs}
                    style={[styles.dayStyle]}>
                    <Text style={{fontSize: 7, color: 'rgb(190, 190, 190)', fontWeight: 'bold'}}>{
                      Util.getDateForm(obj.yyyymmdd)
                    }</Text>
                    <Text style={{fontSize: 13, color: 'rgb(190, 190, 190)', fontWeight: 'bold'}}>
                      Day {index+1}
                    </Text>
                  </View>
                )
              }
            })
          }</ScrollView>
        </View>
        {
          !sections || !sections.length ? undefined :
          <ViewPagerAndroid 
            style={{flex:1}} 
            initialPage={this.state.initialPage} 
            onPageSelected={(event)=>this.onPageSelected(event)}>{
            (sections || []).map((sectionObj, index)=>{
              return (
                <View key={index}>
                  <ScrollView>{
                    (sectionObj.data || []).map((obj, sectionIndex)=>{
                      return (
                        <ExpenseComponent 
                          key={sectionIndex} 
                          style={styles.smallContent}
                          search={()=>this.props.search()}
                          item={obj}
                        ></ExpenseComponent>
                      )
                    })
                  }</ScrollView>
                </View>
              )
            })
          }</ViewPagerAndroid>
        }
      </View>
    )
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20
  },

  dayContainer: {
    marginLeft: 30, 
    marginRight: 30,
    marginTop: 20,
    marginBottom: 20,
    borderBottomColor: 'rgb(190, 190, 190)',
    borderBottomWidth: 2,
  },
  dayStyle: {
    marginRight: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 5
  }
})