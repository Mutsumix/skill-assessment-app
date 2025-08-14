import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from "react-native";
import { SkillSummary, Skill, UserAnswer } from "../types";
import Card from "./Card";
import Typography from "./Typography";
import theme from "../styles/theme";

interface SkillListProps {
  data: SkillSummary[];
  allSkills?: Skill[]; // 全スキルデータを追加
  userAnswers?: UserAnswer[]; // ユーザーの回答データを追加
}

const SkillList: React.FC<SkillListProps> = ({ data, allSkills = [], userAnswers = [] }) => {
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // データが空の場合は何も表示しない
  if (!data || data.length === 0) {
    return null;
  }

  // カテゴリーごとにデータをグループ化
  const groupedData: { [key: string]: SkillSummary[] } = {};
  data.forEach((item) => {
    if (!groupedData[item.category]) {
      groupedData[item.category] = [];
    }
    groupedData[item.category].push(item);
  });

  // スキル詳細を表示する関数
  const showSkillDetails = (category: string, item: string, level: "初級" | "中級" | "上級") => {
    // 該当するスキルを検索
    const matchingSkills = allSkills.filter(skill => 
      skill.分野 === category && 
      skill.項目 === item && 
      skill.レベル === level
    );

    if (matchingSkills.length > 0) {
      setSelectedSkills(matchingSkills);
      setIsModalVisible(true);
    } else {
      Alert.alert("情報", "該当するスキル情報が見つかりませんでした。");
    }
  };

  // ユーザーの習得状況を取得する関数
  const getSkillAcquisitionStatus = (skillId: number) => {
    const answer = userAnswers.find(answer => answer.skillId === skillId);
    return answer ? answer.hasSkill : false;
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedSkills([]);
  };

  return (
    <Card variant="elevated" style={styles.container}>
      <Typography variant="h4" align="center" style={styles.title}>
        スキル習得状況一覧
      </Typography>

      <ScrollView
        style={styles.scrollView}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {Object.entries(groupedData).map(([category, items]) => (
          <View key={category} style={styles.categorySection}>
            <Typography variant="h5" style={styles.categoryTitle}>
              {category}
            </Typography>

            {items.map((item, index) => (
              <View key={`${item.category}-${item.item}-${index}`} style={styles.itemContainer}>
                <Typography variant="h6" style={styles.itemTitle}>
                  {item.item}
                </Typography>

                <View style={styles.levelContainer}>
                  {/* 初級レベル */}
                  <TouchableOpacity 
                    style={styles.levelSection}
                    onPress={() => showSkillDetails(category, item.item, "初級")}
                    activeOpacity={0.7}
                  >
                    <Typography variant="caption" style={styles.levelTitle}>
                      初級
                    </Typography>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(item.beginnerCount / item.beginnerTotal) * 100}%`,
                            backgroundColor: theme.colors.primary.light,
                          },
                        ]}
                      />
                      <Typography variant="caption" style={styles.progressText}>
                        {item.beginnerCount}/{item.beginnerTotal}
                      </Typography>
                    </View>
                  </TouchableOpacity>

                  {/* 中級レベル */}
                  <TouchableOpacity 
                    style={styles.levelSection}
                    onPress={() => showSkillDetails(category, item.item, "中級")}
                    activeOpacity={0.7}
                  >
                    <Typography variant="caption" style={styles.levelTitle}>
                      中級
                    </Typography>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(item.intermediateCount / item.intermediateTotal) * 100}%`,
                            backgroundColor: theme.colors.primary.main,
                          },
                        ]}
                      />
                      <Typography variant="caption" style={styles.progressText}>
                        {item.intermediateCount}/{item.intermediateTotal}
                      </Typography>
                    </View>
                  </TouchableOpacity>

                  {/* 上級レベル */}
                  <TouchableOpacity 
                    style={styles.levelSection}
                    onPress={() => showSkillDetails(category, item.item, "上級")}
                    activeOpacity={0.7}
                  >
                    <Typography variant="caption" style={styles.levelTitle}>
                      上級
                    </Typography>
                    <View style={styles.progressContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(item.advancedCount / item.advancedTotal) * 100}%`,
                            backgroundColor: theme.colors.primary.dark,
                          },
                        ]}
                      />
                      <Typography variant="caption" style={styles.progressText}>
                        {item.advancedCount}/{item.advancedTotal}
                      </Typography>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* スキル詳細モーダル */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Typography variant="h5" style={styles.modalTitle}>
                スキル詳細
              </Typography>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Typography variant="h6" style={styles.closeButtonText}>×</Typography>
              </TouchableOpacity>
            </View>

            {/* 共通情報の表示 */}
            {selectedSkills.length > 0 && (
              <View style={styles.commonInfoSection}>
                <View style={styles.detailRow}>
                  <Typography variant="caption" style={styles.detailLabel}>分野:</Typography>
                  <Typography variant="body2" style={styles.detailValue}>
                    {selectedSkills[0].分野}
                  </Typography>
                </View>
                
                <View style={styles.detailRow}>
                  <Typography variant="caption" style={styles.detailLabel}>項目:</Typography>
                  <Typography variant="body2" style={styles.detailValue}>
                    {selectedSkills[0].項目}
                  </Typography>
                </View>
                
                <View style={styles.detailRow}>
                  <Typography variant="caption" style={styles.detailLabel}>レベル:</Typography>
                  <Typography variant="body2" style={styles.detailValue}>
                    {selectedSkills[0].レベル}
                  </Typography>
                </View>
              </View>
            )}
            
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={true}>
              {selectedSkills.map((skill, index) => (
                <View key={`${skill.id}-${index}`} style={styles.skillDetailCard}>
                  <View style={styles.detailRow}>
                    <Typography variant="caption" style={styles.detailLabel}>スキル:</Typography>
                    <Typography variant="body2" style={styles.detailValue}>
                      {skill.スキル}
                    </Typography>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Typography variant="caption" style={styles.detailLabel}>説明:</Typography>
                    <Typography variant="body2" style={styles.detailValue}>
                      {skill.解説}
                    </Typography>
                  </View>

                  {/* 習得状況の表示 */}
                  <View style={styles.detailRow}>
                    <Typography variant="caption" style={styles.detailLabel}>習得状況:</Typography>
                    <View style={styles.acquisitionStatusContainer}>
                      <View style={[
                        styles.acquisitionStatusIndicator,
                        getSkillAcquisitionStatus(skill.id) 
                          ? styles.acquired 
                          : styles.notAcquired
                      ]} />
                      <Typography 
                        variant="body2" 
                        style={
                          getSkillAcquisitionStatus(skill.id) 
                            ? {...styles.acquisitionStatusText, ...styles.acquiredText}
                            : {...styles.acquisitionStatusText, ...styles.notAcquiredText}
                        }
                      >
                        {getSkillAcquisitionStatus(skill.id) ? "習得済み" : "未習得"}
                      </Typography>
                    </View>
                  </View>

                  {index < selectedSkills.length - 1 && <View style={styles.skillSeparator} />}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  scrollView: {
    maxHeight: 500, // 高さを増やす
    flexGrow: 1,
  },
  categorySection: {
    marginBottom: theme.spacing.lg,
  },
  categoryTitle: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.gray[100],
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  itemContainer: {
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  itemTitle: {
    marginBottom: theme.spacing.xs,
  },
  levelContainer: {
    marginLeft: theme.spacing.md,
  },
  levelSection: {
    marginBottom: theme.spacing.xs,
  },
  levelTitle: {
    marginBottom: 2,
  },
  progressContainer: {
    height: 16,
    backgroundColor: theme.colors.gray[200],
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
    position: "relative",
  },
  progressBar: {
    height: "100%",
    position: "absolute",
    left: 0,
    top: 0,
  },
  progressText: {
    position: "absolute",
    right: theme.spacing.xs,
    top: 0,
    height: "100%",
    textAlignVertical: "center",
    fontSize: 10,
  },
  // モーダル関連のスタイル
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    maxWidth: '90%',
    maxHeight: '80%',
    minWidth: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[200],
    paddingBottom: theme.spacing.sm,
  },
  modalTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.gray[100],
  },
  closeButtonText: {
    fontSize: 20,
    color: theme.colors.gray[600],
  },
  commonInfoSection: {
    backgroundColor: theme.colors.gray[50],
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.gray[200],
  },
  modalBody: {
    flex: 1,
  },
  skillDetailCard: {
    paddingVertical: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    alignItems: 'flex-start',
  },
  detailLabel: {
    width: 70,
    fontWeight: 'bold',
    marginRight: theme.spacing.sm,
    color: theme.colors.gray[700],
  },
  detailValue: {
    flex: 1,
    lineHeight: 20,
  },
  acquisitionStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  acquisitionStatusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  acquired: {
    backgroundColor: theme.colors.success.main,
  },
  notAcquired: {
    backgroundColor: theme.colors.gray[400],
  },
  acquisitionStatusText: {
    fontWeight: '500',
  },
  acquiredText: {
    color: theme.colors.success.main,
  },
  notAcquiredText: {
    color: theme.colors.gray[600],
  },
  skillSeparator: {
    height: 1,
    backgroundColor: theme.colors.gray[200],
    marginVertical: theme.spacing.md,
  },
});

export default SkillList;
