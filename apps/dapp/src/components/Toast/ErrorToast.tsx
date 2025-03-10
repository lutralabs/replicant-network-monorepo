import { XCircleIcon } from 'lucide-react';
import { toast } from 'react-toastify';

type ErrorToastProps = {
  error: string;
};

export const ErrorToast = ({ error }: ErrorToastProps) => {
  console.error(error);
  const extractErrorReason = (error: string) => {
    if (error.includes('User rejected')) {
      return 'Transaction rejected by user.';
    }

    return error;
  };

  return toast.error(
    <div className="flex w-full gap-x-4 h-full items-center">
      <div>
        <XCircleIcon className="w-8 h-8 text-red-500" />
      </div>
      <div className="text-sm font-semibold flex flex-col gap-y-1">
        <span>Error!</span>
        <span className="font-normal">{extractErrorReason(error)}</span>
      </div>
    </div>,
    {
      progressClassName: 'bg-red-500',
      autoClose: 5000,
    }
  );
};
