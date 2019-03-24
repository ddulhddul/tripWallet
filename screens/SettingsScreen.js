import React from 'react';
// import { ExpoConfigView } from '@expo/samples';
import { Button, StyleSheet, ScrollView, View, Text, Alert } from 'react-native'
import DBUtil from '../components/database/DBUtil'
import Util from '../components/Util'

export default class SettingsScreen extends DBUtil {

  static navigationOptions = {
    header: null
  }

  constructor(props){
    super(props)
    this.state = {}
  }

  initThisTable(){
    Alert.alert(
      '경고',
      '모든 데이터를 삭제하시겠습니까?\n삭제된 데이터는 복구할 수 없습니다.',
      [
        {text: '취소', style: 'cancel'},
        {text: '삭제', onPress: () => {
          this.initNationTable(true)
          this.initTable(true)
          Util.toast('초기화 되었습니다.')
        }},
      ],
      { cancelable: true }
    )    
  }

  dropTable(){
    Alert.alert(
      '경고',
      '테이블을 Drop 하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: 'Drop', onPress: () => {
          this.initNationTable(true)
          this.initTable(true)
          Util.toast('Drop 되었습니다.')
        }},
      ],
      { cancelable: true }
    )    
  }

  addColumn(){
    Alert.alert(
      '경고',
      '테이블 컬럼을 수정 하시겠습니까?',
      [
        {text: '취소', style: 'cancel'},
        {text: '수정', onPress: () => {
          try {
            this.queryExecute('ALTER TABLE TN_EXPENSE ADD COLUMN locationText VARCHAR(1000)')
            this.queryExecute('ALTER TABLE TN_TRIP ADD COLUMN amount_unit VARCHAR(30)')
            Util.toast('수정 완료')
          } catch (error) {
            // Util.toast('오류:'+JSON.stringify(error))
          }
        }},
      ],
      { cancelable: true }
    )    
  }

  render() {
    return <View>
      <ScrollView>
        <View style={styles.sectionTitleView}>
          <Text style={styles.sectionTitleText}>정보</Text>
        </View>
        <View style={styles.sectionView}>
          <Text style={styles.sectionText}>개발자</Text>
          <Text style={styles.sectionText}>ddulh</Text>
        </View>
        <View style={styles.sectionView}>
          <Text style={styles.sectionText}>E-mail</Text>
          <Text style={styles.sectionText}>ddulhddul@gmail.com</Text>
        </View>
        <View style={styles.sectionView}>
          <Text style={styles.sectionText}>Github</Text>
          <Text style={styles.sectionText}>github.com/ddulhddul</Text>
        </View>

        <View style={styles.sectionTitleView}>
          <Text style={styles.sectionTitleText}>데이터</Text>
        </View>
        <View style={styles.sectionView}>
          <Text style={styles.sectionText}>데이터 초기화</Text>
          <Button
            onPress={()=>this.initThisTable()}
            title="초기화"
            style={{fontSize: 10}}
          />
        </View>
        <View style={styles.sectionView}>
          <Text style={styles.sectionText}>Drop Table</Text>
          <Button
            onPress={()=>this.dropTable()}
            title="초기화"
            style={{fontSize: 10}}
          />
        </View>
        <View style={styles.sectionView}>
          <Text style={styles.sectionText}>테이블 컬럼 추가</Text>
          <Button
            onPress={()=>this.addColumn()}
            title="추가"
            style={{fontSize: 10}}
          />
        </View>

      </ScrollView>
    </View>
  }
}

const styles = StyleSheet.create({
  sectionTitleView: {
    flex: 1,
    margin: 15
  },
  sectionTitleText: {
    fontSize: 30,
    fontWeight: 'bold'
  },

  sectionText: {
    fontSize: 17
  },
  sectionView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 10,
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 5,
    // borderBottomWidth: 1,
    // borderColor: 'grey'
    borderColor: 'rgb(158, 158, 158)'
  }
})