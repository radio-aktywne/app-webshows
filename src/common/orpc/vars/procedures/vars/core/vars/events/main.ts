import { create } from "./vars/create";
import { delete_ } from "./vars/delete";
import { get } from "./vars/get";
import { list } from "./vars/list";
import { split } from "./vars/split";
import { update } from "./vars/update";

export const events = {
  create: create,
  delete: delete_,
  get: get,
  list: list,
  split: split,
  update: update,
};
