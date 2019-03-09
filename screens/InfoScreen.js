import React, { Component } from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default class InfoScreen extends Component {
  
  static navigationOptions = {
    title: '정보',
  }

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    return (
        <View style={styles.table}>
          <View style={styles.row}>
            <View style={styles.th}>
              <Text style={styles.thText}>앱 정보</Text>
            </View>
            <View style={styles.td}>
              <Text style={styles.tdText}>여행 가계부</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.th}>
              <Text style={styles.thText}>개발자</Text>
            </View>
            <View style={styles.td}>
              <Text style={styles.tdText}>ddulh</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.th}>
              <Text style={styles.thText}>문의사항</Text>
            </View>
            <View style={styles.td}>
              <Text style={styles.tdText}>ddulhddul@gmail.com</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.th}>
              <Text style={styles.thText}>Github</Text>
            </View>
            <View style={styles.td}>
              <Text style={styles.tdText}>github.com/ddulhddul</Text>
            </View>
          </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  table: {
    // flex: 1,
    flexDirection: 'column',
  },
  row: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  th: {
    flex: 0.3,
    alignItems: 'center',
  },
  thText: {
    fontSize: 15,
    color: 'rgb(190, 190, 190)'
  },
  tdText: {
    fontSize: 15,
  },
  td: {
    flex: 0.7,
  }
})