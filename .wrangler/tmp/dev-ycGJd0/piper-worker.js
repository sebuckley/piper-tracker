var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// worker/templates/sports/gymnastics.js
var gymnasticsTemplates = [
  {
    id: "gymnastics",
    name: "Gymnastics",
    classSessions: [],
    // ⭐ Levels
    levels: [
      { id: "gym_core_1", value: 1, label: "Core 1" },
      { id: "gym_core_2", value: 2, label: "Core 2" },
      { id: "gym_core_3", value: 3, label: "Core 3" },
      { id: "gym_core_4", value: 4, label: "Core 4" },
      { id: "gym_core_5", value: 5, label: "Core 5" },
      { id: "gym_core_6", value: 6, label: "Core 6" },
      { id: "gym_core_7", value: 7, label: "Core 7" },
      { id: "gym_core_8", value: 8, label: "Core 8" },
      { id: "gym_core_9", value: 9, label: "Core 9" },
      { id: "gym_core_10", value: 10, label: "Core 10" },
      { id: "gym_bronze", value: 11, label: "Bronze" },
      { id: "gym_silver", value: 12, label: "Silver" },
      { id: "gym_gold", value: 13, label: "Gold" }
    ],
    // ⭐ NEW — Routine validation rules
    routineRules: {
      1: { min: 5, max: 8 },
      // Core 1
      2: { min: 5, max: 8 },
      // Core 2
      3: { min: 6, max: 9 },
      // Core 3
      4: { min: 6, max: 10 },
      // Core 4
      5: { min: 7, max: 10 },
      // Core 5
      6: { min: 7, max: 11 },
      // Core 6
      7: { min: 8, max: 11 },
      // Core 7
      8: { min: 8, max: 12 },
      // Core 8
      9: { min: 9, max: 12 },
      // Core 9
      10: { min: 10, max: 12 },
      // Core 10
      11: { min: 10, max: 12 },
      // Bronze
      12: { min: 10, max: 12 },
      // Silver
      13: { min: 10, max: 12 }
      // Gold
    },
    uiLabels: {
      routineName: "Routine",
      routinePlural: "Routines",
      categoryName: "Apparatus",
      categoryPlural: "Apparatus"
    },
    categories: [
      // ⭐ BARS
      {
        id: "gym_bars",
        name: "Bars",
        description: "Progression of bar skills focusing on strength, control and rotation.",
        routines: [],
        routineRules: {
          min: 4,
          max: 6
        },
        skills: [
          { id: "bars_support_hold", name: "Support Hold", level: 1, description: "Maintain a strong front support position.", link: "" },
          { id: "bars_cast_horizontal", name: "Cast to Horizontal", level: 1, description: "Small cast reaching horizontal body line.", link: "" },
          { id: "bars_swing_regrip", name: "Swing to Regrip", level: 1, description: "Basic swing with secure regrip on bar.", link: "" },
          { id: "bars_chinup_pullover", name: "Chin\u2011Up Pullover", level: 1, description: "Pull chin above bar and rotate to front support.", link: "" },
          { id: "bars_forward_roll_dismount", name: "Forward Roll Dismount", level: 1, description: "Forward roll off the bar from front support.", link: "" },
          { id: "bars_long_hang_swing_1", name: "Long Hang Swing", level: 1, description: "Swing in long hang with straight body.", link: "" },
          { id: "bars_back_hip_circle", name: "Back Hip Circle", level: 2, description: "Controlled backward circle around the bar.", link: "" },
          { id: "bars_forward_hip_circle", name: "Forward Hip Circle", level: 2, description: "Forward rotation maintaining tight body shape.", link: "" },
          { id: "bars_cast_45", name: "Cast to 45\xB0", level: 2, description: "Higher cast with improved shoulder extension.", link: "" },
          { id: "bars_tap_swing_2", name: "Tap Swing", level: 2, description: "Swing with tap action to generate momentum.", link: "" },
          { id: "bars_squat_on", name: "Squat On", level: 3, description: "Jump feet to bar and stand ready for transition.", link: "" },
          { id: "bars_long_hang_swing_3", name: "Long Hang Swing", level: 3, description: "Controlled swings with straight body line.", link: "" },
          { id: "bars_tap_swing_3", name: "Tap Swing", level: 3, description: "Introduce tap action for future giants.", link: "" },
          { id: "bars_straddle_on", name: "Straddle On", level: 4, description: "Straddle jump to bar with control.", link: "" },
          { id: "bars_clear_hip_circle", name: "Clear Hip Circle", level: 4, description: "Hip circle away from bar with extended body.", link: "" },
          { id: "bars_flyaway", name: "Flyaway", level: 4, description: "Swing release and backward salto dismount.", link: "" }
        ]
      },
      // ⭐ BEAM
      {
        id: "gym_beam",
        name: "Beam",
        description: "Balance, control and precision on a narrow surface.",
        routines: [
          {
            id: "beam_routine_beginner",
            name: "Beginner Beam Routine",
            level: 1,
            skills: [
              "Relev\xE9 Walk",
              "Straddle Sit",
              "Arabesque Lean",
              "Pass\xE9 Balance",
              "Straight Jump",
              "Tendu Below Beam",
              "Relev\xE9 Knee Bend",
              "Straight Jump Dismount"
            ]
          }
        ],
        routineRules: {
          min: 6,
          max: 10
        },
        skills: [
          { id: "beam_mount", name: "Mount", level: 1, description: "Basic mount onto the beam safely.", link: "" },
          { id: "beam_straight_jump", name: "Straight Jump", level: 1, description: "Small straight jump maintaining balance.", link: "" },
          { id: "beam_arabesque_hold", name: "Arabesque Hold", level: 1, description: "Balance on one leg with extended back leg.", link: "" },
          { id: "beam_releve_walk", name: "Relev\xE9 Walk", level: 1, description: "Tiptoe walk along the beam.", link: "" },
          { id: "beam_straddle_sit", name: "Straddle Sit", level: 1, description: "Controlled straddle position on the beam.", link: "" },
          { id: "beam_arabesque_lean", name: "Arabesque Lean", level: 1, description: "Forward lean in arabesque position.", link: "" },
          { id: "beam_passe_balance", name: "Pass\xE9 Balance", level: 1, description: "Balance on one leg with the other in pass\xE9.", link: "" },
          { id: "beam_tendu_below", name: "Tendu Below Beam", level: 1, description: "Extend foot downward in tendu position.", link: "" },
          { id: "beam_releve_knee_bend", name: "Relev\xE9 Knee Bend", level: 1, description: "Controlled knee bend while in relev\xE9.", link: "" },
          { id: "beam_straight_jump_dismount", name: "Straight Jump Dismount", level: 1, description: "Straight jump dismount with controlled landing.", link: "" },
          { id: "beam_tuck_jump", name: "Tuck Jump", level: 2, description: "Controlled tuck jump on beam.", link: "" },
          { id: "beam_pivot_turn", name: "Pivot Turn", level: 2, description: "Half turn maintaining tight posture.", link: "" },
          { id: "beam_side_step_sequence", name: "Side Step Sequence", level: 2, description: "Linked skills demonstrating control.", link: "" },
          { id: "beam_split_jump", name: "Split Jump", level: 3, description: "Split jump with extended legs.", link: "" },
          { id: "beam_cartwheel", name: "Cartwheel", level: 3, description: "Controlled cartwheel along beam line.", link: "" },
          { id: "beam_full_turn", name: "Full Turn", level: 3, description: "360\xB0 turn with balance and posture.", link: "" },
          { id: "beam_back_walkover", name: "Back Walkover", level: 4, description: "Smooth walkover maintaining alignment.", link: "" },
          { id: "beam_front_handspring_dismount", name: "Front Handspring Dismount", level: 4, description: "Powerful handspring off beam.", link: "" },
          { id: "beam_series_connection", name: "Series Connection", level: 4, description: "Linked acrobatic elements.", link: "" }
        ]
      },
      // ⭐ FLOOR
      {
        id: "gym_floor",
        name: "Floor",
        description: "Acrobatic and dance elements performed on a sprung floor.",
        routines: [
          {
            id: "floor_routine_beginner",
            name: "Beginner Floor Routine",
            level: 1,
            skills: [
              "Forward Roll to Stand",
              "Pike Forward Roll",
              "Backward Roll to Stand",
              "Front Scale",
              "Headstand",
              "Straight Jump"
            ]
          }
        ],
        routineRules: {
          min: 8,
          max: 12
        },
        skills: [
          { id: "floor_forward_roll", name: "Forward Roll", level: 1, description: "Basic roll maintaining tight shape.", link: "" },
          { id: "floor_handstand", name: "Handstand", level: 1, description: "Hold handstand for 2\u20133 seconds.", link: "" },
          { id: "floor_cartwheel", name: "Cartwheel", level: 1, description: "Controlled cartwheel with straight legs.", link: "" },
          { id: "floor_close_legs_roll", name: "Close Legs Roll Back and Up", level: 1, description: "Backward roll finishing upright.", link: "" },
          { id: "floor_one_leg_forward_hold", name: "One Leg Forward Hold", level: 1, description: "Balance on one leg with the other extended forward.", link: "" },
          { id: "floor_forward_roll_stand", name: "Forward Roll to Stand", level: 1, description: "Forward roll finishing upright.", link: "" },
          { id: "floor_pike_forward_roll", name: "Pike Forward Roll", level: 1, description: "Forward roll in pike shape.", link: "" },
          { id: "floor_backward_roll_stand", name: "Backward Roll to Stand", level: 1, description: "Backward roll finishing upright.", link: "" },
          { id: "floor_front_scale", name: "Front Scale", level: 1, description: "Balance on one leg with the other extended forward.", link: "" },
          { id: "floor_headstand", name: "Headstand", level: 1, description: "Hold a stable headstand.", link: "" },
          { id: "floor_straight_jump", name: "Straight Jump", level: 1, description: "Vertical jump with straight alignment.", link: "" },
          { id: "floor_roundoff", name: "Roundoff", level: 2, description: "Powerful roundoff with rebound.", link: "" },
          { id: "floor_bridge_kickover", name: "Bridge Kickover", level: 2, description: "Kickover from bridge position.", link: "" },
          { id: "floor_split_leap", name: "Split Leap", level: 2, description: "Leap with extended split.", link: "" },
          { id: "floor_headstand_adv", name: "Headstand (Advanced)", level: 2, description: "Hold headstand for 2\u20133 seconds.", link: "" },
          { id: "floor_back_handspring", name: "Back Handspring", level: 3, description: "Powerful backward handspring.", link: "" },
          { id: "floor_front_handspring", name: "Front Handspring", level: 3, description: "Forward handspring with control.", link: "" },
          { id: "floor_aerial_cartwheel", name: "Aerial Cartwheel", level: 3, description: "Cartwheel performed without hands.", link: "" },
          { id: "floor_back_tuck", name: "Back Tuck", level: 4, description: "Backward salto in tuck position.", link: "" },
          { id: "floor_front_layout", name: "Front Layout", level: 4, description: "Straight\u2011body forward salto.", link: "" },
          { id: "floor_twisting_skills", name: "Twisting Skills", level: 4, description: "Half and full twists added to saltos.", link: "" }
        ]
      },
      // ⭐ VAULT
      {
        id: "gym_vault",
        name: "Vault",
        description: "Power, speed and controlled landings.",
        routines: [
          {
            id: "vault_straight_jump",
            name: "Vault \u2013 Straight Jump",
            level: 1,
            skills: [
              "Approach Run",
              "Springboard Jump",
              "Straight Jump Off",
              "Landing Position (Finish)"
            ]
          },
          {
            id: "vault_star_jump",
            name: "Vault \u2013 Star Jump",
            level: 1,
            skills: [
              "Approach Run",
              "Springboard Jump",
              "Star Jump Off",
              "Landing Position (Finish)"
            ]
          },
          {
            id: "vault_pike_jump",
            name: "Vault \u2013 Pike Jump",
            level: 1,
            skills: [
              "Approach Run",
              "Springboard Jump",
              "Pike Jump Off",
              "Landing Position (Finish)"
            ]
          }
        ],
        routineRules: {
          min: 2,
          max: 3
        },
        skills: [
          { id: "vault_handstand_prep", name: "Handstand Prep", level: 1, description: "Hand placement and body tension.", link: "" },
          { id: "vault_approach_run", name: "Approach Run", level: 1, description: "Controlled run toward the springboard.", link: "" },
          { id: "vault_springboard_jump", name: "Springboard Jump", level: 1, description: "Jump from springboard with straight alignment.", link: "" },
          { id: "vault_straight_jump_off", name: "Straight Jump Off", level: 1, description: "Vertical straight jump off vault.", link: "" },
          { id: "vault_star_jump_off", name: "Star Jump Off", level: 1, description: "Jump with arms and legs extended.", link: "" },
          { id: "vault_pike_jump_off", name: "Pike Jump Off", level: 1, description: "Jump maintaining pike position.", link: "" },
          { id: "vault_landing_finish", name: "Landing Position (Finish)", level: 1, description: "Controlled landing with knees bent.", link: "" },
          { id: "vault_handstand_flatback", name: "Handstand Flatback", level: 2, description: "Handstand entry landing flat on mat.", link: "" },
          { id: "vault_squat_through", name: "Squat Through", level: 2, description: "Squat through vault with control.", link: "" },
          { id: "vault_straddle_over", name: "Straddle Over", level: 2, description: "Straddle vault with extended legs.", link: "" },
          { id: "vault_handspring", name: "Handsprint Vault", level: 3, description: "Powerful handspring over vault.", link: "" },
          { id: "vault_half_on", name: "Half\u2011On Vault", level: 3, description: "Half\u2011turn entry onto vault.", link: "" },
          { id: "vault_front_handspring", name: "Front Handspring Vault", level: 3, description: "Full handspring vault with landing.", link: "" },
          { id: "vault_tsukahara_prep", name: "Tsukahara Prep", level: 4, description: "Quarter\u2011on, back salto preparation.", link: "" },
          { id: "vault_yurchenko_prep", name: "Yurchenko Prep", level: 4, description: "Roundoff entry onto springboard.", link: "" },
          { id: "vault_advanced", name: "Advanced Vaults", level: 4, description: "Twisting and salto vault variations.", link: "" }
        ]
      }
    ]
  }
];

// worker/templates/sports/dancing.js
var dancingTemplates = [
  {
    id: "dancing",
    name: "Dancing",
    classSessions: [],
    // ⭐ Levels
    levels: [
      { id: "dancing_level_1", value: 1, label: "Beginner" },
      { id: "dancing_level_2", value: 2, label: "Intermediate" },
      { id: "dancing_level_3", value: 3, label: "Advanced" }
    ],
    // ⭐ Routine validation rules (NEW)
    routineRules: {
      1: { min: 4, max: 6 },
      // Beginner
      2: { min: 6, max: 8 },
      // Intermediate
      3: { min: 8, max: 10 },
      // Advanced
      4: { min: 10, max: 14 }
      // Elite
    },
    uiLabels: {
      routineName: "Routine",
      routinePlural: "Routines",
      categoryName: "Style",
      categoryPlural: "Styles"
    },
    categories: [
      // ⭐ BALLET
      {
        id: "ballet",
        name: "Ballet",
        description: "",
        routines: [],
        skills: [
          // Beginner
          { id: "ballet_posture", name: "Posture", level: 1, description: "Basic alignment and balance.", link: "" },
          { id: "ballet_plie", name: "Pli\xE9", level: 1, description: "Bending of the knees while maintaining turnout.", link: "" },
          { id: "ballet_releve", name: "Relev\xE9", level: 1, description: "Rise onto the balls of the feet with balance.", link: "" },
          { id: "ballet_tendu", name: "Tendu", level: 1, description: "Brush the foot along the floor to a pointed position.", link: "" },
          { id: "ballet_chasse", name: "Chass\xE9", level: 1, description: "Sliding step where one foot chases the other.", link: "" },
          // Intermediate
          { id: "ballet_turns", name: "Turns", level: 2, description: "Spotting and rotational control.", link: "" },
          { id: "ballet_arabesque", name: "Arabesque", level: 2, description: "Balance with one leg extended behind the body.", link: "" },
          { id: "ballet_pirouette_prep", name: "Pirouette Prep", level: 2, description: "Preparation position for turning on one leg.", link: "" },
          { id: "ballet_jete", name: "Jet\xE9", level: 2, description: "Leap from one foot to the other.", link: "" },
          // Advanced
          { id: "ballet_leaps", name: "Leaps", level: 3, description: "Power and extension in jumps.", link: "" },
          { id: "ballet_pirouette", name: "Pirouette", level: 3, description: "Full turn on one leg using spotting technique.", link: "" },
          { id: "ballet_grand_battement", name: "Grand Battement", level: 3, description: "High straight\u2011leg kick with control.", link: "" },
          { id: "ballet_adagio_sequence", name: "Adagio Sequence", level: 3, description: "Slow, controlled movements demonstrating balance.", link: "" }
        ]
      },
      // ⭐ TAP
      {
        id: "tap",
        name: "Tap",
        description: "",
        routines: [],
        skills: [
          // Beginner
          { id: "tap_posture", name: "Posture", level: 1, description: "Basic alignment and balance.", link: "" },
          { id: "tap_toe_tap", name: "Toe Tap", level: 1, description: "Tap the toe of the shoe on the floor.", link: "" },
          { id: "tap_heel_dig", name: "Heel Dig", level: 1, description: "Strike the heel into the floor.", link: "" },
          { id: "tap_shuffle", name: "Shuffle", level: 1, description: "Brush forward and backward with the ball of the foot.", link: "" },
          { id: "tap_ball_change", name: "Ball Change", level: 1, description: "Quick weight transfer between feet.", link: "" },
          // Intermediate
          { id: "tap_turns", name: "Turns", level: 2, description: "Spotting and rotational control.", link: "" },
          { id: "tap_flap", name: "Flap", level: 2, description: "Brush forward and step onto the ball of the foot.", link: "" },
          { id: "tap_cramp_roll", name: "Cramp Roll", level: 2, description: "Heel\u2011toe sequence creating a rolling sound.", link: "" },
          { id: "tap_time_step", name: "Time Step", level: 2, description: "Foundational tap rhythm repeated in counts.", link: "" },
          // Advanced
          { id: "tap_leaps", name: "Leaps", level: 3, description: "Power and extension in jumps.", link: "" },
          { id: "tap_pullback", name: "Pullback", level: 3, description: "Jump backward while brushing both feet.", link: "" },
          { id: "tap_wings", name: "Wings", level: 3, description: "Outward brush and return while jumping.", link: "" },
          { id: "tap_advanced_time_step", name: "Advanced Time Step", level: 3, description: "Complex rhythmic variation of the basic time step.", link: "" }
        ]
      },
      // ⭐ MODERN / CONTEMPORARY
      {
        id: "modern",
        name: "Modern",
        description: "",
        routines: [],
        skills: [
          // Beginner
          { id: "modern_posture", name: "Posture", level: 1, description: "Basic alignment and balance.", link: "" },
          { id: "modern_contract_release", name: "Contract and Release", level: 1, description: "Controlled tightening and expansion of the torso.", link: "" },
          { id: "modern_spiral_roll", name: "Spiral Roll", level: 1, description: "Rolling movement initiated from the spine.", link: "" },
          { id: "modern_floor_slide", name: "Floor Slide", level: 1, description: "Smooth travelling movement across the floor.", link: "" },
          // Intermediate
          { id: "modern_turns", name: "Turns", level: 2, description: "Spotting and rotational control.", link: "" },
          { id: "modern_suspension", name: "Suspension", level: 2, description: "Movement held at the peak before release.", link: "" },
          { id: "modern_fall_recovery", name: "Fall and Recovery", level: 2, description: "Controlled descent and return to standing.", link: "" },
          { id: "modern_improvisation_task", name: "Improvisation Task", level: 2, description: "Creative movement exploration using prompts.", link: "" },
          // Advanced
          { id: "modern_leaps", name: "Leaps", level: 3, description: "Power and extension in jumps.", link: "" },
          { id: "modern_leap_curve", name: "Leap with Curve", level: 3, description: "Modern leap with curved torso line.", link: "" },
          { id: "modern_floorwork_sequence", name: "Floorwork Sequence", level: 3, description: "Linked movements performed on the floor.", link: "" },
          { id: "modern_release_phrase", name: "Release Technique Phrase", level: 3, description: "Phrase using momentum and breath to initiate movement.", link: "" }
        ]
      }
    ]
  }
];

// worker/templates/sports/swimming.js
var swimmingTemplates = [
  {
    id: "swimming",
    name: "Swimming",
    classSessions: [],
    // ⭐ Levels
    levels: [
      { id: "swim_stage_1", value: 1, label: "Stage 1" },
      { id: "swim_stage_2", value: 2, label: "Stage 2" },
      { id: "swim_stage_3", value: 3, label: "Stage 3" },
      { id: "swim_stage_4", value: 4, label: "Stage 4" },
      { id: "swim_stage_5", value: 5, label: "Stage 5" },
      { id: "swim_stage_6", value: 6, label: "Stage 6" },
      { id: "swim_stage_7", value: 7, label: "Stage 7" },
      { id: "swim_bronze", value: 8, label: "Bronze" },
      { id: "swim_silver", value: 9, label: "Silver" },
      { id: "swim_gold", value: 10, label: "Gold" }
    ],
    uiLabels: {
      learnToSwim: {
        routineName: "Sequence",
        routinePlural: "Sequences",
        categoryName: "Stage",
        categoryPlural: "Stages"
      },
      club: {
        routineName: "Stroke Set",
        routinePlural: "Stroke Sets",
        categoryName: "Stroke",
        categoryPlural: "Strokes"
      }
    },
    routineRules: {
      1: { min: 3, max: 5 },
      // Stage 1
      2: { min: 3, max: 5 },
      // Stage 2
      3: { min: 4, max: 6 },
      // Stage 3
      4: { min: 4, max: 6 },
      // Stage 4
      5: { min: 5, max: 8 },
      // Stage 5
      6: { min: 6, max: 10 },
      // Stage 6
      7: { min: 6, max: 10 },
      // Stage 7
      8: { min: 6, max: 12 },
      // Bronze
      9: { min: 6, max: 12 },
      // Silver
      10: { min: 6, max: 12 }
      // Gold
    },
    categories: [
      // ⭐ STAGE 1
      {
        id: "swim_stage1",
        name: "Stage 1",
        description: "Introduction to water confidence and basic movement.",
        routines: [],
        skills: [
          { id: "swim_confidence", name: "Water Confidence", level: 1, description: "Comfortable entering and exiting the water.", link: "" },
          { id: "swim_face_water", name: "Face in Water", level: 1, description: "Blowing bubbles and submerging face.", link: "" },
          { id: "swim_front_float", name: "Front Float", level: 1, description: "Supported front float position.", link: "" },
          { id: "swim_back_float", name: "Back Float", level: 1, description: "Supported back float position.", link: "" },
          { id: "swim_push_glide", name: "Push and Glide", level: 1, description: "Basic glide from poolside.", link: "" }
        ]
      },
      // ⭐ STAGE 2
      {
        id: "swim_stage2",
        name: "Stage 2",
        description: "Developing independent movement and floating.",
        routines: [],
        skills: [
          { id: "swim_independent_float", name: "Independent Float", level: 2, description: "Front and back float without support.", link: "" },
          { id: "swim_kick_practice", name: "Kick Practice", level: 2, description: "Basic flutter kick with support.", link: "" },
          { id: "swim_streamlined_glide", name: "Streamlined Glide", level: 2, description: "Push and glide with streamlined body.", link: "" },
          { id: "swim_rotation", name: "Rotation", level: 2, description: "Front-to-back and back-to-front rotation.", link: "" },
          { id: "swim_travel_5m", name: "Travel 5m", level: 2, description: "Move through water for 5 metres.", link: "" }
        ]
      },
      // ⭐ STAGE 3
      {
        id: "swim_stage3",
        name: "Stage 3",
        description: "Introducing basic stroke techniques.",
        routines: [],
        skills: [
          { id: "swim_fc_kick", name: "Front Crawl Kick", level: 3, description: "Flutter kick with board.", link: "" },
          { id: "swim_back_kick", name: "Backstroke Kick", level: 3, description: "Back kick with board.", link: "" },
          { id: "swim_arm_recovery", name: "Arm Recovery", level: 3, description: "Front crawl arm recovery over water.", link: "" },
          { id: "swim_body_position", name: "Body Position", level: 3, description: "Horizontal body alignment.", link: "" },
          { id: "swim_travel_10m", name: "Travel 10m", level: 3, description: "Swim 10 metres unaided.", link: "" }
        ]
      },
      // ⭐ STAGE 4
      {
        id: "swim_stage4",
        name: "Stage 4",
        description: "Developing all four strokes.",
        routines: [],
        skills: [
          { id: "swim_fc_arms", name: "Front Crawl Arms", level: 4, description: "Full front crawl arm cycle.", link: "" },
          { id: "swim_back_arms", name: "Backstroke Arms", level: 4, description: "Full backstroke arm cycle.", link: "" },
          { id: "swim_br_kick", name: "Breaststroke Kick", level: 4, description: "Basic whip kick.", link: "" },
          { id: "swim_bf_kick", name: "Butterfly Kick", level: 4, description: "Dolphin kick introduction.", link: "" },
          { id: "swim_travel_15m", name: "Travel 15m", level: 4, description: "Swim 15 metres in one stroke.", link: "" }
        ]
      },
      // ⭐ STAGE 5
      {
        id: "swim_stage5",
        name: "Stage 5",
        description: "Improving technique and breathing.",
        routines: [],
        skills: [
          { id: "swim_fc_breathing", name: "Front Crawl Breathing", level: 5, description: "Side breathing technique.", link: "" },
          { id: "swim_back_timing", name: "Backstroke Timing", level: 5, description: "Arm and kick coordination.", link: "" },
          { id: "swim_br_timing", name: "Breaststroke Timing", level: 5, description: "Pull-kick-glide sequence.", link: "" },
          { id: "swim_bf_rhythm", name: "Butterfly Rhythm", level: 5, description: "Kick-arm timing.", link: "" },
          { id: "swim_travel_25m", name: "Travel 25m", level: 5, description: "Swim 25 metres with good form.", link: "" },
          // ⭐ Additional Stage 5 skills
          { id: "swim_flat_scull_back", name: "Flat Scull on Back", level: 5, description: "Stationary sculling action on back.", link: "" },
          { id: "swim_feet_first_scull", name: "Feet First Scull 5m", level: 5, description: "Travel 5m using feet-first sculling.", link: "" },
          { id: "swim_partner_scull", name: "Partner Sculling Sequence", level: 5, description: "Scull and rotate with partner.", link: "" },
          { id: "swim_tread_30s", name: "Tread Water 30s", level: 5, description: "Tread water for 30 seconds.", link: "" },
          { id: "swim_three_jump_shapes", name: "Three Jump Shapes", level: 5, description: "Perform three safe jump shapes.", link: "" },
          { id: "swim_backstroke_10m", name: "Backstroke 10m", level: 5, description: "Swim 10m backstroke.", link: "" },
          { id: "swim_fc_10m", name: "Front Crawl 10m", level: 5, description: "Swim 10m front crawl.", link: "" },
          { id: "swim_br_10m", name: "Breaststroke 10m", level: 5, description: "Swim 10m breaststroke.", link: "" },
          { id: "swim_bf_10m", name: "Butterfly 10m", level: 5, description: "Swim 10m butterfly.", link: "" },
          { id: "swim_handstand", name: "Handstand Hold", level: 5, description: "Hold handstand for 3 seconds.", link: "" },
          { id: "swim_forward_somersault", name: "Forward Somersault", level: 5, description: "Controlled forward somersault.", link: "" },
          { id: "swim_get_help", name: "Get Help Action", level: 5, description: "Demonstrate safe signalling for help.", link: "" }
        ]
      },
      // ⭐ STAGE 6
      {
        id: "swim_stage6",
        name: "Stage 6",
        description: "Building stamina and efficiency.",
        routines: [],
        skills: [
          { id: "swim_fc_efficient", name: "Efficient Front Crawl", level: 6, description: "High elbow catch and streamlined breathing.", link: "" },
          { id: "swim_back_efficient", name: "Efficient Backstroke", level: 6, description: "Consistent rotation and arm recovery.", link: "" },
          { id: "swim_br_glide", name: "Breaststroke Glide", level: 6, description: "Extended glide phase.", link: "" },
          { id: "swim_bf_arms", name: "Butterfly Arms", level: 6, description: "Full arm cycle with rhythm.", link: "" },
          { id: "swim_travel_50m", name: "Travel 50m", level: 6, description: "Swim 50 metres continuously.", link: "" },
          // ⭐ Additional Stage 6 skills
          { id: "swim_exercise_prep", name: "Exercise Preparation", level: 6, description: "Explain two examples of preparing for exercise.", link: "" },
          { id: "swim_back_rotation_seq", name: "Backstroke Rotation Sequence", level: 6, description: "Sink, push off, glide, kick, rotate.", link: "" },
          { id: "swim_fc_rotation_seq", name: "Front Crawl Rotation Sequence", level: 6, description: "Sink, push off, glide, kick, rotate.", link: "" },
          { id: "swim_clothing_10m", name: "Swim 10m in Clothing", level: 6, description: "Swim 10m wearing light clothing.", link: "" },
          { id: "swim_fc_breath_pattern", name: "Front Crawl Breathing Pattern", level: 6, description: "Swim with at least six rhythmical breaths.", link: "" },
          { id: "swim_br_breath_pattern", name: "Breaststroke Breathing Pattern", level: 6, description: "Swim with at least six rhythmical breaths.", link: "" },
          { id: "swim_bf_breath_pattern", name: "Butterfly Breathing Pattern", level: 6, description: "Swim with at least three rhythmical breaths.", link: "" },
          { id: "swim_back_breath_pattern", name: "Backstroke Breathing Pattern", level: 6, description: "Swim with at least six regular breaths.", link: "" },
          { id: "swim_travel_25m", name: "Swim 25m", level: 6, description: "Swim 25m with consistent technique.", link: "" },
          { id: "swim_shout_signal", name: "Shout and Signal Rescue", level: 6, description: "Perform safe shout-and-signal rescue.", link: "" },
          { id: "swim_surface_dive", name: "Surface Dive", level: 6, description: "Controlled surface dive.", link: "" }
        ]
      },
      // ⭐ STAGE 7
      {
        id: "swim_stage7",
        name: "Stage 7",
        description: "Pre\u2011club swimming skills.",
        routines: [],
        skills: [
          { id: "swim_fc_100m", name: "Front Crawl 100m", level: 7, description: "Efficient long\u2011distance front crawl.", link: "" },
          { id: "swim_back_100m", name: "Backstroke 100m", level: 7, description: "Consistent long\u2011distance backstroke.", link: "" },
          { id: "swim_br_50m", name: "Breaststroke 50m", level: 7, description: "Strong breaststroke technique.", link: "" },
          { id: "swim_bf_25m", name: "Butterfly 25m", level: 7, description: "Controlled butterfly stroke.", link: "" },
          { id: "swim_water_safety", name: "Water Safety Skills", level: 7, description: "Treading water, safe entries, survival float.", link: "" },
          // ⭐ Additional Stage 7 skills
          { id: "swim_back_25m", name: "Backstroke 25m", level: 7, description: "Swim 25m backstroke.", link: "" },
          { id: "swim_fc_25m", name: "Front Crawl 25m", level: 7, description: "Swim 25m front crawl.", link: "" },
          { id: "swim_br_25m", name: "Breaststroke 25m", level: 7, description: "Swim 25m breaststroke.", link: "" },
          { id: "swim_bf_25m_extra", name: "Butterfly 25m", level: 7, description: "Swim 25m butterfly.", link: "" },
          { id: "swim_movement_1min", name: "Movement Sequence (1 minute)", level: 7, description: "One\u2011minute group sequence.", link: "" },
          { id: "swim_dive", name: "Sitting Dive or Dive", level: 7, description: "Perform safe dive entry.", link: "" },
          { id: "swim_50m_continuous", name: "Swim 50m Continuous", level: 7, description: "Swim 50m continuously.", link: "" },
          { id: "swim_100m_3strokes", name: "Swim 100m (3 Strokes)", level: 7, description: "Swim 100m using three strokes.", link: "" },
          { id: "swim_eggbeater_30s", name: "Eggbeater 30s", level: 7, description: "Eggbeater kick for 30 seconds.", link: "" },
          { id: "swim_obstacle_course", name: "Obstacle Course", level: 7, description: "Complete obstacle course.", link: "" }
        ]
      },
      // ⭐ AWARDS
      {
        id: "swim_awards",
        name: "Awards",
        description: "Bronze, Silver and Gold distance awards.",
        routines: [],
        skills: [
          { id: "swim_award_bronze", name: "Bronze Award", level: 8, description: "Demonstrate stamina and safe technique.", link: "" },
          { id: "swim_award_silver", name: "Silver Award", level: 9, description: "Improved distance and stroke control.", link: "" },
          { id: "swim_award_gold", name: "Gold Award", level: 10, description: "Advanced stamina and multi\u2011stroke proficiency.", link: "" }
        ]
      }
    ]
  }
];

// worker/templates/sports/football.js
var footballTemplates = [
  {
    id: "football",
    name: "Football",
    classSessions: [],
    // ⭐ All levels defined ONCE here
    levels: [
      { id: "football_u6", value: 1, label: "U6" },
      { id: "football_u7", value: 2, label: "U7" },
      { id: "football_u8", value: 3, label: "U8" },
      { id: "football_u9", value: 4, label: "U9" },
      { id: "football_u10", value: 5, label: "U10" },
      { id: "football_u11", value: 6, label: "U11" },
      { id: "football_u12", value: 7, label: "U12" },
      { id: "football_u13", value: 8, label: "U13" },
      { id: "football_u14", value: 9, label: "U14" },
      { id: "football_u15", value: 10, label: "U15" },
      { id: "football_u16", value: 11, label: "U16" }
    ],
    // ⭐ NEW — Routine validation rules
    routineRules: {
      1: { min: 2, max: 4 },
      // U6
      2: { min: 2, max: 4 },
      // U7
      3: { min: 3, max: 5 },
      // U8
      4: { min: 3, max: 6 },
      // U9
      5: { min: 4, max: 6 },
      // U10
      6: { min: 4, max: 7 },
      // U11
      7: { min: 5, max: 7 },
      // U12
      8: { min: 5, max: 8 },
      // U13
      9: { min: 6, max: 8 },
      // U14
      10: { min: 6, max: 9 },
      // U15
      11: { min: 6, max: 9 }
      // U16
    },
    uiLabels: {
      routineName: "Drill",
      routinePlural: "Drills",
      categoryName: "Skill Group",
      categoryPlural: "Skill Groups"
    },
    categories: [
      {
        id: "football_skills",
        name: "Skills",
        description: "",
        routines: [],
        skills: [
          {
            id: "football_dribbling",
            name: "Dribbling",
            level: 1,
            description: "Ball control while moving",
            link: ""
          },
          {
            id: "football_passing",
            name: "Passing",
            level: 1,
            description: "Short and long passing accuracy",
            link: ""
          },
          {
            id: "football_shooting",
            name: "Shooting",
            level: 2,
            description: "Striking technique and power",
            link: ""
          },
          {
            id: "football_tackling",
            name: "Tackling",
            level: 2,
            description: "Defensive footwork and timing",
            link: ""
          }
        ]
      }
    ]
  }
];

// worker/templates/sports/martialArts.js
var martialArtsTemplates = [
  {
    id: "martial_arts",
    name: "Martial Arts",
    classSessions: [],
    // ⭐ Belt levels
    levels: [
      { id: "ma_white_belt", value: 1, label: "White Belt" },
      { id: "ma_yellow_belt", value: 2, label: "Yellow Belt" },
      { id: "ma_orange_belt", value: 3, label: "Orange Belt" },
      { id: "ma_green_belt", value: 4, label: "Green Belt" },
      { id: "ma_blue_belt", value: 5, label: "Blue Belt" },
      { id: "ma_purple_belt", value: 6, label: "Purple Belt" },
      { id: "ma_brown_belt", value: 7, label: "Brown Belt" },
      { id: "ma_red_belt", value: 8, label: "Red Belt" },
      { id: "ma_black_belt_1", value: 9, label: "Black Belt (1st Dan)" },
      { id: "ma_black_belt_2", value: 10, label: "Black Belt (2nd Dan)" },
      { id: "ma_black_belt_3", value: 11, label: "Black Belt (3rd Dan)" },
      { id: "ma_black_belt_4", value: 12, label: "Black Belt (4th Dan)" },
      { id: "ma_black_belt_5", value: 13, label: "Black Belt (5th Dan)" },
      { id: "ma_black_belt_6", value: 14, label: "Black Belt (6th Dan)" },
      { id: "ma_black_belt_7", value: 15, label: "Black Belt (7th Dan)" },
      { id: "ma_black_belt_8", value: 16, label: "Black Belt (8th Dan)" },
      { id: "ma_black_belt_9", value: 17, label: "Black Belt (9th Dan)" },
      { id: "ma_black_belt_10", value: 18, label: "Black Belt (10th Dan)" }
    ],
    routineRules: {
      1: { min: 3, max: 5 },
      // White Belt
      2: { min: 3, max: 5 },
      // Yellow Belt
      3: { min: 3, max: 5 },
      // Orange Belt
      4: { min: 4, max: 6 },
      // Green Belt
      5: { min: 4, max: 6 },
      // Blue Belt
      6: { min: 4, max: 6 },
      // Purple Belt
      7: { min: 5, max: 7 },
      // Brown Belt
      8: { min: 5, max: 7 },
      // Red Belt
      9: { min: 6, max: 10 },
      // Black Belt (1st Dan)
      10: { min: 6, max: 10 },
      // Black Belt (2nd Dan)
      11: { min: 6, max: 10 },
      // Black Belt (3rd Dan)
      12: { min: 6, max: 10 },
      // Black Belt (4th Dan)
      13: { min: 6, max: 10 },
      // Black Belt (5th Dan)
      14: { min: 6, max: 10 },
      // Black Belt (6th Dan)
      15: { min: 6, max: 10 },
      // Black Belt (7th Dan)
      16: { min: 6, max: 10 },
      // Black Belt (8th Dan)
      17: { min: 6, max: 10 },
      // Black Belt (9th Dan)
      18: { min: 6, max: 10 }
      // Black Belt (10th Dan)
    },
    uiLabels: {
      routineName: "Combination",
      routinePlural: "Combinations",
      categoryName: "Discipline",
      categoryPlural: "Disciplines"
    },
    categories: [
      // ⭐ STRIKING
      {
        id: "ma_striking",
        name: "Striking",
        description: "",
        routines: [],
        skills: [
          {
            id: "ma_jab",
            name: "Jab",
            level: 1,
            description: "Basic straight punch",
            link: ""
          },
          {
            id: "ma_roundhouse_kick",
            name: "Roundhouse Kick",
            level: 2,
            description: "Hip rotation and balance",
            link: ""
          }
        ]
      },
      // ⭐ GRAPPLING
      {
        id: "ma_grappling",
        name: "Grappling",
        description: "",
        routines: [],
        skills: [
          {
            id: "ma_breakfall",
            name: "Breakfall",
            level: 1,
            description: "Safe falling technique",
            link: ""
          },
          {
            id: "ma_guard_pass",
            name: "Guard Pass",
            level: 3,
            description: "Control and transition",
            link: ""
          }
        ]
      }
    ]
  }
];

// worker/templates/sports/tennis.js
var tennisTemplates = [
  {
    id: "tennis",
    name: "Tennis",
    classSessions: [],
    levels: [
      { id: "tennis_beginner", value: 1, label: "Beginner" },
      { id: "tennis_improver", value: 2, label: "Improver" },
      { id: "tennis_club", value: 3, label: "Club" },
      { id: "tennis_performance", value: 4, label: "Performance" }
    ],
    routineRules: {
      1: { min: 3, max: 5 },
      // Beginner
      2: { min: 4, max: 6 },
      // Improver
      3: { min: 5, max: 7 },
      // Club
      4: { min: 6, max: 8 }
      // Performance
    },
    skills: [
      {
        id: "tennis_forehand",
        name: "Forehand",
        level: 1,
        description: "Basic forehand stroke",
        link: ""
      },
      {
        id: "tennis_backhand",
        name: "Backhand",
        level: 1,
        description: "Two-handed backhand fundamentals",
        link: ""
      },
      {
        id: "tennis_serve",
        name: "Serve",
        level: 2,
        description: "Toss, rotation, and contact",
        link: ""
      }
    ]
  }
];

// worker/templates/sportsData.js
var DEFAULT_TEMPLATES = [
  ...gymnasticsTemplates,
  ...dancingTemplates,
  ...swimmingTemplates,
  ...footballTemplates,
  ...martialArtsTemplates,
  ...tennisTemplates
];

// worker/templates/rewardsData.js
var DEFAULT_REWARDS = [
  { templateId: "pocket-money", name: "Pocket Money", category: "Pocket Money", emoji: "\u{1F4B7}", cost: 5, amount: 1, type: "pocketMoney", repeatable: true },
  { templateId: "reward-movie", name: "Movie / Film / TV", category: "Movie", emoji: "\u{1F3AC}", cost: 25, repeatable: true },
  { templateId: "reward-outdoor", name: "Outdoor / Park / Nature", category: "Outdoor", emoji: "\u{1F333}", cost: 15, repeatable: true },
  { templateId: "reward-food", name: "Food / Dinner / Meal Choice", category: "Food", emoji: "\u{1F37D}\uFE0F", cost: 20, repeatable: true },
  { templateId: "reward-treat", name: "Sweets / Treats", category: "Treat", emoji: "\u{1F36D}", cost: 3, repeatable: true },
  { templateId: "reward-sticker", name: "Stickers / Small Rewards", category: "Sticker", emoji: "\u2B50", cost: 1, repeatable: true },
  { templateId: "reward-reading", name: "Magazine / Book / Reading", category: "Reading", emoji: "\u{1F4DA}", cost: 5, repeatable: true },
  { templateId: "reward-screen-time", name: "Screen Time / Games", category: "Screen Time", emoji: "\u{1F3AE}", cost: 10, repeatable: true },
  { templateId: "reward-toy-shop", name: "Toy Shop Visit (\xA330+)", category: "Shopping", emoji: "\u{1F6CD}\uFE0F", cost: 150, repeatable: true },
  { templateId: "reward-bedtime", name: "Bedtime Pass / Stay Up Late", category: "Bedtime", emoji: "\u{1F6CC}", cost: 10, repeatable: true },
  { templateId: "reward-event", name: "Special Event / Celebration", category: "Event", emoji: "\u{1F389}", cost: 75, repeatable: true },
  { templateId: "reward-trip", name: "Trip / Outing", category: "Trip", emoji: "\u{1F697}", cost: 100, repeatable: true },
  { templateId: "reward-craft", name: "Craft / Creative Activity", category: "Craft", emoji: "\u{1F3A8}", cost: 10, repeatable: true },
  { templateId: "reward-achievement", name: "Achievement\u2011based Reward", category: "Achievement", emoji: "\u{1F3C6}", cost: 100, repeatable: true },
  { templateId: "reward-baking", name: "Baking / Cooking Together", category: "Baking", emoji: "\u{1F9C1}", cost: 12, repeatable: true },
  { templateId: "reward-puzzle", name: "Puzzle / Board Game", category: "Puzzle", emoji: "\u{1F9E9}", cost: 25, repeatable: true },
  { templateId: "reward-pet", name: "Pet\u2011related Reward", category: "Pet", emoji: "\u{1F43E}", cost: 15, repeatable: true }
];

// worker/piper-worker.js
async function seedRewards(env) {
  const list = await env.GLOBAL_REWARDS.list();
  const existing = new Set(list.keys.map((k) => k.name));
  for (const reward of DEFAULT_REWARDS) {
    const key = `${reward.templateId}.json`;
    if (!existing.has(key)) {
      await env.GLOBAL_REWARDS.put(key, JSON.stringify(reward));
    }
  }
}
__name(seedRewards, "seedRewards");
function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };
}
__name(cors, "cors");
function upsertById(list, item) {
  const i = list.findIndex((x) => x.id === item.id);
  if (i >= 0) list[i] = item;
  else list.push(item);
}
__name(upsertById, "upsertById");
function jsonError(message, status) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...cors(), "Content-Type": "application/json" }
  });
}
__name(jsonError, "jsonError");
async function findTemplate(env, templateId) {
  const list = await env.GLOBAL_TEMPLATES.list();
  for (const k of list.keys) {
    const template = await env.GLOBAL_TEMPLATES.get(k.name, "json");
    if (template?.id === templateId) return { key: k.name, template };
  }
  return null;
}
__name(findTemplate, "findTemplate");
function mergeMissing(current, def) {
  let changed = false;
  const addMissing = /* @__PURE__ */ __name((target, source) => {
    const ids = new Set(target.map((x) => x.id));
    for (const item of source || []) {
      if (!ids.has(item.id)) {
        target.push(item);
        changed = true;
      }
    }
  }, "addMissing");
  if (!current.routineRules && def.routineRules) {
    current.routineRules = def.routineRules;
    changed = true;
  }
  if (!current.uiLabels && def.uiLabels) {
    current.uiLabels = def.uiLabels;
    changed = true;
  }
  current.levels = current.levels || [];
  addMissing(current.levels, def.levels);
  current.categories = current.categories || [];
  addMissing(current.categories, def.categories);
  for (const defCat of def.categories || []) {
    const cat = current.categories.find((c) => c.id === defCat.id);
    if (!cat) continue;
    if (!cat.routineRules && defCat.routineRules) {
      cat.routineRules = defCat.routineRules;
      changed = true;
    }
    cat.skills = cat.skills || [];
    cat.routines = cat.routines || [];
    addMissing(cat.skills, defCat.skills);
    addMissing(cat.routines, defCat.routines);
  }
  return changed;
}
__name(mergeMissing, "mergeMissing");
var piper_worker_default = {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    if (method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors() });
    }
    if (path === "/" && method === "GET") {
      return new Response("Piper Tracker KV backend is running!", {
        status: 200,
        headers: { ...cors(), "Content-Type": "text/plain" }
      });
    }
    if (method === "GET" && path === "/api/templates") {
      const list = await env.GLOBAL_TEMPLATES.list();
      const stored = /* @__PURE__ */ new Map();
      await Promise.all(
        list.keys.map(async (k) => {
          stored.set(k.name, await env.GLOBAL_TEMPLATES.get(k.name, "json"));
        })
      );
      for (const def of DEFAULT_TEMPLATES) {
        const key = `${def.name.toLowerCase()}.json`;
        const current = stored.get(key);
        if (!current) {
          await env.GLOBAL_TEMPLATES.put(key, JSON.stringify(def));
          stored.set(key, def);
          continue;
        }
        if (mergeMissing(current, def)) {
          await env.GLOBAL_TEMPLATES.put(key, JSON.stringify(current));
        }
      }
      const templates = [...stored.values()].filter(Boolean);
      return new Response(JSON.stringify(templates), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "POST" && path === "/api/update/template") {
      const template = await request.json();
      if (!template?.id) return jsonError("Template id required", 400);
      const found = await findTemplate(env, template.id);
      const key = found?.key ?? `${String(template.name || template.id).toLowerCase()}.json`;
      await env.GLOBAL_TEMPLATES.put(key, JSON.stringify(template));
      return new Response(JSON.stringify({ status: "updated", id: template.id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "DELETE" && path.startsWith("/api/templates/")) {
      const id = path.split("/")[3];
      const list = await env.GLOBAL_TEMPLATES.list();
      let deletedFile = null;
      for (const item of list.keys) {
        const data = await env.GLOBAL_TEMPLATES.get(item.name, { type: "json" });
        if (data && data.id === id) {
          deletedFile = item.name;
          break;
        }
      }
      if (deletedFile) {
        await env.GLOBAL_TEMPLATES.delete(deletedFile);
        return new Response(JSON.stringify({ deleted: id }), {
          status: 200,
          headers: { ...cors(), "Content-Type": "application/json" }
        });
      }
      return new Response(JSON.stringify({ error: "Template not found" }), {
        status: 404,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "POST" && path === "/api/submit/sport") {
      const body = await request.json();
      const id = crypto.randomUUID();
      await env.GLOBAL_SUBMISSIONS.put(
        `pendingSports/${id}.json`,
        JSON.stringify({ id, ...body })
      );
      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "POST" && path === "/api/submit/skill") {
      const body = await request.json();
      const id = crypto.randomUUID();
      await env.GLOBAL_SUBMISSIONS.put(
        `pendingSkills/${id}.json`,
        JSON.stringify({ id, ...body })
      );
      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "POST" && path === "/api/submit/routine") {
      const body = await request.json();
      const id = body.routine?.id || crypto.randomUUID();
      await env.GLOBAL_SUBMISSIONS.put(
        `pendingRoutines/${id}.json`,
        JSON.stringify({ ...body, id })
      );
      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "POST" && path === "/api/submit/category") {
      const body = await request.json();
      const id = body.category?.id || crypto.randomUUID();
      await env.GLOBAL_SUBMISSIONS.put(
        `pendingCategories/${id}.json`,
        JSON.stringify({ ...body, id })
      );
      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "GET" && path === "/api/rewards") {
      const q = (url.searchParams.get("q") || "").trim().toLowerCase();
      await seedRewards(env);
      const list = await env.GLOBAL_REWARDS.list();
      const rewards = [];
      for (const k of list.keys) {
        const data = await env.GLOBAL_REWARDS.get(k.name, "json");
        if (!data?.name) continue;
        if (q && !data.name.toLowerCase().includes(q)) continue;
        rewards.push(data);
        if (rewards.length >= 20) break;
      }
      return new Response(JSON.stringify(rewards), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "POST" && path === "/api/submit/reward") {
      const body = await request.json();
      const id = body.reward?.templateId || body.reward?.id || crypto.randomUUID();
      await env.GLOBAL_SUBMISSIONS.put(`pendingRewards/${id}.json`, JSON.stringify({ ...body, id }));
      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "GET" && path === "/api/pending/rewards") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingRewards/" });
      const items = await Promise.all(list.keys.map((k) => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "POST" && path === "/api/approve/reward") {
      const { reward } = await request.json();
      if (!reward?.templateId) return jsonError("Reward needs a templateId", 400);
      await env.GLOBAL_REWARDS.put(`${reward.templateId}.json`, JSON.stringify(reward));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "DELETE" && path.startsWith("/api/pending/rewards/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingRewards/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "GET" && path === "/api/clubs") {
      const q = (url.searchParams.get("q") || "").trim().toLowerCase();
      const sportName = (url.searchParams.get("sport") || "").trim().toLowerCase();
      const list = await env.GLOBAL_CLUBS.list();
      const clubs = [];
      for (const k of list.keys) {
        const data = await env.GLOBAL_CLUBS.get(k.name, "json");
        if (!data?.name) continue;
        if (q && !data.name.toLowerCase().includes(q)) continue;
        if (sportName && data.sport && data.sport.toLowerCase() !== sportName) continue;
        clubs.push(data);
        if (clubs.length >= 20) break;
      }
      return new Response(JSON.stringify(clubs), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "POST" && path === "/api/submit/club") {
      const body = await request.json();
      const id = crypto.randomUUID();
      await env.GLOBAL_SUBMISSIONS.put(
        `pendingClubs/${id}.json`,
        JSON.stringify({ id, ...body })
      );
      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "POST" && path === "/api/submit/club-update") {
      const body = await request.json();
      const id = crypto.randomUUID();
      await env.GLOBAL_SUBMISSIONS.put(
        `pendingClubUpdates/${id}.json`,
        JSON.stringify({ id, ...body })
      );
      return new Response(JSON.stringify({ status: "pending", id }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "GET" && path === "/api/pending/sports") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingSports/" });
      const items = await Promise.all(list.keys.map((k) => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "GET" && path === "/api/pending/skills") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingSkills/" });
      const items = await Promise.all(list.keys.map((k) => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "GET" && path === "/api/pending/routines") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingRoutines/" });
      const items = await Promise.all(list.keys.map((k) => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "GET" && path === "/api/pending/categories") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingCategories/" });
      const items = await Promise.all(list.keys.map((k) => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "GET" && path === "/api/pending/clubs") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingClubs/" });
      const items = await Promise.all(list.keys.map((k) => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "GET" && path === "/api/pending/club-updates") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingClubUpdates/" });
      const items = await Promise.all(list.keys.map((k) => env.GLOBAL_SUBMISSIONS.get(k.name, "json")));
      return new Response(JSON.stringify(items), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "POST" && path === "/api/approve/sport") {
      const { sport } = await request.json();
      await env.GLOBAL_TEMPLATES.put(`${sport.name.toLowerCase()}.json`, JSON.stringify(sport));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "POST" && path === "/api/approve/skill") {
      const { templateId, categoryId, skill } = await request.json();
      const found = await findTemplate(env, templateId);
      const category = found?.template.categories.find((c) => c.id === categoryId);
      if (!category) return jsonError("Sport or category not found", 404);
      category.skills = category.skills || [];
      upsertById(category.skills, skill);
      await env.GLOBAL_TEMPLATES.put(found.key, JSON.stringify(found.template));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "POST" && path === "/api/approve/routine") {
      const { templateId, categoryId, routine, skills = [] } = await request.json();
      const found = await findTemplate(env, templateId);
      const category = found?.template.categories.find((c) => c.id === categoryId);
      if (!category) return jsonError("Sport or category not found", 404);
      category.skills = category.skills || [];
      category.routines = category.routines || [];
      const existingSkillIds = new Set(category.skills.map((s) => s.id));
      for (const sk of skills) {
        if (!existingSkillIds.has(sk.id)) category.skills.push(sk);
      }
      upsertById(category.routines, routine);
      await env.GLOBAL_TEMPLATES.put(found.key, JSON.stringify(found.template));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "POST" && path === "/api/approve/category") {
      const { templateId, category } = await request.json();
      const found = await findTemplate(env, templateId);
      if (!found) return jsonError("Sport not found", 404);
      found.template.categories = found.template.categories || [];
      upsertById(found.template.categories, category);
      await env.GLOBAL_TEMPLATES.put(found.key, JSON.stringify(found.template));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "POST" && path === "/api/approve/club") {
      const { club } = await request.json();
      await env.GLOBAL_CLUBS.put(`${club.name}.json`, JSON.stringify(club));
      return new Response(JSON.stringify({ status: "approved" }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "POST" && path === "/api/approve/club-update") {
      const { clubName, updates, submittedBy, submittedAt } = await request.json();
      console.log(clubName);
      const club = await env.GLOBAL_CLUBS.get(`${clubName}.json`, "json");
      if (!club) {
        return new Response(JSON.stringify({ error: "Club not found" }), {
          status: 404,
          headers: { ...cors(), "Content-Type": "application/json" }
        });
      }
      const updatedClub = {
        ...club,
        ...updates,
        lastUpdatedBy: submittedBy,
        lastUpdatedAt: submittedAt
      };
      await env.GLOBAL_CLUBS.put(`${clubName}.json`, JSON.stringify(updatedClub));
      return new Response(JSON.stringify({ status: "approved" }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "DELETE" && path.startsWith("/api/pending/sports/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingSports/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "DELETE" && path.startsWith("/api/pending/skills/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingSkills/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "DELETE" && path.startsWith("/api/pending/routines/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingRoutines/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "DELETE" && path.startsWith("/api/pending/categories/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingCategories/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "DELETE" && path.startsWith("/api/pending/clubs/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingClubs/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "DELETE" && path.startsWith("/api/pending/club-updates/")) {
      const id = path.split("/")[4];
      await env.GLOBAL_SUBMISSIONS.delete(`pendingClubUpdates/${id}.json`);
      return new Response(JSON.stringify({ deleted: id }), { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "GET" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      const json = await env.TRACKER_DATA.get(`user:${uid}`);
      return new Response(json || "{}", { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "PUT" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      const body = await request.text();
      await env.TRACKER_DATA.put(`user:${uid}`, body);
      return new Response("OK", { status: 200, headers: cors() });
    }
    if (method === "DELETE" && path.startsWith("/api/user/")) {
      const uid = path.split("/")[3];
      await env.TRACKER_DATA.delete(`user:${uid}`);
      return new Response(JSON.stringify({ ok: true, deleted: uid }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "GET" && path === "/api/admin/storage") {
      const namespaces = {
        TRACKER_DATA: env.TRACKER_DATA,
        GLOBAL_TEMPLATES: env.GLOBAL_TEMPLATES,
        GLOBAL_CLUBS: env.GLOBAL_CLUBS,
        GLOBAL_SUBMISSIONS: env.GLOBAL_SUBMISSIONS,
        GLOBAL_REWARDS: env.GLOBAL_REWARDS
      };
      const encoder = new TextEncoder();
      const result = [];
      for (const [name, kv] of Object.entries(namespaces)) {
        if (!kv) continue;
        let keys = 0;
        let bytes = 0;
        let largest = { key: null, bytes: 0 };
        let cursor;
        do {
          const page = await kv.list({ cursor });
          for (let i = 0; i < page.keys.length; i += 25) {
            const batch = page.keys.slice(i, i + 25);
            const values = await Promise.all(batch.map((k) => kv.get(k.name)));
            values.forEach((v, idx) => {
              const size = v ? encoder.encode(v).length : 0;
              keys += 1;
              bytes += size;
              if (size > largest.bytes) largest = { key: batch[idx].name, bytes: size };
            });
          }
          cursor = page.list_complete ? void 0 : page.cursor;
        } while (cursor);
        result.push({ namespace: name, keys, bytes, largest });
      }
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "GET" && path === "/api/admin/pending/list") {
      const list = await env.GLOBAL_SUBMISSIONS.list();
      return new Response(
        JSON.stringify({
          keys: list.keys.map((k) => k.name)
        }),
        {
          status: 200,
          headers: { ...cors(), "Content-Type": "application/json" }
        }
      );
    }
    if (method === "DELETE" && path === "/api/admin/pending/all") {
      const list = await env.GLOBAL_SUBMISSIONS.list();
      console.log("Deleting all pending submissions");
      for (const key of list.keys) {
        await env.GLOBAL_SUBMISSIONS.delete(key.name);
      }
      return new Response(
        JSON.stringify({ status: "all pending submissions cleared" }),
        {
          status: 200,
          headers: { ...cors(), "Content-Type": "application/json" }
        }
      );
    }
    if (method === "DELETE" && path === "/api/admin/pending/sports") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingSports/" });
      for (const key of list.keys) {
        await env.GLOBAL_SUBMISSIONS.delete(key.name);
      }
      return new Response(JSON.stringify({ status: "pending sports cleared" }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "DELETE" && path === "/api/admin/pending/skills") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingSkills/" });
      for (const key of list.keys) {
        await env.GLOBAL_SUBMISSIONS.delete(key.name);
      }
      return new Response(JSON.stringify({ status: "pending skills cleared" }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "DELETE" && path === "/api/admin/pending/categories") {
      const list = await env.GLOBAL_SUBMISSIONS.list({ prefix: "pendingCategories/" });
      for (const key of list.keys) {
        await env.GLOBAL_SUBMISSIONS.delete(key.name);
      }
      return new Response(JSON.stringify({ status: "pending categories cleared" }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    if (method === "GET" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      const json = await env.TRACKER_DATA.get(`state:${childId}`);
      return new Response(json || "{}", { status: 200, headers: { ...cors(), "Content-Type": "application/json" } });
    }
    if (method === "PUT" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      const body = await request.text();
      await env.TRACKER_DATA.put(`state:${childId}`, body);
      return new Response("OK", { status: 200, headers: cors() });
    }
    if (method === "DELETE" && path.startsWith("/api/state/")) {
      const childId = path.split("/")[3];
      await env.TRACKER_DATA.delete(`state:${childId}`);
      return new Response(JSON.stringify({ ok: true, deleted: childId }), {
        status: 200,
        headers: { ...cors(), "Content-Type": "application/json" }
      });
    }
    return new Response("Not found", { status: 404, headers: cors() });
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError2 = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError2;

// .wrangler/tmp/bundle-OYCGLa/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = piper_worker_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-OYCGLa/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=piper-worker.js.map
