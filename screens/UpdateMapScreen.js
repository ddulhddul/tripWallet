import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  TextInput,
  View
} from 'react-native';
import { Constants, Icon, MapView, Location, Permissions } from 'expo'
import { withNavigation } from 'react-navigation'

class UpdateMapScreen extends React.Component {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      searchLocationText: '',
      location: {
        locationText: '',
        coords: { 
          latitude: 37.78825, 
          longitude: -122.4324,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }
      },
    }
  }

  componentDidMount(){
    const location = this.props.navigation.getParam('location')
    this.setMarkerByLocation({coords: location})
  }

  setMarkerByLocation = async (location) => {
    const reverseGeocode = (await Location.reverseGeocodeAsync(location.coords))[0]
    this.setState({ 
      location: {
        ...location,
        locationText: [reverseGeocode.postalCode,
                      reverseGeocode.country,
                      reverseGeocode.region,
                      reverseGeocode.city,
                      reverseGeocode.street,
                      reverseGeocode.name].join(' '),
        coords: {
          ...location.coords
        }
      }
    });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        location: {
          ...this.state.location,
          locationText: 'Permission to access location was denied',
        }
      })
      return
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setMarkerByLocation(location)
  }

  _handleMapRegionChange(region){

    this.setMarkerByLocation({coords: {
      ...region
    }})
  }

  async _onPressSearch(){
    Keyboard.dismiss()
    const searchLocationText = this.state.searchLocationText
    const result = (await Location.geocodeAsync(searchLocationText))[0]
    if(result){
      this._handleMapRegionChange({
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
        ...result,
      })
    }else{
      alert('결과가 없습니다.')
    }
  }

  render() {
    const { location } = this.state
    return (
      <View style={{flex:1}}>
        <View style={{
          marginTop: Constants.statusBarHeight + 5, 
          marginBottom: 20}}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
            <Icon.MaterialIcons size={40} name='arrow-back' color="black" />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.column, {flex:1}]}>
          <TouchableOpacity 
            onPress={()=>this._getLocationAsync()} 
            style={{flexDirection: 'row', marginBottom: 10}}>
            <Text style={{fontSize:14, color: 'black'}}>
              <Icon.MaterialIcons size={14} name='my-location' color="black" style={{marginRight: 5}} />
              현재 위치로
            </Text>
          </TouchableOpacity>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex:1}}>
              <TextInput onChangeText={(value)=>{this.setState({searchLocationText: value})}}
                placeholder="장소 검색" style={styles.inputTitleStyle} />
            </View>
            <TouchableOpacity style={styles.editButtonArea} onPress={()=>this._onPressSearch()}>
              <Text style={{color: 'white', fontSize: 10}}>검색</Text>
            </TouchableOpacity>
          </View>
          {
            location && location.coords && <View style={{marginBottom: 10}}>
              <Text style={[
                {fontSize:12, color: 'rgb(231, 76, 60)'},
                {minHeight: 40}
                ]}>
                <Icon.MaterialIcons size={12} name='location-on' color="rgb(231, 76, 60)" />
                {location.locationText}
                {/* {location.coords.latitude} {location.coords.longitude} */}
              </Text>
            </View>
          }
          <View style={{flex:1}}>
            <View style={{
              position: 'absolute', 
              width:1, 
              height: '100%', 
              left: '50%',
              zIndex: 999999, 
              backgroundColor:'black'
            }}></View>
            <View style={{
              position: 'absolute', 
              height: 1,
              width: '100%', 
              top: '50%',
              zIndex: 999999, 
              backgroundColor:'black'
            }}></View>
            {
              !location? null:
              <MapView 
                style={{ alignSelf: 'stretch', flex:1 }}
                region={{ 
                  latitude: location.coords.latitude, 
                  longitude: location.coords.longitude, 
                  latitudeDelta: location.coords.latitudeDelta || 0.005,
                  longitudeDelta: location.coords.longitudeDelta || 0.005,
                }}
                onRegionChangeComplete={(param)=>this._handleMapRegionChange(param)}
                >
                <MapView.Marker
                  coordinate={Object.assign({}, location.coords)}
                />
              </MapView>
            }
          </View>
        </View>
        
        <View style={[styles.buttonArea]}>
          <View style={[styles.buttonColumn]}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
              <Text style={styles.buttonStyle}>취소</Text>
            </TouchableOpacity>
          </View>
          <View style={[{width: 0.1}]}></View>
          <View style={[styles.buttonColumn]}>
            <TouchableOpacity onPress={()=>this.save()}>
              <Text style={[styles.buttonStyle, {color: "rgb(74, 190, 202)"}]}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

  save(){
    let setMarkerByLocation = this.props.navigation.getParam('setMarkerByLocation')
    setMarkerByLocation(this.state.location)
    this.props.navigation.goBack()
  }

}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 20
  },
  column: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  },
  inputTitleStyle: {
    color: 'grey',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  inputStyle: {
    height: 30,
    borderBottomWidth: 2,
    borderColor: 'grey',
  },

  // button
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopColor: 'rgb(158, 158, 158)',
    borderTopWidth: 1,
  },
  buttonColumn: {
    marginTop: 20,
    marginBottom: 20
  },
  buttonStyle: {
    fontSize: 20,
    color: 'rgb(158, 158, 158)'
  },
  
  
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Constants.statusBarHeight + 5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Day 부분
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  dayStyle: {
    marginRight: 5,
    fontSize: 30,
    fontWeight: 'bold',
  },
  weekStyle: {
    alignSelf: 'flex-end',
    fontSize: 20,
    marginBottom: 5
  },

  // 총 사용금액
  totalExpensesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalExpenseTitle: {
    color: 'grey',
  },
  totalExpense: {
    fontWeight: 'bold'
  },

  // middle Paging
  pagingContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: 200,
    justifyContent: 'space-evenly',
    marginTop: 15,
    marginBottom: 20
  },
  circle: {
    width:15,
    height:15,
    borderRadius:50,
    opacity: 0.3,
    backgroundColor: 'grey'
  },

  viewPager: {
    flex: 1
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  },

  editButtonArea: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 30, 
    width: 40,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: 'rgb(52, 152, 219)'
  }

})

export default withNavigation(UpdateMapScreen)