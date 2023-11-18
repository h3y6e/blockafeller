import { primitives } from "@jscad/modeling";

export const main = () => {
  const length = 1;

  const cube = primitives.cube({
    size: length,
  });

  return cube;
};
