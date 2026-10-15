import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/NavigationTypes';
import { curriculum } from '../data/curriculum';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, assets, theme, toggleTheme } = useTheme();
  const { role, childProfile, logout } = useAuth();

  const handleStartAdventure = () => {
    if (role === 'kid' || role === 'parent') {
      navigation.navigate('Levels');
    } else {
      navigation.navigate('Auth');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={theme === 'forest' ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
      
      {/* TOP NAVBAR */}
      <View style={[styles.navbar, { backgroundColor: colors.navbar_bg }]}>
        <View style={styles.navLeft}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
          <View style={[styles.badge, { backgroundColor: colors.primary }]}>
            <FontAwesome5 name="sparkles" size={10} color="#fff" />
            <Text style={styles.badgeText}>Kids Coding</Text>
          </View>
        </View>

        <View style={styles.navRight}>
          {/* Theme Toggle Button */}
          <TouchableOpacity
            style={[styles.themeBtn, { borderColor: colors.accent }]}
            onPress={toggleTheme}
            activeOpacity={0.8}
          >
            <FontAwesome5
              name={theme === 'forest' ? 'tree' : 'water'}
              size={16}
              color={colors.accent}
            />
            <Text style={[styles.themeBtnText, { color: colors.accent }]}>
              {theme === 'forest' ? 'Forest' : 'Aqua'}
            </Text>
          </TouchableOpacity>

          {/* User profile or Auth button */}
          {role ? (
            <TouchableOpacity
              style={[styles.userPill, { backgroundColor: colors.secondary }]}
              onPress={() => navigation.navigate(role === 'parent' ? 'ParentDashboard' : 'Levels')}
            >
              <FontAwesome5 name={role === 'kid' ? 'gamepad' : 'user-shield'} size={14} color="#000" />
              <Text style={styles.userPillText}>
                {role === 'kid' ? childProfile?.name || 'Explorer' : 'Dashboard'}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.loginBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('Auth')}
            >
              <Text style={styles.loginBtnText}>Log In</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* HERO SECTION */}
        <View style={[styles.heroContainer, isTablet && styles.heroTablet]}>
          <View style={styles.heroTextContainer}>
            <View style={styles.superTag}>
              <FontAwesome5 name="rocket" size={12} color={colors.accent} />
              <Text style={[styles.superTagText, { color: colors.accent }]}>GAMIFIED ADVENTURE</Text>
            </View>
            <Text style={[styles.heroTitle, { color: colors.text_dark }]}>
              Code. Play.{'\n'}
              <Text style={{ color: colors.primary }}>Create Magic!</Text>
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.text_muted }]}>
              The interactive block-coding universe for kids. Solve fun puzzles, build animations, and explore vibrant island maps!
            </Text>

            {/* ACTION BUTTONS */}
            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
                onPress={handleStartAdventure}
                activeOpacity={0.85}
              >
                <FontAwesome5 name="play" size={16} color="#fff" />
                <Text style={styles.primaryBtnText}>
                  {role ? 'CONTINUE QUEST' : 'LAUNCH PLAYLAND'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryBtn, { borderColor: colors.primary, backgroundColor: colors.card_bg }]}
                onPress={() => navigation.navigate('GamesHub')}
                activeOpacity={0.85}
              >
                <FontAwesome5 name="gamepad" size={16} color={colors.primary} />
                <Text style={[styles.secondaryBtnText, { color: colors.primary }]}>MINI-GAMES</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* HERO MASCOT ILLUSTRATION */}
          <View style={styles.heroImageWrapper}>
            <Image source={assets.hero} style={styles.heroImage} resizeMode="contain" />
            <View style={[styles.floatingBadge, styles.starBadge, { backgroundColor: colors.secondary }]}>
              <FontAwesome5 name="star" size={16} color="#000" />
              <Text style={styles.floatingBadgeText}>Fun!</Text>
            </View>
            <View style={[styles.floatingBadge, styles.aiBadge, { backgroundColor: colors.accent }]}>
              <FontAwesome5 name="robot" size={16} color="#fff" />
              <Text style={[styles.floatingBadgeText, { color: '#fff' }]}>AI Tutor</Text>
            </View>
          </View>
        </View>

        {/* 3 CORE FEATURE CARDS */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text_dark }]}>Why Kids Love Kido Dev</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.text_muted }]}>Designed specially for hands-on, zero-stress learning</Text>
        </View>

        <View style={[styles.featuresGrid, isTablet && styles.featuresTablet]}>
          <View style={[styles.featureCard, { borderColor: '#E2E8F0', backgroundColor: colors.card_bg }]}>
            <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(14, 165, 233, 0.15)' }]}>
              <FontAwesome5 name="puzzle-piece" size={26} color="#0EA5E9" />
            </View>
            <Text style={styles.featureTitle}>Block Magic</Text>
            <Text style={styles.featureDesc}>
              Snap colourful coding blocks together like digital Lego. No syntax errors, just pure creativity.
            </Text>
          </View>

          <View style={[styles.featureCard, { borderColor: '#E2E8F0', backgroundColor: colors.card_bg }]}>
            <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <FontAwesome5 name="map-marked-alt" size={26} color="#F59E0B" />
            </View>
            <Text style={styles.featureTitle}>Island Maps</Text>
            <Text style={styles.featureDesc}>
              Progress through dynamic story levels, earn medals, open treasure chests, and gain XP.
            </Text>
          </View>

          <View style={[styles.featureCard, { borderColor: '#E2E8F0', backgroundColor: colors.card_bg }]}>
            <View style={[styles.featureIconWrap, { backgroundColor: 'rgba(139, 92, 246, 0.15)' }]}>
              <FontAwesome5 name="cat" size={26} color="#8B5CF6" />
            </View>
            <Text style={styles.featureTitle}>Kido AI Companion</Text>
            <Text style={styles.featureDesc}>
              Our friendly animated cat guide gently highlights hints when your child gets stuck.
            </Text>
          </View>
        </View>

        {/* CURRICULUM PREVIEW */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text_dark }]}>Curriculum Road Map</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.text_muted }]}>10 exciting milestone levels from Rookie to Champion</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.curriculumRow}>
          {curriculum.map((item, idx) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.curriculumCard, { backgroundColor: colors.card_bg }]}
              onPress={handleStartAdventure}
              activeOpacity={0.9}
            >
              <View style={[styles.curriculumBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.curriculumBadgeText}>LEVEL {item.level}</Text>
              </View>
              <Text style={styles.curriculumCardTitle}>{item.title.replace(/^Level \d+:\s*/, '')}</Text>
              <Text style={styles.curriculumCardDesc}>{item.description}</Text>
              <View style={styles.topicsList}>
                {item.topics.slice(0, 3).map((t, tidx) => (
                  <View key={tidx} style={styles.topicPill}>
                    <FontAwesome5 name="check-circle" size={10} color={colors.primary} />
                    <Text style={styles.topicText}>{t}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* BOTTOM CALLOUT */}
        <View style={[styles.bottomBanner, { backgroundColor: colors.primary }]}>
          <Image source={assets.sprite_logo} style={styles.bottomMascot} resizeMode="contain" />
          <View style={styles.bottomBannerText}>
            <Text style={styles.bottomBannerTitle}>Ready To Start Your Adventure?</Text>
            <Text style={styles.bottomBannerSub}>Jump into Level 1 and unlock the secrets of motion and animation!</Text>
            <TouchableOpacity
              style={styles.bannerActionBtn}
              onPress={handleStartAdventure}
              activeOpacity={0.9}
            >
              <Text style={[styles.bannerActionBtnText, { color: colors.primary }]}>START FREE QUEST</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Kido Dev • Gamified Learning Platform for Kids</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 110,
    height: 38,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  themeBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  userPillText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  loginBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: 'center',
  },
  heroTablet: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  heroTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  superTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
    marginBottom: 12,
  },
  superTagText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  heroTitle: {
    fontSize: isTablet ? 42 : 32,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: isTablet ? 50 : 38,
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: isTablet ? 17 : 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    maxWidth: 500,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    width: '100%',
    marginBottom: 24,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 28,
    borderWidth: 2,
  },
  secondaryBtnText: {
    fontSize: 14,
    fontWeight: '900',
  },
  heroImageWrapper: {
    width: isTablet ? 380 : width * 0.75,
    height: isTablet ? 320 : 240,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  floatingBadge: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  starBadge: {
    top: 20,
    left: 0,
  },
  aiBadge: {
    bottom: 20,
    right: 0,
  },
  floatingBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
  },
  sectionSubtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  featuresGrid: {
    paddingHorizontal: 16,
    gap: 12,
  },
  featuresTablet: {
    flexDirection: 'row',
  },
  featureCard: {
    flex: 1,
    padding: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  featureIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  featureDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  curriculumRow: {
    paddingHorizontal: 16,
    gap: 14,
    paddingBottom: 10,
  },
  curriculumCard: {
    width: 220,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  curriculumBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  curriculumBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  curriculumCardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  curriculumCardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 10,
  },
  topicsList: {
    gap: 4,
  },
  topicPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topicText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  bottomBanner: {
    marginHorizontal: 16,
    marginTop: 30,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  bottomMascot: {
    width: 75,
    height: 75,
  },
  bottomBannerText: {
    flex: 1,
  },
  bottomBannerTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 4,
  },
  bottomBannerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  bannerActionBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerActionBtnText: {
    fontSize: 12,
    fontWeight: '900',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  footerText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});
