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
  TextInput,
  View,
} from 'react-native';
import Util from '../components/Util'
import { Icon } from 'expo'

export default class AddExpensesScreen extends React.Component {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  goBack(){
    // this.props.navigation.navigate('Expenses')
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{marginTop: 30, marginBottom: 20}}>
          <TouchableOpacity onPress={()=>this.goBack()}>
            <Icon.MaterialIcons size={40} name='arrow-back' color="black" />
          </TouchableOpacity>
        </View>
        
        <ScrollView>
          <View style={styles.row}>
            <View style={[styles.column, {flex:1}]}>
              <Text style={styles.inputTitleStyle}>비용</Text>
              <TextInput style={styles.inputStyle}></TextInput>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:0.5}]}>
              <Text style={styles.inputTitleStyle}>날짜</Text>
              <TextInput style={styles.inputStyle}></TextInput>
            </View>
            <View style={[styles.column, {flex:0.5}]}>
              <Text style={styles.inputTitleStyle}>시간</Text>
              <TextInput style={styles.inputStyle}></TextInput>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:1}]}>
              <Text style={styles.inputTitleStyle}>내용</Text>
              <TextInput style={[styles.inputStyle, {height: 150}]}></TextInput>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:1}]}>
              <Text style={styles.inputTitleStyle}>장소</Text>
              <TextInput style={[styles.inputStyle, {height: 150}]}></TextInput>
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.column, {flex:1}]}>
              <Text style={styles.inputTitleStyle}>사진</Text>
              <TextInput style={[styles.inputStyle, {height: 150}]}></TextInput>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.buttonArea]}>
          <View style={[styles.buttonColumn]}>
            <TouchableOpacity onPress={()=>this.goBack()}>
              <Text style={styles.buttonStyle}>취소</Text>
            </TouchableOpacity>
          </View>
          <View style={[{width: 0.1, /* backgroundColor:'rgb(158, 158, 158)' */}]}></View>
          <View style={[styles.buttonColumn]}>
            <TouchableOpacity onPress={()=>alert(1)}>
              <Text style={[styles.buttonStyle, {color: "rgb(74, 190, 202)"}]}>저장</Text>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: 20
  },
  column: {
    marginLeft: 20,
    marginRight: 20
  },
  inputTitleStyle: {
    color: 'grey',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5
  },
  inputStyle: {
    height: 30,
    borderBottomWidth: 2,
    borderColor: 'grey',
  },

  // button
  buttonArea: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderTopColor: 'rgb(158, 158, 158)',
    borderTopWidth: 1,
  },
  buttonColumn: {
    marginTop: 20,
    marginBottom: 20
  },
  buttonStyle: {
    fontSize: 20,
    color: 'rgb(158, 158, 158)'
  },
  
  
  
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

  viewPager: {
    flex: 1
  },
  pageStyle: {
    alignItems: 'center',
    padding: 20,
  }

})