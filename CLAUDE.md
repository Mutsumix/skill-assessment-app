# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## TDD TODO リスト（t-wada 流）

### 基本方針

- 🔴 Red: 失敗するテストを書く
- 🟢 Green: テストを通す最小限の実装
- 🔵 Refactor: リファクタリング
- 小さなステップで進める
- 仮実装（ベタ書き）から始める
- 三角測量で一般化する
- 明白な実装が分かる場合は直接実装しても OK
- テストリストを常に更新する
- 不安なところからテストを書く

## Development Commands

```bash
# Install dependencies
npm install

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## Architecture Overview

This is a React Native skill assessment app built with Expo that evaluates 128 technical skills across 4 domains: Infrastructure Engineering, Programming, System Engineering, and Management.

### Core Architecture Patterns

**Screen-Based Navigation**: Uses a custom enum-driven navigation system (`AppScreen`) in `App.tsx` rather than React Navigation. Screens are managed through state transitions with centralized screen rendering logic.

**Context-Driven State Management**: Primary state is managed through two main contexts:

- `SkillContext`: Handles skill data, user answers, progress tracking, and persistence
- `BreakContext`: Manages rest cards shown between skill domains

**Dual Data Flow**: The app handles two distinct data flows:

1. **Assessment Flow**: Skills → User Answers → Results → History Storage
2. **Progress Flow**: Current Index → Save/Load → Resume Capability

### Data Architecture

**CSV-Based Skill Data**: Skills are loaded from `assets/skilllist.csv` with structure: `分野,項目,レベル,スキル` (Domain, Category, Level, Skill). The CSV parser in `utils/csvParser.ts` transforms this into typed `Skill` objects with auto-generated IDs.

**AsyncStorage Persistence**: Three storage managers in `utils/storageManager.ts`:

- `AssessmentHistoryManager`: Complete assessment results with metadata
- `ProgressManager`: In-progress assessment state for resumption
- `FirstLaunchManager`: App initialization state

**Results Aggregation**: Results are computed by grouping skills by domain/category and aggregating user answers across beginner/intermediate/advanced levels. This feeds both the radar chart visualization and detailed skill lists.

### Key Implementation Details

**Manual Save Strategy**: Auto-save is intentionally disabled. Users must manually save progress, with duplicate save prevention built into the context.

**Field-Based Break Cards**: Rest cards are shown when transitioning between skill domains (`分野`), using the previous domain to determine which rest card to display.

**Radar Chart Data**: 11-sided radar chart displays aggregated scores per domain/category combination, with each point representing the sum of beginner + intermediate + advanced acquired skills.

**Screen State Management**: Each screen receives callback props for navigation rather than using a navigation library. This creates explicit state transitions managed in `App.tsx`.

## Important File Locations

- `assets/skilllist.csv`: Source skill data (128 items)
- `src/contexts/SkillContext.tsx`: Primary state management
- `src/utils/storageManager.ts`: Data persistence layer
- `src/utils/csvParser.ts`: Skill data parsing and transformation
- `App.tsx`: Root navigation and screen management

## Data Structures

Skills follow the pattern: Domain → Category → Level → Individual Skills, where each skill has beginner/intermediate/advanced classifications that aggregate into radar chart points and detailed breakdowns.
