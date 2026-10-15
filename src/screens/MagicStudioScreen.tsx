import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { curriculum } from '../data/curriculum';
import { evaluateCode, saveProgress, GradeResult } from '../utils/grader';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const BLOCKLY_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://unpkg.com/blockly/blockly.min.js"></script>
  <style>
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #F8FAFC;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      user-select: none;
    }
    #blocklyDiv {
      width: 100%;
      height: 100%;
    }
    /* Blocks Palette (Bottom-Left) */
    .blocklyToolboxDiv {
      background-color: #FFFFFF !important;
      border-right: 2px solid #E2E8F0 !important;
      box-shadow: 2px 0 8px rgba(0,0,0,0.03);
      min-width: 90px;
    }
    .blocklyTreeLabel {
      font-size: 11px !important;
      font-weight: 800 !important;
      letter-spacing: 0.3px;
    }
    .blocklyTreeRow {
      padding: 6px 8px !important;
      margin: 2px 4px !important;
      border-radius: 8px !important;
      height: auto !important;
    }
    .blocklyFlyout {
      border-right: 2px solid #E2E8F0;
    }
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    ::-webkit-scrollbar-thumb {
      background: #CBD5E1;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div id="blocklyDiv"></div>
  <xml id="toolbox" style="display: none">
    <category name="Events" colour="#FFD500">
      <block type="s_when_flag"></block>
      <block type="s_when_clicked"></block>
    </category>
    <category name="Motion" colour="#4C97FF">
      <block type="s_move">
        <value name="STEPS">
          <shadow type="math_number"><field name="NUM">200</field></shadow>
        </value>
      </block>
      <block type="s_change_y">
        <value name="Y">
          <shadow type="math_number"><field name="NUM">50</field></shadow>
        </value>
      </block>
      <block type="s_change_x">
        <value name="X">
          <shadow type="math_number"><field name="NUM">50</field></shadow>
        </value>
      </block>
      <block type="s_turn_r">
        <value name="DEGREES">
          <shadow type="math_number"><field name="NUM">15</field></shadow>
        </value>
      </block>
      <block type="s_turn_l">
        <value name="DEGREES">
          <shadow type="math_number"><field name="NUM">15</field></shadow>
        </value>
      </block>
    </category>
    <category name="Looks" colour="#9966FF">
      <block type="s_say">
        <value name="MESSAGE">
          <shadow type="text"><field name="TEXT">Hello!</field></shadow>
        </value>
      </block>
    </category>
    <category name="Sound" colour="#D65CD6">
      <block type="s_play_sound">
        <field name="SOUND_MENU">Meow</field>
      </block>
    </category>
    <category name="Control" colour="#FFAB19">
      <block type="s_repeat">
        <value name="TIMES">
          <shadow type="math_number"><field name="NUM">5</field></shadow>
        </value>
      </block>
      <block type="s_wait">
        <value name="SECS">
          <shadow type="math_number"><field name="NUM">1</field></shadow>
        </value>
      </block>
    </category>
  </xml>

  <script>
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "s_when_flag",
        "message0": "when %1 clicked",
        "args0": [{ "type": "field_image", "src": "https://img.icons8.com/color/48/flag.png", "width": 18, "height": 18, "alt": "flag" }],
        "nextStatement": null,
        "colour": "#FFBF00"
      },
      {
        "type": "s_when_clicked",
        "message0": "when sprite clicked",
        "nextStatement": null,
        "colour": "#FFBF00"
      },
      {
        "type": "s_move",
        "message0": "move %1 steps",
        "args0": [{ "type": "input_value", "name": "STEPS", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "s_change_y",
        "message0": "change y by %1",
        "args0": [{ "type": "input_value", "name": "Y", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "s_change_x",
        "message0": "change x by %1",
        "args0": [{ "type": "input_value", "name": "X", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "s_turn_r",
        "message0": "turn right %1 deg",
        "args0": [{ "type": "input_value", "name": "DEGREES", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "s_turn_l",
        "message0": "turn left %1 deg",
        "args0": [{ "type": "input_value", "name": "DEGREES", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "s_say",
        "message0": "say %1",
        "args0": [{ "type": "input_value", "name": "MESSAGE" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#9966FF"
      },
      {
        "type": "s_play_sound",
        "message0": "play sound %1",
        "args0": [
          {
            "type": "field_dropdown",
            "name": "SOUND_MENU",
            "options": [["Meow", "Meow"], ["Cheer", "Cheer"], ["Pop", "Pop"]]
          }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#D65CD6"
      },
      {
        "type": "s_repeat",
        "message0": "repeat %1 %2 %3",
        "args0": [
          { "type": "input_value", "name": "TIMES", "check": "Number" },
          { "type": "input_dummy" },
          { "type": "input_statement", "name": "DO" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#FFAB19"
      },
      {
        "type": "s_wait",
        "message0": "wait %1 secs",
        "args0": [{ "type": "input_value", "name": "SECS", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#FFAB19"
      }
    ]);

    var workspace = Blockly.inject('blocklyDiv', {
      toolbox: document.getElementById('toolbox'),
      scrollbars: true,
      trashcan: true,
      zoom: {
        controls: true,
        wheel: true,
        startScale: 0.74,
        maxScale: 1.5,
        minScale: 0.4,
        scaleSpeed: 1.1
      },
      grid: {
        spacing: 18,
        length: 3,
        colour: '#CBD5E1',
        snap: true
      }
    });

    workspace.addChangeListener(function(e) {
      if (window.ReactNativeWebView) {
        var blocks = workspace.getAllBlocks(false).map(function(b) { return b.type; });
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'WORKSPACE_CHANGE',
          blockCount: blocks.length
        }));
      }
    });

    window.runCode = function() {
      var xmlDom = Blockly.Xml.workspaceToDom(workspace);
      var xmlText = Blockly.Xml.domToText(xmlDom);
      var blocks = workspace.getAllBlocks(false).map(function(b) {
        var fields = {};
        for (var i = 0; i < b.inputList.length; i++) {
          var input = b.inputList[i];
          for (var j = 0; j < input.fieldRow.length; j++) {
            var f = input.fieldRow[j];
            if (f.name) fields[f.name] = f.getValue();
          }
        }
        return { type: b.type, fields: fields };
      });

      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'RUN',
          blocks: blocks,
          xml: xmlText
        }));
      }
    };

    window.clearWorkspace = function() {
      workspace.clear();
    };
  </script>
</body>
</html>
`;

export const MagicStudioScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors, assets } = useTheme();
  const { childProfile } = useAuth();

  // Normalize lesson ID (e.g. L1P1 or level-1-1 -> L1P1)
  const rawId = route.params?.lessonId || 'L1P1';
  const lessonId = useMemo(() => {
    const clean = String(rawId).toUpperCase();
    const match = clean.match(/LEVEL-(\d+)-(\d+)/);
    if (match) return `L${match[1]}P${match[2]}`;
    return clean;
  }, [rawId]);

  // Find exact lesson definition from curriculum
  const lesson = useMemo(() => {
    for (const lvl of curriculum) {
      const found = lvl.projects.find((p) => p.id === lessonId);
      if (found) return found;
    }
    return curriculum[0].projects[0];
  }, [lessonId]);

  const webViewRef = useRef<WebView>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [blockCount, setBlockCount] = useState(0);
  const [coordX, setCoordX] = useState(0);

  const spriteX = useRef(new Animated.Value(0)).current;
  const spriteRotate = useRef(new Animated.Value(0)).current;

  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    const id = spriteX.addListener(({ value }) => {
      setCoordX(Math.round(value));
    });
    return () => {
      spriteX.removeListener(id);
    };
  }, [spriteX]);

  const handleMessage = async (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'RUN') {
        await executeAndGrade(data.blocks, data.xml);
      } else if (data.type === 'WORKSPACE_CHANGE') {
        setBlockCount(data.blockCount || 0);
      }
    } catch (e) {
      console.warn('WebView message error', e);
    }
  };

  const executeAndGrade = async (blocks: any[], xml: string) => {
    setIsRunning(true);
    setSpeechBubble(null);

    // 1. Grade the code using the exact web version grading engine
    const grade = await evaluateCode(lessonId, blocks, xml);
    setGradeResult(grade);

    // 2. Persist to database (lesson_completions & child_profiles)
    if (childProfile?.id && grade.score > 0) {
      saveProgress({
        childId: childProfile.id,
        lessonId,
        score: grade.score,
        badge: grade.badge,
        xpEarned: grade.xpEarned,
      });
    }

    // 3. Animate Sprite on top Live Stage
    const moveAmount = grade.score >= 40 ? 70 : 25;

    Animated.sequence([
      Animated.timing(spriteX, {
        toValue: moveAmount,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(spriteRotate, {
        toValue: grade.score >= 70 ? 1 : 0.5,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (grade.score >= 80) {
        setSpeechBubble('Yum! Reached the dinner bowl!');
      } else if (grade.score >= 40) {
        setSpeechBubble('Almost there!');
      } else {
        setSpeechBubble('Hmm, need more steps!');
      }

      setIsRunning(false);

      // Trigger completion modal after brief delay
      setTimeout(() => {
        setShowCompleteModal(true);
      }, 1200);
    });
  };

  const handleGreenFlag = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.runCode(); true;');
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setSpeechBubble(null);
    spriteX.setValue(0);
    spriteRotate.setValue(0);
  };

  const handleResetStage = () => {
    handleStop();
    spriteX.setValue(0);
    spriteRotate.setValue(0);
  };

  const spin = spriteRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* STUDIO TOPBAR */}
      <View style={[styles.topBar, { backgroundColor: colors.navbar_bg }]}>
        <TouchableOpacity style={styles.topBackBtn} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={13} color="#fff" />
          <Text style={styles.topBackText}>Quests</Text>
        </TouchableOpacity>

        <View style={styles.lessonTitleWrap}>
          <FontAwesome5 name="gamepad" size={12} color="#FFD000" />
          <Text style={styles.lessonTitleText} numberOfLines={1}>
            {lessonId}: {lesson.title}
          </Text>
        </View>

        {/* TOPBAR RUN / STOP CONTROLS */}
        <View style={styles.runControls}>
          <TouchableOpacity
            style={[styles.flagBtn, { backgroundColor: '#10B981' }]}
            onPress={handleGreenFlag}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="flag" size={13} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stopBtn, { backgroundColor: '#EF4444' }]}
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="stop" size={13} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* COMBINED SCREEN: TOP LIVE STAGE + BOTTOM BLOCKS & CODE WORKSPACE */}
      <View style={styles.mainContainer}>
        {/* ============================================================ */}
        {/* TOP HALF: LIVE STAGE                                         */}
        {/* ============================================================ */}
        <View style={styles.stagePane}>
          {/* Stage Header Info */}
          <View style={styles.stageHeader}>
            <View style={styles.stageHeaderLeft}>
              <View style={styles.stageLiveBadge}>
                <FontAwesome5 name="play-circle" size={11} color="#6366F1" />
                <Text style={styles.stageLiveBadgeText}>LIVE STAGE</Text>
              </View>
              {isRunning ? (
                <View style={styles.liveIndicator}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>RUNNING</Text>
                </View>
              ) : (
                <View style={styles.readyIndicator}>
                  <Text style={styles.readyText}>READY</Text>
                </View>
              )}
            </View>

            <View style={styles.stageHeaderActions}>
              <TouchableOpacity
                style={styles.stageActionBtn}
                onPress={handleResetStage}
                activeOpacity={0.7}
              >
                <FontAwesome5 name="redo-alt" size={11} color="#64748B" />
                <Text style={styles.stageActionText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stage Screen Box */}
          <View style={styles.stageCanvasBox}>
            <View style={styles.stageFloorLine} />

            {/* SPEECH BUBBLE */}
            {speechBubble && (
              <View style={styles.speechBubble}>
                <Text style={styles.speechText}>{speechBubble}</Text>
                <View style={styles.speechTail} />
              </View>
            )}

            {/* SPRITE CHARACTER (CAT / HERO) */}
            <Animated.View
              style={[
                styles.spriteWrapper,
                {
                  transform: [
                    { translateX: spriteX },
                    { rotate: spin },
                  ],
                },
              ]}
            >
              <Image source={assets.sprite_logo} style={styles.spriteImg} resizeMode="contain" />
            </Animated.View>

            {/* Coordinate Pill in bottom corner */}
            <View style={styles.coordPill}>
              <Text style={styles.coordText}>X: {coordX}  Y: 0</Text>
            </View>
          </View>

          {/* AI TUTOR HINT: EXACT MISSION OBJECTIVE FROM CURRICULUM */}
          <View style={styles.tutorHintBar}>
            <View style={styles.tutorIconWrap}>
              <FontAwesome5 name="lightbulb" size={11} color="#8B5CF6" />
            </View>
            <Text style={styles.tutorMessage} numberOfLines={1}>
              {lesson.steps?.[0]?.desc || lesson.objective || "Snap 'when flag clicked' then attach 'move 200 steps'!"}
            </Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* BOTTOM HALF DIVIDER: BLOCKS (LEFT) & CODE EDITOR (RIGHT)     */}
        {/* ============================================================ */}
        <View style={styles.workspaceDividerBar}>
          <View style={styles.dividerColLeft}>
            <FontAwesome5 name="puzzle-piece" size={11} color="#3B82F6" />
            <Text style={styles.dividerColTitle}>BLOCKS</Text>
            <Text style={styles.dividerColSub}>(Palette)</Text>
          </View>

          <View style={styles.dividerCenterPill}>
            <Text style={styles.dividerCenterText}>{blockCount} Blocks</Text>
          </View>

          <View style={styles.dividerColRight}>
            <FontAwesome5 name="code" size={11} color="#10B981" />
            <Text style={styles.dividerColTitle}>CODE EDITOR</Text>
            <Text style={styles.dividerColSub}>(Canvas)</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* BOTTOM HALF: BLOCKLY WORKSPACE                               */}
        {/* ============================================================ */}
        <View style={styles.workspacePane}>
          <WebView
            ref={webViewRef}
            originWhitelist={['*']}
            source={{ html: BLOCKLY_HTML }}
            style={styles.webView}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onMessage={handleMessage}
          />
        </View>
      </View>

      {/* LEVEL COMPLETE WIN MODAL (EXACT WEB CRITERIA & SCORING) */}
      <Modal visible={showCompleteModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.winCard}>
            <View
              style={[
                styles.winTrophyCircle,
                { backgroundColor: (gradeResult?.score || 0) >= 70 ? '#FEF9C3' : '#F1F5F9' },
              ]}
            >
              <FontAwesome5
                name={(gradeResult?.score || 0) >= 40 ? 'trophy' : 'redo'}
                size={34}
                color={(gradeResult?.score || 0) >= 70 ? '#FFD000' : '#64748B'}
              />
            </View>

            <Text style={styles.winTitle}>
              {(gradeResult?.score || 0) >= 40 ? 'Quest Complete!' : 'Try Again!'}
            </Text>

            {/* SCORE PERCENTAGE */}
            <View style={styles.scorePill}>
              <Text style={styles.scorePillText}>
                Score: {gradeResult?.score || 0}% • {gradeResult?.badge || 'Participant'}
              </Text>
            </View>

            {/* 3 STAR RATING ROW */}
            <View style={styles.winStarsRow}>
              <FontAwesome5
                name="star"
                size={28}
                color={(gradeResult?.stars || 0) >= 1 ? '#FFD000' : '#E2E8F0'}
                solid={(gradeResult?.stars || 0) >= 1}
              />
              <FontAwesome5
                name="star"
                size={36}
                color={(gradeResult?.stars || 0) >= 2 ? '#FFD000' : '#E2E8F0'}
                solid={(gradeResult?.stars || 0) >= 2}
              />
              <FontAwesome5
                name="star"
                size={28}
                color={(gradeResult?.stars || 0) >= 3 ? '#FFD000' : '#E2E8F0'}
                solid={(gradeResult?.stars || 0) >= 3}
              />
            </View>

            {/* XP REWARD BADGE */}
            {(gradeResult?.xpEarned || 0) > 0 && (
              <View style={styles.winXpPill}>
                <FontAwesome5 name="bolt" size={11} color="#D97706" />
                <Text style={styles.winXpText}>+{gradeResult?.xpEarned} XP EARNED</Text>
              </View>
            )}

            {/* AI TUTOR FEEDBACK */}
            <Text style={styles.winSubtitle}>{gradeResult?.feedback}</Text>

            <TouchableOpacity
              style={[
                styles.nextLevelBtn,
                { backgroundColor: (gradeResult?.score || 0) >= 40 ? colors.primary : '#3B82F6' },
              ]}
              onPress={() => {
                setShowCompleteModal(false);
                navigation.navigate('Levels');
              }}
            >
              <Text style={styles.nextLevelBtnText}>
                {(gradeResult?.score || 0) >= 40 ? 'CONTINUE ADVENTURE' : 'RETRY MISSION'}
              </Text>
              <FontAwesome5 name="arrow-right" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  topBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topBackText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  lessonTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    maxWidth: width * 0.45,
  },
  lessonTitleText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  runControls: {
    flexDirection: 'row',
    gap: 8,
  },
  flagBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  stopBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  stagePane: {
    height: isTablet ? 320 : 230,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageLiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stageLiveBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#6366F1',
    letterSpacing: 0.4,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#16A34A',
  },
  liveText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#16A34A',
  },
  readyIndicator: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  readyText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
  },
  stageHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  stageActionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  stageCanvasBox: {
    flex: 1,
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  stageFloorLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#E0F2FE',
    borderTopWidth: 1.5,
    borderTopColor: '#BAE6FD',
  },
  speechBubble: {
    position: 'absolute',
    top: 14,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#0F172A',
    elevation: 3,
    zIndex: 10,
  },
  speechText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
  },
  speechTail: {
    position: 'absolute',
    bottom: -5,
    left: '50%',
    marginLeft: -4,
    width: 7,
    height: 7,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 1.5,
    borderBottomWidth: 1.5,
    borderColor: '#0F172A',
    transform: [{ rotate: '45deg' }],
  },
  spriteWrapper: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  spriteImg: {
    width: '100%',
    height: '100%',
  },
  coordPill: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  coordText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0284C7',
  },
  tutorHintBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF5FF',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 5,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E9D5FF',
  },
  tutorIconWrap: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tutorMessage: {
    flex: 1,
    fontSize: 10,
    color: '#6B21A8',
    fontWeight: '700',
  },
  workspaceDividerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dividerColLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dividerColTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#334155',
    letterSpacing: 0.3,
  },
  dividerColSub: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  dividerCenterPill: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  dividerCenterText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563EB',
  },
  dividerColRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  workspacePane: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  winCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
    elevation: 8,
  },
  winTrophyCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  winTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  scorePill: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
    marginBottom: 10,
  },
  scorePillText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4F46E5',
  },
  winSubtitle: {
    fontSize: 12,
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
    lineHeight: 16,
  },
  winStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  winXpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 8,
  },
  winXpText: {
    color: '#D97706',
    fontWeight: '900',
    fontSize: 12,
  },
  nextLevelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    width: '100%',
  },
  nextLevelBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },
});
