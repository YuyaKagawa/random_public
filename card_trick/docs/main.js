let canvas = null;
let context = null;

let cmar = 100; // canvasのマージン

let list_card40 = null; // 

let list_card21 = null;
let list_card21_img = null;

$(document).ready(function(){
    // 読み込めてから変数を用意
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");    
})

function choose_random(){
    // 今回のタスクでは、数字は全部で40個、この中から21個選ばれるのが固定
    // const list_number = [...Array(40).keys()]; // 0-39の40個の数字

    const S = ["s","h","d","c"]; // トランプのスート

    let cname = null; // カード名

    list_card40 = Array(); // 40枚のカードのリスト

    for (let ind_s=0;ind_s<4;ind_s++){
        for (let n=1;n<=10;n++){
            cname = `${S[ind_s]}${String(n).padStart(2,"0")}`;

            list_card40.push(cname);

            // console.log(cname);
        }
    }

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
        
        list_card21_img[t] = new Image(); // 画像
        list_card21_img[t].src = fname;

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

    for (let c=0;c<3;c++){ // ボタンの表示
        var x = (c%3)*(canvas.width-2*cmar)/3+cmar;
        context.fillStyle = "red";

        context.font = "50px Comic Sans MS";
        context.fillText("ボタン",x,100);
        context.fillStyle = "yellow";

        context.fillRect(x,cmar,100,100);
    }

    choose_random();


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