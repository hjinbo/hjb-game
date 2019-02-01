$(function() {
    var level = {1: 3, 2: 4, 3: 5, 4: 6};
    var imgs = ["img/white.jpg", "img/dog.jpg"];
    var times = 0;
    var firstClickId;
    var secondClickId;
    var correctOrder = [];
    var num;
    var index = 1;
    var position = new Array();
    var picIndex = 0;
    var status = 0; // 0 表示初始化，1 表示已选择完图片，2 表示开始了， 3 表示结束

    init(status);

    function init(status) {
        num = level[index];
        // 计算背景图片位置
        var width = -450 / num;
        for (var i = 0; i < num; i++) {
            position[i] = new Array();
            for (var j = 0; j < num; j++) {
                position[i][j] = {x: j * width, y: i * width};
            }
        }
        for (var i = 0; i < num; i++) {
            correctOrder[i] = new Array();
            for (var j =0; j < num; j++) {
                correctOrder[i][j] = position[i][j];
            }
        }
        clear();
        // 随机打乱图片碎片
        randomImg(num);
        $("<div class='board-" + num + "'></div>").appendTo(".boardBackground");
        $(".boardBackground").css("width", $(".board-" + num).css("width"));
        $(".boardBackground").css("height", $(".board-" + num).css("height"));
        if (status !== 2) {
            $(".originPicDiv").addClass("ash");
            $(".board-" + num).addClass("ash");
        }
        // 生成num个div填充到board中
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < num; j++) {
                $("<div id='" + i + "-" + j + "' class='eachPic-" + num + "'  style='background-image: url(" + imgs[picIndex] + "); background-position: " + position[i][j].x + "px " + position[i][j].y + "px;'></div>").appendTo($(".board-" + num));
            }
            // $("<div id='" + i + "' class='eachPic' style='background-image: " + imgs[i] + ";'></div>").appendTo($(".board"));
        }
        
        
    }

    function randomsort() {
        return Math.random() > 0.5 ? -1 : 1;
    }

    function randomImg(num) {
        // 先将二维数组position中的值取出，放入一维数组，打乱一维数组，再组装成二维数组
        var tmp = new Array(num * num);
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < num; j++) {
                tmp.push(position[i][j]);
            }
            tmp.sort(randomsort);
        }
        for (var i = 0; i < num * num; i++) {
            position[Math.floor(i / num)][i % num] = tmp[i]; 
        }
    }

    function clear() {
        $(".boardBackground").empty();
    }

    function changePostion(firstClickId, secondClickId) {
        // 交换其中图片的url
        var firstPosition = $("#" + firstClickId).css("background-position");
        var secondPosition = $("#" + secondClickId).css("background-position");
        $("#" + firstClickId).css("background-position", secondPosition);
        $("#" + secondClickId).css("background-position", firstPosition);
        // 同时改变position对应的值
        var tmp = position[secondClickId.split("-")[0]][secondClickId.split("-")[1]];
        position[secondClickId.split("-")[0]][secondClickId.split("-")[1]] = position[firstClickId.split("-")[0]][firstClickId.split("-")[1]];
        position[firstClickId.split("-")[0]][firstClickId.split("-")[1]] = tmp;
    }
    
    function validateWin() {
        for (var i = 0; i < num; i++) {
            for (var j = 0; j < num; j++) {
                if (correctOrder[i][j] !== position[i][j]) {
                    return;
                }
            }
        }
        // layer.msg("you win");
        index++;
        init(status);
    }

    $(".eachPic-" + num).click(function () {
        console.log("status:" + status);
        if (status === 2) {
            // 给第一个点击的div加上class
            if (times === 0) {
                $(this).addClass("eachPic-clicked");
                firstClickId = $(this).attr("id");
                times = 1;
            } else if (times === 1) {
                secondClickId = $(this).attr("id");
                times = 0;
                // 交换位置
                changePostion(firstClickId, secondClickId);
                // 去掉增加的class
                $("#" + firstClickId).removeClass("eachPic-clicked");
                // 校验是否完成拼图
                validateWin();
            }
        }
    });

    $(".reset").click(function () {
        if (status === 2) {
            clear();
            // 随机打乱图片碎片
            randomImg(num);
            $("<div class='board-" + num + "'></div>").appendTo(".boardBackground");
            $(".boardBackground").css("width", $(".board-" + num).css("width"));
            $(".boardBackground").css("height", $(".board-" + num).css("height"));
            if (status !== 2) {
                $(".originPicDiv").addClass("ash");
                $(".board-" + num).addClass("ash");
            }
            // 生成num个div填充到board中
            for (var i = 0; i < num; i++) {
                for (var j = 0; j < num; j++) {
                    $("<div id='" + i + "-" + j + "' class='eachPic-" + num + "'  style='background-image: url(" + imgs[picIndex] + "); background-position: " + position[i][j].x + "px " + position[i][j].y + "px;'></div>").appendTo($(".board-" + num));
                }
                // $("<div id='" + i + "' class='eachPic' style='background-image: " + imgs[i] + ";'></div>").appendTo($(".board"));
            }
        }
    });

    $(".chooseMemory").click(function () {
        status = 1;
    });

    $(".openMemory").click(function () {
        status = 2;
        picIndex = 1;
        $(".originPicDiv").removeClass("ash");
        $(".originPic").attr("src", imgs[picIndex]);
        $(".eachPic-" + num).css("background-image", "url(" + imgs[picIndex] + ")");
        $(".board-" + num).removeClass("ash");
        $(".table").addClass("cancelTableStyle");
        $(".boardBackground").removeClass("endAnimate");
        $(".boardBackground").addClass("beginAnimate");
        
    });

    $(".frozenMemory").click(function () {
        status = 3;
        picIndex = 0;
        $(".boardBackground").removeClass("beginAnimate");
        $(".boardBackground").addClass("endAnimate");
        $(".table").removeClass("cancelTableStyle");
        setTimeout(function () {
            $(".originPicDiv").addClass("ash");
            $(".board-" + num).addClass("ash");
        }, 2000);
    });
})