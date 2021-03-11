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

function hira2kana(hiragana) {
    // ひらがなをカタカナに変換する関数
    // 参考: JavaScriptでカタカナをひらがなに変換する(その逆も) - Qiita, 
    // https://qiita.com/mimoe/items/855c112625d39b066c9a

    return hiragana.replace(/[\u3041-\u3096]/g, function(match) {
        var chr = match.charCodeAt(0) + 0x60;

        return String.fromCharCode(chr);
    });
}

function low2upp(chr){
    // カタカナを小文字から大文字に変換する関数

    var c = chr.charCodeAt(0);

    if ([12449,12451,12453,12455,12457,12483,12515,12517,12519].indexOf(c)>=0){ // もし小文字の場合、大文字に変換
        c=c+1; 
    }

    return String.fromCharCode(c);
}


function get_csv(args) {
    // csvを読み込んだ結果を取得する関数
    const fname_csv = args["fname_csv"];
    const Gname = fname_csv.split("/")[3][0];
    const list = args["list"];

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
            
            if (list==true){ // ポケモンのリストを読み込むとき
                L = result.map(inner=>inner.slice());
            }
            else{
                for (let i=0;i<snum;i++){
                    for (let j=0;j<snum;j++){
                        let c = result[i][j].charCodeAt(0);
    
                        if ([12449,12451,12453,12455,12457,12483,12515,12517,12519].indexOf(c)>=0){
                            c=c+1;
                            result[i][j]=String.fromCharCode(c);
                        }
                    }
                }
    
                G[Gname] = result;

                if (Gname == "d") { // デフォルトのものを読み込むときは、進行中のものも用意する
                    // 2次元配列の値コピーには工夫が必要
                    G["n"] = G[Gname].map(inner=>inner.slice());
                }    
            }

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

function draw_grid(args) {
    // 格子全体を描く関数

    const con = args["context"];
    const Grid = args["Grid"];

    return new Promise(function (resolve,reject){
        // 枠線の描画
        for (let i=0;i<snum;i++){
            for (let j=0;j<snum;j++) {
                drawsq_ij(con,Grid,i,j,ccolor_gb="white",bold=true); // 四角を描く
            }
        }

        resolve();
    });
}

function drawsq_ij(con,Grid,i,j,ccolor_gb="white",bold=true){
    // コンテクストcon、格子Gと、i行j列目という情報が与えられたときの、i行j列目の四角を描く関数
    // draw_girdでは、全(i,j)について実行される
    // 基本updatesqを通じて実行される

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
            con.fillText(low2upp(hira2kana(Grid[i][j])),cmar+j*sh,cmar+i*sw);
        }
    }
}

function updatesq(){
    // drawsqを、現在の(rowi,colj)マスと以前の(rowi_p,colj_p)について行う
    // ここを実行するのは、rowiとcoljが範囲内の場合のみ
    // 1. 以前のx,yが格子の範囲の内にあるとき
    // 2. 現在のx,yが格子の範囲の内にある場合

    if (rowi_p!=null && colj_p!=null){
        // 1. 以前のx,yが格子の範囲の内にあるとき
        if (["\u{3000}","\u{25EF}"].indexOf(G["d"][rowi_p][colj_p])<0){ // もし、デフォルトの文字だったら
            drawsq_ij(contextm,G["n"],rowi_p,colj_p,ccolor_gb="white",bold=true); // 太字で表示
        }
        else{ // デフォルトの文字ではない場合
            drawsq_ij(contextm,G["n"],rowi_p,colj_p,ccolor_gb="white",bold=false);
        }
    }
    
    if (rowi!=null && colj!=null){
        // 2. 現在のx,yが格子の範囲の内にある場合
        if (["\u{3000}", "\u{25EF}"].indexOf(G["d"][rowi][colj]) < 0) { // もし、デフォルトの文字だったら
            drawsq_ij(contextm,G["n"],rowi,colj,ccolor_gb="orange",bold=true); // 太字で表示
        }
        else{ // デフォルトの文字ではない場合
            drawsq_ij(contextm,G["n"],rowi,colj,ccolor_gb="orange",bold=false); // 
        }
    }

    rowi_p=rowi; // 以前のrowiは現在のrowi
    colj_p=colj; // 以前のcoljは現在のcolj
}