import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Util from '../Util'
import ExpenseListComponent from './ExpenseListComponent'

export default class DayPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      thisSection: {}
    }
  }

  render() {
    const { thisSection } = this.state
    const { sections } = this.props
    const yyyymmdd = (thisSection || {}).yyyymmdd
    const sumAmount = (thisSection || {}).sumAmount
    return (
      <View style={{flex:1}}>
        {
          !yyyymmdd? null:
          <View style={styles.dayContainer}>
            <Text style={styles.dayStyle}>{Util.getDateForm(yyyymmdd)}</Text>
            <Text style={styles.weekStyle}>({Util.getDay(yyyymmdd)})</Text>
          </View>
        }
        <View style={styles.totalExpensesContainer}>
          <Text style={styles.totalExpenseTitle}>사용 금액 : </Text>
          <Text style={styles.totalExpense}>{Util.comma(sumAmount) || 0} 원</Text>
        </View>
        
        <ExpenseListComponent 
            search={()=>this.props.search()}
            onPageSelected={(thisSection={})=>this.setState({thisSection: thisSection})}
            sections={sections}
            />

      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Day 부분
  dayContainer: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  dayStyle: {
    marginRight: 5,
    fontSize: 30,
    fontWeight: 'bold',
  },
  weekStyle: {
    alignSelf: 'flex-end',
    fontSize: 20,
    marginBottom: 5
  },

  // 총 사용금액
  totalExpensesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  totalExpenseTitle: {
    color: 'grey',
  },
  totalExpense: {
    fontWeight: 'bold'
  },

  // middle Paging
  pagingContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    width: 200,
    justifyContent: 'space-evenly',
    marginTop: 15,
    marginBottom: 20
  },
  circle: {
    width:15,
    height:15,
    borderRadius:50,
    opacity: 0.3,
    backgroundColor: 'grey'
  },

})