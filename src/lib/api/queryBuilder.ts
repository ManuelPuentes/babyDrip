import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '$lib/supabase/supabase';

// Strategy Interface
interface FilterStrategy {
	apply(builder: any, column: string, value: any): any;
}

// Concrete Strategies
class EqFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.eq(column, value);
	}
}

class GtFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.gt(column, value);
	}
}

class GteFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.gte(column, value);
	}
}

class LtFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.lt(column, value);
	}
}

class LteFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.lte(column, value);
	}
}

class InFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any[]) {
		return builder.in(column, value);
	}
}

class LikeFilter implements FilterStrategy {
	apply(builder: any, column: string, value: string) {
		return builder.like(column, value);
	}
}

class IlikeFilter implements FilterStrategy {
	apply(builder: any, column: string, value: string) {
		return builder.ilike(column, value);
	}
}

class IsFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.is(column, value);
	}
}

class ContainsFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.contains(column, value);
	}
}

class ContainedByFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.containedBy(column, value);
	}
}

class NotFilter implements FilterStrategy {
	apply(builder: any, column: string, value: any) {
		return builder.not(column, value);
	}
}

class OrFilter implements FilterStrategy {
	apply(builder: any, column: string, value: string) {
		return builder.or(value);
	}
}

class TextSearchFilter implements FilterStrategy {
	apply(builder: any, column: string, value: { query: string; config?: string }) {
		return builder.textSearch(column, value.query, { config: value.config });
	}
}

export enum FilterType {
	EQ = 'eq',
	GT = 'gt',
	GTE = 'gte',
	LT = 'lt',
	LTE = 'lte',
	IN = 'in',
	LIKE = 'like',
	ILIKE = 'ilike',
	IS = 'is',
	CONTAINS = 'contains',
	CONTAINED_BY = 'containedBy',
	NOT = 'not',
	OR = 'or',
	TEXT_SEARCH = 'textSearch'
}

export interface FilterCondition<T> {
	field: keyof T;
	filter: FilterType;
	value: any;
}

class SupabaseFilterBuilder<T> {
	private query: any;
	private strategies: Record<FilterType, FilterStrategy>;

	constructor(baseQuery: any) {
		this.query = baseQuery;
		this.strategies = {
			[FilterType.EQ]: new EqFilter(),
			[FilterType.GT]: new GtFilter(),
			[FilterType.GTE]: new GteFilter(),
			[FilterType.LT]: new LtFilter(),
			[FilterType.LTE]: new LteFilter(),
			[FilterType.IN]: new InFilter(),
			[FilterType.LIKE]: new LikeFilter(),
			[FilterType.ILIKE]: new IlikeFilter(),
			[FilterType.IS]: new IsFilter(),
			[FilterType.CONTAINS]: new ContainsFilter(),
			[FilterType.CONTAINED_BY]: new ContainedByFilter(),
			[FilterType.NOT]: new NotFilter(),
			[FilterType.OR]: new OrFilter(),
			[FilterType.TEXT_SEARCH]: new TextSearchFilter()
		};
	}

	addFilters(filters: Array<FilterCondition<T>> | undefined): this {
		if (!filters) return this;

		filters.forEach(({ field, filter, value }) => {
			const strategy = this.strategies[filter];
			if (!strategy) {
				throw new Error(`Unknown filter type: ${filter}`);
			}
			this.query = strategy.apply(this.query, field as string, value);
		});
		return this;
	}

	addFilter(filter: FilterCondition<T>): this {
		return this.addFilters([filter]);
	}

	get_query() {
		return this.query;
	}
}

// Example Usage
interface Product {
	id: string;
	name: string;
	price: number;
	category: string;
}
type CountType = 'exact' | 'planned' | 'estimated' | undefined;
type TableName = keyof Database['public']['Tables'];

export function buildQueryFilter<T>({
	supabaseClient,
	filters,
	select,
	count = undefined,
	table
}: {
	supabaseClient: SupabaseClient<Database>;
	table: TableName;
	select?: Array<keyof T>;
	count?: CountType;
	filters?: Array<FilterCondition<T>>;
}) {
	// Start with a base query

	const select_statement = select?.join(',') ?? '*';

	const baseQuery = supabaseClient.from(table).select(select_statement, { count });

	// Apply filters
	const query = new SupabaseFilterBuilder<T>(baseQuery).addFilters(filters).get_query(); // Get the final query

	// Execute with Supabase's native methods

	return query;
}
