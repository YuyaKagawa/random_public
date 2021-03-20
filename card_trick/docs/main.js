let canvas = null;
let context = null;

let cmar = null; // canvasのマージン
let colw = null; // 1列の幅

let bpos = [{},{},{}]; // 3つのボタンの位置の配列、[x1,y1,x2,y2]

let cpos = Array(21); // 21枚のカードの位置

let cscale = null; // カードの画像のスケール、0-1
let caw = 108; // カードの画像の幅
let cah = 172; // カードの画像の高さ

const Suit = ["s","h","d","c"]; // トランプのスート

let list_card40 = Array(40); // 「スーツ+数字」で表された40枚のトランプのリスト
let list_card40_img = Array(40); // 「スーツ+数字」で表された40枚のトランプの画像オブジェクトのリスト

let list_card21 = Array(21); // 「スーツ+数字」で表された21枚のトランプのリスト、40枚の中から選ばれたものたち
let list_card21_img = Array(21); // 上の21枚のトランプの画像オブジェクトのリスト


let flag_monb = null; // カーソルがボタン上にあるというフラグ
let onbn = null; // 現在カーソルが乗っているボタンの番号

let b_start = null; // スタートボタン
let b_reset = null; // リセットボタン

let phase = 0; // フェーズ

let fsize_big = null; // フォントサイズ（スタート画面、エンド画面）
let fsize_small = null; // フォントサイズ（ボタン）


$(document).ready(function(){
    // 最初に実行される関数
    // 読み込めてから変数を用意

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    cmar = Math.min(canvas.width,canvas.height)/30; // マージン
    colw = (canvas.width-2*cmar)/3; // 1列の幅
    cscale = 0.5; // スケール

    fsize_big = canvas.width/20; // フォントのサイズ

    b_start = document.getElementById("b_start");
    b_reset = document.getElementById("b_reset");

    // ボタンの位置の設定
    for (let ind_b=0;ind_b<3;ind_b++){
        bpos[ind_b]["x1"] = (ind_b+0.5)*colw+cmar;
        bpos[ind_b]["y1"] = canvas.height-cmar-30;
        bpos[ind_b]["x2"] = bpos[ind_b]["x1"] + 30;
        bpos[ind_b]["y2"] = bpos[ind_b]["y1"] + 20;
    }



    Promise.resolve()
    .then(prep_card40) // 40枚のカードを用意する
    .then(show_howto) // 遊び方をcanvas内に表示する
    .then(function(){
        return new Promise(function(resolve,reject){
            b_start.style.display = "inline";
            resolve();
        });
    })

})

function pb_start(){
    // スタートボタンを押したとき

    Promise.resolve()
    .then(clear_canvas)
    // .then(function(){
    //     return new Promise(function(resolve,reject){
    //         resolve();
    //     });
    // })
    .then(show_phase)
    .then(choose21from40)
    // .then(show)
    .then(draw_card3x7)
    .then(draw_button3)
    .then(res_event)
    
    b_start.style.display = "none"; // スタートボタンを非表示
}

function pb_reset(){
    // リセットボタンを押したとき

    phase=0; // フェーズをリセット


    Promise.resolve()
    .then(clear_canvas)
    // .then(
    //     function (){
    //         return new Promise(function(resolve,reject){
    //             context.clearRect(0,0,canvas.width,canvas.height); // キャンバスを初期化
    //             resolve();
    //         });
    //     }
    // )
    // .then(show)
    // .then(draw_card3x7)
    // .then(draw_button3)
    // .then(res_event)
    
    b_reset.style.display = "none"; // リセットボタンを非表示
    b_start.style.display = "inline"; // スタートボタンを表示
}

