function prep_card40(){
    // 40枚のカードを用意する関数
    // カードの名前

    for (let ind_s=0;ind_s<4;ind_s++){ // 各スートについて
        for (let n=1;n<=10;n++){ // 各数字について
            var cname = `${Suit[ind_s]}${String(n).padStart(2,"0")}`;

            var ind_c = ind_s*10+n-1; // カードの通し番号

            list_card40[ind_c] = cname; // リストに格納
            list_card40_img[ind_c] = new Image(); // 画像オブジェクト
        }
    }
}


function draw_card1(card,pos){
    // カード1枚を描画する
    // カードの画像オブジェクトはcard
    // posでポジション指定

}

function draw_button(n){
    // ボタンを描画する関数
    // 引数nは0,1,2の値を取る、0が左、1が真ん中、2が右

    const x1 = bpos[n]["x1"];
    const y1 = bpos[n]["y1"];
    const x2 = bpos[n]["x2"];
    const y2 = bpos[n]["y2"];
    
    context.strokeStyle = "black"; // 枠線色
    context.strokeRect(x1,y1,x2,y2); // 枠線
    context.fillStyle = "green"; // 背景色
    context.fillRect(x1,y1,x2,y2); // 長方形
}

function when_click(e){
    // キャンバス内でクリックしたときに実行される関数

    for (let ind_b=0;ind_b<3;ind_b++){
        if ((bpos[ind_b]["x1"]<=e.offsetX)&&
        (bpos[ind_b]["x2"]>e.offsetX)&&
        (bpos[ind_b]["y1"]<=e.offsetY)&&
        (bpos[ind_b]["y2"]>e.offsetY)){
            console.log(`button ${ind_b} clicked!`);
        }
    }

}


function res_event(){
    // イベント登録関数
    // canvas上で左クリックしたとき
    canvas.addEventListener("click",when_click,false); 
}

