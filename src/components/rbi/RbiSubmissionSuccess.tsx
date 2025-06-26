
import { CheckCircle, Copy, Download, FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface RbiSubmissionSuccessProps {
  rbiNumber: string;
  onClose?: () => void;
}

const RbiSubmissionSuccess = ({ rbiNumber, onClose }: RbiSubmissionSuccessProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyRbiNumber = async () => {
    try {
      await navigator.clipboard.writeText(rbiNumber);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "RBI number copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Unable to copy RBI number",
        variant: "destructive"
      });
    }
  };

  const handleDownloadReceipt = () => {
    // Create a simple text receipt
    const receiptContent = `
RECORD OF BARANGAY INHABITANT (RBI)
SUBMISSION RECEIPT
=====================================

RBI Number: ${rbiNumber}
Status: Successfully Submitted
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Thank you for submitting your RBI form.
Please keep this number for your records.

For inquiries, please contact your 
local barangay office.
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RBI-Receipt-${rbiNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Your RBI receipt has been downloaded",
    });
  };

  return (
    <Card className="max-w-md mx-auto border-green-200 bg-green-50">
      <CardHeader className="text-center pb-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-green-800 text-xl">
          RBI Successfully Submitted!
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Your Record of Barangay Inhabitant has been successfully submitted and processed.
          </p>
          
          <div className="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
            <p className="text-sm font-medium text-gray-600 mb-2">Your RBI Number:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg font-bold text-green-800 font-mono">
                {rbiNumber}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyRbiNumber}
                className="h-8 w-8 p-0 hover:bg-green-100"
              >
                <Copy className={`w-4 h-4 ${copied ? 'text-green-600' : 'text-gray-500'}`} />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleDownloadReceipt}
            variant="outline"
            className="w-full border-green-200 hover:bg-green-50 text-green-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          
          {onClose && (
            <Button
              onClick={onClose}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              <FileText className="w-4 h-4 mr-2" />
              Continue to Profile
            </Button>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>Please save your RBI number for future reference.</p>
          <p>You can check your submission status in your profile.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RbiSubmissionSuccess;
