import { booleans, extrusions, geometries, primitives, transforms } from "@jscad/modeling";

const length = 320;
const width = 25;
const height = 10;
const bellDepth = 20;
const bellWidth = 40;

// ガウス関数
const gaussian = (x: number, a: number, b: number, c: number) => {
  return a * Math.exp(-((x - b) ** 2) / (2 * c ** 2));
};

export const main = () => {
  // 基本のリストレストの3D形状を作成
  const base = primitives.cuboid({ size: [length / 2, width, height] });

  // ガウス関数に基づく曲線の点を計算
  const curvePoints: [number, number][] = [];
  curvePoints.push([-length / 2, 0]);
  for (let x = -length / 2; x <= length / 2; x += length / 100) {
    const y = gaussian(x, bellDepth, 0, bellWidth);
    curvePoints.push([x, -y]);
  }
  curvePoints.push([length / 2, 0]);

  // 2D曲線を作成
  const curvePath = geometries.path2.fromPoints({ closed: true }, curvePoints);

  // 曲線を3D形状に押し出し
  const curve = extrusions.extrudeLinear({ height: height }, curvePath);

  // 移動して正しい位置に配置
  const positionedCurve = transforms.translate([length / 4, width / 2, -height / 2], curve);

  return booleans.subtract(base, positionedCurve);
};
