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
import Util from '../components/Util'
import { connect } from 'react-redux'

class ExpensesScreen extends DBUtil {
  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props)
    this.initTable()
    this.state = {
      nation_title: '',
      city_name: '',
      fromYyyymmdd: '',
      toYyyymmdd: '',
      pageIndex: 0,
      sections: [],
      trip_id: this.props.trip_id
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      // this.setState({sections: []})
      this.search()
    })
  }

  search(){
    this.listTnTrip(this.state, 
      (tx, res)=>{
        const list = res.rows._array || []
        const tripObj = list.find((obj)=>obj.trip_id===this.state.trip_id)||{}
        console.log('tripObj',tripObj)
        this.setState({
          nation_title: tripObj.nation_title,
          city_name: tripObj.city_name,
        })
      }
    )
    this.listTnExpense(this.state,
      (tx, res)=>{
        const list = res.rows._array || []
        let fromYyyymmdd = 99999999, toYyyymmdd = 0
        const objByList = list.reduce((entry, obj)=>{
          entry[obj.yyyymmdd] = entry[obj.yyyymmdd] || []
          entry[obj.yyyymmdd].push(obj)
          fromYyyymmdd = Math.min(fromYyyymmdd, obj.yyyymmdd)
          toYyyymmdd = Math.max(toYyyymmdd, obj.yyyymmdd)
          return entry
        }, {})
        this.setState({
          fromYyyymmdd: String(fromYyyymmdd||''),
          toYyyymmdd: String(toYyyymmdd||''),
          sections: Array.from(Object.keys(objByList)).map((key)=>{
            return {
              yyyymmdd: key, 
              sumAmount: objByList[key].reduce((entry, obj)=>{
                return entry + Number(obj.amount || 0)
              }, 0),
              data: objByList[key],
            }
          })
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
        <View style={{flexDirection: 'row', alignItems: 'center', borderBottomColor: 'rgb(158, 158, 158)', borderBottomWidth: 1}}>
          <View style={{flex:1, marginLeft: 10}}>
            <Text style={{fontSize: 25, fontWeight: 'bold'}}>{ this.state.nation_title }</Text>
            {
              !this.state.toYyyymmdd ? null :
              <Text style={{fontSize: 12}}>
                {Util.getDateForm(this.state.fromYyyymmdd)} ~ {Util.getDateForm(this.state.toYyyymmdd)}
              </Text>
            }
            <Text style={{fontSize: 15}}>{ this.state.city_name }</Text>
          </View>
          <TouchableOpacity onPress={()=>this.showTypeChange(0)} style={{marginRight: 10}}>
            <Icon.AntDesign name="profile" size={30} color={this.state.pageIndex===0?'blue':null} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.showTypeChange(1)} style={{marginRight: 10}}>
            <Icon.AntDesign name="switcher" size={30} color={this.state.pageIndex===1?'blue':null} />
          </TouchableOpacity>
        </View>

        <ViewPagerAndroid 
          ref={(ref)=>this.viewPager=ref}
          style={{flex:1}} initialPage={this.state.pageIndex} onPageSelected={(event)=>this.onPageSelected(event)}>
          <View key={0}>
            <Expenses
              sections={this.state.sections}
              search={()=>this.search()}
            />
          </View>
          <View key={1}>
            <DayPage
              sections={this.state.sections}
              search={()=>this.search()}
            />
          </View>
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
    trip_id: state.tripReducer.trip_id
  }
}

export default connect(select)(ExpensesScreen)