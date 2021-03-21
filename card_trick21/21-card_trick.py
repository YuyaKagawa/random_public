import numpy as np 
import pandas as pd # 可視化の際に便利
from IPython.display import display # 可視化に利用
import sys # プログラムの終了に利用

# 52枚のトランプを作成する関数
def make_cards52():
    suit=np.array(["♠","♡","♦","♣"],dtype="object") # ♠,♡,♦,♣の4つのマーク
    number=["{:02d}".format(i) for i in range(1,14)] # 1-13の13個の数字
    
    # 52枚のカードを生成
    s=np.repeat(suit,13) # 52個のマーク 
    n=np.array(number*4,dtype="object") # 52個の数字
    cards52=s+n # 52個の[マーク,数字]の組み合わせ
    
    return cards52

# 21枚のカードを選択する関数
def choose_cards21(cards52):
    cards21=cards52[np.random.choice(np.arange(52),21,replace=False)] # 21枚をランダムに非復元的に選択
    
    return cards21

# カードを並び替える関数
def sort_cards21(cards21,column_chosen):
    cards21_matrix=cards21.reshape(7,3) # 7行3列の行列を作成
    
    nc=(column_chosen-1)%3 # ユーザーの選択した列
    numlist=[i for i in range(3)] # 1-3列目のリスト
    nf,nb=list(set(numlist)-set([nc])) # ユーザーの選択しなかった2列
    
    cf=cards21_matrix[:,nf] # まとめる際、前となる列
    cc=cards21_matrix[:,nc] # まとめる際、真ん中となる列
    cb=cards21_matrix[:,nb] # まとめる際、後ろとなる列 
    
    cards21_sorted=np.concatenate([cf,cc,cb]) # 前、真ん中、後ろをまとめる
    
    return cards21_sorted

# カードを表示
def display_cards(cards21):
    display(pd.DataFrame(cards21.reshape(7,3),columns=["列1","列2","列3"])) # 7行3列の行列を表示
    
# 入力された値が1-3かどうかを確認し、値をintに変換
def validate_input(i):
    # 正しい形式の値が入力されるまで繰り返し
    while True:
        column_chosen=input("{}回目: 選んだカードは何列目にありますか。1-3の数字で入力してください: ".format(i+1)) # 何列目かの入力値
        
        if column_chosen in ["1","2","3"]: # 正しく1-3の値が入力されたら、str型の入力をintに変換
            return int(column_chosen)
        else: # 正しく入力されなかったら、エラーメッセージを表示
            print("Error: 1-3の数値を入力してください。") 

# 答えを確認
def validate_answer(cards21):
    while True: # 正しい形式の値が入力されるまで繰り返し
        answer=input("あなたが選んだのは、{}ですね？ [yes or no] : ".format(cards21[10])) # 入力値
    
        if answer in ["yes","no"]: # yes,noが入力されたら
            if answer=="yes": # yesの場合
                return print("でしょ。[end]")
            elif answer=="no": # noの場合
                print("そんなことはない。あなたが間違えています。最初からやり直してください。 [end]")
                sys.exit()
        else: # yes,no以外が入力されたら
            print("'yes'もしくは'no'で回答してください。")

# main関数
def main():
    cards52=make_cards52() # 52枚のカードを作成
    cards21=choose_cards21(cards52) # 21枚のカードを選択

    display_cards(cards21) # 表示する
    print("好きなカードを上から1枚選んでください。忘れないでくださいね。")

    # 3回繰り返す
    for i in range(3):
        column_chosen=validate_input(i) # ユーザーの選択した列
        cards21=sort_cards21(cards21,column_chosen) # カードをソート
        display_cards(cards21) # 21枚のカードを表示
    
    validate_answer(cards21) # 答えてもらう
    
# 実行
if __name__=="__main__":
    main()