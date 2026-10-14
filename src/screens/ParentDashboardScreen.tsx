import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const ParentDashboardScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors, assets, theme, toggleTheme } = useTheme();
  const { user, childProfile, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigation.replace('Home');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { backgroundColor: colors.navbar_bg }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="arrow-left" size={16} color="#fff" />
          <Text style={styles.backText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parent & Teacher Portal</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <FontAwesome5 name="sign-out-alt" size={16} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* STUDENT PROFILE CARD */}
        <View style={[styles.profileCard, { backgroundColor: colors.card_bg }]}>
          <Image source={assets.sprite_logo} style={styles.avatar} resizeMode="contain" />
          <View style={styles.profileText}>
            <Text style={styles.studentName}>
              {childProfile?.name || 'Explorer Student'}
            </Text>
            <Text style={styles.parentEmail}>{user?.email || 'Logged in Account'}</Text>
            <View style={styles.keyBadge}>
              <FontAwesome5 name="key" size={10} color={colors.primary} />
              <Text style={[styles.keyText, { color: colors.primary }]}>
                Secret Key: {childProfile?.secret_key || 'KIDO-882'}
              </Text>
            </View>
          </View>
        </View>

        {/* STATS OVERVIEW */}
        <Text style={styles.sectionTitle}>Learning Highlights</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statBox, { backgroundColor: colors.card_bg }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#FEF3C7' }]}>
              <FontAwesome5 name="star" size={20} color="#D97706" />
            </View>
            <Text style={styles.statNumber}>18</Text>
            <Text style={styles.statLabel}>Stars Earned</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.card_bg }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#E0F2FE' }]}>
              <FontAwesome5 name="trophy" size={20} color="#0284C7" />
            </View>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Quests Solved</Text>
          </View>

          <View style={[styles.statBox, { backgroundColor: colors.card_bg }]}>
            <View style={[styles.statIconWrap, { backgroundColor: '#DCFCE7' }]}>
              <FontAwesome5 name="bolt" size={20} color="#16A34A" />
            </View>
            <Text style={styles.statNumber}>240</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
        </View>

        {/* SETTINGS & THEME TOGGLE */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Preferences & Customization</Text>
        <View style={[styles.settingsCard, { backgroundColor: colors.card_bg }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLabelGroup}>
              <FontAwesome5 name="palette" size={18} color={colors.primary} />
              <View>
                <Text style={styles.settingTitle}>Child World Theme</Text>
                <Text style={styles.settingSub}>Switch between Forest Nature & Aqua Barbie</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.themePill, { backgroundColor: colors.primary }]}
              onPress={toggleTheme}
            >
              <Text style={styles.themePillText}>{theme.toUpperCase()}</Text>
            </TouchableOpacity>
          </View>
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
  logoutBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    padding: 8,
    borderRadius: 12,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 20,
    gap: 14,
    elevation: 3,
  },
  avatar: {
    width: 65,
    height: 65,
  },
  profileText: {
    flex: 1,
  },
  studentName: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
  },
  parentEmail: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 6,
  },
  keyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F1F5F9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  keyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    elevation: 2,
  },
  statIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
    marginTop: 2,
  },
  settingsCard: {
    padding: 16,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  settingSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  themePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
  },
  themePillText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },
});
