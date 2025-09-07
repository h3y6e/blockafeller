import { booleans, expansions, primitives } from "@jscad/modeling";

export const main = () => {
  const numberOfSlots = 6; // Number of device slots
  const slotWidth = 12; // Width of each device slot
  const wallThickness = 2; // Wall thickness
  const baseThickness = 2; // Base plate thickness
  const standHeight = 35; // Height of vertical stands
  const baseDepth = 60; // Depth of base plate
  const delta = 1; // Expansion delta

  const totalWidth =
    (numberOfSlots + 1) * wallThickness + numberOfSlots * slotWidth;

  const base = primitives.cuboid({
    size: [totalWidth, baseDepth, baseThickness],
    center: [totalWidth / 2, baseDepth / 2, baseThickness / 2],
  });

  const dividers = [];
  for (let i = 0; i <= numberOfSlots; i++) {
    const dividerX = i * (slotWidth + wallThickness) + wallThickness / 2;
    const divider = primitives.cuboid({
      size: [wallThickness, baseDepth, standHeight],
      center: [dividerX, baseDepth / 2, baseThickness + standHeight / 2],
    });
    dividers.push(divider);
  }

  let stand = base;
  for (const divider of dividers) {
    stand = booleans.union(stand, divider);
  }

  return expansions.expand({ delta }, stand);
};
