export type RootStackParamList = {
  Home: undefined;
  Auth: undefined;
  Levels: { levelId?: string } | undefined;
  MagicStudio: {
    lessonId: string;
    lessonTitle?: string;
    objective?: string;
    classLevel?: number;
  };
  GamesHub: undefined;
  ParentDashboard: undefined;
};
