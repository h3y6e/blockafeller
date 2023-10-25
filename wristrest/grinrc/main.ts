import { booleans, extrusions, geometries, primitives, transforms } from "@jscad/modeling";
import type { Vec2 } from "@jscad/modeling/src/maths/vec2";
import expansions from "@jscad/modeling/src/operations/expansions";

const leftLength = 140;
const rightLength = 160;
const width = 70;
const height = 8;

export const main = () => {
  // 基本のリストレストの3D形状
  const base = primitives.roundedCuboid({
    center: [(leftLength - rightLength) / 2, -width / 2, 0],
    size: [leftLength + rightLength, width, height],
    roundRadius: 2,
  });

  // 2D曲線
  const y = [0, -0.5, -1.3, -3.1, -5.7, -9.1, -12, -14.5, -16, -17, -17.5];
  const curvePoints: Vec2[] = [
    [-rightLength, 0],
    ...Array.from({ length: 21 }, (_, i): Vec2 => [-100 + i * 10, i < 11 ? y[i] : y[20 - i]]),
    [leftLength, 0],
  ];
  const curvePath = geometries.path2.fromPoints({ closed: true }, curvePoints);

  // 曲線を3D形状に押し出し
  const curve = extrusions.extrudeLinear({ height: height }, curvePath);
  const positionedCurve = transforms.translate([0, 0, -height / 2], curve);

  // 周囲を整形する円
  const circle = primitives.cylinder({
    radius: 158,
    height: height,
    center: [-11, 51, 0],
    segments: 64,
  });

  const wristrest = booleans.intersect(booleans.subtract(base, positionedCurve), circle);

  return wristrest;
  // return expansions.expand({ corners: "round", delta: 0.5 }, wristrest);
};
