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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9542857142857143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=499086A51F8702AA0339C7E37DA55F12"], "isController": false}, {"data": [1.0, 500, 1500, "AddToCart"], "isController": true}, {"data": [1.0, 500, 1500, "ClickOnRandomProduct"], "isController": true}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=5CFE03FFE2C0DBCA7FD2AE0CB6914D14"], "isController": false}, {"data": [1.0, 500, 1500, "-47 /actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=0A089E951BD8A8308D67C3333937271E"], "isController": false}, {"data": [1.0, 500, 1500, "-49 /actions/Cart.action"], "isController": false}, {"data": [1.0, 500, 1500, "ClickOnRandomPet"], "isController": true}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=5FE41383ADF9EAEBF645FF54A4A29143"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=B31AAD9BD4E52B98655720607F7BD92D"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=4EB4FF8964DBDC36CBFE11136A6F16D9"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=0344969EDCB0BDDED76865BBE64B3DC4"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=DCB362797900E77C77E42BED89D4AC66"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=21B074C2A69E6F893B275DC6BAD108D7"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=6250B8F0DEA8D0E243F4638FCD8EBD90"], "isController": false}, {"data": [1.0, 500, 1500, "-23 /images/logo-topbar.svg"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=245AF05EDD07234E286A6519345E7597"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=40BE8ADF65B63EFA4E4DAF9CB9BD11EF"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=7C14E77BE084C0C3C3661E9FEA2036D9"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=09FA130E470CE49A6E45599D6A9715C1"], "isController": false}, {"data": [0.46, 500, 1500, "Homepage"], "isController": true}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=005EF80D4574AB3790E4C369883166F1"], "isController": false}, {"data": [1.0, 500, 1500, "ProceedToCheckOut"], "isController": true}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=9A687B5B7E756453090606DCDB935438"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=DC5552BA6AE6F8E202C6FE377FD2C158"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=F75F6FF57D5FB7FB20B1C4B6A89EB629"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=14747D56CC6E0171026210E17B5D3860"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=F0C0F8D5E21E01B80B0A8EB61CF1C1A4"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=24FDCC1256C52B06A6132FCC90C90247"], "isController": false}, {"data": [1.0, 500, 1500, "ClickOnRandomItem"], "isController": true}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=7FC3175F20DAD20FAB6413BB54FD1DFD"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=5E150CA21E6B846D7592746515FD772C"], "isController": false}, {"data": [0.9, 500, 1500, "-13 /actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=622519BD635A1546BE51AAFFCDC88188"], "isController": false}, {"data": [1.0, 500, 1500, "-42 /actions/Catalog.action;jsessionid=6EC9EB9778A4FB684CE31AFA2C39FFB7"], "isController": false}, {"data": [1.0, 500, 1500, "-46 /actions/Catalog.action"], "isController": false}, {"data": [1.0, 500, 1500, "-53 /actions/Order.action"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 200, 0, 0.0, 172.64499999999992, 0, 1757, 137.0, 426.40000000000003, 432.95, 1438.0000000000036, 17.946877243359655, 41.63035812432699, 9.631111051911342], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["-42 /actions/Catalog.action;jsessionid=499086A51F8702AA0339C7E37DA55F12", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 12.182790336879433, 4.765070921985816], "isController": false}, {"data": ["AddToCart", 25, 0, 0.0, 137.64, 132, 144, 137.0, 142.4, 143.7, 144.0, 3.0697445972495085, 6.389985150110511, 2.0055264995702355], "isController": true}, {"data": ["ClickOnRandomProduct", 25, 0, 0.0, 136.64000000000004, 132, 145, 137.0, 139.4, 143.5, 145.0, 3.072007864340133, 5.316493610223643, 2.160005529614156], "isController": true}, {"data": ["-42 /actions/Catalog.action;jsessionid=5CFE03FFE2C0DBCA7FD2AE0CB6914D14", 1, 0, 0.0, 137.0, 137, 137, 137.0, 137.0, 137.0, 137.0, 7.299270072992701, 11.918339416058393, 4.911325273722627], "isController": false}, {"data": ["-47 /actions/Catalog.action", 25, 0, 0.0, 135.92, 131, 140, 136.0, 139.0, 139.7, 140.0, 3.072385400024579, 5.257259470627996, 2.0072517896644952], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=0A089E951BD8A8308D67C3333937271E", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 12.340198863636363, 5.097360321969696], "isController": false}, {"data": ["-49 /actions/Cart.action", 25, 0, 0.0, 137.64, 132, 144, 137.0, 142.4, 143.7, 144.0, 3.0697445972495085, 6.389985150110511, 2.0055264995702355], "isController": false}, {"data": ["ClickOnRandomPet", 25, 0, 0.0, 138.2, 132, 160, 136.0, 148.20000000000002, 157.0, 160.0, 3.072007864340133, 5.081893009646104, 2.0676052930695503], "isController": true}, {"data": ["-42 /actions/Catalog.action;jsessionid=5FE41383ADF9EAEBF645FF54A4A29143", 1, 0, 0.0, 150.0, 150, 150, 150.0, 150.0, 150.0, 150.0, 6.666666666666667, 11.451822916666668, 4.479166666666667], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=B31AAD9BD4E52B98655720607F7BD92D", 1, 0, 0.0, 141.0, 141, 141, 141.0, 141.0, 141.0, 141.0, 7.092198581560283, 11.580230496453902, 4.771996897163121], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=4EB4FF8964DBDC36CBFE11136A6F16D9", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 11.642020089285714, 4.827008928571428], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=0344969EDCB0BDDED76865BBE64B3DC4", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 12.15676700367647, 4.940257352941176], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=DCB362797900E77C77E42BED89D4AC66", 1, 0, 0.0, 140.0, 140, 140, 140.0, 140.0, 140.0, 140.0, 7.142857142857142, 11.648995535714285, 4.827008928571428], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=21B074C2A69E6F893B275DC6BAD108D7", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 12.163304570895521, 5.043143656716418], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=6250B8F0DEA8D0E243F4638FCD8EBD90", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 11.824898097826086, 4.875735960144927], "isController": false}, {"data": ["-23 /images/logo-topbar.svg", 25, 0, 0.0, 137.88000000000002, 133, 148, 137.0, 142.8, 146.8, 148.0, 3.0716304214276935, 21.16845301173363, 1.4998195417127413], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=245AF05EDD07234E286A6519345E7597", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 12.171128216911764, 4.940257352941176], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=40BE8ADF65B63EFA4E4DAF9CB9BD11EF", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 13.006036931818182, 5.089962121212121], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=7C14E77BE084C0C3C3661E9FEA2036D9", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 11.977251838235293, 4.9689797794117645], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=09FA130E470CE49A6E45599D6A9715C1", 1, 0, 0.0, 147.0, 147, 147, 147.0, 147.0, 147.0, 147.0, 6.802721088435374, 11.107568027210885, 4.597151360544218], "isController": false}, {"data": ["Homepage", 25, 0, 0.0, 695.1599999999999, 548, 1903, 571.0, 1350.000000000001, 1810.8999999999999, 1903.0, 2.363842662632375, 22.205254674498864, 2.287664139324886], "isController": true}, {"data": ["-42 /actions/Catalog.action;jsessionid=005EF80D4574AB3790E4C369883166F1", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 12.841068097014924, 5.013992537313433], "isController": false}, {"data": ["ProceedToCheckOut", 25, 0, 0.0, 137.6, 132, 152, 137.0, 141.60000000000002, 149.6, 152.0, 3.071253071253071, 6.098956733722359, 1.9735200399262898], "isController": true}, {"data": ["-42 /actions/Catalog.action;jsessionid=9A687B5B7E756453090606DCDB935438", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 12.367362406716417, 5.013992537313433], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=DC5552BA6AE6F8E202C6FE377FD2C158", 1, 0, 0.0, 135.0, 135, 135, 135.0, 135.0, 135.0, 135.0, 7.407407407407407, 12.275752314814815, 4.976851851851851], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=F75F6FF57D5FB7FB20B1C4B6A89EB629", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 11.846127717391303, 4.875735960144927], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=14747D56CC6E0171026210E17B5D3860", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 12.185489430147058, 4.940257352941176], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=F0C0F8D5E21E01B80B0A8EB61CF1C1A4", 1, 0, 0.0, 136.0, 136, 136, 136.0, 136.0, 136.0, 136.0, 7.352941176470588, 12.192670036764705, 4.940257352941176], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=24FDCC1256C52B06A6132FCC90C90247", 1, 0, 0.0, 132.0, 132, 132, 132.0, 132.0, 132.0, 132.0, 7.575757575757576, 12.34759706439394, 5.097360321969696], "isController": false}, {"data": ["ClickOnRandomItem", 25, 0, 0.0, 135.92, 131, 140, 136.0, 139.0, 139.7, 140.0, 3.072385400024579, 5.257259470627996, 2.0072517896644952], "isController": true}, {"data": ["Debug Sampler", 25, 0, 0.0, 1.3599999999999997, 0, 8, 1.0, 5.400000000000002, 7.399999999999999, 8.0, 3.125, 1.498779296875, 0.0], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=7FC3175F20DAD20FAB6413BB54FD1DFD", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 12.00888813405797, 4.8686594202898545], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=5E150CA21E6B846D7592746515FD772C", 1, 0, 0.0, 160.0, 160, 160, 160.0, 160.0, 160.0, 160.0, 6.25, 10.186767578125, 4.2236328125], "isController": false}, {"data": ["-13 /actions/Catalog.action", 25, 0, 0.0, 555.9200000000001, 414, 1757, 432.0, 1202.000000000001, 1662.4999999999998, 1757.0, 2.394865408564039, 4.843615288820768, 1.148319253520452], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=622519BD635A1546BE51AAFFCDC88188", 1, 0, 0.0, 138.0, 138, 138, 138.0, 138.0, 138.0, 138.0, 7.246376811594203, 12.001811594202897, 4.8686594202898545], "isController": false}, {"data": ["-42 /actions/Catalog.action;jsessionid=6EC9EB9778A4FB684CE31AFA2C39FFB7", 1, 0, 0.0, 134.0, 134, 134, 134.0, 134.0, 134.0, 134.0, 7.462686567164179, 12.374650186567164, 5.013992537313433], "isController": false}, {"data": ["-46 /actions/Catalog.action", 25, 0, 0.0, 136.64000000000004, 132, 145, 137.0, 139.4, 143.5, 145.0, 3.072007864340133, 5.316493610223643, 2.160005529614156], "isController": false}, {"data": ["-53 /actions/Order.action", 25, 0, 0.0, 137.6, 132, 152, 137.0, 141.60000000000002, 149.6, 152.0, 3.071253071253071, 6.098956733722359, 1.9735200399262898], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 200, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
