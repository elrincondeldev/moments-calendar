import { supabase } from '$lib/supabase/client';
import type { Database } from '$lib/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export async function getCurrentUserProfile(): Promise<Profile | null> {
	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) return null;

		const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

		if (error) {
			console.error('Error fetching profile:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Unexpected error fetching profile:', error);
		return null;
	}
}

export async function updateProfile(updates: ProfileUpdate): Promise<boolean> {
	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) return false;

		const { error } = await supabase
			.from('profiles')
			.update({
				...updates,
				updated_at: new Date().toISOString()
			})
			.eq('id', user.id);

		if (error) {
			console.error('Error updating profile:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Unexpected error updating profile:', error);
		return false;
	}
}

export async function completeOnboarding(): Promise<boolean> {
	return updateProfile({ onboarding_completed: true });
}

export async function hasCompletedOnboarding(): Promise<boolean> {
	const profile = await getCurrentUserProfile();
	return profile?.onboarding_completed ?? false;
}

export async function updatePersonalInfo(data: {
	full_name?: string;
	date_of_birth?: string;
}): Promise<boolean> {
	return updateProfile(data);
}
