import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock, Delete } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

// Modular functions
function storeLastLoginEmail(email: string) {
	localStorage.setItem('last_login_email', email);
}


// Simple hash function for demonstration (use a secure hash in production)
function hashMpin(mpin: string) {
	if (mpin.length !== 4) throw new Error("MPIN must be exactly 4 digits");
	let hash = 0;
	for (let i = 0; i < mpin.length; i++) {
		hash = ((hash << 5) - hash) + mpin.charCodeAt(i);
		hash |= 0;
	}
	return hash.toString();
}


// Call Edge Function to verify MPIN (using user's mpin-auth function)
async function verifyMpin(email: string, mpin: string) {
	console.log('🔄 Frontend: Calling MPIN auth edge function', { email, mpinLength: mpin.length });
	const response = await fetch('https://lsygeaoqahfryyfvpxrk.supabase.co/functions/v1/mpin-auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, mpin }),
	});
	console.log('📨 Frontend: Edge function response status:', response.status);
	const result = await response.json();
	console.log('📄 Frontend: Edge function response data:', result);
	return { ...result, status: response.status };
}

// Compute device fingerprint (must match AuthContext implementation)
function getDeviceFingerprint() {
	try {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		ctx!.textBaseline = 'top';
		ctx!.font = '14px Arial';
		ctx!.fillText('Device fingerprint', 2, 2);
		return btoa(
			navigator.userAgent +
			navigator.language +
			screen.width + 'x' + screen.height +
			new Date().getTimezoneOffset() +
			canvas.toDataURL()
		).substring(0, 32);
	} catch (e) {
		console.warn('Fingerprint generation failed, falling back');
		return btoa(navigator.userAgent).substring(0, 16);
	}
}


async function loginWithMpin(email: string, mpin: string) {
	console.log('🚀 Frontend: Starting MPIN login process');
	// Verify MPIN with Edge Function
	const result = await verifyMpin(email, mpin);
	console.log("📦 Frontend: Edge function complete response:", result);

	if (!result.success) {
		console.log('❌ Frontend: Login failed with error:', result.error);
		return { error: result.error || 'Authentication failed' };
	}

	console.log('✅ Frontend: MPIN verification successful, restoring stored session tokens');
	try {
		const fingerprint = getDeviceFingerprint();
		const storageKey = `quicklogin_${fingerprint}`;
		console.log('🔎 Frontend: Reading storage key:', storageKey);
		const existingData = localStorage.getItem(storageKey);
		if (!existingData) {
			console.warn('⚠️ Frontend: No quicklogin data found on this device');
			return { error: 'Quick Login unavailable on this device. Please login with email/password once.' };
		}
		let deviceData: any;
		try {
			deviceData = JSON.parse(existingData);
		} catch (e) {
			console.error('💥 Frontend: Failed to parse quicklogin data:', e);
			return { error: 'Corrupted quick login data. Please login with password once.' };
		}
		console.log('📦 Frontend: Loaded device data:', { hasTokens: !!deviceData?.sessionTokens, email: deviceData?.email });
		if (deviceData?.email && deviceData.email !== email) {
			console.warn('🚫 Frontend: Stored session belongs to a different email');
			return { error: 'This device is linked to a different account. Please login once with password.' };
		}
		if (!deviceData?.sessionTokens?.accessToken || !deviceData?.sessionTokens?.refreshToken) {
			console.warn('⚠️ Frontend: Missing tokens in device data');
			return { error: 'No saved session tokens. Please login with password once.' };
		}
		console.log('🎫 Frontend: Setting session from stored tokens');
		const { error } = await supabase.auth.setSession({
			access_token: deviceData.sessionTokens.accessToken,
			refresh_token: deviceData.sessionTokens.refreshToken,
		});
		if (error) {
			console.error('❌ Frontend: setSession failed:', error);
			return { error: 'Saved session expired. Please login with password once.' };
		}
		console.log('✅ Frontend: Session restored from stored tokens');
		return { success: true, message: 'Logged in successfully' };
	} catch (e) {
		console.error('💥 Frontend: Unexpected error restoring session:', e);
		return { error: 'Authentication failed' };
	}

}

export default function MPIN() {
	const [mpin, setMpin] = useState("");
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState("");
	const navigate = useNavigate();
	const { user } = useAuth();

	// Redirect if already logged in
	useEffect(() => {
		if (user) {
			navigate("/", { replace: true });
		}
	}, [user, navigate]);

	// Check for stored email, redirect to login if not found
	useEffect(() => {
		try {
			const last = localStorage.getItem('last_login_email');
			if (last) {
				setEmail(last);
			} else {
				navigate("/login", { replace: true });
			}
		} catch {
			navigate("/login", { replace: true });
		}
	}, [navigate]);

	const handleNumberClick = (number: string) => {
		if (mpin.length < 4) {
			setMpin(prev => prev + number);
		}
	};

	const handleBackspace = () => {
		setMpin(prev => prev.slice(0, -1));
	};

	const handleClear = () => {
		setMpin("");
	};

	const handleLogin = async () => {
		console.log('🎯 Frontend: Login button clicked', { mpinLength: mpin.length, email });
		if (mpin.length !== 4) {
			console.log('❌ Frontend: MPIN length validation failed');
			toast.error("Please enter a 4-digit MPIN");
			return;
		}
		setLoading(true);
		console.log('🔄 Frontend: Starting login process...');
		try {
			const result = await loginWithMpin(email, mpin);
			console.log("🎯 Frontend: Final MPIN login result:", result);
			if (result.error) {
				console.log('❌ Frontend: Login error received:', result.error);
				if (result.error === 'MPIN not set') {
					toast.error("MPIN not set. Please set up MPIN in Quick Login tab.");
				} else if (result.error === 'User not found') {
					toast.error("User not found. Please check your email address.");
				} else if (result.error === 'Invalid MPIN') {
					toast.error("Invalid MPIN. Please try again.");
				} else {
					toast.error(result.error || "Authentication failed. Please try again.");
				}
				return;
			}

			if (result.success) {
				toast.success(result.message || "MPIN verified! Check your email for the magic link.");
				setMpin(""); // Clear MPIN field after successful verification
			}
		} catch (error) {
			toast.error("Login failed. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
			<Card className="w-full max-w-sm">
				{/* Header with user email */}
				<CardHeader className="text-center space-y-4 pb-6">
					<div className="flex items-center justify-between">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => navigate("/login")}
							className="p-2"
						>
							<ArrowLeft className="h-4 w-4" />
						</Button>
						<Lock className="h-5 w-5 text-primary" />
						<div className="w-8" /> {/* Spacer for alignment */}
					</div>
					<div className="space-y-2">
						<h2 className="text-lg font-semibold">Welcome back</h2>
						<p className="text-sm text-muted-foreground break-all">{email}</p>
						<p className="text-xs text-muted-foreground">Enter your 4-digit MPIN</p>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* MPIN Display */}
					<div className="flex justify-center space-x-3">
						{[0, 1, 2, 3].map((index) => (
							<div
								key={index}
								className="w-4 h-4 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center"
							>
								{mpin[index] && (
									<div className="w-2 h-2 rounded-full bg-primary" />
								)}
							</div>
						))}
					</div>

					{/* Number Pad */}
					<div className="grid grid-cols-3 gap-4">
						{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
							<Button
								key={number}
								variant="outline"
								size="lg"
								className="h-16 text-xl font-semibold"
								onClick={() => handleNumberClick(number.toString())}
								disabled={loading || mpin.length >= 4}
							>
								{number}
							</Button>
						))}

						{/* Bottom row: Clear, 0, Backspace */}
						<Button
							variant="ghost"
							size="lg"
							className="h-16 text-sm"
							onClick={handleClear}
							disabled={loading || mpin.length === 0}
						>
							Clear
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="h-16 text-xl font-semibold"
							onClick={() => handleNumberClick("0")}
							disabled={loading || mpin.length >= 4}
						>
							0
						</Button>
						<Button
							variant="ghost"
							size="lg"
							className="h-16"
							onClick={handleBackspace}
							disabled={loading || mpin.length === 0}
						>
							<Delete className="h-5 w-5" />
						</Button>
					</div>

					{/* Login Button */}
					<Button 
						onClick={handleLogin}
						className="w-full h-12"
						disabled={loading || mpin.length !== 4}
					>
						{loading ? "Signing in..." : "Sign In"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
