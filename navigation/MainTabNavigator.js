import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import { Icon } from 'expo';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';

import TripScreen from '../screens/TripScreen';
import NationScreen from '../screens/NationScreen';
import SelectNationScreen from '../screens/SelectNationScreen';

import ExpensesScreen from '../screens/ExpensesScreen';
import AddExpensesScreen from '../screens/AddExpensesScreen';
import UpdateMapScreen from '../screens/UpdateMapScreen';

import MapScreen from '../screens/MapScreen';
import InfoScreen from '../screens/InfoScreen';

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

// // // // // // // // // // // // // // 
// // // // // // // // // // // // // // 

export default createStackNavigator({

  TripStack: createStackNavigator({
    Trip: TripScreen,
    Nation: NationScreen,
    SelectNation: SelectNationScreen
  }, {
    navigationOptions: ({navigation}) => ({
      header: null
    })
  }),

  AddExpensesStack: createStackNavigator({
    AddExpenses: AddExpensesScreen,
    UpdateMap: UpdateMapScreen
  }, {
    navigationOptions: ({navigation}) => ({
      header: null
    })
  }),
  
  mainTabStack: createBottomTabNavigator({
    ExpensesStack: createStackNavigator({
      Expenses: ExpensesScreen
    }, {
      navigationOptions: ({navigation}) => ({
        tabBarLabel: 'Expenses',
        tabBarIcon: ({ focused }) => (
          <Icon.FontAwesome focused={focused} 
          color={focused? 'blue': 'grey'}
          size={20} name='money' />
        ),
      })
    }),
    MapStack: createStackNavigator({
      Map: MapScreen,
    }, {
      navigationOptions: ({navigation}) => ({
        tabBarLabel: 'Map',
        tabBarIcon: ({ focused }) => (
          <Icon.Entypo focused={focused} 
          color={focused? 'blue': 'grey'}
          size={20} name='map' />
        )
      })
    }),
  }, {
    initialRouteName: "ExpensesStack",
    navigationOptions: ({navigation}) => ({
      header: null,
    })
  })
})