export const DENSITY_LIMITS = {
  SAFE: 5,
  WARNING: 15,
};

export const getStatusFromCount = (count) => {
  if (count === null || count === undefined) return 'UNKNOWN';
  if (count <= DENSITY_LIMITS.SAFE) return 'LOW';
  if (count <= DENSITY_LIMITS.WARNING) return 'MEDIUM';
  return 'HIGH';
};

export const getStatusColors = (status) => {
  switch (status) {
    case 'LOW':
      return 'bg-success/20 text-success border-success/50';
    case 'MEDIUM':
      return 'bg-warning/20 text-warning border-warning/50';
    case 'HIGH':
      return 'bg-danger/20 text-danger border-danger/50';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
  }
};
