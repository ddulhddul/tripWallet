import React, { Component } from 'react'
import { View, TouchableOpacity, Text, ViewPagerAndroid, ScrollView, StyleSheet } from 'react-native'
import Util from '../Util'
import { Icon } from 'expo'
import ExpenseComponent from './ExpenseComponent'

export default class DayPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialPage: 0,
      pageIndex: 0
    }
  }

  onPageSelected(event){
    if(!event || !event.nativeEvent) return
    const pageIndex = event.nativeEvent.position
    this.setState({
      pageIndex: pageIndex
    })
  }

  render() {
    const { pageIndex } = this.state
    const { sections } = this.props
    const yyyymmdd = (sections[pageIndex] || {}).yyyymmdd
    const sumAmount = (sections[pageIndex] || {}).sumAmount
    return (
      <View style={{flex:1, marginTop: 20}}>
        <View style={styles.dayContainer}>
          <Text style={styles.dayStyle}>{Util.getDateForm(yyyymmdd)}</Text>
          <Text style={styles.weekStyle}>({Util.getDay(yyyymmdd)})</Text>
        </View>
        <View style={styles.totalExpensesContainer}>
          <Text style={styles.totalExpenseTitle}>총 사용 금액 : </Text>
          <Text style={styles.totalExpense}>{Util.comma(sumAmount)} 원</Text>
        </View>
        <View>
          <View style={styles.pagingContainer}>
          {
            (sections || []).map((obj, index)=>{
              return (
                <View 
                  style={[
                    styles.circle, 
                    {justifyContent: 'center', alignItems: 'center'},
                    index===pageIndex? {backgroundColor: 'rgb(52, 152, 219)', opacity: 1} : {},
                    ((index < Math.max(0, Math.floor(index/10)*10)) || (index > Math.max(0, Math.floor(index/10)*10)+9)) 
                      ? {display: 'none'}: {}
                  ]} 
                  key={index}>
                </View>
              )
            })
          }
          </View>
        </View>
        
        <ViewPagerAndroid style={{flex:1}} initialPage={this.state.initialPage} onPageSelected={(event)=>this.onPageSelected(event)}>
        {
          (sections || []).map((sectionObj, index)=>{
            return (
              <View key={index}>
                <ScrollView style={{width: '100%'}}>{
                  (sectionObj.data || []).map((obj, sectionIndex)=>{
                    return (
                      <ExpenseComponent 
                        key={sectionIndex} 
                        style={styles.smallContent}
                        search={()=>this.props.search()}
                        item={obj}
                      ></ExpenseComponent>
                    )
                  })
                }</ScrollView>
              </View>
            )
          })
        }
        </ViewPagerAndroid>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
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


  // smallContent: {
  //   width: '90%',
  //   padding: 15,
  //   elevation: 5,
  //   backgroundColor: 'white',

  //   flexDirection: 'row'
  // },

  viewPager: {
    flex: 1
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  }

})