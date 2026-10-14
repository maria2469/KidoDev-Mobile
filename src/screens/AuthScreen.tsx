import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/NavigationTypes';

const { width } = Dimensions.get('window');

export const AuthScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { colors, assets } = useTheme();
  const { kidLogin, parentLogin } = useAuth();

  const [authType, setAuthType] = useState<'kid' | 'parent'>('kid');
  const [secretKey, setSecretKey] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleKidSubmit = async () => {
    if (!secretKey.trim()) {
      setError('Please enter your Secret Key to enter Playland!');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await kidLogin(secretKey);
    setLoading(false);
    if (result.success) {
      navigation.replace('Levels');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  const handleParentSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await parentLogin(email, password);
    setLoading(false);
    if (result.success) {
      navigation.replace('ParentDashboard');
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  return (
    <ImageBackground source={assets.login_bg} style={styles.bgImage} resizeMode="cover">
      <SafeAreaView style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardWrap}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
            {/* BACK BUTTON */}
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <FontAwesome5 name="arrow-left" size={16} color="#fff" />
              <Text style={styles.backBtnText}>Home</Text>
            </TouchableOpacity>

            {/* AUTH CARD */}
            <View style={[styles.authCard, { borderColor: colors.primary }]}>
              {/* CARD HEADER */}
              <View style={styles.headerWrap}>
                <View style={[styles.headerIconCircle, { backgroundColor: colors.primary }]}>
                  <FontAwesome5
                    name={authType === 'kid' ? 'gamepad' : 'user-shield'}
                    size={24}
                    color="#fff"
                  />
                </View>
                <Text style={styles.title}>
                  {authType === 'kid' ? 'Playland Passport' : 'Parent & School Login'}
                </Text>
                <Text style={styles.subtitle}>
                  {authType === 'kid'
                    ? 'Enter your magical secret key to start coding!'
                    : 'Manage your child or classroom progress.'}
                </Text>
              </View>

              {/* ROLE TOGGLE PILL */}
              <View style={styles.roleToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    authType === 'kid' && [styles.roleToggleActive, { backgroundColor: colors.primary }],
                  ]}
                  onPress={() => {
                    setAuthType('kid');
                    setError(null);
                  }}
                  activeOpacity={0.8}
                >
                  <FontAwesome5
                    name="gamepad"
                    size={14}
                    color={authType === 'kid' ? '#fff' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.roleToggleText,
                      authType === 'kid' && styles.roleToggleTextActive,
                    ]}
                  >
                    Kid Explorer
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.roleToggleBtn,
                    authType === 'parent' && [styles.roleToggleActive, { backgroundColor: colors.primary }],
                  ]}
                  onPress={() => {
                    setAuthType('parent');
                    setError(null);
                  }}
                  activeOpacity={0.8}
                >
                  <FontAwesome5
                    name="user-shield"
                    size={14}
                    color={authType === 'parent' ? '#fff' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.roleToggleText,
                      authType === 'parent' && styles.roleToggleTextActive,
                    ]}
                  >
                    Parent / School
                  </Text>
                </TouchableOpacity>
              </View>

              {/* ERROR ALERT */}
              {error && (
                <View style={styles.errorAlert}>
                  <FontAwesome5 name="exclamation-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* FORM FIELDS */}
              {authType === 'kid' ? (
                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>YOUR SECRET KEY</Text>
                  <View style={styles.inputWrap}>
                    <FontAwesome5 name="key" size={16} color={colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="e.g. STAR-982"
                      placeholderTextColor="#94A3B8"
                      value={secretKey}
                      onChangeText={setSecretKey}
                      autoCapitalize="characters"
                      autoCorrect={false}
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                    onPress={handleKidSubmit}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <FontAwesome5 name="rocket" size={18} color="#fff" />
                        <Text style={styles.submitBtnText}>LAUNCH PLAYLAND!</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.formSection}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                  <View style={styles.inputWrap}>
                    <FontAwesome5 name="envelope" size={16} color={colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="parent@example.com"
                      placeholderTextColor="#94A3B8"
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  </View>

                  <Text style={[styles.inputLabel, { marginTop: 14 }]}>PASSWORD</Text>
                  <View style={styles.inputWrap}>
                    <FontAwesome5 name="lock" size={16} color={colors.primary} style={styles.inputIcon} />
                    <TextInput
                      style={styles.textInput}
                      placeholder="••••••••"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry
                    />
                  </View>

                  <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: colors.primary }]}
                    onPress={handleParentSubmit}
                    disabled={loading}
                    activeOpacity={0.85}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <>
                        <FontAwesome5 name="sign-in-alt" size={18} color="#fff" />
                        <Text style={styles.submitBtnText}>LOG IN</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  keyboardWrap: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    borderWidth: 2,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    maxWidth: 460,
    width: '100%',
    alignSelf: 'center',
  },
  headerWrap: {
    alignItems: 'center',
    marginBottom: 18,
  },
  headerIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 25,
    padding: 4,
    marginBottom: 18,
  },
  roleToggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 20,
  },
  roleToggleActive: {
    elevation: 2,
  },
  roleToggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  roleToggleTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  errorAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: 14,
    marginBottom: 14,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  formSection: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 25,
    marginTop: 20,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
