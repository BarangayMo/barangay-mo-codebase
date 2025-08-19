import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { setMPIN } from '@/services/mpinAuth';
import { Shield, Eye, EyeOff } from 'lucide-react';

interface MPINSetupProps {
  onComplete?: () => void;
  mode?: 'setup' | 'change';
}

export const MPINSetup: React.FC<MPINSetupProps> = ({ onComplete, mode = 'setup' }) => {
  const [mpin, setMPINValue] = useState('');
  const [confirmMPIN, setConfirmMPIN] = useState('');
  const [showMPIN, setShowMPIN] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mpin.length < 4) {
      toast({
        variant: "destructive",
        title: "Invalid MPIN",
        description: "MPIN must be at least 4 digits"
      });
      return;
    }

    if (mpin !== confirmMPIN) {
      toast({
        variant: "destructive",
        title: "MPIN Mismatch",
        description: "MPINs do not match"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await setMPIN(mpin);
      
      if (result.success) {
        toast({
          title: `MPIN ${mode === 'setup' ? 'Set Up' : 'Updated'} Successfully`,
          description: `Your MPIN has been ${mode === 'setup' ? 'created' : 'updated'} and can now be used for quick login`
        });
        
        // Clear form
        setMPINValue('');
        setConfirmMPIN('');
        
        if (onComplete) {
          onComplete();
        }
      } else {
        toast({
          variant: "destructive",
          title: `Failed to ${mode === 'setup' ? 'Set Up' : 'Update'} MPIN`,
          description: result.error || "An unexpected error occurred"
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save MPIN. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {mode === 'setup' ? 'Set Up MPIN' : 'Change MPIN'}
        </CardTitle>
        <CardDescription>
          {mode === 'setup' 
            ? 'Create a 4-digit MPIN for quick and secure login'
            : 'Update your current MPIN'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mpin">
              {mode === 'setup' ? 'New MPIN' : 'New MPIN'} (4-12 digits)
            </Label>
            <div className="relative">
              <Input
                id="mpin"
                type={showMPIN ? "text" : "password"}
                value={mpin}
                onChange={(e) => setMPINValue(e.target.value.replace(/\D/g, '').slice(0, 12))}
                placeholder="Enter your MPIN"
                maxLength={12}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowMPIN(!showMPIN)}
                disabled={isLoading}
              >
                {showMPIN ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-mpin">Confirm MPIN</Label>
            <Input
              id="confirm-mpin"
              type={showMPIN ? "text" : "password"}
              value={confirmMPIN}
              onChange={(e) => setConfirmMPIN(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="Confirm your MPIN"
              maxLength={12}
              required
              disabled={isLoading}
            />
          </div>

          <div className="bg-muted p-3 rounded-md text-sm">
            <p className="font-medium mb-1">Security Tips:</p>
            <ul className="text-muted-foreground space-y-1">
              <li>• Use a unique combination that's easy for you to remember</li>
              <li>• Don't share your MPIN with anyone</li>
              <li>• Your account will be temporarily locked after 5 failed attempts</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || mpin.length < 4 || mpin !== confirmMPIN}
          >
            {isLoading 
              ? `${mode === 'setup' ? 'Setting Up' : 'Updating'} MPIN...` 
              : `${mode === 'setup' ? 'Set Up' : 'Update'} MPIN`
            }
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};