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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8883333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.98, 500, 1500, "-65 /actions/Order.action"], "isController": false}, {"data": [0.97, 500, 1500, "PerStoreCart_T06_ClickAddToCart"], "isController": true}, {"data": [0.95, 500, 1500, "-56 /actions/Catalog.action"], "isController": false}, {"data": [0.94, 500, 1500, "PerStoreCart_T08_FillPaymentDetailsContinue"], "isController": true}, {"data": [0.95, 500, 1500, "PerStoreCart_T04_SelectProductRandomly"], "isController": true}, {"data": [0.98, 500, 1500, "-62 /actions/Catalog.action"], "isController": false}, {"data": [0.42, 500, 1500, "PerStoreCart_T02_Login"], "isController": true}, {"data": [0.94, 500, 1500, "-68 /actions/Account.action-1"], "isController": false}, {"data": [0.96, 500, 1500, "-68 /actions/Account.action-0"], "isController": false}, {"data": [0.98, 500, 1500, "-57 /actions/Catalog.action"], "isController": false}, {"data": [0.98, 500, 1500, "PerStoreCart_T03_SelectCategoryRandomly"], "isController": true}, {"data": [0.41, 500, 1500, "PerStoreCart_T01_Homepage"], "isController": true}, {"data": [0.95, 500, 1500, "PerStoreCart_T09_ConfirmOrder"], "isController": true}, {"data": [0.46, 500, 1500, "PerStoreCart_T10_SignOff"], "isController": true}, {"data": [0.41, 500, 1500, "-31 /actions/Catalog.action"], "isController": false}, {"data": [0.95, 500, 1500, "-67 /actions/Order.action"], "isController": false}, {"data": [0.97, 500, 1500, "-55 /actions/Account.action-1"], "isController": false}, {"data": [0.95, 500, 1500, "-55 /actions/Account.action-0"], "isController": false}, {"data": [0.88, 500, 1500, "-55 /actions/Account.action"], "isController": false}, {"data": [0.97, 500, 1500, "-64 /actions/Cart.action"], "isController": false}, {"data": [0.94, 500, 1500, "-66 /actions/Order.action"], "isController": false}, {"data": [0.98, 500, 1500, "PerStoreCart_T07_ProceedCheckOut"], "isController": true}, {"data": [0.97, 500, 1500, "-51 /actions/Account.action;jsessionid=EBAA6637FD63D0385ED5315D4EF1E102"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.85, 500, 1500, "-68 /actions/Account.action"], "isController": false}, {"data": [0.95, 500, 1500, "-61 /actions/Catalog.action"], "isController": false}, {"data": [0.98, 500, 1500, "PerStoreCart_T05_SelectItemRandomly"], "isController": true}, {"data": [0.98, 500, 1500, "-69 /actions/Catalog.action"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1000, 0, 0.0, 265.8289999999997, 0, 3799, 177.0, 543.0, 1038.8999999999999, 1541.8000000000002, 35.0594257266066, 121.64080029712864, 23.662989626792413], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["-65 /actions/Order.action", 50, 0, 0.0, 222.34, 167, 1054, 177.0, 345.8, 458.69999999999914, 1054.0, 2.0824656393169514, 10.804824161807579, 1.3396924458558932], "isController": false}, {"data": ["PerStoreCart_T06_ClickAddToCart", 50, 0, 0.0, 238.18, 169, 1076, 178.0, 345.7, 907.6999999999989, 1076.0, 2.0835937825561532, 9.309106346626661, 1.3643469756636246], "isController": true}, {"data": ["-56 /actions/Catalog.action", 50, 0, 0.0, 294.3, 168, 3799, 176.5, 345.8, 782.249999999998, 3799.0, 2.0782243651024563, 9.960864437424664, 1.3597757076353962], "isController": false}, {"data": ["PerStoreCart_T08_FillPaymentDetailsContinue", 50, 0, 0.0, 283.17999999999995, 169, 1511, 179.0, 363.5, 1261.649999999998, 1511.0, 2.0815986677768525, 9.015517667568693, 2.5918342787260618], "isController": true}, {"data": ["PerStoreCart_T04_SelectProductRandomly", 50, 0, 0.0, 264.2600000000001, 169, 1140, 177.0, 739.5999999999995, 1024.8499999999992, 1140.0, 2.0806458324663972, 8.596196384357706, 1.3752987677375057], "isController": true}, {"data": ["-62 /actions/Catalog.action", 50, 0, 0.0, 226.96000000000004, 169, 1335, 177.0, 192.5, 802.7499999999961, 1335.0, 2.084462417142619, 7.54709745122358, 1.3637758212781925], "isController": false}, {"data": ["PerStoreCart_T02_Login", 50, 0, 0.0, 1013.3399999999999, 676, 4323, 715.5, 1836.3, 1970.6, 4323.0, 1.9919525118521175, 27.644604858870167, 6.067285043424565], "isController": true}, {"data": ["-68 /actions/Account.action-1", 50, 0, 0.0, 300.67999999999995, 167, 1256, 177.0, 1026.8, 1073.3999999999999, 1256.0, 2.060411258087114, 9.682323216714057, 1.2817206751967694], "isController": false}, {"data": ["-68 /actions/Account.action-0", 50, 0, 0.0, 215.86, 166, 1002, 174.5, 187.39999999999998, 588.9999999999998, 1002.0, 2.060835875030912, 0.45684545276564176, 1.3000976320995796], "isController": false}, {"data": ["-57 /actions/Catalog.action", 50, 0, 0.0, 210.51999999999998, 167, 1197, 175.0, 183.9, 505.899999999997, 1197.0, 2.0810788312661286, 7.58415037355365, 1.310144804066428], "isController": false}, {"data": ["PerStoreCart_T03_SelectCategoryRandomly", 50, 0, 0.0, 210.8, 167, 1198, 175.0, 184.0, 506.349999999997, 1198.0, 2.0810788312661286, 8.270215404665779, 1.310144804066428], "isController": true}, {"data": ["PerStoreCart_T01_Homepage", 50, 0, 0.0, 833.8599999999998, 525, 2194, 549.5, 1717.0999999999997, 2019.7999999999995, 2194.0, 1.9939384271813687, 10.56943142845749, 0.9560778981895038], "isController": true}, {"data": ["PerStoreCart_T09_ConfirmOrder", 50, 0, 0.0, 284.42, 170, 1127, 179.0, 973.199999999999, 1064.95, 1127.0, 2.0810788312661286, 10.439455563764255, 1.2905127518105386], "isController": true}, {"data": ["PerStoreCart_T10_SignOff", 50, 0, 0.0, 746.7600000000002, 501, 2304, 536.0, 1474.3, 1578.85, 2304.0, 2.029550251664231, 19.37586255885696, 3.8054067218704337], "isController": true}, {"data": ["-31 /actions/Catalog.action", 50, 0, 0.0, 833.8599999999998, 525, 2194, 549.5, 1717.0999999999997, 2019.7999999999995, 2194.0, 2.0018416943588098, 10.611324918925412, 0.9598674530568122], "isController": false}, {"data": ["-67 /actions/Order.action", 50, 0, 0.0, 284.42, 170, 1127, 179.0, 973.199999999999, 1064.95, 1127.0, 2.081165452653486, 10.439890088449532, 1.2905664672216441], "isController": false}, {"data": ["-55 /actions/Account.action-1", 50, 0, 0.0, 241.76, 169, 1086, 177.0, 347.6, 750.2499999999977, 1086.0, 2.0783107490231942, 9.961278472857261, 1.538437058358966], "isController": false}, {"data": ["-55 /actions/Account.action-0", 50, 0, 0.0, 234.17999999999998, 168, 1124, 175.0, 598.9999999999993, 677.05, 1124.0, 2.036825810656673, 0.4515229091983054, 2.0308585475395144], "isController": false}, {"data": ["-55 /actions/Account.action", 50, 0, 0.0, 476.2999999999998, 338, 1460, 356.5, 865.8, 1233.9499999999998, 1460.0, 2.021590587474225, 10.137566080742328, 3.5121188038248494], "isController": false}, {"data": ["-64 /actions/Cart.action", 50, 0, 0.0, 238.18, 169, 1076, 178.0, 345.7, 907.6999999999989, 1076.0, 2.0835937825561532, 9.309106346626661, 1.3643469756636246], "isController": false}, {"data": ["-66 /actions/Order.action", 50, 0, 0.0, 283.17999999999995, 169, 1511, 179.0, 363.5, 1261.649999999998, 1511.0, 2.0815986677768525, 9.015517667568693, 2.5918342787260618], "isController": false}, {"data": ["PerStoreCart_T07_ProceedCheckOut", 50, 0, 0.0, 222.34, 167, 1054, 177.0, 345.8, 458.69999999999914, 1054.0, 2.0824656393169514, 10.804824161807579, 1.3396924458558932], "isController": true}, {"data": ["-51 /actions/Account.action;jsessionid=EBAA6637FD63D0385ED5315D4EF1E102", 50, 0, 0.0, 242.42, 169, 1262, 174.0, 188.9, 1205.9499999999996, 1262.0, 2.0791749833666, 7.833210532060879, 1.3603976941949436], "isController": false}, {"data": ["Debug Sampler", 150, 0, 0.0, 0.2933333333333334, 0, 5, 0.0, 1.0, 1.0, 2.9600000000000364, 6.192717364379489, 2.018277547271076, 0.0], "isController": false}, {"data": ["-68 /actions/Account.action", 50, 0, 0.0, 516.8000000000001, 334, 1937, 357.5, 1218.9, 1333.5999999999992, 1937.0, 2.045240724833313, 10.064421887143617, 2.5625428222276763], "isController": false}, {"data": ["-61 /actions/Catalog.action", 50, 0, 0.0, 263.98, 169, 1139, 176.5, 739.5999999999995, 1024.8499999999992, 1139.0, 2.0806458324663972, 7.878373572156798, 1.3752987677375057], "isController": false}, {"data": ["PerStoreCart_T05_SelectItemRandomly", 50, 0, 0.0, 226.96000000000004, 169, 1335, 177.0, 192.5, 802.7499999999961, 1335.0, 2.084462417142619, 7.54709745122358, 1.3637758212781925], "isController": true}, {"data": ["-69 /actions/Catalog.action", 50, 0, 0.0, 229.96000000000004, 167, 1130, 176.5, 343.7, 688.7499999999969, 1130.0, 2.059817088242564, 9.528665573247096, 1.281351059775892], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
