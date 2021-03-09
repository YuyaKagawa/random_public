function pb_start_reset(){
    // スタート・リセットボタンを押したときに実行する関数

    if (b_sr.value == "スタート") { // スタートボタンを押した場合、canvasを描画
        alert("スタート！！！");
        // console.log("start!!!");
        b_sr.value = "リセット";
        b_sh_a.style.display = "inline"; // 正解を表示/非表示ボタンを表示
        b_sh_a.value = "正解を表示" // デフォルトの値
        b_j.style.display = "inline"; // 判定ボタンを表示
        
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
            b_j.style.display = "none"; // 判定ボタンを非表示
            canvasa.style.display = "none"; // 正解を非表示

            // if (b_sh_a.value == "正解を非表示") { // 正解が表示されたままの場合、正解を非表示に
            //     pb_show_hide_answer(); // 正解を非表示            
            // }

            G["n"] = G["d"].map(inner => inner.slice()); // デフォルトに戻す
            tb.value="press スタート";
            tb.readOnly=true;
        
            // Promise.resolve(Gn).then(draw_grid.bind(Gn)).then(alert(message));
            // draw_grid(G["d"]);
            
            if (timer_time>0.0){ // まだタイマーを止めていない場合 
                timer_stop(); // タイマーを止める
            }

            prep_canvas({"canvas":canvasm,"context":contextm}); // canvasを灰色に染める
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

function pb_judge(){
    // 判定ボタンを押したとき
    const judge = confirm("正解を判定して終了しますか"); // 確認画面を表示

    if (judge==true){
        let scount=0; // 入力可能なマスの数
        let ccount=0; // 合っているマスの数

        // if (b_sh_a.value == "正解を表示") { // 正解が非表示のままの場合、正解を表示
            // b_sh_a.style.display = "none"; // 正解を表示/非表示ボタンを非表示
            // pb_show_hide_answer(); // 正解を表示   
        // }

        // 正解判定をする
        for (let i=0;i<snum;i++){
            for (let j=0;j<snum;j++){
                if (G["d"][i][j]=="\u{25EF}"){ // 入力可能なマスの場合
                    scount=scount+1; // マスの数をインクリメント

                    if ((G["a"][i][j]==G["n"][i][j])){
                        ccount=ccount+1; // 正解マス数をインクリメント
                    }
                }
            }
        }

        timer_stop(); // タイマーを止める
        alert(`time: ${timer_prep_text()}\nscore: ${ccount} / ${scount} (${(ccount*100/scount).toFixed(1)}%)`); // 時間、スコアを表示
        b_sh_a.style.display="none"; // 表示/非表示ボタンを非表示
        canvasa.style.display = "block"; // 正解を表示
        b_judge.style.display="none"; // 判定ボタンを非表示
    }
    else{ // いいえを選択した場合、何もしない
    }
}

function timer_prep_text() {
    // タイマーのテキストの用意
    const text_h = Math.floor(timer_time / 3600); // hour
    const text_m = Math.floor((timer_time % 3600)/60); // minute
    const text_s = Math.floor(timer_time % 60); // second
    const text_ms = Math.floor(timer_time*10%10); // millisecond
    
    return (text_h+"h "+text_m+"m "+text_s+"."+text_ms+"s");
}

function timer_display_text() {
    // タイマーのテキスト表示
    timer_time += 0.1;

    timer.innerHTML = timer_prep_text()+" 経過"; 
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
    // timer_time=0.0; 
}