// Utility to get region table name from region string
export function getRegionTable(region: string) {
  if (!region) return null;
  const normalized = region.trim().toUpperCase();
  const regionMap: Record<string, string> = {
    'NCR': 'NCR',
    'REGION I': 'REGION 1',
    'REGION 1': 'REGION 1',
    'REGION II': 'REGION 2',
    'REGION 2': 'REGION 2',
    'REGION III': 'REGION 3',
    'REGION 3': 'REGION 3',
    'REGION IV-A': 'REGION 4A',
    'REGION 4A': 'REGION 4A',
    'REGION IV-B': 'REGION 4B',
    'REGION 4B': 'REGION 4B',
    'REGION V': 'REGION 5',
    'REGION 5': 'REGION 5',
    'REGION VI': 'REGION 6',
    'REGION 6': 'REGION 6',
    'REGION VII': 'REGION 7',
    'REGION 7': 'REGION 7',
    'REGION VIII': 'REGION 8',
    'REGION 8': 'REGION 8',
    'REGION IX': 'REGION 9',
    'REGION 9': 'REGION 9',
    'REGION X': 'REGION 10',
    'REGION 10': 'REGION 10',
    'REGION XI': 'REGION 11',
    'REGION 11': 'REGION 11',
    'REGION XII': 'REGION 12',
    'REGION 12': 'REGION 12',
    'REGION XIII': 'REGION 13',
    'REGION 13': 'REGION 13',
    'CAR': 'CAR',
    'BARMM': 'BARMM',
  };
  return regionMap[normalized] || null;
}
