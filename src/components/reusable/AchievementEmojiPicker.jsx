import EmojiPicker from "../reusable/EmojiPicker";
import { resolveAchievementEmoji, searchAchievementEmojis } from "../../utils/achievementEmojis";

export default function AchievementEmojiPicker({ value, onChange }) {
  return (
    <EmojiPicker
      value={value}
      onChange={onChange}
      resolve={resolveAchievementEmoji}
      searchFn={searchAchievementEmojis}
    />
  );
}
