export function autoType(val: string): boolean | number | string | null | undefined {
  const valLower = val.toLowerCase();
  if (val === '') {
    return undefined;
  }

  if ((valLower === 'true') || (valLower === 'false')) {
    return valLower === 'true';
  }

  if (!Number.isNaN(Number(val)) || (valLower === 'nan')) {
    return parseFloat(val);
  }

  if (valLower === 'null') {
    return null;
  }

  return val;
}
