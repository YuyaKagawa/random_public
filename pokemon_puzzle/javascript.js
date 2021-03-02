var ccolor_bg = "gray"; // canvasの背景色
var ccolor_gs = "darkblue"; // canvasの格子の枠線の色
var ccolor_gb = "white"; // canvasの格子の背景の色
var ccolor_fd = "black"; // canvas内のデフォルトの文字の色
var targetFlag = false; // trueでマウスが要素に乗っているとみなす
var sw = null; // 格子の中の一つの四角の横幅
var sh = null; // 格子の中の一つの四角の縦幅
var cw = null; // canvasの横幅
var ch = null; // canvasの縦幅

var G = null; // 格子の情報
var c_mar = 10; // canvas上の端（上下左右）のマージン
var i_p = null; // 前回指した四角はi行目
var j_p = null; // 前回指した四角はj列目

function get_csv(fname_csv){
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

        request.onload = function(){
            result = split_csv(request.responseText);
            G=result;
            resolve(result);
        };
    });
}

function prep_canvas_main(canvas,context){
    // mainのcanvasを用意する関数
    // promiseで実行

    return new Promise(function (resolve,reject){
        context.textBaseline = "top";
        context.fillStyle = ccolor_bg; // 四角の色
        
        // 左からのサブセット、上からのサブセット、幅、高さの四角の枠線を描く
        context.fillRect(0,0,canvas.width,canvas.height); 
        resolve();
    });    
}

function draw_sq_byij(context,i,j,ccolor_gb="white"){
    // i行j列目という情報が与えられたときの、i行j列目の四角を描く関数

    if ((G[i][j]=="\u{3000}")||(G[i][j]==" ")){ // 全角空白は、枠を表示しない
    }
    else{ // 全角空白以外のとき、枠を表示
        context.strokeStyle=ccolor_gs;
        context.strokeRect(c_mar+j*sh,c_mar+i*sw,sh,sw);
        context.fillStyle=ccolor_gb; // 枠があるときの背景色
        context.fillRect(c_mar+j*sh,c_mar+i*sw,sh,sw);

        if (G[i][j]=="\u{25EF}") { // ◯の場合は、もうなにもしない
        }
        else{ // 文字の場合は、文字を表示
            context.font = `${sh}px serif`;
            context.fillStyle=ccolor_fd;                    
            context.fillText(G[i][j],c_mar+j*sh,c_mar+i*sw);
        }
    }
}

function xy2sq_ij(x,y){
    // x,yを受け取り、i,jに変換する
    // x,yからi行j列目という情報を抽出して返す
    // x,yが範囲外の場合、i,jはそれぞれnullを返す
    
    var i,j;

    if (x<c_mar || x>=cw-c_mar){ // xが格子の範囲外の場合
        j=null;
    }else{
        j = Math.floor((x-c_mar)/sw);
    }

    if (y<c_mar || y>=ch-c_mar){ // yが格子の範囲外の場合
        i=null;
    }else{
        i = Math.floor((y-c_mar)/sh);
    }

    return [i,j];
}

function change_sq_mover(context,x,y){
    // マウスがオーバーしている四角の属性を、変化させる
    // canvas上でのx,y座標を与えることで、その部分の四角を再描画する関数
    // 条件分岐は2つ
    // 1. 以前のx,yが格子の範囲の内にある場合
    // 2. 現在のx,yが格子の範囲の内にある場合
         
    var ij=xy2sq_ij(x,y);
    var i=ij[0];
    var j=ij[1];

    if (i_p!=null && j_p!=null){
        // 1. 以前のx,yが格子の範囲の内にあるとき

        if ((i==i_p) && (j==j_p)){ // 以前と同じ四角を指している場合、何もしない
        }
        else if ((i!=i_p) || (j!=j_p)){ // 以前と異なる四角を指している場合、以前の四角を消す
            draw_sq_byij(context,i_p,j_p,ccolor_gb="white");
        }
    }

    if (i!=null && j!=null){
        // 2. 現在のx,yが格子の範囲の内にある場合

        if ((i==i_p) && (j==j_p)){ // 以前と同じ四角を指している場合、何もしない
        }
        else if ((i!=null && i!=i_p) || (j!=null && j!=j_p)){ // 以前と異なる四角を指している場合、現在の位置に四角を表示
            draw_sq_byij(context,i,j,ccolor_gb="orange");
        }
    }

    i_p=i;
    j_p=j;
}

function draw_grid(args,G){
    // canvas上に格子を描く関数
    var sw=args["sw"]; // 格子の幅
    var sh=args["sh"]; // 格子の高さ
    var context=args["context"]; // context

    return new Promise(function (resolve,reject){
        // 枠線の描画
        for (let i=0;i<32;i++){
            for (let j=0;j<32;j++) {
                draw_sq_byij(context,i,j); // 四角を描く
            }
        }

        resolve();
    });
}

function when_mmove(e,canvas,context){
    // canvas内でマウスが動いているとき
    // 厳密には、canvas外→内、canvas内→外の動作も取る
    change_sq_mover(context,e.offsetX,e.offsetY); // 四角を描画する
}

function when_click(e){
    // canvas内でクリックしたとき
    var tb = document.getElementById("textbox"); // html内に記述したテキストボックスの要素を取得
    // console.log(tb);

    var ij = xy2sq_ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得
    var i = ij[0];
    var j = ij[1];

    if (i==null || j==null){ // 格子外をクリックしたとき
        tb.innerHTML = `<input type='text' value=' ' size=1>`;
    }
    else{ // 格子内をクリックしたとき
        tb.innerHTML = `<input type='text' value='${G[i][j]}' size=6>`;
    }
    // tb.setAttribute("type","text");
}

function res_event(args){
    // イベントの登録をする関数

    return new Promise(function(resolve,reject){
        var canvas = args["canvas"];
        var context = args["context"];

        canvas.addEventListener("mousemove",e=>{
            when_mmove(e,canvas,context);
        },false);

        canvas.addEventListener("click",e=>{
            when_click(e);
        },false);
    });
}


window.onload = function(){    
    // ウィンドウのロード時に行うこと
    var canvas = document.getElementById("canvas_main");
    var context = canvas.getContext("2d");

    // canvasの縦・横幅
    cw = (canvas.width);
    ch = (canvas.height);
    
    // 格子の一つの四角の縦・横幅
    sw = (canvas.width-2*c_mar)/32;
    sh = (canvas.height-2*c_mar)/32;
    

    var fname_d="./data/csv/default_sq.csv"; // csvファイル名、最初の状態
    // var fname_a="./data/csv/answer_sq.csv"; // csvファイル名、答え
    
    // promiseで順番に実行
    // 1. canvas_mainを描く
    // 2. csvを読み込む
    // 3. csvの内容に基づいて、格子を表示

    p=Promise.resolve().then(prep_canvas_main.bind(this,canvas,context))
    // .then(get_csv.bind(this,fname_a))
    .then(get_csv.bind(this,fname_d))    
    .then(draw_grid.bind(this,{"context":context,"sw":sw,"sh":sh}))
    .then(res_event.bind(this,{"canvas":canvas,"context":context}));

    
}


























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
    