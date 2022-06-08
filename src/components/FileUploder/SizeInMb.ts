export const SizeInMB = (bytes: number): string => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
export const accepted = () => {
  const accept = {
    'image/*': [],
    'text/*': [],
    'application/json': [],
    'application/vnd.ms-excel': [],
    'application/vnd.ms-powerpoint': [],
    'application/pdf': [],
    'application/msword': [],
  };
  return accept;
};
