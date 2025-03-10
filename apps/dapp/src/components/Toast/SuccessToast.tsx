import { CheckCircleIcon } from 'lucide-react';
import { toast } from 'react-toastify';

type SuccessToastProps = {
  message: string;
};

export const SuccessToast = (props: SuccessToastProps) => {
  return toast(
    <div className="flex w-full gap-x-4 h-full items-center">
      <div>
        <CheckCircleIcon className="w-8 h-8 text-primary-foreground" />
      </div>
      <div className="text-sm font-semibold flex items-center">
        <span>{`Successful! ${props.message}`}</span>
      </div>
    </div>,
    {
      autoClose: 1000,
    }
  );
};
