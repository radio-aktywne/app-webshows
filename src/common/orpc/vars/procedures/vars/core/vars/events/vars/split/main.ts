import { orpcContractRootBase } from "../../../../../../../bases/root";
import { Schemas } from "./schemas";

export const split = orpcContractRootBase
  .input(Schemas.Input)
  .output(Schemas.Output);
