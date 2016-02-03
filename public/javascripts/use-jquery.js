$( document ).ready(function() {
    console.log( "ready!" );

  $("h1").click(function () {
    console.log("clicked on h1");
    $("#tag").show();
  });

});
