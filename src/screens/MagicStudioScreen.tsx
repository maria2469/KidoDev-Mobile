import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/NavigationTypes';

const { width, height } = Dimensions.get('window');
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
    /* Scrollbars */
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
    <category name="Motion" colour="#4C97FF">
      <block type="motion_movesteps">
        <value name="STEPS">
          <shadow type="math_number"><field name="NUM">10</field></shadow>
        </value>
      </block>
      <block type="motion_turnright">
        <value name="DEGREES">
          <shadow type="math_number"><field name="NUM">15</field></shadow>
        </value>
      </block>
      <block type="motion_turnleft">
        <value name="DEGREES">
          <shadow type="math_number"><field name="NUM">15</field></shadow>
        </value>
      </block>
    </category>
    <category name="Looks" colour="#9966FF">
      <block type="looks_sayforsecs">
        <value name="MESSAGE">
          <shadow type="text"><field name="TEXT">Hello World!</field></shadow>
        </value>
        <value name="SECS">
          <shadow type="math_number"><field name="NUM">2</field></shadow>
        </value>
      </block>
      <block type="looks_say">
        <value name="MESSAGE">
          <shadow type="text"><field name="TEXT">Hello!</field></shadow>
        </value>
      </block>
    </category>
    <category name="Sound" colour="#D65CD6">
      <block type="sound_playuntildone">
        <field name="SOUND_MENU">Meow</field>
      </block>
    </category>
    <category name="Events" colour="#FFD500">
      <block type="event_whenflagclicked"></block>
      <block type="event_whenthisspriteclicked"></block>
    </category>
    <category name="Control" colour="#FFAB19">
      <block type="control_repeat">
        <value name="TIMES">
          <shadow type="math_number"><field name="NUM">10</field></shadow>
        </value>
      </block>
    </category>
  </xml>

  <script>
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "event_whenflagclicked",
        "message0": "when %1 clicked",
        "args0": [{ "type": "field_image", "src": "https://img.icons8.com/color/48/flag.png", "width": 18, "height": 18, "alt": "flag" }],
        "nextStatement": null,
        "colour": "#FFBF00"
      },
      {
        "type": "event_whenthisspriteclicked",
        "message0": "when sprite clicked",
        "nextStatement": null,
        "colour": "#FFBF00"
      },
      {
        "type": "motion_movesteps",
        "message0": "move %1 steps",
        "args0": [{ "type": "input_value", "name": "STEPS", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "motion_turnright",
        "message0": "turn right %1 deg",
        "args0": [{ "type": "input_value", "name": "DEGREES", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "motion_turnleft",
        "message0": "turn left %1 deg",
        "args0": [{ "type": "input_value", "name": "DEGREES", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "looks_sayforsecs",
        "message0": "say %1 for %2s",
        "args0": [
          { "type": "input_value", "name": "MESSAGE" },
          { "type": "input_value", "name": "SECS", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#9966FF"
      },
      {
        "type": "looks_say",
        "message0": "say %1",
        "args0": [
          { "type": "input_value", "name": "MESSAGE" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#9966FF"
      },
      {
        "type": "sound_playuntildone",
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
        "type": "control_repeat",
        "message0": "repeat %1 %2 %3",
        "args0": [
          { "type": "input_value", "name": "TIMES", "check": "Number" },
          { "type": "input_dummy" },
          { "type": "input_statement", "name": "DO" }
        ],
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
          blockCount: blocks.length,
          blocks: blocks
        }));
      }
    });

    window.runCode = function() {
      var blocks = workspace.getAllBlocks(false).map(function(b) { return b.type; });
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'RUN',
          blocks: blocks
        }));
      }
    };

    window.clearWorkspace = function() {
      workspace.clear();
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'WORKSPACE_CHANGE',
          blockCount: 0,
          blocks: []
        }));
      }
    };
  </script>
</body>
</html>
`;

export const MagicStudioScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors, assets } = useTheme();

  const lessonId = route.params?.lessonId || 'level-1-1';
  const webViewRef = useRef<WebView>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [blockCount, setBlockCount] = useState(0);
  const [coordX, setCoordX] = useState(0);

  const spriteX = useRef(new Animated.Value(0)).current;
  const spriteRotate = useRef(new Animated.Value(0)).current;
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [helpMessage] = useState(
    "Snap 'when flag clicked' on the right canvas, then attach 'move 10 steps'!"
  );

  useEffect(() => {
    const id = spriteX.addListener(({ value }) => {
      setCoordX(Math.round(value));
    });
    return () => {
      spriteX.removeListener(id);
    };
  }, [spriteX]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'RUN') {
        executeBlocks(data.blocks);
      } else if (data.type === 'WORKSPACE_CHANGE') {
        setBlockCount(data.blockCount || 0);
      }
    } catch (e) {
      console.warn('WebView message error', e);
    }
  };

  const executeBlocks = (blocks: string[]) => {
    setIsRunning(true);
    setSpeechBubble(null);

    // Sequence execution: animate sprite on the top live stage
    Animated.sequence([
      Animated.timing(spriteX, {
        toValue: 60,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(spriteRotate, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setSpeechBubble('Hello World!');
      setIsRunning(false);

      // Trigger win celebration modal after 1.5s
      setTimeout(() => {
        setShowCompleteModal(true);
      }, 1500);
    });
  };

  const handleGreenFlag = () => {
    if (webViewRef.current) {
      webViewRef.current.injectJavaScript('window.runCode(); true;');
    } else {
      executeBlocks([]);
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
          <Text style={styles.topBackText}>Levels</Text>
        </TouchableOpacity>

        <View style={styles.lessonTitleWrap}>
          <FontAwesome5 name="gamepad" size={12} color="#FFD000" />
          <Text style={styles.lessonTitleText}>{lessonId.toUpperCase()}</Text>
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
            {/* Stage Horizon / Floor line */}
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

          {/* AI TUTOR HINT (Compact single line) */}
          <View style={styles.tutorHintBar}>
            <View style={styles.tutorIconWrap}>
              <FontAwesome5 name="lightbulb" size={11} color="#8B5CF6" />
            </View>
            <Text style={styles.tutorMessage} numberOfLines={1}>
              {helpMessage}
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
            <Text style={styles.dividerColSub}>(Left Drawer)</Text>
          </View>

          <View style={styles.dividerCenterPill}>
            <Text style={styles.dividerCenterText}>{blockCount} Blocks</Text>
          </View>

          <View style={styles.dividerColRight}>
            <FontAwesome5 name="code" size={11} color="#10B981" />
            <Text style={styles.dividerColTitle}>CODE EDITOR</Text>
            <Text style={styles.dividerColSub}>(Right Canvas)</Text>
          </View>
        </View>

        {/* ============================================================ */}
        {/* BOTTOM HALF: BLOCKLY WORKSPACE                               */}
        {/* (Blocks Palette on bottom-left, Code Canvas on bottom-right)  */}
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

      {/* LEVEL COMPLETE WIN MODAL */}
      <Modal visible={showCompleteModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.winCard}>
            <View style={styles.winTrophyCircle}>
              <FontAwesome5 name="trophy" size={36} color="#FFD000" />
            </View>
            <Text style={styles.winTitle}>Quest Complete!</Text>
            <Text style={styles.winSubtitle}>You mastered Motion & Movement blocks!</Text>

            <View style={styles.winStarsRow}>
              <FontAwesome5 name="star" size={28} color="#FFD000" />
              <FontAwesome5 name="star" size={36} color="#FFD000" />
              <FontAwesome5 name="star" size={28} color="#FFD000" />
            </View>

            <View style={styles.winXpPill}>
              <Text style={styles.winXpText}>+50 XP EARNED</Text>
            </View>

            <TouchableOpacity
              style={[styles.nextLevelBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setShowCompleteModal(false);
                navigation.navigate('Levels');
              }}
            >
              <Text style={styles.nextLevelBtnText}>CONTINUE ADVENTURE</Text>
              <FontAwesome5 name="arrow-right" size={14} color="#fff" />
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
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  lessonTitleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
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

  /* MAIN COMBINED CONTAINER */
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
  },

  /* TOP HALF: LIVE STAGE */
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

  /* STAGE CANVAS BOX */
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

  /* AI TUTOR HINT BAR */
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

  /* DIVIDER BAR BETWEEN LIVE STAGE AND BLOCKS/WORKSPACE */
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

  /* BOTTOM HALF: WORKSPACE PANE */
  workspacePane: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  webView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  /* LEVEL COMPLETE WIN MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  winTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  winSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  winStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  winXpPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 16,
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
