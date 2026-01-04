export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
	public: {
		Tables: {
			profiles: {
				Row: {
					id: string;
					email: string | null;
					full_name: string | null;
					date_of_birth: string | null;
					onboarding_completed: boolean;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					email?: string | null;
					full_name?: string | null;
					date_of_birth?: string | null;
					onboarding_completed?: boolean;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					email?: string | null;
					full_name?: string | null;
					date_of_birth?: string | null;
					onboarding_completed?: boolean;
					created_at?: string;
					updated_at?: string;
				};
			};
			moments: {
				Row: {
					id: string;
					user_id: string;
					title: string;
					description: string | null;
					date: string;
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					title: string;
					description?: string | null;
					date: string;
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					title?: string;
					description?: string | null;
					date?: string;
					created_at?: string;
					updated_at?: string;
				};
			};
			[key: string]: {
				Row: Record<string, unknown>;
				Insert: Record<string, unknown>;
				Update: Record<string, unknown>;
			};
		};
		Views: {
			[key: string]: {
				Row: Record<string, unknown>;
			};
		};
		Functions: {
			[key: string]: {
				Args: Record<string, unknown>;
				Returns: unknown;
			};
		};
		Enums: {
			[key: string]: string;
		};
	};
}

