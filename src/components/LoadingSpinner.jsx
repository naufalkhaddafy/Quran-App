import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40">
    <Loader2 className="animate-spin text-emerald-600" size={32} />
  </div>
);

export default LoadingSpinner;
