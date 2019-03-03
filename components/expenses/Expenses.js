import React, { Component } from 'react'
import { SectionList, TouchableOpacity } from 'react-native'

import DayHeader from './DayHeader'
import ExpenseSummary from './ExpenseSummary'

export default class Expenses extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _onPressDay(yyyymmdd){
    console.log('_onPressDay', yyyymmdd)
    this.props.navigation.navigate('DayExpenses', {
      // item: {yyyymmdd: yyyymmdd},
      sections: this.state.sections
    })
  }

  render() {
    return (
      <SectionList 
          renderSectionHeader={({section: {yyyymmdd}}) => (
            <TouchableOpacity onPress={()=>this._onPressDay(yyyymmdd)}>
              <DayHeader item={{yyyymmdd: yyyymmdd}} navigation={this.props.navigation} />
            </TouchableOpacity>
          )}        
          renderItem={({ item, index, section }) => (
            <ExpenseSummary item={item} />
          )}
          sections={this.props.sections}
          keyExtractor={(item, index) => item + index}
        />
    )
  }
}
