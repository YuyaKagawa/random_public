function sort_pokemon_list(order){
    // ポケモンのリストをソートする

    if (order=="pid"){
        // console.log("sort by pid!");

        L.sort(function (a,b){ // なにかわからんが、図鑑ナンバー順でソートできる
            return a[5]-b[5];
        });    
    }
    else if (order=="name"){
        // console.log("sort by name!");

        L.sort(function (a,b){ // なにかわからんが、名前順でソートできる
            // console.log(`a, b = ${a[6]}, ${b[6]}`);
            // console.log(`v = ${String(a[6]).localeCompare(String(b[6]))}`);
            


            return String(a[6]).localeCompare(String(b[6]));
        });
        
        L.shift(); // なぜかarrayの最初の要素にゴミが入ってしまうので、最初だけ削除
    }

    // console.log(`L[1] = ${L[1]}`);
    // }

    // let text = "ポケモン151匹チェックリスト<br>";
    // text = text+`<input type="button" onclick="sort_pokemon_list(order='name');" value='sort!'>`;

    // for (let i=0;i<151;i++){
    //     // console.log(L[i]);
    //     const pid = String(L[i][5]).padStart(3,"0");
    //     // text=text+`<p id="p_${pid}"><input type="checkbox" onclick="cb_pokemon_list(this);">${pid} ${L[i][6]}</p>`;
    //     // text=text+`<p class="p_l"><input type="checkbox" class="cb_p" onclick="cb_pokemon_list(this);" value="${pid}">${pid} ${L[i][6]}</p>`;
    //     // text=text+`<p class="p_l"><label><input type="checkbox" class="cb_p" onclick="cb_pokemon_list(this);" value="${pid}">${pid} ${L[i][6]}</label></p>`;
    //     text=text+`<p class="p_l"><label><input type="checkbox" class="cb_p" onclick="cb_pokemon_list(this);">${pid} ${L[i][6]}</label></p>`;

    //     if (i%10==9){
    //         text=text+"<br>";
    //     }
    // }

    // l_p.innerHTML = text;

}

function listup(){
    // ポケモンをリストアップする関数

    // console.log(`listup before, L[0] = ${L[0]}`);

    sort_pokemon_list(order="name"); // 名前順にソートしておく

    // L.sort(function (a,b){ // なにかわからんが、図鑑ナンバー順でソートできる
    //     return a[5]-b[5];
    // });

    // console.log(`listup after, L[0] = ${L[0]}`);

    let text = "ポケモン151匹チェックリスト<br>";
    // text = text+`<input type="button" onclick="sort_pokemon_list(order='name');" value='sort!'>`;

    for (let i=0;i<L.length;i++){
        // console.log(L[i]);
        const pid = String(L[i][5]).padStart(3,"0");
        // text=text+`<p id="p_${pid}"><input type="checkbox" onclick="cb_pokemon_list(this);">${pid} ${L[i][6]}</p>`;
        // text=text+`<p class="p_l"><input type="checkbox" class="cb_p" onclick="cb_pokemon_list(this);" value="${pid}">${pid} ${L[i][6]}</p>`;
        // text=text+`<p class="p_l"><label><input type="checkbox" class="cb_p" onclick="cb_pokemon_list(this);" value="${pid}">${pid} ${L[i][6]}</label></p>`;
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
            // console.log(`checked! cbs = ${cbs[i]}`);
            cbs[i].parentNode.style.color="Gainsboro";
        }
        else{ // もしチェックがついていないなら
            // console.log(`checked! cbs = ${cbs[i]}`);
            cbs[i].parentNode.style.color="black";
        }
    }

    // var cv = document.querySelector(".cb_p:checked").value;

    // console.log(`cb, cv = ${cv}`);
}

function reset_cb_pokemon_list(){
    // チェックボックスをリセットする

    const cbs = document.querySelectorAll(".cb_p"); // 全チェックボックスを確認する
    
    for (let i=0;i<cbs.length;i++){ // 各チェックボックスについて
        cbs[i].checked=false;
        cbs[i].parentNode.style.color="black";
    }
}