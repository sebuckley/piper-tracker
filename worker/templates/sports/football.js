export const footballTemplates = [
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
      1: { min: 2, max: 4 },   // U6
      2: { min: 2, max: 4 },   // U7
      3: { min: 3, max: 5 },   // U8
      4: { min: 3, max: 6 },   // U9
      5: { min: 4, max: 6 },   // U10
      6: { min: 4, max: 7 },   // U11
      7: { min: 5, max: 7 },   // U12
      8: { min: 5, max: 8 },   // U13
      9: { min: 6, max: 8 },   // U14
      10: { min: 6, max: 9 },  // U15
      11: { min: 6, max: 9 }   // U16
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
