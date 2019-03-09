import React, { Component } from 'react'
import { SectionList, TouchableOpacity, ToastAndroid, Alert } from 'react-native'
import { withNavigation } from 'react-navigation';

import DayHeader from './DayHeader'
import ExpenseSummary from './ExpenseSummary'
import DBUtil from '../database/DBUtil'

class Expenses extends DBUtil {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _onPressEdit(item){
    this.props.navigation.navigate('AddExpenses', {
      item: item
    })
  }

  _onDelete(item){
    Alert.alert(
      '경고',
      '삭제하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', onPress: () => {
          this.deleteTnExpense(item, (tx, res)=>{
            ToastAndroid.showWithGravity(
              '삭제되었습니다.',
              ToastAndroid.SHORT,
              ToastAndroid.BOTTOM
            )
            this.props.search()
          })
        }},
      ],
      { cancelable: true }
    )    
  }

  render() {
    return (
      <SectionList 
          renderSectionHeader={({section: {yyyymmdd}}) => (
            <DayHeader item={{yyyymmdd: yyyymmdd}} navigation={this.props.navigation} />
          )}        
          renderItem={({ item, index, section }) => (
            <TouchableOpacity 
              delayLongPress={1500}  
              onLongPress={()=>this._onDelete(item)}
              onPress={()=>this._onPressEdit(item)} 
              >
              <ExpenseSummary item={item} />
            </TouchableOpacity>
          )}
          sections={this.props.sections}
          keyExtractor={(item, index) => item + index}
        />
    )
  }
}

export default withNavigation(Expenses)