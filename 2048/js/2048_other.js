$(function() {

    var useAnimation = false;

    $(".music").click(function() {
        var player = document.getElementById("bgMusic"); // 只能用原生js
        player.pause();
        if (useAnimation) {
            $(this).attr("class", "music");
            player.pause();
            useAnimation = false;
        } else {
            $(this).attr("class", "music layui-anim layui-anim-scaleSpring layui-anim-loop");
            player.play();
            useAnimation = true;
        }
    });
})