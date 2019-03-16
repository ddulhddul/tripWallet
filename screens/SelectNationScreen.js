import React, { Component } from 'react'
import { View, Text, Image, ScrollView, TextInput, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import DBUtil, {getNationList} from '../components/database/DBUtil'
import { AppLoading, Asset } from 'expo'

export default class SelectNationScreen extends DBUtil {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      originNationList: this.getNationList(),
      nationList: [],
      searchValue: ''
    }
  }

  componentDidMount(){
    this.setState({
      nationList: this.state.originNationList
    })
  }

  _selectNation(param){
    const navigation = this.props.navigation
    navigation.getParam('setNation')(param)
    navigation.goBack()
  }

  search(value){
    this.setState({
      nationList: this.state.originNationList.filter((obj)=>{
        return String(obj.title||'').indexOf(value) != -1
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.searchInputContainer}>
          <TextInput 
            placeholder={'검색할 국가를 입력하세요.'}
            onChangeText={(value)=>{
              this.setState({searchValue: value})
              this.search(value)
            }}
            value={this.state.searchValue}
          />
        </View>
        <ScrollView style={styles.scrollView}>{
          (this.state.nationList || []).map((obj)=>{
            return (
              <TouchableWithoutFeedback key={obj.id} onPress={()=>this._selectNation(obj)}>
                <View style={styles.nationRow}>
                  <Image source={obj.requiredUri} style={{width: 30, height: 20, marginRight: 20}}></Image>
                  <Text style={styles.nationText}>{obj.title}</Text>
                  <View style={{flex:1}}>
                    <Text style={{textAlign: 'right'}}>UTC {obj.utc>0?'+':''}{obj.utc?obj.utc:''}</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          })
        }</ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({

  container: {
    flex:1,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 40,
  },
  
  searchInputContainer: {
    height: 50, 
    justifyContent: 'center',
    paddingLeft: 10, 
    paddingRight: 10,
    borderRadius: 20,
    // borderColor: "rgb(74, 190, 202)",
    borderColor: "rgb(158, 158, 158)",
    borderWidth: 3
  },

  scrollView: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  nationRow: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',

    borderBottomColor: 'rgb(158, 158, 158)',
    borderBottomWidth: 1,
  },
  nationText: {
    fontSize: 15,
    fontWeight: 'bold',
  }
  
})