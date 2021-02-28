var ccolor_bg = "gray"; // canvasの背景色
var ccolor_gs = "darkblue"; // canvasの格子の枠線の色
var ccolor_gb = "white"; // canvasの格子の背景の色
var ccolor_fd = "black"; // canvas内のデフォルトの文字の色
var targetFlag = false; // trueでマウスが要素に乗っているとみなす
var rect = null;

function get_csv(fname_csv){
    // csvを読み込んだ結果を取得する関数

    function split_csv(str){
        // csvの中身を読み込む関数
        var result = [];
        var tmp = str.split("\r\n");

        for (var i=0;i<tmp.length;i++){
            result[i]=tmp[i].split(",");
        }
    
        return result
    }    

    return new Promise(function(resolve,reject){
        var request = new XMLHttpRequest();
        request.open("GET",fname_csv,true);
        request.send(null);

        request.onload = function(){
            result = split_csv(request.responseText);
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

function draw_grid(args,G){
    // canvas上に格子を描く関数
    var gw=args["gw"]; // 格子の幅
    var gh=args["gh"]; // 格子の高さ
    var context=args["context"]; // context

    return new Promise(function (resolve,reject){
        // 枠線の描画
        for (let i=0;i<32;i++){
            for (let j=0;j<32;j++) {
                if ((G[i][j]=="\u{3000}")||(G[i][j]==" ")){ // 全角空白は、枠を表示しない
                }
                else{ // 全角空白以外のとき、枠を表示
                    context.strokeStyle=ccolor_gs;
                    context.strokeRect(10+j*gh,10+i*gw,gh,gw);
                    context.fillStyle=ccolor_gb;
                    context.fillRect(10+j*gh,10+i*gw,gh,gw);

                    if (G[i][j]=="\u{25EF}") { // ◯の場合は、もうなにもしない
                    }
                    else{ // 文字の場合は、文字を表示
                        context.font = `${gh}px serif`;
                        context.fillStyle=ccolor_fd;                    
                        context.fillText(G[i][j],10+j*gh,10+i*gw);
                    }
                }
            }
        }

        resolve();
    });
}


function when_mmove(e){
    // マウスが動いているときの関数
    console.log("mouse moving!");

    var moveactions={
        timer:null,
        // targetFlagの更新
        updateTargetFlag: function(e){
            targetFlag = ((e.clientX<10)&&(e.clientY<10));
        },
        // 連続イベントの間引き
        throttle: function(targetFunc,time){
            var _time = time || 100;
            clearTimeout(this.timer);
            this.timer = setTimeout(function (){
                targetFunc();
            },_time);
        },
        out: function(){
            console.log("off throttle!");
        },
        over: function(){
            console.log("on throttle!");
        }
    };
}


function event_mover(canvas,context){
    // マウスオーバーのイベントを登録する関数
    function when_mover(e){
        console.log("on!");
        context.fillStyle="blue";
        context.fillRect(10,10,100,100);

        rect = e.target.getBoundingClientRect(); // 長方形
        canvas.addEventListener("mousemove",when_mmove,false); // マウスが動いているとき
    }

    return new Promise(function (resolve,reject){
        canvas.addEventListener("mouseover",when_mover,false);
        resolve();
    });
}

function event_mout(canvas,context){
    // マウスアウトのイベントを登録する関数
    function when_mout(){
        console.log("off!");        
        context.clearRect(10,10,100,100);
        canvas.removeEventListener("mousemove",when_mmove,false); // マウスが動いているとき
    }

    return new Promise(function (resolve,reject){
        canvas.addEventListener("mouseout",when_mout,false);
        resolve();
    });
}

function event(args){
    // 複数のイベントを並列で実行する関数
    var canvas=args["canvas"];
    var context=args["context"];

    return Promise.all([
        event_mover(canvas,context),
        event_mout(canvas,context)
    ]);
}

window.onload = function(){
    // ウィンドウのロード時に行うこと
    var canvas = document.getElementById("canvas_main");
    var context = canvas.getContext("2d");


    // 格子の縦・横幅
    var gw = (canvas.width-20)/32;
    var gh = (canvas.height-20)/32;
    
    var fname_d="./data/csv/default_sq.csv"; // csvファイル名、最初の状態
    // var fname_a="./data/csv/answer_sq.csv"; // csvファイル名、答え
    
    // promiseで順番に実行
    // 1. canvas_mainを描く
    // 2. csvを読み込む
    // 3. csvの内容に基づいて、格子を表示


    p=Promise.resolve().then(prep_canvas_main.bind(this,canvas,context))
    // .then(get_csv.bind(this,fname_a))
    .then(get_csv.bind(this,fname_d))    
    .then(draw_grid.bind(this,{"context":context,"gw":gw,"gh":gh}))
    .then(event.bind(this,{"canvas":canvas,"context":context}));


















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
}

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
    