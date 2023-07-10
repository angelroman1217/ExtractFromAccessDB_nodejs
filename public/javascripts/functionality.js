$(function() {
  $("#export").click(function(){
    makeProcess();
  });
  $("#addCollections").click(function(){
    getAPI('addcollections');
  });
});

function makeProcess() {
  var path = $("#formFileMultiple").val();
  var tipo = $('input[name=options]:checked').val();
  if (path != "") {
    if (path.includes("\\")) {      
      getAPI('initial?ruta='+path+'&tipo='+tipo);
    } else {
      alert("La ruta de los archivos debe contener backslash ( \\ )")
    }    
  } else {
    alert("Se debe escribir la ruta de la carpeta")
  }
}

async function getAPI(path) {
  var url = 'http://localhost:5500/'+path;
  $("#formFileMultiple").prop("disabled", true)
  $("#export").prop("disabled", true)
  $("#run").prop("disabled", true)
  $("#img-area").css("display","block")
  fetch(url)
  .then((response) => response.json())
  .then((data) => {
    if (data.result == "success") {
      $("#img-area").css("display","none");
      $("#completed").css("display","block");
      $("#formFileMultiple").prop("disabled", false);
      $("#export").prop("disabled", false);
      $("#run").prop("disabled", false);
      setTimeout(() => {
        $("#completed").css("display","none")
      }, 5000);
    } else if(data.result == "error") {
      alert("Error en la inserción: Verifica la ruta de los archivos");
      $("#img-area").css("display","none");
      $("#formFileMultiple").prop("disabled", false);
      $("#export").prop("disabled", false);
      $("#run").prop("disabled", false);
    } else {
      alert("Error en la inserción");
      $("#img-area").css("display","none");
      $("#formFileMultiple").prop("disabled", false);
      $("#export").prop("disabled", false);
      $("#run").prop("disabled", false);
    }
  });
}