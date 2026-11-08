import { create } from "zustand";
export const useStore = create<{ p: number; setP: (v:number)=>void }>((set)=>({ p:0, setP:(v)=>set({p:v}) }));