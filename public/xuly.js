var socket = io("http://localhost:3000");
socket.on("sever-Send-dki-thatbai",function(){
  alert("Ten nay co nguoi su dung");
});
//=======================================================
socket.on("server-send-danhsach-user",function(data){
  $("#boxContent").html("");
  data.forEach(function (i) {
    $("#boxContent").append("<div id = 'uSer'>" + i + "</div>");
  });

});
//=======================================================
socket.on("sever-Send-dki-thanhcong",function (data) {
  $("#currentUser").html(data);
  $("#loginFrom").hide(1000);
  $("#chatFrom").show(2000);

})
//=======================================================
socket.on("load-old-mess",function(docs){
  for (var i = 0; i < docs.length; i++) {
    displayMsg(docs[i]);
  }
});

//=======================================================
socket.on("server-Send-messages",function(data){
  displayMsg(data);
});
//=======================================================
function displayMsg(data){
  $("#listMessages").append("<div = 'msg' >"+ data.nick + ":" + data.msg + "</div>");

}
//=======================================================
socket.on("mouse-Focus",function(data){
  $("#thongbao").html(data);
});
//=======================================================
socket.on("mouse-Focus-Out",function(data){
  $("#thongbao").html("");
});
//==============================================================
socket.on("server-Send-rooms",function(data){
  $("#listRoom").html("");
  data.map(function(r){
    $("#listRoom").append("<div class='phong'>" + r + "</div>")
  });
});
//==============================================================
socket.on("server-Send-roomscanhan", function(data){
  $("#inTheroom").html(data);
});
//===============================================================
socket.on("server-Chat-rooms",function(data){
  $("#listMessagesgroup").append("<div class= 'msr' >"+ data.nick + ":" + data.msg + "</div>");
});
//=======================================================
socket.on("mouse-Focus-rooms",function(data){
  $("#thongbaorooms").html(data);
});
//=======================================================
socket.on("mouse-Focus-Out-rooms",function(data){
  $("#thongbaorooms").html("");
});
$(document).ready(function(){
  $("#loginFrom").show();
  $("#chatFrom").hide();
  $("#roomFrom").hide();
  $("#txtMessages").focusin(function(){
    socket.emit("mouse-Focus");
  });
  $("#txtMessages").focusout(function(){
    socket.emit("mouse-Focus-Out");
  });
  $("#btRegister").click(function(){
    socket.emit("client-Send-username", $("#txtUsername").val());
  });
  $("#btLogout").click(function(){
    socket.emit("logOut");
    $("#chatFrom").hide(2000);
    $("#loginFrom").show(1000);
    $("#roomFrom").hide();
  });
  $("#btMessages").click(function(){
    socket.emit("user-Send-messages",$("#txtMessages").val());
    $("#txtMessages").val("");
  });
  $("#btrooms").click(function(){
    socket.emit("create-Rooms",$("#txtrooms").val());
  });
  $("#btnChat").click(function(){
    socket.emit("user-Chat-rooms",$("#txtMessagesroom").val());
  });
  $("#bttaoroom").click(function(data){
    $("#currentUser").html(data);
    $("#chatFrom").hide(2000);
    $("#roomFrom").show(1000);

  });
  $("#txtMessagesroom").focusin(function(){
    socket.emit("mouse-Focus-rooms");
  });
  $("#txtMessagesroom").focusout(function(){
    socket.emit("mouse-Focus-Out-rooms");
  });

});
