import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewPagerAndroid,
  View
} from 'react-native';
import Expenses from '../components/expenses/Expenses'
import DayPage from '../components/daypage/DayPage'
import { Icon } from 'expo'
import DBUtil from '../components/database/DBUtil'
import Loading from '../components/Loading'
import NoData from '../components/NoData'
import Util from '../components/Util'
import { connect } from 'react-redux'
import ExpenseHeader from '../components/ExpenseHeader'

class ExpensesScreen extends DBUtil {
  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props)
    this.initTable()
    this.state = {
      isReady: false,
      pageIndex: 0,
      sections: [],
      trip_id: '',
      showTotal: true
    }
  }

  componentWillUnmount(){
    this.focusListener && this.focusListener.remove()
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      this.setState({trip_id: this.props.trip_id})
      this.search()
    })
  }

  search(){
    this.setState({isReady: false})
    this.listTnExpense({trip_id: this.props.trip_id},
      (tx, res)=>{
        const list = res.rows._array || []
        const objByList = list.reduce((entry, obj)=>{
          entry[obj.yyyymmdd] = entry[obj.yyyymmdd] || []
          entry[obj.yyyymmdd].push(obj)
          return entry
        }, {})
        
        const sections = Array.from(Object.keys(objByList)).map((key)=>{
          return {
            yyyymmdd: key, 
            sumAmount: objByList[key].reduce((entry, obj)=>{
              return entry + Number(obj.amount || 0)
            }, 0),
            data: objByList[key],
          }
        }).reverse()

        this.setState({
          isReady: true,
          sections: sections,
          totalExpense: sections.reduce((entry, obj)=>{
            return entry + obj.sumAmount
          }, 0)
        })
      }
    )
  }

  onPageSelected(event){
    if(!event || !event.nativeEvent) return
    const pageIndex = event.nativeEvent.position
    this.setState({
      pageIndex: pageIndex
    })
  }

  showTypeChange(pageIndex){
    this.viewPager.setPage(pageIndex)
    this.setState({
      pageIndex: pageIndex
    })
  }

  render() {
    return (
      <View style={styles.container}> 
        
        <ExpenseHeader 
          trip_id={this.props.trip_id}
          sections={this.state.sections}
          pageIndex={this.state.pageIndex}
          showTypeChange={(pageIndex)=>this.showTypeChange(pageIndex)}
          />

        {
          // (!this.state.totalExpense || !this.state.showTotal)? null:
          <View style={{flexDirection: 'row', justifyContent: 'center', height: 50, alignItems: 'center', 
            // borderBottomColor: 'rgb(158, 158, 158)', borderBottomWidth: 1
            }}>
            <View style={styles.totalExpensesContainer}>
              <Text style={styles.totalExpenseTitle}>총 사용 금액 : </Text>
              <Text style={styles.totalExpense}>{Util.comma(this.state.totalExpense) || 0} {this.props.amount_unit}</Text>
            </View>
          </View>
        }

        {(!this.state.isReady)? <Loading />:null}

        <ViewPagerAndroid 
          ref={(ref)=>this.viewPager=ref}
          style={{flex:1}} initialPage={this.state.pageIndex} onPageSelected={(event)=>this.onPageSelected(event)}>
          <View key={0}>
            {(!this.state.sections || !this.state.sections.length)? <View style={{flex:1}}><NoData /></View>:
              <Expenses
                updateShowTotal={(value)=>this.setState({showTotal: value})}
                sections={this.state.sections}
                search={()=>this.search()}
              />
            }
          </View>
          {(!this.state.sections || !this.state.sections.length)? null:
            <View key={1}>
              <DayPage
                sections={this.state.sections}
                search={()=>this.search()}
              />
            </View>
          }
        </ViewPagerAndroid>
        <TouchableOpacity style={styles.plusIcon} onPress={(event)=>this._pressAdd(event)}>
          <Icon.AntDesign 
            name="pluscircle" 
            size={45}
            color="rgb(74, 190, 202)"
            />
        </TouchableOpacity>
      </View>
    );
  }

  _pressAdd(event){
    event.stopPropagation()
    this.props.navigation.navigate('AddExpenses', {
      trip_id: this.state.trip_id
    })
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
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

  plusIcon: {
    backgroundColor: 'white',
    borderRadius: 50,
    position: 'absolute',
    right: 20,
    bottom: 20
  }
})

function select(state) {
  return {
    trip_id: state.tripReducer.trip_id,
    amount_unit: state.tripReducer.amount_unit,
  }
}

export default connect(select)(ExpensesScreen)