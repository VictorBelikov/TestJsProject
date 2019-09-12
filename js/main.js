$(document).ready(function() {
  $('#next').click(function() {
    $pdk.controller.next(true);
  });

  $('#prev').click(function() {
    $pdk.controller.previous(true);
  });
});
