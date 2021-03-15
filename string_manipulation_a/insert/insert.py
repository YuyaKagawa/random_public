import re # 全角スペースと半角スペースどちらも対応するために

def main():
    sentence=input("文字列を入力してください: ")
    character=input("挿入したい文字を入力してください: ")

    output="" # 出力する文字列の初期化

    # スペースで区切られた各文についてみる
    for s in re.split(' |　',sentence):
        output+=character.join(list(s))+" " # 各文字を指定した文字で連結

    print("出力: ",output)

if __name__=="__main__":
    main()