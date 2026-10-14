import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabaseClient';

export interface ThemeColors {
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  navbar_bg: string;
  navbar_text: string;
  node_font_color: string;
  badge_unlocked_bg: string;
  badge_locked_bg: string;
  badge_unlocked_text: string;
  badge_locked_text: string;
  stone_title_color: string;
  stone_progress_color: string;
  stone_xp_text_color: string;
  stone_label_color: string;
  stone_missions_color: string;
  stone_mastery_color: string;
  background: string;
  card_bg: string;
  text_dark: string;
  text_muted: string;
}

export interface ThemeAssets {
  logo: any;
  sprite_logo: any;
  hero: any;
  levels_stone: any;
  levels_hero: any;
  levels_line: any;
  levels_node: any;
  levels_image: any;
  xp_badge: any;
  rank_badge: any;
  missions_badge: any;
  login_bg: any;
}

export const THEME_CONFIGS: Record<string, { colors: ThemeColors; assets: ThemeAssets }> = {
  forest: {
    colors: {
      name: 'Forest',
      primary: '#4CAF50',
      secondary: '#FFC107',
      accent: '#FF5722',
      navbar_bg: 'rgba(13, 27, 13, 0.95)',
      navbar_text: '#FFFFFF',
      node_font_color: '#FFFFFF',
      badge_unlocked_bg: '#4CAF50',
      badge_locked_bg: '#F44336',
      badge_unlocked_text: '#FFFFFF',
      badge_locked_text: '#FFFFFF',
      stone_title_color: '#FF5722',
      stone_progress_color: '#4CAF50',
      stone_xp_text_color: '#E65100',
      stone_label_color: '#5D4037',
      stone_missions_color: '#212121',
      stone_mastery_color: '#8D6E63',
      background: '#F0FDF4',
      card_bg: '#FFFFFF',
      text_dark: '#0F172A',
      text_muted: '#64748B',
    },
    assets: {
      logo: require('../../assets/images/logo.png'),
      sprite_logo: require('../../assets/no_bg_output/sprite-logo_nobg.webp'),
      hero: require('../../assets/no_bg_output/hero_nobg.webp'),
      levels_stone: require('../../assets/no_bg_output/levels_stone_nobg.webp'),
      levels_hero: require('../../assets/no_bg_output/levels_hero_nobg.webp'),
      levels_line: require('../../assets/no_bg_output/levels_line_nobg.webp'),
      levels_node: require('../../assets/no_bg_output/level_node_nobg.webp'),
      levels_image: require('../../assets/no_bg_output/levels_image_nobg.webp'),
      xp_badge: require('../../assets/no_bg_output/level_selection_xp.webp'),
      rank_badge: require('../../assets/no_bg_output/level_selection_rank.webp'),
      missions_badge: require('../../assets/no_bg_output/level_selection_missions.webp'),
      login_bg: require('../../assets/no_bg_output/loginbg.webp'),
    },
  },
  aqua: {
    colors: {
      name: 'Aqua',
      primary: '#06B6D4',
      secondary: '#0EA5E9',
      accent: '#00F5D4',
      navbar_bg: 'rgba(8, 47, 73, 0.95)',
      navbar_text: '#FFFFFF',
      node_font_color: '#FFFFFF',
      badge_unlocked_bg: '#06B6D4',
      badge_locked_bg: '#E0F2FE',
      badge_unlocked_text: '#FFFFFF',
      badge_locked_text: '#0369A1',
      stone_title_color: '#0284C7',
      stone_progress_color: '#06B6D4',
      stone_xp_text_color: '#0284C7',
      stone_label_color: '#0C4A6E',
      stone_missions_color: '#0369A1',
      stone_mastery_color: '#0284C7',
      background: '#F0F9FF',
      card_bg: '#FFFFFF',
      text_dark: '#0F172A',
      text_muted: '#64748B',
    },
    assets: {
      logo: require('../../assets/images/logo.png'),
      sprite_logo: require('../../assets/no_bg_output/sprite-logo_nobg.webp'),
      hero: require('../../assets/no_bg_output/princess_levels_hero_nobg.webp'),
      levels_stone: require('../../assets/no_bg_output/princess_levels_stone_nobg.webp'),
      levels_hero: require('../../assets/images/aquamainimg.png'),
      levels_line: require('../../assets/no_bg_output/priness_levels_line_nobg.png'),
      levels_node: require('../../assets/no_bg_output/princess_level_node_nobg.png'),
      levels_image: require('../../assets/no_bg_output/princess_level_image_nobg.webp'),
      xp_badge: require('../../assets/no_bg_output/level_selection_xp_barbie.png'),
      rank_badge: require('../../assets/no_bg_output/level_selection_rank_barbie.png'),
      missions_badge: require('../../assets/no_bg_output/level_selection_missions_barbie.png'),
      login_bg: require('../../assets/no_bg_output/loginbgbarbie.webp'),
    },
  },
};

interface ThemeContextType {
  theme: string;
  colors: ThemeColors;
  assets: ThemeAssets;
  toggleTheme: () => void;
  setThemeName: (name: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'forest',
  colors: THEME_CONFIGS.forest.colors,
  assets: THEME_CONFIGS.forest.assets,
  toggleTheme: () => {},
  setThemeName: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<string>('forest');

  useEffect(() => {
    AsyncStorage.getItem('kido_theme').then((saved) => {
      if (saved && THEME_CONFIGS[saved]) {
        setTheme(saved);
      }
    });
  }, []);

  const setThemeName = async (name: string) => {
    if (!THEME_CONFIGS[name]) return;
    setTheme(name);
    await AsyncStorage.setItem('kido_theme', name);

    // Sync with remote supabase if logged in
    try {
      const childId = await AsyncStorage.getItem('kido_child_id');
      const role = await AsyncStorage.getItem('kido_auth_role');
      if (role === 'kid' && childId) {
        await supabase.from('children').update({ theme: name }).eq('id', childId);
      }
    } catch (e) {
      console.warn('Failed to sync theme with Supabase', e);
    }
  };

  const toggleTheme = () => {
    const next = theme === 'forest' ? 'aqua' : 'forest';
    setThemeName(next);
  };

  const currentConfig = THEME_CONFIGS[theme] || THEME_CONFIGS.forest;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: currentConfig.colors,
        assets: currentConfig.assets,
        toggleTheme,
        setThemeName,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
