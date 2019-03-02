import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  DatePickerAndroid,
  Button,
  TextInput,
  View,
  Dimensions
} from 'react-native';
import Util from '../components/Util'
import { Icon, Constants, MapView, Location, Permissions } from 'expo'

export default class AddExpensesScreen extends React.Component{
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    console.log('Util.yyyymmdd(Util.getCurrentDate())', Util.yyyymmdd(Util.getCurrentDate()))
    this.state = {
      locationText: '',
      location: {coords: { latitude: 37.78825, longitude: -122.4324}},

      amount: 0,
      remark: '',
      yyyymmdd: Util.yyyymmdd(Util.getCurrentDate()),
      validate: {
        amount: 'required'
      },
      focus: '',
    }
  }

  componentDidMount() {
    this._getLocationAsync();
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        locationText: 'Permission to access location was denied',
      })
      return
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setMarkerByLocation(location)
  }

  setMarkerByLocation= async (location) =>{
    const reverseGeocode = (await Location.reverseGeocodeAsync(location.coords || {}) || [])[0] || {}
    // console.log('location', location, reverseGeocode)
    this.setState({ 
      location, 
      locationText: [
        reverseGeocode.postalCode,
        reverseGeocode.country,
        reverseGeocode.city,
        reverseGeocode.region,
        reverseGeocode.street,
        reverseGeocode.name,
      ].join(' ')
    });
  }

  openDatePicker = async ()=>{
    const yyyymmdd = String(this.state.yyyymmdd || '')
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date(
          yyyymmdd.substring(0,4),
          yyyymmdd.substring(4,6)-1,
          yyyymmdd.substring(6,8)
        )
      })
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        this.setState({
          yyyymmdd: [
            year, 
            Util.lpad(month+1, 2, '0'), 
            Util.lpad(day, 2, '0')
          ].join('')
        })
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
    
  }

  render() {

    let remark = String(this.state.remark || '')
    let entry = 0
    while(remark.match(/\n/)){
      remark = remark.replace(/\n/,'')
      entry++
    }
    console.log('entry', entry)
    entry = (entry || 1) * 25 + 30

    return (
      <View style={{flex:1}}>
        <View style={{marginTop: 30, marginBottom: 20}}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
            <Icon.MaterialIcons size={40} name='arrow-back' color="black" />
          </TouchableOpacity>
        </View>
        
        <ScrollView>
          <View style={styles.row}>
            <TouchableOpacity 
              onPress={()=>{this.amount && this.amount.focus()}} 
              style={[styles.column, {flex:1}]}>
              <Text style={[styles.inputTitleStyle, this.state.focus=='amount'? styles.inputTitleFocusStyle: null]}>비용</Text>
              <TextInput 
                style={[styles.inputStyle, this.state.focus=='amount'? styles.inputFocusStyle: null]} autoFocus
                onFocus={()=>this.setState({focus: 'amount'})}
                onBlur={()=>this.setState({focus: ''})}
                ref={(input)=>{this.amount=input}}
                keyboardType="numeric"
                value={Util.comma(String(this.state.amount || ''))}
                onChangeText={(value)=>{
                  this.setState({
                    amount: Number(String(value || '').replace(/[^0-9]/g,''))
                  })
                }}
              ></TextInput>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:0.5}]}>
              <TouchableOpacity onPress={()=>this.openDatePicker()}>
                <Text style={[styles.inputTitleStyle, this.state.focus=='temp'? styles.inputTitleFocusStyle: null]}>날짜</Text>
                <Text
                  style={[styles.inputStyle, {textAlign: 'center'}]}
                >{Util.getDateForm(this.state.yyyymmdd)}</Text>
              </TouchableOpacity>
              {/* <TextInput style={[styles.inputStyle, this.state.focus=='temp'? styles.inputFocusStyle: null]}></TextInput> */}
            </View>
            <View style={[styles.column, {flex:0.5}]}>
              <Text style={[styles.inputTitleStyle, this.state.focus=='temp'? styles.inputTitleFocusStyle: null]}>시간</Text>
              <TextInput style={[styles.inputStyle, this.state.focus=='temp'? styles.inputFocusStyle: null]}></TextInput>
            </View>
          </View>
          <View style={styles.row}>
            <TouchableOpacity 
              onPress={()=>{this.remark && this.remark.focus()}} 
              style={[styles.column, {flex:1}]}>
              <Text style={[styles.inputTitleStyle, this.state.focus=='remark'? styles.inputTitleFocusStyle: null]}>내용</Text>
              <TextInput style={[
                  styles.inputStyle, {height: entry},
                  this.state.focus=='remark'? styles.inputFocusStyle: null
                ]}
                onFocus={()=>this.setState({focus: 'remark'})}
                onBlur={()=>this.setState({focus: ''})}
                value={String(this.state.remark || '')}
                multiline={true}
                ref={(input)=>{this.remark=input}}
                onChangeText={(value)=>{
                  console.log('value',value)
                  this.setState({
                    remark: String(value || '')
                  })
                }}
              ></TextInput>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:1}]}>
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('UpdateMap', {
                setMarkerByLocation: this.setMarkerByLocation,
                location: {
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  ...this.state.location.coords
                }
              })}>
                <Text style={[styles.inputTitleStyle, this.state.focus=='temp'? styles.inputTitleFocusStyle: null]}>장소</Text>
                <View style={{marginBottom: 10}}>
                  <Text style={this.state.locationText? {fontSize:12, color: 'rgb(231, 76, 60)'}: {display: 'none'}}>
                    <Icon.MaterialIcons size={12} name='location-on' color="rgb(231, 76, 60)" />
                    {this.state.locationText}
                  </Text>
                </View>
              </TouchableOpacity>
              <MapView 
                style={{ alignSelf: 'stretch', height: Dimensions.get('window').width * 0.7 }}
                region={{ 
                  latitude: !this.state.location? null: this.state.location.coords.latitude, 
                  longitude: !this.state.location? null: this.state.location.coords.longitude, 
                  // latitudeDelta: 0.0922, 
                  // longitudeDelta: 0.0421
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005
                }}
                // onRegionChange={this._handleMapRegionChange}
                >
                <MapView.Marker
                  coordinate={!this.state.location ? null : this.state.location.coords}
                  // title="My Marker"
                  // description="Some description"
                />
              </MapView>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:1}]}>
              <Text style={[styles.inputTitleStyle, this.state.focus=='temp'? styles.inputTitleFocusStyle: null]}>사진</Text>
              <TextInput style={[styles.inputStyle, {height: 150}]}></TextInput>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.buttonArea]}>
          <View style={[styles.buttonColumn]}>
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
              <Text style={styles.buttonStyle}>취소</Text>
            </TouchableOpacity>
          </View>
          <View style={[{width: 0.1}]}></View>
          <View style={[styles.buttonColumn]}>
            <TouchableOpacity onPress={()=>alert(1)}>
              <Text style={[styles.buttonStyle, {color: "rgb(74, 190, 202)"}]}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 20
  },
  column: {
    marginLeft: 20,
    marginRight: 20
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

  // focus
  inputTitleFocusStyle: {
    color: "rgb(74, 190, 202)"
  },
  inputFocusStyle: {
    borderColor: "rgb(74, 190, 202)"
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
    paddingTop: 30,
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
  }

})