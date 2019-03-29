import { ToastAndroid } from 'react-native'
const dayObj = [ '일', '월', '화', '수', '목', '금', '토' ]
export default {
  
  amountUnit: '원',
  comma(x) {
    return String(x || '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  },

  getCurrentDate(utc){
    const now = new Date()
    if(!utc) return now
    else return new Date( now.getTime() + (now.getTimezoneOffset() * 60000) + (utc*60*60000) )
  },

  getTimeForm(date){
    if(!date) return ''
    let hours = date.getHours()
    if(hours > 12) hours -= 12
    return [hours, this.lpad(date.getMinutes(), 2, 0)].join(':')
  },
  
  getNoon(date){
    if(typeof date === 'number') return date >= 12? 'PM': 'AM'
    if(!date) return ''
    return date.getHours() >= 12? 'PM': 'AM'
  },

  getDateForm(date){
    if(!date) return ''
    if(typeof date === 'string'){
      return [
        date.substring(2,4),
        this.lpad(date.substring(4,6), 2, '0'),
        this.lpad(date.substring(6,8), 2, '0')
      ].join('.')
    }else{
      return [
        String(date.getFullYear() || '').substring(2),
        this.lpad(date.getMonth()+1, 2, '0'),
        this.lpad(date.getDate(), 2, '0')
      ].join('.')
    }
  },

  yyyymmdd(date){
    if(!date) return ''
    return [
      date.getFullYear(),
      this.lpad(date.getMonth()+1, 2, '0'),
      this.lpad(date.getDate(), 2, '0')
    ].join('')
  },

  hhmm(date){
    if(!date) return ''
    return [
      this.lpad(date.getHours(), 2, '0'),
      this.lpad(date.getMinutes(), 2, '0')
    ].join('')
  },

  getDay(date){
    if(!date) return ''
    if(typeof date === 'string'){
      const dateTarget = new Date(date.substring(0,4),date.substring(4,6)-1,date.substring(6,8))
      return dayObj[dateTarget.getDay()]
    }else{
      return dayObj[date.getDay()]
    }
  },

  lpad(str, number, padding){
    let target = String(str || '')
    while(target.length < number){
      target = padding+target
    }
    return target
  },

  toast(msg){
    msg && ToastAndroid.showWithGravityAndOffset(
      msg,
      ToastAndroid.SHORT,
      ToastAndroid.BOTTOM,
      0,
      200,
    )
  }

}