import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
// import DeviceInfo from 'react-native-device-info'
import CountryPicker, {
  getAllCountries
} from 'react-native-country-picker-modal'

const NORTH_AMERICA = ['CA', 'MX', 'US']
export default class NationScreen extends Component {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    console.log('getAllCountries()',getAllCountries())
    this.state = {
      cca2: 'US',
      callingCode: '1',
      userCountryData: getAllCountries()
    }
  }

  _selectNation(){
    // this.
  }

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center'}}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.headerText}>국가를 선택해주세요</Text>
          </View>
          <View onPress={()=>this._selectNation()} style={[styles.body, {flexDirection: 'row'}]}>
            {/* <View style={{flex: 0.6, aspectRatio: 1.4, backgroundColor: 'grey'}}> */}
              <CountryPicker
                // countryList={NORTH_AMERICA}
                styles={{width: 200}}
                countryList={this.state.userCountryData.map((obj)=>obj.cca2)}
                onChange={value => {
                  this.setState({ cca2: value.cca2, callingCode: value.callingCode })
                }}
                cca2={this.state.cca2}
                translation="kor"
              />
            {/* </View> */}
            <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
              <Text style={{fontSize: 20, fontWeight: 'bold'}}>대한민국</Text>
              <Text style={{fontSize: 15, fontWeight: 'bold'}}>UTC-9</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.header}
            onPress={()=>{this.remark && this.remark.focus()}} >
            <Text style={[
                styles.headerText,
                this.state.focus=='remark'? styles.inputTitleFocusStyle: null
              ]}>도시를 입력해주세요</Text>
            <View>
              <TextInput 
                ref={(input)=>{this.remark=input}}
                onFocus={()=>this.setState({focus: 'remark'})}
                onBlur={()=>this.setState({focus: ''})}
                style={[
                  styles.inputStyle, {height: 30},
                  this.state.focus=='remark'? styles.inputFocusStyle: null
                ]} />
            </View>
          </TouchableOpacity>
        </ScrollView>
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
    fontSize: 30,
    fontWeight: 'bold',
  },

  body: {
    flex: 0.3,
    margin: 30,
  },

  inputStyle: {
    height: 50,
    width: 100,
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
  
})