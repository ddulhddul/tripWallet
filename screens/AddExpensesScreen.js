import React from 'react';
import {
  Image,
  Alert,
  ScrollView,
  Picker,
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
import { Icon, Constants, MapView, Location, Permissions, ImagePicker } from 'expo'
import DBUtil from '../components/database/DBUtil';

export default class AddExpensesScreen extends DBUtil {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    const currentDate = Util.getCurrentDate()
    // console.log('Util.yyyymmdd(Util.getCurrentDate())', Util.yyyymmdd(Util.getCurrentDate()), Util.hhmm(currentDate).substring(0,2))
    this.state = {
      locationText: '',
      location: {coords: { latitude: 37.78825, longitude: -122.4324}},

      amount: 0,
      remark: '',
      yyyymmdd: Util.yyyymmdd(currentDate),
      hh: Util.hhmm(currentDate).substring(0,2),
      mm: Util.hhmm(currentDate).substring(2,4),
      images: [],
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

  _pickImage= async ()=>{
    let { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') return

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      aspect: [4, 3],
    })
    if (!result.cancelled) {
      this.setState({
        images: [
          ...this.state.images,
          result.uri
        ]
      })
      // this.setState({ image: result.uri })
    }
  }

  render() {

    let remark = String(this.state.remark || '')
    let entry = 0
    while(remark.match(/\n/)){
      remark = remark.replace(/\n/,'')
      entry++
    }
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
              <View>
                <TextInput 
                  style={[styles.inputStyle, this.state.focus=='amount'? styles.inputFocusStyle: null, {fontSize: 17, textAlign: 'right'}]} autoFocus
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
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:0.5}]}>
              <TouchableOpacity onPress={()=>this.openDatePicker()}>
                <Text style={[styles.inputTitleStyle, this.state.focus=='temp'? styles.inputTitleFocusStyle: null]}>날짜</Text>
                <View style={[styles.inputStyle, {justifyContent: 'center'}]}>
                  <Text
                    style={[{textAlign: 'center', fontSize: 17}]}
                  >{Util.getDateForm(this.state.yyyymmdd)}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.column, {flex:0.5, marginLeft: 0, marginRight: 0}]}>
              <Text style={[styles.inputTitleStyle, this.state.focus=='temp'? styles.inputTitleFocusStyle: null]}>시간</Text>
              <View style={[styles.inputStyle, {flexDirection: 'row', justifyContent: 'space-evenly'}]}>
                <Picker
                  selectedValue={Util.lpad(this.state.hh, 2, '0')}
                  onValueChange={(itemValue, itemIndex) => this.setState({hh: itemValue})}
                  style={{ flex: 0.5 }}
                  >{
                    Array.from(Array(24)).map((obj, hour)=>{
                      return <Picker.Item key={hour} label={Util.lpad(hour, 2, '0')} value={Util.lpad(hour, 2, '0')} />
                    })
                  }
                </Picker>
                <Text>:</Text>
                <Picker
                  selectedValue={Util.lpad(this.state.mm, 2, '0')}
                  style={{ flex: 0.5 }}
                  onValueChange={(itemValue, itemIndex) => this.setState({mm: itemValue})}
                  >{
                    Array.from(Array(60)).map((obj, minutes)=>{
                      return <Picker.Item key={minutes} label={Util.lpad(minutes, 2, '0')} value={Util.lpad(minutes, 2, '0')} />
                    })
                  }
                </Picker>
              </View>
            </View>
          </View>
          <View style={styles.row}>
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
                provider={MapView.PROVIDER_GOOGLE}
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
              <View style={[{minHeight: Dimensions.get('window').width * 3 / 4, justifyContent: 'center', alignItems: 'center'}]}>
                {
                  this.state.images.map((uri, index)=>{
                    return uri && (
                      <View key={['image',index].join('_')} style={{flex: 1, flexDirection: 'row', margin: 20}}>
                        <Image source={{uri: uri}} 
                          style={{
                            width: Dimensions.get('window').width * 3 / 4, 
                            height: Dimensions.get('window').width * 3 / 4
                          }} 
                        />
                        <TouchableOpacity onPress={()=>{
                          this.setState({
                            images: this.state.images.filter((obj)=>{
                              return obj !== uri
                            })
                          })
                        }} 
                          style={{position:'absolute', zIndex: 999999, top:10, right: 10}}>
                          <Icon.FontAwesome name="close" size={40} /* color="rgb(192, 57, 43)" */ />
                        </TouchableOpacity>
                      </View>
                    )
                  })
                }
                <TouchableOpacity onPress={()=>this._pickImage()}
                  style={{margin: 100}}>
                  <Icon.FontAwesome name="plus" size={60} />
                </TouchableOpacity>
              </View>
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
            <TouchableOpacity onPress={()=>this.save()}>
              <Text style={[styles.buttonStyle, {color: "rgb(74, 190, 202)"}]}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

  save(){
    Alert.alert(
      '저장',
      '저장 하시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {text: '저장', onPress: () => {
          const param = this.state
          this.queryExecute(
            `insert into TN_EXPENSE (
              amount,
              remark,
              yyyymmdd,
              hh,
              mm,
              latitude,
              longitude,
              latitudeDelta,
              longitudeDelta,
              images
            ) values (
              ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )`,
            [
              param.amount,
              param.remark,
              param.yyyymmdd,
              param.hh,
              param.mm,
              param.location.coords.latitude,
              param.location.coords.longitude,
              param.location.coords.latitudeDelta,
              param.location.coords.longitudeDelta,
              param.images.join('|')
            ],
            (tx, res)=>{
              alert('saved') 
              this.props.navigation.goBack()
            }
          )
        }},
      ],
      {cancelable: true},
    )
  }

}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 20
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    // alignItems: 'center',
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
    height: 50,
    borderBottomWidth: 2,
    borderColor: 'grey',
    alignItems: 'center'
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
  
})