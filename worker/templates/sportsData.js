import { nanoid } from "nanoid";
import {gymnasticsTemplates} from "./sports/gymnastics";
import {dancingTemplates} from "./sports/dancing";
import {swimmingTemplates} from "./sports/swimming";
import {footballTemplates} from "./sports/football";
import {martialArtsTemplates} from "./sports/martialArts";
import {tennisTemplates} from "./sports/tennis";


export const DEFAULT_TEMPLATES = [

  ...gymnasticsTemplates,
  ...dancingTemplates,
  ...swimmingTemplates,
  ...footballTemplates,
  ...martialArtsTemplates,
  ...tennisTemplates,

];


// ⭐ Template for new sports created via addSport(name)
export const createEmptySport = name => ({
  id: nanoid(),
  name,
  classSessions: [],
  categories: [
    {
      id: nanoid(),
      name: "General",
      description: "",
      levels: ["Level 1", "Level 2", "Level 3"],
      routines: [],
      skills: []
    }
  ]
});
