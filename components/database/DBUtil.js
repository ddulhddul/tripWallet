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

}
