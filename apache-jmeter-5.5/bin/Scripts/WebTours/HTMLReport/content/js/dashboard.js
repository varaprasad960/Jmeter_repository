/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9747058823529412, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Homepage"], "isController": true}, {"data": [1.0, 500, 1500, "ClickOnSignUp-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOff"], "isController": true}, {"data": [1.0, 500, 1500, "ClickOnSignUp"], "isController": true}, {"data": [1.0, 500, 1500, "FillDetailsAndClickContinue-0"], "isController": false}, {"data": [0.57, 500, 1500, "ClickContinue"], "isController": true}, {"data": [1.0, 500, 1500, "Homepage-4"], "isController": false}, {"data": [1.0, 500, 1500, "FillDetailsAndClickContinue"], "isController": true}, {"data": [1.0, 500, 1500, "Homepage-3"], "isController": false}, {"data": [1.0, 500, 1500, "ClickContinue-2"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-2"], "isController": false}, {"data": [1.0, 500, 1500, "ClickContinue-1"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-1"], "isController": false}, {"data": [1.0, 500, 1500, "ClickContinue-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOff-1"], "isController": false}, {"data": [1.0, 500, 1500, "Homepage-0"], "isController": false}, {"data": [1.0, 500, 1500, "SignOff-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 600, 0, 0.0, 129.2849999999999, 1, 254, 165.0, 188.89999999999998, 196.0, 215.99, 22.919133656747775, 36.695905472898126, 13.331818322892396], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Homepage", 50, 0, 0.0, 308.9199999999999, 282, 367, 305.0, 340.5, 351.34999999999997, 367.0, 1.976518954816777, 14.610682899652133, 4.71546465489979], "isController": true}, {"data": ["ClickOnSignUp-0", 50, 0, 0.0, 177.91999999999996, 158, 219, 174.0, 199.7, 215.45, 219.0, 2.068509018699322, 5.391455635652822, 1.173636464711236], "isController": false}, {"data": ["SignOff", 50, 0, 0.0, 358.6999999999999, 331, 440, 356.0, 387.3, 408.79999999999995, 440.0, 2.0536411056803714, 8.502595609828726, 2.5213257793567996], "isController": true}, {"data": ["ClickOnSignUp", 50, 0, 0.0, 177.91999999999996, 158, 219, 174.0, 199.7, 215.45, 219.0, 2.068509018699322, 5.391455635652822, 1.173636464711236], "isController": true}, {"data": ["FillDetailsAndClickContinue-0", 50, 0, 0.0, 178.64000000000007, 164, 206, 178.0, 192.0, 197.24999999999997, 206.0, 2.0678246484698097, 2.9506888440860215, 1.6255848066583953], "isController": false}, {"data": ["ClickContinue", 50, 0, 0.0, 527.2400000000002, 483, 603, 525.0, 561.7, 593.05, 603.0, 2.0410662530105728, 7.444709428705556, 4.109240417193942], "isController": true}, {"data": ["Homepage-4", 50, 0, 0.0, 121.96000000000002, 104, 160, 118.0, 141.0, 145.45, 160.0, 2.07288255047469, 6.381684722337383, 1.1477777403507319], "isController": false}, {"data": ["FillDetailsAndClickContinue", 50, 0, 0.0, 178.64000000000007, 164, 206, 178.0, 192.0, 197.24999999999997, 206.0, 2.0678246484698097, 2.9506888440860215, 1.6255848066583953], "isController": true}, {"data": ["Homepage-3", 50, 0, 0.0, 54.419999999999995, 48, 64, 54.0, 61.9, 62.0, 64.0, 2.078915637603426, 3.368086955843832, 1.142997562471415], "isController": false}, {"data": ["ClickContinue-2", 50, 0, 0.0, 172.34, 152, 204, 172.0, 191.29999999999998, 197.45, 204.0, 2.06996481059822, 3.5355160681018423, 1.4032905971848477], "isController": false}, {"data": ["Homepage-2", 50, 0, 0.0, 125.81999999999998, 112, 167, 122.0, 137.9, 150.45, 167.0, 2.0729684908789388, 2.2005046382669984, 0.9393138474295191], "isController": false}, {"data": ["ClickContinue-1", 50, 0, 0.0, 183.98000000000002, 164, 235, 181.5, 200.9, 215.4499999999999, 235.0, 1.9866497139224413, 2.2563218918865227, 1.337108381675143], "isController": false}, {"data": ["Homepage-1", 50, 0, 0.0, 2.0000000000000004, 1, 4, 2.0, 2.8999999999999986, 3.0, 4.0, 2.0831597366886094, 2.04857603012249, 0.9215540632030664], "isController": false}, {"data": ["ClickContinue-0", 50, 0, 0.0, 170.92000000000002, 155, 202, 170.0, 188.5, 196.35, 202.0, 2.068594596830913, 1.6625521027264076, 1.3700398980182864], "isController": false}, {"data": ["SignOff-1", 50, 0, 0.0, 183.6, 166, 254, 180.0, 200.9, 214.89999999999992, 254.0, 2.0679101699822158, 6.366538046962241, 1.1389661483105176], "isController": false}, {"data": ["Homepage-0", 50, 0, 0.0, 4.720000000000001, 2, 30, 3.0, 7.899999999999999, 13.349999999999987, 30.0, 1.9997600287965442, 1.2967193936727592, 0.7733446986361636], "isController": false}, {"data": ["SignOff-0", 50, 0, 0.0, 175.1, 155, 212, 173.5, 187.9, 202.74999999999994, 212.0, 2.068851373717312, 2.1961342219049986, 1.4005154025984774], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 600, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
