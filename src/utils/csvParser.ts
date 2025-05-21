import * as FileSystem from "expo-file-system";
import { Skill } from "../types";

/**
 * CSVファイルからスキルデータを読み込む関数
 * @returns スキルデータの配列
 */
export const loadSkillsFromCSV = async (): Promise<Skill[]> => {
  try {
    // CSVデータを直接ハードコードする
    // 実際のアプリでは、アセットからの読み込みや、APIからの取得などを行うべきですが、
    // 開発中の問題を回避するために、ここではデータを直接埋め込みます
    const fileContent = `分野,項目,レベル,スキル
インフラエンジニア,サーバー,初級,基本構築/管理
インフラエンジニア,サーバー,初級,基本監視
インフラエンジニア,サーバー,初級,OSセットアップ
インフラエンジニア,サーバー,初級,トラブルシューティング（初級）
インフラエンジニア,サーバー,中級,高可用性設計
インフラエンジニア,サーバー,中級,パフォーマンス最適化
インフラエンジニア,サーバー,中級,サーバーリソース管理
インフラエンジニア,サーバー,中級,中級Linux操作（LPIC2相当）
インフラエンジニア,サーバー,上級,インフラ全体設計
インフラエンジニア,サーバー,上級,災害対策/BCP策定
インフラエンジニア,サーバー,上級,大規模システム設計
インフラエンジニア,サーバー,上級,オンプレミス/クラウド連携設計
インフラエンジニア,クラウド,初級,AWS/Azure/GCP基本操作
インフラエンジニア,クラウド,初級,クラウドリソース作成/削除
インフラエンジニア,クラウド,初級,基本的なサービス利用
インフラエンジニア,クラウド,初級,仮想マシン管理
インフラエンジニア,クラウド,中級,IaC（Terraform等）
インフラエンジニア,クラウド,中級,コンテナ技術（Docker/K8s）
インフラエンジニア,クラウド,中級,クラウドコスト最適化
インフラエンジニア,クラウド,中級,クラウド監視/セキュリティ対策
インフラエンジニア,クラウド,上級,マルチクラウド設計
インフラエンジニア,クラウド,上級,クラウドネイティブアーキテクチャ
インフラエンジニア,クラウド,上級,クラウド移行計画
インフラエンジニア,クラウド,上級,サーバーレスアーキテクチャ
インフラエンジニア,ネットワーク,初級,基本設定（ルーター/スイッチ）
インフラエンジニア,ネットワーク,初級,ネットワークトラブルシュート
インフラエンジニア,ネットワーク,初級,IPアドレス/サブネット設計
インフラエンジニア,ネットワーク,初級,基本的なVPN設定
インフラエンジニア,ネットワーク,中級,ネットワークセキュリティ設計
インフラエンジニア,ネットワーク,中級,負荷分散設計
インフラエンジニア,ネットワーク,中級,SD-WAN導入/運用
インフラエンジニア,ネットワーク,中級,VLAN/仮想ネットワーク設計
インフラエンジニア,ネットワーク,上級,大規模ネットワーク設計
インフラエンジニア,ネットワーク,上級,グローバルネットワーク設計
インフラエンジニア,ネットワーク,上級,クラウド間ネットワーク連携
インフラエンジニア,ネットワーク,上級,次世代ネットワークアーキテクチャ
開発エンジニア（プログラマー）,プログラミング,初級,基本コーディング（1〜2言語）
開発エンジニア（プログラマー）,プログラミング,初級,基本的なアルゴリズム知識
開発エンジニア（プログラマー）,プログラミング,初級,バグ修正/リファクタリング
開発エンジニア（プログラマー）,プログラミング,初級,コードレビュー対応
開発エンジニア（プログラマー）,プログラミング,中級,複数言語でのコーディング
開発エンジニア（プログラマー）,プログラミング,中級,設計パターンの実装
開発エンジニア（プログラマー）,プログラミング,中級,パフォーマンス改善
開発エンジニア（プログラマー）,プログラミング,中級,ライブラリ/フレームワーク活用
開発エンジニア（プログラマー）,プログラミング,上級,技術選定/評価
開発エンジニア（プログラマー）,プログラミング,上級,開発標準の策定
開発エンジニア（プログラマー）,プログラミング,上級,コーディング指導/レビュー`;

    // CSVを手動でパースする（csv-parseパッケージの代わりに）
    const lines = fileContent.split("\n");
    const headers = lines[0].split(",");

    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line) {
        const values = line.split(",");
        const record: any = {};

        headers.forEach((header, index) => {
          record[header] = values[index];
        });

        records.push(record);
      }
    }

    // 各レコードにIDを付与する
    return records.map((record: any, index: number) => ({
      ...record,
      id: index + 1,
    }));
  } catch (error) {
    console.error("CSVファイルの読み込みに失敗しました:", error);
    return [];
  }
};

/**
 * スキルデータから一意のカテゴリー（分野と項目の組み合わせ）を抽出する関数
 * @param skills スキルデータの配列
 * @returns カテゴリーの配列
 */
export const extractCategories = (skills: Skill[]) => {
  const categories = new Map<string, Set<string>>();

  skills.forEach((skill) => {
    if (!categories.has(skill.分野)) {
      categories.set(skill.分野, new Set());
    }
    categories.get(skill.分野)?.add(skill.項目);
  });

  return Array.from(categories).map(([category, items]) => ({
    category,
    items: Array.from(items),
  }));
};

/**
 * スキルデータを分野ごとにグループ化する関数
 * @param skills スキルデータの配列
 * @returns 分野ごとにグループ化されたスキルデータ
 */
export const groupSkillsByField = (skills: Skill[]) => {
  const grouped = new Map<string, Skill[]>();

  skills.forEach((skill) => {
    if (!grouped.has(skill.分野)) {
      grouped.set(skill.分野, []);
    }
    grouped.get(skill.分野)?.push(skill);
  });

  return grouped;
};

/**
 * スキルデータを分野と項目でグループ化する関数
 * @param skills スキルデータの配列
 * @returns 分野と項目でグループ化されたスキルデータ
 */
export const groupSkillsByCategoryAndItem = (skills: Skill[]) => {
  const grouped = new Map<string, Map<string, Skill[]>>();

  skills.forEach((skill) => {
    if (!grouped.has(skill.分野)) {
      grouped.set(skill.分野, new Map());
    }

    const categoryMap = grouped.get(skill.分野);
    if (!categoryMap?.has(skill.項目)) {
      categoryMap?.set(skill.項目, []);
    }

    categoryMap?.get(skill.項目)?.push(skill);
  });

  return grouped;
};
