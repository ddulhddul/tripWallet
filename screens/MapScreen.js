import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
  View, Text, Dimensions, StyleSheet, FlatList,
  ViewPagerAndroid, ScrollView, TouchableWithoutFeedback 
} from 'react-native'
import { MapView } from 'expo'
import DBUtil from '../components/database/DBUtil';
import ExpenseComponent from '../components/daypage/ExpenseComponent';
import Util from '../components/Util';
import ExpenseHeader from '../components/ExpenseHeader'

class MapScreen extends DBUtil {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      initialPage: 0,
      pageIndex: 0,
      thisSection: {},
      sections: [],
      trip_id: ''
    }
  }

  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.setState({trip_id: this.props.trip_id})
      this.search()
    })
  }

  search(){
    this.listTnExpense({trip_id: this.props.trip_id},
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

        list.length && this.onPageSelected(this.state.pageIndex)
      }
    )
  }

  onPageSelected(event){
    let pageIndex = 0
    if(typeof event === 'number') pageIndex = event
    else{
      if(!event || !event.nativeEvent) return
      pageIndex = event.nativeEvent.position
    }
    
    this.flatlist.scrollToIndex({animated: true, index: pageIndex, viewPosition: 1})
    this.setState({
      pageIndex: pageIndex,
      thisSection: this.state.sections[pageIndex],
      sections: Object.assign([], this.state.sections)
    })
  }

  render() {

    const {sections, thisSection, pageIndex} = this.state
    return (
      <View style={styles.container}>
        
        <ExpenseHeader 
          trip_id={this.props.trip_id}
          sections={sections}
          isMapView={true}
          />

        <View style={styles.mapContainer}>
          <MapView 
            // onMapReady = { () => console.log('map ready...') }
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
          <View 
            // pointerEvents="none"
            style={styles.dayContainer}>
            <FlatList horizontal={true}
              ref={(refs)=>this.flatlist=refs}
              data={sections}
              keyExtractor={(item, index)=>JSON.stringify(item)}
              renderItem={({item, index})=>(
                <View key={index} 
                  style={[styles.dayStyle]}>
                  <TouchableWithoutFeedback onPress={()=>{
                    this.onPageSelected(index)
                    this.viewPager.setPage(index)
                    }}>
                    <View>
                      <Text style={this.state.pageIndex == index
                        ? {fontSize: 10, fontWeight: 'bold'}
                        : {fontSize: 7, color: 'rgb(190, 190, 190)', fontWeight: 'bold'}}>{
                        Util.getDateForm(item.yyyymmdd)
                      }</Text>
                      <Text style={this.state.pageIndex == index
                        ? {fontSize: 20, fontWeight: 'bold'}
                        : {fontSize: 13, color: 'rgb(190, 190, 190)', fontWeight: 'bold'}}>
                        Day {index+1}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            />
          </View>
          {
            !sections || !sections.length ? undefined :
            <ViewPagerAndroid 
              style={{flex:1}} 
              ref={(refs=>this.viewPager=refs)}
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
      </View>
    )
  }
}



const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
  },

  mapContainer: {
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

function select(state) {
  return {
    trip_id: state.tripReducer.trip_id
  }
}

export default connect(select)(MapScreen)