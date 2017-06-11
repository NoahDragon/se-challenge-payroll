import React, { Component } from 'react';
import parse from 'csv-parse';
import { Table } from 'reactable';
import moment from 'moment';
import * as api from './scripts/api.js';
import * as br from './scripts/business_rules.js';
import './App.css';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '', rows: {}, report_id: '', err: null, table_list: []};
    this._loadData();
  }

  _loadData(){
    api.loadPayroll(0, 0, res => {
      this.setState({
        table_list: br.generatePayrolls(res)
      })
    });
  }

  _handleSubmit(e) {
    e.preventDefault();

    if(this.state.err)
      return;

    if(!this.state.file){
      this.setState({
        err: 'Please select a file to upload.'
      });
      return;
    }

    api.checkReportIDExists(this.state.report_id, () => {
      this.setState({
        err: 'The same report ID has been uploaded.'
      })
    }, () => {
      api.bulkPOST(this.state.rows, () => {
        this._loadData();
      });
      console.log('handle uploading-', this.state.file.name, 'report id:', this.state.report_id);
    });
  }

  _handleFileChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    if (file){
      reader.onloadend = () => {
        let rs = {}; // report rows.
        let ri = {}; // report id row.

        parse(reader.result, {
            from: 2,        // skip header line.
            delimiter: ',', 
            columns: [
              'Date',
              'WorkedHours',
              'EmployeeID',
              'JobGroup'
            ]
          }, (err, output) => {
          if (err){
            this.setState({
              err: file.name + ' ' + err.toString()
            });
            return;
          }

          rs = output; 
          ri = rs[rs.length - 1];   // get the report id row.
          delete rs[rs.length - 1]; // remove the report id row.

          let report_id = ri["WorkedHours"]; // report id is on the same column of work hours.

          this.setState({
            file: file,
            rows: Object.keys(rs).map(key => {
              rs[key]["Date"] = moment(rs[key]["Date"], 'DD/MM/YYYY').toDate();
              rs[key]["ID"] = report_id;
              return rs[key];
            }), // convert Date column to date type.
            report_id: report_id,
            err: null
          });
        });
      }

      reader.readAsText(file);
    }
  }

  render() {
    let {rows, report_id, err} = this.state;
    let $report_id, $err;

    if (report_id){
      $report_id = (<span> Report ID {report_id} </span>);
    }

    if (err){
      $err = (<p><span className="error">{err}</span> </p>);
    }

    return (
      <div className="previewComponent">
        <form onSubmit={(e)=>this._handleSubmit(e)}>
          <input className="fileInput" 
            type="file" 
            onChange={(e)=>this._handleFileChange(e)} />
          <button className="submitButton" 
            type="submit" 
            onClick={(e)=>this._handleSubmit(e)}>Upload File</button>
        </form>
        {$err}
        <div className="App-list">
          <Table className="center" data={this.state.table_list} sortable={true} filterable={['EmployeeID']}/>
        </div>
        {$report_id}
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Wave Payroll Viewer</h2>
        </div>
        <FileUpload />
        <div className="footer">
          This a simulate APP created for <a href="https://github.com/wvchallenges/se-challenge-payroll"><strong>Wave Code Challenge</strong></a> by HC. 
        </div>
      </div>
    );
  }
}

export default App;
