import { expansions, primitives } from "@jscad/modeling";

export const main = () => {
  const height = 40;
  const radius = 12;
  const delta = 2;

  const base = primitives.cylinderElliptic({
    height: height,
    startRadius: [radius, radius],
    endRadius: [radius / 4, radius / 4],
    segments: 6,
  });

  return expansions.expand({ delta: delta }, base);
};
