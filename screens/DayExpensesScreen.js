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
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      yyyymmdd: '',
      initialPage: 0,
      pageIndex: 0,
      sections: []
    }
  }

  componentDidMount(){
    const { navigation } = this.props
    const yyyymmdd = (navigation.getParam('item') || {}).yyyymmdd || Util.yyyymmdd(Util.getCurrentDate())
    const sections = navigation.getParam('sections') || []

    this.focusListener = navigation.addListener("didFocus", () => {
      let pageIndex = 0
      sections.map((obj, index)=>{
        if(obj.yyyymmdd === yyyymmdd) pageIndex = index
      })
      this.setState({ 
        yyyymmdd: yyyymmdd,
        initialPage: pageIndex,
        pageIndex: pageIndex,
        sections: sections
      })
    })
  }

  onPageSelected(event){
    if(!event || !event.nativeEvent) return
    const pageIndex = event.nativeEvent.position
    this.setState({
      pageIndex: pageIndex,
      yyyymmdd: this.state.sections[pageIndex].yyyymmdd
    })
  }

  render() {
    let { yyyymmdd } = this.state
    if(!yyyymmdd) return null
    const { pageIndex, sections } = this.state
    return (
      <View style={{flex:1}}>
        <View style={{marginTop: 30}}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
            <Icon.MaterialIcons size={40} name='arrow-back' color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.dayContainer}>
          <Text style={styles.dayStyle}>{Util.getDateForm(yyyymmdd)}</Text>
          <Text style={styles.weekStyle}>({Util.getDay(yyyymmdd)})</Text>
        </View>
        <View style={styles.totalExpensesContainer}>
          <Text style={styles.totalExpenseTitle}>총 사용 금액 : </Text>
          <Text style={styles.totalExpense}>{Util.comma(31000)} 원</Text>
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
                    return <ExpenseComponent key={sectionIndex} style={styles.smallContent}></ExpenseComponent>
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