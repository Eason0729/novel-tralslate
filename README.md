# novel-tralslate

[![wakatime](https://wakatime.com/badge/user/6c7a0447-9414-43ab-a937-9081f3e9fc7d/project/30132cd0-1c6e-4914-84e4-3e8bac06ea3c.svg)](https://wakatime.com/badge/user/6c7a0447-9414-43ab-a937-9081f3e9fc7d/project/30132cd0-1c6e-4914-84e4-3e8bac06ea3c)

## 成果展示

|                 Home Page                  |                 Novel Page                  |                 Article Page                  |
| :----------------------------------------: | :-----------------------------------------: | :-------------------------------------------: |
| ![](./screenshots/home%20page%20light.png) | ![](./screenshots/novel%20page%20light.png) | ![](./screenshots/article%20page%20light.png) |
|               Home Page Dark               |               Novel Page Dark               |               Article Page Dark               |
| ![](./screenshots/home%20page%20dark.png)  | ![](./screenshots/novel%20page%20dark.png)  | ![](./screenshots/article%20page%20dark.png)  |

## 安裝

使用docker compose，打開`./docker`

```shell
git clone https://github.com/Eason0729/novel-tralslate.git
cd docker
sudo docker compose up
```

### 雜項

1. 設置`WAF_COOKIES`來爬`https://www.alphapolis.co.jp`的輕小說
2. 對你的database執行`index.sql`以提昇反應時間
3. 使用更大的模型
