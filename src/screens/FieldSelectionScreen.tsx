import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import Typography from "../components/Typography";
import Button from "../components/Button";
import Card from "../components/Card";
import theme from "../styles/theme";
import { FieldType } from "../types";

interface FieldSelectionScreenProps {
  onStartFieldAssessment: (selectedFields: FieldType[]) => void;
  onBack: () => void;
}

const FieldSelectionScreen: React.FC<FieldSelectionScreenProps> = ({
  onStartFieldAssessment,
  onBack
}) => {
  const insets = useSafeAreaInsets();
  const [selectedFields, setSelectedFields] = useState<FieldType[]>([]);

  const fieldOptions = [
    {
      key: 'インフラエンジニア' as FieldType,
      title: '🔧 インフラエンジニア',
      description: 'サーバー、クラウド、ネットワークのスキル',
      emoji: '🔧'
    },
    {
      key: '開発エンジニア（プログラマー）' as FieldType,
      title: '💻 プログラマー',
      description: 'プログラミング、フロントエンド、バックエンドのスキル',
      emoji: '💻'
    },
    {
      key: '開発エンジニア（SE）' as FieldType,
      title: '⚙️ システムエンジニア',
      description: '設計、データベース、開発プロセス、セキュリティのスキル',
      emoji: '⚙️'
    },
    {
      key: 'マネジメント' as FieldType,
      title: '👥 マネジメント',
      description: 'チーム管理、プロジェクト管理、組織運営のスキル',
      emoji: '👥'
    }
  ];

  const toggleField = (field: FieldType) => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleStart = () => {
    if (selectedFields.length > 0) {
      onStartFieldAssessment(selectedFields);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingTop: insets.top + theme.spacing.md }]}>
        {/* ヘッダー */}
        <View style={styles.header}>
          <Typography variant="h3" align="center" style={styles.title}>
            分野の選択
          </Typography>
          <Typography variant="body1" align="center" style={styles.subtitle}>
            評価したい分野を選択してください（複数選択可）
          </Typography>
          <View style={styles.warningContainer}>
            <Typography variant="body2" style={styles.warningText}>
              ⚠️ 分野別評価の結果は履歴に保存されません
            </Typography>
          </View>
        </View>

        {/* 分野選択 */}
        <ScrollView style={styles.fieldsContainer} showsVerticalScrollIndicator={false}>
          {fieldOptions.map((field) => {
            const isSelected = selectedFields.includes(field.key);
            return (
              <Card
                key={field.key}
                variant={isSelected ? "elevated" : "outlined"}
                style={[
                  styles.fieldCard,
                  isSelected && styles.selectedFieldCard
                ]}
                onPress={() => toggleField(field.key)}
              >
                <View style={styles.fieldCardContent}>
                  <View style={styles.fieldInfo}>
                    <Typography variant="h6" style={styles.fieldTitle}>
                      {field.title}
                    </Typography>
                    <Typography variant="body2" style={styles.fieldDescription}>
                      {field.description}
                    </Typography>
                  </View>
                  <View style={styles.checkboxContainer}>
                    <View style={[
                      styles.checkbox,
                      isSelected && styles.checkboxSelected
                    ]}>
                      {isSelected && (
                        <Typography variant="caption" style={styles.checkmark}>
                          ✓
                        </Typography>
                      )}
                    </View>
                  </View>
                </View>
              </Card>
            );
          })}
        </ScrollView>

        {/* ボタン */}
        <View style={styles.buttonContainer}>
          <Typography variant="caption" style={styles.selectedCount}>
            {selectedFields.length > 0 ? `${selectedFields.length}つの分野を選択中` : '分野を選択してください'}
          </Typography>
          <View style={styles.buttonRow}>
            <Button
              title="戻る"
              onPress={onBack}
              variant="outline"
              style={styles.backButton}
            />
            <Button
              title="評価開始"
              onPress={handleStart}
              variant="primary"
              style={styles.startButton}
              disabled={selectedFields.length === 0}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.common.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.lg,
    alignItems: "center",
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.primary.main,
  },
  subtitle: {
    color: theme.colors.gray[600],
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  warningContainer: {
    backgroundColor: theme.colors.accent.warning + '20',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.accent.warning + '40',
  },
  warningText: {
    color: theme.colors.accent.warning,
    textAlign: "center",
    fontWeight: "600",
  },
  fieldsContainer: {
    flex: 1,
  },
  fieldCard: {
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  selectedFieldCard: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
    backgroundColor: theme.colors.primary.main + '10',
  },
  fieldCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldInfo: {
    flex: 1,
  },
  fieldTitle: {
    marginBottom: theme.spacing.xs,
  },
  fieldDescription: {
    color: theme.colors.gray[600],
    lineHeight: 18,
  },
  checkboxContainer: {
    marginLeft: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.gray[400],
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  checkmark: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: theme.spacing.lg,
  },
  selectedCount: {
    color: theme.colors.gray[600],
    marginBottom: theme.spacing.md,
  },
  buttonRow: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  backButton: {
    minWidth: 100,
  },
  startButton: {
    minWidth: 120,
  },
});

export default FieldSelectionScreen;