export const DEFAULT_ACHIEVEMENT_EMOJI = "🏅";

export const resolveAchievementEmoji = emoji =>
  emoji && emoji.trim() ? emoji : DEFAULT_ACHIEVEMENT_EMOJI;

// [emoji, searchable keywords]
const RAW = [
  ["🏅", "medal sport achievement"],
  ["🎖️", "military medal award"],
  ["🥇", "gold first winner medal"],
  ["🥈", "silver second medal"],
  ["🥉", "bronze third medal"],
  ["🏆", "trophy cup winner champion"],
  ["👑", "crown king queen champion"],
  ["🌟", "star shining great"],
  ["⭐", "star"],
  ["✨", "sparkle magic shine"],
  ["💫", "dizzy star amazing"],
  ["🎉", "party celebration congratulations"],
  ["🎊", "confetti celebration"],
  ["👏", "clap well done applause"],
  ["🙌", "hooray celebrate"],
  ["💪", "strong strength effort"],
  ["🔥", "fire streak on fire"],
  ["🚀", "rocket progress improving"],
  ["📈", "progress improvement growth"],
  ["🎯", "target goal bullseye"],
  ["✅", "tick done complete passed"],
  ["📜", "certificate exam passed scroll"],
  ["🎓", "graduation exam school passed"],
  ["📚", "books school reading"],
  ["📝", "test exam writing homework"],
  ["🧠", "brain smart clever"],
  ["💡", "idea clever lightbulb"],
  ["🔬", "science experiment"],
  ["🔢", "numbers maths"],
  ["🏫", "school"],
  ["🤸", "gymnastics cartwheel"],
  ["💃", "dance dancing"],
  ["🩰", "ballet dance shoes"],
  ["🏊", "swimming swim"],
  ["⚽", "football soccer"],
  ["🏀", "basketball"],
  ["🎾", "tennis"],
  ["🏉", "rugby"],
  ["🏏", "cricket"],
  ["⛸️", "ice skating"],
  ["🥋", "martial arts karate belt"],
  ["🚴", "cycling bike"],
  ["🏃", "running race"],
  ["🧗", "climbing"],
  ["🎹", "piano music exam"],
  ["🎸", "guitar music"],
  ["🎤", "singing performance"],
  ["🎭", "drama theatre performance show"],
  ["🎨", "art painting creative"],
  ["📸", "photo"],
  ["🤝", "kind helpful friend teamwork"],
  ["❤️", "love kind heart"],
  ["🦸", "superhero brave"],
  ["🦁", "brave lion courage"],
  ["🌈", "rainbow"],
  ["🦄", "unicorn magic"],
  ["💎", "diamond special gem"],
  ["🎁", "gift prize reward"]
];

export const ACHIEVEMENT_EMOJIS = RAW.map(([emoji, keywords]) => ({ emoji, keywords }));

export const searchAchievementEmojis = term => {
  const t = (term || "").trim().toLowerCase();
  if (!t) return ACHIEVEMENT_EMOJIS;
  return ACHIEVEMENT_EMOJIS.filter(e => e.keywords.split(" ").some(w => w.startsWith(t)));
};
