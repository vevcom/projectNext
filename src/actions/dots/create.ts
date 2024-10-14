'use server'
import { Dots } from "@/services/dots";
import { Action } from "../Action";

export const createDotAction = Action(Dots.create)