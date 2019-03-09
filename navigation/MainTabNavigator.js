import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'expo';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import ExpensesScreen from '../screens/ExpensesScreen';
import AddExpensesScreen from '../screens/AddExpensesScreen';
import UpdateMapScreen from '../screens/UpdateMapScreen';

import MapScreen from '../screens/MapScreen';
import InfoScreen from '../screens/InfoScreen';

// 임시
const AddExpensesStack = createStackNavigator({
  // AddExpenses: UpdateMapScreen
  AddExpenses: AddExpensesScreen
})

AddExpensesStack.navigationOptions = {
  tabBarLabel: 'AddExpenses',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const MapStack = createStackNavigator({
  Map: MapScreen,
}, {
  initialRouteName: "Map"
})

MapStack.navigationOptions = ({navigation}) => ({
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => (
    <Icon.Entypo focused={focused} 
     color={focused? 'blue': 'grey'}
     size={20} name='map' />
  )
})

const ExpensesStack = createStackNavigator({
  Expenses: ExpensesScreen,
  AddExpenses: AddExpensesScreen,
  UpdateMap: UpdateMapScreen
}, {
  initialRouteName: "Expenses"
})

ExpensesStack.navigationOptions = ({navigation}) => ({
  tabBarLabel: 'Expenses',
  tabBarIcon: ({ focused }) => (
    <Icon.FontAwesome focused={focused} 
     color={focused? 'blue': 'grey'}
     size={20} name='money' />
  ),
  tabBarVisible: navigation.state.index === 0
})

const InfoStack = createStackNavigator({
  Info: InfoScreen,
}, {
  initialRouteName: "Info"
})

InfoStack.navigationOptions = ({navigation}) => ({
  tabBarLabel: 'Info',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  )
})


// // // // // // // // // // // // // // 
// // // // // // // // // // // // // // 

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

export default createBottomTabNavigator({
  MapStack,
  ExpensesStack,
  InfoStack
})
