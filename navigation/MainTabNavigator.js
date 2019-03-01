import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import ExpensesScreen from '../screens/ExpensesScreen';
import DayExpensesScreen from '../screens/DayExpensesScreen';
import AddExpensesScreen from '../screens/AddExpensesScreen';
import UpdateMapScreen from '../screens/UpdateMapScreen';

// 임시
const AddExpensesStack = createStackNavigator({
  AddExpenses: UpdateMapScreen
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

// 임시
const DayExpensesStack = createStackNavigator({
  DayExpenses: DayExpensesScreen
})

DayExpensesStack.navigationOptions = {
  tabBarLabel: 'DayExpenses',
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


const ExpensesStack = createStackNavigator({
  Expenses: ExpensesScreen,
  DayExpenses: DayExpensesScreen,
  AddExpenses: AddExpensesScreen,
  UpdateMap: UpdateMapScreen
}, {
  initialRouteName: "Expenses"
})

ExpensesStack.navigationOptions = ({navigation}) => ({
  tabBarLabel: 'Expenses',
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
  tabBarVisible: navigation.state.index === 0
})


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
  // AddExpensesStack,
  ExpensesStack,
  DayExpensesStack,
  HomeStack,
  LinksStack,
  SettingsStack,
})
