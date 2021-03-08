function when_mmove(e,con){
    // function when_mmove(e){
        // canvas内でマウスが動いているとき
        // 厳密には、canvas外→内、canvas内→外の動作も取る
    
        // change_sq_mover(Gn, e.offsetX, e.offsetY); // カーソルの合った四角を描画する
        change_sq_mover(con, Gn, e.offsetX, e.offsetY); // カーソルの合った四角を描画する
    }

function when_choosesq(rclick=false){
    // マスを選んだときに実行される関数
    // 0. 余白の場合、rowi、coljを元にもどす
    // 1. テキストボックスに選択した値の表示
    // 2. マス目のハイライト

    // 0. 余白の場合、rowi、coljを元にもどす
    const vd = G["d"][rowi][colj]; // デフォルトのマスの要素を取得

    if (vd=="\u{3000}"){ // 余白の場合
        rowi=rowi_p;
        colj=colj_p;
        
        // tb.readOnly = true;
        // tb.value = "";
    }


    // rclick（右クリック）の場合、指定したマスの値の削除も行う
    // when_click()、when_rclick()とmovesq_byarrow()と内で実行

    // xy2ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得

    console.log(`choosesq, [rowi,colj] = [${rowi},${colj}]`);

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

            // console.log(`choose_sq, G["n"] = ${G["n"]}`);
            updatesq();
        }

        // if (vd=="\u{25EF}"){ // もともと編集可能マス（not デフォルト文字あり、not 余白）の場合
        //     tb.readOnly = false; // 編集可能にする
        //     tb.focus(); // テキストボックスにフォーカスをあわせる 

        //     if (rclick==true){ // 右クリックの場合
        //         G["n"][rowi][colj]=vd; // 進行中のGridのマスを上書きする
        //     }

        //     let vn = G["n"][rowi][colj]; // 現在のマスの要素を取得

        //     if (vn=="\u{25EF}"){ // 現在空白の場合
        //         tb.value = "";
        //     }
        //     else{ // 現在空白ではない場合
        //         tb.value = `${vn}`; // テキストボックスに、クリックしたマスの値を入れる
        //     }
        // }
        // else{ // もともと編集可能ではない場合（デフォルト文字あり、余白）
        //     // tb.readOnly = true;
        //     // tb.value = "";
        // }


    }

    // 2. マス目のハイライト

}
    
    
function when_click(e) {
    // canvas内でクリックしたとき

    xy2ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得

    when_choosesq();

    // change_sq_mover(con,Gn,e.offsetX,e.offsetY); // カーソルの合った四角を描画する
    // updatesq(con,Gn,e.offsetX,e.offsetY); // カーソルの合った四角を描画する
    // updatesq(); // カーソルの合った四角を描画する


    // if (eflag["mousemove"] == "ON"){
    //     eflag["mousemove"] = "OFF";
    //     canvas.removeEventListener("mousemove",when_mmove); // クリックのイベントを削除
    // }
    // else{
    //     change_sq_mover(con,Gn,e.offsetX,e.offsetY); // カーソルの合った四角を描画する
    //     // change_sq_mover(Gn,e.offsetX,e.offsetY); // カーソルの合った四角を描画する

    //     if (rowi!=rowi_p || colj!=colj_p){
    //         eflag["mousemove"] = "ON";
    //         canvas.addEventListener("mousemove", when_mmove, false);    
    //     }
    // }    
}
    
function when_rclick(e){
    // 右クリックを押したときの挙動

    xy2ij(e.offsetX,e.offsetY); // 四角がi行j列目であることを取得

    when_choosesq(rclick=true);
}



function movesq_arr(arr){
// function movesq_byarrow(key_arrow){
    // 矢印キーを押して、マスを移動させる

    console.log(`movesq_arr(), arr = ${arr}`);

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

        console.log(`rowi = ${rowi}, colj = ${colj}`)

        updatesq();
        when_choosesq();
        // change_sq_mover(con,Gn,x=null,y=null,ij=[rowi,colj]);
        // change_sq_mover(Gn, x = null, y = null, ij = [rowi, colj]);
    }
    else{ // 移動可能ではない場合
        // change_sq_mover(con, Gn,x=null,y=null,ij=[rowi_c,colj_c]);

        // change_sq_mover(Gn,x=null,y=null,ij=[rowi_c,colj_c]);
    }        

    // when_choosesq();
}
    
function when_pkey(e){
    // ドキュメント上で何かキーを押したときの挙動
    // e.preventDefault();

    if (e.key.substr(0, 5) == "Arrow") { // もし矢印キーを押したら
        // movesq_byarrow(e.key.substr(5,e.key.length)); // マスを移動する
        movesq_arr(e.key.substr(5,e.key.length)); // マスを移動する
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
        G["n"][rowi][colj]=hira2kana(t);

        // console.log(`t = ${t}`);
        // console.log(`Gn[rowi][colj] = ${Gn[rowi][colj]}`);
        drawsq_ij(contextm,G["n"],rowi,colj,ccolor_gb="orange",bold=true);
        // draw_sq_byij(con, Gn, rowi, colj, ccolor_gb = "orange", bold = false);
        // draw_sq_byij(Gn,rowi,colj,ccolor_gb="orange",bold=false);
    }else{
        // console.log("else!");
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


        // canvas上で右クリックしたとき
        // canvas上ではまず、右クリックを無効化する
        canvasm.addEventListener('contextmenu', e => e.preventDefault());
        canvasm.addEventListener('contextmenu', when_rclick,false); // →クリックを押したときに実行
        
        canvasm.addEventListener("click",when_click,false); // canvas上で左クリックしたとき
        // canvasm.addEventListener("mousemove", when_mmove, false);

        // canvas上で矢印キーを押したとき
        // これはキーを押したタイミングで
        // まずページ全体で、矢印キーを無効化する
        document.addEventListener("keydown", e => {
            if (e.key.substr(0,5)=="Arrow"){
                e.preventDefault();
            }
        },false);

        document.addEventListener("keydown",when_pkey,false); // なにかのキーを押したとき

        // テキストボックスにカーソルが合っているとき、Enterキーを押したとき
        // これはキーを離したタイミングで
        tb.addEventListener("keyup", e=>{
            if (e.key=="Enter" || e.key=="Process"){
                // console.log("ENTERRRRRRRRRRRRRR");
                when_penter(e);
            }
        },false);


        
    //     eflag["mousemove"] = "ON";
    //     can.addEventListener("mousemove", when_mmove, false);
    //     can.addEventListener("click",when_click,false); // canvas上でクリックしたとき

    //     // 


    //     // document.addEventListener("keydown",when_p,false);



        resolve();
    });
}