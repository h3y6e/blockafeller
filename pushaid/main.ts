import { booleans, primitives } from "@jscad/modeling";

export const main = () => {
  const length = 50;
  const width = 16;
  const height = 5;
  const radius = 6;
  const depth = 1.5;

  const base = primitives.roundedCuboid({
    size: [length, width, height],
    center: [0, 0, height / 2],
    roundRadius: 1,
  });
  const circle = primitives.cylinder({
    height: 2 * depth,
    radius: radius,
    center: [0, 0, height],
  });

  return booleans.subtract(base, circle);
};
