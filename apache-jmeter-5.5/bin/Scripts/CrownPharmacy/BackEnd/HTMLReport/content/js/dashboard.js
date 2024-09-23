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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7238095238095238, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "DashBoard_Navigation_T13_ClickOnTerms&Condition&Update-0"], "isController": false}, {"data": [0.95, 500, 1500, "DashBoard_Navigation_T04_ClickOnOpeningHours"], "isController": true}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T13_ClickOnTerms&Condition&Update-1"], "isController": false}, {"data": [0.8, 500, 1500, "AddService_T04_ClickonAddService"], "isController": true}, {"data": [0.2, 500, 1500, "DashBoard_Navigation_T02_Login-0"], "isController": false}, {"data": [0.55, 500, 1500, "DashBoard_Navigation_T14_ClickOnAboutUs"], "isController": true}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T02_Login-2"], "isController": false}, {"data": [0.65, 500, 1500, "DashBoard_Navigation_T02_Login-1"], "isController": false}, {"data": [0.5, 500, 1500, "DashBoard_Navigation_T03_ClickOnSetUp"], "isController": true}, {"data": [0.9, 500, 1500, "DashBoard_Navigation_T10_ClickOnRequestCallBackList"], "isController": true}, {"data": [0.65, 500, 1500, "DashBoard_Navigation_T12_ClickOnPrivacyPolicy&Update-1"], "isController": false}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T05_ClickOnClosingHours-0"], "isController": false}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T12_ClickOnPrivacyPolicy&Update-0"], "isController": false}, {"data": [0.5, 500, 1500, "DashBoard_Navigation_T01_HomePage-1"], "isController": false}, {"data": [0.85, 500, 1500, "AddService_T05_FillDetailsClickOK-1-1"], "isController": false}, {"data": [0.9, 500, 1500, "DashBoard_Navigation_T08_ClickOnBookings-0"], "isController": false}, {"data": [0.7, 500, 1500, "DashBoard_Navigation_T16_Logout-0"], "isController": false}, {"data": [0.5, 500, 1500, "AddService_T05_FillDetailsClickOK-1-0"], "isController": false}, {"data": [0.6, 500, 1500, "DashBoard_Navigation_T15_ClickOnFooter"], "isController": true}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T16_Logout-1"], "isController": false}, {"data": [0.5, 500, 1500, "DashBoard_Navigation_T01_HomePage-0"], "isController": false}, {"data": [0.4, 500, 1500, "AddService_T05_FillDetailsClickOK"], "isController": true}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T15_ClickOnFooter-0"], "isController": false}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T15_ClickOnFooter-1"], "isController": false}, {"data": [0.8, 500, 1500, "AddService_T04_ClickonAddService-0"], "isController": false}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T14_ClickOnAboutUs-0"], "isController": false}, {"data": [0.95, 500, 1500, "DashBoard_Navigation_T03_ClickOnSetUp-0"], "isController": false}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T14_ClickOnAboutUs-1"], "isController": false}, {"data": [0.85, 500, 1500, "DashBoard_Navigation_T03_ClickOnSetUp-1"], "isController": false}, {"data": [0.9, 500, 1500, "DashBoard_Navigation_T10_ClickOnRequestCallBackList-0"], "isController": false}, {"data": [0.5, 500, 1500, "DashBoard_Navigation_T12_ClickOnPrivacyPolicy&Update"], "isController": true}, {"data": [0.95, 500, 1500, "DashBoard_Navigation_T04_ClickOnOpeningHours-0"], "isController": false}, {"data": [0.1, 500, 1500, "AddService_T01_Homepage"], "isController": true}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T09_ClickOnContactList"], "isController": true}, {"data": [0.05, 500, 1500, "DashBoard_Navigation_T02_Login"], "isController": true}, {"data": [0.95, 500, 1500, "DashBoard_Navigation_T06_ClickOnServices-0"], "isController": false}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T09_ClickOnContactList-0"], "isController": false}, {"data": [0.2, 500, 1500, "DashBoard_Navigation_T01_HomePage"], "isController": true}, {"data": [0.75, 500, 1500, "AddService_T02_EnterCredentialsckickOK-1-1"], "isController": false}, {"data": [0.35, 500, 1500, "AddService_T02_EnterCredentialsckickOK-1-0"], "isController": false}, {"data": [0.55, 500, 1500, "DashBoard_Navigation_T07_ClickOnEPSNomination"], "isController": true}, {"data": [0.95, 500, 1500, "DashBoard_Navigation_T11_ClickOnUsers-0"], "isController": false}, {"data": [0.5, 500, 1500, "DashBoard_Navigation_T16_Logout"], "isController": true}, {"data": [0.4, 500, 1500, "DashBoard_Navigation_T02_Login-0-0"], "isController": false}, {"data": [0.9, 500, 1500, "DashBoard_Navigation_T08_ClickOnBookings"], "isController": true}, {"data": [0.6, 500, 1500, "DashBoard_Navigation_T02_Login-0-1"], "isController": false}, {"data": [0.95, 500, 1500, "DashBoard_Navigation_T11_ClickOnUsers"], "isController": true}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T05_ClickOnClosingHours"], "isController": true}, {"data": [0.6, 500, 1500, "DashBoard_Navigation_T13_ClickOnTerms&Condition&Update"], "isController": true}, {"data": [0.95, 500, 1500, "DashBoard_Navigation_T06_ClickOnServices"], "isController": true}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T16_Logout-0-0"], "isController": false}, {"data": [1.0, 500, 1500, "DashBoard_Navigation_T16_Logout-0-1"], "isController": false}, {"data": [0.4, 500, 1500, "AddService_T05_FillDetailsClickOK-1"], "isController": false}, {"data": [0.65, 500, 1500, "AddService_T02_EnterCredentialsckickOK-2"], "isController": false}, {"data": [0.05, 500, 1500, "AddService_T02_EnterCredentialsckickOK"], "isController": true}, {"data": [0.15, 500, 1500, "AddService_T02_EnterCredentialsckickOK-1"], "isController": false}, {"data": [0.5, 500, 1500, "AddService_T01_Homepage-1"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [0.5, 500, 1500, "AddService_T01_Homepage-0"], "isController": false}, {"data": [0.95, 500, 1500, "AddService_T03_ClickServices"], "isController": true}, {"data": [1.0, 500, 1500, "AddService_T01_Homepage-4"], "isController": false}, {"data": [0.95, 500, 1500, "AddService_T03_ClickServices-0"], "isController": false}, {"data": [0.55, 500, 1500, "DashBoard_Navigation_T07_ClickOnEPSNomination-0"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 420, 0, 0.0, 538.5666666666663, 0, 2534, 340.5, 1104.7, 1465.75, 2215.8, 16.233138793336682, 670.30901996048, 100.31595135372783], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["DashBoard_Navigation_T13_ClickOnTerms&Condition&Update-0", 10, 0, 0.0, 265.3, 222, 298, 269.0, 297.8, 298.0, 298.0, 1.9845207382417147, 61.76491336326652, 2.1174681236356423], "isController": false}, {"data": ["DashBoard_Navigation_T04_ClickOnOpeningHours", 10, 0, 0.0, 354.5, 228, 812, 317.0, 766.8000000000002, 812.0, 812.0, 1.5292858235204159, 30.54554284867717, 1.6362163557118827], "isController": true}, {"data": ["DashBoard_Navigation_T13_ClickOnTerms&Condition&Update-1", 10, 0, 0.0, 284.0, 232, 309, 294.0, 308.2, 309.0, 309.0, 1.9657951641438962, 61.38080216728917, 27.476210806958917], "isController": false}, {"data": ["AddService_T04_ClickonAddService", 10, 0, 0.0, 428.5, 220, 841, 276.5, 840.5, 841.0, 841.0, 1.793400286944046, 36.57345655487805, 1.6256192835365855], "isController": true}, {"data": ["DashBoard_Navigation_T02_Login-0", 10, 0, 0.0, 1808.8, 924, 2534, 1917.0, 2517.7, 2534.0, 2534.0, 1.3227513227513228, 36.22956452546296, 2.8711712549603177], "isController": false}, {"data": ["DashBoard_Navigation_T14_ClickOnAboutUs", 10, 0, 0.0, 537.0999999999999, 488, 574, 540.5, 573.9, 574.0, 574.0, 1.877581674802854, 71.75699105801728, 6.223523164663914], "isController": true}, {"data": ["DashBoard_Navigation_T02_Login-2", 10, 0, 0.0, 0.3, 0, 1, 0.0, 1.0, 1.0, 1.0, 1.511258878645912, 0.8236656056369956, 0.0], "isController": false}, {"data": ["DashBoard_Navigation_T02_Login-1", 10, 0, 0.0, 756.4, 402, 1169, 784.0, 1155.7, 1169.0, 1169.0, 1.4140271493212668, 38.019240711609164, 1.5018514917986425], "isController": false}, {"data": ["DashBoard_Navigation_T03_ClickOnSetUp", 10, 0, 0.0, 786.4000000000001, 578, 1240, 685.0, 1218.3000000000002, 1240.0, 1240.0, 1.3879250520471893, 83.04671235253296, 5.120955499653019], "isController": true}, {"data": ["DashBoard_Navigation_T10_ClickOnRequestCallBackList", 10, 0, 0.0, 350.3, 237, 660, 288.5, 648.5, 660.0, 660.0, 1.7889087656529516, 100.57580500894454, 1.9174865831842576], "isController": true}, {"data": ["DashBoard_Navigation_T12_ClickOnPrivacyPolicy&Update-1", 10, 0, 0.0, 519.8000000000001, 451, 566, 533.0, 564.3, 566.0, 566.0, 1.89897455374098, 59.293069633023165, 26.542249216672996], "isController": false}, {"data": ["DashBoard_Navigation_T05_ClickOnClosingHours-0", 10, 0, 0.0, 303.0, 251, 422, 294.0, 413.5, 422.0, 422.0, 1.528350909368791, 37.911759227418614, 1.6292459498700902], "isController": false}, {"data": ["DashBoard_Navigation_T12_ClickOnPrivacyPolicy&Update-0", 10, 0, 0.0, 289.9, 256, 424, 274.0, 411.70000000000005, 424.0, 424.0, 1.9596315892612186, 60.87335268469528, 2.085170487948266], "isController": false}, {"data": ["DashBoard_Navigation_T01_HomePage-1", 10, 0, 0.0, 821.4, 640, 1350, 791.5, 1318.5, 1350.0, 1350.0, 1.7152658662092624, 172.98891777444254, 1.5192833404802744], "isController": false}, {"data": ["AddService_T05_FillDetailsClickOK-1-1", 10, 0, 0.0, 392.09999999999997, 228, 907, 271.0, 876.0000000000001, 907.0, 907.0, 2.204585537918871, 133.18581555886246, 2.469824735449736], "isController": false}, {"data": ["DashBoard_Navigation_T08_ClickOnBookings-0", 10, 0, 0.0, 435.6, 264, 1193, 309.0, 1144.4, 1193.0, 1193.0, 1.5351550506601166, 431.83206962887624, 1.6275042216763893], "isController": false}, {"data": ["DashBoard_Navigation_T16_Logout-0", 10, 0, 0.0, 495.2, 443, 541, 522.5, 540.4, 541.0, 541.0, 1.889287738522577, 19.181990069431325, 3.9966553703003966], "isController": false}, {"data": ["AddService_T05_FillDetailsClickOK-1-0", 10, 0, 0.0, 909.3, 691, 1293, 846.5, 1278.0, 1293.0, 1293.0, 1.7995321216483715, 0.806626214684182, 169.33632411822924], "isController": false}, {"data": ["DashBoard_Navigation_T15_ClickOnFooter", 10, 0, 0.0, 537.3, 472, 570, 545.0, 569.4, 570.0, 570.0, 1.8733608092918694, 83.04275506978269, 6.531516368490071], "isController": true}, {"data": ["DashBoard_Navigation_T16_Logout-1", 10, 0, 0.0, 249.9, 213, 274, 262.5, 273.5, 274.0, 274.0, 1.9561815336463224, 19.103335289514867, 2.0681270784428794], "isController": false}, {"data": ["DashBoard_Navigation_T01_HomePage-0", 10, 0, 0.0, 805.7, 739, 865, 809.0, 863.0, 865.0, 865.0, 1.8818216033120059, 18.871509808995107, 1.2055419646217538], "isController": false}, {"data": ["AddService_T05_FillDetailsClickOK", 10, 0, 0.0, 1301.6000000000004, 926, 2200, 1106.0, 2153.9, 2200.0, 2200.0, 1.7155601303825698, 104.41126801338137, 163.35650679790703], "isController": true}, {"data": ["DashBoard_Navigation_T15_ClickOnFooter-0", 10, 0, 0.0, 276.9, 243, 307, 274.0, 306.9, 307.0, 307.0, 1.9719976336028395, 43.630255065568925, 2.092551395188326], "isController": false}, {"data": ["DashBoard_Navigation_T15_ClickOnFooter-1", 10, 0, 0.0, 260.40000000000003, 229, 277, 266.5, 276.9, 277.0, 277.0, 1.9876764062810572, 44.13301592625721, 4.820891721327768], "isController": false}, {"data": ["AddService_T04_ClickonAddService-0", 10, 0, 0.0, 428.5, 220, 841, 276.5, 840.5, 841.0, 841.0, 1.793400286944046, 36.57345655487805, 1.6256192835365855], "isController": false}, {"data": ["DashBoard_Navigation_T14_ClickOnAboutUs-0", 10, 0, 0.0, 271.6, 233, 298, 272.5, 297.0, 298.0, 298.0, 1.9782393669634024, 37.702460435212664, 2.089515331355094], "isController": false}, {"data": ["DashBoard_Navigation_T03_ClickOnSetUp-0", 10, 0, 0.0, 332.2, 250, 714, 285.5, 677.9000000000001, 714.0, 714.0, 1.4494854326714017, 48.48302290186984, 1.5281879620234817], "isController": false}, {"data": ["DashBoard_Navigation_T14_ClickOnAboutUs-1", 10, 0, 0.0, 265.5, 224, 290, 273.5, 289.7, 290.0, 290.0, 1.988466892026248, 38.097394486975546, 4.49075052197256], "isController": false}, {"data": ["DashBoard_Navigation_T03_ClickOnSetUp-1", 10, 0, 0.0, 454.2, 291, 969, 339.5, 941.7, 969.0, 969.0, 1.4380212827149843, 37.944663143514525, 3.789691634311188], "isController": false}, {"data": ["DashBoard_Navigation_T10_ClickOnRequestCallBackList-0", 10, 0, 0.0, 350.3, 237, 660, 288.5, 648.5, 660.0, 660.0, 1.7889087656529516, 100.57580500894454, 1.9174865831842576], "isController": false}, {"data": ["DashBoard_Navigation_T12_ClickOnPrivacyPolicy&Update", 10, 0, 0.0, 809.7, 707, 905, 809.0, 901.2, 905.0, 905.0, 1.775883502042266, 110.6151702073344, 26.711438354643935], "isController": true}, {"data": ["DashBoard_Navigation_T04_ClickOnOpeningHours-0", 10, 0, 0.0, 354.5, 228, 812, 317.0, 766.8000000000002, 812.0, 812.0, 1.5295197308045274, 30.550214849724686, 1.6364666182318752], "isController": false}, {"data": ["AddService_T01_Homepage", 10, 0, 0.0, 1656.0, 1371, 2181, 1574.5, 2165.7, 2181.0, 2181.0, 1.7015484090522377, 189.86073225072317, 2.0770854602688447], "isController": true}, {"data": ["DashBoard_Navigation_T09_ClickOnContactList", 10, 0, 0.0, 284.8, 253, 350, 278.0, 345.5, 350.0, 350.0, 1.7905102954341987, 59.735025458818264, 1.908711951656222], "isController": true}, {"data": ["DashBoard_Navigation_T02_Login", 10, 0, 0.0, 2565.5, 1377, 3453, 2780.0, 3446.6, 3453.0, 3453.0, 1.2507817385866167, 68.57007797842401, 4.043420692620388], "isController": true}, {"data": ["DashBoard_Navigation_T06_ClickOnServices-0", 10, 0, 0.0, 332.4, 252, 512, 305.0, 501.70000000000005, 512.0, 512.0, 1.5342129487572875, 77.33182389153114, 1.6324984657870514], "isController": false}, {"data": ["DashBoard_Navigation_T09_ClickOnContactList-0", 10, 0, 0.0, 284.8, 253, 350, 278.0, 345.5, 350.0, 350.0, 1.7905102954341987, 59.735025458818264, 1.908711951656222], "isController": false}, {"data": ["DashBoard_Navigation_T01_HomePage", 10, 0, 0.0, 1627.1, 1390, 2162, 1615.5, 2129.9, 2162.0, 2162.0, 1.5008254539997, 166.41281611136125, 2.2908107271499323], "isController": true}, {"data": ["AddService_T02_EnterCredentialsckickOK-1-1", 10, 0, 0.0, 548.8, 332, 974, 528.5, 954.0, 974.0, 974.0, 1.7006802721088434, 45.72670865221089, 1.5415736607142858], "isController": false}, {"data": ["AddService_T02_EnterCredentialsckickOK-1-0", 10, 0, 0.0, 1188.4, 531, 1768, 1137.0, 1753.6000000000001, 1768.0, 1768.0, 1.680672268907563, 0.8373818277310924, 1.7054556197478992], "isController": false}, {"data": ["DashBoard_Navigation_T07_ClickOnEPSNomination", 10, 0, 0.0, 547.8, 498, 611, 543.5, 606.8, 611.0, 611.0, 1.4710208884966167, 240.0647191729185, 1.5767505148573109], "isController": true}, {"data": ["DashBoard_Navigation_T11_ClickOnUsers-0", 10, 0, 0.0, 411.7, 348, 563, 394.0, 556.5, 563.0, 563.0, 1.8515089798185522, 414.27531504582487, 1.9592725884095539], "isController": false}, {"data": ["DashBoard_Navigation_T16_Logout", 10, 0, 0.0, 745.1, 657, 815, 785.0, 813.9, 815.0, 815.0, 1.7998560115190785, 35.85070616225702, 5.710324424046076], "isController": true}, {"data": ["DashBoard_Navigation_T02_Login-0-0", 10, 0, 0.0, 1169.0, 539, 1989, 1197.0, 1958.0, 1989.0, 1989.0, 1.3931457230426303, 0.693307676232934, 1.544296592017275], "isController": false}, {"data": ["DashBoard_Navigation_T08_ClickOnBookings", 10, 0, 0.0, 435.6, 264, 1193, 309.0, 1144.4, 1193.0, 1193.0, 1.5351550506601166, 431.83206962887624, 1.6275042216763893], "isController": true}, {"data": ["DashBoard_Navigation_T02_Login-0-1", 10, 0, 0.0, 639.2, 382, 1007, 599.0, 991.7, 1007.0, 1007.0, 1.4245014245014245, 38.30754206730769, 1.5129763176638178], "isController": false}, {"data": ["DashBoard_Navigation_T11_ClickOnUsers", 10, 0, 0.0, 411.7, 348, 563, 394.0, 556.5, 563.0, 563.0, 1.8515089798185522, 414.27531504582487, 1.9592725884095539], "isController": true}, {"data": ["DashBoard_Navigation_T05_ClickOnClosingHours", 10, 0, 0.0, 303.0, 251, 422, 294.0, 413.5, 422.0, 422.0, 1.5285845307245491, 37.917554360287376, 1.629494993885662], "isController": true}, {"data": ["DashBoard_Navigation_T13_ClickOnTerms&Condition&Update", 10, 0, 0.0, 549.3, 454, 601, 567.5, 599.7, 601.0, 601.0, 1.8726591760299625, 116.756093457397, 28.172547986891388], "isController": true}, {"data": ["DashBoard_Navigation_T06_ClickOnServices", 10, 0, 0.0, 332.4, 252, 512, 305.0, 501.70000000000005, 512.0, 512.0, 1.5344483658124903, 77.34369006061071, 1.632748964247353], "isController": true}, {"data": ["DashBoard_Navigation_T16_Logout-0-0", 10, 0, 0.0, 245.70000000000002, 213, 268, 260.0, 267.9, 268.0, 268.0, 1.986886548778065, 0.7683662825352672, 2.102529554937413], "isController": false}, {"data": ["DashBoard_Navigation_T16_Logout-0-1", 10, 0, 0.0, 248.60000000000002, 219, 273, 260.0, 272.4, 273.0, 273.0, 1.9688915140775742, 19.228802114097263, 2.0815644073636546], "isController": false}, {"data": ["AddService_T05_FillDetailsClickOK-1", 10, 0, 0.0, 1301.6000000000004, 926, 2200, 1106.0, 2153.9, 2200.0, 2200.0, 1.7155601303825698, 104.41126801338137, 163.35650679790703], "isController": false}, {"data": ["AddService_T02_EnterCredentialsckickOK-2", 10, 0, 0.0, 624.6999999999999, 338, 910, 660.5, 908.2, 910.0, 910.0, 1.682935038707506, 45.248108012874454, 1.5254885770784248], "isController": false}, {"data": ["AddService_T02_EnterCredentialsckickOK", 10, 0, 0.0, 2362.4000000000005, 1466, 2817, 2338.0, 2802.2, 2817.0, 2817.0, 1.4690759512266784, 80.80219007088292, 4.15401310232114], "isController": true}, {"data": ["AddService_T02_EnterCredentialsckickOK-1", 10, 0, 0.0, 1737.3, 863, 2229, 1952.0, 2218.1, 2229.0, 2229.0, 1.5598190609889253, 42.7164980112307, 2.996710975276868], "isController": false}, {"data": ["AddService_T01_Homepage-1", 10, 0, 0.0, 798.2, 639, 1361, 752.0, 1321.5, 1361.0, 1361.0, 1.968503937007874, 198.52862020177164, 1.4360082431102361], "isController": false}, {"data": ["Debug Sampler", 10, 0, 0.0, 0.4, 0, 1, 0.0, 1.0, 1.0, 1.0, 1.872308556450103, 1.3669315203145478, 0.0], "isController": false}, {"data": ["AddService_T01_Homepage-0", 10, 0, 0.0, 857.5, 715, 1388, 797.5, 1341.6000000000001, 1388.0, 1388.0, 1.9083969465648853, 19.13932043177481, 0.9374254532442747], "isController": false}, {"data": ["AddService_T03_ClickServices", 10, 0, 0.0, 352.59999999999997, 231, 757, 305.0, 726.0000000000001, 757.0, 757.0, 1.783166904422254, 98.1025641382846, 1.6198260297788873], "isController": true}, {"data": ["AddService_T01_Homepage-4", 10, 0, 0.0, 0.3, 0, 1, 0.0, 1.0, 1.0, 1.0, 2.311604253351826, 1.6172200069348128, 0.0], "isController": false}, {"data": ["AddService_T03_ClickServices-0", 10, 0, 0.0, 352.59999999999997, 231, 757, 305.0, 726.0000000000001, 757.0, 757.0, 1.783166904422254, 98.1025641382846, 1.6198260297788873], "isController": false}, {"data": ["DashBoard_Navigation_T07_ClickOnEPSNomination-0", 10, 0, 0.0, 547.8, 498, 611, 543.5, 606.8, 611.0, 611.0, 1.4712373105781962, 240.10003839009858, 1.5769824922760043], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 420, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
