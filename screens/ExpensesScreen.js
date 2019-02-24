import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DayHeader from '../components/expenses/DayHeader'
import ExpenseSummary from '../components/expenses/ExpenseSummary'
import Util from '../components/Util'

export default class ExpensesScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <View style={styles.container}> 
        <DayHeader />
        <ExpenseSummary />
        <ExpenseSummary />
        <DayHeader />
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