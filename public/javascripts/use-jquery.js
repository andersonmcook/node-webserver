$( document ).ready(function() {
    console.log( "ready!" );

  $("h1").hover(function () {
    $("#tag").fadeToggle("slow", "linear");
  });

});
