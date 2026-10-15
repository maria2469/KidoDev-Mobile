import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';
import { supabase } from '../utils/supabaseClient';

export interface AvatarSkin {
  id: string;
  name: string;
  cost: number;
  unlocked: boolean;
  type: 'cogs' | 'stardust';
  emoji: string;
}

export const INITIAL_SKINS: AvatarSkin[] = [
  { id: 'cat_classic', name: 'Whiskers Cat', cost: 0, unlocked: true, type: 'cogs', emoji: '🐱' },
  { id: 'cat_ninja', name: 'Ninja Whiskers', cost: 100, unlocked: false, type: 'cogs', emoji: '🥷' },
  { id: 'cat_astro', name: 'Cosmic AstroCat', cost: 250, unlocked: false, type: 'cogs', emoji: '🚀' },
  { id: 'cat_wizard', name: 'Logic Wizard Cat', cost: 50, unlocked: false, type: 'stardust', emoji: '🧙‍♂️' },
  { id: 'cat_cyborg', name: 'Cyber KidoBot', cost: 100, unlocked: false, type: 'stardust', emoji: '🤖' },
];

interface GameContextType {
  cogs: number;
  stardust: number;
  streakDays: number;
  equippedSkin: string;
  skins: AvatarSkin[];
  soundEnabled: boolean;
  toggleSound: () => void;
  addReward: (xp: number, cogsEarned: number, stardustEarned?: number) => Promise<void>;
  buySkin: (skinId: string) => boolean;
  equipSkin: (skinId: string) => void;
  nextQuestId: string;
  setNextQuestId: (questId: string) => void;
}

const GameContext = createContext<GameContextType>({
  cogs: 150,
  stardust: 15,
  streakDays: 3,
  equippedSkin: 'cat_classic',
  skins: INITIAL_SKINS,
  soundEnabled: true,
  toggleSound: () => {},
  addReward: async () => {},
  buySkin: () => false,
  equipSkin: () => {},
  nextQuestId: 'L1P1',
  setNextQuestId: () => {},
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { childProfile } = useAuth();

  const [cogs, setCogs] = useState(150);
  const [stardust, setStardust] = useState(15);
  const [streakDays, setStreakDays] = useState(3);
  const [equippedSkin, setEquippedSkin] = useState('cat_classic');
  const [skins, setSkins] = useState<AvatarSkin[]>(INITIAL_SKINS);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [nextQuestId, setNextQuestId] = useState('L1P1');

  useEffect(() => {
    loadGameData();
  }, [childProfile]);

  const loadGameData = async () => {
    try {
      const savedCogs = await AsyncStorage.getItem('kido_game_cogs');
      const savedStardust = await AsyncStorage.getItem('kido_game_stardust');
      const savedStreak = await AsyncStorage.getItem('kido_game_streak');
      const savedSkin = await AsyncStorage.getItem('kido_game_equipped_skin');
      const savedSkinsList = await AsyncStorage.getItem('kido_game_unlocked_skins');
      const savedSound = await AsyncStorage.getItem('kido_game_sound');
      const savedQuest = await AsyncStorage.getItem('kido_game_next_quest');

      if (savedCogs) setCogs(Number(savedCogs));
      if (savedStardust) setStardust(Number(savedStardust));
      if (savedStreak) setStreakDays(Number(savedStreak));
      if (savedSkin) setEquippedSkin(savedSkin);
      if (savedSound !== null) setSoundEnabled(savedSound === 'true');
      if (savedQuest) setNextQuestId(savedQuest);

      if (savedSkinsList) {
        const unlockedIds: string[] = JSON.parse(savedSkinsList);
        setSkins((prev) =>
          prev.map((s) => (unlockedIds.includes(s.id) ? { ...s, unlocked: true } : s))
        );
      }

      // Check completions to find next unfinished quest
      if (childProfile?.id) {
        const { data } = await supabase
          .from('lesson_completions')
          .select('lesson_id, score')
          .eq('child_id', childProfile.id);

        if (data && data.length > 0) {
          const completedSet = new Set(
            data.filter((d: any) => d.score >= 40).map((d: any) => d.lesson_id)
          );
          // Find first uncompleted L1Px or L2Px
          for (let p = 1; p <= 10; p++) {
            const id = `L1P${p}`;
            if (!completedSet.has(id)) {
              setNextQuestId(id);
              break;
            }
          }
        }
      }
    } catch (e) {
      console.warn('Error loading game state:', e);
    }
  };

  const toggleSound = async () => {
    const nextVal = !soundEnabled;
    setSoundEnabled(nextVal);
    await AsyncStorage.setItem('kido_game_sound', String(nextVal));
  };

  const addReward = async (xp: number, cogsEarned: number, stardustEarned = 0) => {
    const newCogs = cogs + cogsEarned;
    const newStardust = stardust + stardustEarned;
    setCogs(newCogs);
    setStardust(newStardust);

    await AsyncStorage.setItem('kido_game_cogs', String(newCogs));
    await AsyncStorage.setItem('kido_game_stardust', String(newStardust));
  };

  const buySkin = (skinId: string): boolean => {
    const skin = skins.find((s) => s.id === skinId);
    if (!skin || skin.unlocked) return false;

    if (skin.type === 'cogs' && cogs >= skin.cost) {
      const newCogs = cogs - skin.cost;
      setCogs(newCogs);
      AsyncStorage.setItem('kido_game_cogs', String(newCogs));
    } else if (skin.type === 'stardust' && stardust >= skin.cost) {
      const newStardust = stardust - skin.cost;
      setStardust(newStardust);
      AsyncStorage.setItem('kido_game_stardust', String(newStardust));
    } else {
      return false; // Not enough balance
    }

    const updatedSkins = skins.map((s) => (s.id === skinId ? { ...s, unlocked: true } : s));
    setSkins(updatedSkins);
    const unlockedIds = updatedSkins.filter((s) => s.unlocked).map((s) => s.id);
    AsyncStorage.setItem('kido_game_unlocked_skins', JSON.stringify(unlockedIds));
    equipSkin(skinId);
    return true;
  };

  const equipSkin = (skinId: string) => {
    setEquippedSkin(skinId);
    AsyncStorage.setItem('kido_game_equipped_skin', skinId);
  };

  return (
    <GameContext.Provider
      value={{
        cogs,
        stardust,
        streakDays,
        equippedSkin,
        skins,
        soundEnabled,
        toggleSound,
        addReward,
        buySkin,
        equipSkin,
        nextQuestId,
        setNextQuestId,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
