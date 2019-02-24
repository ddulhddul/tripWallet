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

export default class ExpensesScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  constructor(props){
    super(props)
  }

  render() {
    return (
      <View style={styles.container}> 
        <SectionList 
          renderSectionHeader={({section: {date}}) => (
            <DayHeader item={{date: date}} navigation={this.props.navigation} />
          )}        
          renderItem={({ item, index, section }) => (
            <ExpenseSummary />
          )}
          sections={[
            { date: Util.getDate(), data: ['item1', 'item2'] },
            { date: Util.getDate(1), data: ['item3', 'item4'] },
            { date: Util.getDate(2), data: ['item5', 'item6'] },
            { date: Util.getDate(3), data: ['item5', 'item6'] },
            { date: Util.getDate(4), data: ['item5', 'item6'] },
            { date: Util.getDate(5), data: ['item5', 'item6'] },
          ]}
          keyExtractor={(item, index) => item + index}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
  },
})