import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  SectionList,
  Button,
  View,
} from 'react-native';
import Util from '../components/Util'
import { Ionicons } from '@expo/vector-icons';

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
    const { date } = this.state
    return (
      <View style={styles.container}> 
        <TouchableOpacity onPress={()=>this.props.navigation.popToTop()}>
          <Text>{date && Util.yyyymmdd(date)} asdasd</Text>
        </TouchableOpacity>
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