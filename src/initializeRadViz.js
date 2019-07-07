let path = "";
$(document).ready(function(){
    $('input[type=file]').change(function () {
        var fileName = this.files[0].name;
        if(fileName == "iris.data.csv"){
            path = './data/iris.data.csv';
        }else if(fileName == 'winequality-red.csv'){
            path = './data/winequality-red.csv';
        }else{
            path = fileName;
        }
  })

  $('.save-changes').click(function(){
    if($('#iris-data-set-checkbox').is(':checked')){
        path = './data/iris.data.csv';
    }
    if($('#wine-data-set-checkbox').is(':checked')){
        path = './data/winequality-red.csv';
    }
  })

  $('.settings').click(function(){
      if(path){
        $('#select-feature').modal('toggle');
      }else{
          alert("please select a dataset first!");
      }
  })
})

