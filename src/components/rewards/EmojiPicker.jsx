import EmojiPicker from "../reusable/EmojiPicker";
import { resolveEmoji, searchEmojis } from "../../utils/rewardEmojis";

export default function RewardEmojiPicker({ value, onChange }) {
  return (
    <EmojiPicker value={value} onChange={onChange} resolve={resolveEmoji} searchFn={searchEmojis} />
  );
}
