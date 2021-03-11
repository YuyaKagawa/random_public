function sort_pokemon_list(order){
    // ポケモンのリストをソートする

    if (order=="pid"){
        L.sort(function (a,b){ // なにかわからんが、図鑑ナンバー順でソートできる
            return a[5]-b[5];
        });    
    }
    else if (order=="name"){
        L.sort(function (a,b){ // なにかわからんが、名前順でソートできる
            return String(a[6]).localeCompare(String(b[6]));
        });
        
        L.shift(); // なぜかarrayの最初の要素にゴミが入ってしまうので、最初だけ削除
    }
}

function listup(){
    // ポケモンをリストアップする関数

    sort_pokemon_list(order="name"); // 名前順にソートしておく

    let text = "ポケモン151匹チェックリスト<br>五十音順<br>";

    for (let i=0;i<L.length;i++){
        const pid = String(L[i][5]).padStart(3,"0");
        text=text+`<p class="p_l"><label><input type="checkbox" class="cb_p" onclick="cb_pokemon_list(this);">${pid} ${L[i][6]}</label></p>`;

        if (i%10==9){
            text=text+"<br>";
        }
    }

    l_p.innerHTML = text;
}

function cb_pokemon_list(){
    // ポケモンのリストのチェックボックスを押したとき

    const cbs = document.querySelectorAll(".cb_p"); // 全チェックボックスを確認する

    for (let i=0;i<cbs.length;i++){ // 各チェックボックスについて
        if (cbs[i].checked==true){ // もしチェックがついているなら
            cbs[i].parentNode.style.color="Gainsboro";
        }
        else{ // もしチェックがついていないなら
            cbs[i].parentNode.style.color="black";
        }
    }
}

function reset_cb_pokemon_list(){
    // チェックボックスをリセットする

    const cbs = document.querySelectorAll(".cb_p"); // 全チェックボックスを確認する
    
    for (let i=0;i<cbs.length;i++){ // 各チェックボックスについて
        cbs[i].checked=false;
        cbs[i].parentNode.style.color="black";
    }
}