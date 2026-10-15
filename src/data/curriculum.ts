export interface LessonProject {
  id: string;
  title: string;
  objective: string;
  steps: { id?: number; title?: string; desc?: string; [key: string]: any }[];
  order_index: number;
  journey_goal?: string;
  class_level: number;
  is_prompt_project?: boolean;
}

export interface CurriculumLevel {
  id: string;
  title: string;
  description: string;
  level: number;
  color: string;
  topics: string[];
  projects: LessonProject[];
}

export const curriculum: CurriculumLevel[] = [
  {
    "id": "class-1",
    "title": "Level 1: Master of Motion",
    "description": "Your journey into the world of magic coding begins here!",
    "level": 1,
    "color": "primary",
    "topics": [
      "Moving sprites",
      "Turning & rotating",
      "Say & think bubbles",
      "Loops & repeats",
      "Costumes & animation",
      "Sound & music",
      "Keyboard control",
      "Show & hide"
    ],
    "projects": [
      {
        "id": "L1P1",
        "title": "Whiskers Goes for Dinner",
        "objective": "Help Whiskers the Cat walk straight across the backyard lawn to reach his delicious dinner bowl by the wooden fence.",
        "steps": [
          {
            "id": 1,
            "desc": "Add the When Flag Clicked block to tell Whiskers when to start!",
            "title": "Start Event"
          },
          {
            "id": 2,
            "desc": "Snap a Move Steps block and change the number to 200 to reach the dinner bowl!",
            "title": "Walk to Fence"
          }
        ],
        "order_index": 1,
        "journey_goal": "Whiskers touches the fence.",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P2",
        "title": "The House Visit",
        "objective": "Help the cat follow the zigzag path to reach the cozy house! Use Move Forward and Move Up blocks.",
        "steps": [
          {
            "desc": "Add the When Flag Clicked block to begin!",
            "title": "Start Event",
            "check_xml_contains": "s_when_flag"
          },
          {
            "desc": "Add a Move 100 steps block to walk along the path.",
            "title": "Move Forward",
            "check_xml_contains": "s_move"
          },
          {
            "desc": "Add a Change Y by 50 block to climb up the path.",
            "title": "Move Up",
            "check_xml_contains": "s_change_y"
          },
          {
            "desc": "Add another Move 100 steps block to keep walking.",
            "title": "Move Forward Again",
            "check_xml_contains": "s_move"
          },
          {
            "desc": "Add another Change Y by 50 block to climb higher.",
            "title": "Move Up Again",
            "check_xml_contains": "s_change_y"
          },
          {
            "desc": "Add one last Move 100 steps block to reach the house!",
            "title": "Final Move",
            "check_xml_contains": "s_move"
          }
        ],
        "order_index": 2,
        "journey_goal": "Cat reaches the house by using Move Forward and Move Up.",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P3",
        "title": "The Magma Trail",
        "objective": "Guide the cat safely across the stone path around the bubbling lava! Use Move Up, Move Forward, and the Combined ↗️ Move block.",
        "steps": [
          {
            "desc": "Add the When Flag Clicked block to begin!",
            "title": "Start Event",
            "check_xml_contains": "s_when_flag"
          },
          {
            "desc": "Add a Change Y block to climb up through the entrance!",
            "title": "Move Up",
            "check_xml_contains": "s_change_y"
          },
          {
            "desc": "Add a Move block to walk forward along the stone path.",
            "title": "Move Forward",
            "check_xml_contains": "s_move"
          },
          {
            "desc": "Add the ↗️ Move & Change Y block to traverse the slanted path around the lava!",
            "title": "Combined Diagonal Move",
            "check_xml_contains": "s_move_forward_up"
          },
          {
            "desc": "Add another Change Y block to climb the upper bend.",
            "title": "Move Up",
            "check_xml_contains": "s_change_y"
          },
          {
            "desc": "Add the final Move block to safely reach the exit!",
            "title": "Move Forward to Exit",
            "check_xml_contains": "s_move"
          }
        ],
        "order_index": 3,
        "journey_goal": "Cat safely traverses the stone path around the lava to the exit.",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P4",
        "title": "The Starlight Sky Trail",
        "objective": "Guide KidoCat up the floating sky staircase! Step forward across each platform and jump up to reach the magic star at the top.",
        "steps": [
          {
            "id": 1,
            "desc": "Add the 🚩 Green Flag block to start KidoCat's journey.",
            "title": "Start Event"
          },
          {
            "id": 2,
            "desc": "Use Move 50 and Change Y by 50 to hop up the first steps.",
            "title": "First Stair Climb"
          },
          {
            "id": 3,
            "desc": "Step across the floating landings with Move 70, 75, and 80 blocks.",
            "title": "Across the High Steps"
          },
          {
            "id": 4,
            "desc": "Make the final jump up 35 and move 50 to reach the glowing magic star! 🌟",
            "title": "Catch the Star"
          }
        ],
        "order_index": 4,
        "journey_goal": "Click correctly triggers a color/costume change.",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P5",
        "title": "Crystal Cavern: Final Test",
        "objective": "Level 1 Final Exam: Guide KidoCat across the glowing crystal pillars over the cavern lake to open the Golden Treasure Chest! Show what you have learned without any hints.",
        "steps": [
          {
            "id": 1,
            "desc": "Add the 🚩 Green Flag block to start KidoCat's exam.",
            "title": "Start Event"
          },
          {
            "id": 2,
            "desc": "Use Move and Change Y blocks to jump across the 3 glowing crystal pillars.",
            "title": "Leap across Pillars"
          },
          {
            "id": 3,
            "desc": "Land safely on the right platform in front of the treasure chest.",
            "title": "Reach the Golden Chest"
          },
          {
            "id": 4,
            "desc": "Unlock the chest to earn your Level 1 Master Trophy! 🏆",
            "title": "Final Test Trophy"
          }
        ],
        "order_index": 5,
        "journey_goal": "Code KidoCat to explore the garden independently to pass Level 1!",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P6",
        "title": "Build Your Own Backyard Story",
        "objective": "The child designs a tiny backyard scene of their own using at least 3 things learned in this level.",
        "steps": [
          {
            "message": "🌟 Click on the flag to start the project",
            "check_xml_contains": "s_when_flag"
          },
          {
            "message": "👀 Show the sprite",
            "check_xml_contains": "s_show"
          },
          {
            "message": "⏱️ Wait for 2 seconds",
            "check_xml_contains": "s_wait"
          },
          {
            "message": "🔮 Hide the sprite",
            "check_xml_contains": "s_hide"
          }
        ],
        "order_index": 6,
        "journey_goal": "At least 3 distinct Level-1 concepts appear in the child's script.",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P7",
        "title": "Magic Touch",
        "objective": "",
        "steps": [
          {
            "message": "🖱️ Click on the sprite to trigger the magic touch",
            "check_xml_contains": "s_when_clicked"
          },
          {
            "message": "💫 Change the color effect by 25",
            "check_xml_contains": "s_change_effect"
          },
          {
            "message": "🎵 Play the 'pop' sound",
            "check_xml_contains": "s_play_sound"
          }
        ],
        "order_index": 7,
        "journey_goal": "",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P8",
        "title": "Arrow Keys Movement",
        "objective": "",
        "steps": [
          {
            "message": "🔼 Step 1: Move up with up arrow key",
            "check_xml_contains": "s_when_key"
          },
          {
            "message": "🔽 Step 2: Move down with down arrow key",
            "check_xml_contains": "s_when_key"
          },
          {
            "message": "◀️ Step 3: Move left with left arrow key",
            "check_xml_contains": "s_when_key"
          },
          {
            "message": "▶️ Step 4: Move right with right arrow key",
            "check_xml_contains": "s_when_key"
          }
        ],
        "order_index": 8,
        "journey_goal": "",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P9",
        "title": "Glide & Slide",
        "objective": "",
        "steps": [
          {
            "message": "🌟 Click on the flag to start the animation",
            "check_xml_contains": "s_when_flag"
          },
          {
            "message": "🚀 Sprite glides to the target position",
            "check_xml_contains": "s_glide_xy"
          }
        ],
        "order_index": 9,
        "journey_goal": "",
        "class_level": 1,
        "is_prompt_project": false
      },
      {
        "id": "L1P10",
        "title": "The Grand Finale",
        "objective": "",
        "steps": [
          {
            "message": "🎉 Start by adding a 'when flag clicked' block to begin the program",
            "check_xml_contains": "s_when_flag"
          },
          {
            "message": "🔄 Add a 'repeat' block and set it to 4 times",
            "check_xml_contains": "s_repeat"
          },
          {
            "message": "🚶 Inside the repeat block, add a 'move' block and set it to 100 steps",
            "check_xml_contains": "s_move"
          },
          {
            "message": "🔄 Add a 'turn right' block and set it to 90 degrees",
            "check_xml_contains": "s_turn_r"
          },
          {
            "message": "📢 Finally, add a 'say' block and type 'Level 1 Complete!'",
            "check_xml_contains": "s_say"
          }
        ],
        "order_index": 10,
        "journey_goal": "",
        "class_level": 1,
        "is_prompt_project": false
      }
    ]
  },
  {
    "id": "class-2",
    "title": "Level 2: Logic Wizard",
    "description": "Learn if-then and complex paths.",
    "level": 2,
    "color": "success",
    "topics": [
      "If/then conditions",
      "If-else blocks",
      "Boolean logic",
      "Comparisons",
      "Repeat until",
      "Sensing blocks",
      "Random numbers",
      "Score system"
    ],
    "projects": [
      {
        "id": "L2P1",
        "title": "Solar Farm Energy Collector",
        "objective": "Program KidoBot to patrol across 5 solar energy cells on the farm and absorb clean solar energy into its power battery using a repeat loop!",
        "steps": [
          {
            "id": 1,
            "desc": "Drag When flag clicked into your workspace.",
            "title": "Start Event"
          },
          {
            "id": 2,
            "desc": "Attach the repeat loop block and set it to 5 times.",
            "title": "Repeat Loop"
          },
          {
            "id": 3,
            "desc": "Place the move block inside the loop and play a sound to collect all 5 solar cells!",
            "title": "Move & Power"
          }
        ],
        "order_index": 1,
        "journey_goal": "Kido Bot collects 5 energy cells.",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P2",
        "title": "Pizza Spinner!",
        "objective": "Spin the pizza dough! Use a Repeat loop to make Chef KidoBot turn around and around to bake the ultimate pizza!",
        "steps": [
          {
            "id": 1,
            "desc": "Drag When flag clicked to your workspace — time to cook!",
            "title": "Start Cooking!"
          },
          {
            "id": 2,
            "desc": "Attach the Repeat loop block and set it to 8 times!",
            "title": "Add Repeat Loop"
          },
          {
            "id": 3,
            "desc": "Place Turn Right 45 degrees INSIDE the loop to spin the dough!",
            "title": "Spin the Dough!"
          },
          {
            "id": 4,
            "desc": "Add Wait 0.3 seconds inside the loop so each spin looks smooth!",
            "title": "Add Timing"
          }
        ],
        "order_index": 2,
        "journey_goal": "Chef KidoBot spins the pizza dough 8 times using a loop.",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P3",
        "title": "Star Constellation Drawer",
        "objective": "Draw a perfect glowing star constellation! Instead of using 10 blocks, we will use a loop to make it much easier.",
        "steps": [
          {
            "desc": "1. Start with the 'When flag clicked' block.",
            "title": "Start Event"
          },
          {
            "desc": "2. Grab the 'Repeat' loop and set it to 5 (for the 5 points of a star).",
            "title": "Star Loop"
          },
          {
            "desc": "3. Inside the loop, put a 'Move Forward 100' block.",
            "title": "Draw Line"
          },
          {
            "desc": "4. Next, add a 'Turn Right 144 degrees' block. Watch KidoBot draw a magical star!",
            "title": "Turn Angle"
          }
        ],
        "order_index": 3,
        "journey_goal": "KidoBot draws a perfect 5-pointed star.",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P4",
        "title": "The Flower Garden Planter",
        "objective": "Plant a beautiful row of 4 flowers in the magic garden using a loop, so you do not have to write the same blocks over and over.",
        "steps": [
          {
            "desc": "1. Bring out the 'When flag clicked' block.",
            "title": "Start Event"
          },
          {
            "desc": "2. Add a loop to repeat 4 times because we want to plant 4 flowers.",
            "title": "Planter Loop"
          },
          {
            "desc": "3. Inside the loop, add 'Move Forward', 'Drop Seed', and 'Water Plant' blocks.",
            "title": "Planting Sequence"
          },
          {
            "desc": "4. Add a 'Wait 1 second' block at the end of the loop so you can watch each flower grow before moving to the next!",
            "title": "Grow"
          }
        ],
        "order_index": 4,
        "journey_goal": "KidoBot plants 4 magic flowers in a row.",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P5",
        "title": "Dance Party Choreographer",
        "objective": "Program KidoBot to do an amazing dance routine! We will repeat the dance moves so the party never stops.",
        "steps": [
          {
            "desc": "1. Start with the 'When flag clicked' block.",
            "title": "Start Event"
          },
          {
            "desc": "2. Use a 'Repeat 10' loop to make the dance routine last longer.",
            "title": "Dance Loop"
          },
          {
            "desc": "3. Inside the loop, add a 'Jump' block, then a 'Spin' block, and finally a 'Change Color' block.",
            "title": "Dance Moves"
          },
          {
            "desc": "4. Add a 'Play Dance Music' block outside the loop to keep the party going!",
            "title": "Party Music"
          }
        ],
        "order_index": 5,
        "journey_goal": "KidoBot performs a 10-step dance routine.",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P6",
        "title": "Day and Night",
        "objective": "Move sprite left/right to change backdrop between day and night. If/else with position — backdrop reacts to where sprite is.",
        "steps": [
          {
            "desc": "1. Add a bright day backdrop and a dark night/stars backdrop to your project. 2. Set Up Movement: Left arrow -> 'Change x by -10'. Right arrow -> 'Change x by 10'. 3. Check Position Forever: Add 'Forever' -> 'If x position > 0' -> 'Switch backdrop to Day'. 4. Add the Else: In the Else branch -> 'Switch backdrop to Night'. Move sprite and watch the world change!",
            "title": "Instructions"
          }
        ],
        "order_index": 6,
        "journey_goal": "",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P7",
        "title": "Avoid The Edge",
        "objective": "Forever loop constantly checks if sprite touches edge",
        "steps": [],
        "order_index": 7,
        "journey_goal": "",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P8",
        "title": "Catch The Star",
        "objective": "Star moves to random positions. Player moves to catch it. If player touches star",
        "steps": [],
        "order_index": 8,
        "journey_goal": "",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P9",
        "title": "Traffic Light",
        "objective": "Light cycles Red -> Yellow -> Green automatically. Car moves on green",
        "steps": [
          {
            "desc": "False",
            "title": "Instructions"
          }
        ],
        "order_index": 9,
        "journey_goal": "",
        "class_level": 2,
        "is_prompt_project": false
      },
      {
        "id": "L2P10",
        "title": "Final Level 2 Test",
        "objective": "Build the Magic Cake game utilizing advanced loops and integrated conditional decision trees.",
        "steps": [
          {
            "desc": "1. Load a character asset and a target goal asset. 2. Establish user-driven vector controls via key event mappings. 3. Embed a perpetual frame check loop checking intersection boundaries. 4. Anchor a size effect scaling mutation and output confirmation message sequence inside the valid path block.",
            "title": "Instructions"
          }
        ],
        "order_index": 10,
        "journey_goal": "",
        "class_level": 2,
        "is_prompt_project": false
      }
    ]
  },
  {
    "id": "class-3",
    "title": "Level 3: Variable Hero",
    "description": "Master data and scores.",
    "level": 3,
    "color": "info",
    "topics": [
      "Variables",
      "Score tracking",
      "Lives system",
      "Timers",
      "Data display",
      "Changing values",
      "High scores",
      "Game HUD"
    ],
    "projects": [
      {
        "id": "L3P2",
        "title": "Countdown Timer",
        "objective": "Build a dynamic countdown timer that starts at 30 and stops the game when it hits 0. Child understands variable decrements and loop termination states.",
        "steps": [
          {
            "desc": "1. Create a new variable named 'timer'. 2. Under Green Flag: 'Set timer to 30'. 3. Drag a 'Repeat until' loop and insert an operator block: 'timer = 0'. 4. Inside the loop: add 'Wait 1 seconds' -> 'Change timer by -1'. 5. Below the loop, add a 'Stop all' block to end the game automatically.",
            "title": "Instructions"
          }
        ],
        "order_index": 2,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P3",
        "title": "Dynamic Slider Speed",
        "objective": "Control a character's movement velocity dynamically on stage using an on-screen variable slider tool. Child links variable values to motion parameters.",
        "steps": [
          {
            "desc": "1. Create a variable called 'speed'. 2. Right-click the variable display monitor on the stage and change its mode to 'slider'. 3. Add 'When green flag clicked' -> 'Forever' loop wrapper. 4. Inside the loop, snap a 'Move steps' block, but drag the round 'speed' variable bubble directly into the steps input parameter. Move the slider to see changes!",
            "title": "Instructions"
          }
        ],
        "order_index": 3,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P4",
        "title": "Ghost Hunter Lives Tracker",
        "objective": "Track player health or attempts using a lives variable that decreases on obstacle collisions. Child learns conditional checks tied to structural variable state reduction.",
        "steps": [
          {
            "desc": "1. Make a variable named 'lives' and set it to 3 at start. 2. Create an arrow-controlled hunter sprite and an autonomous ghost obstacle sprite. 3. On the hunter sprite, add a 'Forever' loop containing an 'If touching Ghost?' block. 4. Inside the conditional structural branch: 'Change lives by -1' -> 'Wait 1 seconds' to prevent rapid point drain.",
            "title": "Instructions"
          }
        ],
        "order_index": 4,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P5",
        "title": "High Score System",
        "objective": "Compare two separate variable values to determine and store the maximum score achieved across game runs. Child learns inequality comparison with variable data storage.",
        "steps": [
          {
            "desc": "1. Create two separate variables: 'score' and 'high score'. 2. Set 'score' to 0 on startup but do NOT reset 'high score'. 3. In a game loop: add 'If score > high score' then block. 4. Inside that conditional structural branch, put a 'Set high score to score' block. Watch your highest record freeze in place!",
            "title": "Instructions"
          }
        ],
        "order_index": 5,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P6",
        "title": "The Guessing Game",
        "objective": "Program a secret randomized math challenge engine using variables to hold dynamic hidden values. Child explores numeric generation variables and user input buffers.",
        "steps": [
          {
            "desc": "1. Make a variable called 'secret number'. 2. When flag clicked: 'Set secret number to pick random 1 to 10'. 3. Drag an 'Ask What is the number? and wait' block. 4. Add an 'If/Else' structure: If 'answer = secret number', say 'You Win!'. Else, say 'Try Again!'",
            "title": "Instructions"
          }
        ],
        "order_index": 6,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P7",
        "title": "Level Velocity Booster",
        "objective": "Increase game difficulty dynamically by linking variable multipliers to score thresholds. Child learns variable interaction and compound game difficulty curves.",
        "steps": [
          {
            "desc": "1. Create two variables: 'score' and 'enemy speed'. 2. At start: Set 'score' to 0 and 'enemy speed' to 3. 3. Inside the main game flow loop: add 'If score = 5' then block. 4. Inside the condition branch, put a 'Set enemy speed to 7' block. Watch the game instantly shift into hyper-drive when you score 5 points!",
            "title": "Instructions"
          }
        ],
        "order_index": 7,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P8",
        "title": "Gold and Silver Coins",
        "objective": "Award different numeric weights to variables based on unique interactive sprite identifiers. Child learns differential value mapping across separate control actors.",
        "steps": [
          {
            "desc": "1. Keep your 'score' variable from before. Create two new collectible sprites: a Gold Coin and a Silver Coin. 2. On the Gold Coin script: 'If touching player' -> 'Change score by 5' then hide. 3. On the Silver Coin script: 'If touching player' -> 'Change score by 1' then hide. Test to see your score jump faster with gold!",
            "title": "Instructions"
          }
        ],
        "order_index": 8,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P9",
        "title": "Magic Shield Timer",
        "objective": "Create an active countdown indicator that acts as an execution gate for damage conditions. Child learns boolean checking derived from variable values.",
        "steps": [
          {
            "desc": "1. Create a variable called 'shield time'. 2. When space key pressed (Activate Shield): 'Set shield time to 5'. 3. Add a 'Repeat until shield time = 0' loop -> inside: 'Wait 1 sec' -> 'Change shield time by -1'. 4. In your damage loop: 'If touching enemy' AND 'shield time = 0', then 'Say Game Over!'. If shield is active, you are safe!",
            "title": "Instructions"
          }
        ],
        "order_index": 9,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P10",
        "title": "FINAL TEST — Level 3: Space Escape Quest",
        "objective": "Cap-stone project for Level 3. Combine score, health tracking registers, and velocity parameters into a unified functional micro-game simulation.",
        "steps": [
          {
            "desc": "1. Setup 3 distinct structural variables: 'points', 'health', and 'flight speed'. 2. Initialization: Green flag sets points to 0, health to 3, and flight speed to 4. 3. Player moves via keys using 'flight speed' value steps. 4. Spawner continuously clones star assets (adds +1 to points on catch) and rock assets (subtracts -1 from health on hit). 5. Game terminates completely via 'Stop all' structural block when health reaches 0.",
            "title": "Instructions"
          }
        ],
        "order_index": 10,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      },
      {
        "id": "L3P1",
        "title": "Enchanted Bridge Showdown",
        "objective": "KidoCat must cross a magical glowing stone bridge blocked by a mischievous Goblin. KidoCat casts a protective shield spell and broadcasts a magical shockwave that repels the goblin off the bridge!",
        "steps": [
          {
            "id": 1,
            "desc": "On KidoCat: When flag clicked -> Say Shields Up! -> Broadcast cast_spell.",
            "title": "Hero Spell"
          },
          {
            "id": 2,
            "desc": "On Goblin: When I receive cast_spell -> Say Whoa! -> Change y by -150 to jump off the bridge!",
            "title": "Goblin Retreat"
          }
        ],
        "order_index": 11,
        "journey_goal": "",
        "class_level": 3,
        "is_prompt_project": false
      }
    ]
  },
  {
    "id": "class-4",
    "title": "Level 4: Game Designer",
    "description": "Create your first full game.",
    "level": 4,
    "color": "warning",
    "topics": [
      "Game loops",
      "Collision detection",
      "Player sprites",
      "Enemy AI",
      "Score & lives",
      "Win conditions",
      "Sound effects",
      "Game over screen"
    ],
    "projects": [
      {
        "id": "L4P1",
        "title": "5-Star Space Catcher",
        "objective": "Program full Up, Down, Left, and Right keyboard flight controls for KidoRocket to navigate through deep cosmic space and collect all 5 spinning MagicStars.",
        "steps": [
          {
            "id": 1,
            "desc": "Snap When up arrow pressed -> Change y by 15, and When down arrow pressed -> Change y by -15.",
            "title": "Up / Down Flight"
          },
          {
            "id": 2,
            "desc": "Snap When left arrow pressed -> Change x by -15, and When right arrow pressed -> Change x by 15 to fly in all directions!",
            "title": "Left / Right Flight"
          }
        ],
        "order_index": 1,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": false
      },
      {
        "id": "L4P2",
        "title": "Galaxy Jet: Alien Blaster",
        "objective": "Command your high-tech Fighter Jet to defend the galaxy! Move your mouse cursor up and down to steer your jet, blast continuous plasma balls from the jet tip, and hit the fast Alien UFO 5 times to win!",
        "steps": [
          {
            "id": 1,
            "desc": "Add 🚩 When Flag Clicked -> ♾️ Forever -> ⬆️ Set Y to (Mouse Y) to steer your Fighter Jet with your cursor.",
            "title": "Mouse Altitude Control"
          },
          {
            "id": 2,
            "desc": "Watch your Fighter Jet fire continuous round plasma balls from its nose tip!",
            "title": "Tip Blaster Cannon"
          },
          {
            "id": 3,
            "desc": "Aim up and down as the fast Alien UFO zooms across Sector 4.",
            "title": "Evade & Target Alien"
          },
          {
            "id": 4,
            "desc": "Land 5 direct hits to defeat the alien invader and save the galaxy! 🏆",
            "title": "Score 5 Hits"
          }
        ],
        "order_index": 2,
        "journey_goal": "Fighter Jet blasts Alien UFO 5 times using cursor steering.",
        "class_level": 4,
        "is_prompt_project": false
      },
      {
        "id": "L4P3",
        "title": "Duck Runner: Egg Hopper",
        "objective": "Help Duck leap over rolling eggs! Program Duck to jump when Space key is pressed, and code the eggs to roll faster as you leap over them!",
        "steps": [
          {
            "id": 1,
            "desc": "Select Duck tab: snap ⌨️ When Space Key Pressed -> 🔁 Repeat 10 (📐 Change Y by 10) -> ⏱️ Wait 0.05s -> 🔁 Repeat 10 (📐 Change Y by -10) to leap high!",
            "title": "Jump on Space Key"
          },
          {
            "id": 2,
            "desc": "Inside Duck loop: snap ❓ If <🥚 Touching Egg?> Then 💬 Say '💥 Ouch!' -> 🛑 Stop All.",
            "title": "Egg Crash Detection"
          },
          {
            "id": 3,
            "desc": "Switch to Egg tab: snap 🚩 When Green Flag Clicked -> 🔁 Forever -> 📍 Go to x: 240 y: -80 -> 🔁 Repeat Until <🦆 Touching Duck?> (⏩ Change X by -8).",
            "title": "Roll the Eggs"
          },
          {
            "id": 4,
            "desc": "Inside Egg loop: when Duck leaps safely over an egg, 🌟 Change Score by 1!",
            "title": "Leap & Score"
          }
        ],
        "order_index": 3,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": false
      },
      {
        "id": "L4P4",
        "title": "Gliding Star Patrol",
        "objective": "Smoothly animate a sprite traveling between fixed layout coordinates over time. Child distinguishes absolute instant movement from linear interpolation.",
        "steps": [
          {
            "desc": "1. Select a Star sprite. 2. Under 'When green flag clicked', add a 'Forever' loop wrapper. 3. Inside the loop, place 'Glide 1 secs to x: 200 y: 100'. 4. Below it, add 'Glide 1 secs to x: -200 y: -100'. Watch the star smoothly patrol back and forth across the screen continuously!",
            "title": "Instructions"
          }
        ],
        "order_index": 4,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": false
      },
      {
        "id": "L4P5",
        "title": "Ghost Spawner Hazard",
        "objective": "Create a ghost obstacle that continuously teleports to random coordinates and duplicates itself. Child connects spatial placement with continuous cloning clocks.",
        "steps": [
          {
            "desc": "1. Create a Ghost sprite. 2. Add 'When green flag clicked' -> 'Forever' loop. 3. Inside the loop: 'Wait 2 seconds' -> 'Go to random position' -> 'Create clone of myself'. 4. Add 'When I start as a clone' -> 'Play sound Pop' -> 'Wait 3 seconds' -> 'Delete this clone'.",
            "title": "Instructions"
          }
        ],
        "order_index": 5,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": false
      },
      {
        "id": "L4P6",
        "title": "Laser Blaster Engine",
        "objective": "Equip a player ship to shoot individual laser projectiles using button inputs and clone dynamics. Child masters event-triggered object spawning loops.",
        "steps": [
          {
            "desc": "1. Create a Spaceship sprite and a Laser sprite. 2. On Spaceship: Add key movement blocks. 3. On Laser: Add 'When space key pressed' -> 'Create clone of myself'. 4. Also on Laser: Add 'When I start as a clone' -> 'Go to Spaceship' -> 'Show' -> 'Repeat until touching edge?' -> 'Change y by 15' -> 'Delete this clone'.",
            "title": "Instructions"
          }
        ],
        "order_index": 6,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": false
      },
      {
        "id": "L4P7",
        "title": "Level Transition Broadcast",
        "objective": "Click an exit portal to shift scene levels across multiple assets simultaneously using global messages. Child structures scalable environment state changes.",
        "steps": [
          {
            "desc": "1. Create a Door sprite and an Enemy sprite. 2. On Door: Add 'When this sprite clicked' -> 'Broadcast level-up'. 3. On Stage Backdrops: Add 'When I receive level-up' -> 'Next backdrop'. 4. On Enemy: Add 'When I receive level-up' -> 'Go to x: 0 y: 0' -> 'Change color effect by 25'. Click the door to level up!",
            "title": "Instructions"
          }
        ],
        "order_index": 7,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": false
      },
      {
        "id": "L4P8",
        "title": "Fruit Rain Catchment",
        "objective": "Spawn falling items from randomized horizontal coordinate roofs that drop down the vertical screen space. Child integrates horizontal limits with vertical decay vectors.",
        "steps": [
          {
            "desc": "1. Create an Apple sprite. 2. Under green flag: 'Hide' -> 'Forever' loop -> 'Wait 1 seconds' -> 'Create clone of myself'. 3. Add 'When I start as a clone' -> 'Go to x: (pick random -200 to 200) y: 180' -> 'Show'. 4. Attach 'Repeat until touching edge?' -> 'Change y by -10'. Below loop, place 'Delete this clone'.",
            "title": "Instructions"
          }
        ],
        "order_index": 8,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": false
      },
      {
        "id": "L4P9",
        "title": "Coordinate Border Shield",
        "objective": "Build a protective tracking grid that checks sprite positions against boundary threshold limits. Child learns conditional spatial mapping limits.",
        "steps": [
          {
            "desc": "1. Create a Hero sprite that moves via arrow keys. 2. Add 'When green flag clicked' -> 'Forever' loop. 3. Inside the loop, insert an 'If' block checking operators: 'If x position > 180'. 4. Inside that branch, add 'Broadcast warning' -> 'Set x to 180'. 5. Create a Shield sprite that says 'BORDERALERT' when it receives that warning message!",
            "title": "Instructions"
          }
        ],
        "order_index": 9,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": true
      },
      {
        "id": "L4FB1",
        "title": "Galactic Coordinate Defender",
        "objective": "Build an interactive defense game using broadcasting, clones, and variables.",
        "steps": [
          {
            "desc": "Set the ship at starting coordinates and reset the score.",
            "title": "Ship Initialization"
          },
          {
            "desc": "Code the arrow key movement and the spacebar laser broadcast.",
            "title": "Movement & Combat"
          },
          {
            "desc": "Create the asteroid clone loop with a 2-second timer.",
            "title": "Asteroid Spawning"
          },
          {
            "desc": "Add logic to handle laser hits, asteroid falls, and game over.",
            "title": "Collision Physics"
          }
        ],
        "order_index": 10,
        "journey_goal": "",
        "class_level": 4,
        "is_prompt_project": false
      }
    ]
  },
  {
    "id": "class-5",
    "title": "Level 5: Sound Engineer",
    "description": "Music and beats in code.",
    "level": 5,
    "color": "danger",
    "topics": [
      "Music notes",
      "Drum patterns",
      "Sound triggers",
      "Volume control",
      "Tempo",
      "Sound effects",
      "Background music",
      "Soundboard"
    ],
    "projects": [
      {
        "id": "L5P1",
        "title": "Puppy and Ball",
        "objective": "In Prompt Studio, instruct Puppy to play fetch with a Ball in the sunny green park using simple, natural prompt commands.",
        "steps": [
          {
            "id": 1,
            "desc": "Type Hi puppy or Bark to get your puppy excited to play!",
            "title": "Say Hi"
          },
          {
            "id": 2,
            "desc": "Tell puppy to run to the ball across the sunny green grass.",
            "title": "Run to Ball"
          },
          {
            "id": 3,
            "desc": "Instruct puppy to catch the ball or fetch.",
            "title": "Catch Ball"
          },
          {
            "id": 4,
            "desc": "Cheer with puppy by typing spin happy, dance, or jump to win!",
            "title": "Spin & Celebrate"
          }
        ],
        "order_index": 1,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P2",
        "title": "Frog's Beach to Forest Journey",
        "objective": "Help Frog cross the ocean water to reach the green forest! Command Frog to jump onto the leaf and sail across the water.",
        "steps": [
          {
            "desc": "Look at the frog and the lilypad on the beach.",
            "title": "Step 1"
          },
          {
            "desc": "Type a magic prompt telling the frog to jump onto the leaf and sail across the water to the forest.",
            "title": "Step 2"
          },
          {
            "desc": "Use words like 'jump', 'move', or 'sail' in your command.",
            "title": "Step 3"
          },
          {
            "desc": "Press the Send button to watch the frog follow your command!",
            "title": "Step 4"
          }
        ],
        "order_index": 2,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P3",
        "title": "Cosmic Star Catcher: AI Prompt Game",
        "objective": "The deep space galaxy, KidoRocket, and MagicStars are already created for you! Your mission is to prompt Kido AI to make KidoRocket move and steer with arrow keys, and collect all 5 glowing MagicStars to win!",
        "steps": [
          {
            "id": 1,
            "desc": "Prompt Kido AI to make KidoRocket fly and steer with arrow keys (e.g. 'Rocket fly and steer with arrow keys!').",
            "title": "Move the Rocket"
          },
          {
            "id": 2,
            "desc": "Prompt Kido AI to catch and collect the glowing stars to score points (e.g. 'Collect stars to score points and win!').",
            "title": "Collect the Stars"
          }
        ],
        "order_index": 3,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P4",
        "title": "Custom Square Painter",
        "objective": "Define a modular drawing block to render geometry structures on stage using a size argument parameter. Child integrates Pen drawing with custom block structures.",
        "steps": [
          {
            "desc": "1. Add the Pen Extension to your project. 2. Create a custom My Block named 'Draw Square' with an input parameter called 'size'. 3. Under definition block: 'Erase all' -> 'Pen down' -> 'Repeat 4' loop -> inside loop: 'Move (size) steps' -> 'Turn 90 degrees'. 4. Run the custom block under green flag with size 100!",
            "title": "Instructions"
          }
        ],
        "order_index": 4,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P5",
        "title": "Leaderboard Tracker",
        "objective": "Insert real-time scores into specialized ranking slot indices within a global list layout. Child updates database arrays based on conditional thresholds.",
        "steps": [
          {
            "desc": "1. Create a variable called 'final score' and a list called 'Leaderboard'. 2. Manually add three numbers to your list (e.g., 50, 30, 10). 3. Add script: If 'final score > item 1 of Leaderboard', then 'Insert (final score) at 1 of Leaderboard'. Try to smash the number one high score spot!",
            "title": "Instructions"
          }
        ],
        "order_index": 5,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P6",
        "title": "Automated Enemy Spawner",
        "objective": "Build a clean cloning procedure inside a custom function block to deploy threats at absolute coordinate locations. Child wraps cloning logic in custom parameters.",
        "steps": [
          {
            "desc": "1. Create a Monster sprite and hide it. 2. Make a custom My Block named 'Spawn Monster' with two inputs: 'spawnX' and 'spawnY'. 3. Under definition: 'Go to x: spawnX y: spawnY' -> 'Create clone of myself'. 4. Under Green Flag: 'Repeat 3' -> call 'Spawn Monster' with different X/Y coordinate numbers!",
            "title": "Instructions"
          }
        ],
        "order_index": 6,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P7",
        "title": "Word Spelling Bee",
        "objective": "Build an interactive quiz application that compares user answer arrays against pre-loaded text strings. Child handles index evaluation across list elements.",
        "steps": [
          {
            "desc": "1. Create a list named 'secret words' and add 3 words (e.g., CAT, FROG, ROBOT). 2. Create an index variable called 'word index' and set it to 1. 3. Add loop: 'Repeat 3' -> 'Ask (item word index of secret words) and wait'. 4. If 'answer = item word index of secret words', say 'Correct!' -> 'Change word index by 1'.",
            "title": "Instructions"
          }
        ],
        "order_index": 7,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P8",
        "title": "Smart Shop Calculator",
        "objective": "Build a smart shop calculator. Create a list called prices with some items. Set a variable total to 0, then use a loop to iterate through every item of the prices list, adding the item value to the total variable. At the end, say the total price.",
        "steps": [
          {
            "desc": "1. Create a list named 'prices' and fill it with numbers (10, 20, 50). Create a variable called 'total cost' set to 0. 2. On a Fruit sprite: 'When this sprite clicked' -> 'Change total cost by (item 1 of prices)'. 3. On a Toy sprite: 'When clicked' -> 'Change total cost by (item 2 of prices)'. Click items to tally up!",
            "title": "Instructions"
          }
        ],
        "order_index": 8,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P9",
        "title": "Custom Status Renderer",
        "objective": "Build a visual health warning system using custom functional blocks containing conditional costume assets. Child learns graphical skin mapping via functions.",
        "steps": [
          {
            "desc": "1. Create a HealthBar sprite with 3 costumes: Full, Medium, and Danger. 2. Make a custom Block named 'Check Status' with an input called 'currentHP'. 3. Inside definition: If 'currentHP = 3' -> switch costume to Full. Else If 'currentHP = 2' -> switch costume to Medium. Else -> switch costume to Danger.",
            "title": "Instructions"
          }
        ],
        "order_index": 9,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      },
      {
        "id": "L5P10",
        "title": "FINAL TEST — Level 5: The Ultimate Quiz Master",
        "objective": "Cap-stone project for Level 5. Construct a complete multi-list game layout utilizing custom blocks with logic conditions to validate runtime states.",
        "steps": [
          {
            "desc": "1. Create two distinct lists: 'questions' (fill with 3 items) and 'answers' (fill with 3 matching answer keys). 2. Create a variable 'score' initialized to 0. 3. Make a custom My Block named 'Run Quiz Loop' to handle structural iterations cleanly. 4. Loop through questions using index variables. 5. If input matches the answer index -> add 1 to score. Else -> say Try Again. Complete layout to win!",
            "title": "Instructions"
          }
        ],
        "order_index": 10,
        "journey_goal": "",
        "class_level": 5,
        "is_prompt_project": true
      }
    ]
  },
  {
    "id": "class-6",
    "title": "Level 6: Art Master",
    "description": "Draw with code.",
    "level": 6,
    "color": "primary",
    "topics": [
      "Pen tool",
      "Drawing shapes",
      "Colour mixing",
      "Patterns",
      "Stamp tool",
      "Spiral art",
      "Pixel art",
      "Animation frames"
    ],
    "projects": [
      {
        "id": "L6P1",
        "title": "Grid Path Searcher",
        "objective": "Build a grid path searcher bot. When the space key is pressed, repeat until the bot is touching the red goal sprite or touching the black maze wall: move 10 steps forward and turn left 15 degrees.",
        "steps": [
          {
            "desc": "1. Create a Maze backdrop with black walls. 2. On your Explorer Bot sprite, add a green flag event. 3. Build a loop: 'Repeat until touching Yellow Goal'. 4. Inside the loop, insert an 'If' block with an 'AND' operator: check if 'Key Up Arrow pressed' and 'NOT touching color black', then 'Change y by 10'.",
            "title": "Instructions"
          }
        ],
        "order_index": 1,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P2",
        "title": "Enemy Chaser AI",
        "objective": "Develop an automated tracking algorithm that calculates player coordinates to smoothly change angle vectors and chase targets.",
        "steps": [
          {
            "desc": "1. Create two sprites: Hero and Chaser. 2. On Chaser sprite, add a green flag event and set a 'Forever' loop. 3. Inside the loop, add a 'Point towards Hero' block. 4. Add a 'Move 3 steps' block. 5. Wrap this in a condition: 'If distance to Hero > 30', move forward, else play an alert sound.",
            "title": "Instructions"
          }
        ],
        "order_index": 2,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P3",
        "title": "Rule-Based Chatbot",
        "objective": "Build a conversational text filter that checks user prompt answers using advanced string operators to output targeted responses.",
        "steps": [
          {
            "desc": "1. Add a green flag event and a 'Forever' loop. 2. Inside, use an 'Ask [How can I help you today?] and wait' block. 3. Add an 'If/Else' block. 4. In the condition slot, drop an 'apple contains a' block, changing it to: If 'answer contains code', say 'I love coding!'. 5. Add an Else branch saying 'Tell me more!'.",
            "title": "Instructions"
          }
        ],
        "order_index": 3,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P4",
        "title": "Pattern Matcher Game",
        "objective": "Initialize a sequential list matrix to store pattern codes and evaluate if the player's inputs match the exact index order.",
        "steps": [
          {
            "desc": "1. Create a list named 'pattern'. 2. Under green flag, clear the list, then add 3 secret items (e.g., Red, Blue, Red). 3. Ask the player for 3 inputs using a loop. 4. Use an index variable to check if 'answer = item index of pattern'. 5. If incorrect, broadcast a 'Game Over' alert.",
            "title": "Instructions"
          }
        ],
        "order_index": 4,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P5",
        "title": "Smart Health Recovery",
        "objective": "Combine multiple status variables using logical Boolean operators to build an automated emergency health restoration module.",
        "steps": [
          {
            "desc": "1. Create two variables: 'health' (set to 20) and 'shield' (set to 0). 2. Add a 'Forever' loop. 3. Insert an 'If' block with an 'AND' gate. 4. Condition 1: 'health < 30'. Condition 2: 'shield = 0'. 5. Inside the branch, say 'Activating Emergency Shield!' and set shield to 100.",
            "title": "Instructions"
          }
        ],
        "order_index": 5,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P6",
        "title": "Tic-Tac-Toe Win Checker",
        "objective": "Analyze a linear game grid array to look for matching items across sequential index slots to simulate a win validator.",
        "steps": [
          {
            "desc": "1. Create a list named 'board' with 9 elements. 2. Fill slots 1, 2, and 3 with 'X'. 3. Create a logic block: If 'item 1 of board = X' AND 'item 2 of board = X' AND 'item 3 of board = X', then say 'Row 1 wins!'. 4. Test by changing item values.",
            "title": "Instructions"
          }
        ],
        "order_index": 6,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P7",
        "title": "High-Score Sorting Engine",
        "objective": "Develop a list sorting engine that systematically scans adjacent item values and swaps them to maintain an ordered leaderboard.",
        "steps": [
          {
            "desc": "1. Create a list called 'Scores' with unordered numbers (e.g., 10, 50, 30). 2. Create a variable 'index'. 3. Loop through the list: If 'item index of Scores < item (index + 1) of Scores', swap their slots by inserting item index at position (index + 2) and deleting the old record.",
            "title": "Instructions"
          }
        ],
        "order_index": 7,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P8",
        "title": "Finite State Machine Boss",
        "objective": "Manage complex sprite behavior by creating a control variable that switches between distinct movement routines based on environmental conditions.",
        "steps": [
          {
            "desc": "1. Create a variable named 'boss state' and initialize it to 'Patrol'. 2. In a 'Forever' loop, add an If/Else structure. 3. If 'boss state = Patrol', move back and forth. 4. If 'distance to Hero < 100', set 'boss state' to 'Chase' and glide toward the hero sprite.",
            "title": "Instructions"
          }
        ],
        "order_index": 8,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P9",
        "title": "Distance-Based Raycaster",
        "objective": "Utilize real-time mathematical distance calculations to dynamically scale visual properties and simulate 3D depth perspective.",
        "steps": [
          {
            "desc": "1. Create a Wall sprite and a Player sprite. 2. On the Wall sprite, add a 'Forever' loop. 3. Inside, add a 'Set size to (3000 / distance to Player) %' block. 4. Add a 'Set brightness effect to (0 - distance to Player)' block. Move closer to watch it expand!",
            "title": "Instructions"
          }
        ],
        "order_index": 9,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      },
      {
        "id": "L6P10",
        "title": "FINAL TEST — Level 6: Automated Smart City Traffic Grid",
        "objective": "Capstone evaluation project for Level 6. Coordinate multiple interactive lane elements using list tracking tables and Boolean logic gates to automate an entire grid network.",
        "steps": [
          {
            "desc": "1. Create a list named 'lane queues' to track vehicle queues for 4 lanes. 2. Build a custom block called 'Process Traffic' that consumes parameter thresholds. 3. Use an 'AND' block to check if 'item 1 of lane queues > 5' AND 'signal status = Red', then broadcast 'Force Green Wave'. Integrate all features to pass!",
            "title": "Instructions"
          }
        ],
        "order_index": 10,
        "journey_goal": "",
        "class_level": 6,
        "is_prompt_project": true
      }
    ]
  }
];
