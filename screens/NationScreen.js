import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ToastAndroid } from 'react-native'
import DBUtil from '../components/database/DBUtil'
import Util from '../components/Util'
import { Constants } from 'expo'

export default class NationScreen extends DBUtil {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    const trip_id = this.props.navigation.getParam('trip_id')
    if(!trip_id){
      this.state = {
        trip_id: '',
        nation: {},
        city_name: '',
        amount_unit: ''
      }
    }else{
      const tripObj = this.props.navigation.getParam('tripObj') || {}
      this.state = {
        trip_id: trip_id,
        nation: (this.getNationList() || []).find((obj)=>{
          return tripObj.nation_id == obj.id
        }) || {},
        city_name: tripObj.city_name||'',
        amount_unit: tripObj.amount_unit
      }
    }
  }

  componentDidMount(){
    // this._selectNation()    
  }

  _selectNation(){
    this.props.navigation.navigate('SelectNation', {
      setNation: (param={})=>{
        this.setState({nation: param})
      }
    })
  }

  _saveNation(){
    const trip_id = this.state.trip_id
    if(!trip_id){
      this.insertTnTrip(this.state, (tx, res)=>{
        Util.toast('저장되었습니다.')
        this.props.navigation.goBack()
      })
    }else{
      this.updateTnTrip(this.state, (tx, res)=>{
        Util.toast('저장되었습니다.')
        this.props.navigation.goBack()
      })
    }
  }

  render() {
    const {nation, focus} = this.state
    return (
      <View style={{flex:1, justifyContent: 'center'}}>
        <ScrollView style={{
          marginTop: Constants.statusBarHeight + 5,
          paddingLeft: 30, paddingRight: 30}}>
          
          {(focus)? null:
            <View>
              <View style={styles.header}>
                <Text style={styles.headerText}>국가를 선택해주세요</Text>
              </View>
              <View style={[styles.body, {flexDirection: 'row'}]}>
                <TouchableOpacity onPress={()=>this._selectNation()} style={{flex:1}}>
                  {
                    !nation.title? (
                      <View style={{flex:1}}>
                        <View style={{flex:1, aspectRatio: 1.4, borderRadius: 20, backgroundColor: 'grey'}}></View>
                        <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontSize: 15, fontWeight: 'bold', marginTop: 5, color: "grey"}}>눌러주세요</Text>
                        </View>
                      </View>
                    ) :(
                      <View style={{flex:1}}>
                        <View style={{flex:1, aspectRatio: 1.4, borderRadius: 20, elevation: 5}}>
                          <Image source={nation.requiredUri} style={{flex:1, aspectRatio: 1.4, borderRadius: 20}} />
                        </View>
                        <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
                          <Text style={{fontSize: 15, fontWeight: 'bold', marginTop: 5}}>UTC {nation.utc>0?'+':''}{nation.utc?nation.utc:''}</Text>
                          <Text style={{fontSize: 25, fontWeight: 'bold', marginTop: 5}}>{nation.title}</Text>
                        </View>
                      </View>
                    )
                  }
                </TouchableOpacity>
              </View>
            </View>
          }

          {(focus&&focus!=='amount_unit')? null:
            <TouchableOpacity 
              style={styles.header}
              onPress={()=>{this.amount_unit && this.amount_unit.focus()}} >
              <Text style={[
                  styles.headerText,
                  this.state.focus=='amount_unit'? styles.inputTitleFocusStyle: null
                ]}>금액 단위를 입력해주세요</Text>
              <TextInput 
                ref={(input)=>{this.amount_unit=input}}
                onFocus={()=>this.setState({focus: 'amount_unit'})}
                onBlur={()=>this.setState({focus: ''})}
                value={this.state.amount_unit}
                onChangeText={(value)=>this.setState({amount_unit: value})}
                maxLength={10}
                style={[
                  styles.inputStyle,
                  this.state.focus=='amount_unit'? styles.inputFocusStyle: null
                ]} />
            </TouchableOpacity>
          }

          {(focus&&focus!=='remark')? null:
            <TouchableOpacity 
              style={styles.header}
              onPress={()=>{this.remark && this.remark.focus()}} >
              <Text style={[
                  styles.headerText,
                  this.state.focus=='remark'? styles.inputTitleFocusStyle: null
                ]}>도시를 입력해주세요</Text>
              <TextInput 
                ref={(input)=>{this.remark=input}}
                onFocus={()=>this.setState({focus: 'remark'})}
                onBlur={()=>this.setState({focus: ''})}
                value={this.state.city_name}
                onChangeText={(value)=>this.setState({city_name: value})}
                maxLength={80}
                style={[
                  styles.inputStyle,
                  this.state.focus=='remark'? styles.inputFocusStyle: null
                ]} />
            </TouchableOpacity>
          }

          <View style={{height: 30}}></View>
        </ScrollView>

        {
          !this.state.nation.id? null: (
            <View style={[styles.buttonArea]}>
              <View style={[styles.buttonColumn]}>
              </View>
              <View style={[{width: 0.1}]}></View>
              <View style={[styles.buttonColumn]}>
                <TouchableOpacity onPress={()=>this._saveNation()}>
                  <Text style={[styles.buttonStyle, {color: "rgb(74, 190, 202)"}]}>저장</Text>
                </TouchableOpacity>
              </View>
            </View>
          )
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flex:1, 
    // marginTop: 50,
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
    width: '90%',
    height: 50,
    marginTop: 10,
    borderBottomWidth: 2,
    borderColor: 'grey',
    alignItems: 'center',
    textAlign: 'center'
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