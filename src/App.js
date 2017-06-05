import React, { Component } from 'react';
import parse from 'csv-parse';
import './App.css';

class FileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {file: '', rows: []};
  }

  _handleSubmit(e) {
    e.preventDefault();
    this.forceUpdate();
    console.log('handle uploading-', this.state.file.name);
  }

  _handleFileChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      let rs = [];
      
      parse(reader.result, {delimiter: ','}, (err, output) => {
        output.forEach( i => {
          rs.push(i);
        });  
      });

      this.setState({
        file: file,
        rows: rs
      });
    }

    reader.readAsText(file);
  }

  render() {
    let {rows} = this.state;
    let $list = [];
    if (rows) {
      rows.forEach( (i, index) => {
        $list.push(
          <Row key={index} employee_id={i[2]} pay_period={i[0]} amount={i[1]} />
        );
      });
    } else {
      $list = (<div className="listText">Please select File for Preview</div>);
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
        <div className="List">
          {$list}
        </div>
      </div>
    )
  }
}

class Row extends React.Component {
    render() {
        return (
            <ul>
                <li>{this.props.employee_id}<span id="tab"/></li>
                <li>{this.props.pay_period}<span id="tab"/></li>
                <li>{this.props.amount}</li>
            </ul>
        );
    }
} 

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Welcome to Wave Payroll Viewer</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <Row employee_id="1" pay_period="2015-07-08 to 2015-09-20" amount="100" />
        <FileUpload />
      </div>
    );
  }
}

export default App;
