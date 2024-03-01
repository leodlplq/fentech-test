export const skipped = (ctx, value) =>
  ctx.p0.skip || ctx.p1.skip ? value : undefined;
export const down = (ctx, value) =>
  ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined;
