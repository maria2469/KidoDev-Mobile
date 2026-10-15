import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameContext';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { curriculum } from '../data/curriculum';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, assets, theme, toggleTheme } = useTheme();
  const { role, childProfile } = useAuth();
  const { cogs, stardust, streakDays, equippedSkin, skins, buySkin, equipSkin, nextQuestId } = useGame();

  const [shopVisible, setShopVisible] = useState(false);
  const [dailyByteDone, setDailyByteDone] = useState(false);

  // Find next mission details
  const nextMission = React.useMemo(() => {
    for (const lvl of curriculum) {
      const p = lvl.projects.find((proj) => proj.id === nextQuestId);
      if (p) return p;
    }
    return curriculum[0].projects[0];
  }, [nextQuestId]);

  const activeSkinObj = skins.find((s) => s.id === equippedSkin) || skins[0];

  const handleLaunchMission = () => {
    navigation.navigate('MagicStudio', {
      lessonId: nextMission.id,
      lessonTitle: nextMission.title,
      objective: nextMission.objective,
      classLevel: nextMission.class_level,
    });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top', 'left', 'right']}>
      {/* ═════════════════════════════════════════
          TOP GAME HUD (AVATAR, CURRENCY, STREAK)
          ═════════════════════════════════════════ */}
      <View style={[styles.gameHud, { backgroundColor: colors.navbar_bg }]}>
        {/* Left: Avatar & Player Info */}
        <TouchableOpacity style={styles.hudPlayerBadge} onPress={() => setShopVisible(true)} activeOpacity={0.8}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarEmoji}>{activeSkinObj.emoji}</Text>
          </View>
          <View>
            <Text style={styles.playerName} numberOfLines={1}>
              {childProfile?.name || 'Kido Cadet'}
            </Text>
            <Text style={styles.playerRank}>{childProfile?.level || 'Bronze Realm'}</Text>
          </View>
        </TouchableOpacity>

        {/* Right: Currency & Streaks */}
        <View style={styles.hudStatsRow}>
          {/* Cogs (Soft currency) */}
          <View style={styles.hudStatPill}>
            <FontAwesome5 name="cog" size={12} color="#F59E0B" />
            <Text style={styles.hudStatValue}>{cogs}</Text>
          </View>

          {/* Stardust (Hard currency) */}
          <View style={styles.hudStatPill}>
            <FontAwesome5 name="gem" size={12} color="#38BDF8" />
            <Text style={styles.hudStatValue}>{stardust}</Text>
          </View>

          {/* Daily Streak */}
          <View style={[styles.hudStatPill, styles.streakPill]}>
            <FontAwesome5 name="fire" size={13} color="#EF4444" />
            <Text style={[styles.hudStatValue, { color: '#EF4444' }]}>{streakDays}d</Text>
          </View>

          {/* Theme Switcher */}
          <TouchableOpacity style={styles.hudThemeBtn} onPress={toggleTheme}>
            <FontAwesome5 name={theme === 'forest' ? 'tree' : 'water'} size={13} color={colors.accent} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═════════════════════════════════════════
            HERO CARD: CONTINUE QUEST (PLAY BUTTON)
            ═════════════════════════════════════════ */}
        <View style={[styles.missionHeroCard, { backgroundColor: colors.card_bg }]}>
          <View style={styles.heroGlowBanner}>
            <View style={styles.missionTagRow}>
              <View style={styles.nextQuestPill}>
                <FontAwesome5 name="compass" size={10} color="#fff" />
                <Text style={styles.nextQuestPillText}>CURRENT QUEST • {nextMission.id}</Text>
              </View>
              <Text style={styles.xpRewardTag}>+10 XP</Text>
            </View>

            <Text style={styles.missionTitle}>{nextMission.title}</Text>
            <Text style={styles.missionObjective} numberOfLines={2}>
              {nextMission.objective || 'Help Whiskers use code blocks to reach the goal!'}
            </Text>

            {/* Big Play Button */}
            <TouchableOpacity
              style={[styles.bigPlayBtn, { backgroundColor: colors.primary }]}
              onPress={handleLaunchMission}
              activeOpacity={0.85}
            >
              <FontAwesome5 name="play" size={18} color="#fff" style={styles.playIcon} />
              <Text style={styles.bigPlayBtnText}>START QUEST MISSION</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ═════════════════════════════════════════
            DAILY BYTE: 2-MINUTE LOGIC PUZZLE
            ═════════════════════════════════════════ */}
        <View style={styles.dailyByteCard}>
          <View style={styles.dailyByteIconWrap}>
            <FontAwesome5 name="bolt" size={16} color="#D97706" />
          </View>
          <View style={styles.dailyByteTextWrap}>
            <View style={styles.dailyByteHeader}>
              <Text style={styles.dailyByteTitle}>Daily Byte Challenge</Text>
              <Text style={styles.dailyByteReward}>+20 ⚙️ & +5 XP</Text>
            </View>
            <Text style={styles.dailyByteDesc}>
              {dailyByteDone
                ? 'Challenge Completed! Streak boosted 🔥'
                : 'Spot the pattern: Cat moves 50, turns 90°. Where is it facing?'}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.dailyByteBtn,
              { backgroundColor: dailyByteDone ? '#10B981' : '#F59E0B' },
            ]}
            onPress={() => setDailyByteDone(true)}
            disabled={dailyByteDone}
            activeOpacity={0.8}
          >
            <FontAwesome5 name={dailyByteDone ? 'check' : 'arrow-right'} size={12} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ═════════════════════════════════════════
            THE 6 CODING REALMS (ADVENTURE WORLD)
            ═════════════════════════════════════════ */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleLeft}>
            <FontAwesome5 name="map-marked-alt" size={14} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.text_dark }]}>Coding Realms</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Levels')}>
            <Text style={[styles.seeAllText, { color: colors.primary }]}>View All Realms →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.realmsGrid}>
          {curriculum.slice(0, 4).map((realm, idx) => {
            const isUnlocked = idx === 0 || realm.level === 1;

            return (
              <TouchableOpacity
                key={realm.id}
                style={[
                  styles.realmCard,
                  { backgroundColor: colors.card_bg },
                  !isUnlocked && styles.lockedRealmCard,
                ]}
                onPress={() => navigation.navigate('Levels')}
                activeOpacity={0.88}
              >
                <View style={styles.realmTopRow}>
                  <View style={[styles.realmBadge, { backgroundColor: isUnlocked ? colors.primary : '#94A3B8' }]}>
                    <Text style={styles.realmBadgeText}>REALM {realm.level}</Text>
                  </View>
                  <Text style={styles.realmQuestCount}>{realm.projects.length} Quests</Text>
                </View>

                <Text style={styles.realmName}>{realm.title.replace(/^Level \d+:\s*/, '')}</Text>
                <Text style={styles.realmDesc} numberOfLines={2}>
                  {realm.description}
                </Text>

                <View style={styles.realmFooter}>
                  <Text style={[styles.realmExploreText, { color: isUnlocked ? colors.primary : '#94A3B8' }]}>
                    {isUnlocked ? 'Enter Realm' : 'Locked'}
                  </Text>
                  <FontAwesome5
                    name={isUnlocked ? 'chevron-right' : 'lock'}
                    size={11}
                    color={isUnlocked ? colors.primary : '#94A3B8'}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ═════════════════════════════════════════
            ARCADE SANDBOX BANNER
            ═════════════════════════════════════════ */}
        <TouchableOpacity
          style={styles.arcadeBanner}
          onPress={() => navigation.navigate('GamesHub')}
          activeOpacity={0.9}
        >
          <View style={styles.arcadeContent}>
            <View style={styles.arcadeIconBadge}>
              <FontAwesome5 name="gamepad" size={20} color="#8B5CF6" />
            </View>
            <View style={styles.arcadeTextWrap}>
              <Text style={styles.arcadeTitle}>Kido Creator Arcade</Text>
              <Text style={styles.arcadeSub}>Play mini-games built by student coders worldwide!</Text>
            </View>
          </View>
          <FontAwesome5 name="arrow-right" size={14} color="#8B5CF6" />
        </TouchableOpacity>
      </ScrollView>

      {/* ═════════════════════════════════════════
          BOTTOM GAME NAVIGATION DOCK
          ═════════════════════════════════════════ */}
      <View style={[styles.bottomDock, { backgroundColor: colors.navbar_bg }]}>
        <TouchableOpacity style={styles.dockItem} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={16} color={colors.primary} />
          <Text style={[styles.dockLabel, { color: colors.primary }]}>Hub</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dockItem} onPress={() => navigation.navigate('Levels')}>
          <FontAwesome5 name="map" size={16} color="#94A3B8" />
          <Text style={styles.dockLabel}>Realms</Text>
        </TouchableOpacity>

        {/* Central Studio Button */}
        <TouchableOpacity style={[styles.centerStudioBtn, { backgroundColor: colors.primary }]} onPress={handleLaunchMission}>
          <FontAwesome5 name="code" size={18} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.dockItem} onPress={() => navigation.navigate('GamesHub')}>
          <FontAwesome5 name="gamepad" size={16} color="#94A3B8" />
          <Text style={styles.dockLabel}>Arcade</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dockItem} onPress={() => setShopVisible(true)}>
          <FontAwesome5 name="tshirt" size={16} color="#94A3B8" />
          <Text style={styles.dockLabel}>Wardrobe</Text>
        </TouchableOpacity>
      </View>

      {/* ═════════════════════════════════════════
          AVATAR & WARDROBE SHOP MODAL
          ═════════════════════════════════════════ */}
      <Modal visible={shopVisible} transparent={true} animationType="slide">
        <View style={styles.shopOverlay}>
          <View style={styles.shopCard}>
            <View style={styles.shopHeader}>
              <View style={styles.shopHeaderTitleRow}>
                <FontAwesome5 name="tshirt" size={16} color="#6366F1" />
                <Text style={styles.shopTitle}>Hero Wardrobe & Skins</Text>
              </View>
              <TouchableOpacity onPress={() => setShopVisible(false)}>
                <FontAwesome5 name="times-circle" size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Balances */}
            <View style={styles.shopBalancesRow}>
              <View style={styles.shopBalanceItem}>
                <FontAwesome5 name="cog" size={12} color="#F59E0B" />
                <Text style={styles.shopBalanceText}>{cogs} Cogs</Text>
              </View>
              <View style={styles.shopBalanceItem}>
                <FontAwesome5 name="gem" size={12} color="#38BDF8" />
                <Text style={styles.shopBalanceText}>{stardust} Stardust</Text>
              </View>
            </View>

            {/* Skins Grid */}
            <ScrollView contentContainerStyle={styles.skinsGrid} showsVerticalScrollIndicator={false}>
              {skins.map((skin) => {
                const isEquipped = equippedSkin === skin.id;

                return (
                  <View key={skin.id} style={[styles.skinItemCard, isEquipped && styles.skinItemEquipped]}>
                    <Text style={styles.skinEmoji}>{skin.emoji}</Text>
                    <Text style={styles.skinName}>{skin.name}</Text>

                    {skin.unlocked ? (
                      <TouchableOpacity
                        style={[
                          styles.skinActionBtn,
                          { backgroundColor: isEquipped ? '#10B981' : '#6366F1' },
                        ]}
                        onPress={() => equipSkin(skin.id)}
                        disabled={isEquipped}
                      >
                        <Text style={styles.skinActionText}>{isEquipped ? 'EQUIPPED' : 'EQUIP'}</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={[styles.skinActionBtn, { backgroundColor: '#F59E0B' }]}
                        onPress={() => buySkin(skin.id)}
                      >
                        <Text style={styles.skinActionText}>
                          {skin.cost} {skin.type === 'cogs' ? '⚙️' : '💎'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  gameHud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  hudPlayerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 20,
  },
  playerName: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    maxWidth: 90,
  },
  playerRank: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '700',
  },
  hudStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hudStatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hudStatValue: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  streakPill: {
    backgroundColor: '#FEE2E2',
  },
  hudThemeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 90,
  },

  /* MISSION HERO CARD */
  missionHeroCard: {
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  heroGlowBanner: {},
  missionTagRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  nextQuestPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#6366F1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  nextQuestPillText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  xpRewardTag: {
    color: '#D97706',
    fontWeight: '900',
    fontSize: 11,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  missionObjective: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 16,
  },
  bigPlayBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  playIcon: {
    marginRight: 8,
  },
  bigPlayBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  /* DAILY BYTE CARD */
  dailyByteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  dailyByteIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FDE68A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  dailyByteTextWrap: {
    flex: 1,
  },
  dailyByteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dailyByteTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#92400E',
  },
  dailyByteReward: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
  },
  dailyByteDesc: {
    fontSize: 10,
    color: '#78350F',
    marginTop: 2,
    lineHeight: 13,
  },
  dailyByteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  /* REALMS SECTION */
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '900',
  },
  seeAllText: {
    fontSize: 11,
    fontWeight: '800',
  },
  realmsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  realmCard: {
    width: (width - 34) / 2,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  lockedRealmCard: {
    opacity: 0.65,
  },
  realmTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  realmBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  realmBadgeText: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
  },
  realmQuestCount: {
    fontSize: 9,
    color: '#64748B',
    fontWeight: '700',
  },
  realmName: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 3,
  },
  realmDesc: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 13,
    marginBottom: 8,
  },
  realmFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 6,
  },
  realmExploreText: {
    fontSize: 10,
    fontWeight: '800',
  },

  /* ARCADE BANNER */
  arcadeBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F3FF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
  },
  arcadeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  arcadeIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arcadeTextWrap: {
    flex: 1,
  },
  arcadeTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#6B21A8',
  },
  arcadeSub: {
    fontSize: 10,
    color: '#7E22CE',
    marginTop: 1,
  },

  /* BOTTOM DOCK */
  bottomDock: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  dockItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  dockLabel: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '700',
    marginTop: 2,
  },
  centerStudioBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    elevation: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
  },

  /* SHOP MODAL */
  shopOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  shopCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '80%',
  },
  shopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  shopHeaderTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  shopTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  shopBalancesRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 14,
  },
  shopBalanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  shopBalanceText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
  },
  skinsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingBottom: 24,
  },
  skinItemCard: {
    width: (width - 64) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  skinItemEquipped: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  skinEmoji: {
    fontSize: 36,
    marginBottom: 6,
  },
  skinName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  skinActionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  skinActionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
});
