export function autoType(val: string): boolean | number | string {
  if ((val === 'true') || (val === 'false')) {
    return val === 'true';
  }
  if (val === '') {
    return true;
  }
  if (!Number.isNaN(parseFloat(val))) {
    return parseFloat(val);
  }
  return val;
}
