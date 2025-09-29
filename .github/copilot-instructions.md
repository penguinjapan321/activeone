## 目的

このリポジトリは静的なウェブサイト（HTML/CSS/JS + Sass）です。AI エージェントは以下の指示に従って変更を行うと、開発者にとって有用で安全な修正ができます。

```instructions
## 目的（要約）

このリポジトリは静的な HTML/CSS/JS サイト（MAMP の htdocs 配下で公開想定）です。AI エージェントは下記のプロジェクト固有ルールに従って変更を行ってください。

## 重要な「大きな絵」

- ルート直下の HTML が公開コンテンツ。共通部分は SSI（<!--#include FILE="include/xxx.html"-->）で注入される。
- SCSS は `sass/`、コンパイル済み CSS は `css/`。ローカルでは dart-sass 等で手動またはスクリプトでコンパイルする必要あり。
- JS は `javascript/`、グローバルな振る舞いは `javascript/common.js` に集中。依存: jQuery、Splide、Featherlight。

## すぐ参照するファイル

- `include/head.html` — 全ページの head（meta / フォント / CSS 読み込み）。
- `include/script.html` — ページ下部のスクリプト初期化（Splide、inview 連携）。
- `javascript/common.js` — ヘッダー、ハンバーガー、アンカー移動、YouTube 自動再生トリガー等のグローバル処理。
- `sass/common.scss`, `sass/_mixin.scss`, `sass/_fonts.scss` — mixin とレスポンシブパターン（BEM 風命名）。
- `analyze-css.js` — CSS 品質チェック（@projectwallace/css-code-quality）。

## 開発ワークフロー（必須手順）

1. ローカルで確認するには MAMP の DocumentRoot に配置。SSI を有効にした Apache（mod_include）が必要。file:// では include が効かない。
2. SCSS 編集後は `npm run build:sass`（package.json の script）か手元の sass CLI で `sass/` → `css/` をビルドしてから確認する。
3. CSS 品質は `npm run analyze-css`（または `node analyze-css.js`）で確認。Node 16+ 推奨（CI は Node 18 を使用）。
4. CI（`.github/workflows/ci.yml`）: push/PR で `npm ci` → `npm run build:sass` → `npm run analyze-css` が実行される。

## プロジェクト固有ルール・注意点（実践的）

- HTML: 共通変更は `include/` を編集。単一ページ変更で済むならルートの HTML を直接編集。
- JS: `include/script.html` の読み込み順を壊さない。Splide や gallery-sync 初期化はここにある。
- セレクタ依存: 多くの JS は特定の DOM 構造（例: `#top_splide`, `.fade`, `.js-nav`）を前提にしている。DOM を変えるときは関連コードを検索して更新する。
- 命名: BEM 風。新しいクラスやブロックを追加する際は既存スタイルと mixin を再利用。
- グローバル変数に注意: `javascript/common.js` に暗黙のグローバルが残ることがある。新規実装では `let`/`const` を使用してスコープを明確にする。

## 具体的な短い例

- 新ページ作成: ルートに HTML を置き、`<!--#include FILE="include/head.html"-->` / `include/header.html` / `include/footer.html` を挿入。
- スライダー追加: DOM に `id="top_splide"` のような既存パターンを踏襲し、必要なら `include/script.html` の Splide 初期化設定を参照して breakpoint を合わせる。
- SCSS 修正: 再利用できる mixin は `sass/_mixin.scss` にあるため先に確認する。

## 最低限のチェックリスト（PR 前）

1. 変更が共通箇所なら `include/` を更新したか。
2. SCSS を編集したら `css/` を生成してコミットするか、チーム方針に従うこと。
3. JS を編集したら `include/script.html` の初期化や依存セレクタへの影響を確認。
4. ローカルで MAMP + mod_include による表示確認を行う。

## ファイル参照サンプル（必ず見る箇所）

- `index.html`, `season_terrace.html`（ページパターン）
- `include/head.html`, `include/script.html`, `include/header.html`, `include/footer.html`
- `javascript/common.js`, `javascript/splide.min.js`, `javascript/featherlight.js`
- `sass/common.scss`, `sass/_mixin.scss`

```

- 画像やアセットは `image/` に大量存在する。軽微な HTML 変更でもパスを壊さないよう注意。
