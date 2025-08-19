import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { loginWithMPIN, getLastUser, clearLastUser, type LastUserInfo } from '@/services/mpinAuth';
import { Shield, ArrowLeft, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MPINLoginProps {
  onLoginSuccess?: () => void;
}

export const MPINLogin: React.FC<MPINLoginProps> = ({ onLoginSuccess }) => {
  const [mpin, setMPIN] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUser, setLastUser] = useState<LastUserInfo | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const user = getLastUser();
    setLastUser(user);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lastUser) {
      toast({
        variant: "destructive",
        title: "No User Found",
        description: "Please login with email and password first"
      });
      return;
    }

    if (mpin.length < 4) {
      toast({
        variant: "destructive",
        title: "Invalid MPIN",
        description: "MPIN must be at least 4 digits"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginWithMPIN(lastUser.email, mpin);
      
      if (result.success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${lastUser.name}!`
        });
        
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: result.error || "Invalid MPIN"
        });
        setMPIN(''); // Clear MPIN on failure
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Error",
        description: "An unexpected error occurred. Please try again."
      });
      setMPIN('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchUser = () => {
    clearLastUser();
    setLastUser(null);
    setMPIN('');
    // This will effectively redirect to the main login page
  };

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'official':
        return 'bg-official text-white';
      case 'resident':
        return 'bg-resident text-white';
      case 'superadmin':
        return 'bg-primary text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (!lastUser) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="h-5 w-5" />
            Quick Login
          </CardTitle>
          <CardDescription>
            No previous login found. Please use email and password to login first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link to="/login">
            <Button className="w-full">
              Go to Email Login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          <Shield className="h-5 w-5" />
          Quick Login
        </CardTitle>
        <CardDescription>
          Enter your MPIN to continue
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* User Info */}
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-16 w-16">
            <AvatarFallback className={getRoleColor(lastUser.role)}>
              {getUserInitials(lastUser.name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="font-medium">{lastUser.name}</p>
            <p className="text-sm text-muted-foreground">{lastUser.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {lastUser.role}
            </p>
          </div>
        </div>

        {/* MPIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mpin" className="text-center block">
              Enter your MPIN
            </Label>
            <Input
              id="mpin"
              type="password"
              value={mpin}
              onChange={(e) => setMPIN(e.target.value.replace(/\D/g, '').slice(0, 12))}
              placeholder="••••"
              maxLength={12}
              required
              disabled={isLoading}
              className="text-center text-lg tracking-widest"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || mpin.length < 4}
          >
            {isLoading ? "Logging in..." : "Login with MPIN"}
          </Button>
        </form>

        {/* Alternative Options */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleSwitchUser}
            disabled={isLoading}
          >
            <User className="h-4 w-4 mr-2" />
            Switch User
          </Button>
          
          <Link to="/login" className="block">
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Use Email & Password
            </Button>
          </Link>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Forgot your MPIN? Login with email and reset it in Settings.
        </div>
      </CardContent>
    </Card>
  );
};