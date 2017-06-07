import React, { Component } from 'react';
import parse from 'csv-parse';
import { Table } from 'reactable';
import fetch from 'node-fetch';
import moment from 'moment';
import './App.css';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '', rows: {}, report_id: ''};
  }

  _handleSubmit(e) {
    e.preventDefault();

    for(let i in this.state.rows){
      fetch('http://localhost:8080/api/PayrollReports', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
        body: JSON.stringify({
            ID: this.state.report_id,
            Date: moment(this.state.rows[i]["date"], 'DD/MM/YYYY').toDate(),
            WorkedHours: this.state.rows[i]["hours worked"],
            EmployeeID: this.state.rows[i]["employee id"],
            JobGroup: this.state.rows[i]["job group"]
        })
      }).then(res => console.log(res));
    }
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
        
        parse(reader.result, {delimiter: ',', columns: true}, (err, output) => {
          rs = output; 
          ri = rs[rs.length - 1];   // get the report id row.
          delete rs[rs.length - 1]; // remove the report id row.

          this.setState({
            file: file,
            rows: rs,
            report_id: ri['hours worked']
          });
        });
      }

      reader.readAsText(file);
    }
  }

  render() {
    let {rows, report_id} = this.state;
    let $tableList = [];
    let $report_id;

    if (report_id){
      $report_id = (<span> Report ID {report_id} </span>);
    } else {
      $report_id = null;
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
        <div className="App-list">
          <Table className="center" data={$tableList} sortable={true} filterable={['employee id']}/>
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
