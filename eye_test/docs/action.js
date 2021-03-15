function startTest() {
    var button = document.getElementById("button"); // 押したボタンの状態
    var landolt = document.getElementById("landolt")

    showLandolt(); // ランドルト環を表示

    button.style.display = "none"; // ボタンを非表示に

    landolt.style.display = "block"; // ランドルト環を表示できるように

    // キーが押されたときのアクション
    document.addEventListener('keydown', (event) => {
        var keyName = event.key;
        
        // alert("正解");

        showLandolt();

        // alert(keyName)

        // ArrowUp,ArrowDown,ArrowRight,ArrowLeft



        if (event.shiftKey) {
            console.log(`keydown:Shift + ${keyName}`);
        } else {
            console.log(`keydown:${keyName}`);
        }
    });

    // ランドルト環を表示する関数
    function showLandolt() {
        var angle = Math.floor(Math.random() / 0.125) * 0.125; // 画像の角度は8方向のランダムに

        // alert(angle.toString() + "turn");

        landolt.style.transform = "rotate(" + angle.toString() + "turn)"; // 
    }



    
};