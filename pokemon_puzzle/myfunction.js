// 後に値を取得する、canvas関連の変数
// メインのキャンバス、答えのキャンバスの2つがある
let canvasm; // メインのキャンバス
let contextm; // メインのキャンバスのコンテクスト
let canvasa; // 答えのキャンバス
let contexta; // 答えのキャンバスのコンテクスト

// 以下のキャンバスに関わる変数は、2つのキャンバスで共通
let cw; // キャンバスの横幅
let ch; // キャンバスの高さ
let sw; // 格子の中の一つの四角の横幅
let sh; // 格子の中の一つの四角の縦幅
const snum = 32; // 格子の中の四角の数
let cmar; // キャンバスの外枠と、格子の間のマージン

const ccolor_bg = "gray"; // canvasの背景色
const ccolor_gs = "darkblue"; // canvasの格子の枠線の色
const ccolor_fd = "black"; // canvas内のデフォルトの文字の色
let ccolor_gb = "white"; // canvasの格子の背景の色

const fname_d="./data/csv/default_sq.csv"; // csvファイル名、最初の状態
const fname_a="./data/csv/answer_sq.csv"; // csvファイル名、答え

// let Gd = null; // デフォルトの格子情報
// let Gn = null; // 現在の格子情報、これを変更してゆく
// let Ga = null; // 答えの格子情報

let G = {} // 参照渡しのために、dictで作成してみる


var rowi_p = null; // 前回指した四角はrowi行目
var colj_p = null; // 前回指した四角はcolj列目
var rowi = null; // 今指している四角はrowi行目
var colj = null; // 今指している四角はcolj列目

let eflag = {}; // イベントフラグのON/OFFを管理する
eflag["mousemove"]="OFF";
eflag["mouseover"]=null;
eflag["mouseout"]=null;

// eflag["click"]="OFF";

let tb; // html内に記述したテキストボックスの要素を取得
let dtb; // html内に記述したテキストボックスの要素を取得
// let v; // クリックしたマスの要素

let b_sr = null; // スタート・リセットボタン
let b_sh_a = null; // 答えを表示/非表示ボタン

let pid = null; // タイマーのプロセスID
let timer = null; // タイマーオブジェクトinHTML
let timer_time = null; // タイマーの経過時間

function pb_start_reset(){
    // スタート・リセットボタンを押したときに実行する関数

    if (b_sr.value == "スタート") { // スタートボタンを押した場合、canvasを描画
        alert("スタート！！！");
        // console.log("start!!!");
        b_sr.value = "リセット";
        b_sh_a.style.display = "inline"; // 正解を表示/非表示ボタンを表示
        timer_start(); // タイマースタート
        start();
    }
    else if (b_sr.value == "リセット"){ // リセットボタンを押した場合
        const do_reset = confirm("リセットしますか"); // 確認画面を表示

        if (do_reset == true) { // もし確認画面でYESと答えた場合
            // console.log("リセット");
            b_sr.value = "スタート";

            var message = "リセットしました";

            b_sh_a.style.display = "none"; // 正解を表示/非表示ボタンを非表示
            // canvasa.style.display = "none"; // 正解を非表示

            if (b_sh_a.value == "正解を非表示") { // 正解が表示されたままの場合、正解を非表示に
                pb_show_hide_answer(); // 正解を非表示            
            }

            // Gn = Gd.map(inner => inner.slice());
        
            // Promise.resolve(Gn).then(draw_grid.bind(Gn)).then(alert(message));
            // draw_grid(Gn);
            timer_stop(); // タイマーを止める
            alert(message);
        }
        else { // もし確認画面でNOと答えた場合、何もしない
        }
    }
}

function pb_show_hide_answer() {
    // 「正解を表示」ボタンを押したときに実行する関数

    if (b_sh_a.value == "正解を表示") {
        const show_answer = confirm("正解を表示しますか"); // 確認画面を表示
        
        if (show_answer == true) { // もし確認画面でYESと答えた場合
            canvasa.style.display = "block";
            b_sh_a.value = "正解を非表示";
        }
        else { // もし確認画面でNOと答えた場合、何もしない
        }
    }
    else if (b_sh_a.value == "正解を非表示") {
        canvasa.style.display = "none";
        b_sh_a.value = "正解を表示";
    }
}


function hiratokana(hiragana) {
    // ひらがなをカタカナに変換する関数
    // 参考: JavaScriptでカタカナをひらがなに変換する(その逆も) - Qiita, 
    // https://qiita.com/mimoe/items/855c112625d39b066c9a

    return hiragana.replace(/[\u3041-\u3096]/g, function(match) {
        var chr = match.charCodeAt(0) + 0x60;
        return String.fromCharCode(chr);
    });
}

function get_csv(args) {
    const fname_csv = args["fname_csv"];
    const Gname = fname_csv.split("/")[3][0];

    // let Grid = args["Grid"];

// function get_csv(fname,Grid){
    // csvを読み込んだ結果を取得する関数

    function split_csv(str){
        // csvの中身を読み込む関数
        var result = [];
        var tmp = str.split("\r\n");

        for (var i=0;i<tmp.length;i++){
            result[i]=tmp[i].split(",");
        }

        return result;
    }

    return new Promise(function(resolve,reject){
        var request = new XMLHttpRequest();
        request.open("GET",fname_csv,true);
        request.send(null);

        request.onload = function () {
            result = split_csv(request.responseText);

            // Gname

            // resolve(result);
            // Grid = split_csv(request.responseText);

            // console.log(`Grid = ${Grid}`);
            // resolve(Grid);
            // console.log(`result = ${result}`);

            // console.log(`fname_csv.length = ${fname_csv.length}`);
            // console.log(`${fname_csv[fname_csv.length - 1]}`)
            // console.log(`${fname_csv.split("/")[3][0]}`);
            
            G[Gname] = result;
            
            if (Gname == "d") { // デフォルトのものを読み込むときは、進行中のものも用意する
                // 2次元配列の値コピーには工夫が必要
                G["n"] = G[Gname].map(inner=>inner.slice());
            }
            
            // console.log(`first G[${fname_csv[fname_csv.length-1]}] = ${G[fname_csv[fname_csv.length]]}`);
            // resolve(result);
            resolve();
            
        };
    });
}

function prep_canvas(args){
    // canvasを用意する関数
    // promiseで実行

    const can = args["canvas"]; // canvas
    const con = args["context"]; // context
    
    return new Promise(function (resolve,reject){        
        con.textBaseline = "top";
        con.fillStyle = ccolor_bg; // 四角の色
        
        // 左からのサブセット、上からのサブセット、幅、高さの四角の枠線を描く
        con.fillRect(0,0,can.width,can.height);         
        resolve();
    });    
}

function draw_sq_byij(con,Grid,i,j,ccolor_gb="white",bold=true){
    // コンテクストcon、格子Gと、i行j列目という情報が与えられたときの、i行j列目の四角を描く関数
    if ((Grid[i][j]=="\u{3000}")||(Grid[i][j]==" ")){ // 全角空白は、枠を表示しない
    }
    else { // 全角空白以外のとき、枠を表示
        con.strokeStyle = ccolor_gs;
        con.strokeRect(cmar+j*sh,cmar+i*sw,sh,sw);
        con.fillStyle=ccolor_gb; // 枠があるときの背景色
        con.fillRect(cmar+j*sh,cmar+i*sw,sh,sw);

        if (Grid[i][j]=="\u{25EF}") { // ◯の場合は、もうなにもしない
        }
        else{ // 文字の場合は、文字を表示
            if (bold==true){ // 太字のときの設定
                con.font = `bold ${sh}px serif`; // 残りの部分    
            }
            else{
                con.font = `${sh}px serif`; // 残りの部分
            }

            con.fillStyle=ccolor_fd;
            con.fillText(Grid[i][j],cmar+j*sh,cmar+i*sw);
        }
    }
}

function xy2ij(x,y){
    // x,yを受け取り、i,jに変換する
    // x,yからi行j列目という情報を抽出して代入する
    // x,yが範囲外の場合、i,jはそれぞれnullを代入する
    
    if (x<cmar || x>=cw-cmar){ // xが格子の範囲外の場合
        colj=null;
    }else{
        colj = Math.floor((x-cmar)/sw);
    }

    if (y<cmar || y>=ch-cmar){ // yが格子の範囲外の場合
        rowi=null;
    }else{
        rowi = Math.floor((y-cmar)/sh);
    }
}

// function change_sq_mover(context,x,y){
function change_sq_mover(con,Grid,x=null,y=null,ij=null){
// function change_sq_mover(Grid, x = null, y = null, ij = null) {
    // マウスがオーバーしている四角の属性を、変化させる
    // canvas上でのx,y座標を与えることで、その部分の四角を再描画する関数
    // 条件分岐は2つ
    // 1. 以前のx,yが格子の範囲の内にある場合
    // 2. 現在のx,yが格子の範囲の内にある場合
    
    if (ij==null){ // ijが引数として与えられていない場合
        xy2ij(x,y);
    }
    else if (ij!=null){ // ijが引数として与えられている場合
        rowi=ij[0];
        colj=ij[1];
    }
    
    if (rowi_p!=null && colj_p!=null){
        // 1. 以前のx,yが格子の範囲の内にあるとき

        if ((rowi==rowi_p) && (colj==colj_p)){ // 以前と同じ四角を指している場合、何もしない
        }
        else if ((rowi!=rowi_p) || (colj!=colj_p)){ // 以前と異なる四角を指している場合、以前の四角を消す
            if (["\u{3000}","\u{25EF}"].indexOf(Gd[rowi_p][colj_p])<0){ // もし、デフォルトの文字だったら
                // draw_sq_byij(Grid,rowi_p,colj_p,ccolor_gb="white",bold=true); // 太字で表示
                draw_sq_byij(con,Grid,rowi_p,colj_p,ccolor_gb="white",bold=true); // 太字で表示
            }
            else{ // デフォルトの文字ではない場合
                draw_sq_byij(con,Grid,rowi_p,colj_p,ccolor_gb="white",bold=false);
                // draw_sq_byij(Grid, rowi_p, colj_p, ccolor_gb = "white", bold = false);
            }
        }
    }

    if (rowi!=null && colj!=null){
        // 2. 現在のx,yが格子の範囲の内にある場合

        if ((rowi==rowi_p) && (colj==colj_p)){ // 以前と同じ四角を指している場合、何もしない
        }
        else if ((rowi!=null && rowi!=rowi_p) || (colj!=null && colj!=colj_p)){ // 以前と異なる四角を指している場合、現在の位置に四角を表示
            if (["\u{3000}", "\u{25EF}"].indexOf(Gd[rowi][colj]) < 0) { // もし、デフォルトの文字だったら
                draw_sq_byij(con,Grid,rowi,colj,ccolor_gb="orange",bold=true);
                // draw_sq_byij(Grid,rowi,colj,ccolor_gb="orange",bold=true);
            }
            else{ // デフォルトの文字ではない場合
                // draw_sq_byij(Grid,rowi,colj,ccolor_gb="orange",bold=false);
                draw_sq_byij(con,Grid,rowi,colj,ccolor_gb="orange",bold=false);
            }
        }
    }

    rowi_p=rowi;
    colj_p=colj;
}

function draw_grid(args) {
// function draw_grid(con,Grid) {
// function draw_grid(Grid) {
    // 格子全体を描く関数

    const con = args["context"];
    const Grid = args["Grid"];

    // console.log(`draw_grid!`);
    // console.log(`Grid[0] = ${Grid[0]}`);

    return new Promise(function (resolve,reject){
        // 枠線の描画
        for (let i=0;i<snum;i++){
            for (let j=0;j<snum;j++) {
                draw_sq_byij(con,Grid,i,j,ccolor_gb="white",bold=true); // 四角を描く
                // draw_sq_byij(Grid, i, j, ccolor_gb = "white", bold = true); // 四角を描く
            }
        }

        resolve();
    });
}

function when_mmove(e,con){
// function when_mmove(e){
    // canvas内でマウスが動いているとき
    // 厳密には、canvas外→内、canvas内→外の動作も取る

    // change_sq_mover(Gn, e.offsetX, e.offsetY); // カーソルの合った四角を描画する
    change_sq_mover(con, Gn, e.offsetX, e.offsetY); // カーソルの合った四角を描画する
}

function when_choosesq(){
    // マスを選んだときに実行される関数
    // when_click()とmovesq_byarrow()とwhen_rclick()内で実行

    if (rowi==null || colj==null){ // 格子外をクリックしたとき
        tb.value = "";
        tb.readOnly = true;        
    }
    else{ // 格子内をクリックしたとき
        const vd = Gd[rowi][colj]; // デフォルトのマスの要素を取得
        const vn = Gn[rowi][colj]; // 現在のマスの要素を取得

        if (vd=="\u{25EF}"){ // もともと編集可能マス（not デフォルト文字あり、not 余白）の場合
            tb.readOnly = false; // 編集可能にする
            tb.focus(); // テキストボックスにフォーカスをあわせる 

            if (vn=="\u{25EF}"){ // 現在空白の場合
                tb.value = "";
            }
            else{ // 現在空白ではない場合
                tb.value = `${vn}`; // テキストボックスに、クリックしたマスの値を入れる
                // tb.value = `${vn}`; // テキストボックスに、クリックしたマスの値を入れる
            }
        }
        else{ // もともと編集可能ではない場合（デフォルト文字あり、余白）
            tb.readOnly = true;
            tb.value = "";
        }
    }
}


function when_click(e) {
    // canvas内でクリックしたとき

    xy2ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得

    when_choosesq();

    if (eflag["mousemove"] == "ON"){
        eflag["mousemove"] = "OFF";
        canvas.removeEventListener("mousemove",when_mmove); // クリックのイベントを削除
    }
    else{
        change_sq_mover(con,Gn,e.offsetX,e.offsetY); // カーソルの合った四角を描画する
        // change_sq_mover(Gn,e.offsetX,e.offsetY); // カーソルの合った四角を描画する

        if (rowi!=rowi_p || colj!=colj_p){
            eflag["mousemove"] = "ON";
            canvas.addEventListener("mousemove", when_mmove, false);    
        }
    }    
}

function when_penter(e){
    // テキストボックスでキーが押されたとき
    // ここでエンターキーを検出する
    // 現時点では実はエンターキーではなく、文字を入力途中でも反応する

    if (tb.value.length>=1 && tb.readOnly==false){ // テキストボックスが入力可能状態の場合
    // if (tb.readOnly==false && e.key=="Process"){ // テキストボックスが入力可能状態の場合

        const t = tb.value[tb.value.length-1];
        // Gn[rowi][colj]=hiratokana(tb.value);
        Gn[rowi][colj]=hiratokana(t);

        // console.log(`t = ${t}`);
        // console.log(`Gn[rowi][colj] = ${Gn[rowi][colj]}`);

        draw_sq_byij(con, Gn, rowi, colj, ccolor_gb = "orange", bold = false);
        // draw_sq_byij(Gn,rowi,colj,ccolor_gb="orange",bold=false);
    }else{
        // console.log("else!");
    }
}

function movesq_byarrow(key_arrow){
    // 矢印キーを押して、マスを移動させる

    let rowi_c = rowi; // 行方向の移動先の候補
    let colj_c = colj; // 列方向の移動先の候補
    

    if (key_arrow=="Up"){
        rowi_c = Math.max(rowi_c-1,0);
    }
    else if (key_arrow=="Right"){
        colj_c = Math.min(colj_c+1,snum-1);
    }
    else if (key_arrow=="Down"){
        rowi_c = Math.min(rowi_c+1,snum-1);
    }
    else if (key_arrow=="Left"){
        colj_c = Math.max(colj_c-1,0);
    }

    if (Gd[rowi_c][colj_c] == "\u{3000}"){
        change_sq_mover(con,Gn,x=null,y=null,ij=[rowi,colj]);
        // change_sq_mover(Gn, x = null, y = null, ij = [rowi, colj]);
    }
    else{
        change_sq_mover(con, Gn,x=null,y=null,ij=[rowi_c,colj_c]);

        // change_sq_mover(Gn,x=null,y=null,ij=[rowi_c,colj_c]);
    }        

    when_choosesq();
}

function when_p(e){
    // ドキュメント上で何かキーを押したときの挙動
    // e.preventDefault();

    if (e.key.substr(0, 5) == "Arrow") { // もし矢印キーを押したら
        movesq_byarrow(e.key.substr(5,e.key.length)); // マスを移動する
    }
}

function assign_value(args){
    // Gに、get_csvで読み込んだ格子情報を代入する

    // console.log(`value = ${value}`);

    // console.log(`args = ${args.keys()}`);
    // console.log(`args = ${Object.keys(args)}`);

    // console.log(`args["Grid"] = ${args["Grid"]}`);

    return new Promise(function (resolve, reject) {
        // 2次元配列の値コピーには工夫が必要

        const r = args["r"];
        // console.log(`r = ${r}`);

        // G[`${ args["Grid"] }`]=r;

        console.log(`assign value, G${args["Grid"]} = ${G[args["Grid"]]}`);

        // console.log(G[d] = $G["d"]);



        // console.log(`args["Grid"] = ${args["Grid"]}`);

        // console.log(`G["d"] = ${G["d"]}`);

        // console.log(`Gd[0] = ${Gd[0]}`);

        // Gd = result.map(inner=>inner.slice());
        // Gn = result.map(inner=>inner.slice());                

        // Ga = result.map(inner=>inner.slice()); 

        // resolve(Gd);
        resolve();
    });
}

function when_rclick(e){
    // 右クリックを押したときの挙動

    // console.log(`rclick! can = ${can}`);
    // console.log(`rclick! con = ${con}`);
    // console.log(`rclick! Gname = ${Gname}`);
    // console.log(`rclick! G[${Gname}][0] = ${G[Gname][0]}`);

    // when_rclick(e, can, con, Gname)

// function when_rclick(e){
    xy2ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得

    when_choosesq();



    if (rowi==null || colj==null){ // 格子外をクリックしたとき
    }
    else{ // 格子内をクリックしたとき
        // const vd = G[Gname][rowi][colj]; // デフォルトのマスの要素を取得
        const vd = G["d"][rowi][colj]; // デフォルトのマスの要素を取得

        if (vd=="\u{3000}"){ // デフォルトでマスがない場合
        }
        else if (vd=="\u{25EF}"){ // デフォルトで空きマスの場合
            G["n"][rowi][colj]=vd; // 進行中のGridのマスを上書きする
            // draw_sq_byij(con, Gn, rowi, colj, ccolor_gb = "white", bold = false)
            draw_sq_byij(ccolor_gb = "white", bold = false);
            // draw_sq_byij(Gn,rowi,colj,ccolor_gb="white",bold=false)
        }

        const vn = G["n"][rowi][colj]; // 現在のマスの要素を取得
        
        when_choosesq();

        // if (vd=="\u{3000}" || vd!="\u{25EF}"){ 
        //     // 格子内でも、マスのないところは変更不可にする
        //     // 格子内でマスがあっても、デフォルトで値の入っているところは変更不可にする
    
        //     tb.value = "";
        //     tb.readOnly = true;    
        // }
        // else{ // 格子内で、マスがあり、さらに有効な文字の場合
        //     if (vn=="\u{25EF}"){
        //         tb.value = "";
        //     }
        //     else{
        //         tb.value = `${vn}`; // テキストボックスに、クリックしたマスの値を入れる
        //     }

        //     tb.focus(); // テキストボックスにフォーカスをあわせる
        //     tb.readOnly = false; // 
        // }
    }


    if (eflag["mousemove"] == "ON"){
        eflag["mousemove"] = "OFF";
        // canvas.removeEventListener("mousemove", when_mmove); // クリックのイベントを削除
        can.removeEventListener("mousemove", when_mmove); // クリックのイベントを削除
    }
    else{
        change_sq_mover(con,Gn,e.offsetX,e.offsetY); // カーソルの合った四角を描画する
        // change_sq_mover(Gn,e.offsetX,e.offsetY); // カーソルの合った四角を描画する

        if (rowi!=rowi_p || colj!=colj_p){
            eflag["mousemove"] = "ON";
            // canvas.addEventListener("mousemove", when_mmove, false);
            can.addEventListener("mousemove", when_mmove, false);    
        }

    }
}

function res_event(args){
    // function res_event(args,can){

    // イベントの登録をする関数

    // const can = args["canvas"];
    // const con = args["context"];
    
    // const Gname = args["Gname"];

    // console.log(`res_event!, can = ${can}`);
    // console.log(`res_event!, con = ${con}`);
    // console.log(`res_event!, Gname = ${Gname}`);
    // console.log(`res_event! = G["n"][0] = ${G["n"][0]}`);
    
    return new Promise(function (resolve, reject) {
        // canvas内でマウスを動かしたとき
        // canvas上ではまず、右クリックを無効化する
        canvasm.addEventListener('contextmenu', e => e.preventDefault());
        // can.addEventListener('contextmenu', e => { when_rclick(e, can, con, Gname), false }); // →クリックを押したときに実行
        // canvasm.addEventListener('contextmenu', e => { when_rclick(e), false }); // →クリックを押したときに実行
        canvasm.addEventListener('contextmenu', when_rclick,false); // →クリックを押したときに実行
        


    //     // canvas.addEventListener('contextmenu', e => e.preventDefault());
    //     // canvas.addEventListener('contextmenu', when_rclick,false); // →クリックを押したときに実行
        
    //     eflag["mousemove"] = "ON";
    //     can.addEventListener("mousemove", when_mmove, false);
    //     can.addEventListener("click",when_click,false); // canvas上でクリックしたとき

    //     // canvas.addEventListener("mousemove", when_mmove, false);
    //     // canvas.addEventListener("click",when_click,false); // canvas上でクリックしたとき

    //     // canvas上で矢印キーを押したとき
    //     // これはキーを押したタイミングで
    //     // まずページ全体で、矢印キーを無効化する
    //     document.addEventListener("keydown", e => {
    //         if (e.key.substr(0,5)=="Arrow"){
    //             e.preventDefault();
    //         }
    //     },false);

    //     document.addEventListener("keydown",when_p,false);
    //     // document.addEventListener("keydown",when_p,false);

    //     // テキストボックスにカーソルが合っているとき、Enterキーを押したとき
    //     // これはキーを離したタイミングで
    //     tb.addEventListener("keyup", e=>{
    //         if (e.key=="Enter" || e.key=="Process"){
    //             // console.log("ENTERRRRRRRRRRRRRR");
    //             when_penter(e);
    //         }
    //     },false);


        resolve();
    });
}

function timer_display_text() {
    // タイマーのテキスト表示
    timer_time += 0.1;

    const text_h = Math.floor(timer_time / 3600); // hour
    const text_m = Math.floor((timer_time % 3600)/60); // minute
    const text_s = Math.floor(timer_time % 60); // second
    const text_ms = Math.floor(timer_time*10%10); // millisecond
    
    timer.innerHTML = text_h+"h "+text_m+"m "+text_s+"."+text_ms+"s 経過"; 
}

function timer_start() {
    // タイマーをスタートする関数
    timer_time = 0.0; // 経過時間をリセット
    pid = setInterval("timer_display_text()", 100);
    timer.style.display = "block";
}

function timer_stop() {
    // タイマーをストップする関数
    clearInterval(pid);
    timer.style.display = "none";
}

function show() {
    // テスト用に何か表示する関数
    console.log(`show! G = ${G}`);
    console.log(`show! G["d"] = ${G["d"]}`);
    console.log(`show! G["a"] = ${G["a"]}`);    
}


$(document).ready(function(){
    // htmlが読み込めた後に実行
    // canvas_mainの黒枠だけ表示する

    canvasm = document.getElementById("canvas_main");
    contextm = canvasm.getContext("2d");
    canvasa = document.getElementById("canvas_answer");
    contexta = canvasa.getContext("2d");

    // canvas関連の変数、canvas_mainとcanvas_answerで共通
    cw = canvasm.width; // canvasの横幅
    ch = canvasm.height; // canvasの縦幅
    cmar = 10 // canvas上の端（上下左右）のマージン
    sw = (cw-2*cmar) / snum; // 格子中の1マスの幅
    sh = (ch-2*cmar)/snum; // 格子中の1マスの高さ
    // dtb= document.getElementById("div_textbox"); // 
    tb = document.getElementById("textbox"); // テキストボックスの要素を取得
    b_sr = document.getElementById("b_start_reset"); // スタート・リセットボタンの要素を取得
    b_sh_a = document.getElementById("b_show_hide_answer"); // 答えを表示/非表示ボタンの要素を取得

    timer = document.getElementById("timer"); // タイマー

    // promiseで順番に実行
    // 1. canvas_mainとcanvas_answerを描画
    // 2. デフォルト、作業用、正解のcsvを読み込む
    // 3. 変数に代入する

    // Promise.resolve().then(prep_canvas_main)
    Promise.resolve()
        .then(prep_canvas.bind(this, { "canvas": canvasm, "context": contextm }))
        .then(prep_canvas.bind(this, { "canvas": canvasa, "context": contexta }))
        // .then(get_csv.bind(this, { "fname_csv": fname_d, "Grid": G["d"] }))
        .then(get_csv.bind(this, { "fname_csv": fname_d }))
        // .then(r => { assign_value({ "r": r, "Grid": "d" }) })
        .then(get_csv.bind(this, { "fname_csv": fname_a }))
        // .then(r => { assign_value({ "r": r, "Grid": "a" }) })
        
        // .then(show)
        
        // .then(draw_grid.bind(G["d"]))

    
        // .then(r => {console.log(`value = ${r}`);})

    
        //     function (value) {
        //     console.log(`value = ${value}`);
        // })
            // .bind(this, { "Grid": G["d"] }))
        // .then(assign_value.bind(value,{"Grid":G["d"]}))

        // 
        // .then(res_event);
});


// $(G["d"].ready(function () {
//     console.log("ready!");
//     console.log(`show! G["d"] = ${G["d"]}`);
//     console.log(`show! G["a"] = ${G["a"]}`); 
// })

function start() {
    // スタートボタンを押したときに、スタートする
    // $(document).ready()で実行した後に実行されることを想定している
    // timerはpb_start_reset()の中で記述

    // 3. デフォルトのcsvの内容に基づいて、canvas_mainに格子全体を描画
    // 4. 正解のcsvの内容に基づいて、canvas_answerに格子全体を描画
    // 5. canvas_mainに、イベント（マウスイン、マウスアウト、マウスオーバー、マウスクリック）を登録する

    // show();

    Promise.resolve()
        .then(draw_grid.bind(this, { "context": contextm, "Grid": G["d"] }))
        .then(draw_grid.bind(this, { "context": contexta, "Grid": G["a"] }))
        // .then(res_event.bind(this, { "context": contextm, "canvas": canvasm, "Gname": "d" }))
        .then(res_event)

    

    
    
    // draw_grid(con,Grid)



    // timer_start(); // タイマースタート

    // console.log(`G[d] = ${G["d"]}`)
    // console.log(`G[a] = ${G["a"]}`)
    
}











































    // var message = "リセットしました";

        // Gn = Gd.map(inner => inner.slice());
    
        // Promise.resolve(Gn).then(draw_grid.bind(Gn)).then(alert(message));
        // draw_grid(Gn);

        // const document.getElementById("ca");
        
        // show_answer
    // }
    // else { 
    // }





                                // context.font = `bold ${sh}px serif`; // 残りの部分
                // context.font = `${sh}px serif`; // 残りの部分

                                // context.textBaseline = "top";
        // context.fillStyle = ccolor_bg; // 四角の色

        // context.fillRect(0, 0, canvas.width, canvas.height);

// function draw_sq_byij(Grid,i,j,ccolor_gb="white",bold=true){
    // console.log(`draw_sq_byij!`);
    // console.log(`Grid[i][j] = ${Grid[i][j]}`);


        // context.strokeStyle = ccolor_gs;
        // context.strokeRect(cmar+j*sh,cmar+i*sw,sh,sw);
        // context.fillStyle=ccolor_gb; // 枠があるときの背景色
        // context.fillRect(cmar+j*sh,cmar+i*sw,sh,sw);
            // context.fillStyle=ccolor_fd;
            // context.fillText(Grid[i][j],cmar+j*sh,cmar+i*sw);

        // if (vd=="\u{3000}"){ // 格子内でマスのないところは変更不可にする
            // console.log("vd=\u{3000}");
        // if (vd=="\u{3000}" || vd!="\u{25EF}"){ 
            // 格子内でも、マスのないところは変更不可にする
            // マスがあっても、デフォルトで値の入っているところは変更不可にする
    
            
            
            // tb.readOnly = false;    
        // }
        // else{ // 格子内で、マスがあり、デフォルトで空白の場合
        //     console.log("vd = ◯");
        //     console.log(`vd = ${vd}, vn = ${vn}`);

            // tb.readOnly = false; //

            // if (vn=="\u{25EF}"){
            //     tb.value = "";
            // }
            // else{
            //     tb.value = `${vn}`; // テキストボックスに、クリックしたマスの値を入れる
            //     // tb.value = `${vn}`; // テキストボックスに、クリックしたマスの値を入れる
            // }

        // }
    // if (rowi==null || colj==null){ // 格子外をクリックしたとき
    //     tb.value = "";
    //     tb.readOnly = true;
    // }
    // else{ // 格子内をクリックしたとき
    //     var vd = Gd[rowi][colj]; // デフォルトのマスの要素を取得
    //     var vn = Gn[rowi][colj]; // 現在のマスの要素を取得
                
    //     if (vd=="\u{3000}" || vd!="\u{25EF}"){ 
    //         // 格子内でも、マスのないところは変更不可にする
    //         // マスがあっても、デフォルトで値の入っているところは変更不可にする
    
    //         tb.value = "";
    //         tb.readOnly = true;    
    //     }
    //     else{ // 格子内で、マスがあり、さらに有効な文字の場合

    //         if (vn=="\u{25EF}"){
    //             tb.value = "";
    //         }
    //         else{
    //             tb.value = `${vn}`; // テキストボックスに、クリックしたマスの値を入れる
    //         }

    //         tb.focus(); // テキストボックスにフォーカスをあわせる
    //         tb.readOnly = false; // 
    //     }
    // }
    // console.log(`${e.key}`);

    // console.log(`when_penter, tb.value.length = ${tb.value.length}`);

    // if (tb.value.length==1 && tb.readOnly==false && e.key=="Enter"){ // テキストボックスが入力可能状態の場合
    // if (tb.value.length==1 && tb.readOnly==false && e.key=="Process"){ // テキストボックスが入力可能状態の場合
    // if (tb.value.length>1 && tb.readOnly==false && (e.key=="Process" || e.key=="Enter")){ // テキストボックスが入力可能状態の場合











        // tb.addEventListener("keyup",e=>{
        //     when_penter(e,context,tb);
        // },false);



// console.log(`rowi = ${rowi}, colj = ${colj}`);
        // console.log(`Gd[${rowi}][${colj}] = ${Gd[rowi][colj]}`);
        // console.log(`Gn[${rowi}][${colj}] = ${Gn[rowi][colj]}`);
        // console.log(`tb.readOnly = ${tb.readOnly}`);

        // console.log(`Gd[0] = ${Gd[0]}`);
        // console.log(`Gn[0] = ${Gn[0]}`);
        
        // Gn[0][1]="ぽ";

        // console.log(`Gd[0] = ${Gd[0]}`);
        // console.log(`Gn[0] = ${Gn[0]}`);



// window.onload = function(){    
    // ウィンドウのロード時に行うこと
    // canvas = document.getElementById("canvas_main");
    // context = canvas.getContext("2d");

    // var canvas = document.getElementById("canvas_main");
    // var context = canvas.getContext("2d");

    // canvasの縦・横幅
    // cw = (canvas.width);
    // ch = (canvas.height);
    
    // 格子の一つの四角の縦・横幅
    // sw = (canvas.width-2*c_mar)/32;
    // sh = (canvas.height-2*c_mar)/32;
    

            // canvas.addEventListener("mousemove", events["e_mousemove"], false);

        // canvas.addEventListener('contextmenu', event => event.preventDefault());

        // if (eflag["mousemove"] == "OFF") {
        //     eflag["mousemove"] = "ON";
        //     canvas.addEventListener("mousemove", when_mmove, false);    
        // }

        // Promise.resolve().then(eflag["mouseover"]=canvas.addEventListener("mouseover",when_mover,false));

        // eflag["mouseover"]=canvas.addEventListener("mouseover",when_mover,false); // canvas上にマウスインしたとき
        // eflag["mouseout"]=canvas.addEventListener("mouseout",when_mout,false); // canvas上にマウスインしたとき
        

    

//     p=Promise.resolve().then(prep_canvas_main.bind(this,canvas,context))
//     // .then(get_csv.bind(this,fname_a))
//     .then(get_csv.bind(this,fname_d))
//     .then(draw_grid.bind(this,{"sw":sw,"sh":sh}))
//     // .then(draw_grid.bind(this,{"context":context,"sw":sw,"sh":sh}))
//     // .then(res_event.bind(this,{"canvas":canvas,"context":context}));
//       
// }



        // console.log(`Gd = ${Gd[rowi][colj]}, Gn = ${Gn[rowi][colj]}`);
        
        // var nGd = Gd.map(inner=>inner.slice());

        // nGd[rowi][colj] = "や";
        // Gd[rowi][colj] = "や";
        
        // console.log(`Gd = ${Gd[rowi][colj]}, Gn = ${Gn[rowi][colj]}`);
        // , dGd = ${Gd[rowi][colj]}`

        // if (vd=="\u{3000}"){ 
                    // if (vd!="\u{25EF}"){
            //     tb.readOnly = true;
            // }
            // else{
            // }

        

        // tb.innerHTML = `<input type='text' value='${G[i][j]}' size=6 id='textbox' onfocus='this.value=this.value;'>`;
        // tb.innerHTML = `<input type='text' value='${G[i][j]}' size=6>`;
        // document.getElementById("textbox").focus();








            // canvas.addEventListener("mouseover", when_mmove, false);    

    //         // var canvas = args["canvas"];
//         // var context = args["context"];
//         var tb = document.getElementById("textbox");


//         // canvas.addEventListener("mousemove",e=>{
//         //     when_mmove(e,canvas,context);
//         // },false);

//         // canvas内でマウスをクリックしたとき
//         // canvas.addEventListener("click",e=>{
//         //     when_click(e,canvas);
//         // },false);

//         canvas.addEventListener("click",events["e_click"],false);

//         // canvas.addEventListener("click",e=>{
//         //     when_click(e,canvas);
//         // },false);


//         // テキストボックスにカーソルが合っているとき、Enterキーを押したとき
//         tb.addEventListener("keyup",e=>{
//             when_penter(e,context,tb);
//         },false);
//     });
// }

// var canvas = null;
// var context = null;

// function show(){
//     console.log(`Gd[0] = ${Gd[0]}`);
//     console.log(`Gn[0][0] = ${Gn[0]}`);
//     console.log(`Ga[0] = ${Ga[0]}`);

// }








        // console.log(`key_arrow = ${key_arrow}`)

// draw_sq_byij(context,i,j,ccolor_gb="white",bold=true); // 四角を描く

    // console.log(e);
    // console.log(e.key);

        // if (tb.readOnly==false && e.key=="Enter"){ // テキストボックスが入力可能状態の場合
    // if (tb.readOnly==false && e.keyCode ==13){ // テキストボックスが入力可能状態の場合
        // console.log("press enter!");

        // Gn[rowi][colj]=tb.value;






        // function prep_canvas_main(canvas,context){

        // console.log(`else!, ${cmar+j*sh,cmar+i*sw,sh,sw}`);














        // if (vd!="\u{25EF}"){
            //     tb.readOnly = true;
            // }
            // else{
            // }
            // context.font = ""; // 文字の設定
    // // function when_mmove(e,canvas,context){

    // console.log("mouse moving!");
    // console.log(`Gn = ${Gn}`);
    // change_sq_mover(context,e.offsetX,e.offsetY); // 四角を描画する

    // console.log("mouse clicked!");
    // console.log(getEventListeners(document.querySelector('canvas')));
    // console.log(`rowi=${rowi}, colj=${colj}, rowi_p=${rowi_p}, colj_p=${colj_p}`)
        // dtb.innerHTML = `<input type='text' value=' ' size=1>`;


        // tb.innerHTML = `<input type='text' value='${G[i][j]}' size=6 id='textbox' onfocus='this.value=this.value;'>`;
        // tb.innerHTML = `<input type='text' value='${G[i][j]}' size=6>`;
        // document.getElementById("textbox").focus();
// function when_mover(e){
//     // canvas上にマウスカーソルが乗った場合
//     console.log("mover!");
//     // console.log(eflag["mouseover"]);
// }

// function when_mout(e){
//     // canvas上からマウスカーソルが出ていった場合
//     console.log("mout!");
// }


// // function when_click(e,canvas,context){

//     // canvas.addEventListener("mousemove",e=>{
//     //     when_mmove(e,canvas,context);
//     // },false);
//     // canvas.removeEventListener("mousemove",when_mmove); // クリックのイベントを削除

//     // canvas.removeEventListener("mousemove",e=>{
//     //     when_mmove(e,canvas,context); // クリックのイベントを削除
//     // },false);

//     // console.log(tb);

//     var ij = xy2sq_ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得
//     i = ij[0];
//     j = ij[1];

//     
//     else{ // 格子内をクリックしたとき
//         var v = G[i][j];
        
//         if (v=="\u{3000}"){ 
//             // 格子内でも、マスのないところは変更不可にする
//             tb.value = "";
//             tb.readOnly = true;    
//         }
//         else{ // 格子内で、マスのあるところ
//             tb.value = `${G[i][j]}`; // テキストボックスに、クリックしたマスの値を入れる

//             if (v!="\u{25EF}"){
//                 // マスがあっても、デフォルトで値の入っているところは変更不可にする
//                 tb.readOnly = true;
//             }
//             else{
//                 tb.readOnly = false;
//                 tb.focus(); // テキストボックスにフォーカスをあわせる
//             }
//         } 

//         // tb.innerHTML = `<input type='text' value='${G[i][j]}' size=6 id='textbox' onfocus='this.value=this.value;'>`;
//         // tb.innerHTML = `<input type='text' value='${G[i][j]}' size=6>`;
//         // document.getElementById("textbox").focus();
//     }
//     // tb.setAttribute("type","text");
// }

// function when_penter(e,context,tb){
// function when_penter(e,tb){
//     // テキストボックスにフォーカスが合っているとき、Enterキーを押したとき
//     G[i][j]=tb.value;
//     console.log(`i=${i}, j=${j}, tb.value=${tb.value}, G[${i}][${j}]=${G[i][j]}`);    

//     draw_sq_byij(context,i,j,ccolor_gb="white",bold=false);
// }

// var events = {};
// events["e_mousemove"]=e=>when_mmove(e);
// events["e_click"]=e=>when_click(e);
// events["e_keyup"]=e=>when_penter(e,tb);









                // draw_sq_byij(Grid,rowi_p,colj_p,ccolor_gb="white",bold=false);
            
            // draw_sq_byij(Grid,rowi_p,colj_p,ccolor_gb="white",bold=true); // 太字で表示
            
              // function draw_sq_byij(i,j,ccolor_gb="white",bold=false){
// // function draw_sq_byij(context,i,j,ccolor_gb="white",bold=false){
//     console.log("draw_sq_byij");

//     

// }

//     var i,j;

    // return [i,j];
    // console.log(`change_sq_mover, x = ${x}, y = ${y}`);

    // xy2ij(x,y);
    // var ij=xy2sq_ij(x,y);
    // rowi=ij[0];
    // colj=ij[1];

    // console.log(`n = [${rowi}][${colj}], p = [${rowi_p}][${colj_p}]`);
            // draw_sq_byij(context,i,j,ccolor_gb="orange",bold=true);
            // draw_sq_byij(Grid,rowi,colj,ccolor_gb="orange",bold=true);
// function draw_grid(args, G) {
    // console.log(`draw_grid, G = ${G}`);

    // canvas上に格子を描く関数
    // var sw=args["sw"]; // 格子の幅
    // var sh=args["sh"]; // 格子の高さ
    // var context=args["context"]; // context
        // console.log(`Gd[0] = ${Gd[0]}`);
        // console.log(`Gn[0][0] = ${Gn[0]}`);
        // console.log(`Ga[0] = ${Ga[0]}`);
        // console.log(`Grid = ${Grid}`);
        // console.log(`Grid.length = ${Grid.length}`);
        
        




    // console.log(`dsb, Grid[0] = ${Grid[0]}`);
    // console.log(`draw_sq_byij, i, j, G[i][j] = ${i},${j},${G[i][j]}`);
    // console.log(`context = ${context}`);

    
    




            // G = result;

            // if (fname_csv == fname_d) { // デフォルトの格子情報
            //     // 2次元配列の値コピーには工夫が必要
            //     Gd = result.map(inner=>inner.slice());
            //     Gn = result.map(inner=>inner.slice());                
            // } else if (fname_csv == fname_a) { // 答えの格子情報
            //     Ga = result.slice();
            // }


            // resolve(Gn);



    // var message = "";






        // console.log(`Gd = ${Gd[rowi][colj]}, Gn = ${Gn[rowi][colj]}`);
        
        // var nGd = Gd.map(inner=>inner.slice());

        // nGd[rowi][colj] = "や";
        // Gd[rowi][colj] = "や";
        
        // console.log(`Gd = ${Gd[rowi][colj]}, Gn = ${Gn[rowi][colj]}`);
        // , dGd = ${Gd[rowi][colj]}`

        // if (vd=="\u{3000}"){ 








        // canvas.addEventListener("mouseover",function(e){
            // console.log("mousemove!");



// console.log(`canvas.width = ${canvas.width}`);
    // console.log(`canvas.height = ${canvas.height}`);
    // console.log(`canvas.left = ${canvas.left}`);
    // console.log(`canvas.top = ${canvas.top}`);

    // console.log(`e.clientX = ${e.clientX}`);
    // console.log(`e.clientY = ${e.clientY}`);

    // console.log(`e.offsetX = ${e.offsetX}`);
    // console.log(`e.offsetY = ${e.offsetY}`);
    
    // var rect = canvas.getBoundingClientRect();

    // console.log(`rect.width = ${rect.width}`);
    // console.log(`rect.height = ${rect.height}`);
    
    // context.fillStyle="blue";
    // context.fillRect(e.offsetX,e.offsetY,110,110); // マウスのある位置に四角を表示できたらいいな
        
        // console.log("i!=null && j!=null!!!");
        // console.log(`     i=${i}, j=${j}`);






    // .then(declare_moveaction)





// function onMouseOver(){
//     draw();
// }

// function onMouseOut(context){
    // console.log("off!");
    // canvas.style.background="red";
    // context.clearRect(0,0,canvas.width,canvas.height);
// }

// function draw(){
//     console.log("on!");
// }


    // canvas.addEventListener("mouseover",onMouseOver,false);
    // canvas.addEventListener("mouseout",onMouseOut(context),false);
    




                    // console.log(i,j,G[i][j]," = 空白");
                    // context.fillStyle=ccolor_bg;
                    // context.fillRect(10+j*gh,10+i*gw,gh,gw);



                // else if (G[i][j]=="\u{25EF}") { // ◯は、枠だけ表示
                //     context.strokeStyle=ccolor_gs;
                //     context.strokeRect(10+j*gh,10+i*gw,gh,gw);
                //     context.fillStyle=ccolor_gb;
                //     context.fillRect(10+j*gh,10+i*gw,gh,gw);
                // }
                // else{ // 文字は、枠付きで表示
                //     // console.log(i,j,G[i][j]," = 文字");
                //     context.strokeStyle=ccolor_gs;
                //     context.strokeRect(10+j*gh,10+i*gw,gh,gw);
                //     context.fillStyle=ccolor_gb;
                //     context.fillRect(10+j*gh,10+i*gw,gh,gw);
                //     // context.fontcolor = "black";
                //     context.font = `${gh}px serif`;
                //     context.fillStyle=ccolor_fd;                    
                //     context.fillText(G[i][j],10+j*gh,10+i*gw);
                // }

    // console.log(`sq_xy2ij(x,y) = ${sq_xy2ij(x,y)}`);

    // console.log(`x=${x}, y=${y}`);
    // console.log(`i=${i}, j=${j}, i_p=${i_p}, j_p=${j_p}`);

        // console.log("i_p!=null && j_p!=null");

    // if ((x_p>=c_mar && x_p<cw-c_mar)&&(y_p>=c_mar || y_p<ch-c_mar)){
        // 1. 以前のx,yが格子の範囲の内にあるとき
        // 以前の格子を元の状態に戻す
        // console.log(`格子外! x = ${x}, y = ${y}`);

        // x,yからi,jを取得する
        // var ij = sq_xy2ij(x,y);
        // var i = ij[0];
        // var j = ij[1];
        
    //     if 
    //     draw_sq_byij(context,i_p,j_p,ccolor_gb="white");

    //     x_p=null;
    //     y_p=null;
    //     i_p=null;
    //     j_p=null;
    // }

    // if ((x>=c_mar && x<cw-c_mar)&&(y>=c_mar || y<ch-c_mar)){
        // console.log(`格子外! x = ${x}, y = ${y}`);

        // x,yからi,jを取得する
    //     var ij = sq_xy2ij(x,y);
    //     var i = ij[0];
    //     var j = ij[1];

    //     if (i!=i_p && j!=j_p){ // 格子が変わった場合のみ、表示
    //         draw_sq_byij(context,i,j,ccolor_gb="orange");
    //     }

    //     x_p=x;
    //     y_p=y;
    //     i_p=i;
    //     j_p=j;
    // }

    // else{
    //     // x,yの両方が格子の範囲内にあるとき
    //     console.log(`格子内! x = ${x}, y = ${y}`);
        

    //     // x,yからi,jを取得する
    //     var ij = sq_xy2ij(x,y);
    //     var i = ij[0];
    //     var j = ij[1];
        
    //     if (i!=null && i_p!=null && i!=i_p) && (j!=null && j_p!=null && j!=j_p) { // 格子内→格子内の移動の際
    //         console.log(`i = ${i}, j = ${j}, i_p = ${i_p}, j_p = ${j_p}`);
    //     }

    //     x_p=x;
    //     y_p=y;
    //     i_p=i;
    //     j_p=j;

    // }


    // console.log(`x = ${x}, y = ${y}`);

    

    // // マウスカーソルがcanvas内から外にでたときの処理
    // if ((i_prev!=null && i_prev>=0 && i_prev<32) && (j_prev!=null && j_prev>=0 && j_prev<32) &&
    // (i==null || i<0 || i>=32) || (j==null || j<0 || j>=32)){
    //     console.log("");

    //     draw_sq_byij(context,i_prev,j_prev,ccolor_gb="white");

        // console.log(`x out!, j = ${j}`);

    // }

    // else if (i>=0 && i<32 && j>=0 && j<32){ // 格子のindexが範囲内の場合、言い換えれば対応する位置に格子がある場合
    //     // console.log(`change_sq_mover(x,y), x = ${x}, y = ${y}, j = ${j}, i = ${i}, c_mar = ${c_mar}`);

    //     if ((i_prev!=i) || (j_prev!=j)){
    //         // もし前回と違う場合
    //         // console.log(`i_prev = ${i_prev}, i = ${i}`);
    //         // console.log(`j_prev = ${j_prev}, j = ${j}`);

    //         draw_sq_byij(context,i,j,ccolor_gb="orange");

    //         if (i_prev!=null && i_prev!=null){
    //             draw_sq_byij(context,i_prev,j_prev,ccolor_gb="white");
    //         }
            
    //         i_prev=i;
    //         j_prev=j;   
    //     }
    // }
    // else{
    //     i_prev=null;
    //     j_prev=null;
    // }



    // // console.log(`i = ${i}, j = ${j}`);


                    // console.log("i, j, G[i][j], 文字コード = ",i,j,G[i][j],G[i][j].charCodeAt(0));

                // if (j==31){
                //     console.log("j==31, 文字コード = ",G[i][j]=="\u{3000}");
                // }


    // console.log("");

                    // console.log(i,j,G[i][j]," = ◯");


            // console.log(`tmp[i] = ${tmp[i]}`);    
            // console.log(`result[i] = ${result[i]}`);
            // console.log(`tmp[i].length = ${tmp[i].length}`);
            // console.log(`result[i].length = ${result[i].length}`);
            
            // console.log(`result[i][30] = ${result[i][30]}`);
            // console.log(`result[i][31] = ${result[i][31]}`);
    
            // console.log(`result[i][30].charCodeAt(0) = ${result[i][30].charCodeAt(0)}`);
            // console.log(`result[i][31].charCodeAt(0) = ${result[i][31].charCodeAt(0)}`);

            // console.log(`i = ${i}`)
            


    // console.log("get_csv!");

    // console.log("prep_canvas_main!");


    // var cw=canvas.width;
    // var ch=canvas.height;

    // console.log("cw = ",cw);

    // p=Promise.resolve().then(get_csv.bind(this,fname_d)).then(display);
    
    // p=Promise.resolve().then(get_csv.bind(this,fname_d)).then(display);

    // canvas.addEventListener("mouseover",onMouseOver,false);
    // canvas.addEventListener("mouseout",onMouseOut,false);
    

    // console.log("gw = ",gw);

    // function onMouseOver(e){
    //     // Canvas上にマウスが乗ったとき
    //     rect=e.target.getBoundingClientRect();
    //     canvas.addEventListener("mousemove",onMouseMove,false);
    // }
    
    // function onMouseOut(){
    //     // Canvasからマウスが離れたとき
    //     canvas.removeEventListener("mousemove",onMouseMove,false);
    // }
    
    // function onMouseMove(e){
    //     // Canvas上でマウスが動いているとき
    //     // マウスが動くたびに要素上に乗っているかどうかをチェック
    //     moveActions.updateTargetFlag(e);
    
    //     // 実行する関数には、間引きを噛ませる
    //     if (targetFlag){
    //         moveActions.throttle(moveActions.over,50);
    //     }
    //     else{
    //         moveActions.throttle(moveActions.out,50);
    //     }
    // }

        // var tmp = str.split("%0A");
        // var rect = null;
// var context = null;

// var x_p = null; // 前回のx
// var y_p = null; // 前回のy



        // console.log(`全角スペース = ${"　".charCodeAt(0)}`)
        // console.log(`半角スペース = ${" ".charCodeAt(0)}`)
        // console.log(`カンマ = ${",".charCodeAt(0)}`)
        

        // console.log(`tmp[0][30] = ${tmp[0][30]}`);
        // console.log(`tmp[0][31] = ${tmp[0][31]}`);

        // console.log(`tmp[0][0].charCodeAt(0) = ${tmp[0][0].charCodeAt(0)}`);
        // console.log(`tmp[0][31].charCodeAt(0) = ${tmp[0][31].charCodeAt(0)}`);

        // console.log(`tmp.length = ${tmp.length}`);
        // console.log(`tmp[31] = ${tmp[31]}`);
        // console.log(`tmp[32] = ${tmp[32]}`);
                    // if ((G[i][j]=="\u{3000}")||(G[i][j]==" ")){ // 全角空白は、枠を表示しない
                // }
                // else{ // 全角空白以外のとき、枠を表示
                //     context.strokeStyle=ccolor_gs;
                //     context.strokeRect(10+j*gh,10+i*gw,gh,gw);
                //     context.fillStyle=ccolor_gb;
                //     context.fillRect(10+j*gh,10+i*gw,gh,gw);

                //     if (G[i][j]=="\u{25EF}") { // ◯の場合は、もうなにもしない
                //     }
                //     else{ // 文字の場合は、文字を表示
                //         context.font = `${gh}px serif`;
                //         context.fillStyle=ccolor_fd;                    
                //         context.fillText(G[i][j],10+j*gh,10+i*gw);
                //     }
                // }

// function declare_moveaction(){
//     // moveactionを宣言するだけの関数

//     return new Promise(function (resolve,reject){
//         var moveaction={
//             // whenmmove()内で宣言すると、下のoutが複数回実行されてしまう
        
//             timer:null,
//             // targetFlagの更新
//             updateTargetFlag: function(e){
//                 targetFlag = ((e.clientX<500)&&(e.clientY<500));
//             },
//             // 連続イベントの間引き
//             throttle: function(targetFunc,time){
//                 var _time = time || 100;
//                 clearTimeout(this.timer);
//                 this.timer = setTimeout(function (){
//                     targetFunc();
//                 },_time);
//             },
//             over: function(){ 
//                 // targetFlag==Trueの範囲でマウスカーソルを動かし終わったときに実行
//                 console.log("over throttle!");
//                 // context.fillStyle="blue";
//                 // context.fillRect(e.clientX,e.clientY,10,10); // マウスのある位置に四角を表示できたらいいな
//             },
        
//             out: function(){ // 
//                 // targetFlag==Falseの範囲でマウスカーソルを動かし終わったときに実行
//                 console.log("out throttle!");
//             },
//         };

//         resolve();
//     });
// }

    // console.log(`sq_xy2ij is called!`);
    // console.log(`x = ${x}, y = ${y}`);
        // console.log(`y out!, i = ${i}`);


// var moveaction={
//     // whenmmove()内で宣言すると、下のoutが複数回実行されてしまう

//     timer:null,
//     // targetFlagの更新
//     updateTargetFlag: function(e){
//         targetFlag = ((e.clientX<500)&&(e.clientY<500));
//     },
//     // 連続イベントの間引き
//     throttle: function(targetFunc,time){
//         var _time = time || 100;
//         clearTimeout(this.timer);
//         this.timer = setTimeout(function (){
//             targetFunc();
//         },_time);
//     },
//     over: function(){ 
//         // targetFlag==Trueの範囲でマウスカーソルを動かし終わったときに実行
//         console.log("over throttle!");
//         // context.fillStyle="blue";
//         // canvas;
//         context.fillRect(e.clientX,e.clientY,10,10); // マウスのある位置に四角を表示できたらいいな
//     },

//     out: function(){ // 
//         // targetFlag==Falseの範囲でマウスカーソルを動かし終わったときに実行
//         console.log("out throttle!");
//     },
// };



// function when_mmove(e,context){
//     // マウスがキャンバス内で動いているときの関数
//     console.log("mouse moving!");
//     console.log(`e.clientX = ${e.clientX}`)
//     console.log(`e.clientY = ${e.clientY}`)

//     // マウスが動くたびに、要素上に乗っているかどうかをチェック
//     moveaction.updateTargetFlag(e);

//     // 実行する関数には、間引きを噛ませる
//     if (targetFlag){
//         moveaction.throttle(moveaction.over,50);
//     }
//     else{
//         moveaction.throttle(moveaction.out,50);
//     }
// }


// function event_min(canvas,context){
//     // 範囲外から範囲内に入ったときのイベントを登録する関数

//     function when_min(e){
//         console.log("when_min");
    
//         // rect = e.target.getBoundingClientRect(); // 長方形
//         canvas.addEventListener("mousemove",when_mmove,false); // マウスが動いているとき
//     }
    // console.log(`draw_sq_byij(), i = ${i}, j = ${j}`);

//     return new Promise(function (resolve,reject){
//         canvas.addEventListener("mouseover",when_min,false);
//         resolve();
//     });
// }

// function event_mout(canvas,context){
//     // マウスアウトのイベントを登録する関数

//     function when_mout(){
//         console.log("when_mout");
//         // console.log("off!");        
//         // context.clearRect(10,10,100,100);
//         canvas.removeEventListener("mousemove",when_mmove,false); // マウスが動いているとき
//     }

//     return new Promise(function (resolve,reject){
//         canvas.addEventListener("mouseout",when_mout,false);
//         resolve();
//     });
// }

// function event(args){
//     // 複数のイベントを並列で実行する関数
//     var canvas=args["canvas"];
//     var context=args["context"];

//     return Promise.all([
//         event_min(canvas,context),
//         event_mout(canvas,context)
//     ]);
// }

    // var moveActions ={
    //     // mouseMoveで実行する関数
    //     timer: null,
    
    //     // targetFlagの更新
    //     updateTargetFlag: function (e) {
    //         var x=e.clientX-rect.left;
    //         var y=e.clientY-rect.top;
    
    //         // 最後の50は、該当する要素の半サイズを想定
    //         var a=(x>w/2-50);
    //         var b=(x<w/2+50);
    //         var c=(y>h/2-50);
    //         var d=(y<h/2+50);
    
    //         targetFlag=(a&&b&&c&&d); // booleanを代入
    //     },
    
    //     // 連続イベントの間引き
    //     throttle: function (targetFunc,time){
    //         var _time=time||100;
    //         clearTimeout(this.timer);
    //         this.timer=setTimeout(function(){
    //             targetFunc();
    //         },_time);
    //     },
    
    //     out: function (){
    //         function whenout(){
    //             console.log("out!");
    //         }
    //     },
    
    //     over: function (){
    //         function whenover(){
    //             console.log("over!");
    //         }
    //     }
    // };
    
    // var p=Promise.resolve(get_csv("./data/csv/answer_sq.csv",function (r){
    //     console.log(r);
    //     return r;
    // }));


    // var mypromise = new Promise(function (resolve, reject) {
    //     // 実行したい処理を記述
    //     setTimeout(function () {
    //         // 成功
    //         resolve("成功!"); // resolve(渡したい値)
    //     },3000);
    // });

    // mypromise.then(function (value) {
    //     // 非同期処理が成功した場合
    //     console.log("OK: "+value); // => 実行結果: 成功!
    // }).catch(function (value) {
    //     // 非同期処理が失敗した場合
    //     console.log("NG: "+value); // 呼ばれない
    // });

    // p=Promise.resolve().then(task1).then(task2).then(task3);
    // var fname_d="./data/csv/default_sq.csv"; // csvファイル名
    // p=Promise.resolve().then(get_csv.bind(this,fname_d)).then(display);

    // console.log("r = ",r);

    



    // var S=get_csv("./data/csv/answer_sq.csv",function (r){
    //     return r;
    // }); // csvを読み込んで取得

    // var promise = new Promise(function (resolve,reject) {

    //     f1();
    //     S=get_csv("./data/csv/answer_sq.csv",function (r){
    //         console.log("r = ",r)
    //         // return r;
    //         resolve(r);
    //     })

    //     // resolve();

    //     console.log("first!",S);
    // });



    // p.then(function(value){
    //     console.log("second!",value);
    // })

    // console.log(p);

    // var promise = Promise.resolve();
    // promise.then(
        // S=get_csv("./data/csv/answer_sq.csv",function (r){
        //     return r;
        // }),console.log("first")
    // );
    // promise.then(console.log("last",S));
    // promise.then(f3());
    

    // console.log("last",S);

    // $.getJSON("./data/json/answer_sq.json",function(data){
    //     var y=0;

    //     $.each(data.square, function (k, v) { 
    //         var x=0;

    //         $.each(v, function (vk, vv) {
    //             console.log(x,y,vv);
    //             context.fillStyle = "Brown"; // 四角の色
    //             context.fillRect(x,y,10,10); // 左からのサブセット、上からのサブセット、幅、高さの四角の枠線を描く
    //             x++;      
    //         });
    //         console.log("break");

    //         y++;
    //     });
    // });


// ゴミ置き場
// console.log(result);
// return result;
// console.log("S",S);
// return S;

// function read_csv(fname_csv){
//     // csvファイルを文字列として取得
//     var srt = new XMLHttpRequest;


// }

// function callback(a){
//     console.log("callback",a)
//     S=a;

//     return a;
// }

function task1(){
    return new Promise(function (resolve,reject){
        console.log("task1 started!");

        setTimeout(function(){
            console.log("task1 processing...")
            resolve("task1 complete!");
        },1000);
    });
}

function task2(value){
    return new Promise(function (resolve,reject){
        setTimeout(function(){
            console.log("task2 started!");
            console.log("task2 value = ",value);
            console.log("task2 processing...");
            resolve(["task2 completed!",123]);
        },3000);
    });
}

function task3(value){
    return new Promise(function (resolve,reject){
        console.log("task3 value = ",value);
        resolve(value);
    })
}



   
    // request.onload = function(){
    //     result = split_csv(request.responseText);
    //     callback(result);
    // };

    


    // console.log("get_csv , ",split_csv(request.responseText));

    // request.onload = split_csv(request.responseText,function (r){
    //     return r
    // });

    // console.log("request.onload = ",request.onload)

    // return split_csv(request.responseText);
        // callback(result);
        
    // callback(request.onload);

    // return new Promise(resolve())

    // function f1(){
    //     setTimeout(console.log("first! f1"),1000);
    // }
    // function f2(){
    //     console.log("f2");
    // }
    // function f3(){
    //     console.log("f3");
    // }
    
    // function display(value){
    //     console.log("dis = ",value);
    // }
    
    
    // function 


        // console.log("task1 started!");

        // setTimeout(function(){
        //     console.log("task1 processing...")
        //     resolve("task1 complete!");
        // },1000);

                    // console.log(`tmp[i] = ${tmp[i]}`);    
            // console.log(`result[i] = ${result[i]}`);
            // console.log(`tmp[i].length = ${tmp[i].length}`);
            // console.log(`result[i].length = ${result[i].length}`);
            
            // console.log(`result[i][30] = ${result[i][30]}`);
            // console.log(`result[i][31] = ${result[i][31]}`);
    
            // console.log(`result[i][30].charCodeAt(0) = ${result[i][30].charCodeAt(0)}`);
            // console.log(`result[i][31].charCodeAt(0) = ${result[i][31].charCodeAt(0)}`);

            // context.globalCompositeOperation = "source-over";

            // context.fontcolor = "black";
            // context.font = `${gh}px serif`;
            // console.log(`${gh}px serif`);
            // context.fillStyle=ccolor_fd;
    
            // for (let i=0;i<10;i++){
            //     context.fillText(i,10*i,10*i);
            // }
    
            // console.log("check G[0][0]==G[0][31] = -",G[0][0]==G[0][31],"-");
            // console.log("check normalize G[0][0]==G[0][31] = -",((G[0][0].normalize())==(G[0][31]).normalize()),"-");
            
            // console.log("check unicode G[0][0]==G[0][31] = -",(toUnicode(G[0][0])==toUnicode(G[0][31])),"-");
            
            // console.log(`check G[0][0] = ${G[0][0]}`);
            // console.log(`check G[0][31] = ${G[0][31]}`);
    
            // console.log(`G[0][0].length = ${G[0][0].length}`)
            // console.log(`G[0][31].length = ${G[0][31].length}`)
    
            // console.log(`G[0][0][0] = ${G[0][0][0]}`)
            // console.log(`G[0][0][1] = ${G[0][0][1]}`)
            // console.log(`G[0][31][0] = ${G[0][31][0]}`)
            // console.log(`G[0][31][1] = ${G[0][31][1]}`)
            
            // console.log(`G[0][31].length = ${G[0][31].length}`)
    
    
            // console.log(`check G[0][0][0].charCodeAt(0) = ${G[0][0][0].charCodeAt(0)}`);
            // console.log(`check G[0][31][0].charCodeAt(0) = ${G[0][31][0].charCodeAt(0)}`);
            // console.log(`check G[0][31][1].charCodeAt(0) = ${G[0][31][1].charCodeAt(0)}`);
            // // console.log(`check G[0][31][0].charCodeAt(0) = ${G[0][31][0].charCodeAt(0)}`);
            // console.log(`check G[0][31][0].charCodeAt(1) = ${G[0][31][0].charCodeAt(1)}`);
    
    
            // console.log(`check G[0][0]==\u{3000} = ${(G[0][0]=="\u{3000}")}`);
            // console.log(`check G[0][31]==\u{3000} = ${(G[0][31]=="\u{3000}")}`);
    
            // console.log("check G[0][31]==\u{3000} = -",(G[0][31]=="\u{3000}"),"-");
            
                 
            // console.log("check, ",G[0][0]==G[0][31]);
    