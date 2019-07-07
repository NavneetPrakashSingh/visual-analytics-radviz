/*
| Flow of program: index.js -> RadViz.js -> RadVizPlotting.js
*/


dataFromDataSet = "";
targetField = "";
completeData="";
selectedColor = "";
selectedHeight = "";
selectedWidth ="";

$(document).ready(function(){
    $('.save-changes').click(function(){
        if(path){
            $('.message-visualize').hide();
            $('#select-file').modal('toggle');
            $('.radViz').html('');
            initializeGraph();
        }else{
            alert("Path not specified, please specify path to visualize");
        }
    })

    function initializeGraph(){
        d3.csv(path, function(error, data) {
            console.log(data);
            if(error) throw(error);
            $('#select-feature').modal('toggle');
            $('.modal-body-feature').html("");
            // d3.keys(data[0])
            var finalValueToBeAppended = "<form id=\"form1\">";
            for (var items in data[0]){
                finalValueToBeAppended += "<div><input type=\"radio\" id=\""+items+"\" name=\"dataSet\" value=\""+items+"\"><label for=\""+items+"\">"+items+"</label></div>";
            }
            finalValueToBeAppended += "</form>";
            $('.modal-body-feature').append(finalValueToBeAppended);
            dataFromDataSet = data;
        }); 
    }

    $('.save-changes-feature').click(function(){
        $('.radViz').html('');
        getSelectedValue = document.getElementById("form1");
        targetField = getSelectedValue.elements["dataSet"].value;

        getSelectedColor = document.getElementById("select-color");
        selectedColor = getSelectedColor.elements["color"].value;

        if($('.height-value').val()){
            selectedHeight = $('.height-value').val();
        }else{
            selectedHeight = 750;
        }
        
        if($('.width-value').val()){
            selectedWidth = $('.width-value').val();
        }else{
            selectedWidth = 1200;
        }
        plotRadViz();
    })

    function plotRadViz(){
        featureDataSet=[];
        dataFromDataSet.columns.forEach(function(data){
            if(data == targetField){
                // continue;
            }else{
                featureDataSet.push(data);
            }
        });
        $('#select-feature').modal('toggle');
        completeData = dataFromDataSet;
        delete(dataFromDataSet[targetField]);
        const IDtable = document.querySelector('#data-table');
        const IDradviz = document.querySelector('#radviz');
        const titles = d3.keys(completeData[0]);
        const colorAccessor = function(d){ return d[targetField]; };
        const dimensions = featureDataSet;
        const dimensionAnchor = Array.apply(null, {length: dimensions.length}).map(Number.call, Number).map(x=>x*2*Math.PI/(dimensions.length)); // intial DA configration;
        

        RadViz()
        .DOMRadViz(IDradviz)
        .TableTitle(titles)
        .ColorAccessor(colorAccessor)
        .Dimensionality(dimensions)
        .DAnchor(dimensionAnchor)
        .DATA(dataFromDataSet)
        .call();
    }
})

	
    