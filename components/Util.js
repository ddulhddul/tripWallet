const dayObj = { 0: '일', 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토' }
export default {
  
  comma(x) {
    return String(x || '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  },

  getTimeForm(date){
    if(!date) return ''
    let hours = date.getHours()
    if(hours > 12) hours -= 12
    return [hours, this.lpad(date.getMinutes(), 2, 0)].join(':')
  },
  
  getNoon(date){
    if(!date) return ''
    return date.getHours() >= 12? 'PM': 'AM'
  },

  getDateForm(date){
    if(!date) return ''
    return [
      String(date.getFullYear() || '').substring(2),
      this.lpad(date.getMonth()+1, 2, '0'),
      this.lpad(date.getDate(), 2, '0')
    ].join('.')
  },

  yyyymmdd(date){
    if(!date) return ''
    return [
      date.getFullYear(),
      this.lpad(date.getMonth()+1, 2, '0'),
      this.lpad(date.getDate(), 2, '0')
    ].join('')
  },

  
  getDay(date){
    if(!date) return ''
    return dayObj[date.getDay()]
  },

  lpad(str, number, padding){
    let target = String(str || '')
    while(target.length < number){
      target = padding+target
    }
    return target
  }

}