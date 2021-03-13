// 後に値を取得する、canvas関連の変数
// メインのキャンバス、答えのキャンバスの2つがある
let canvasm; // メインのキャンバス
let contextm; // メインのキャンバスのコンテクスト
let canvasa; // 答えのキャンバス
let contexta; // 答えのキャンバスのコンテクスト

// 以下のキャンバスに関わる変数は、2つのキャンバスで共通
let cw; // キャンバスの横幅
let ch; // キャンバスの高さ
let sw; // 格子の中の一つの四角の横幅
let sh; // 格子の中の一つの四角の縦幅
const snum = 32; // 格子の中の四角の数
let cmar; // キャンバスの外枠と、格子の間のマージン

const ccolor_bg = "gray"; // canvasの背景色
const ccolor_gs = "darkblue"; // canvasの格子の枠線の色
const ccolor_fd = "black"; // canvas内のデフォルトの文字の色
let ccolor_gb = "white"; // canvasの格子の背景の色

const fname_d = "./data/csv/default_sq.csv"; // csvファイル名、最初の状態
const fname_a = "./data/csv/answer_sq.csv"; // csvファイル名、正解
const fname_l = "./data/csv/answer_utf8.csv"; // ポケモンのリスト

let L = [] // ポケモンのリスト
let l_p = null; // ポケモンのリストの要素

let intro = null; // htmlの頭の部分

// 格子
let G = {} // 参照渡しのために、dictで作成してみる

var rowi_p = null; // 前回指した四角はrowi行目
var colj_p = null; // 前回指した四角はcolj列目
var rowi = null; // 今指している四角はrowi行目
var colj = null; // 今指している四角はcolj列目

let tb; // html内に記述したテキストボックスの要素を取得
let dtb; // html内に記述したテキストボックスの要素を取得

let b_sr = null; // スタート・リセットボタン
let b_sh_a = null; // 答えを表示/非表示ボタン
let b_j = null; // 判定ボタン

let b_hi = null;
let b_d = null;

let pid = null; // タイマーのプロセスID
let timer = null; // タイマーオブジェクトinHTML
let timer_time = null; // タイマーの経過時間