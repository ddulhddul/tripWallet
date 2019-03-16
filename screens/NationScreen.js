import React, { Component } from 'react'
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ToastAndroid } from 'react-native'
import DBUtil from '../components/database/DBUtil'

export default class NationScreen extends DBUtil {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      nation: {},
      city_name: ''
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

  _insertNation(){
    this.insertTnTrip(this.state, (tx, res)=>{
      ToastAndroid.showWithGravity(
        '저장되었습니다.',
        ToastAndroid.SHORT,
        ToastAndroid.BOTTOM
      )
      this.props.navigation.goBack()
    })
  }

  render() {
    const {nation} = this.state
    return (
      <View style={{flex:1, justifyContent: 'center', marginLeft: 30, marginRight: 30}}>
        <ScrollView>
          {
            this.state.focus === 'remark'? null: (

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
            )
          }
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
        </ScrollView>

        {
          !this.state.nation.id? null: (
            <View style={[styles.buttonArea]}>
              <View style={[styles.buttonColumn]}>
              </View>
              <View style={[{width: 0.1}]}></View>
              <View style={[styles.buttonColumn]}>
                <TouchableOpacity onPress={()=>this._insertNation()}>
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