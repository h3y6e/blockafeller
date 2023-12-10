import { booleans, primitives } from "@jscad/modeling";

export const main = () => {
  const height = 45;
  const startRadius = 90;
  const endRadius = 105;
  const depth = 5;

  const base = primitives.cylinderElliptic({
    height: height,
    startRadius: [startRadius, startRadius],
    endRadius: [endRadius, endRadius],
    center: [0, 0, height / 2],
    segments: 6,
  });

  const digout = primitives.cylinderElliptic({
    height: height - depth,
    startRadius: [startRadius - depth, startRadius - depth],
    endRadius: [endRadius - depth, endRadius - depth],
    center: [0, 0, height / 2 + depth],
    segments: 6,
  });

  const ringstand = primitives.cylinderElliptic({
    height: height - depth,
    startRadius: [14, 14],
    endRadius: [5, 5],
    center: [0, 0, height / 2 + depth],
    segments: 6,
  });
  return booleans.union(booleans.subtract(base, digout), ringstand);
};
