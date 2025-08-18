// ...existing code...
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
	let hash = 0;
	for (let i = 0; i < mpin.length; i++) {
		hash = ((hash << 5) - hash) + mpin.charCodeAt(i);
		hash |= 0;
	}
	return hash.toString();
}


// Call Edge Function to verify MPIN and get magic link (using user's mpin-auth function)
async function verifyMpinAndGetMagicLink(email: string, mpin: string) {
	const response = await fetch('https://lsygeaoqahfryyfvpxrk.supabase.co/functions/v1/mpin-auth', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ email, mpin }),
	});
	const result = await response.json();
	return { ...result, status: response.status };
}


async function loginWithMpin(email: string, mpin: string) {
	const result = await verifyMpinAndGetMagicLink(email, mpin);
	if (!result.success) {
		return { error: result.error || 'Authentication failed' };
	}
	if (result.magic_link) {
		// Redirect user to magic link for login
		window.location.href = result.magic_link;
		return { success: true };
	}
	return { error: 'No magic link returned' };
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
		if (mpin.length < 6) {
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
		if (mpin.length < 4 || mpin.length > 6) {
			toast.error("Please enter a 4-6 digit MPIN");
			return;
		}
		setLoading(true);
		try {
			const result = await loginWithMpin(email, mpin);
					if (result.error) {
						if (result.error === 'MPIN not set') {
							toast.error("MPIN not set. Please set up MPIN in Quick Login tab.");
						} else if (result.error === 'User not found') {
							toast.error("User not found. Please check your email address.");
						} else if (result.error === 'Invalid MPIN') {
							toast.error("Invalid MPIN. Please try again.");
						} else {
							toast.error("Authentication failed. Please try again.");
						}
						return;
					}
					toast.success("MPIN verified! Redirecting to login...");
					// The user will be redirected to the magic link for login
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
						<p className="text-xs text-muted-foreground">Enter your 4-6 digit MPIN</p>
					</div>
				</CardHeader>

				<CardContent className="space-y-6">
					{/* MPIN Display */}
					<div className="flex justify-center space-x-3">
						{[0, 1, 2, 3, 4, 5].map((index) => (
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
								disabled={loading || mpin.length >= 6}
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
							disabled={loading || mpin.length >= 6}
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
						disabled={loading || mpin.length < 4 || mpin.length > 6}
					>
						{loading ? "Signing in..." : "Sign In"}
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
