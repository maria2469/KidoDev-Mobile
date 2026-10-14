import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome5 } from '@expo/vector-icons';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { curriculum, CurriculumLevel } from '../data/curriculum';
import { supabase } from '../utils/supabaseClient';

const { width } = Dimensions.get('window');

/* 5 Sub-Level Coordinates for Island World Map (percentages) */
const COORDINATES_5 = [
  { x: 20, y: 74 },
  { x: 34, y: 52 },
  { x: 52, y: 66 },
  { x: 68, y: 46 },
  { x: 84, y: 22 },
];

export const LevelsScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, assets, theme, toggleTheme } = useTheme();
  const { childProfile, role } = useAuth();

  const [view, setView] = useState<'selection' | 'map'>('selection');
  const [selectedLevel, setSelectedLevel] = useState<CurriculumLevel>(curriculum[0]);
  const [completions, setCompletions] = useState<Record<string, any>>({});
  const [userXp, setUserXp] = useState(120);

  useEffect(() => {
    fetchCompletions();
  }, [childProfile]);

  const fetchCompletions = async () => {
    if (childProfile?.id) {
      const { data } = await supabase
        .from('project_grades')
        .select('*')
        .eq('child_id', childProfile.id);

      if (data) {
        const compMap: Record<string, any> = {};
        data.forEach((item: any) => {
          compMap[item.lesson_id] = item;
        });
        setCompletions(compMap);
      }
    }
  };

  const handleOpenLevelMap = (level: CurriculumLevel) => {
    setSelectedLevel(level);
    setView('map');
  };

  const handleNodeClick = (subLevelIndex: number) => {
    const lessonId = `level-${selectedLevel.level}-${subLevelIndex + 1}`;
    navigation.navigate('MagicStudio', { lessonId });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* HEADER HUD */}
      <View style={[styles.hudBar, { backgroundColor: colors.navbar_bg }]}>
        <TouchableOpacity
          style={styles.hudBackBtn}
          onPress={() => (view === 'map' ? setView('selection') : navigation.navigate('Home'))}
        >
          <FontAwesome5 name="arrow-left" size={16} color="#fff" />
          <Text style={styles.hudBackText}>{view === 'map' ? 'Islands' : 'Home'}</Text>
        </TouchableOpacity>

        {/* STATS PILLS */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Image source={assets.xp_badge} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>{userXp} XP</Text>
          </View>
          <View style={styles.statPill}>
            <Image source={assets.missions_badge} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statText}>Lvl {selectedLevel.level}</Text>
          </View>
        </View>

        {/* THEME TOGGLE */}
        <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
          <FontAwesome5 name={theme === 'forest' ? 'tree' : 'water'} size={15} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {view === 'selection' ? (
        /* ═════════════════════════════════════════
           SELECTION VIEW: ALL ISLANDS
           ═════════════════════════════════════════ */
        <ScrollView contentContainerStyle={styles.selectionScroll} showsVerticalScrollIndicator={false}>
          {/* STONE BANNER */}
          <ImageBackground source={assets.levels_stone} style={styles.stoneBanner} resizeMode="stretch">
            <View style={styles.stoneContent}>
              <Text style={[styles.stoneTitle, { color: colors.stone_title_color }]}>
                {childProfile?.name ? `${childProfile.name}'s Adventure` : 'Kido Explorer Quests'}
              </Text>
              <Text style={styles.stoneSub}>Choose an island to continue your coding journey!</Text>
            </View>
          </ImageBackground>

          {/* ISLAND CARDS LIST */}
          <View style={styles.cardsGrid}>
            {curriculum.map((level) => {
              const isUnlocked = level.level === 1 || completions[`level-${level.level - 1}`];

              return (
                <TouchableOpacity
                  key={level.id}
                  style={[
                    styles.islandCard,
                    { backgroundColor: colors.card_bg },
                    !isUnlocked && styles.lockedCard,
                  ]}
                  onPress={() => handleOpenLevelMap(level)}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.levelBadge, { backgroundColor: isUnlocked ? colors.primary : '#94A3B8' }]}>
                      <Text style={styles.levelBadgeText}>LEVEL {level.level}</Text>
                    </View>
                    {!isUnlocked && (
                      <View style={styles.lockBadge}>
                        <FontAwesome5 name="lock" size={12} color="#64748B" />
                        <Text style={styles.lockText}>Locked</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.cardTitle}>{level.title.replace(/^Level \d+:\s*/, '')}</Text>
                  <Text style={styles.cardDesc}>{level.description}</Text>

                  {/* TOPICS PREVIEW */}
                  <View style={styles.topicsGrid}>
                    {level.topics.slice(0, 4).map((t, idx) => (
                      <View key={idx} style={styles.topicItem}>
                        <FontAwesome5 name="star" size={9} color={colors.secondary} />
                        <Text style={styles.topicLabel}>{t}</Text>
                      </View>
                    ))}
                  </View>

                  {/* ENTER BUTTON */}
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
           MAP VIEW: SVG CURVED PATH ISLAND MAP
           ═════════════════════════════════════════ */
        <ImageBackground source={assets.levels_image} style={styles.mapBackground} resizeMode="cover">
          <View style={styles.mapHeaderBanner}>
            <Text style={styles.mapLevelTitle}>{selectedLevel.title}</Text>
            <Text style={styles.mapLevelSub}>Tap any quest node to open the code studio!</Text>
          </View>

          {/* SVG CONNECTING PATH */}
          <View style={styles.mapArea}>
            <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
              <Defs>
                <SvgGradient id="pathGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor={colors.primary} stopOpacity="0.8" />
                  <Stop offset="100%" stopColor={colors.accent} stopOpacity="0.8" />
                </SvgGradient>
              </Defs>
              <Path
                d="M 80 420 C 120 320, 200 380, 210 280 C 220 200, 300 180, 320 100"
                stroke="url(#pathGradient)"
                strokeWidth="8"
                strokeDasharray="8 6"
                fill="none"
              />
            </Svg>

            {/* INTERACTIVE NODES */}
            {COORDINATES_5.map((coord, idx) => {
              const nodeNum = idx + 1;
              const isFirst = idx === 0;

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.mapNode,
                    {
                      left: `${coord.x}%`,
                      top: `${coord.y}%`,
                      borderColor: colors.primary,
                      backgroundColor: isFirst ? colors.primary : '#FFFFFF',
                    },
                  ]}
                  onPress={() => handleNodeClick(idx)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.mapNodeNumber,
                      { color: isFirst ? '#FFFFFF' : colors.primary },
                    ]}
                  >
                    {nodeNum}
                  </Text>
                  <View style={styles.nodeStarsRow}>
                    <FontAwesome5 name="star" size={8} color="#FFC107" />
                    <FontAwesome5 name="star" size={8} color="#FFC107" />
                    <FontAwesome5 name="star" size={8} color="#FFC107" />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  hudBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  hudBackText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  statIcon: {
    width: 20,
    height: 20,
  },
  statText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  themeToggle: {
    padding: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  selectionScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  stoneBanner: {
    width: '100%',
    height: 95,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    borderRadius: 18,
    overflow: 'hidden',
  },
  stoneContent: {
    alignItems: 'center',
  },
  stoneTitle: {
    fontSize: 18,
    fontWeight: '900',
    textAlign: 'center',
  },
  stoneSub: {
    fontSize: 12,
    color: '#5D4037',
    fontWeight: '700',
    marginTop: 2,
  },
  cardsGrid: {
    gap: 16,
  },
  islandCard: {
    padding: 18,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  lockedCard: {
    opacity: 0.7,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  lockText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topicLabel: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  enterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 18,
  },
  enterBtnText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mapBackground: {
    flex: 1,
  },
  mapHeaderBanner: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  mapLevelTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  mapLevelSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    marginTop: 2,
  },
  mapArea: {
    flex: 1,
    position: 'relative',
  },
  mapNode: {
    position: 'absolute',
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  mapNodeNumber: {
    fontSize: 16,
    fontWeight: '900',
  },
  nodeStarsRow: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 2,
  },
});
