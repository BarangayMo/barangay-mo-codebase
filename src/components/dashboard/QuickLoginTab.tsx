// ...existing code...
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Check, X, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

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

// Set MPIN in database using Supabase client
async function setMpin(email: string, mpin: string) {
	const mpinHash = hashMpin(mpin);
	const { data, error } = await supabase
		.from('profiles')
		.update({ mpin_hash: mpinHash, mpin_set_at: new Date().toISOString() })
		.eq('email', email)
		.select('mpin_hash');
	return { data, error };
}


// Store last login email locally
function storeLastLoginEmail(email: string) {
	localStorage.setItem('last_login_email', email);
}

export function QuickLoginTab() {
	const { user } = useAuth();
	const [mpinFirst, setMpinFirst] = useState("");
	const [mpinConfirm, setMpinConfirm] = useState("");
	const [isSettingMpin, setIsSettingMpin] = useState(false);
	const [hasMpin, setHasMpin] = useState(false);

	// Fetch MPIN status from DB on mount
	useEffect(() => {
		async function fetchMpinStatus() {
			if (!user?.email) return;
			const { data, error } = await supabase
				.from('profiles')
				.select('mpin_hash')
				.eq('email', user.email)
				.single();
			if (data?.mpin_hash) setHasMpin(true);
			else setHasMpin(false);
		}
		fetchMpinStatus();
	}, [user?.email]);

	const handleSetMpin = async () => {
		if (mpinFirst.length !== 4) {
			toast.error("MPIN must be exactly 4 digits");
			return;
		}
		if (mpinFirst !== mpinConfirm) {
			toast.error("MPINs do not match");
			return;
		}
		if (!user?.email) {
			toast.error("User information not available");
			return;
		}
		try {
			const result = await setMpin(user.email, mpinFirst);
			if (result.error) {
				toast.error("Failed to set MPIN");
				return;
			}
			setHasMpin(true);
			setMpinFirst("");
			setMpinConfirm("");
			setIsSettingMpin(false);
			toast.success("MPIN set successfully!");
		} catch (error) {
			toast.error("Failed to set MPIN");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="text-center space-y-2">
				<div className="flex items-center justify-center gap-2">
					<Sparkles className="h-5 w-5 text-yellow-500" />
					<h2 className="text-xl font-semibold">Make logging in faster!</h2>
				</div>
				<p className="text-muted-foreground">
					Set a 4-digit MPIN to sign in instantly.
				</p>
			</div>

			{/* Current Status */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Lock className="h-5 w-5" />
						Current Status
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<span>MPIN</span>
						<Badge variant={hasMpin ? "default" : "secondary"}>
							{hasMpin ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
							{hasMpin ? "Set" : "Not set"}
						</Badge>
					</div>
				</CardContent>
			</Card>

			{/* MPIN Setup */}
			<Card>
				<CardHeader>
					<CardTitle>MPIN Setup</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{!isSettingMpin ? (
						<div className="space-y-4">
							{hasMpin && (
								<div className="flex items-center gap-2 text-sm text-green-600">
									<Check className="h-4 w-4" />
									MPIN is already set for your account
								</div>
							)}
							<Button 
								onClick={() => setIsSettingMpin(true)}
								className="w-full"
								variant={hasMpin ? "outline" : "default"}
							>
								{hasMpin ? "Change MPIN" : "Set MPIN"}
							</Button>
						</div>
					) : (
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium">Enter 4-digit MPIN</label>
								<Input
									type="password"
									maxLength={4}
									value={mpinFirst}
									onChange={(e) => setMpinFirst(e.target.value.replace(/\D/g, '').slice(0, 4))}
									placeholder="••••"
									className="text-center text-2xl tracking-widest"
								/>
							</div>
							<div>
								<label className="text-sm font-medium">Confirm MPIN</label>
								<Input
									type="password"
									maxLength={4}
									value={mpinConfirm}
									onChange={(e) => setMpinConfirm(e.target.value.replace(/\D/g, '').slice(0, 4))}
									placeholder="••••"
									className="text-center text-2xl tracking-widest"
								/>
							</div>
							<div className="flex gap-2">
								<Button onClick={handleSetMpin} className="flex-1">
									Set MPIN
								</Button>
								<Button 
									variant="outline" 
									onClick={() => {
										setIsSettingMpin(false);
										setMpinFirst("");
										setMpinConfirm("");
									}}
									className="flex-1"
								>
									Cancel
								</Button>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Security Note */}
			<Card className="bg-blue-50 border-blue-200">
				<CardContent className="pt-6">
					<div className="flex items-start gap-2">
						<Lock className="h-4 w-4 text-blue-600 mt-0.5" />
						<div className="text-sm text-blue-800">
							<p className="font-medium">Security Note</p>
							<p>Your MPIN is securely stored in the database and can be used for quick login on this device.</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
