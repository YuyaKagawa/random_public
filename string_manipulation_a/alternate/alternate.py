import numpy as np # 行列操作

def main():
    print("交互にかみ合わせたい複数の文字列を入れてください: ")

    n=int(input("文字列は何個ですか: "))

    string_list=[] # 元の文字列のリストの初期化

    # n個の文字列を入力してもらう
    for i in range(n):
        string_list.append(input("{}番目の文字列を入力してください: ".format(i+1))) # 元の文字列のリストに追加

    maxlen=len(max(string_list,key=len)) # 最も長い文字列の長さ

    # それぞれの文字列について、長さをmaxlenに揃えるようにする
    for i in range(n):
        s=string_list[i] # 文字列
        string_list[i]=list(s+" "*(maxlen-len(s))) # 長さがmaxlenになるように" "（スペース）を追加

    output="".join(np.array(string_list).T.flatten()).replace(" ","") # 1列に1つの文字列を入れ、行の方向に読み込み、最後にスペースを削除

    print("出力: ",output)

if __name__=="__main__":
    main()