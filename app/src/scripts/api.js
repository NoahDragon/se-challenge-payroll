import 'whatwg-fetch';

const API_SERVER_URL = 'http://localhost:8080'
const PAYROLL_REPORT_URL = API_SERVER_URL + '/api/PayrollReports';
const PAYROLL_REPORT_FIND_ONE_URL = PAYROLL_REPORT_URL + '/findOne';
const FILTER = '?filter='
/*
*   Private Methods
*/
/**
 * REST GET from a URL.
 *
 * @param {string} url
 * @return {Promise}
 */
function _GET(url){
    return fetch(url);
}

/**
 * REST POST from a URL.
 *
 * @param {string} url
 * @param {Object} options
 * @return {Promise}
 */
function _POST(url, options){
    return fetch(url, options);
}

/**
 * POST a json string to payroll API server.
 *
 * @param {JSON} json
 */
function _payrollReportPOST(json){
    _POST(PAYROLL_REPORT_URL, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
          },
        body: json
      }).then(res => res.json())
        .then(console.log);
}
/*
*   Export Methods
*/
/**
 * POST an object (bulk of json) to payroll API server.
 *
 * @param {Object} obj
 */
export function bulkPOST(obj, callback){
    for (let i in obj){
        _payrollReportPOST(JSON.stringify(obj[i]));
    }
    callback();
}

export var isServerOnline = false

/**
 * Check if payroll API server online.
 */
export function checkServer(){
    _GET(API_SERVER_URL)
        .then(res => {
            isServerOnline = res.status == '200';
        });
}

/**
 * Check if a report ID exists, if exists, do existsCallback,
 * else do nonExistsCallback.
 *
 * @param {number} report_id
 * @param {function} existsCallback
 * @param {nonExistsCallback} nonExistsCallback
 */
export function checkReportIDExists(report_id, existsCallback, nonExistsCallback){
    if(typeof existsCallback === 'function' && typeof nonExistsCallback == 'function'){
        let query = {where:{
                        ID: report_id
                        }
                    };
        
        _GET(PAYROLL_REPORT_FIND_ONE_URL + FILTER + JSON.stringify(query))
            .then(res => {
                if(res.status == '200')
                    existsCallback();
                else
                    nonExistsCallback();
            });
    }
}

/**
 * Load Payroll from API server.
 *
 * @param {date} startDate
 * @param {date} endDate
 * @param {function} callback
 */
export function loadPayroll(startDate, endDate, callback){
    if(typeof callback === 'function'){
        let query = {
            where: {
                Date: {
                    gt: startDate | 0,
                    lt: endDate | 0
                }
            }
        };

        _GET(PAYROLL_REPORT_URL + FILTER + JSON.stringify(query))
            .then(res => {
                if(res.status == '200')
                    res.json().then(jsonResults => callback(jsonResults));
            });
    }
}