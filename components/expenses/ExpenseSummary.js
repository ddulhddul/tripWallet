import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Util from '../Util'

export default class ExpenseSummary extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.timeContainer}>
          <Text style={[styles.detailFontStyle, {marginRight:5}]}>{Util.getTimeForm(new Date())}</Text>
          <Text style={styles.detailFontStyle}>{Util.getNoon(new Date())}</Text>
        </View>
        <View style={styles.totalExpenseContainer}>
          <Text style={styles.expenseStyle}>{Util.comma(2000)}</Text>
        </View>
        <View style={styles.detailContainer}>
          <Text style={styles.detailFontStyle}>
            어쩌구 저쩌구 ... 어쩌구 저쩌구 ... 
            어쩌구 저쩌구 ... 어쩌구 저쩌구 ... 
            어쩌구 저쩌구 ... 어쩌구 저쩌구 ... 
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 0.1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    justifyContent: 'center',
    // alignItems: 'center',
    minHeight: 70,
    marginLeft: 40,
    marginRight: 20,
  },
  
  // Time 부분
  timeContainer: {
    width: 80,
    flexDirection: 'row',
    justifyContent: 'center',
  },

  // 금액 부분
  totalExpenseContainer: {
    minWidth: 80,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15
  },
  expenseStyle: {
    fontWeight: 'bold'
  },

  // 상세 내용 부분
  detailContainer: {
    width: '60%',
    flexDirection: 'row',
  },
  detailFontStyle: {
    color: 'grey',
    fontSize: 10
  }
})