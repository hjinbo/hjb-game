$(function() {

    var board = new Array();
    var score = 0;
    var best = 0;
    var hasConflict = new Array(); // 此变量用于下移和右移时，只进行一次merge操作；
    var count = 0; // 此变量用于记录一次游戏出现65536后的次数；

    startGame();

    // new game
    $("#new-game").click(function() {
        startGame();
        $(this).css("display", "none");
        setTimeout(function() {
            $("#new-game").css("display", "");
        }, 500);
    });

    document.addEventListener("keydown",keydown);
    function keydown(event){
        //表示键盘监听所触发的事件，同时传递参数event
        switch(event.keyCode){
            case 37:
                moveLeft(board);
                break;
            case 38:
                moveUp(board);
                break;
            case 39:
                moveRight(board);
                break;
            case 40:
                moveDown(board);
                break;
            default:
                break;
        }
        setTimeout(function() {
            refresh(board);
        }, 200);
        // 判断是否胜利
        if (isGameWin(board)) {
            count > 3 ? layer.msg("you find a bug! click to fix it up.", {
                time: 10 * 1000,
                btn: ["哦"]
            }) : layer.msg("you win!");
            count++;
        } else {
            // 判断是否结束
            isGameOver(board) ? layer.msg("game over.") : "";
        }
    }

    function startGame () {
        initBoard();
        // 重置得分
        score = 0;
        $("#score").html(score);
    }

    function initConflict () {
        for (var m = 0; m < 4; m++) {
            hasConflict[m] = new Array();
            for (var n = 0; n < 4; n++) {
                hasConflict[m][n] = false;
            }
        }
    }

    function initBoard () {
        // 先清空所有生成的span
        $(".chessman").empty();
        // 重置num-div的class
        $(".num-div").attr("class", "num-div");
        // 生成board二维数组
        for (var i = 0; i < 4; i++) {
            board[i] = new Array();
            for (var j = 0; j < 4; j++) {
                board[i][j] = 0;
            }
        }
        // 再随机生成两个数
        randomNum(board);
        randomNum(board);
        // board = [
        //     [2, 0, 0, 2],
        //     [2, 0, 0, 0],
        //     [0, 0, 0, 0],
        //     [4, 0, 0, 0]
        // ];
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] !== 0) {
                    var idSelector = "#" + i + "-" + j;
                    $(idSelector).html("<div class='num-div n" + i + "-" + j + "'><span>" + board[i][j] + "</span></div>");
                    // 同时还要改变数字背景div的颜色
                    var numTmp = ".n" + i + "-" + j;
                    var srcClass = "num-div n" + i + "-" + j;
                    switch (board[i][j]) {
                        case 2:
                            $(numTmp).attr("class", srcClass + " n2");
                            $(numTmp + " span").attr("style", "color: #776e65;");
                            break;
                        case 4:
                            $(numTmp).attr("class", srcClass + " n4");
                            $(numTmp + " span").attr("style", "color: #776e65;");
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }

    function refresh (board) {
        // 每次刷新都先清空现有span
        $(".chessman").empty();
        // 重置num-div的class
        $(".num-div").attr("class", "num-div");
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] !== 0) {
                    var idSelector = "#" + i + "-" + j;
                    $(idSelector).html("<div class='num-div n" + i + "-" + j + "'><span>" + board[i][j] + "</span></div>");
                    // 同时还要刷新样式
                    var numTmp = ".n" + i + "-" + j;
                    var srcClass = "num-div n" + i + "-" + j;
                    switch (board[i][j]) {
                        case 2:
                            $(numTmp).attr("class", srcClass + " n2");
                            $(numTmp + " span").attr("style", "color: #776e65;");
                            break;
                        case 4:
                            $(numTmp).attr("class", srcClass + " n4");
                            $(numTmp + " span").attr("style", "color: #776e65;");
                            break;
                        case 8:
                            $(numTmp).attr("class", srcClass + " n8");
                            break;
                        case 16:
                            $(numTmp).attr("class", srcClass + " n16");
                            break;
                        case 32:
                            $(numTmp).attr("class", srcClass + " n32");
                            break;
                        case 64:
                            $(numTmp).attr("class", srcClass + " n64");
                            break;
                        case 128:
                            $(numTmp).attr("class", srcClass + " n128");
                            break;
                        case 256:
                            $(numTmp).attr("class", srcClass + " n256");
                            break;
                        case 512:
                            $(numTmp).attr("class", srcClass + " n512");
                            break;
                        case 1024:
                            $(numTmp).attr("class", srcClass + " n1024");
                            break;
                        case 2048:
                            $(numTmp).attr("class", srcClass + " n2048");
                            break;
                        case 4096:
                            $(numTmp).attr("class", srcClass + " n4096");
                            break;
                        case 8192:
                            $(numTmp).attr("class", srcClass + " n8192");
                            break;
                        case 16384:
                            $(numTmp).attr("class", srcClass + " n16384");
                            break;
                        case 32768:
                            $(numTmp).attr("class", srcClass + " n32768");
                            break;
                        case 65536:
                            $(numTmp).attr("class", srcClass + " n65536");
                            $(numTmp + " span").attr("style", "color: #ffffff;");
                            break;
                        default:
                            break;
                    }
                }
            }
        }
        $("#score").html(score);
        $("#best").html(best);
    }

    // 下面方法为游戏主逻辑
    function canMoveUp (board) {
        // 不考虑第一行
        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] !== 0) {
                    if (board[i - 1][j] === 0 || board[i - 1][j] === board[i][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function canMoveDown (board) {
        // 不考虑第四行
        for (var i = 2; i >= 0; i--) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] !== 0) {
                    if (board[i + 1][j] === 0 || board[i + 1][j] === board[i][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function canMoveLeft (board) {
        // 不考虑第一列
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                if (board[i][j] !== 0) {
                    if (board[i][j - 1] === 0 || board[i][j - 1] === board[i][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    function canMoveRight (board) {
        // 不考虑第四列
        for (var i = 0; i < 4; i++) {
            for (var j = 2; j >= 0; j--) {
                if (board[i][j] != 0) {
                    if (board[i][j + 1] === 0 || board[i][j + 1] === board[i][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    }


    function noBlockHorizontal (row, col1, col2, board) {
        var minCol = col1 < col2 ? col1 : col2;
        var maxCol = col1 >= col2 ? col1 : col2;
        for (var j = minCol + 1; j < maxCol; j++) {
            if (board[row][j] !== 0) {
                return false;
            }
        }
        return true;
    }

    function noBlockVertical (col, row1, row2, board) {
        var minRow = row1 < row2 ? row1 : row2;
        var maxRow = row1 >= row2 ? row1 : row2;
        for (var i = minRow + 1; i < maxRow; i++) {
            if (board[i][col] !== 0) {
                return false;
            }
        }
        return true;
    }

    function moveUp (board) {
        if (!canMoveUp(board)) {
            return;
        }
        initConflict();
        for (var i = 1; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                for (var t = 0; t < i; t++) {
                    if (board[t][j] === 0 && noBlockVertical(j, t, i, board)) {
                        board[t][j] = board[i][j];
                        board[i][j] = 0;
                        moveAnim(i, j, t, j);
                        setTimeout(function() {
                            removeDiv(i, j);
                        }, 200);
                    } else if (board[t][j] === board[i][j] && noBlockVertical(j, t, i, board) && !hasConflict[t][j]) {
                        board[t][j] = board[i][j] * 2;
                        board[i][j] = 0;
                        hasConflict[t][j] = true;
                        moveAnim(i, j, t, j);
                        var desDivClass = ".n" + t + "-" + j;
                        // $(desDivClass).addClass("pop" + t + "-" + j);
                        setTimeout(function() {
                            removeDiv(i, j);
                        }, 200);
                        score += board[t][j];
                        best = best > score ? best : score;
                    }
                }
            }
        }
        setTimeout(function() {
            randomNum(board);
        }, 200);
    }

    function moveDown (board) {
        if (!canMoveDown(board)) {
            return;
        }
        initConflict();
        for (var i = 2; i >= 0; i--) {
            for (var j = 0; j < 4; j++) {
                for (var t = 3 ; t > i; t--) {
                    if (board[t][j] === 0 && noBlockVertical(j, i, t, board)) {
                        board[t][j] = board[i][j];
                        board[i][j] = 0;
                        moveAnim(i, j, t, j);
                        setTimeout(function() {
                            removeDiv(i, j);
                        }, 200);
                    } else if (board[t][j] === board[i][j] && noBlockVertical(j, i, t, board) && !hasConflict[t][j]) {
                        board[t][j] = board[i][j] * 2;
                        board[i][j] = 0;
                        hasConflict[t][j] = true;
                        moveAnim(i, j, t, j);
                        var desDivClass = ".n" + t + "-" + j;
                        // $(desDivClass).addClass("pop" + t + "-" + j);
                        setTimeout(function() {
                            removeDiv(i, j);
                        }, 200);
                        score += board[t][j];
                        best = best > score ? best : score;
                    }
                }
            }
        }
        setTimeout(function() {
            randomNum(board);
        }, 200);
    }

    function moveLeft (board) {
        if (!canMoveLeft(board)) {
            return;
        }
        initConflict();
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j < 4; j++) {
                for (var t = 0; t < j; t++) {
                    if (board[i][t] === 0 && noBlockHorizontal(i, j, t, board)) {
                        board[i][t] = board[i][j];
                        board[i][j] = 0;
                        moveAnim(i, j, i, t);
                        setTimeout(function() {
                            removeDiv(i, j);
                        }, 200);
                    } else if (board[i][t] === board[i][j] && noBlockHorizontal(i, j, t, board) && !hasConflict[i][t]) {
                        board[i][t] = board[i][j] * 2;
                        board[i][j] = 0;
                        hasConflict[i][t] = true;
                        moveAnim(i, j, i, t);
                        var desDivClass = ".n" + i + "-" + j;
                        // $(desDivClass).addClass("pop" + i + "-" + j);
                        setTimeout(function() {
                            removeDiv(i, j);
                        }, 200);
                        score += board[i][t];
                        best = best > score ? best : score;
                    }
                }
            }
        }
        setTimeout(function() {
            randomNum(board);
        }, 200);
    }

    function moveRight (board) {
        if (!canMoveRight(board)) {
            return;
        }
        initConflict();
        for (var i = 0; i < 4; i++) {
            for (var j = 2; j >= 0; j--) {
                for (var t = 3; t > j; t--) {
                    if (board[i][t] === 0 && noBlockHorizontal(i, j, t, board)) {
                        board[i][t] = board[i][j];
                        board[i][j] = 0;
                        moveAnim(i, j, i, t);
                        setTimeout(function() {
                            removeDiv(i, j);
                        }, 200);
                    } else if (board[i][t] === board[i][j] && noBlockHorizontal(i, j, t, board) && !hasConflict[i][t]) {
                        board[i][t] = board[i][j] * 2;
                        board[i][j] = 0;
                        hasConflict[i][t] = true;
                        moveAnim(i, j, i, t);
                        var desDivClass = ".n" + i + "-" + j;
                        // $(desDivClass).addClass("pop" + i + "-" + j);
                        setTimeout(function() {
                            removeDiv(i, j);
                        }, 200);
                        score += board[i][t];
                        best = best > score ? best : score;
                    }
                }
            }
        }
        setTimeout(function() {
            randomNum(board);
        }, 200);
    }

    function randomNum (board) {
        var count = 1;
        var num = 0; // 当执行完16次后结束循环，避免死循环
        while (count > 0) {
            if (num >= 16) {
                break;
            }
            var x = Math.floor(Math.random() * 4);
            var y = Math.floor(Math.random() * 4);
            var idSelector = "#" + x + "-" + y;
            var baseClass = $(idSelector).attr("class");
            if (board[x][y] === 0) {
                board[x][y] = Math.random() > 0.5 ? 2 : 4;
                // $(idSelector).attr("class", "chessman animated bounce flipInY");
                $(idSelector).attr("class", "chessman layui-anim layui-anim-scale");
                setTimeout(function () {
                    $(idSelector).attr("class", baseClass);
                }, 100);
                count--;
            }
            num++;
        }
    }

    function isGameOver (board) {
        return !canMoveUp(board) && !canMoveDown(board)
            && !canMoveLeft(board) && !canMoveRight(board);
    }

    function isGameWin (board) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] === 65536) {
                    return true;
                }
            }
        }
        return false;
    }
    // 游戏主逻辑结束

    // 以下为动画部分
    function moveAnim (srcX, srcY, desX, desY) {
        var srcDivClass = ".n" + srcX + "-" + srcY;
        var numX = desX - srcX;
        var numY = desY - srcY;
        if (desX === srcX) {
            var xClass = "x" + numY;
            $(srcDivClass).addClass(xClass);
        } else if (desY === srcY) {
            var yClass = "y" + numX;
            $(srcDivClass).addClass(yClass);
        }
    }

    function removeDiv (x, y) {
        var t = "#" + x + "-" + y;
        $(t).empty();
    }
    // 移动动画结束
})