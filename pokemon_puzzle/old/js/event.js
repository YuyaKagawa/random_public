function when_mmove(e,con){
    // canvas内でマウスが動いているとき
    // 厳密には、canvas外→内、canvas内→外の動作も取る

    change_sq_mover(con, Gn, e.offsetX, e.offsetY); // カーソルの合った四角を描画する
}

function when_choosesq(rclick=false){
    // マスを選んだときに実行される関数
    // 0. 余白の場合、rowi、coljを元にもどす
    // 1. テキストボックスに選択した値の表示
    // 2. マス目のハイライト

    const vd = G["d"][rowi][colj]; // デフォルトのマスの要素を取得

    if (vd=="\u{3000}"){ // 余白の場合
        rowi=rowi_p;
        colj=colj_p;
    }

    // 1. テキストボックスに選択した値の表示
    if (rowi==null || colj==null){ // 格子外をクリックしたとき
        tb.value = "";
        tb.readOnly = true;        
    }
    else{ // 格子内をクリックしたとき
        if (vd=="\u{3000}"){ // 余白の場合
            tb.readOnly = true;
            tb.value = "";
        }
        else{ // 余白ではない場合
            if (vd!="\u{25EF}"){ // 編集可能なマスではない場合
                tb.readOnly = true; // 編集不可能にする
            }
            else{
                tb.readOnly = false; // 編集可能にする
                tb.focus(); // テキストボックスにフォーカスをあわせる 
            }

            if (rclick==true){ // 右クリックの場合
                G["n"][rowi][colj]=vd; // 進行中のGridのマスを上書きする
            }

            let vn = G["n"][rowi][colj]; // 現在のマスの要素を取得

            if (vn=="\u{25EF}"){ // 現在空白（◯）の場合
                tb.value = "";
            }
            else{ // 現在空白ではない場合
                tb.value = `${vn}`; // テキストボックスに、クリックしたマスの値を入れる
            }

            updatesq();
        }
    }
}

function when_click(e) {
    // canvas内でクリックしたとき

    xy2ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得

    when_choosesq(rclick=false);
}
    
function when_rclick(e){
    // 右クリックを押したときの挙動

    xy2ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得

    when_choosesq(rclick=true);
}

function movesq_arr(arr){
    // 矢印キーを押して、マスを移動させる

    // 移動先の候補を用意し、移動可能か検証する
    let rowi_c = rowi; // 行方向の移動先の候補
    let colj_c = colj; // 列方向の移動先の候補

    if (arr=="Up"){ // ↑の場合
        rowi_c = Math.max(rowi_c-1,0);
    }
    else if (arr=="Right"){ // →の場合
        colj_c = Math.min(colj_c+1,snum-1);
    }
    else if (arr=="Down"){ // ↓の場合
        rowi_c = Math.min(rowi_c+1,snum-1);
    }
    else if (arr=="Left"){ // ←の場合
        colj_c = Math.max(colj_c-1,0);
    }

    if (G["d"][rowi_c][colj_c] != "\u{3000}"){ // 移動先が移動可能の場合
        rowi=rowi_c;
        colj=colj_c;

        updatesq();
        when_choosesq();
    }
    else{ // 移動可能ではない場合
    }        
}
    
function when_pkey(e){
    // ドキュメント上で何かキーを押したときの挙動

    if (e.key.substr(0, 5) == "Arrow") { // もし矢印キーを押したら
        movesq_arr(e.key.substr(5,e.key.length)); // マスを移動する
    }
}

function when_penter(e){
    // テキストボックスでキーが押されたとき
    // ここでエンターキーを検出する
    // 現時点では実はエンターキーではなく、文字を入力途中でも反応する

    // 処理の都合上、最初にエンター以外は弾くようにする
    if (e.key!="Enter" && e.key!="Process"){
        return
    }

    if (tb.value.length>=1 && tb.readOnly==false){ // テキストボックスが入力可能状態の場合
        const t = tb.value[tb.value.length-1];

        G["n"][rowi][colj]=low2upp(hira2kana(t));

        drawsq_ij(contextm,G["n"],rowi,colj,ccolor_gb="orange",bold=true);

        when_choosesq();

    }else{
    }
}

function res_event(args){
    // イベントの登録をする関数
    
    return new Promise(function (resolve, reject) {
        // canvas内でマウスを動かしたとき
        // 今回は特になし

        // canvas上で右クリックしたとき
        // canvas上ではまず、右クリックを無効化する
        canvasm.addEventListener('contextmenu', e => e.preventDefault());
        canvasm.addEventListener('contextmenu', when_rclick,false); // →クリックを押したときに実行
        
        // canvas上で左クリックしたとき
        canvasm.addEventListener("click",when_click,false); 

        // canvas上で矢印キーを押したとき
        // これはキーを押したタイミングで
        // まずページ全体で、矢印キーを無効化する
        document.addEventListener("keydown", e => {
            if (e.key.substr(0,5)=="Arrow"){
                e.preventDefault();
            }
        },false);

        document.addEventListener("keydown",when_pkey,false); // なにかのキーを押したとき        
        tb.addEventListener("keyup",when_penter,false); // エンターキーを押したとき

        resolve();
    });
}

function rem_event() {
    // イベントリスナーを削除する関数

    canvasm.removeEventListener('contextmenu', when_rclick); // 右クリックのイベントを削除
    canvasm.removeEventListener("click", when_click); // クリックのイベントを削除
    document.removeEventListener("keydown",when_pkey); // キーを押すときのイベントを削除
    tb.removeEventListener("keyup",when_penter) // エンターキーのイベントを削除
}