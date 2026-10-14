import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const GAMES = [
  {
    id: 'catch-donut',
    title: 'Catch the Donut',
    desc: 'Test your X & Y coordinate reflexes! Catch delicious treats falling from the sky.',
    icon: 'cookie-bite',
    color: '#EC4899',
    badge: 'COORDINATES',
  },
  {
    id: 'loop-runner',
    title: 'Loop Runner',
    desc: 'Jump over obstacles using repetition loops! Perfect timing is the key.',
    icon: 'running',
    color: '#0EA5E9',
    badge: 'LOOPS',
  },
  {
    id: 'coin-maze',
    title: 'Coin Maze Explorer',
    desc: 'Navigate the grid maze and collect all gold coins before the timer runs out.',
    icon: 'coins',
    color: '#F59E0B',
    badge: 'ALGORITHMS',
  },
  {
    id: 'traffic-patrol',
    title: 'Traffic Patrol',
    desc: 'Control traffic lights with boolean conditions to keep the vehicles moving safely.',
    icon: 'traffic-light',
    color: '#10B981',
    badge: 'IF / ELSE',
  },
  {
    id: 'balloon-pop',
    title: 'Balloon Pop Math',
    desc: 'Pop balloons matching variable conditions and score maximum combos!',
    icon: 'bullseye',
    color: '#8B5CF6',
    badge: 'VARIABLES',
  },
];

export const GamesHubScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, assets } = useTheme();
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.navbar_bg }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={16} color="#fff" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mini-Games Hub</Text>
        <View style={styles.gamePadWrap}>
          <FontAwesome5 name="gamepad" size={18} color="#FFD000" />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Image source={assets.hero} style={styles.bannerChar} resizeMode="contain" />
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>Sharpen Your Coding Skills!</Text>
            <Text style={styles.bannerSub}>Play fun arcade games that strengthen your computational thinking.</Text>
          </View>
        </View>

        {/* GAMES LIST */}
        <View style={styles.gamesList}>
          {GAMES.map((game) => (
            <TouchableOpacity
              key={game.id}
              style={[styles.gameCard, { backgroundColor: colors.card_bg }]}
              onPress={() => setActiveGame(game.title)}
              activeOpacity={0.88}
            >
              <View style={[styles.gameIconBox, { backgroundColor: game.color }]}>
                <FontAwesome5 name={game.icon} size={28} color="#fff" />
              </View>

              <View style={styles.gameInfo}>
                <View style={[styles.skillBadge, { backgroundColor: `${game.color}22` }]}>
                  <Text style={[styles.skillBadgeText, { color: game.color }]}>{game.badge}</Text>
                </View>
                <Text style={styles.gameTitle}>{game.title}</Text>
                <Text style={styles.gameDesc}>{game.desc}</Text>
              </View>

              <View style={[styles.playBtn, { backgroundColor: game.color }]}>
                <FontAwesome5 name="play" size={14} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  backText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
  },
  gamePadWrap: {
    padding: 6,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#0EA5E9',
    borderRadius: 24,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  bannerChar: {
    width: 65,
    height: 65,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '900',
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 11,
    marginTop: 2,
  },
  gamesList: {
    gap: 14,
  },
  gameCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  gameIconBox: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  gameInfo: {
    flex: 1,
  },
  skillBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  skillBadgeText: {
    fontSize: 9,
    fontWeight: '900',
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  gameDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 16,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});
