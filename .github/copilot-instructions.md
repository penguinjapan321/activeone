## 目的

このリポジトリは静的なウェブサイト（HTML/CSS/JS + Sass）で、MAMP/Apache（SSI 有効）で公開する想定です。以下は AI コーディングエージェントがすぐに作業できるようにするための簡潔な指示です。

### 大きな構成（Big picture）

- ルート直下の HTML ファイル（例: `index.html`, `season_terrace.html`）が公開ページです。共通部分は SSI（<!--#include FILE="include/xxx.html"-->）で注入されています。
- スタイルは `sass/` に記述し、コンパイル後の CSS は `css/` に置かれています。SCSS 編集後は必ずビルドして `css/` を更新してください。
- JavaScript は `javascript/` 配下。グローバルな UI ロジックは主に `javascript/common.js` にあります。依存ライブラリ: jQuery、Splide、Featherlight。

### まず読むべきファイル

- `include/head.html` — 各ページの <head>（フォント、meta、CSS 読み込み）
- `include/script.html` — スクリプトの読み込み順と初期化（Splide、inview 連携など）
- `javascript/common.js` — ヘッダー、ハンバーガー、アンカー遷移、YouTube トリガー等の全体挙動
- `sass/_mixin.scss`, `sass/common.scss`, `sass/_fonts.scss` — mixin、レスポンシブヘルパー、フォント設定
- `analyze-css.js`, `package.json` — CSS 品質チェックと利用可能な npm スクリプト

### 開発ワークフロー（具体的）

1. ローカル確認: リポジトリを MAMP の DocumentRoot に置き、Apache の mod_include を有効にしてプレビューしてください（file:// では SSI が展開されません）。
2. SCSS を編集したら必ずビルド:

```bash
npm run build:sass
```

（連続編集中は `npm run watch:sass` が便利です） 3. CSS 品質チェック:

```bash
npm run analyze-css
```

（`analyze-css.js` が `@projectwallace/css-code-quality` を使っています。CI は Node 18 を利用） 4. CI（`.github/workflows/ci.yml`）: push/PR 時に `npm ci` → `npm run build:sass` → `npm run analyze-css` が実行されます。

### プロジェクト固有のルール（必ず守る）

- 共通の HTML 断片は `include/` に置く。複数ページに影響する変更は `include/` を編集すること。
- `include/script.html` の読み込み順を変更しないこと。Splide 等の初期化は順序や存在する DOM に依存します。
- 多くの JS は特定のセレクタ（`#top_splide`, `.fade`, `.js-nav` など）や DOM 構造を前提にしている。マークアップを変える時は必ず `javascript/` 内の該当箇所を検索して更新する。
- 命名は BEM に近い慣習。新しいスタイルは `sass/_mixin.scss` の mixin を再利用する。
- グローバル変数は避ける。新しいスクリプトでは `const` / `let` を使用してスコープを明確にする。

### 具体的な例

- 新ページを追加する場合（テンプレート）:

```html
<!--#include FILE="include/head.html"-->
<!--#include FILE="include/header.html"-->
<!-- ページ本体 -->
<!--#include FILE="include/footer.html"-->
```

- スライダー追加: `id="top_splide"` のような既存パターンを踏襲し、`include/script.html` の初期化設定と breakpoint を確認する。
- SCSS 修正: まず `sass/_mixin.scss` を確認し、再利用可能な mixin を使う。編集後は `npm run build:sass` を実行して `css/` を更新する。

### PR 前チェックリスト

1. 変更が複数ページに及ぶ場合は `include/` を編集したか。
2. SCSS を編集したら `css/` を生成してコミットする（チーム方針に従う）。
3. JS/マークアップを変えた場合、`include/script.html` の初期化順や `javascript/` 内の selector 依存を確認したか。
4. MAMP（mod_include 有効）上で表示確認を行ったか。

### 常に確認すべき横断的ファイル

- `include/script.html`, `javascript/common.js` — グローバルな JS 初期化
- `sass/_mixin.scss`, `sass/common.scss` — スタイルの共通ロジック
- `package.json`, `analyze-css.js`, `.github/workflows/ci.yml` — ビルドと品質チェックの自動化

不明点や、スライダー追加や mixin 使用例の具体的な抜粋を入れてほしい場合は指示してください。
