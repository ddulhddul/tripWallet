import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Util from '../Util'

export default class DayHeader extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _onPressDay(date){
    // this.props.navigateToDayExpenses()
    this.props.navigation.navigate('DayExpenses', {
      date: date
    })
  }

  render() {
    const {date} = this.props.item
    return (
      // <TouchableOpacity style={styles.container} onPress={()=>this._onPressDay(date)}>
      <TouchableOpacity style={styles.container} onPress={()=>this._onPressDay(date)}>
        <View style={styles.dayContainer}>
          <Text style={styles.dayStyle}>{Util.getDateForm(date)}</Text>
          <Text style={styles.weekStyle}>({Util.getDay(date)})</Text>
        </View>
        <View style={styles.totalExpenseContainer}>
          <Text style={styles.expenseTitleStyle}>금액</Text>
          <Text style={styles.expenseStyle}>{Util.comma(2000)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 0.1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    marginLeft: 20,
    marginRight: 20,
  },
  
  // Day 부분
  dayContainer: {
    flex: 0.7,
    flexDirection: 'row',
  },
  dayStyle: {
    marginRight: 5,
    fontSize: 25,
    fontWeight: 'bold',
  },
  weekStyle: {
    alignSelf: 'flex-end',
    fontSize: 15,
  },
  

  // 금액 부분
  totalExpenseContainer: {
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  expenseTitleStyle: {
    marginRight: 5,
    color: 'grey'
  },
  expenseStyle: {
    fontWeight: 'bold'
  },
})