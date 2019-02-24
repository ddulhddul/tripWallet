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
      date: null
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

  render() {
    // const { date } = this.state
    const { date } = { date: new Date() }
    return (
      <View style={styles.container}> 
        <View style={styles.dayContainer}>
          <Text style={styles.dayStyle}>{Util.getDateForm(date)}</Text>
          <Text style={styles.weekStyle}>({Util.getDay(date)})</Text>
        </View>
        <View style={styles.totalExpensesContainer}>
          <Text style={styles.totalExpenseTitle}>총 사용 금액 : </Text>
          <Text style={styles.totalExpense}>{Util.comma(30000)} 원</Text>
        </View>
        <View style={styles.pagingContainer}>
          <View style={[styles.circle]} />
          <View style={[styles.circle]} />
          <View style={[styles.circle, {backgroundColor: 'rgb(52, 152, 219)', opacity: 1}]} />
          <View style={[styles.circle]} />
          <View style={[styles.circle]} />
        </View>

        <FlatList
          style={{width: '100%'}}
          data={[{key: 'a'}, {key: 'b'}, {key: 'c'}, {key: 'd'}]}
          renderItem={({item, index}) => (
            <ExpenseComponent style={styles.smallContent}></ExpenseComponent>
          )}
        />
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
  },

  // Day 부분
  dayContainer: {
    flexDirection: 'row',
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

})