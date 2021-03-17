let canvas = null;
let context = null;

let cmar = null; // canvasのマージン
let colw = null; // 1列の幅

let bpos = Array(3); // 3つのボタンの位置の配列、[x1,y1,x2,y2]

let cpos = Array(21); // 21枚のカードの位置

const Suit = ["s","h","d","c"]; // トランプのスート

let list_card40 = Array(40); // 「スーツ+数字」で表された40枚のトランプのリスト
let list_card40_img = Array(40); // 「スーツ+数字」で表された40枚のトランプの画像オブジェクトのリスト

let list_card21 = Array(21); // 「スーツ+数字」で表された21枚のトランプのリスト、40枚の中から選ばれたものたち
let list_card21_img = Array(21); // 上の21枚のトランプの画像オブジェクトのリスト

$(document).ready(function(){
    // 最初に実行される関数
    // 読み込めてから変数を用意
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
    cmar = Math.min(canvas.width,canvas.height)/30; // マージン
    colw = (canvas.width-2*cmar)/3-2*cmar; // 1列の幅

})

function choose_random(){
    // 今回のタスクでは、数字は全部で40個、この中から21個選ばれるのが固定
    // const list_number = [...Array(40).keys()]; // 0-39の40個の数字



    // console.log(list_card40);

    list_card21 = Array(21); // 21枚のカードのリスト
    list_card21_img = Array(21); // 21枚のカードの画像

    for (let t=0;t<21;t++){
        const r = Math.floor(Math.random()*list_card40.length);
        var c=list_card40.splice(r,1); // 1枚ランダムに取り出す
        // console.log(`${list_card40.length}`,c);

        // list_card21.push(c); // 21枚の方に追加
        list_card21[t] = c; // 21枚の方に追加
        


        var fname = `img/${c}.gif`; // 画像ファイルのソース
        
        
        console.log(list_card21_img[t]);
        
        list_card21_img[t].onload = function(){
            // var x = Math.random()*(canvas.width-2*cmar)+cmar;
            var x = (t%3)*(canvas.width-2*cmar)/3+cmar;

            var y = Math.floor(t/3)*(canvas.height-2*cmar)/7+cmar;
            
            // var y = Math.random()*(canvas.height-2*cmar)+cmar;
            
            context.drawImage(list_card21_img[t],x,y,50,50*list_card21_img[t].height/list_card21_img[t].width);
        }

        // img.onload = function(){
        // img.src = fname;
        // list_card21_img.push(img); // リストに追加    
        // }
    }

    // console.log(list_card21_img);

    // setTimeout(100);

    // for (let i=0;i<21;i++){
    //     console.log(i);
    // }

    // for (let i=0;i<21;i++){
    //     setTimeout(100);

    //     console.log(list_card21_img[i]);
    //     context.drawImage(list_card21_img[i],i*100,i*100,50,50*list_card21_img[i].height/list_card21_img[i].width);
    // }



    // return
}





var img = new Image(); // 画像
img.src = "img/back.gif"; // 画像のソース



function pb_start(){
    // スタートボタンを押したとき
    // console.log([...Array(40).keys()]);

    // const list_card21 = choose_random();

    // var colw = (canvas.width-2*cmar)/3; 

    for (let c=0;c<3;c++){ // ボタンの表示
        var x = (c%3)*colw+cmar;
        var y = canvas.height-cmar+50;
        var w = colw-20;
        var h = 10;
        // context.fillStyle = "red";

        bpos[c]=[x,y,x+w,y+h];

        // context.font = "50px Comic Sans MS";
        // context.fillText("ボタン",x,canvas.height);
        context.fillStyle = "yellow";

        context.strokeRect(x,y,w,h);
        context.fillRect(x,y,w,h);
    }

    choose_random();

    res_event();
    // Math.random()*list_number.length
    
    // for (let i=0;i<21;i++){
    // for (let i=0;i<1;i++){
    //     console.log(list_card21_img[i]);
        // context.drawImage(list_card21_img[i],i*100,i*100,50,50*list_card21_img[i].height/list_card21_img[i].width);

    //     let list_img = Array();

        // var img = list_card21_img[i];

        // console.log(`${img}`);

        // context.drawImage(img,i*50,i*50,50,50*img.height/img.width);

    //     var img = new Image(); // 画像
    //     // img.src = `img/s01.gif`; // 画像のソース
        
    //     // console.log(img.src);

    //     img.onload = function(){
    //         img.src = `img/${list_card21[i]}.gif`; // 画像のソース
    //     }


    //     // console.log(img.height,img.width);
        
    //     // img.onload = function(){  
    //         // img.src = `img/back.gif`; // 画像のソース

    //         // console.log(img.src);


    //         // context.drawImage(img,i*100,i*100,50,50*img.height/img.width);
    //     // }
    //     // context.drawImage(img,i,i);
        
    // }
    
}