import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
  Button,
  ViewPagerAndroid,
  View,
} from 'react-native';
import Util from '../components/Util'
import { Icon } from 'expo'
import ExpenseComponent from '../components/expenses/ExpenseComponent'

export default class DayExpensesScreen extends React.Component {
  
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerTitle: null,
  //   }
  // }
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      date: null,
      pageIndex: 0,
      dateList: Array.from(Array(10))
    }
  }

  componentDidMount(){
    const { navigation } = this.props
    const date = navigation.getParam('date')
    this.setState({ date: date })
  }

  onPageSelected(event){
    if(!event || !event.nativeEvent) return
    this.setState({
      pageIndex: event.nativeEvent.position
    })
  }

  render() {
    let { date } = this.state
    if(!date) date = new Date()
    const { pageIndex, dateList } = this.state
    return (
      <View style={{flex:1}}>
        <View style={{marginTop: 30}}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
            <Icon.MaterialIcons size={40} name='arrow-back' color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.dayContainer}>
          <Text style={styles.dayStyle}>{Util.getDateForm(date)}</Text>
          <Text style={styles.weekStyle}>({Util.getDay(date)})</Text>
        </View>
        <View style={styles.totalExpensesContainer}>
          <Text style={styles.totalExpenseTitle}>총 사용 금액 : </Text>
          <Text style={styles.totalExpense}>{Util.comma(31000)} 원</Text>
        </View>
        <View>
          <View style={styles.pagingContainer}>
          {
            dateList.map((obj,index)=>{
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
                  {/* <Text style={[
                    index!==number? {display: 'none'}: null,
                    {color: 'white', fontSize: 5}
                    ]}>
                    { number.toString() }
                  </Text> */}
                </View>
              )
            })
          }
          </View>
        </View>
        
        <ViewPagerAndroid style={{flex:1}} initialPage={0} onPageSelected={(event)=>this.onPageSelected(event)}>
        {
          dateList.map((obj, index)=>{
            return (
              <View key={index}>
                <ScrollView style={{width: '100%'}}>
                  <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
                  <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
                  <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
                  <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
                </ScrollView>
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