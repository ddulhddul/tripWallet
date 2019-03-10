import { SQLite } from 'expo'
import React from 'react';
const db = SQLite.openDatabase('tripWallet.db')

export default class DBUtil extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  initTable() {
    db.transaction((txn)=>{
      txn.executeSql(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='TN_EXPENSE'",
        [],
        (tx, res)=>{
          console.log('item:', res.rows.length, res.rows)
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS TN_EXPENSE', [])
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS TN_EXPENSE (
                expense_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                amount INT(10), 
                remark VARCHAR(255),
                yyyymmdd VARCHAR(8),
                hh VARCHAR(2), 
                mm VARCHAR(2), 
                latitude DOUBLE,
                longitude DOUBLE,
                latitudeDelta DOUBLE,
                longitudeDelta DOUBLE,
                images CLOB
              )`,
              [],
              (tx, res)=>{
                console.log('create table log', tx, res)
              },
              (...params)=>{
                console.log('create table error', ...params)
              }
            )
          }
        }
      )
    })
  }

  listTnExpense(param=[], callback= ()=>{}){
    this.queryExecute(
      `SELECT * FROM TN_EXPENSE
      ORDER BY YYYYMMDD, HH, MM`,
      param,
      callback
    )
  }

  deleteTnExpense(param={}, callback= ()=>{}){
    this.queryExecute(
      `DELETE FROM TN_EXPENSE 
        WHERE expense_id = ?
      `,
      [
        param.expense_id
      ],
      callback
    )
  }

  updateTnExpense(param={}, callback= ()=>{}){
    this.queryExecute(
      `UPDATE TN_EXPENSE 
        SET 
          amount = ?,
          remark = ?,
          yyyymmdd = ?,
          hh = ?,
          mm = ?,
          latitude = ?,
          longitude = ?,
          latitudeDelta = ?,
          longitudeDelta = ?,
          images = ?
        WHERE expense_id = ?
      `,
      [
        param.amount,
        param.remark,
        param.yyyymmdd,
        param.hh,
        param.mm,
        param.location.coords.latitude,
        param.location.coords.longitude,
        param.location.coords.latitudeDelta,
        param.location.coords.longitudeDelta,
        param.images.join('|'),
        param.expense_id
      ],
      callback
    )
  }

  insertTnExpense(param={}, callback= ()=>{}){
    this.queryExecute(
      `insert into TN_EXPENSE (
        amount,
        remark,
        yyyymmdd,
        hh,
        mm,
        latitude,
        longitude,
        latitudeDelta,
        longitudeDelta,
        images
      ) values (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        param.amount,
        param.remark,
        param.yyyymmdd,
        param.hh,
        param.mm,
        param.location.coords.latitude,
        param.location.coords.longitude,
        param.location.coords.latitudeDelta,
        param.location.coords.longitudeDelta,
        param.images.join('|')
      ],
      callback
    )
  }

  queryExecute(sql='', param=[], callback=()=>{}) {
    db.transaction(tx => {
      tx.executeSql(
        sql,
        param,
        callback,

        // `select * from items where done = ?`,
        // [this.props.done ? 1 : 0],
        // function(tx, res) {}  
        // (_, { rows: { _array } }) => this.setState({ items: _array })
        (...params)=>{
          console.log('db error', ...params)
          alert('error')
        }
      )
    })
  }

  getNationList(){
    return [
      { id: 'ca',title: "캐나다", utc: -3.5, uri: "../assets/images/countries/ca.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ca.svg" },
      { id: 'us-4',title: "미국(동부)", utc: -4, uri: "../assets/images/countries/us.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/us.svg" },
      { id: 'us-5',title: "미국(동부)", utc: -5, uri: "../assets/images/countries/us.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/us.svg" },
      { id: 'us-6',title: "미국(중부)", utc: -6, uri: "../assets/images/countries/us.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/us.svg" },
      { id: 'us-7',title: "미국(태평양)", utc: -7, uri: "../assets/images/countries/us.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/us.svg" },
      { id: 'us-8',title: "미국(태평양)", utc: -8, uri: "../assets/images/countries/us.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/us.svg" },
      { id: 'us-9',title: "미국(알래스카)", utc: -9, uri: "../assets/images/countries/us.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/us.svg" },
      { id: 'us-10',title: "미국(하와이)", utc: -10, uri: "../assets/images/countries/us.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/us.svg" },
      { id: 'us-11',title: "미국", utc: -11, uri: "../assets/images/countries/us.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/us.svg" },
      { id: 'mx',title: "멕시코", utc: -8, uri: "../assets/images/countries/mx.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/mx.svg" },
      { id: 'br',title: "브라질", utc: -2, uri: "../assets/images/countries/br.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/br.svg" },
      { id: 'br',title: "브라질(동북)", utc: -3, uri: "../assets/images/countries/br.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/br.svg" },
      { id: 'ar',title: "아르헨티나", utc: -3, uri: "../assets/images/countries/ar.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ar.svg" },
      { id: 'gb',title: "영국", utc: 0, uri: "../assets/images/countries/gb.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/gb.svg" },
      { id: 'ie',title: "아일랜드", utc: +1, uri: "../assets/images/countries/ie.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ie.svg" },
      { id: 'fr',title: "프랑스", utc: +1, uri: "../assets/images/countries/fr.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/fr.svg" },
      { id: 'be',title: "벨기에", utc: +1, uri: "../assets/images/countries/be.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/be.svg" },
      { id: 'nl',title: "네덜란드", utc: +1, uri: "../assets/images/countries/nl.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/nl.svg" },
      { id: 'de',title: "독일", utc: +1, uri: "../assets/images/countries/de.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/de.svg" },
      { id: 'ch',title: "스위스", utc: +1, uri: "../assets/images/countries/ch.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ch.svg" },
      { id: 'hu',title: "헝가리", utc: +1, uri: "../assets/images/countries/hu.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/hu.svg" },
      { id: 'at',title: "오스트리아", utc: +1, uri: "../assets/images/countries/at.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/at.svg" },
      { id: 'cz',title: "체코", utc: +1, uri: "../assets/images/countries/cz.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/cz.svg" },
      { id: 'pl',title: "폴란드", utc: +1, uri: "../assets/images/countries/pl.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/pl.svg" },
      { id: 'ma',title: "모로코", utc: +1, uri: "../assets/images/countries/ma.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ma.svg" },
      { id: 'eg',title: "이집트", utc: +2, uri: "../assets/images/countries/eg.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/eg.svg" },
      { id: 'za',title: "남아프리카", utc: +2, uri: "../assets/images/countries/za.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/za.svg" },
      { id: 'es',title: "스페인", utc: +1, uri: "../assets/images/countries/es.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/es.svg" },
      { id: 'pt',title: "포르투갈", utc: 0, uri: "../assets/images/countries/pt.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/pt.svg" },
      { id: 'it',title: "이탈리아", utc: +1, uri: "../assets/images/countries/it.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/it.svg" },
      { id: 'se',title: "스웨덴", utc: +1, uri: "../assets/images/countries/se.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/se.svg" },
      { id: 'fi',title: "핀란드", utc: +2, uri: "../assets/images/countries/fi.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/fi.svg" },
      { id: 'dk',title: "덴마크", utc: +1, uri: "../assets/images/countries/dk.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/dk.svg" },
      { id: 'hr',title: "크로아티아", utc: +1, uri: "../assets/images/countries/hr.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/hr.svg" },
      { id: 'bg',title: "불가리아", utc: +2, uri: "../assets/images/countries/bg.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/bg.svg" },
      { id: 'gr',title: "그리스", utc: +2, uri: "../assets/images/countries/gr.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/gr.svg" },
      { id: 'tr',title: "터키", utc: +3, uri: "../assets/images/countries/tr.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/tr.svg" },
      { id: 'ua',title: "우크라이나", utc: +2, uri: "../assets/images/countries/ua.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ua.svg" },
      { id: 'ru+12',title: "러시아(+12)", utc: +12, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+11',title: "러시아(+11)", utc: +11, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+10',title: "러시아(+10)", utc: +10, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+9',title: "러시아(+9)", utc: +9, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+8',title: "러시아(+8)", utc: +8, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+7',title: "러시아(+7)", utc: +7, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+6',title: "러시아(+6)", utc: +6, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+5',title: "러시아(+5)", utc: +5, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+4',title: "러시아(+4)", utc: +4, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+3',title: "러시아(+3)", utc: +3, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ru+2',title: "러시아(+2)", utc: +2, uri: "../assets/images/countries/ru.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ru.svg" },
      { id: 'ae',title: "아랍 에미리트", utc: +4, uri: "../assets/images/countries/ae.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/ae.svg" },
      { id: 'sa',title: "사우디 아라비아", utc: +3, uri: "../assets/images/countries/sa.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/sa.svg" },
      { id: 'jp',title: "일본", utc: +9, uri: "../assets/images/countries/jp.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/jp.svg" },
      { id: 'kr',title: "대한민국", utc: +9, uri: "../assets/images/countries/kr.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/kr.svg" },
      { id: 'cn',title: "중국", utc: +8, uri: "../assets/images/countries/cn.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/cn.svg" },
      { id: 'tw',title: "대만", utc: +8, uri: "../assets/images/countries/tw.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/tw.svg" },
      { id: 'hk',title: "홍콩", utc: +8, uri: "../assets/images/countries/hk.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/hk.svg" },
      { id: 'vn',title: "베트남", utc: +7, uri: "../assets/images/countries/vn.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/vn.svg" },
      { id: 'th',title: "태국", utc: +7, uri: "../assets/images/countries/th.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/th.svg" },
      { id: 'my',title: "말레이시아", utc: +8, uri: "../assets/images/countries/my.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/my.svg" },
      { id: 'sg',title: "싱가포르", utc: +8, uri: "../assets/images/countries/sg.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/sg.svg" },
      { id: 'in',title: "인도", utc: +5.5, uri: "../assets/images/countries/in.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/in.svg" },
      { id: 'au+10.5',title: "호주(+10.5)", utc: +10.5, uri: "../assets/images/countries/au.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/au.svg" },
      { id: 'au+10',title: "호주(+10)", utc: +10, uri: "../assets/images/countries/au.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/au.svg" },
      { id: 'au+9.5',title: "호주(+9.5)", utc: +9.5, uri: "../assets/images/countries/au.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/au.svg" },
      { id: 'au+8',title: "호주(+8)", utc: +8, uri: "../assets/images/countries/au.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/au.svg" },
      { id: 'au+7',title: "호주(+7)", utc: +7, uri: "../assets/images/countries/au.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/au.svg" },
      { id: 'au+6.5',title: "호주(+6.5)", utc: +6.5, uri: "../assets/images/countries/au.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/au.svg" },
      { id: 'au+5',title: "호주(+5)", utc: +5, uri: "../assets/images/countries/au.png", webSrc: "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/2.9.0/flags/4x3/au.svg" },
    ]
  }

}
