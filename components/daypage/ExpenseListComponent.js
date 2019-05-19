import React, { Component } from 'react'
import { 
  View, Text, Dimensions, StyleSheet, FlatList,
  ViewPagerAndroid, ScrollView, TouchableWithoutFeedback, TouchableOpacity
} from 'react-native'
import { Icon } from 'expo'
import ExpenseComponent from './ExpenseComponent'
import Util from '../Util'
import NoData from '../NoData'

class ExpenseListComponent extends Component {

  constructor(props){
    super(props)
    this.state = {
      expandAll: false,
      viewPagerKey: Date.now(),
      initialPage: 0,
      pageIndex: 0
    }
  }

  componentWillReceiveProps(nextProps){
    const sections = this.props.sections
    const nextSections = nextProps.sections
    if(sections && nextSections && 
      JSON.stringify(sections) != JSON.stringify(nextSections)
      ){
      const pageIndex = Math.min(Math.max(nextSections.length-1, 0), this.state.pageIndex)
      this.setState({
        pageIndex: pageIndex,
        viewPagerKey: Date.now()
      })
      this.props.onPageSelected(nextSections[pageIndex])
    }
  }

  onPageSelected(event){
    let pageIndex = 0
    if(typeof event === 'number') pageIndex = event
    else{
      if(!event || !event.nativeEvent) return
      pageIndex = event.nativeEvent.position
    }
    
    // setions 길이 체크
    const sections = this.props.sections || []
    if(sections.length <= pageIndex){
      pageIndex = sections.length-1
    }
    pageIndex = Math.max(0, pageIndex)

    this.flatlist && this.flatlist.scrollToIndex({
      animated: true, index: pageIndex, viewPosition: 1
    })
    this.setState({
      pageIndex: pageIndex,
      initialPage: pageIndex
    })
    this.props.onPageSelected(sections[pageIndex])
  }

  render() {
    const { search, showMap } = this.props
    const { viewPagerKey, pageIndex } = this.state
    const sections = Object.assign([], this.props.sections || [])
    if(!sections || !sections.length) return <View style={{flex:1}}><NoData /></View>
    return (
      <View style={[styles.container, showMap=='full'?{flex:0.1, minHeight: 50}:null]}>
        <View style={{flexDirection: 'row', paddingRight: 20}}>
          <View 
            // pointerEvents="none"
            style={[styles.dayContainer, {flex:1}]}>
            <FlatList horizontal={true}
              ref={(refs)=>this.flatlist=refs}
              data={sections}
              keyExtractor={(item, index)=>JSON.stringify(item)}
              renderItem={({item, index})=>(
                <View key={[JSON.stringify(item), index].join('_')} 
                  style={[styles.dayStyle]}>
                  <TouchableWithoutFeedback onPress={()=>{
                    this.onPageSelected(index)
                    this.viewPager.setPage(index)
                    }}>
                    <View>
                      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
                        <Text style={[pageIndex === index
                          ? {fontSize: 10, fontWeight: 'bold'}
                          : {fontSize: 7, color: 'rgb(190, 190, 190)', fontWeight: 'bold'},
                          {textAlign: 'center'}]}>{
                          `${Util.getDateForm(item.yyyymmdd)}`
                        }</Text>
                        <Text style={[pageIndex === index
                          ? {fontSize: 7, fontWeight: 'bold'}
                          : {fontSize: 4, color: 'rgb(190, 190, 190)', fontWeight: 'bold'},
                          {textAlign: 'center'}]}>{` (${Util.getDay(item.yyyymmdd)})`}</Text>
                      </View>
                      <Text style={pageIndex === index
                        ? {fontSize: 20, fontWeight: 'bold'}
                        : {fontSize: 13, color: 'rgb(190, 190, 190)', fontWeight: 'bold'}}>
                        Day {sections.length-index}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            />
          </View>
          {/* <View style={{justifyContent: 'flex-end', marginBottom: 30}}>
            <TouchableOpacity onPress={()=>this.setState({expandAll: !this.state.expandAll})}>
              <Icon.MaterialIcons name={this.state.expandAll? "expand-less": "expand-more"} size={30} color='rgb(190, 190, 190)' style={{marginBottom: -20}} />
              <Icon.MaterialIcons name={this.state.expandAll? "expand-less": "expand-more"} size={30} color='rgb(190, 190, 190)' style={{marginTop: -20}} />
            </TouchableOpacity>
          </View> */}
        </View>
        {
          !sections || !sections.length ? undefined :
          <ViewPagerAndroid 
            style={{flex:1}} 
            key={viewPagerKey}
            ref={(refs=>this.viewPager=refs)}
            initialPage={this.state.initialPage} 
            onPageSelected={(event)=>this.onPageSelected(event)}>{
            (sections || []).map((sectionObj, index)=>{
              return (
                <View key={[JSON.stringify(sectionObj), index].join('_')}>
                  <ScrollView>{
                    (sectionObj.data || []).map((obj, sectionIndex)=>{
                      if(showMap=='full') return undefined
                      return (
                        <ExpenseComponent 
                          key={[obj.expense_id, sectionIndex].join('_')} 
                          // style={styles.smallContent}
                          search={()=>search()}
                          item={obj}
                          onComponentSelected={(sectionData={})=>{
                            if(this.props.onComponentSelected){
                              this.props.onComponentSelected(sectionData)
                            }
                          }}
                          expandAll={this.state.expandAll && sections[pageIndex].yyyymmdd==obj.yyyymmdd}
                        ></ExpenseComponent>
                      )
                    })
                  }<View style={{height:50}}></View>
                  </ScrollView>
                </View>
              )
            })
          }</ViewPagerAndroid>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: '#2c3e50',
  },

  dayContainer: {
    marginLeft: 30, 
    marginRight: 5,
    marginTop: 20,
    marginBottom: 20,
    borderBottomColor: 'rgb(190, 190, 190)',
    borderBottomWidth: 2,
  },
  dayStyle: {
    marginRight: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 5
  },

})

export default ExpenseListComponent
