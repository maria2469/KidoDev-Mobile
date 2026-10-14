import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Animated,
  Modal,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { RootStackParamList } from '../navigation/NavigationTypes';

const { width } = Dimensions.get('window');
const isTablet = width >= 768;

const BLOCKLY_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <script src="https://unpkg.com/blockly/blockly.min.js"></script>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #F8FAFC;
    }
    #blocklyDiv {
      width: 100%;
      height: 100%;
    }
    .blocklyToolboxDiv {
      background-color: #FFFFFF !important;
      border-right: 2px solid #E2E8F0 !important;
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
      <block type="motion_pointindirection">
        <value name="DIRECTION">
          <shadow type="math_number"><field name="NUM">90</field></shadow>
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
      <block type="looks_changesizeby">
        <value name="CHANGE">
          <shadow type="math_number"><field name="NUM">10</field></shadow>
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
      <block type="control_wait">
        <value name="DURATION">
          <shadow type="math_number"><field name="NUM">1</field></shadow>
        </value>
      </block>
    </category>
  </xml>

  <script>
    // Custom Scratch-like block definitions
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "event_whenflagclicked",
        "message0": "when %1 clicked",
        "args0": [{ "type": "field_image", "src": "https://img.icons8.com/color/48/flag.png", "width": 20, "height": 20, "alt": "flag" }],
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
        "message0": "turn right %1 degrees",
        "args0": [{ "type": "input_value", "name": "DEGREES", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "motion_turnleft",
        "message0": "turn left %1 degrees",
        "args0": [{ "type": "input_value", "name": "DEGREES", "check": "Number" }],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#4C97FF"
      },
      {
        "type": "looks_sayforsecs",
        "message0": "say %1 for %2 secs",
        "args0": [
          { "type": "input_value", "name": "MESSAGE" },
          { "type": "input_value", "name": "SECS", "check": "Number" }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": "#9966FF"
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
        startScale: 0.85,
        maxScale: 2,
        minScale: 0.4,
        scaleSpeed: 1.1
      },
      grid: {
        spacing: 20,
        length: 3,
        colour: '#CBD5E1',
        snap: true
      }
    });

    // Notify React Native on changes
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

  const [activeTab, setActiveTab] = useState<'blocks' | 'stage'>('blocks');
  const [isRunning, setIsRunning] = useState(false);
  const [speechBubble, setSpeechBubble] = useState<string | null>(null);
  const [spriteX, setSpriteX] = useState(new Animated.Value(0));
  const [spriteRotate, setSpriteRotate] = useState(new Animated.Value(0));
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [helpMessage, setHelpMessage] = useState(
    "Drag the 'when green flag clicked' block into your canvas, then attach 'move 10 steps'!"
  );

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'RUN') {
        executeBlocks(data.blocks);
      }
    } catch (e) {
      console.warn('WebView message error', e);
    }
  };

  const executeBlocks = (blocks: string[]) => {
    setIsRunning(true);
    setSpeechBubble(null);

    // Sequence execution
    Animated.sequence([
      Animated.timing(spriteX, {
        toValue: 70,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(spriteRotate, {
        toValue: 1,
        duration: 400,
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

  const spin = spriteRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '15deg'],
  });

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#F1F5F9' }]}>
      {/* STUDIO TOPBAR */}
      <View style={[styles.topBar, { backgroundColor: colors.navbar_bg }]}>
        <TouchableOpacity style={styles.topBackBtn} onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={14} color="#fff" />
          <Text style={styles.topBackText}>Levels</Text>
        </TouchableOpacity>

        <View style={styles.lessonTitleWrap}>
          <Text style={styles.lessonTitleText}>{lessonId.toUpperCase()}</Text>
        </View>

        {/* RUN CONTROLS */}
        <View style={styles.runControls}>
          <TouchableOpacity
            style={[styles.flagBtn, { backgroundColor: '#10B981' }]}
            onPress={handleGreenFlag}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="flag" size={14} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.stopBtn, { backgroundColor: '#EF4444' }]}
            onPress={handleStop}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="stop" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MOBILE TAB SELECTOR (Blocks vs Stage) */}
      {!isTablet && (
        <View style={styles.tabSelector}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'blocks' && styles.tabBtnActive]}
            onPress={() => setActiveTab('blocks')}
          >
            <FontAwesome5
              name="puzzle-piece"
              size={14}
              color={activeTab === 'blocks' ? colors.primary : '#64748B'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'blocks' && { color: colors.primary, fontWeight: '800' },
              ]}
            >
              Blocks Workspace
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'stage' && styles.tabBtnActive]}
            onPress={() => setActiveTab('stage')}
          >
            <FontAwesome5
              name="gamepad"
              size={14}
              color={activeTab === 'stage' ? colors.primary : '#64748B'}
            />
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'stage' && { color: colors.primary, fontWeight: '800' },
              ]}
            >
              Live Stage
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* WORKSPACE & STAGE CONTAINER */}
      <View style={styles.contentWrap}>
        {/* BLOCKLY WORKSPACE */}
        <View
          style={[
            styles.workspacePane,
            !isTablet && activeTab !== 'blocks' && { display: 'none' },
          ]}
        >
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

        {/* 4:3 STAGE CANVAS */}
        <View
          style={[
            styles.stagePane,
            !isTablet && activeTab !== 'stage' && { display: 'none' },
          ]}
        >
          <View style={styles.stageHeader}>
            <Text style={styles.stageHeaderText}>STAGE VIEW (4:3)</Text>
            {isRunning && (
              <View style={styles.liveIndicator}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>RUNNING</Text>
              </View>
            )}
          </View>

          {/* STAGE SCREEN */}
          <View style={styles.stageCanvasBox}>
            {/* SPEECH BUBBLE */}
            {speechBubble && (
              <View style={styles.speechBubble}>
                <Text style={styles.speechText}>{speechBubble}</Text>
                <View style={styles.speechTail} />
              </View>
            )}

            {/* SPRITE CHARACTER */}
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
          </View>

          {/* AI TUTOR HINT BAR */}
          <View style={styles.tutorHintBox}>
            <Image source={assets.sprite_logo} style={styles.tutorAvatar} resizeMode="contain" />
            <View style={styles.tutorTextWrap}>
              <Text style={styles.tutorTitle}>Kido AI Guide</Text>
              <Text style={styles.tutorMessage}>{helpMessage}</Text>
            </View>
          </View>
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
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  topBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  topBackText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  lessonTitleWrap: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  lessonTitleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
  },
  runControls: {
    flexDirection: 'row',
    gap: 8,
  },
  flagBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  stopBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tabBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  tabBtnActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#0EA5E9',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  contentWrap: {
    flex: 1,
    flexDirection: isTablet ? 'row' : 'column',
  },
  workspacePane: {
    flex: isTablet ? 1.4 : 1,
    backgroundColor: '#fff',
  },
  webView: {
    flex: 1,
  },
  stagePane: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderLeftWidth: isTablet ? 2 : 0,
    borderLeftColor: '#E2E8F0',
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stageHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
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
  stageCanvasBox: {
    width: '100%',
    aspectRatio: 4 / 3,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  speechBubble: {
    position: 'absolute',
    top: 30,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#0F172A',
    elevation: 3,
  },
  speechText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  speechTail: {
    position: 'absolute',
    bottom: -6,
    left: '50%',
    marginLeft: -4,
    width: 8,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#0F172A',
    transform: [{ rotate: '45deg' }],
  },
  spriteWrapper: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spriteImg: {
    width: '100%',
    height: '100%',
  },
  tutorHintBox: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  tutorAvatar: {
    width: 44,
    height: 44,
  },
  tutorTextWrap: {
    flex: 1,
  },
  tutorTitle: {
    fontSize: 12,
    fontWeight: '900',
    color: '#8B5CF6',
  },
  tutorMessage: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  winCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    elevation: 8,
  },
  winTrophyCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEF9C3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  winTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  winSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  winStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  winXpPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginBottom: 20,
  },
  winXpText: {
    color: '#D97706',
    fontWeight: '900',
    fontSize: 13,
  },
  nextLevelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 20,
    width: '100%',
  },
  nextLevelBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
  },
});
