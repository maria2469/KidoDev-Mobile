import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { curriculum, CurriculumLevel, LessonProject } from '../data/curriculum';
import { supabase } from '../utils/supabaseClient';
import { getLevelFromXp, getProjectBadge } from '../utils/grader';

const { width } = Dimensions.get('window');

/* 10 Coordinates for Island Quest Adventure Path (Snaking Zig-Zag) */
const COORDINATES_10 = [
  { x: 20, y: 86 },
  { x: 50, y: 80 },
  { x: 80, y: 74 },
  { x: 70, y: 62 },
  { x: 34, y: 56 },
  { x: 20, y: 44 },
  { x: 50, y: 36 },
  { x: 80, y: 28 },
  { x: 60, y: 18 },
  { x: 30, y: 8 },
];

export const LevelsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, assets, theme, toggleTheme } = useTheme();
  const { childProfile } = useAuth();

  const [view, setView] = useState<'selection' | 'map'>('selection');
  const [selectedLevel, setSelectedLevel] = useState<CurriculumLevel>(curriculum[0]);
  const [completions, setCompletions] = useState<Record<string, { score: number; badge: string }>>({});
  const [userXp, setUserXp] = useState(childProfile?.total_xp || 0);
  const [userRank, setUserRank] = useState(childProfile?.level || 'Bronze');

  useEffect(() => {
    fetchUserData();
  }, [childProfile]);

  const fetchUserData = async () => {
    if (!childProfile?.id) return;

    try {
      // 1. Fetch lesson completions (identical to web lesson_completions)
      const { data: compData } = await supabase
        .from('lesson_completions')
        .select('lesson_id, score, badge')
        .eq('child_id', childProfile.id);

      if (compData) {
        const compMap: Record<string, { score: number; badge: string }> = {};
        compData.forEach((item: any) => {
          compMap[item.lesson_id] = {
            score: item.score || 0,
            badge: item.badge || 'Bronze Medal',
          };
        });
        setCompletions(compMap);
      }

      // 2. Fetch latest child profile stats
      const { data: profData } = await supabase
        .from('child_profiles')
        .select('total_xp, level')
        .eq('id', childProfile.id)
        .maybeSingle();

      if (profData) {
        setUserXp(profData.total_xp || 0);
        setUserRank(profData.level || getLevelFromXp(profData.total_xp || 0));
      }
    } catch (e) {
      console.warn('Error fetching progress:', e);
    }
  };

  const handleOpenLevelMap = (level: CurriculumLevel) => {
    setSelectedLevel(level);
    setView('map');
  };

  const handleNodeClick = (lesson: LessonProject, isUnlocked: boolean) => {
    if (!isUnlocked) return;
    navigation.navigate('MagicStudio', {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      objective: lesson.objective,
      classLevel: selectedLevel.level,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* HEADER HUD BAR */}
      <View style={[styles.hudBar, { backgroundColor: colors.navbar_bg }]}>
        <TouchableOpacity
          style={styles.hudBackBtn}
          onPress={() => (view === 'map' ? setView('selection') : navigation.navigate('Home'))}
        >
          <FontAwesome5 name="arrow-left" size={14} color="#fff" />
          <Text style={styles.hudBackText}>{view === 'map' ? 'Islands' : 'Home'}</Text>
        </TouchableOpacity>

        {/* STATS PILLS */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Image source={assets.xp_badge} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>{userXp} XP</Text>
          </View>
          <View style={styles.statPill}>
            <Image source={assets.rank_badge} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>{userRank}</Text>
          </View>
          <View style={styles.statPill}>
            <Image source={assets.missions_badge} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>Lvl {selectedLevel.level}</Text>
          </View>
        </View>

        {/* THEME TOGGLE */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <FontAwesome5 name={theme === 'forest' ? 'tree' : 'water'} size={14} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {view === 'selection' ? (
        /* ═════════════════════════════════════════
           SELECTION VIEW: ALL 6 CODING ISLANDS
           ═════════════════════════════════════════ */
        <ScrollView contentContainerStyle={styles.selectionScroll} showsVerticalScrollIndicator={false}>
          {/* STONE HERO BANNER */}
          <ImageBackground source={assets.levels_stone} style={styles.stoneBanner} resizeMode="stretch">
            <View style={styles.stoneContent}>
              <Text style={[styles.stoneTitle, { color: colors.stone_title_color }]}>
                {childProfile?.name ? `${childProfile.name}'s Adventure` : 'Kido Explorer Islands'}
              </Text>
              <Text style={styles.stoneSub}>
                Master each coding realm through 10 hands-on quest challenges!
              </Text>
            </View>
          </ImageBackground>

          {/* ISLAND CARDS LIST */}
          <View style={styles.cardsGrid}>
            {curriculum.map((level, levelIdx) => {
              // Level 1 is always unlocked. Next levels unlock if previous level has completions.
              const isUnlocked = level.level === 1 || levelIdx === 0;

              // Calculate completed quests for this level
              const completedCount = level.projects.filter(
                (p) => completions[p.id]?.score >= 40
              ).length;

              return (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.islandCard,
                    { backgroundColor: colors.card_bg },
                    !isUnlocked && styles.lockedCard,
                  ]}
                  onPress={() => handleOpenLevelMap(level)}
                  activeOpacity={0.88}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.levelBadge, { backgroundColor: isUnlocked ? colors.primary : '#94A3B8' }]}>
                      <Text style={styles.levelBadgeText}>LEVEL {level.level}</Text>
                    </View>
                    <View style={styles.questCountPill}>
                      <FontAwesome5 name="check-circle" size={10} color="#10B981" />
                      <Text style={styles.questCountText}>
                        {completedCount} / {level.projects.length} Quests
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.cardTitle}>{level.title.replace(/^Level \d+:\s*/, '')}</Text>
                  <Text style={styles.cardDesc}>{level.description}</Text>

                  {/* TOPICS PREVIEW */}
                  <View style={styles.topicsGrid}>
                    {level.topics.slice(0, 4).map((t, idx) => (
                      <View key={idx} style={styles.topicItem}>
                        <FontAwesome5 name="star" size={8} color={colors.secondary} />
                        <Text style={styles.topicLabel}>{t}</Text>
                      </View>
                    ))}
                  </View>

                  {/* EXPLORE BUTTON */}
                  <View
                    style={[
                      styles.enterBtn,
                      { backgroundColor: isUnlocked ? colors.primary : '#E2E8F0' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.enterBtnText,
                        { color: isUnlocked ? '#fff' : '#64748B' },
                      ]}
                    >
                      {isUnlocked ? 'EXPLORE ISLAND' : 'LOCKED'}
                    </Text>
                    <FontAwesome5
                      name={isUnlocked ? 'arrow-right' : 'lock'}
                      size={12}
                      color={isUnlocked ? '#fff' : '#64748B'}
                    />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        /* ═════════════════════════════════════════
           MAP VIEW: 10 QUEST NODES ON ISLAND
           ═════════════════════════════════════════ */
        <ImageBackground source={assets.levels_image} style={styles.mapBackground} resizeMode="cover">
          <View style={styles.mapHeaderBanner}>
            <View style={styles.mapHeaderBadge}>
              <Text style={styles.mapHeaderBadgeText}>LEVEL {selectedLevel.level}</Text>
            </View>
            <Text style={styles.mapLevelTitle}>{selectedLevel.title.replace(/^Level \d+:\s*/, '')}</Text>
            <Text style={styles.mapLevelSub}>Tap any quest node to solve code missions!</Text>
          </View>

          {/* SVG CONNECTING PATHWAY */}
          <ScrollView contentContainerStyle={styles.mapScrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.mapArea}>
              <Svg width="100%" height={900} style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
                    <Stop offset="50%" stopColor="#F59E0B" stopOpacity="0.8" />
                    <Stop offset="100%" stopColor={colors.accent} stopOpacity="0.9" />
                  </SvgGradient>
                </Defs>
                <Path
                  d="M 80 820 Q 200 780 300 710 T 260 590 T 120 500 T 200 370 T 280 270 T 120 90"
                  stroke="url(#pathGradient)"
                  strokeWidth="8"
                  strokeDasharray="8 6"
                  fill="none"
                />
              </Svg>

              {/* 10 QUEST NODES */}
              {selectedLevel.projects.map((lesson, idx) => {
                const coord = COORDINATES_10[idx] || { x: 50, y: 50 };
                const prevLesson = idx > 0 ? selectedLevel.projects[idx - 1] : null;

                // First quest is unlocked; next unlocks if previous quest was passed with score >= 40
                const isUnlocked = idx === 0 || Boolean(prevLesson && (completions[prevLesson.id]?.score || 0) >= 40);

                const comp = completions[lesson.id];
                const score = comp?.score || 0;
                const { stars } = getProjectBadge(score);

                return (
                  <View
                    key={lesson.id}
                    style={[
                      styles.nodeWrapper,
                      {
                        left: `${coord.x}%`,
                        top: idx * 82 + 30,
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={[
                        styles.mapNode,
                        {
                          borderColor: isUnlocked ? colors.primary : '#94A3B8',
                          backgroundColor: isUnlocked ? '#FFFFFF' : '#E2E8F0',
                        },
                      ]}
                      onPress={() => handleNodeClick(lesson, isUnlocked)}
                      activeOpacity={isUnlocked ? 0.8 : 1}
                    >
                      {isUnlocked ? (
                        <Text style={[styles.mapNodeNumber, { color: colors.primary }]}>
                          {idx + 1}
                        </Text>
                      ) : (
                        <FontAwesome5 name="lock" size={12} color="#94A3B8" />
                      )}

                      {/* STAR RATING PILL */}
                      {isUnlocked && (
                        <View style={styles.nodeStarsRow}>
                          <FontAwesome5
                            name="star"
                            size={7}
                            color={stars >= 1 ? '#FFD000' : '#CBD5E1'}
                            solid={stars >= 1}
                          />
                          <FontAwesome5
                            name="star"
                            size={7}
                            color={stars >= 2 ? '#FFD000' : '#CBD5E1'}
                            solid={stars >= 2}
                          />
                          <FontAwesome5
                            name="star"
                            size={7}
                            color={stars >= 3 ? '#FFD000' : '#CBD5E1'}
                            solid={stars >= 3}
                          />
                        </View>
                      )}
                    </TouchableOpacity>

                    {/* QUEST TITLE LABEL */}
                    <View style={styles.nodeLabelBox}>
                      <Text style={styles.nodeLabelText} numberOfLines={1}>
                        {lesson.title}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </ImageBackground>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  hudBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  hudBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  hudBackText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statIcon: {
    width: 14,
    height: 14,
  },
  statText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  themeToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectionScroll: {
    padding: 12,
    paddingBottom: 40,
  },
  stoneBanner: {
    width: '100%',
    padding: 20,
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  stoneContent: {
    alignItems: 'center',
  },
  stoneTitle: {
    fontSize: 19,
    fontWeight: '900',
    textAlign: 'center',
  },
  stoneSub: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  cardsGrid: {
    gap: 12,
  },
  islandCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  lockedCard: {
    opacity: 0.65,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  questCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  questCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#16A34A',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topicLabel: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
  },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },
  enterBtnText: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  /* MAP VIEW STYLES */
  mapBackground: {
    flex: 1,
  },
  mapHeaderBanner: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  mapHeaderBadge: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 2,
  },
  mapHeaderBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  mapLevelTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
  mapLevelSub: {
    color: '#CBD5E1',
    fontSize: 10,
    marginTop: 2,
  },
  mapScrollContainer: {
    paddingBottom: 80,
  },
  mapArea: {
    width: '100%',
    height: 900,
    position: 'relative',
  },
  nodeWrapper: {
    position: 'absolute',
    alignItems: 'center',
    width: 120,
    marginLeft: -60,
  },
  mapNode: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  mapNodeNumber: {
    fontSize: 16,
    fontWeight: '900',
  },
  nodeStarsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 1,
  },
  nodeLabelBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
    maxWidth: 110,
  },
  nodeLabelText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '700',
    textAlign: 'center',
  },
});
