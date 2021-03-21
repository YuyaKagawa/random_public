function clone(obj) {
    // オブジェクトのクローンをする関数
    // 何か分からんが残しておく

    if (obj == null || typeof obj != "object"){ // もしオブジェクトがnullかobjectではない場合
        return obj;
    }
    
    var copy = obj.constructor(); // 分からん

    for (var attr in obj) { // 分からん
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function finish(){
    // とりあえず画像の読み込みを待つのみのダミー関数的なやつ

    return function(){
    }
}

function show_howto(){
    // 遊び方をキャンバスに表示する関数

    return new Promise(function(resolve,reject){
        // context.fillStyle = colorb; // 背景色
        // context.fillRect(0,0,canvas.width,canvas.height); // 長方形    
        context.fillStyle = "white"; // テキストの色
        context.textAlign = "center"; // 文字の配置
        context.font = `${fsize_big}px serif`; // テキストの文字サイズ

        // 表示するテキスト
        const text1 = "↑のあそびかたを読んでください";
        const text2 = "準備ができたら";
        const text3 = "「スタート」ボタンを押してください！";

        context.fillText(text1,canvas.width/2,canvas.height/2-2*fsize_big); // テキストを表示    
        context.fillText(text2,canvas.width/2,canvas.height/2); // テキストを表示 
        context.fillText(text3,canvas.width/2,canvas.height/2+2*fsize_big); // テキストを表示       

        resolve();
    });
}

function clear_canvas(){
    // キャンバスをクリアする関数

    return new Promise(function(resolve,reject){
        context.clearRect(0,0,canvas.width,canvas.height); // キャンバスを初期化
        resolve();
    });
}

function show_phase(){
    // フェーズをキャンバスの右上に表示する関数

    return new Promise(function(resolve,reject){
        context.fillStyle = "white"; // テキストの色
        context.textAlign = "end"; // 文字の配置
        context.font = `${fsize_big}px serif`; // テキストの文字サイズ

        // 表示するテキスト
        const text = `フェーズ${phase}`;
        
        context.fillText(text,canvas.width-cmar,cmar+fsize_big); // テキストを表示    

        resolve();
    });
}

function prep_card40(){
    // 40枚のカードを用意する関数
    // カードの名前

    return new Promise(function(resolve,reject){
        for (let ind_s=0;ind_s<4;ind_s++){ // 各スートについて
            for (let n=1;n<=10;n++){ // 各数字について
                var cname = `${Suit[ind_s]}${String(n).padStart(2,"0")}`;
                var ind_c = ind_s*10+n-1; // カードの通し番号

                list_card40[ind_c] = cname; // リストに格納
                list_card40_img[ind_c] = new Image(); // 画像オブジェクト
                list_card40_img[ind_c].onload = finish();
                list_card40_img[ind_c].src = `img/${cname}.gif`;

            }
        }

        resolve();
    });
}

function choose21from40(){
    // 今回のタスクでは、数字は全部で40個、この中から21個選ばれるのが固定

    return new Promise(function(resolve,reject){
        let list_card40_img_cp = clone(list_card40_img); // これから小さくなってゆくarrayのコピー

        for (let t=0;t<21;t++){ // 21枚について
            const r = Math.floor(Math.random()*list_card40_img_cp.length); // ランダムに選択された数字

            list_card21_img[t] = list_card40_img_cp[r].cloneNode(true); // 何かこんな感じ？
            list_card40_img_cp.splice(r,1); // 1枚ランダムに取り出す
        }

        // setTimeout(console.log("after this, 10s"),10000);


        console.log(`choose21from40, list_card21_img = ${list_card21_img}`);
        resolve();
    })
}


function sort21(center){
    // 21枚のカードを、マジックの手順を考慮して並び替える
    // center (0,1,2)が真ん中にくるようにする

    return new Promise(function(resolve,reject){
        let tmp = Array(21); // 一時的なファイル
        let nc = [0,1,2]; // centerではない列番号を持つようにする
        nc.splice(center,1); // centerを除く

        for (let i=0;i<21;i++){
            // 通し番号から、何行何列目かを取得する
            var row = Math.floor(i/3);
            var col = i%3;
            var rown = row; // 新しい行

            // 新しい列の決定
            if (col==nc[0]){
                var coln = 0;
            }
            else if (col==center){
                var coln = 1;
            }
            else if (col==nc[1]){
                var coln = 2;
            }

            tmp[rown+coln*7] = list_card21_img[i]; // 移動先を計算する
        }

        list_card21_img = clone(tmp);

        resolve();
    });
}


function draw_card1(card_img,pos,scale="small"){
    // カード1枚を描画する
    // カードの画像オブジェクトはcard_img
    // posでポジション指定

    if (scale=="small"){ // カードは小さく表示する場合
        context.drawImage(card_img,pos["x1"],pos["y1"],cscale*caw,cscale*cah);
    }
    else if (scale=="big"){ // カードを大きく表示する場合
        context.drawImage(card_img,pos["x1"],pos["y1"],1*caw,1*cah);    
    }    
}


function draw_card3x7(){
    // 21枚のカードを、3列x7枚/列で描画する

    return new Promise(function(resolve,reject){
        let nloaded = 0; // ロードされた画像の枚数

        function on_load(){ // 画像がロードされたときに
            nloaded++;
    
            if (nloaded==21){ // 21枚全ての画像が読み込めたら表示        
                for (let j=0;j<21;j++){
                    var x1 = (j%3)*(canvas.width-6*cmar)/3+2*cmar;
                    // var y1 =  Math.floor(j/3)*(canvas.height-2*cmar)/7+cmar;
                    var y1 =  Math.floor(j/3)*(canvas.height-10*cmar)/7+cmar;
    
                    draw_card1(list_card21_img[j],{"x1":x1,"y1":y1}); // 1枚描画する        
                }
            }
        }    

        for (let i=0;i<21;i++){ // 21枚について
            list_card21_img[i].addEventListener("load",on_load(i));
            list_card21_img[i].removeEventListener("load",on_load(i));            
        }

        resolve();
    });
}

// function draw_button1(args={"n":n,"colorb":"green","bpos":bpos}){
function draw_button1(args=null){

    // ボタン1個を描画する関数
    // n: ボタン番号0,1,2を与えるときはこれ
    // colorb: ボタンの背景色
    // bpos: 明示的に与えていない場合は元のものを利用


    return new Promise(function(resolve,reject){

        if (phase==0 || phase==4){
            // フェーズ0のとき

            var x1 = bpos0["x1"];
            var y1 = bpos0["y1"];
            var x2 = bpos0["x2"];
            var y2 = bpos0["y2"];
            var colorb = args["colorb"];
    

            context.strokeStyle = "black"; // 枠線色
            context.strokeRect(x1,y1,x2-x1,y2-y1); // 枠線
            context.fillStyle = colorb; // 背景色
            context.fillRect(x1,y1,x2-x1,y2-y1); // 長方形    

            context.textAlign = "center"; // 文字の配置
            context.fillStyle = "white"; // テキストの色
            context.font = "30px serif"; // テキストの文字サイズ

            context.fillText("つぎへ",(x1+x2)/2,(y1+y2)/2+10); // テキストを表示    
        }
        else if (phase>=1 && phase<4){
            // フェーズ1-3の場合
        // var n=args["n"];
        // var bpos=args["bpos"];
// if (n!=null){

            // console.log(`bpos[0] = ${bpos[0]["x1"]}`);

            var n = args["n"];

            var x1 = bpos[n]["x1"];
            var y1 = bpos[n]["y1"];
            var x2 = bpos[n]["x2"];
            var y2 = bpos[n]["y2"];
            var colorb = args["colorb"];
            
            context.strokeStyle = "black"; // 枠線色
            context.strokeRect(x1,y1,x2-x1,y2-y1); // 枠線
            context.fillStyle = colorb; // 背景色
            context.fillRect(x1,y1,x2-x1,y2-y1); // 長方形    
            context.fillStyle = "white"; // テキストの色
            context.font = "30px serif"; // テキストの文字サイズ
            context.textAlign = "center"; // 文字の配置
            context.fillText(`↑`,(x1+x2)/2,(y1+y2)/2); // テキストを表示    
        // }
        // else if (n==null){
        //     var x1 = bpos["x1"];
        //     var y1 = bpos["y1"];
        //     var x2 = bpos["x2"];
        //     var y2 = bpos["y2"];
            
        //     context.strokeStyle = "black"; // 枠線色
        //     context.strokeRect(x1,y1,x2-x1,y2-y1); // 枠線
        //     context.fillStyle = colorb; // 背景色
        //     context.fillRect(x1,y1,x2-x1,y2-y1); // 長方形    
        //     context.fillStyle = "white"; // テキストの色
        //     context.font = "30px serif"; // テキストの文字サイズ
        //     context.fillText(`ボタン`,x1,y1+10); // テキストを表示    
        // }
    

        }


    

        

        resolve();
    });
}


function draw_button3(){
    // ボタン3個を描画する関数
    
    return new Promise(function(resolve,reject){
        for (let n=0;n<3;n++){
            var args={"n":n,"colorb":"green"}

            draw_button1(args=args);
        }

        resolve();
    });
}


function when_click(e){
    // キャンバス内でクリックしたときに実行される関数

    if (phase==0 || phase==4){
        // フェーズ0とフェーズ4の場合
        if ((bpos0["x1"]<=e.offsetX)&&
        (bpos0["x2"]>e.offsetX)&&
        (bpos0["y1"]<=e.offsetY)&&
        (bpos0["y2"]>e.offsetY)){
            // console.log(`button ${ind_b+1} clicked!`);
            pb_choose(n=null);
        }
    }
    else if (phase>=1 && phase<4){
        // フェーズ1-3の場合
        for (let ind_b=0;ind_b<3;ind_b++){
            if ((bpos[ind_b]["x1"]<=e.offsetX)&&
            (bpos[ind_b]["x2"]>e.offsetX)&&
            (bpos[ind_b]["y1"]<=e.offsetY)&&
            (bpos[ind_b]["y2"]>e.offsetY)){
                // console.log(`button ${ind_b+1} clicked!`);
                // pb_choose(ind_b);
                pb_choose(n=ind_b);
            }
        }    
    }


}

// function when_mover(e){
//     // キャンバス上にマウスカーソルが入ったとき
//     // 新たにマウスの動きを追ってゆく
//     // あと、出たときの動きも追う

//     canvas.addEventListener("mouseout",when_mout,false);
// }

function when_mmove(e){
    // マウスオーバーしているとき
    // ボタン上にカーソルがあるとき

    flag_monb=false; // とりあえずフラグは初期化

    if (phase==0 || phase==4){
        // フェーズ0もしくは4の場合

        if ((bpos0["x1"]<=e.offsetX)&&(bpos0["x2"]>e.offsetX)&&
            (bpos0["y1"]<=e.offsetY)&&(bpos0["y2"]>e.offsetY)){
                draw_button1({"colorb":"orange"});
                flag_monb=true;
                // onbn = ind_b;
                canvas.style.cursor = "pointer";
        }
        else{
            draw_button1({"colorb":"green"});
            onbn = null;
            canvas.style.cursor = "auto";
        }
            

        // if (flag_monb!=true){
        //     }
    }
    else if (phase>=1 && phase<4){
        // フェーズ1-3の場合
        for (let ind_b=0;ind_b<3;ind_b++){
            if ((bpos[ind_b]["x1"]<=e.offsetX)&&
            (bpos[ind_b]["x2"]>e.offsetX)&&
            (bpos[ind_b]["y1"]<=e.offsetY)&&
            (bpos[ind_b]["y2"]>e.offsetY)){
                draw_button1({"n":ind_b,"colorb":"orange","bpos":bpos});
                
                flag_monb=true;
                onbn = ind_b;
                canvas.style.cursor = "pointer";
            }
        }
        
        if (flag_monb!=true && onbn!=null){
            draw_button1({"n":onbn,"colorb":"green","bpos":bpos});
            onbn = null;
            canvas.style.cursor = "auto";
        }
    }
}

// function when_mout(e){
//     // キャンバスからカーソルが出たとき

//     // canvas.removeEventListener("mousemove",when_mmove);
// }


function res_event(){
    // イベント登録関数

    return new Promise(function(resolve,reject){
        canvas.addEventListener("click",when_click,false);
        // canvas.addEventListener("mouseover",when_mover,false);    
        canvas.addEventListener("mousemove",when_mmove,false);    

        resolve();
    })
}

function rem_event(){
    // イベント削除関数

    return new Promise(function(resolve,reject){
        canvas.removeEventListener("click",when_click);
        // canvas.removeEventListener("mouseover",when_mover);    
        // canvas.removeEventListener("mouseout",when_mout);
        canvas.removeEventListener("mousemove",when_mmove);
        canvas.style.cursor = "auto"; // カーソルを元の形に
    
        resolve();
    })
}

function pb_choose(n){
    // n (0,1,2) 番目のボタンを押したときに実行される関数
    // 最初にphaseをインクリメントする

    if (phase==0){
        phase++; // フェーズを進ませる

        console.log(`phase ${phase}`);

        Promise.resolve()
        .then(rem_event)
        .then(clear_canvas)
        .then(show_phase)
        .then(draw_card3x7)
        .then(draw_button3)
        .then(res_event)
    }
    else if (phase<3){ // フェーズ1-3の場合
        phase++; // フェーズを進ませる

        console.log(`phase ${phase}!`);


        Promise.resolve()
        .then(rem_event)
        .then(clear_canvas)
        .then(show_phase)
        .then(sort21.bind(this,n))
        .then(draw_card3x7)
        .then(draw_button3)
        .then(res_event)

    }
    else if (phase==3){
        phase++; // フェーズを進ませる

        console.log(`phase ${phase}!!!!`);

        Promise.resolve()
        .then(rem_event)
        .then(clear_canvas)
        .then(show_phase)
        .then(function(){
            return new Promise(function(resolve,reject){
                context.fillStyle = "white"; // テキストの色
                context.font = "40px serif"; // テキストの文字サイズ
 
                // context.font = "30px serif"; // テキストの文字サイズ
                context.textAlign = "center"; // 文字の配置

                var text1 = "あなたが選んだカードは";
                var text2 = "これですね！";

                // 1*caw,1*cah

                context.fillText(text1,canvas.width/2,canvas.height/2-cah/2-40); // テキストを表示
                context.fillText(text2,canvas.width/2,canvas.height/2+cah/2+40); // テキストを表示

                b_reset.style.display = "inline";

                draw_card1(list_card21_img[9+n],{"x1":canvas.width/2-caw/2,"y1":canvas.height/2-cah/2},scale="big"); // 1枚描画する 
                resolve();
            });
        })
    }
}

