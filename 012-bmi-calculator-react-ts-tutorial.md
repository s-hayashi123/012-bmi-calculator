# 【React & TypeScript】useStateとuseMemoで作る！BMI計算機開発チュートリアル (012)

## 🚀 はじめに

### このチュートリアルで作るもの

このチュートリアルでは、ユーザーの身長と体重からBMI（Body Mass Index）を計算し、肥満度を判定するシンプルなWebアプリケーションを作成します。

完成形のデモはこちらです。（画像やGIFをここに挿入）

### なぜこの技術が重要か？

Web開発において、ユーザーからの入力を受け取り、それに応じて動的に結果を表示する機能は非常に基本的かつ重要です。この課題を通して、Reactの基本的なHooksである`useState`と、計算処理を効率化する`useMemo`の使い方をマスターしましょう。

- **`useState`**: コンポーネントの状態を管理するための最も基本的なフックです。あらゆるインタラクティブな機能の基礎となります。
- **`useMemo`**: 計算コストが高い処理の結果を「メモ化（記憶）」し、不要な再計算を防ぎます。これにより、アプリケーションのパフォーマンスを向上させることができます。

このチュートリアルを終える頃には、Reactにおける状態管理とパフォーマンス最適化の基本的な考え方が身についているはずです。

## 📚 環境構築

最新の公式ドキュメントに基づき、Vite、Tailwind CSS、shadcn/uiを使った開発環境を構築します。

### 1. プロジェクトの作成

まず、`vite` を使用して新しいReactプロジェクトを作成します。`React + TypeScript` テンプレートを選択してください。

```bash
pnpm create vite@latest my-bmi-calculator --template react-ts
cd my-bmi-calculator
```

### 2. Tailwind CSSの追加

次に、Tailwind CSSをプロジェクトに追加します。

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpm exec tailwindcss init -p
```

`tailwind.config.js`ファイルを以下のように設定します。

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

`src/index.css` の内容をすべて以下に置き換えます。

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. shadcn/uiのセットアップ

`shadcn/ui`をプロジェクトに導入します。

```bash
pnpm dlx shadcn-ui@latest init
```

いくつか質問されますので、以下のように回答してください。

- **Would you like to use TypeScript (recommended)?** `yes`
- **Which style would you like to use?** `Default`
- **Which color would you like to use as base color?** `Slate`
- **Where is your global CSS file?** `src/index.css`
- **Do you want to use CSS variables for colors?** `yes`
- **Where is your tailwind.config.js located?** `tailwind.config.js`
- **Configure import alias for components?** `yes`
- **Configure import alias for utils?** `yes`

`tsconfig.json`の`paths`が設定されていることを確認してください。

```json
{
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": [
        "./src/*"
      ]
    }
  }
}
```

### 4. 必要なコンポーネントの追加

今回の開発で必要な`Input`と`Button`コンポーネントを追加します。

```bash
pnpm dlx shadcn-ui@latest add input
pnpm dlx shadcn-ui@latest add button
```

これで環境構築は完了です！`pnpm dev`を実行して、開発サーバーを起動しましょう。

## 🤔 思考を促す開発ステップ

ここからは、あなた自身が考えながら実装を進めていくパートです。完全なコードは提示しません。ヒントを元に、自分で解決策を探してみてください。

### Step 1: UIコンポーネントの配置

まずは、アプリケーションの骨格となるUIを作成します。

- **思考のヒント:**
    - `src/App.tsx`ファイルを開き、`Input`コンポーネントを2つ（身長用、体重用）と`Button`コンポーネントを1つ配置してみましょう。
    - `shadcn/ui`のドキュメントを参考に、それぞれのコンポーネントをインポートして使ってみてください。
    - 結果を表示するための`div`要素も忘れずに用意しておきましょう。

```tsx
// src/App.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function App() {
  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center justify-center gap-8">
      <h1 className="text-3xl font-bold">BMI Calculator</h1>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        {/* TODO: 身長入力用のInputコンポーネントをここに配置 */}
      </div>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        {/* TODO: 体重入力用のInputコンポーネントをここに配置 */}
      </div>
      {/* TODO: 計算ボタンをここに配置 */}
      
      <div className="mt-8 text-center">
        {/* TODO: 計算結果をここに表示 */}
      </div>
    </main>
  );
}

export default App;
```

### Step 2: 状態管理の導入

ユーザーの入力を管理するために`useState`を導入します。

- **思考のヒント:**
    - 身長(`height`)と体重(`weight`)を保存するためのstateを`useState`を使って定義しましょう。初期値は空文字列(`''`)が良いでしょう。
    - `Input`コンポーネントの`value`属性に定義したstateを紐付け、`onChange`イベントでstateを更新する関数を渡します。
    - `e.target.value`で入力値を取得できます。

```tsx
// ...
import { useState } from "react";
// ...

function App() {
  // TODO: useStateを使って身長と体重のstateを定義する

  return (
    // ...
  );
}
```

### Step 3: BMI計算ロジックの実装

いよいよメインの計算ロジックです。ここでは`useMemo`を活用します。

- **思考のヒント:**
    - `useMemo`を使ってBMIを計算するロジックを実装しましょう。
    - 計算式は `体重(kg) / (身長(m) * 身長(m))` です。
    - `useMemo`の依存配列には何を指定するべきでしょうか？考えてみてください。
    - 入力値は`string`型なので、`parseFloat`で数値に変換する必要があります。
    - 身長はcmで入力されるので、mに変換するのを忘れずに。
    - 入力が不正な場合（空文字や0など）は、計算結果として`null`を返すようにバリデーション処理も加えましょう。

```tsx
// ...
import { useMemo, useState } from "react";
// ...

function App() {
  // ... state definitions

  // TODO: useMemoを使ってBMIを計算するロジックを実装
  const bmi = useMemo(() => {
    // 1. 身長と体重を数値に変換
    // 2. 入力値が有効かチェック (0より大きいか)
    // 3. BMIを計算
    // 4. 有効な場合は計算結果、無効な場合はnullを返す
  }, [/* 依存配列は？ */]);

  return (
    // ...
  );
}
```

### Step 4: 判定ロジックと結果の表示

計算されたBMIに応じて、肥満度を判定し、結果を画面に表示します。

- **思考のヒント:**
    - BMIの値（`bmi`）に依存するもう一つの`useMemo`を作成し、肥満度のカテゴリ（例：「普通体重」）を返すロジックを実装しましょう。
    - `bmi`が`null`の場合は何も表示しないようにします。
    - 計算結果と判定カテゴリを、Step 1で用意した表示エリアに表示します。`bmi`が`null`でない時だけ表示するように条件分岐を使いましょう。

```tsx
// ...
const bmiCategory = useMemo(() => {
  if (bmi === null) {
    return "";
  }
  // TODO: BMIの値に応じて判定結果を返す
  // < 18.5: '痩せすぎ'
  // 18.5 - 24.9: '普通体重'
  // 25 - 29.9: '肥満（1度）'
  // ...
}, [bmi]);

// ... in JSX
<div className="mt-8 text-center">
  {bmi !== null && (
    <>
      <p className="text-xl">あなたのBMIは...</p>
      <p className="text-5xl font-bold">{/* TODO: BMIの値を表示 */}</p>
      <p className="mt-2 text-2xl">{/* TODO: 判定カテゴリを表示 */}</p>
    </>
  )}
</div>
```

## 💡 深掘りコラム

### なぜ`useMemo`を使うのか？

今回のケースでは、BMIの計算は非常に軽量なので、`useMemo`を使わなくても体感できるほどのパフォーマンス差は出ません。しかし、これがもっと複雑で重い計算だった場合を想像してみてください。

`useMemo`を使わないと、UIのどこかが更新されるたび（例えば、全く関係ないテーマ切り替えボタンを押しただけでも）に、この重い計算が再実行されてしまいます。

`useMemo`は、依存配列（この例では`[height, weight]`）の値が変更された時にだけ、中の計算処理を再実行します。これにより、不要な計算をスキップし、アプリケーションの応答性を保つことができるのです。

## 挑戦課題

### Easy: リセット機能の追加

- 「リセット」ボタンを追加し、クリックすると入力フィールドと計算結果が初期状態に戻るように実装してみましょう。

### Hard: デバッグチャレンジ

以下のコードには意図的にバグが仕込まれています。開発者ツールを使って原因を特定し、修正してください。

```tsx
// わざと間違ったコードスニペット
const bmi = useMemo(() => {
  // 身長をメートルに変換するのを忘れている
  const heightInMeters = parseFloat(height); 
  const weightInKg = parseFloat(weight);

  if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) {
    return null;
  }
  // 計算式も間違っている
  return heightInMeters / (weightInKg * weightInKg);
}, [height, weight]);
```

- **ヒント:** 計算結果が明らかにおかしいはずです。`console.log`を使って、各変数の値が期待通りか確認してみましょう。

## ✅ まとめ

このチュートリアルでは、Reactの基本的なHooksである`useState`と`useMemo`を使って、インタラクティブなBMI計算機を作成しました。

- ユーザー入力を`useState`で管理する方法
- `useMemo`を使って計算処理を効率化する方法
- 条件に応じて表示を切り替える方法

これらの基本的なスキルは、今後のReact開発において非常に重要になります。ぜひ、挑戦課題にも取り組んで、理解を深めてください。