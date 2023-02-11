export function autoType(val: string): boolean | number | string | null | undefined {
  if (val === '') {
    return undefined;
  }

  const valLower = val.toLowerCase();
  const isTrue = valLower === 'true';
  if (isTrue || (valLower === 'false')) {
    return valLower === 'true';
  }

  if (!Number.isNaN(Number(val)) || (valLower === 'nan')) {
    return Number(val);
  }

  if (valLower === 'null') {
    return null;
  }

  return val;
}
