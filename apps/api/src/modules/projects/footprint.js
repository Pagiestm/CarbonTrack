export function computeFootprint(lines) {
  const total = lines.reduce(
    (sum, { carbonFootprint, quantity }) => sum + Number(carbonFootprint) * quantity,
    0,
  );
  return Math.round(total * 100) / 100;
}
