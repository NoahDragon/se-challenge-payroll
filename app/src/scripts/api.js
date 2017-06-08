import 'whatwg-fetch';

const API_SERVER_URL = 'http://localhost:8080'
const PAYROLL_REPORT_URL = API_SERVER_URL + '/api/PayrollReports';

function POST(json){
    fetch(PAYROLL_REPORT_URL, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
        body: json
      }).then(res => res.json())
        .then(console.log);
}

export function bulkPOST(obj){
    for (let i in obj){
        POST(JSON.stringify(obj[i]));
    }
}

export var isServerOnline = false

export function checkServer(){
    fetch(API_SERVER_URL)
        .then(res => {
            isServerOnline = res.status === '200';
        });
}