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
import ExpenseComponent from '../components/expenses/ExpenseComponent'

export default class DayExpensesScreen extends React.Component {
  
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <View />,
    }
  }
  
  constructor(props) {
    super(props)
    this.state = {
      date: null,
      index: 0
    }
  }

  componentDidMount(){
    const { navigation } = this.props
    const date = navigation.getParam('date')
    this.setState({ date: date })
  }

  _onPressBack= ()=>{
    this.props.navigation.goBack()
  }

  onPageSelected(event){
    if(!event || !event.nativeEvent) return
    this.setState({
      index: event.nativeEvent.position
    })
  }

  render() {
    let { date } = this.state
    if(!date) date = new Date()
    const { index } = this.state
    return (
      <View style={{flex:1}}>
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
            <View style={[styles.circle]} />
            <View style={[styles.circle]} />
            <View style={[styles.circle, index===0? {backgroundColor: 'rgb(52, 152, 219)', opacity: 1} : {}]} />
            <View style={[styles.circle, index===1? {backgroundColor: 'rgb(52, 152, 219)', opacity: 1} : {}]} />
            <View style={[styles.circle]} />
          </View>
        </View>
        
        <ViewPagerAndroid style={{flex:1}} initialPage={0} onPageSelected={(event)=>this.onPageSelected(event)}>
          <View key="1">
            <ScrollView style={{width: '100%'}}>
              <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
              <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
              <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
              <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
            </ScrollView>
          </View>
          <View key="2">
            <ScrollView style={{width: '100%'}}>
              <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
              <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
            </ScrollView>
          </View>
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
    width: 150,
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