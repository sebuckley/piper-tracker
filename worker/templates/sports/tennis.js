export const tennisTemplates = [
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
      1: { min: 3, max: 5 },   // Beginner
      2: { min: 4, max: 6 },   // Improver
      3: { min: 5, max: 7 },   // Club
      4: { min: 6, max: 8 }    // Performance
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
