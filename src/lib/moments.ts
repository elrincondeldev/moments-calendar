import { supabase } from '$lib/supabase/client';
import type { Database } from '$lib/supabase/types';

export type Moment = Database['public']['Tables']['moments']['Row'];
export type MomentInsert = Database['public']['Tables']['moments']['Insert'];
export type MomentUpdate = Database['public']['Tables']['moments']['Update'];

export async function getMoments(): Promise<Moment[]> {
	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			console.error('No user found');
			return [];
		}

		const { data, error } = await supabase
			.from('moments')
			.select('*')
			.eq('user_id', user.id)
			.order('date', { ascending: false });

		if (error) {
			console.error('Error fetching moments:', error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error('Unexpected error fetching moments:', error);
		return [];
	}
}

export async function createMoment(momentData: {
	title: string;
	description?: string;
	date: Date;
}): Promise<Moment | null> {
	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) {
			console.error('No user found');
			return null;
		}

		const { data, error } = await supabase
			.from('moments')
			.insert({
				user_id: user.id,
				title: momentData.title,
				description: momentData.description || null,
				date: momentData.date
			})
			.select()
			.single();

		if (error) {
			console.error('Error creating moment:', error);
			return null;
		}

		return data;
	} catch (error) {
		console.error('Unexpected error creating moment:', error);
		return null;
	}
}

export async function updateMoment(
	id: string,
	updates: { title?: string; description?: string; date?: string }
): Promise<boolean> {
	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) return false;

		const { error } = await supabase
			.from('moments')
			.update({
				...updates,
				updated_at: new Date().toISOString()
			})
			.eq('id', id)
			.eq('user_id', user.id);

		if (error) {
			console.error('Error updating moment:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Unexpected error updating moment:', error);
		return false;
	}
}

export async function deleteMoment(id: string): Promise<boolean> {
	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) return false;

		const { error } = await supabase.from('moments').delete().eq('id', id).eq('user_id', user.id);

		if (error) {
			console.error('Error deleting moment:', error);
			return false;
		}

		return true;
	} catch (error) {
		console.error('Unexpected error deleting moment:', error);
		return false;
	}
}

export async function getMomentsByDate(date: string): Promise<Moment[]> {
	try {
		const {
			data: { user }
		} = await supabase.auth.getUser();

		if (!user) return [];

		const { data, error } = await supabase
			.from('moments')
			.select('*')
			.eq('user_id', user.id)
			.eq('date', date)
			.order('created_at', { ascending: false });

		if (error) {
			console.error('Error fetching moments by date:', error);
			return [];
		}

		return data || [];
	} catch (error) {
		console.error('Unexpected error fetching moments by date:', error);
		return [];
	}
}
