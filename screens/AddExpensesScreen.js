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
  Dimensions
} from 'react-native';
import Util from '../components/Util'
import { Icon, Constants, MapView, Location, Permissions } from 'expo'
import UpdateMapScreen from './UpdateMapScreen'

export default class AddExpensesScreen extends React.Component extends UpdateMapScreen {
  
  static navigationOptions = {
    header: null,
  }
  
  constructor(props) {
    super(props)
    this.state = {
      locationText: '',
      location: {coords: { latitude: 37.78825, longitude: -122.4324}},
    }
  }

  componentDidMount() {
    this._getLocationAsync();
  }

  render() {
    return (
      <View style={{flex:1}}>
        <View style={{marginTop: 30, marginBottom: 20}}>
          <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
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
              <TouchableOpacity onPress={()=>this.props.navigation.navigate('UpdateMap', {
                setMarkerByLocation: this.setMarkerByLocation,
                location: {
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                  ...this.state.location.coords
                }
              })}>
                <Text style={styles.inputTitleStyle}>장소</Text>
                <View style={{marginBottom: 10}}>
                  <Text style={this.state.locationText? {fontSize:12, color: 'rgb(231, 76, 60)'}: {display: 'none'}}>
                    <Icon.MaterialIcons size={12} name='location-on' color="rgb(231, 76, 60)" />
                    {this.state.locationText}
                  </Text>
                </View>
              </TouchableOpacity>
              <MapView 
                style={{ alignSelf: 'stretch', height: Dimensions.get('window').width * 0.7 }}
                region={{ 
                  latitude: !this.state.location? null: this.state.location.coords.latitude, 
                  longitude: !this.state.location? null: this.state.location.coords.longitude, 
                  // latitudeDelta: 0.0922, 
                  // longitudeDelta: 0.0421
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005
                }}
                // onRegionChange={this._handleMapRegionChange}
                >
                <MapView.Marker
                  coordinate={!this.state.location ? null : this.state.location.coords}
                  // title="My Marker"
                  // description="Some description"
                />
              </MapView>
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
            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
              <Text style={styles.buttonStyle}>취소</Text>
            </TouchableOpacity>
          </View>
          <View style={[{width: 0.1}]}></View>
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