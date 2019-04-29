/*
 * @Author: Xiaobo Yang
 * @Email: hal_42@zju.edu.cn
 * @Company: Zhejiang University
 * @LastEditors: Xiaobo Yang
 * @Description: Omitted
 * @Date: 2019-04-26 18:57:31
 * @LastEditTime: 2019-04-28 01:55:06
 */
const DEBUG = 1;

var board = new Array(3);
for (let i = 0; i < board.length; i++) {
    board[i] = new Array(3);
}

var current_step = 0;

const LOCAL_PLAYER = 1;
const FOREIGN_PLAYER = -1;
const NO_PLAYER = 0;
var first_player = NO_PLAYER;
var current_player = NO_PLAYER;

var game_count = 0;  //Only updated at newGame()!

//Def piece
const LOCAL_PIECE = 1;
const FOREIGN_PIECE = -1;

var difficulty = 3;


function local_click(x, y) {
    if (DEBUG) {
        console.log("Get Click on" + x + "," + y);
        console.log("Current Player is" + current_player);
    }
    if (board[x][y] === 0) {
        if (current_player === LOCAL_PLAYER) {
            if (DEBUG) console.log(x + "," + y + " is ready to down chess");
            // Update vars
            board[x][y] = LOCAL_PIECE;
            current_step++;
            //Update chess board
            $('#piece-' + x + '-' + y).text('X')
                .removeClass('piece-off')
                .addClass('local-piece-on');
            //Test Is GameOver
            if (isGameOver(x, y)) {
                return 0;
            }
            else {
                current_player *= -1;
                setTimeout(ForeignMove, 100);
            }
        }
        else {
            $('#chess-grid-' + x + '-' + y).addClass('wait-clock');
            setTimeout(() => {
                $('#chess-grid-' + x + '-' + y).removeClass('wait-clock');
            }, 1210);
        }
    }
    else {
        $('#piece-' + x + '-' + y).animate({ 'opacity': 0 }, 120)
            .animate({ 'opacity': 100 }, 120)
            .animate({ 'opacity': 0 }, 120)
            .animate({ 'opacity': 100 }, 120);
    }
    return 0;
}

function ForeignMove() {

    console.log("Current Player is" + current_player);
    //Make Move
    var rslt = sendAJAX(
        (x, y) => {
            // Update vars
            board[x][y] = FOREIGN_PIECE;
            current_step++;
            //Update chess board
            $('#piece-' + x + '-' + y).text('X')
                .removeClass('piece-off')
                .addClass('foreign-piece-on');
            //Test Is GameOver
            if (isGameOver(x, y)) {
                return 0;
            }
            else {
                current_player *= -1;
                return 0;
            }
        }
    );
}


function isGameOver(x, y) {
    var winner = 0;
    is_gameover = 0;
    if (
        board[x][0] + board[x][1] + board[x][2] === 3 ||
        board[0][y] + board[1][y] + board[2][y] === 3 ||
        board[0][0] + board[1][1] + board[2][2] === 3 ||
        board[2][0] + board[1][1] + board[0][2] === 3
    ) {
        rslt_str = ("You Win");
        winner = current_player;
        is_gameover = 1;
    }
    else if (
        board[x][0] + board[x][1] + board[x][2] === -3 ||
        board[0][y] + board[1][y] + board[2][y] === -3 ||
        board[0][0] + board[1][1] + board[2][2] === -3 ||
        board[2][0] + board[1][1] + board[0][2] === -3
    ) {
        rslt_str = ("You Loss");
        winner = current_player;
        is_gameover = 1;
    }
    else if (current_step >= 9) {
        rslt_str = "Draw";
        is_gameover = 1;
        winner = 0;
    }
    else {
        is_gameover = 0;
        winner = 0;
    }
    if (is_gameover === 0) {
        return false;
    }
    else {
        setTimeout(() => {
            gameOver(winner, rslt_str);
        }, 1500);
        return true;
    }
}


function gameOver(winner, rslt_str) {
    window.alert(rslt_str);
    if (winner === LOCAL_PLAYER) {
        window.
            win_count = parseInt($('#win-count').text());
        win_count++;
        $('#win-count').text(win_count + " ");
    }
    return newGame();
}

async function sleep(ms) {
    await _sleep(ms);
}

function _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function sendAJAX(callBack) {
    var _x, _y;

    var ajax_board = {
        _board: board,
        _current_player: current_player,
        _difficulty: difficulty,
    }
    var ajax_board_json = JSON.stringify(ajax_board);
    ajax_response = $.ajax({
        url: 'http://47.106.118.102:80/GetMove',
        type: 'POST',
        contentType: 'application/json',
        data: ajax_board_json,
        dataType: 'json',
        jsonp: 'callback',
        success: (response_data) => {
            console.log(response_data);
            _x = response_data.x;
            _y = response_data.y;
        },
        error: () => {
            let x, y;
            do {
                x = Math.round(Math.random() * 2);
                y = Math.round(Math.random() * 2);
            } while (board[x][y]);
			plus.device.vibrate();
            window.alert("NetWork Problme! Make Random Step for Test");
            console.log(x + "," + y + " is ready to down chess");
            _x = x;
            _y = y;
        },
        complete: ()=>{
            callBack(_x, _y);
        }
    })


    return 0;
}
