import React from 'react';
import {
  Image,
  ToastAndroid,
  ScrollView,
  Picker,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  DatePickerAndroid,
  TextInput,
  View,
  Dimensions
} from 'react-native';
import { connect } from 'react-redux'
import Util from '../components/Util'
import { Icon, Constants, MapView, Location, Permissions, ImagePicker } from 'expo'
import DBUtil from '../components/database/DBUtil';

class AddExpensesScreen extends DBUtil {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    const currentDate = Util.getCurrentDate(this.props.utc)
    
    let defaultSetting = {
      locationText: '',
      validate: {
        amount: 'required'
      },
      focus: '',
      trip_id: this.props.navigation.getParam('trip_id')
    }
    const item = props.navigation.getParam('item') || {}
    if(!item.expense_id){
      Object.assign(defaultSetting, {
        location: {locationText: '', coords: { latitude: 37.78825, longitude: -122.4324}},
        amount: 0,
        minus: false,
        remark: '',
        yyyymmdd: Util.yyyymmdd(currentDate),
        hh: Util.hhmm(currentDate).substring(0,2),
        mm: Util.hhmm(currentDate).substring(2,4),
        images: [],
      })
      this._getLocationAsync()
    }else{
      Object.assign(defaultSetting, {
        expense_id: item.copy? '': item.expense_id,
        location: {locationText: item.locationText, coords: { latitude: item.latitude, longitude: item.longitude}},
        amount: item.amount || 0,
        minus: Number(item.amount || 0) < 0,
        remark: item.remark || '',
        yyyymmdd: item.yyyymmdd,
        hh: item.hh,
        mm: item.mm,
        images: String(item.images || '').split('|'),
        trip_id: item.trip_id
      })
    }

    this.state = defaultSetting
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({location: {
        ...this.state.location,
        locationText: 'Permission to access location was denied'
      }})
    }

    let location = await Location.getCurrentPositionAsync({})
    // const reverseGeocode = (await Location.reverseGeocodeAsync(location.coords))[0]
    this.setMarkerByLocation({
      ...location,
      // locationText: [reverseGeocode.postalCode,
      //   reverseGeocode.country,
      //   reverseGeocode.region,
      //   reverseGeocode.city,
      //   reverseGeocode.street,
      //   reverseGeocode.name].join(' '),
    })
  }

  setMarkerByLocation= async (location) =>{
    console.log('location',location)
    this.setState({ location })
  }

  openDatePicker = async ()=>{
    const yyyymmdd = String(this.state.yyyymmdd || '')
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        date: new Date(
          yyyymmdd.substring(0,4),
          yyyymmdd.substring(4,6)-1,
          yyyymmdd.substring(6,8)
        )
      })
      if (action !== DatePickerAndroid.dismissedAction) {
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
    const item = this.props.navigation.getParam('item') || {}

    return (
      <View style={{flex:1}}>
        <View style={{
          marginTop: Constants.statusBarHeight + 5, 
          marginBottom: 30, flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity 
            style={{justifyContent: 'center'}}
            onPress={()=>this.props.navigation.navigate('mainTabStack')}>
            <Icon.MaterialIcons size={40} name='arrow-back' color="black" />
          </TouchableOpacity>
          <View style={{flex:1, justifyContent: 'center', alignItems: 'flex-start'}}>
            <Text style={{fontSize: 22, fontWeight: 'bold', marginLeft: 10}}>
            {
              item.copy? '복사':
              item.expense_id? '수정':
              '신규'
            }
            </Text>
          </View>
        </View>
        
        <ScrollView
          ref={(input)=>{this.scrollview=input}}>
          <View style={styles.row}>
            <TouchableOpacity 
              onPress={()=>{this.amount && this.amount.focus()}} 
              style={[styles.column, {flex:1}]}>
              <Text style={[styles.inputTitleStyle, this.state.focus=='amount'? styles.inputTitleFocusStyle: null]}>비용</Text>
              <View style={{flex:1, flexDirection: 'row', alignItems: 'center'}}>
                <TouchableOpacity onPress={()=>{
                    this.setState({minus: !this.state.minus}
                  )}}
                  style={{marginLeft: 15, marginRight: 25}} >
                  {
                    this.state.minus
                    ?<Icon.FontAwesome name={"minus"} size={30} />
                    :<Icon.FontAwesome name={"plus"} size={30} />
                  }
                </TouchableOpacity>
                <TextInput 
                  autoFocus={false}
                  style={[
                    styles.inputStyle, 
                    {flex: 1},
                    this.state.focus=='amount'? styles.inputFocusStyle: null, {fontSize: 17, textAlign: 'right'}
                  ]}
                  onFocus={()=>this.setState({focus: 'amount'})}
                  onBlur={()=>this.setState({focus: ''})}
                  ref={(input)=>{this.amount=input}}
                  keyboardType="numeric"
                  value={Util.comma(String(this.state.amount || '').replace(/[^0-9]/g,''))}
                  onChangeText={(value)=>{
                    this.setState({
                      amount: Number(String(value || '').replace(/[^0-9]/g,''))
                    })
                  }}
                  maxLength={10}
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
                maxLength={80}
              ></TextInput>
            </TouchableOpacity>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:1}]}>
              <TouchableWithoutFeedback onPress={()=>this.props.navigation.navigate('UpdateMap', {
                setMarkerByLocation: this.setMarkerByLocation,
                location: {
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  ...this.state.location.coords
                }
              })}>
                <View>
                  <Text style={[styles.inputTitleStyle, this.state.focus=='temp'? styles.inputTitleFocusStyle: null]}>장소</Text>
                  {/* <Text>{ this.state.locationText }</Text> */}
                  <View pointerEvents="none">
                    <MapView 
                      style={{ alignSelf: 'stretch', height: Dimensions.get('window').width * 0.7 }}
                      provider={MapView.PROVIDER_GOOGLE}
                      region={{ 
                        latitude: !this.state.location? null: this.state.location.coords.latitude, 
                        longitude: !this.state.location? null: this.state.location.coords.longitude, 
                        latitudeDelta: 0.005,
                        longitudeDelta: 0.005
                      }}
                      >
                      <MapView.Marker
                        coordinate={!this.state.location ? null : this.state.location.coords}
                      />
                    </MapView>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:1}]}>
              <Text style={[styles.inputTitleStyle, this.state.focus=='temp'? styles.inputTitleFocusStyle: null]}>사진</Text>
              <View style={[{minHeight: Dimensions.get('window').width * 3 / 4, justifyContent: 'center', alignItems: 'center'}]}>
                {
                  this.state.images.map((uri, index)=>{
                    if(!uri) return undefined
                    return (
                      <View key={['image',uri,index].join('_')} style={{flex: 1, flexDirection: 'row', margin: 20}}>
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
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('mainTabStack')}>
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

  save = async () => {
    const state = this.state
    const {validate} = this.state
    const valid = Object.keys(validate).reduce((entry, obj)=>{
      if(!entry) return false
      if(validate[obj] === 'required'){
        if(!state[obj]){
          entry = false
          this[obj] && this[obj].focus()
          this.scrollview && this.scrollview.scrollTo({y: 0, animated: true})
        }
      }
      return entry
    }, true)
    if(!valid) return

    let param = this.state
    if(!param.location.locationText){
      const reverseGeocode = (await Location.reverseGeocodeAsync(param.location.coords))[0]
      param.location.locationText = [reverseGeocode.postalCode,
          reverseGeocode.country,
          reverseGeocode.region,
          reverseGeocode.city,
          reverseGeocode.street,
          reverseGeocode.name].join(' ')
    }

    // amount minus
    if(param.minus){
      param.amount = Math.abs(Number(param.amount)) * -1
    }else{
      param.amount = Math.abs(Number(param.amount))
    }
    if(isNaN(param.amount)){
      param.amount = 0
    }
    if(!param.expense_id){
      this.insertTnExpense(param,
        (tx, res)=>{
          Util.toast('저장되었습니다.')
          this.props.navigation.navigate('mainTabStack')
        }
      )
    }else{
      this.updateTnExpense(param,
        (tx, res)=>{
          Util.toast('저장되었습니다.')
          this.props.navigation.navigate('mainTabStack')
        }
      )
    }
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

function select(state) {
  return {
    trip_id: state.tripReducer.trip_id,
    amount_unit: state.tripReducer.amount_unit,
    utc: state.tripReducer.utc,
  }
}
export default connect(select)(AddExpensesScreen)