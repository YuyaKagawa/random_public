import urllib3 # urlからhtmlを取得するのに利用？
import certifi # httpsの証明書関連に必要？
from bs4 import BeautifulSoup # html解析に利用
import re # 正規表現
import pandas as pd # 表の形式に変換、csv出力に利用
from IPython.display import display # 可視化に利用

""" 1  ソースからデータを取得 """
def get_html_soup():
    source_url = "http://www.gsi.go.jp/KOKUJYOHO/CENTER/zenken.htm" # アクセスするURL

    # httpsの証明書検証を実行
    http = urllib3.PoolManager(
        cert_reqs='CERT_REQUIRED',
        ca_certs=certifi.where())
    r = http.request('GET', source_url)

    soup = BeautifulSoup(r.data, 'html.parser') #beautifulsoupの型に変換
    
    return soup

""" 2  必要な部分を抽出 """
def get_lat_lon(soup):
    pref_lat_lon_list=[] # [都道府県,緯度,経度]のリスト

    # <td align="center" width="16%">の部分を見る
    for td in soup.find_all("td",align="center",width="16%"):
        pref=re.findall(r">.{3,4}庁<",str(td)) # 都道府県を取得

        # もし都道府県を取得できれば（都道府県が含まれていない箇所もあるため）
        if pref:
            pref="".join(pref[0][1:-1]) # 都道府県名
            map_url=re.findall(r"http[s]*://.*/.*/.*/.*/&amp",str(td))[0] # http://~/の部分を抽出
            map_url=map_url.split("//")[1] # http://の後ろを抽出
            lat,lon=list(map(float, map_url.split("/")[2:4])) # 緯度、経度を抽出

            pref_lat_lon_list.append([pref,lat,lon]) # リストに追加

    P=pd.DataFrame(pref_lat_lon_list,columns=["都道府県","緯度","経度"]) # データフレーム型に変換
    print("P.shape = ",P.shape)
    #P.head(10)
    
    return P

def main():
    soup=get_html_soup() # """ 1  ソースからデータを取得 """
    P=get_lat_lon(soup) # """ 2  必要な部分を抽出 """
    
    """ 3  csv出力 """
    P.to_csv("./都道府県庁所在地_緯度経度.csv",index=False) # .csv出力

    """ 4  出力確認 """
    display(pd.read_csv("./都道府県庁所在地_緯度経度.csv")) # csvを読み込み
    
if __name__=="__main__":
    main()