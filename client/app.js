let socket = io();

$("form").on("submit", function () {
  let text = $("#message").val();
  let name = $("#initials").val();
  socket.emit("message", name + " says: " + text);
  $("#message").val("");
  $("#initials").val("");

  return false;
});

socket.on("message", function (msg) {
  $("<li>").text(msg).appendTo("#history");
});
