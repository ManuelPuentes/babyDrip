export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	graphql_public: {
		Tables: {
			[_ in never]: never;
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			graphql: {
				Args: {
					operationName?: string;
					query?: string;
					variables?: Json;
					extensions?: Json;
				};
				Returns: Json;
			};
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
	public: {
		Tables: {
			client: {
				Row: {
					created_at: string;
					id: string;
					lastname: string;
					name: string;
					phone: string;
				};
				Insert: {
					created_at?: string;
					id?: string;
					lastname: string;
					name: string;
					phone: string;
				};
				Update: {
					created_at?: string;
					id?: string;
					lastname?: string;
					name?: string;
					phone?: string;
				};
				Relationships: [];
			};
			products: {
				Row: {
					cost: number;
					created_at: string;
					description: string;
					id: string;
					printed: boolean;
					purchase_order_id: string | null;
					size: string;
					sold_price: number;
					stored_at: string;
					updated_at: string;
				};
				Insert: {
					cost?: number;
					created_at?: string;
					description?: string;
					id?: string;
					printed?: boolean;
					purchase_order_id?: string | null;
					size?: string;
					sold_price?: number;
					stored_at: string;
					updated_at?: string;
				};
				Update: {
					cost?: number;
					created_at?: string;
					description?: string;
					id?: string;
					printed?: boolean;
					purchase_order_id?: string | null;
					size?: string;
					sold_price?: number;
					stored_at?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: 'products_purchase_order_id_fkey';
						columns: ['purchase_order_id'];
						isOneToOne: false;
						referencedRelation: 'purchase_order';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'products_stored_at_fkey';
						columns: ['stored_at'];
						isOneToOne: false;
						referencedRelation: 'warehouse';
						referencedColumns: ['id'];
					}
				];
			};
			purchase_order: {
				Row: {
					client: string;
					created_at: string;
					id: string;
					payment_details: Json;
					seller: string;
					total: number;
				};
				Insert: {
					client: string;
					created_at?: string;
					id?: string;
					payment_details: Json;
					seller: string;
					total: number;
				};
				Update: {
					client?: string;
					created_at?: string;
					id?: string;
					payment_details?: Json;
					seller?: string;
					total?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'purchase_order_client_fkey';
						columns: ['client'];
						isOneToOne: false;
						referencedRelation: 'client';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'purchase_order_seller_fkey';
						columns: ['seller'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					}
				];
			};
			sell: {
				Row: {
					admin: string;
					created_at: string;
					id: string;
					purchase_order_id: string;
					total: number;
				};
				Insert: {
					admin: string;
					created_at?: string;
					id?: string;
					purchase_order_id: string;
					total: number;
				};
				Update: {
					admin?: string;
					created_at?: string;
					id?: string;
					purchase_order_id?: string;
					total?: number;
				};
				Relationships: [
					{
						foreignKeyName: 'sell_admin_fkey';
						columns: ['admin'];
						isOneToOne: false;
						referencedRelation: 'user';
						referencedColumns: ['id'];
					},
					{
						foreignKeyName: 'sell_purchase_order_id_fkey';
						columns: ['purchase_order_id'];
						isOneToOne: false;
						referencedRelation: 'purchase_order';
						referencedColumns: ['id'];
					}
				];
			};
			user: {
				Row: {
					email: string;
					id: string;
				};
				Insert: {
					email?: string;
					id?: string;
				};
				Update: {
					email?: string;
					id?: string;
				};
				Relationships: [];
			};
			warehouse: {
				Row: {
					created_at: string;
					id: string;
					name: string;
					printed: boolean;
				};
				Insert: {
					created_at?: string;
					id?: string;
					name: string;
					printed?: boolean;
				};
				Update: {
					created_at?: string;
					id?: string;
					name?: string;
					printed?: boolean;
				};
				Relationships: [];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
		? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums'] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
		? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
		? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	graphql_public: {
		Enums: {}
	},
	public: {
		Enums: {}
	}
} as const;
