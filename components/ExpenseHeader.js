import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'
import { Icon } from 'expo'
import Util from './Util'
import DBUtil from '../components/database/DBUtil'

class ExpenseHeader extends DBUtil {

    constructor(props){
        super(props)
        this.state = {
            tripObj: {}
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
        this.focusListener = navigation.addListener("didFocus", () => {
            this.search()
        })
    }
    
    search(){
        this.listTnTrip({trip_id: this.props.trip_id}, 
            (tx, res)=>{
                const list = res.rows._array || []
                const tripObj = list.find((obj)=>obj.trip_id===this.props.trip_id)||{}
                this.setState({
                    tripObj: tripObj
                })
            }
        )
    }

    render() {
        const { sections, isMapView, pageIndex, showTypeChange } = this.props
        const { tripObj } = this.state
        let yyyymmddObj = (sections || []).reduce((entry, obj)=>{
            entry.fromYyyymmdd = Math.min(entry.fromYyyymmdd, obj.yyyymmdd)
            entry.toYyyymmdd = Math.max(entry.toYyyymmdd, obj.yyyymmdd)
            return entry
        }, {fromYyyymmdd: 99999999, toYyyymmdd: 0})

        return (
            <View style={{flexDirection: 'row', alignItems: 'center', borderBottomColor: 'rgb(158, 158, 158)', borderBottomWidth: 1}}>
                <View style={{flex:1, marginLeft: 10}}>
                    <Text style={{fontSize: 25, fontWeight: 'bold'}}>{ tripObj.nation_title }</Text>
                    {
                    (!yyyymmddObj.toYyyymmdd || !yyyymmddObj.fromYyyymmdd) ? null :
                    <Text style={{fontSize: 12}}>
                        {Util.getDateForm(String(yyyymmddObj.fromYyyymmdd||''))} ~ 
                        {Util.getDateForm(String(yyyymmddObj.toYyyymmdd||''))}
                    </Text>
                    }
                    <Text style={{fontSize: 15}}>{ tripObj.city_name }</Text>
                </View>
                {
                    isMapView? null: <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={()=>showTypeChange(0)} style={{marginRight: 10}}>
                            <Icon.AntDesign name="profile" size={30} color={pageIndex===0?'blue':null} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>showTypeChange(1)} style={{marginRight: 10}}>
                            <Icon.AntDesign name="switcher" size={30} color={pageIndex===1?'blue':null} />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }
}

export default withNavigation(ExpenseHeader)