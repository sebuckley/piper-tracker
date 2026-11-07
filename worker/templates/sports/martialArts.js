export const martialArtsTemplates = [
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
      1: { min: 3, max: 5 },   // White Belt
      2: { min: 3, max: 5 },   // Yellow Belt
      3: { min: 3, max: 5 },   // Orange Belt

      4: { min: 4, max: 6 },   // Green Belt
      5: { min: 4, max: 6 },   // Blue Belt
      6: { min: 4, max: 6 },   // Purple Belt

      7: { min: 5, max: 7 },   // Brown Belt
      8: { min: 5, max: 7 },   // Red Belt

      9: { min: 6, max: 10 },  // Black Belt (1st Dan)
      10: { min: 6, max: 10 }, // Black Belt (2nd Dan)
      11: { min: 6, max: 10 }, // Black Belt (3rd Dan)
      12: { min: 6, max: 10 }, // Black Belt (4th Dan)
      13: { min: 6, max: 10 }, // Black Belt (5th Dan)
      14: { min: 6, max: 10 }, // Black Belt (6th Dan)
      15: { min: 6, max: 10 }, // Black Belt (7th Dan)
      16: { min: 6, max: 10 }, // Black Belt (8th Dan)
      17: { min: 6, max: 10 }, // Black Belt (9th Dan)
      18: { min: 6, max: 10 }  // Black Belt (10th Dan)
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
