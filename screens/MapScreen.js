import React, { Component } from 'react'
import { connect } from 'react-redux'
import { 
  Text, View, Dimensions, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, TouchableHighlight
} from 'react-native'
import { Icon, MapView } from 'expo'
import DBUtil from '../components/database/DBUtil';
import Loading from '../components/Loading';
import Util from '../components/Util';
import ExpenseHeader from '../components/ExpenseHeader'
import ExpenseListComponent from '../components/daypage/ExpenseListComponent';

class MapScreen extends DBUtil {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      isReady: false,
      selectedMarkerIndex: undefined,
      showMap: true,
      thisSection: {},
      sections: [],
      trip_id: ''
    }
  }

  componentWillUnmount(){
    this.focusListener && this.focusListener.remove()
  }

  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.setState({trip_id: this.props.trip_id})
      this.search()
    })
  }

  search(){
    this.setState({isReady: false})
    this.props.trip_id && this.listTnExpense({trip_id: this.props.trip_id},
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
          isReady: true,
          sections: sections.reverse()
        })
        // list.length && this.onPageSelected(this.state.pageIndex)
      }
    )
  }

  render() {

    const { sections, thisSection, showMap } = this.state
    return (
      <View style={styles.container}>
        
        <ExpenseHeader 
          trip_id={this.props.trip_id}
          sections={sections}
          isMapView={true}
          />

        {(!this.state.isReady)? <Loading />:null}

        <View style={styles.mapContainer}>
          {
            !sections.length || !showMap? null:
            <MapView 
              // onMapReady = { () => console.log('map ready...') }
              style={[{ alignSelf: 'stretch', flex:1, maxHeight: Dimensions.get('window').height * 0.5 },
                showMap=='full'? {maxHeight: Dimensions.get('window').height}: null]}
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
                      key={[JSON.stringify(sectionData),sectionIndex].join('_')}
                      coordinate={{
                        latitude: sectionData.latitude, 
                        longitude: sectionData.longitude, 
                    }}>
                      <MapView.Callout tooltip>
                        <View style={{
                                backgroundColor: 'white', padding: 10, borderRadius: 20,
                                borderWidth: 0.5, borderColor: 'blue'
                                }}>
                        {
                          ((thisSection||{}).data||[]).filter((obj)=>{
                            return Math.floor(obj.longitude*1000)==Math.floor(sectionData.longitude *1000)
                              && Math.floor(obj.latitude*1000)==Math.floor(sectionData.latitude *1000)
                          }).map((obj, index)=>{
                            return (
                              <View key={[JSON.stringify(obj),index,2].join('_')} style={{flex:1, maxWidth: 170}}>
                                <View style={{flexDirection: 'row', flex:1, justifyContent: 'space-between'}}>
                                  <Text style={{fontSize: 10, color:'grey', marginRight: 10}}>{obj.hh}:{obj.mm} {Util.getNoon(Number(obj.hh))}</Text>
                                  <Text style={{fontSize: 12, fontWeight: 'bold', textAlign: 'right'}}>{Util.comma(obj.amount)} {this.props.amount_unit}</Text>
                                </View>
                                <View style={{flex:1}}>
                                  <Text numberOfLines={1} style={[
                                      {fontSize: 8, fontWeight: 'bold', textAlign: 'left'},
                                      obj.remark? {marginBottom: 10, marginLeft: 5}: null
                                    ]}>{obj.remark}</Text>
                                </View>
                              </View>
                            )
                          })
                        }
                        </View>
                      </MapView.Callout>
                    </MapView.Marker>
                  )
                })
              }
            </MapView>
          }

          {!sections.length? null:
          <TouchableWithoutFeedback
            onPressIn={(event)=>{this.pressInY = event.nativeEvent.pageY}}
            onPressOut={(event)=>{
              if(!event || !event.nativeEvent || !event.nativeEvent) return
              const pageY = event.nativeEvent.pageY
              if(pageY > this.pressInY){
                if(!showMap) this.setState({showMap: true})
                else if(showMap && showMap!='full') this.setState({showMap: 'full'})
              }else if(pageY < this.pressInY){
                if(showMap=='full') this.setState({showMap: true})
                else if(showMap) this.setState({showMap: false})
              }
            }}>
            <View>
              <View style={{borderBottomColor: 'grey', borderTopWidth: 0.5, 
                borderBottomWidth: 0.5, borderStyle: 'dashed', height: 5}}>
              </View>
              <Text style={{fontSize: 8, textAlign: 'center'}}>{
                showMap=='full'
                  ? '올려서 지도 반으로 접기'
                : showMap
                  ? '올려서 지도 숨기기 / 내려서 지도 펼치기'
                  : '내려서 지도 펼치기'
              }</Text>
            </View>
          </TouchableWithoutFeedback>
          }

          <ExpenseListComponent 
            showMap={showMap}
            search={()=>this.search()}
            onPageSelected={(thisSection={})=>this.setState({thisSection: thisSection})}
            sections={sections}
            />
            
          <TouchableOpacity style={styles.plusIcon} onPress={(event)=>this._pressAdd(event)}>
            <Icon.AntDesign 
              name="pluscircle" 
              size={45}
              color="rgb(74, 190, 202)"
              />
          </TouchableOpacity>
        </View>
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
    trip_id: state.tripReducer.trip_id,
    amount_unit: state.tripReducer.amount_unit
  }
}

export default connect(select)(MapScreen)