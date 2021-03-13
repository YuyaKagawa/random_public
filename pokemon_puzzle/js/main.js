$(document).ready(function(){
    // htmlが読み込めた後に実行
    // canvas_mainの黒枠だけ表示する

    canvasm = document.getElementById("canvas_main");
    contextm = canvasm.getContext("2d");
    canvasa = document.getElementById("canvas_answer");
    contexta = canvasa.getContext("2d");

    canvasm.width = Math.min(window.innerHeight,window.innerWidth)-100;
    canvasm.height = Math.min(window.innerHeight,window.innerWidth)-100;
    canvasa.width = Math.min(window.innerHeight,window.innerWidth)-100;
    canvasa.height = Math.min(window.innerHeight,window.innerWidth)-100;

    // canvas関連の変数、canvas_mainとcanvas_answerで共通
    cw = canvasm.width; // canvasの横幅
    ch = canvasm.height; // canvasの縦幅
    cmar = 10 // canvas上の端（上下左右）のマージン
    sw = (cw-2*cmar) / snum; // 格子中の1マスの幅
    sh = (ch-2*cmar)/snum; // 格子中の1マスの高さ
    tb = document.getElementById("textbox"); // テキストボックスの要素を取得
    tb.readOnly=true; // まず最初は編集不可能にしておく

    b_sr = document.getElementById("b_start_reset"); // スタート・リセットボタンの要素を取得
    b_sh_a = document.getElementById("b_show_hide_answer"); // 答えを表示/非表示ボタンの要素を取得
    b_j = document.getElementById("b_judge"); // 判定ボタンの要素を取得

    b_hi = document.getElementById("b_hide_info"); // 情報表示ボタンの要素を取得
    b_d = document.getElementById("b_detail"); // 詳細表示ボタンの要素を取得
    
    l_p = document.getElementById("list_pokemon"); // ポケモンのリスト
    intro = document.getElementById("intro"); // イントロ

    timer = document.getElementById("timer"); // タイマー

    // promiseで順番に実行
    // 1. canvas_mainとcanvas_answerを描画
    // 2. デフォルト、作業用、正解のcsvを読み込む
    // 3. 変数に代入する

    Promise.resolve()
        .then(prep_canvas.bind(this, { "canvas": canvasm, "context": contextm }))
        .then(prep_canvas.bind(this, { "canvas": canvasa, "context": contexta }))
        .then(get_csv.bind(this, { "fname_csv": fname_d,"list": false }))
        .then(get_csv.bind(this, { "fname_csv": fname_a,"list": false }))
        .then(get_csv.bind(this, { "fname_csv": fname_l,"list": true}))
        .then(listup)
});

function start() {
    // スタートボタンを押したときに、スタートする
    // $(document).ready()で実行した後に実行されることを想定している
    // timerはpb_start_reset()の中で記述

    // 3. デフォルトのcsvの内容に基づいて、canvas_mainに格子全体を描画
    // 4. 正解のcsvの内容に基づいて、canvas_answerに格子全体を描画
    // 5. canvas_mainに、イベント（マウスイン、マウスアウト、マウスオーバー、マウスクリック）を登録する

    Promise.resolve()
        .then(draw_grid.bind(this, { "context": contextm, "Grid": G["d"] }))
        .then(draw_grid.bind(this, { "context": contexta, "Grid": G["a"] }))
        .then(res_event)    
}