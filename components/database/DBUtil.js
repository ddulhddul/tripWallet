import { SQLite } from 'expo'
import React from 'react';
const db = SQLite.openDatabase('tripWallet.db')

export default class DBUtil extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  initNationTable() {
    db.transaction((txn)=>{
      txn.executeSql(
        "SELECT * FROM sqlite_master WHERE type='table' AND name='TN_TRIP'",
        [],
        (tx, res)=>{
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS TN_TRIP', [])
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS TN_TRIP (
                trip_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                nation_id VARCHAR(8),
                nation_title VARCHAR(255),
                nation_utc DOUBLE,
                nation_uri VARCHAR(255),
                city_name VARCHAR(255),
                remark VARCHAR(255)
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

  insertTnTrip(param={}, callback= ()=>{}){
    this.queryExecute(
      `insert into TN_TRIP (
        nation_id,
        nation_title,
        nation_utc,
        nation_uri,
        city_name,
        remark
      ) values (
        ?, ?, ?, ?, ?, ?
      )`,
      [
        param.nation.id,
        param.nation.title,
        param.nation.utc,
        param.nation.uri,
        param.city_name,
        param.remark,
      ],
      callback
    )
  }

  initTable() {
    db.transaction((txn)=>{
      txn.executeSql(
        `SELECT * FROM sqlite_master MA WHERE type='table' AND name='TN_EXPENSE'
        AND EXISTS (
          SELECT 1 FROM sqlite_master WHERE name='TN_EXPENSE' AND sql LIKE '%trip_id%'
        )`,
        [],
        (tx, res)=>{
          console.log('res.rows', res.rows)
          if (res.rows.length == 0) {
            txn.executeSql('DROP TABLE IF EXISTS TN_EXPENSE', [])
            txn.executeSql(
              `CREATE TABLE IF NOT EXISTS TN_EXPENSE (
                expense_id INTEGER PRIMARY KEY AUTOINCREMENT, 
                trip_id INTEGER NOT NULL,
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
        AND trip_id = ?
      `,
      [
        param.expense_id,
        param.trip_id,
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
        AND trip_id = ?
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
        param.expense_id,
        param.trip_id,
      ],
      callback
    )
  }

  insertTnExpense(param={}, callback= ()=>{}){
    this.queryExecute(
      `insert into TN_EXPENSE (
        trip_id,
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
        param.trip_id,
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
