$( document ).ready(function() {
    console.log( "ready!" );

  $(".logo").fadeIn(2000, "swing");

  $("h1").hover(function () {
    $("#tag").fadeToggle(1000, "swing");
  });

});
