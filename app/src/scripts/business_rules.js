import moment from 'moment';

const A_RATE = 20.0;
const B_RATE = 30.0;

/**
 * Return dd/mm/yyyy format date string.
 * 
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @return {string}
 */
function _getDayMonthYear(day, month, year){
    return day + '/' + month + '/' + year;
}
/**
 * Return first half month period.
 * 
 * @param {number} month
 * @param {number} year
 * @return {string}
 */
function _getFirstHalfMonth(month, year){
    return _getDayMonthYear(1, month, year) + ' - ' + _getDayMonthYear(15, month, year);
}
/**
 * Return second half month period.
 * 
 * @param {number} month
 * @param {number} year
 * @return {string}
 */
function _getSecondHalfMonth(month, year){
    return _getDayMonthYear(16, month, year) 
        + ' - ' 
        + _getDayMonthYear(new Date(year, month + 1, 0).getDate(), month, year);
}
/**
 * Generate payroll based on reports
 *
 * @param {array} reports
 * @return {array}
 */
export function generatePayrolls(reports){
    let processedReports = [];
    let payrolls = [];
    let d, dn, isFirstHalfMonth, isFirstHalfMonthn, employeeID, amountPaid;
    let payroll = {};

    for(let i in reports){
        if(processedReports.indexOf(Number(i)) != -1)
            continue;

        d = new Date(reports[i].Date);
        isFirstHalfMonth = d.getDate() <= 15 ? true : false;
        employeeID = reports[i].EmployeeID;
        payroll = new Object();
        
        amountPaid = reports[i].WorkedHours * (reports[i].JobGroup === 'A' ? A_RATE : B_RATE);

        if (Number(i) + 1 != reports.length){   // avoid index out of array.
            for(let j = Number(i)+1; j < reports.length; j++){
                if(processedReports.indexOf(j) != -1)
                    continue;

                if(reports[j].EmployeeID == employeeID){
                    dn = new Date(reports[j].Date);
                    isFirstHalfMonthn = dn.getDate() <= 15 ? true : false;

                    if(d.getMonth() === dn.getMonth() && d.getFullYear() === dn.getFullYear() && isFirstHalfMonth === isFirstHalfMonthn){
                        amountPaid += reports[j].WorkedHours * (reports[j].JobGroup === 'A' ? A_RATE : B_RATE);
                        processedReports.push(j);
                        console.log(reports[i], reports[j]);
                    }
                }
            }
        }

        payroll.EmployeeID = employeeID;
        payroll.AmountPaid = amountPaid;
        payroll.PayPeriod = isFirstHalfMonth ? _getFirstHalfMonth(d.getMonth() + 1, d.getFullYear())
            : _getSecondHalfMonth(d.getMonth() + 1, d.getFullYear());

        processedReports.push(Number(i));
        payrolls.push(payroll);
    }
console.log(processedReports);
    return payrolls;
}