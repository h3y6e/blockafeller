import { booleans, primitives, transforms } from "@jscad/modeling";

const baseSize = { width: 21, depth: 31, height: 4 };
const diamondSize = { width: 2, depth: 3, height: 1 };

export const main = () => {
  const base = primitives.cuboid({
    size: [baseSize.width, baseSize.depth, baseSize.height],
    center: [0, 0, -baseSize.height / 2],
  });

  const diamond = primitives.cylinderElliptic({
    height: diamondSize.height,
    startRadius: [diamondSize.width / 2, diamondSize.depth / 2],
    endRadius: [0, 0],
    center: [-baseSize.width / 2, -baseSize.depth / 2, diamondSize.height / 2],
    segments: 4,
  });

  const diamonds = [];
  const row = Math.ceil(baseSize.width / diamondSize.width);
  const col = Math.ceil(baseSize.depth / diamondSize.depth);

  for (let i = 0; i < 2 * row + 1; i++) {
    for (let j = 0; j < col + 1; j++) {
      const yOffset = ((i % 2) * diamondSize.depth) / 2;
      const movedDiamond = transforms.translate(
        [(i * diamondSize.width) / 2, j * diamondSize.depth + yOffset],
        diamond,
      );
      diamonds.push(movedDiamond);
    }
  }

  const pattern = booleans.intersect(
    primitives.cuboid({
      size: [baseSize.width, baseSize.depth, diamondSize.height],
      center: [0, 0, diamondSize.height / 2],
    }),
    booleans.union(diamonds),
  );

  return booleans.union(base, pattern);
};
