import { Id } from "../models/basic/Id";

export interface Parsed<I extends Id> {
  getId: () => I;
}
