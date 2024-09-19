# novel-tralslate

[![wakatime](https://wakatime.com/badge/user/6c7a0447-9414-43ab-a937-9081f3e9fc7d/project/30132cd0-1c6e-4914-84e4-3e8bac06ea3c.svg)](https://wakatime.com/badge/user/6c7a0447-9414-43ab-a937-9081f3e9fc7d/project/30132cd0-1c6e-4914-84e4-3e8bac06ea3c)

## 成果展示

|                 Home Page                  |                 Novel Page                  |                 Article Page                  |
| :----------------------------------------: | :-----------------------------------------: | :-------------------------------------------: |
| ![](./screenshots/home%20page%20light.png) | ![](./screenshots/novel%20page%20light.png) | ![](./screenshots/article%20page%20light.png) |
|               Home Page Dark               |               Novel Page Dark               |               Article Page Dark               |
| ![](./screenshots/home%20page%20dark.png)  | ![](./screenshots/novel%20page%20dark.png)  | ![](./screenshots/article%20page%20dark.png)  |

## 設置網頁

使用docker compose，訪問http://localhost:8000

```yaml
services:
  app:
    image: gitea.easonabc.eu.org/eason/novel-translate:latest
    restart: unless-stopped
    network_mode: "host"
    environment:
      - SQLITE_PATH=/data/database.sqlite3
      - "API_URL=http://ollama:11434"
      - "WAF_COOKIES=aws-waf-token=get_one_if_you_want_alphapolis.co.jp;"
    volumes:
      - "./data:/data"
```

## ollama服務器

1. 下載ollama

https://ollama.com/

2. 下載模型的參數

推薦使用`GalTransl-7B-v2`大語言模型翻譯，這裡用IQ4_XS量化

先下載模型的參數:
https://huggingface.co/SakuraLLM/GalTransl-7B-v2/blob/main/GalTransl-7B-v2-IQ4_XS.gguf

3. 建立Modelfile

創立一個Modelfile

```Modelfile
FROM C:/使用者/Eason/下載/GalTransl-7B-v2-IQ4_XS.gguf

PARAMETER frequency_penalty 0.12
PARAMETER repeat_penalty 1
PARAMETER temperature 0.1
PARAMETER top_p 0.3
TEMPLATE """
<|im_start|>system
{{ .System }}<|im_end|>
<|im_start|>user
将下面的日文文本翻译成中文：
{{ .Prompt }}<|im_end|>
<|im_start|>assistant
"""
SYSTEM 你是一个轻小说翻译模型，可以流畅通顺地以日本轻小说的风格将日文翻译成简体中文，并联系上下文正确使用人称代词，不擅自添加原文中没有的代词。
PARAMETER num_ctx 4096
PARAMETER stop "</s>"
PARAMETER stop "USER:"
PARAMETER stop "ASSISTANT:"
```

4. 將Modelfile和參數匯入ollama

使用以下指令將Modelfile和參數匯入ollama

```shell
ollama create -f Modelfile GalTransl-7B-v2-IQ4_XS
```

### 雜項

1. 設置`WAF_COOKIES`來爬`https://www.alphapolis.co.jp`的輕小說
2. 對你的database執行`index.sql`以提昇反應時間
