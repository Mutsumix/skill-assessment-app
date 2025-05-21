# スキル習得状況可視化アプリ

このアプリケーションは、社員のスキル習得状況を可視化するためのスマホアプリです。

## 機能概要

- スキルリストからスワイプ操作で回答（右：スキルあり、左：スキルなし）
- 分野ごとに休憩カードを表示
- 結果を一覧表示とレーダーチャートで表示
- レーダーチャートは 11 角形で、各項目は初級・中級・上級の 3 レベルで積み上げ表示

## 技術スタック

- **フレームワーク**: React Native（Expo）
- **スワイプ機能**: React Native Gesture Handler
- **チャート表示**: React Native SVG + Victory Native
- **状態管理**: React Context API
- **スタイリング**: デジタル庁デザインシステムに準拠したカスタムコンポーネント

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm start

# iOSシミュレータでの実行
npm run ios

# Androidエミュレータでの実行
npm run android
```

## プロジェクト構造

```
skill-assessment-app/
├── assets/             # 静的ファイル（画像、フォント、CSVデータなど）
├── src/
│   ├── components/     # UIコンポーネント
│   ├── screens/        # 画面コンポーネント
│   ├── contexts/       # Contextプロバイダー
│   ├── hooks/          # カスタムフック
│   ├── utils/          # ユーティリティ関数
│   ├── types/          # TypeScript型定義
│   ├── constants/      # 定数
│   └── styles/         # グローバルスタイル
├── App.tsx             # アプリケーションのエントリーポイント
└── ...
```

## ライセンス

このプロジェクトは内部利用を目的としており、権利は所有者に帰属します。
