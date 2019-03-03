import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
  View,
} from 'react-native';
import DayHeader from '../components/expenses/DayHeader'
import ExpenseSummary from '../components/expenses/ExpenseSummary'
import Util from '../components/Util'
import { Icon } from 'expo'
import DBUtil from '../components/database/DBUtil';

export default class ExpensesScreen extends DBUtil {
  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props)
    this.initTable()
    this.state = {
      sections: []
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      // The screen is focused
      // Call any action
      // this.setState({sections: []})
      this.listTnExpense([],
        (tx, res)=>{
          const list = res.rows._array || []
          const objByList = list.reduce((entry, obj)=>{
            entry[obj.yyyymmdd] = entry[obj.yyyymmdd] || []
            entry[obj.yyyymmdd].push(obj)
            return entry
          }, {})
          this.setState({
            sections: Array.from(Object.keys(objByList)).map((key)=>{
              return {yyyymmdd: key, data: objByList[key]}
            })
          })
        }
      )
    })
  }

  _onPressDay(yyyymmdd){
    console.log('_onPressDay', yyyymmdd)
    this.props.navigation.navigate('DayExpenses', {
      item: {yyyymmdd: yyyymmdd},
      sections: this.state.sections
    })
  }

  render() {
    return (
      <View style={styles.container}> 
        <SectionList 
          renderSectionHeader={({section: {yyyymmdd}}) => (
            <TouchableOpacity onPress={()=>this._onPressDay(yyyymmdd)}>
              <DayHeader item={{yyyymmdd: yyyymmdd}} navigation={this.props.navigation} />
            </TouchableOpacity>
          )}        
          renderItem={({ item, index, section }) => (
            <ExpenseSummary item={item} />
          )}
          sections={this.state.sections}
          // sections={[
          //   { date: Util.getDate(), data: ['item1', 'item2'] },
          //   { date: Util.getDate(1), data: ['item3', 'item4'] },
          //   { date: Util.getDate(2), data: ['item5', 'item6'] },
          //   { date: Util.getDate(3), data: ['item5', 'item6'] },
          //   { date: Util.getDate(4), data: ['item5', 'item6'] },
          //   { date: Util.getDate(5), data: ['item5', 'item6'] },
          // ]}
          keyExtractor={(item, index) => item + index}
        />
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
    this.props.navigation.navigate('AddExpenses')
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
  },
  plusIcon: {
    position: 'absolute',
    right: 20,
    bottom: 20
  }
})