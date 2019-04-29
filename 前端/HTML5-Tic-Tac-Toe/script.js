/*
 * @Author: Xiaobo Yang
 * @Email: hal_42@zju.edu.cn
 * @Company: Zhejiang University
 * @LastEditors: Xiaobo Yang
 * @Description: 
 * @Date: 2019-04-26 14:41:46
 * @LastEditTime: 2019-04-28 03:25:47
 */

// Set Chess-box to be square

//Vars
$(document).on('pageinit', function () {
    var chessBoard = $('#chess-board');
    var chessBoardWidth = chessBoard.outerWidth();
    chessBoard.css('height', String(chessBoardWidth));
    newGame();
    if(DEBUG) testAJAX();
    btnListen();
    gearListen();
});

function newGame() {
    //init var
    if (Math.random() > 0.5) {
        first_player = LOCAL_PLAYER;
    }
    else {
        first_player = FOREIGN_PLAYER;
    }
    current_player = first_player;
    game_count++;
    current_step = 0;

    //init game_count
    $('#game-count').text(game_count.toString());

    //init chess_board
    chess_board = $('#chess-board');
    chess_board.empty();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            var new_chess_grid = $("<div id='chess-grid-" + i + "-" + j + "' class='chess-grid'></div>");
            var new_piece = $("<div id='piece-" + i + "-" + j + "' class='piece piece-off'></div>");
            new_chess_grid.append(new_piece);
            chess_board.append(new_chess_grid);
            board[i][j] = 0;
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            $('#chess-grid-' + i + '-' + j).addClass('chess-grid-on');
            setTimeout(() => {
                $('#chess-grid-' + i + '-' + j).removeClass('chess-grid-on');
            }, 1010);
        }
    }

    //一定要解绑所有监听，不然闪瞎狗眼
    chess_board.off();

    chess_board.on('taphold', function (event) {
        var trigger_id = event.target.id;
        re = /[a-zA-Z\-]+(\d)\-(\d)/;
        if (!re.test(trigger_id)) {
            $('#chess-board').addClass('none-response-area');
            setTimeout(() => {
                $('#chess-board').removeClass('none-response-area');
            }, 2000);
            return;
        }
        local_click(parseInt(re.exec(trigger_id)[1]), parseInt(re.exec(trigger_id)[2]));
    });
    
    chess_board.on('tap', function (event) {
        var trigger_id = event.target.id;
        re = /[a-zA-Z\-]+(\d)\-(\d)/;
        if (!re.test(trigger_id)) {
            return;
        }
        let i = parseInt(re.exec(trigger_id)[1]);
        let j = parseInt(re.exec(trigger_id)[2]);
        if (board[i][j]) return;
        if (current_player === LOCAL_PLAYER) {
            $(event.target).addClass('just-tap');
            setTimeout(() => {
                $(event.target).removeClass('just-tap');
            }, 1010);
        }
        else {
            $(event.target).addClass('wait-clock');
            setTimeout(() => {
                $(event.target).removeClass('wait-clock');
            }, 1210);
        }
    });

    if (current_player === FOREIGN_PLAYER) {
        setTimeout(ForeignMove(), 10);
    }
    return 0;
}

function testAJAX(){
     var ajax_board = {
         _board : board,
         _current_player: current_player,
         _difficulty: 3
     }
    var ajax_board_json = JSON.stringify(ajax_board);
    ajax_response = $.ajax({
        url: 'http://47.106.118.102:80/GetMove',
        type: 'GET',
        //contentType: 'application/json',
        //data: ajax_board_json,
        //dataType: 'json',
        jsonp: 'callback',
        success: (response_data) =>{
            console.log(response_data);
        }
    })
    console.log(ajax_response);
   
    return 0;
}

function btnListen(){
    var new_game_btn = $('#new-game-btn');
    new_game_btn.on('tap', ()=>{
        newGame();
    })
    $('#dif-0').on('tap', ()=>{
        difficulty = 0;
        $('#current-diff').text(' Settler');
    })
    $('#dif-1').on('tap', ()=>{
        difficulty = 1;
        $('#current-diff').text(' Warlord');
    })
    $('#dif-2').on('tap', ()=>{
        difficulty = 3;
        $('#current-diff').text(' Emperor');

    })
    $('#dif-3').on('tap', ()=>{
        difficulty = 9;
        $('#current-diff').text(' God');
    })
    $('#dif-conf').on('tap',()=>{
		setting_bar.addClass('pop-down');
		setTimeout(()=>{
		    setting_bar.removeClass('pop-down');
			setting_bar.hide();
		}, 1210);
    })
    return 0;
}

function gearListen(){
    gear = $('#set-btn img');
    gear.on('tap', ()=>{
        console.log("Gear Tapped");
        gear.addClass("gear-rotate");
        setTimeout(()=>{
            gear.removeClass("gear-rotate");
        }, 1010);
        setting_bar = $('#setting-bar');
        setting_bar.show();
        setting_bar.addClass('pop-up');
        setTimeout(()=>{
            setting_bar.removeClass('pop-up')
        }, 550);
    })
    return 0;
}