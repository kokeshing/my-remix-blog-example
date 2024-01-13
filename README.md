# Remix + Cloudflare Pages (Functions) + Cloudflare D1 + Cloudflare R2 のブログシステムの例

## これは何？

Remix + Cloudflare Pages (Functions) + Cloudflare D1 + Cloudflare R2 のブログシステムの例です。  
[ここ](https://kokeshing.com)で動かしています。

## How to run

Cloudflareのアカウントが必要です。

```sh
$ npm install
$ npx wrangler login
```

### D1 と R2 の作成（既存のものを使う場合は不要）

```sh
$ npx wrangler d1 create [your-database-name]
$ npx wrangler r2 bucket create [your-bucket-name]
```

### 開発用にローカルで動かす場合

```sh
$ npx wrangler d1 migrations apply [your-database-name] --local
```

作成したD1のデータベースの名前・IDやR2のバケットの名前を、`wrangler.toml`に設定してください。

```sh
$ npx wrangler d1 execute [your-database-name] --local --command="INSERT INTO articles (key, title, abstract, body) VALUES ('example0', 'Hello World', 'Example abstract', '## Example heading' || char(10) || '### Example sub heading' || char(10) || 'This is example.' || char(10))"
$ npm run dev
```

GAのトラッキングIDを設定する場合は、`.dev.vars`に環境変数`GA_TRACKING_ID`に設定してください。

静的ファイルもローカルのR2に追加することで、記事から参照可能です。  
以下のコマンドは、ローカルのR2への画像の追加の例です。

```sh
$ npx wrangler r2 object put [your-bucket-name]/[your-article-key]/00.jpg --file=/path/to/00.jpg --local
```

### Cloudflare 上で動かす場合

プロジェクトの設定から D1 や R2 のバインディングを設定してください。  
Settings > Functions > R2 bucket bindings と Settings > Functions > D1 database bindings で設定できます。  
`npm run deploy`の後にバインディングを設定しても、デプロイ済みのものには反映されないことを確認しています。  
バインディングの設定を変更した場合は、再度デプロイしてください。

```sh
$ npx wrangler d1 migrations apply [your-database-name]
$ npm run deploy
```

GAのトラッキングIDを設定する場合は、プロジェクトの設定から環境変数`GA_TRACKING_ID`に設定してください。

`example`以下に、記事・画像などの追加のためのスクリプトと記事の例があります。  
上で作成したD1とR2の名前や、Cloudflareにアクセスするためのトークンなどをスクリプトのグローバル変数に設定してください。  
以下のコマンドで、記事の例をD1とR2にアップロードできます。

```sh
$ python3 example/scripts/insert.py example/article/
```
