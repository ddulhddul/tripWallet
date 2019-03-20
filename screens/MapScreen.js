import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Text, View, Dimensions, StyleSheet, TouchableOpacity
} from 'react-native'
import { Icon, MapView } from 'expo'
import DBUtil from '../components/database/DBUtil';
import ExpenseHeader from '../components/ExpenseHeader'
import ExpenseListComponent from '../components/daypage/ExpenseListComponent';

class MapScreen extends DBUtil {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      showMap: true,
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
        
        const sections = Array.from(Object.keys(objByList)).map((key)=>{

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

        this.setState({
          sections: sections.reverse()
        })
        // list.length && this.onPageSelected(this.state.pageIndex)
      }
    )
  }

  render() {

    const {sections, thisSection } = this.state
    return (
      <View style={styles.container}>
        
        <ExpenseHeader 
          trip_id={this.props.trip_id}
          sections={sections}
          isMapView={true}
          />

        <TouchableOpacity onPress={()=>this.setState({showMap: !this.state.showMap})}>
          <View style={{borderBottomColor: 'grey', borderBottomWidth: 0.5, borderStyle: 'dashed', padding: 5}}>
            {
              this.state.showMap
              ?<Text style={{textAlign: 'center'}}>지도 접기</Text>
              :<Text style={{textAlign: 'center'}}>지도 펼치기</Text>
            }
          </View>
        </TouchableOpacity>

        <View style={styles.mapContainer}>
          {
            !this.state.showMap? null:
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
          }

          <ExpenseListComponent 
            search={()=>this.search()}
            onPageSelected={(thisSection={})=>this.setState({thisSection: thisSection})}
            sections={sections}
            />
            
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

  _pressAdd(event){
    event.stopPropagation()
    this.props.navigation.navigate('AddExpenses', {
      trip_id: this.state.trip_id
    })
  }
}



const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
  },
  plusIcon: {
    backgroundColor: 'white',
    borderRadius: 50,
    position: 'absolute',
    right: 20,
    bottom: 20
  },

  mapContainer: {
    flex: 1,
  },
})

function select(state) {
  return {
    trip_id: state.tripReducer.trip_id
  }
}

export default connect(select)(MapScreen)