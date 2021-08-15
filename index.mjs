const isTrueObject = (x) => typeof x === "object" && x !== null;
const defaultOpts = { metaKey: "_dm_", fullArrays: false };
export const diffGenerator = (left, right, optsRaw) => {
  const opts = { ...defaultOpts, ...optsRaw };
  const lIsObject = isTrueObject(left);
  const rIsObject = isTrueObject(right);
  if (lIsObject !== rIsObject) return right;
  if (!lIsObject || !rIsObject) return left === right ? undefined : right;
  const lIsArray = Array.isArray(left);
  const rIsArray = Array.isArray(right);
  if (lIsArray !== rIsArray) return right;
  const isArrayComparison = lIsArray && rIsArray;
  let diffGenerated = false;
  const meta = {};
  if (isArrayComparison) meta.t = 1;
  const finalDiff = {};
  if (isArrayComparison && left.length !== right.length) {
    if (opts.fullArrays) return right;
    diffGenerated = true;
    const lengthDiff = left.length - right.length;
    const adding = lengthDiff < 0;
    const startIndex =
      (adding ? right.length : left.length) -
      (adding ? -lengthDiff : lengthDiff);
    if (adding) {
      meta.a = {};
      for (let i = 0; i < -lengthDiff; i++) {
        // iterate over needed indexes
        const destinationIndex = startIndex + i;
        const o = right[destinationIndex];
        if (isTrueObject(o) && o.hasOwnProperty(opts.metaKey))
          throw new Error(
            `Meta Key ${opts.metaKey} is defined and thus cant be set for adding`
          );
        meta.a[`${destinationIndex}`] = o;
      }
    } else {
      // just tell the diff Object to cut the array
      meta.c = right.length - lengthDiff;
    }
  }
  if (!isArrayComparison) {
    for (const key in left) {
      if (!right.hasOwnProperty(key)) {
        if (!meta.hasOwnProperty("d")) meta.d = [];
        diffGenerated = true;
        meta.d.push(`${key}`);
      }
    }
  }
  const iterator =
    isArrayComparison && left.length < right.length ? left : right;
  for (const key in iterator) {
    if (key === opts.metaKey)
      throw new Error(
        `Meta Key ${opts.metaKey} is defined and thus cant be set`
      );
    if (!isArrayComparison && !left.hasOwnProperty(key)) {
      diffGenerated = true;
      finalDiff[key] = right[key];
      continue;
    }
    const result = diffGenerator(left[key], right[key], opts);
    if (result !== undefined) {
      if (isArrayComparison && opts.fullArrays) return right;
      diffGenerated = true;
      finalDiff[key] = result;
    }
  }
  if (finalDiff.hasOwnProperty(opts.metaKey)) {
    throw new Error(
      `Meta Key ${opts.metaKey} is already defined and thus cant be set`
    );
  }
  if (Object.keys(meta).length > 0 || meta.t === 1)
    finalDiff[opts.metaKey] = meta;
  return diffGenerated ? finalDiff : undefined;
};

export const merge = (target, patch, optsRaw) => {
  const opts = { ...defaultOpts, ...optsRaw };
  if (patch === undefined) return target;
  if(!isTrueObject(patch)) return patch;
  const isArray =
    (patch.hasOwnProperty(opts.metaKey) && patch[opts.metaKey].t === 1);
  if (!isArray && !target) target = {}; // should the target be nothing
  const meta = patch[opts.metaKey] || {};
  const dest = isArray
    ? Array.isArray(target)
      ? meta.c
        ? target.splice(0, meta.c)
        : target
      : []
    : target;
  // for the case that as target we are passed a non array, which is a array in the patch object
  // we try to rebuild the aray from the deltas and adds we have, this is slightly ambigious but better then nothing, should not happen to often
  const arrayOverwrite = isArray && !Array.isArray(target);
  let overwriteCount = 0;
  if (!isArray && meta.hasOwnProperty("d")) {
    for (const keyToDelete in meta.d) {
      delete dest[meta.d[keyToDelete]];
    }
  }
  for (const key in patch) {
    if (key === opts.metaKey) continue;
    const targetKey = arrayOverwrite ? overwriteCount : key;
    const destPatch = patch[key];
    const source = dest[key] === undefined ? {} : dest[key];
    if (
      isTrueObject(source) &&
      isTrueObject(destPatch) &&
      !Array.isArray(destPatch)
    ) {
      dest[targetKey] = merge(source, destPatch, opts);
    } else {
      dest[targetKey] = destPatch;
    }
    if (arrayOverwrite) overwriteCount++;
  }
  if (isArray && meta.hasOwnProperty("a")) {
    for (const add in meta.a) {
      dest[arrayOverwrite ? overwriteCount : add] = meta.a[add];
      if (arrayOverwrite) overwriteCount++;
    }
  }
  return dest;
};
