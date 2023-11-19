import {
  booleans,
  extrusions,
  geometries,
  primitives,
  transforms,
} from "@jscad/modeling";
import type { Vec2 } from "@jscad/modeling/src/maths/vec2";
import expansions from "@jscad/modeling/src/operations/expansions";

export const main = () => {
  const leftLength = 135;
  const rightLength = 155;
  const width = 85;
  const height = 3;
  const delta = 2;

  const length = leftLength + rightLength;
  const lengthCenter = (rightLength - leftLength) / 2;

  // 基本のリストレストの3D形状
  const base = primitives.cuboid({
    center: [lengthCenter, -width / 2, height / 2],
    size: [length, width, height],
  });

  // 2D曲線
  const y = [0, -0.5, -1.3, -3.1, -5.7, -9.1, -12, -14.5, -16, -17, -17.5];
  const curvePoints: Vec2[] = [
    [-leftLength, 0],
    ...Array.from({ length: y.length * 2 - 1 }, (_, i): Vec2 => {
      const index = i < y.length ? i : y.length * 2 - 2 - i;
      return [-100 + i * 10, y[index]];
    }),
    [rightLength, 0],
  ];

  const curveGeom = geometries.geom2.fromPoints(curvePoints);

  // 曲線を3D形状に押し出し
  const curve = extrusions.extrudeLinear({ height: height }, curveGeom);

  // 膨らみ
  const cuboid = primitives.cuboid({
    center: [lengthCenter, 0, height / 2],
    size: [length, width / 2, height],
  });
  const bulge = booleans.intersect(cuboid, curve);

  // リストレストの3D形状
  const wristrest = expansions.expand(
    { delta: delta },
    booleans.union(
      booleans.subtract(base, curve),
      transforms.translate([0, -width, 0], bulge),
    ),
  );

  // オブジェクトを分割するための直方体を作成
  const cutter = primitives.cuboid({
    center: [rightLength / 2, -width / 2, height / 2],
    size: [rightLength + delta * 2, (width + delta) * 2, height + delta * 2],
  });

  // オブジェクトを分割する
  const rightPart = booleans.intersect(wristrest, cutter);
  const leftPart = booleans.subtract(wristrest, cutter);

  // 分割された2つの部分を返す
  return [
    rightPart,
    transforms.translate([length / 2, width + 25, 0], leftPart),
  ];
};
