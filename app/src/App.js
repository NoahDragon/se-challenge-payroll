import React, { Component } from 'react';
import parse from 'csv-parse';
import { Table } from 'reactable';
import moment from 'moment';
import * as api from './scripts/api.js';
import './App.css';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '', rows: {}, report_id: '', err: null};
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

    api.bulkPOST(this.state.rows);

    console.log('handle uploading-', this.state.file.name, 'report id:', this.state.report_id['hours worked']);
  }

  _handleFileChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    if (file){
      reader.onloadend = () => {
        let rs = {};
        let ri = {};

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

          this.setState({
            file: file,
            rows: rs,
            report_id: ri['WorkedHours'],
            err: null
          });
        });
      }

      reader.readAsText(file);
    }
  }

  render() {
    let {rows, report_id, err} = this.state;
    let $tableList = [];
    let $report_id, $err;

    if (report_id){
      $report_id = (<span> Report ID {report_id} </span>);
    }

    if (err){
      $err = (<p><span className="error">{err}</span> </p>);
    }

    $tableList = Object.keys(rows).map(key => {
      return rows[key];
    })

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
          <Table className="center" data={$tableList} sortable={true} filterable={['EmployeeID']}/>
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
