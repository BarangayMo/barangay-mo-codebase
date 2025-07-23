import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { RbiStatus } from '@/hooks/use-rbi-status';

interface RbiAccessNotificationProps {
  status: RbiStatus;
}

export const RbiAccessNotification = ({ status }: RbiAccessNotificationProps) => {
  const getNotificationConfig = () => {
    switch (status) {
      case 'not-submitted':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          title: 'RBI Registration Required',
          message: 'Submit your RBI form to access these options.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        };
      case 'submitted':
      case 'under-review':
        return {
          icon: <Clock className="w-5 h-5" />,
          title: 'RBI Registration Pending',
          message: 'Your RBI form is pending approval.',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600'
        };
      case 'rejected':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          title: 'RBI Registration Rejected',
          message: 'Please resubmit your RBI form with corrections.',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600'
        };
      default:
        return null;
    }
  };

  const config = getNotificationConfig();
  
  if (!config) return null;

  return (
    <div className={`${config.bgColor} ${config.borderColor} ${config.textColor} border rounded-lg p-4 mx-4 mb-4`}>
      <div className="flex items-center gap-3">
        <div className={config.iconColor}>
          {config.icon}
        </div>
        <div>
          <h3 className="font-semibold text-sm">{config.title}</h3>
          <p className="text-sm opacity-90">{config.message}</p>
        </div>
      </div>
    </div>
  );
};