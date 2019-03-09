import React, { Component } from 'react'
import { SectionList, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation';

import DayHeader from './DayHeader'
import ExpenseSummary from './ExpenseSummary'

class Expenses extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  _onPressEdit(item){
    this.props.navigation.navigate('AddExpenses', {
      item: item
    })
  }

  render() {
    return (
      <SectionList 
          renderSectionHeader={({section: {yyyymmdd}}) => (
            <DayHeader item={{yyyymmdd: yyyymmdd}} navigation={this.props.navigation} />
          )}        
          renderItem={({ item, index, section }) => (
            <TouchableOpacity onPress={()=>this._onPressEdit(item)}>
              <ExpenseSummary item={item} />
            </TouchableOpacity>
          )}
          sections={this.props.sections}
          keyExtractor={(item, index) => item + index}
        />
    )
  }
}

export default withNavigation(Expenses)