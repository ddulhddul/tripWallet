import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native'

export default class NationScreen extends Component {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
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
            <TouchableOpacity onPress={()=>this.props.navigation.navigate('SelectNation')}>
              {/* <Image source={{uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAeCAMAAABpA6zvAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAIRQTFRFAFOlAFOlnZ8//9IA+rkG2Cgt0g400Q0152gc/9AA9ckGPnF9AFGnAFGonZ5A9ckHPm9/AE+qbIdfxrMl/9EA+csEj5hIaoZh/88A2Ckt/84A/skB/soB+bQH5mUd/ssB3kQm3T4n1Bcy0hA00g803kUm30Um30Ula4dgaYZh+rgG////mzb/7wAAAAF0Uk5T/hrjB30AAAABYktHRCskueQIAAAACXBIWXMAAABIAAAASABGyWs+AAAAkUlEQVQ4y2NghAMmZhZWNnYOTi5uHkZMwDCqkDoKeeGAD6qQX0CQFxMwCMGBsAhEoaiYuBAmYJBAAE4WSZBCKQlsgEEaAWRkgSbKyUtjBQwKSEBRSVmFVVUBK2BgRwbKysoq7NgB8QqRTFcDW62Ow2qiPUN08GjAASLANTUwAfFROBTS4xBTKKIlqQIKcGwKGQCIhy8sc3x++AAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxMy0xMC0wN1QxMzoxNToxOSswMjowMC/GJUYAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTMtMTAtMDdUMTM6MTU6MTkrMDI6MDBem536AAAAAElFTkSuQmCC"}} 
                style={{width: '100%', aspectRatio: 1.4}} /> */}
              {/* <Image source={require("../assets/images/countries/ca.png")} style={{width: '100%', aspectRatio: 1.4}} /> */}
              <Image source={require("../assets/images/robot-dev.png")} style={{width: '100%', aspectRatio: 1.4}} />
              {/* <View style={{flex: 0.6, aspectRatio: 1.4, backgroundColor: 'grey'}}></View> */}
              <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 20, fontWeight: 'bold'}}>대한민국</Text>
                <Text style={{fontSize: 15, fontWeight: 'bold'}}>UTC-00</Text>
              </View>
            </TouchableOpacity>
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