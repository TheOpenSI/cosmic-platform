/// --- Core libraries --- ///


/// --- Type hints --- ///
import { useUserStore } from "../stores/UserStore";
import type {
	AllEmissionsResponse,
	MonthlyEmissionsStatsResponse,
	UserEmissionsSummaryResponse,
	UserEmissionsRollingResponse,
	UserTokensResponse,
	UserTokensRollingResponse,
} from "../types/DashBoard";


/// --- Internal libraries --- ///
import { fetchWithAuth } from "./fetchWithAuth";


// editorconfig-checker-disable
/**
 * Fetch ALL CodeCarbon emissions records (no filter applied).
 */
// editorconfig-checker-enable
export async function getAllEmissions(): Promise<AllEmissionsResponse> {
	return fetchWithAuth(
		`${import.meta.env.VITE_API_DATABASE_URL}/api/v1/emissions`,
	);
}

// editorconfig-checker-disable
/**
 * Fetch all emissions records belonging to a specific user_id.
 * Uses the `?user_id=` selected user id from useuserstore query param on the same GET / endpoint.
 * (filtered server-side via EmissionsFilterParams).
 */
// editorconfig-checker-enable
export async function getUserEmissions(): Promise<AllEmissionsResponse> {
	const selectedUser = useUserStore.getState().selectedUser;

	if (!selectedUser) {
		// No user selected yet — return an empty, well-shaped response instead
		// of throwing, so the Dashboard can render a clean "no data" state.
		return {
			success: false,
			count: 0,
			result: [],
		};
	}

	const params = new URLSearchParams({ user_id: selectedUser.id });

	return fetchWithAuth(
		`${import.meta.env.VITE_API_DATABASE_URL}/api/v1/emissions?${params.toString()}`,
	);
}

// editorconfig-checker-disable
/**
 * Fetch aggregated lifetime totals for the selected user (stat cards).
 */
// editorconfig-checker-enable
export async function getUserEmissionsSummary(): Promise<UserEmissionsSummaryResponse> {
	const selectedUser = useUserStore.getState().selectedUser;

	if (!selectedUser) {
		return {
			success: false,
			user_id: "",
			total_emissions: 0,
			total_cpu_power: 0,
			total_gpu_power: 0,
		};
	}

	return fetchWithAuth(
		`${import.meta.env.VITE_API_DATABASE_URL}/api/v1/emissions/stats/${selectedUser.id}/summary`,
	);
}

export async function getUserTokens(): Promise<UserTokensResponse> {
	const selectedUser = useUserStore.getState().selectedUser;

	if (!selectedUser) {
		return {
			success: false,
				result: {
					user_input_token: 0,
					user_output_token: 0,
				},
		};
	}

	return fetchWithAuth(
		`${import.meta.env.VITE_API_DATABASE_URL}/api/v1/tokens/user/${selectedUser.id}`,
	);
}

// editorconfig-checker-disable
/**
 * Fetch aggregated rolling monthly emissions for the selected user (line chart).
 */
// editorconfig-checker-enable
export async function getUserRollingStats(
	months: 3 | 6 | 12,
): Promise<UserEmissionsRollingResponse> {
	const selectedUser = useUserStore.getState().selectedUser;

	if (!selectedUser) {
		return {
			success: false,
			user_id: "",
			months,
			labels: [],
			totals: [],
		};
	}

	const params = new URLSearchParams({
		months: String(months),
	});

	return fetchWithAuth(
		`${import.meta.env.VITE_API_DATABASE_URL}/api/v1/emissions/stats/${selectedUser.id}/rolling?${params.toString()}`,
	);
}

export async function getUserTokenRollingStats(
	months: 3 | 6 | 12,
): Promise<UserTokensRollingResponse> {
	const selectedUser = useUserStore.getState().selectedUser;

	if (!selectedUser) {
		return {
			success: false,
			user_id: "",
			months,
			labels: [],
			input_totals: [],
			output_totals: [],
		};
	}

	const params = new URLSearchParams({ months: String(months) });

	return fetchWithAuth(
		`${import.meta.env.VITE_API_DATABASE_URL}/api/v1/tokens/user/${selectedUser.id}/rolling?${params.toString()}`,
	);
}

// editorconfig-checker-disable
/**
 * Fetch aggregated monthly emissions totals for the current year (all users).
 * Used by the global CoSMIC bar chart on the dashboard.
 */
// editorconfig-checker-enable
export async function getMonthlyEmissionsStats(): Promise<MonthlyEmissionsStatsResponse> {
	return fetchWithAuth(
		`${import.meta.env.VITE_API_DATABASE_URL}/api/v1/emissions/stats`,
	);
}

// editorconfig-checker-disable
/**
 * Fetch a single emission record by its emission_id.
 * Uses the `?emission_id=` query param on the same GET / endpoint.
 */
// editorconfig-checker-enable
export async function getEmissionById(
	emission_id: string,
): Promise<AllEmissionsResponse> {
	const params = new URLSearchParams({ emission_id });

	return fetchWithAuth(
		`${import.meta.env.VITE_API_DATABASE_URL}/api/v1/emissions?${params.toString()}`,
	);
}