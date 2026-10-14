import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/NavigationTypes';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

/* TEAM DATA FROM WEB */
const TEAM_MEMBERS = [
  {
    id: 'dr-zeeshan',
    name: 'Dr. Muhammad Zeeshan Asaf',
    role: 'Lead Academic Advisor & Curriculum Specialist',
    badge: 'ACADEMIC LEADERSHIP',
    image: require('../../assets/no_bg_output/sir_zeeshan.webp'),
    accent: '#0284C7',
    bio: 'Directs curriculum strategy, structured learning pacing, and algorithmic pedagogy to ensure young minds grasp computational logic with ease.',
  },
  {
    id: 'muteeb-ramzan',
    name: 'M. Muteeb Ramzan',
    role: 'Chief Architect & Founder of Code Nexus',
    badge: 'PLATFORM ARCHITECTURE',
    image: require('../../assets/no_bg_output/muteeb_ramzan.webp'),
    accent: '#4F46E5',
    bio: 'Leads the core platform architecture and interactive engine development, creating high-speed, child-safe environments tailored for young creators.',
  },
  {
    id: 'laiba-sarwar',
    name: 'Laiba Sarwar',
    role: 'Founder & Chief Executive Officer',
    badge: 'EXECUTIVE LEADERSHIP',
    image: require('../../assets/no_bg_output/laiba_sarwar.webp'),
    accent: '#DB2777',
    bio: 'Spearheads the mission, product roadmap, and global vision of Kido Dev to make high-quality, friendly coding education accessible to all learners.',
  },
  {
    id: 'maria-noor',
    name: 'Maria Noor',
    role: 'Lead Developer & Interactive Designer',
    badge: 'ENGINEERING & DESIGN',
    image: require('../../assets/no_bg_output/maria_noor.webp'),
    accent: '#8B5CF6',
    bio: 'Crafts the interactive magic studio, visual drag-and-drop engines, and gamified animations powering the Kido Dev learner experience.',
  },
  {
    id: 'laiba-noor',
    name: 'Laiba Noor',
    role: 'Lead Pedagogical Designer',
    badge: 'PEDAGOGY & CURRICULUM',
    image: require('../../assets/no_bg_output/laiba_noor.webp'),
    accent: '#10B981',
    bio: 'Designs child-centered pedagogical pathways, micro-challenges, and cognitive progression maps that turn complex syntax into playful discoveries.',
  },
];

/* HOW IT WORKS STEPS FROM WEB */
const HOW_STEPS = [
  {
    num: '1',
    title: 'Pick a Mission',
    text: "Choose a game you want to build. From 'Flappy Bird' clones to 'Space Invaders'.",
    color: '#FF5F5F',
  },
  {
    num: '2',
    title: 'Follow the Light',
    text: 'Our magic overlay dims the screen and highlights exactly which block to grab.',
    color: '#4FB5FF',
  },
  {
    num: '3',
    title: 'Snap & Learn',
    text: "Drag the block. If it's right, it snaps with a satisfying click and you get XP!",
    color: '#67E032',
  },
  {
    num: '4',
    title: 'Play Just Built',
    text: 'Hit the Green Flag. You just built a real working game. Now share it with friends.',
    color: '#E0329E',
  },
];

/* SYLLABUS LEVELS FROM WEB */
const SYLLABUS_LEVELS = [
  {
    level: 1,
    title: 'Coding Foundations & Logic',
    difficulty: 'Introductory',
    badge: 'STEP 01',
    accent: '#0284C7',
    desc: 'Introduce young minds to visual block programming, spatial sequences, and algorithmic logic through joyful creative play.',
    topics: ['Visual Block Sequencing', 'Basic Event Triggers', 'Character Coordinates', 'Problem-Solving Logic'],
  },
  {
    level: 2,
    title: 'Loops, Timing & Animation',
    difficulty: 'Foundation',
    badge: 'STEP 02',
    accent: '#16A34A',
    desc: 'Understand repetition, automated cycles, and timed choreography to build dynamic multi-character digital worlds.',
    topics: ['Repeat & Forever Loops', 'Timer & Delay Synchronization', 'Costume Animation Switching', 'Sound Event Binding'],
  },
  {
    level: 3,
    title: 'Conditionals & Decision Logic',
    difficulty: 'Intermediate',
    badge: 'STEP 03',
    accent: '#D97706',
    desc: 'Equip young programmers with If/Else logic, sensing boundaries, and responsive keyboard/mouse player controls.',
    topics: ['If / Else Decision Trees', 'Color & Edge Collision Sensing', 'Keyboard Controls', 'Score Tracking Counters'],
  },
  {
    level: 4,
    title: 'Advanced Game Architecture',
    difficulty: 'Advanced',
    badge: 'STEP 04',
    accent: '#8B5CF6',
    desc: 'Combine player physics, enemy intelligence, multi-level win states, and variable lives into full-fledged arcade games.',
    topics: ['Collision Physics', 'Enemy Artificial Logic', 'Health & Lives System', 'Win & Game Over States'],
  },
  {
    level: 5,
    title: 'Audio Synthesis & Sound Engineering',
    difficulty: 'Mastery',
    badge: 'STEP 05',
    accent: '#EF4444',
    desc: 'Transform games with procedural music, sound effect triggers, tempo modulation, and live interactive soundboards.',
    topics: ['Synthesizer Notes', 'Drum Patterns', 'Tempo Modulation', 'Volume & Audio Controls'],
  },
];

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, assets, theme, toggleTheme } = useTheme();
  const { role, childProfile } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStartMission = () => {
    navigation.navigate('Levels');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0B0F19' }]}>
      {/* ──────────────────────────────────────────
          1. THE WONDERBAR (NAVBAR)
      ────────────────────────────────────────── */}
      <View style={styles.wonderbar}>
        <View style={styles.navLeft}>
          <Image source={assets.logo} style={styles.logo} resizeMode="contain" />
        </View>

        <View style={styles.navRight}>
          {/* THEME TOGGLE */}
          <TouchableOpacity style={styles.themePillBtn} onPress={toggleTheme} activeOpacity={0.8}>
            <FontAwesome5 name={theme === 'forest' ? 'tree' : 'water'} size={13} color="#00E5FF" />
            <Text style={styles.themePillText}>{theme === 'forest' ? 'Forest' : 'Aqua'}</Text>
          </TouchableOpacity>

          {/* HAMBURGER MENU BUTTON */}
          <TouchableOpacity
            style={styles.menuBtn}
            onPress={() => setMobileMenuOpen(true)}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="bars" size={16} color="#fff" />
          </TouchableOpacity>

          {/* USER OR START CTA */}
          <TouchableOpacity
            style={styles.navCtaBtn}
            onPress={handleStartMission}
            activeOpacity={0.85}
          >
            <Text style={styles.navCtaText}>
              {role === 'kid' ? childProfile?.name || 'Explorer' : 'Playland'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MOBILE DRAWER MODAL */}
      <Modal visible={mobileMenuOpen} transparent animationType="fade">
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <Image source={assets.logo} style={styles.drawerLogo} resizeMode="contain" />
              <TouchableOpacity onPress={() => setMobileMenuOpen(false)}>
                <FontAwesome5 name="times" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerLinks}>
              <TouchableOpacity
                style={styles.drawerLinkItem}
                onPress={() => {
                  setMobileMenuOpen(false);
                  navigation.navigate('Home');
                }}
              >
                <FontAwesome5 name="home" size={18} color="#0EA5E9" style={styles.drawerLinkIcon} />
                <Text style={styles.drawerLinkText}>Home</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerLinkItem}
                onPress={() => {
                  setMobileMenuOpen(false);
                  navigation.navigate('Levels');
                }}
              >
                <FontAwesome5 name="map-marked-alt" size={18} color="#10B981" style={styles.drawerLinkIcon} />
                <Text style={styles.drawerLinkText}>Adventure Islands (Levels)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerLinkItem}
                onPress={() => {
                  setMobileMenuOpen(false);
                  navigation.navigate('GamesHub');
                }}
              >
                <FontAwesome5 name="gamepad" size={18} color="#F59E0B" style={styles.drawerLinkIcon} />
                <Text style={styles.drawerLinkText}>Mini-Games Hub</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerLinkItem}
                onPress={() => {
                  setMobileMenuOpen(false);
                  navigation.navigate('Auth');
                }}
              >
                <FontAwesome5 name="user" size={18} color="#8B5CF6" style={styles.drawerLinkIcon} />
                <Text style={styles.drawerLinkText}>{role ? 'Dashboard' : 'Login / Passport'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* ──────────────────────────────────────────
            2. HERO SECTION (WITH 3D VIDEO BACKGROUND)
        ────────────────────────────────────────── */}
        <View style={styles.heroSection}>
          {/* Background Video */}
          <Video
            source={require('../../assets/videos/herovideo.mp4')}
            style={StyleSheet.absoluteFill}
            resizeMode={ResizeMode.COVER}
            shouldPlay
            isLooping
            isMuted
          />

          {/* Dark Overlay for Text Readability (matching web .hero-dark-overlay) */}
          <View style={styles.heroDarkOverlay} />

          {/* Hero Content */}
          <View style={styles.heroContentWrapper}>
            <View style={styles.heroTaglinePill}>
              <Text style={styles.heroTaglineText}>THE PREMIER GAMIFIED PLATFORM</Text>
            </View>

            {/* Exact Web Title: Learn Coding the Easy & Best Way! */}
            <Text style={styles.heroTitle}>
              Learn Coding the{
}
              <Text style={{ color: '#00FF66' }}>Easy</Text> & <Text style={{ color: '#FF007F' }}>Best</Text> Way!
            </Text>

            {/* Exact Web CTA Button: Start Your Mission */}
            <TouchableOpacity
              style={styles.heroVibrantBtn}
              onPress={handleStartMission}
              activeOpacity={0.88}
            >
              <LinearGradient
                colors={['#0EA5E9', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroBtnGradient}
              >
                <Text style={styles.heroBtnText}>START YOUR MISSION</Text>
                <FontAwesome5 name="rocket" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* ──────────────────────────────────────────
            3. FEATURES SECTION (WHY KIDO DEV? BENTO GRID)
        ────────────────────────────────────────── */}
        <View style={styles.featuresSection}>
          <View style={styles.sectionHeaderCenter}>
            <View style={styles.shineBadge}>
              <Text style={styles.shineBadgeText}>WHY KIDO DEV?</Text>
            </View>
            <Text style={styles.featuresTitle}>
              Learning <Text style={{ color: '#FACC15' }}>Reimagined</Text>{
}
              <Text style={{ color: '#00F5D4' }}>For Gen Alpha</Text>
            </Text>
          </View>

          {/* BENTO CARD 1: AI Agent Enabled Platform (Video 2) */}
          <View style={styles.bentoCard}>
            <Video
              source={require('../../assets/videos/video2.mp4')}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
            <View style={styles.bentoDarkOverlay} />
            <View style={styles.bentoContent}>
              <View style={[styles.bentoIconCircle, { backgroundColor: 'rgba(239, 68, 68, 0.4)' }]}>
                <FontAwesome5 name="robot" size={24} color="#EF4444" />
              </View>
              <Text style={styles.bentoCardTitle}>AI Agent Enabled Platform</Text>
              <Text style={styles.bentoCardDesc}>
                Learn the base of coding from the ground up and master it perfectly with your personal AI mentor.
              </Text>
            </View>
          </View>

          {/* BENTO CARD 2: Visual Block Masterclass (Video 1) */}
          <View style={styles.bentoCard}>
            <Video
              source={require('../../assets/videos/video1.mp4')}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
            <View style={styles.bentoDarkOverlay} />
            <View style={styles.bentoContent}>
              <View style={[styles.bentoIconCircle, { backgroundColor: 'rgba(14, 165, 233, 0.4)' }]}>
                <FontAwesome5 name="rocket" size={24} color="#0EA5E9" />
              </View>
              <Text style={styles.bentoCardTitle}>Visual Block Masterclass</Text>
              <Text style={styles.bentoCardDesc}>
                Snap together colorful blocks to create code. It's like building with LEGOs, but for computer programs!
              </Text>
              <TouchableOpacity style={styles.bentoBtn} onPress={handleStartMission}>
                <Text style={styles.bentoBtnText}>Unlock Power</Text>
                <FontAwesome5 name="arrow-right" size={12} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* BENTO CARD 3: Create Games & Local Stories (Video 3) */}
          <View style={styles.bentoCard}>
            <Video
              source={require('../../assets/videos/video3.mp4')}
              style={StyleSheet.absoluteFill}
              resizeMode={ResizeMode.COVER}
              shouldPlay
              isLooping
              isMuted
            />
            <View style={styles.bentoDarkOverlay} />
            <View style={styles.bentoContent}>
              <View style={[styles.bentoIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.4)' }]}>
                <FontAwesome5 name="gamepad" size={24} color="#10B981" />
              </View>
              <Text style={styles.bentoCardTitle}>Create Games & Local Stories</Text>
              <Text style={styles.bentoCardDesc}>
                Design your own characters (Sprites), animate them, and share your adventures with the whole world.
              </Text>
            </View>
          </View>
        </View>

        {/* ──────────────────────────────────────────
            4. KIDOBOT COMPANION SECTION
        ────────────────────────────────────────── */}
        <View style={styles.kidoBotSection}>
          <View style={styles.shineBadge}>
            <Text style={styles.shineBadgeText}>KIDOBOT COMPANION</Text>
          </View>
          <Text style={styles.kidoBotTitle}>
            Meet Your <Text style={{ color: '#FACC15' }}>KidoBot</Text>{
}
            <Text style={{ color: '#0EA5E9' }}>AI Coding Partner</Text>
          </Text>
          <Text style={styles.kidoBotDesc}>
            Meet KidoBot, your premium interactive AI coding companion! He rides along with you on every programming quest, offering personalized hints and supporting you every step of the way.
          </Text>

          {/* Mascot Image */}
          <View style={styles.kidoBotImageWrap}>
            <Image
              source={require('../../assets/no_bg_output/kidobot.webp')}
              style={styles.kidoBotImg}
              resizeMode="contain"
            />
          </View>

          {/* Mini Cards */}
          <View style={styles.kidoBotCardsRow}>
            <View style={styles.kidoMiniCard}>
              <Text style={styles.kidoMiniTitle}>Co-Mentor</Text>
              <Text style={styles.kidoMiniDesc}>Helps complete the project when you are completely stuck.</Text>
            </View>
            <View style={styles.kidoMiniCard}>
              <Text style={[styles.kidoMiniTitle, { color: '#10B981' }]}>AI Hint</Text>
              <Text style={styles.kidoMiniDesc}>Guides kids block-by-block through the coding challenges.</Text>
            </View>
          </View>
        </View>

        {/* ──────────────────────────────────────────
            5. HOW IT WORKS SECTION (CODING WIZARD)
        ────────────────────────────────────────── */}
        <View style={styles.howSection}>
          <Text style={styles.howMainTitle}>
            <Text style={{ color: '#fff' }}>How to Become a</Text>{
}
            <Text style={{ color: '#8B5CF6' }}>Coding Wizard</Text>
          </Text>
          <Text style={styles.howSubtitle}>Forget boring lectures. In Kido Dev, you learn by doing.</Text>

          {/* 4 Steps */}
          <View style={styles.stepsList}>
            {HOW_STEPS.map((s, idx) => (
              <View key={idx} style={styles.stepCard}>
                <View style={[styles.stepNumCircle, { backgroundColor: s.color }]}>
                  <Text style={styles.stepNumText}>{s.num}</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>{s.title}</Text>
                  <Text style={styles.stepText}>{s.text}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ──────────────────────────────────────────
            6. SYLLABUS SECTION
        ────────────────────────────────────────── */}
        <View style={styles.syllabusSection}>
          <View style={styles.shineBadge}>
            <Text style={styles.shineBadgeText}>STRUCTURED CURRICULUM</Text>
          </View>
          <Text style={styles.syllabusTitle}>Built for Progressive Mastery</Text>
          <Text style={styles.syllabusSubtitle}>From foundational spatial algorithms to advanced game loops.</Text>

          <View style={styles.syllabusCardsList}>
            {SYLLABUS_LEVELS.map((lvl) => (
              <View key={lvl.level} style={[styles.syllabusCard, { borderColor: lvl.accent }]}>
                <View style={styles.syllabusCardTop}>
                  <View style={[styles.stepBadge, { backgroundColor: lvl.accent }]}>
                    <Text style={styles.stepBadgeText}>{lvl.badge}</Text>
                  </View>
                  <Text style={[styles.difficultyText, { color: lvl.accent }]}>{lvl.difficulty}</Text>
                </View>

                <Text style={styles.syllabusCardTitle}>{lvl.title}</Text>
                <Text style={styles.syllabusCardDesc}>{lvl.desc}</Text>

                <View style={styles.topicsRow}>
                  {lvl.topics.map((t, tidx) => (
                    <View key={tidx} style={styles.topicBadge}>
                      <FontAwesome5 name="check-circle" size={10} color={lvl.accent} />
                      <Text style={styles.topicBadgeText}>{t}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ──────────────────────────────────────────
            7. TEAM & LEADERSHIP SECTION
        ────────────────────────────────────────── */}
        <View style={styles.teamSection}>
          <Text style={styles.teamMainTitle}>Leadership & Academic Vision</Text>
          <Text style={styles.teamSubtitle}>
            World-class educators and architects dedicated to young creators.
          </Text>

          <View style={styles.teamList}>
            {TEAM_MEMBERS.map((m) => (
              <View key={m.id} style={[styles.teamCard, { borderColor: m.accent }]}>
                <Image source={m.image} style={styles.teamAvatar} resizeMode="contain" />
                <View style={styles.teamInfo}>
                  <View style={[styles.teamBadge, { backgroundColor: `${m.accent}25` }]}>
                    <Text style={[styles.teamBadgeText, { color: m.accent }]}>{m.badge}</Text>
                  </View>
                  <Text style={styles.teamName}>{m.name}</Text>
                  <Text style={styles.teamRole}>{m.role}</Text>
                  <Text style={styles.teamBio}>{m.bio}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ──────────────────────────────────────────
            8. FOOTER
        ────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Image source={assets.logo} style={styles.footerLogo} resizeMode="contain" />
          <Text style={styles.footerDesc}>
            Kido Dev is the gamified coding playground inspiring children to build, invent, and create with code.
          </Text>
          <View style={styles.footerLinksRow}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
              <Text style={styles.footerLink}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Levels')}>
              <Text style={styles.footerLink}>Levels</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GamesHub')}>
              <Text style={styles.footerLink}>Mini-Games</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Auth')}>
              <Text style={styles.footerLink}>Passport</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.copyrightText}>© 2026 Kido Dev • Code Nexus. All Rights Reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  wonderbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#070A13',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 110,
    height: 36,
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themePillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.4)',
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
  },
  themePillText: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '800',
  },
  menuBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  navCtaBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#0EA5E9',
  },
  navCtaText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-start',
  },
  drawerContent: {
    backgroundColor: '#0F172A',
    padding: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  drawerLogo: {
    width: 120,
    height: 38,
  },
  drawerLinks: {
    gap: 16,
  },
  drawerLinkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  drawerLinkIcon: {
    marginRight: 14,
    width: 24,
  },
  drawerLinkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  scrollBody: {
    paddingBottom: 40,
  },
  heroSection: {
    minHeight: 520,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  heroDarkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
  },
  heroContentWrapper: {
    alignItems: 'center',
    zIndex: 10,
    maxWidth: 600,
  },
  heroTaglinePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(14, 165, 233, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.4)',
    marginBottom: 18,
  },
  heroTaglineText: {
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: isTablet ? 54 : 36,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: isTablet ? 64 : 44,
    marginBottom: 28,
  },
  heroVibrantBtn: {
    borderRadius: 100,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },
  heroBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 36,
    paddingVertical: 18,
  },
  heroBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  featuresSection: {
    padding: 20,
    backgroundColor: '#070A13',
  },
  sectionHeaderCenter: {
    alignItems: 'center',
    marginBottom: 24,
  },
  shineBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(250, 204, 21, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.3)',
    marginBottom: 10,
  },
  shineBadgeText: {
    color: '#FACC15',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  featuresTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 34,
  },
  bentoCard: {
    height: 240,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  bentoDarkOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(15, 23, 42, 0.72)',
  },
  bentoContent: {
    padding: 20,
    zIndex: 2,
  },
  bentoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  bentoCardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 6,
  },
  bentoCardDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
  },
  bentoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  bentoBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
  kidoBotSection: {
    backgroundColor: '#0F172A',
    padding: 24,
    alignItems: 'center',
  },
  kidoBotTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 10,
  },
  kidoBotDesc: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: 500,
  },
  kidoBotImageWrap: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  kidoBotImg: {
    width: '100%',
    height: '100%',
  },
  kidoBotCardsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  kidoMiniCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  kidoMiniTitle: {
    color: '#0EA5E9',
    fontSize: 14,
    fontWeight: '900',
    marginBottom: 4,
  },
  kidoMiniDesc: {
    color: '#94A3B8',
    fontSize: 11,
    lineHeight: 15,
  },
  howSection: {
    backgroundColor: '#070A13',
    padding: 24,
  },
  howMainTitle: {
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 6,
  },
  howSubtitle: {
    color: '#94A3B8',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
  },
  stepsList: {
    gap: 14,
  },
  stepCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    gap: 14,
  },
  stepNumCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
    marginBottom: 4,
  },
  stepText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
  },
  syllabusSection: {
    backgroundColor: '#0F172A',
    padding: 24,
  },
  syllabusTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 4,
  },
  syllabusSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  syllabusCardsList: {
    gap: 14,
  },
  syllabusCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
  },
  syllabusCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  stepBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '900',
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  syllabusCardTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 4,
  },
  syllabusCardDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 12,
  },
  topicsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  topicBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  topicBadgeText: {
    color: '#E2E8F0',
    fontSize: 10,
    fontWeight: '600',
  },
  teamSection: {
    backgroundColor: '#070A13',
    padding: 24,
  },
  teamMainTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  teamList: {
    gap: 14,
  },
  teamCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 14,
  },
  teamAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  teamInfo: {
    flex: 1,
  },
  teamBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  teamBadgeText: {
    fontSize: 8,
    fontWeight: '900',
  },
  teamName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  teamRole: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
  },
  teamBio: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 15,
  },
  footer: {
    backgroundColor: '#05070E',
    padding: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  footerLogo: {
    width: 120,
    height: 40,
    marginBottom: 10,
  },
  footerDesc: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 17,
    marginBottom: 16,
    maxWidth: 400,
  },
  footerLinksRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  footerLink: {
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: '700',
  },
  copyrightText: {
    color: '#475569',
    fontSize: 10,
  },
});
