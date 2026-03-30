import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AddKetoneReadingRequest, AddLibraryMealPlanItemRequest, AddMealLogRequest, AddMealPlanItemRequest, AssignMealPlanRequest, ChangeDoctorPasswordRequest, CreateFoodRequest, CreateKidRequest, CreateLibraryMealPlanRequest, CreateMealPlanRequest, CreateRecipeRequest, CreateTokenRequest, CreateUserRequest, DashboardStats, Doctor, ErrorResponse, Food, FoodApproval, FoodApprovalRequest, ForceChangePasswordRequest, GetFoodsParams, GetKidKetoneReadingsParams, GetKidMealHistoryParams, GetKidMealLogParams, GetKidMealLogsParams, GetKidsParams, HealthStatus, KetoneReading, Kid, KidProfile, LibraryMealPlan, LibraryMealPlanDetail, LibraryMealPlanItem, LoginRequest, LoginResponse, MealDay, MealLog, MealLogDetail, MealPlan, MealPlanDetail, MealPlanItem, MedicalSettings, MedicalSettingsRequest, Note, NoteRequest, ParentToken, RecentActivityItem, RecipeDetail, RecipeIngredient, RecipeIngredientRequest, SuccessResponse, UpdateDoctorProfileRequest, UpdateFoodRequest, UpdateKidRequest, UpdateLibraryMealPlanRequest, UpdateMealLogImageRequest, UpdateMealPlanRequest, UpdateRecipeRequest, UpdateUserRequest, UploadUrlRequest, UploadUrlResponse, UserResponse, VisibilityRequest, WeightRecord, WeightRecordRequest } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Doctor login with username and password
 */
export declare const getDoctorLoginUrl: () => string;
export declare const doctorLogin: (loginRequest: LoginRequest, options?: RequestInit) => Promise<LoginResponse>;
export declare const getDoctorLoginMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof doctorLogin>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof doctorLogin>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
export type DoctorLoginMutationResult = NonNullable<Awaited<ReturnType<typeof doctorLogin>>>;
export type DoctorLoginMutationBody = BodyType<LoginRequest>;
export type DoctorLoginMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Doctor login with username and password
 */
export declare const useDoctorLogin: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof doctorLogin>>, TError, {
        data: BodyType<LoginRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof doctorLogin>>, TError, {
    data: BodyType<LoginRequest>;
}, TContext>;
/**
 * @summary Doctor logout
 */
export declare const getDoctorLogoutUrl: () => string;
export declare const doctorLogout: (options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDoctorLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof doctorLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof doctorLogout>>, TError, void, TContext>;
export type DoctorLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof doctorLogout>>>;
export type DoctorLogoutMutationError = ErrorType<unknown>;
/**
 * @summary Doctor logout
 */
export declare const useDoctorLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof doctorLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof doctorLogout>>, TError, void, TContext>;
/**
 * @summary Get current logged in doctor
 */
export declare const getGetMeUrl: () => string;
export declare const getMe: (options?: RequestInit) => Promise<Doctor>;
export declare const getGetMeQueryKey: () => readonly ["/api/auth/me"];
export declare const getGetMeQueryOptions: <TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMeQueryResult = NonNullable<Awaited<ReturnType<typeof getMe>>>;
export type GetMeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get current logged in doctor
 */
export declare function useGetMe<TData = Awaited<ReturnType<typeof getMe>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update doctor profile (name, email, designation, username)
 */
export declare const getUpdateDoctorProfileUrl: () => string;
export declare const updateDoctorProfile: (updateDoctorProfileRequest: UpdateDoctorProfileRequest, options?: RequestInit) => Promise<Doctor>;
export declare const getUpdateDoctorProfileMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDoctorProfile>>, TError, {
        data: BodyType<UpdateDoctorProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateDoctorProfile>>, TError, {
    data: BodyType<UpdateDoctorProfileRequest>;
}, TContext>;
export type UpdateDoctorProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateDoctorProfile>>>;
export type UpdateDoctorProfileMutationBody = BodyType<UpdateDoctorProfileRequest>;
export type UpdateDoctorProfileMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Update doctor profile (name, email, designation, username)
 */
export declare const useUpdateDoctorProfile: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateDoctorProfile>>, TError, {
        data: BodyType<UpdateDoctorProfileRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateDoctorProfile>>, TError, {
    data: BodyType<UpdateDoctorProfileRequest>;
}, TContext>;
/**
 * @summary Force password change (first login — no current password required)
 */
export declare const getForceChangePasswordUrl: () => string;
export declare const forceChangePassword: (forceChangePasswordRequest: ForceChangePasswordRequest, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getForceChangePasswordMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof forceChangePassword>>, TError, {
        data: BodyType<ForceChangePasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof forceChangePassword>>, TError, {
    data: BodyType<ForceChangePasswordRequest>;
}, TContext>;
export type ForceChangePasswordMutationResult = NonNullable<Awaited<ReturnType<typeof forceChangePassword>>>;
export type ForceChangePasswordMutationBody = BodyType<ForceChangePasswordRequest>;
export type ForceChangePasswordMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Force password change (first login — no current password required)
 */
export declare const useForceChangePassword: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof forceChangePassword>>, TError, {
        data: BodyType<ForceChangePasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof forceChangePassword>>, TError, {
    data: BodyType<ForceChangePasswordRequest>;
}, TContext>;
/**
 * @summary Change doctor password (requires current password)
 */
export declare const getChangeDoctorPasswordUrl: () => string;
export declare const changeDoctorPassword: (changeDoctorPasswordRequest: ChangeDoctorPasswordRequest, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getChangeDoctorPasswordMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof changeDoctorPassword>>, TError, {
        data: BodyType<ChangeDoctorPasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof changeDoctorPassword>>, TError, {
    data: BodyType<ChangeDoctorPasswordRequest>;
}, TContext>;
export type ChangeDoctorPasswordMutationResult = NonNullable<Awaited<ReturnType<typeof changeDoctorPassword>>>;
export type ChangeDoctorPasswordMutationBody = BodyType<ChangeDoctorPasswordRequest>;
export type ChangeDoctorPasswordMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Change doctor password (requires current password)
 */
export declare const useChangeDoctorPassword: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof changeDoctorPassword>>, TError, {
        data: BodyType<ChangeDoctorPasswordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof changeDoctorPassword>>, TError, {
    data: BodyType<ChangeDoctorPasswordRequest>;
}, TContext>;
/**
 * @summary Get dashboard statistics
 */
export declare const getGetDashboardStatsUrl: () => string;
export declare const getDashboardStats: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetDashboardStatsQueryKey: () => readonly ["/api/dashboard/stats"];
export declare const getGetDashboardStatsQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardStats>>>;
export type GetDashboardStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard statistics
 */
export declare function useGetDashboardStats<TData = Awaited<ReturnType<typeof getDashboardStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get recent clinical activity feed
 */
export declare const getGetDashboardRecentActivityUrl: () => string;
export declare const getDashboardRecentActivity: (options?: RequestInit) => Promise<RecentActivityItem[]>;
export declare const getGetDashboardRecentActivityQueryKey: () => readonly ["/api/dashboard/recent-activity"];
export declare const getGetDashboardRecentActivityQueryOptions: <TData = Awaited<ReturnType<typeof getDashboardRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getDashboardRecentActivity>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetDashboardRecentActivityQueryResult = NonNullable<Awaited<ReturnType<typeof getDashboardRecentActivity>>>;
export type GetDashboardRecentActivityQueryError = ErrorType<unknown>;
/**
 * @summary Get recent clinical activity feed
 */
export declare function useGetDashboardRecentActivity<TData = Awaited<ReturnType<typeof getDashboardRecentActivity>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getDashboardRecentActivity>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get all kids with optional search and filter
 */
export declare const getGetKidsUrl: (params?: GetKidsParams) => string;
export declare const getKids: (params?: GetKidsParams, options?: RequestInit) => Promise<Kid[]>;
export declare const getGetKidsQueryKey: (params?: GetKidsParams) => readonly ["/api/kids", ...GetKidsParams[]];
export declare const getGetKidsQueryOptions: <TData = Awaited<ReturnType<typeof getKids>>, TError = ErrorType<unknown>>(params?: GetKidsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKids>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKids>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidsQueryResult = NonNullable<Awaited<ReturnType<typeof getKids>>>;
export type GetKidsQueryError = ErrorType<unknown>;
/**
 * @summary Get all kids with optional search and filter
 */
export declare function useGetKids<TData = Awaited<ReturnType<typeof getKids>>, TError = ErrorType<unknown>>(params?: GetKidsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKids>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new kid profile
 */
export declare const getCreateKidUrl: () => string;
export declare const createKid: (createKidRequest: CreateKidRequest, options?: RequestInit) => Promise<Kid>;
export declare const getCreateKidMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createKid>>, TError, {
        data: BodyType<CreateKidRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createKid>>, TError, {
    data: BodyType<CreateKidRequest>;
}, TContext>;
export type CreateKidMutationResult = NonNullable<Awaited<ReturnType<typeof createKid>>>;
export type CreateKidMutationBody = BodyType<CreateKidRequest>;
export type CreateKidMutationError = ErrorType<unknown>;
/**
 * @summary Create a new kid profile
 */
export declare const useCreateKid: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createKid>>, TError, {
        data: BodyType<CreateKidRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createKid>>, TError, {
    data: BodyType<CreateKidRequest>;
}, TContext>;
/**
 * @summary Get kid profile
 */
export declare const getGetKidUrl: (kidId: number) => string;
export declare const getKid: (kidId: number, options?: RequestInit) => Promise<KidProfile>;
export declare const getGetKidQueryKey: (kidId: number) => readonly [`/api/kids/${number}`];
export declare const getGetKidQueryOptions: <TData = Awaited<ReturnType<typeof getKid>>, TError = ErrorType<ErrorResponse>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKid>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKid>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidQueryResult = NonNullable<Awaited<ReturnType<typeof getKid>>>;
export type GetKidQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get kid profile
 */
export declare function useGetKid<TData = Awaited<ReturnType<typeof getKid>>, TError = ErrorType<ErrorResponse>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKid>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update kid information
 */
export declare const getUpdateKidUrl: (kidId: number) => string;
export declare const updateKid: (kidId: number, updateKidRequest: UpdateKidRequest, options?: RequestInit) => Promise<Kid>;
export declare const getUpdateKidMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKid>>, TError, {
        kidId: number;
        data: BodyType<UpdateKidRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateKid>>, TError, {
    kidId: number;
    data: BodyType<UpdateKidRequest>;
}, TContext>;
export type UpdateKidMutationResult = NonNullable<Awaited<ReturnType<typeof updateKid>>>;
export type UpdateKidMutationBody = BodyType<UpdateKidRequest>;
export type UpdateKidMutationError = ErrorType<unknown>;
/**
 * @summary Update kid information
 */
export declare const useUpdateKid: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKid>>, TError, {
        kidId: number;
        data: BodyType<UpdateKidRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateKid>>, TError, {
    kidId: number;
    data: BodyType<UpdateKidRequest>;
}, TContext>;
/**
 * @summary Delete a kid and all associated data
 */
export declare const getDeleteKidUrl: (kidId: number) => string;
export declare const deleteKid: (kidId: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteKidMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKid>>, TError, {
        kidId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteKid>>, TError, {
    kidId: number;
}, TContext>;
export type DeleteKidMutationResult = NonNullable<Awaited<ReturnType<typeof deleteKid>>>;
export type DeleteKidMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Delete a kid and all associated data
 */
export declare const useDeleteKid: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKid>>, TError, {
        kidId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteKid>>, TError, {
    kidId: number;
}, TContext>;
/**
 * @summary Add weight record for a kid
 */
export declare const getAddWeightRecordUrl: (kidId: number) => string;
export declare const addWeightRecord: (kidId: number, weightRecordRequest: WeightRecordRequest, options?: RequestInit) => Promise<WeightRecord>;
export declare const getAddWeightRecordMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addWeightRecord>>, TError, {
        kidId: number;
        data: BodyType<WeightRecordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addWeightRecord>>, TError, {
    kidId: number;
    data: BodyType<WeightRecordRequest>;
}, TContext>;
export type AddWeightRecordMutationResult = NonNullable<Awaited<ReturnType<typeof addWeightRecord>>>;
export type AddWeightRecordMutationBody = BodyType<WeightRecordRequest>;
export type AddWeightRecordMutationError = ErrorType<unknown>;
/**
 * @summary Add weight record for a kid
 */
export declare const useAddWeightRecord: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addWeightRecord>>, TError, {
        kidId: number;
        data: BodyType<WeightRecordRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addWeightRecord>>, TError, {
    kidId: number;
    data: BodyType<WeightRecordRequest>;
}, TContext>;
/**
 * @summary Get weight history for a kid
 */
export declare const getGetWeightHistoryUrl: (kidId: number) => string;
export declare const getWeightHistory: (kidId: number, options?: RequestInit) => Promise<WeightRecord[]>;
export declare const getGetWeightHistoryQueryKey: (kidId: number) => readonly [`/api/kids/${number}/weight`];
export declare const getGetWeightHistoryQueryOptions: <TData = Awaited<ReturnType<typeof getWeightHistory>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWeightHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getWeightHistory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetWeightHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof getWeightHistory>>>;
export type GetWeightHistoryQueryError = ErrorType<unknown>;
/**
 * @summary Get weight history for a kid
 */
export declare function useGetWeightHistory<TData = Awaited<ReturnType<typeof getWeightHistory>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getWeightHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get kid medical settings
 */
export declare const getGetKidMedicalUrl: (kidId: number) => string;
export declare const getKidMedical: (kidId: number, options?: RequestInit) => Promise<MedicalSettings>;
export declare const getGetKidMedicalQueryKey: (kidId: number) => readonly [`/api/kids/${number}/medical`];
export declare const getGetKidMedicalQueryOptions: <TData = Awaited<ReturnType<typeof getKidMedical>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMedical>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidMedical>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidMedicalQueryResult = NonNullable<Awaited<ReturnType<typeof getKidMedical>>>;
export type GetKidMedicalQueryError = ErrorType<unknown>;
/**
 * @summary Get kid medical settings
 */
export declare function useGetKidMedical<TData = Awaited<ReturnType<typeof getKidMedical>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMedical>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update kid medical settings
 */
export declare const getUpdateKidMedicalUrl: (kidId: number) => string;
export declare const updateKidMedical: (kidId: number, medicalSettingsRequest: MedicalSettingsRequest, options?: RequestInit) => Promise<MedicalSettings>;
export declare const getUpdateKidMedicalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKidMedical>>, TError, {
        kidId: number;
        data: BodyType<MedicalSettingsRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateKidMedical>>, TError, {
    kidId: number;
    data: BodyType<MedicalSettingsRequest>;
}, TContext>;
export type UpdateKidMedicalMutationResult = NonNullable<Awaited<ReturnType<typeof updateKidMedical>>>;
export type UpdateKidMedicalMutationBody = BodyType<MedicalSettingsRequest>;
export type UpdateKidMedicalMutationError = ErrorType<unknown>;
/**
 * @summary Update kid medical settings
 */
export declare const useUpdateKidMedical: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKidMedical>>, TError, {
        kidId: number;
        data: BodyType<MedicalSettingsRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateKidMedical>>, TError, {
    kidId: number;
    data: BodyType<MedicalSettingsRequest>;
}, TContext>;
/**
 * @summary Get meal history for a kid
 */
export declare const getGetKidMealHistoryUrl: (kidId: number, params?: GetKidMealHistoryParams) => string;
export declare const getKidMealHistory: (kidId: number, params?: GetKidMealHistoryParams, options?: RequestInit) => Promise<MealDay[]>;
export declare const getGetKidMealHistoryQueryKey: (kidId: number, params?: GetKidMealHistoryParams) => readonly [`/api/kids/${number}/meal-history`, ...GetKidMealHistoryParams[]];
export declare const getGetKidMealHistoryQueryOptions: <TData = Awaited<ReturnType<typeof getKidMealHistory>>, TError = ErrorType<unknown>>(kidId: number, params?: GetKidMealHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidMealHistory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidMealHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof getKidMealHistory>>>;
export type GetKidMealHistoryQueryError = ErrorType<unknown>;
/**
 * @summary Get meal history for a kid
 */
export declare function useGetKidMealHistory<TData = Awaited<ReturnType<typeof getKidMealHistory>>, TError = ErrorType<unknown>>(kidId: number, params?: GetKidMealHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get private notes for a kid
 */
export declare const getGetKidNotesUrl: (kidId: number) => string;
export declare const getKidNotes: (kidId: number, options?: RequestInit) => Promise<Note[]>;
export declare const getGetKidNotesQueryKey: (kidId: number) => readonly [`/api/kids/${number}/notes`];
export declare const getGetKidNotesQueryOptions: <TData = Awaited<ReturnType<typeof getKidNotes>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidNotes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidNotes>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidNotesQueryResult = NonNullable<Awaited<ReturnType<typeof getKidNotes>>>;
export type GetKidNotesQueryError = ErrorType<unknown>;
/**
 * @summary Get private notes for a kid
 */
export declare function useGetKidNotes<TData = Awaited<ReturnType<typeof getKidNotes>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidNotes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a private note for a kid
 */
export declare const getAddKidNoteUrl: (kidId: number) => string;
export declare const addKidNote: (kidId: number, noteRequest: NoteRequest, options?: RequestInit) => Promise<Note>;
export declare const getAddKidNoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addKidNote>>, TError, {
        kidId: number;
        data: BodyType<NoteRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addKidNote>>, TError, {
    kidId: number;
    data: BodyType<NoteRequest>;
}, TContext>;
export type AddKidNoteMutationResult = NonNullable<Awaited<ReturnType<typeof addKidNote>>>;
export type AddKidNoteMutationBody = BodyType<NoteRequest>;
export type AddKidNoteMutationError = ErrorType<unknown>;
/**
 * @summary Add a private note for a kid
 */
export declare const useAddKidNote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addKidNote>>, TError, {
        kidId: number;
        data: BodyType<NoteRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addKidNote>>, TError, {
    kidId: number;
    data: BodyType<NoteRequest>;
}, TContext>;
/**
 * @summary Delete a private note
 */
export declare const getDeleteKidNoteUrl: (kidId: number, noteId: number) => string;
export declare const deleteKidNote: (kidId: number, noteId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteKidNoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKidNote>>, TError, {
        kidId: number;
        noteId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteKidNote>>, TError, {
    kidId: number;
    noteId: number;
}, TContext>;
export type DeleteKidNoteMutationResult = NonNullable<Awaited<ReturnType<typeof deleteKidNote>>>;
export type DeleteKidNoteMutationError = ErrorType<unknown>;
/**
 * @summary Delete a private note
 */
export declare const useDeleteKidNote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKidNote>>, TError, {
        kidId: number;
        noteId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteKidNote>>, TError, {
    kidId: number;
    noteId: number;
}, TContext>;
/**
 * @summary Update food/recipe visibility for a kid
 */
export declare const getUpdateFoodVisibilityUrl: (kidId: number) => string;
export declare const updateFoodVisibility: (kidId: number, visibilityRequest: VisibilityRequest, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getUpdateFoodVisibilityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFoodVisibility>>, TError, {
        kidId: number;
        data: BodyType<VisibilityRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateFoodVisibility>>, TError, {
    kidId: number;
    data: BodyType<VisibilityRequest>;
}, TContext>;
export type UpdateFoodVisibilityMutationResult = NonNullable<Awaited<ReturnType<typeof updateFoodVisibility>>>;
export type UpdateFoodVisibilityMutationBody = BodyType<VisibilityRequest>;
export type UpdateFoodVisibilityMutationError = ErrorType<unknown>;
/**
 * @summary Update food/recipe visibility for a kid
 */
export declare const useUpdateFoodVisibility: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFoodVisibility>>, TError, {
        kidId: number;
        data: BodyType<VisibilityRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateFoodVisibility>>, TError, {
    kidId: number;
    data: BodyType<VisibilityRequest>;
}, TContext>;
/**
 * @summary Get per-meal log entries for a kid (optionally filtered by date)
 */
export declare const getGetKidMealLogsUrl: (kidId: number, params?: GetKidMealLogsParams) => string;
export declare const getKidMealLogs: (kidId: number, params?: GetKidMealLogsParams, options?: RequestInit) => Promise<MealLog[]>;
export declare const getGetKidMealLogsQueryKey: (kidId: number, params?: GetKidMealLogsParams) => readonly [`/api/kids/${number}/meal-logs`, ...GetKidMealLogsParams[]];
export declare const getGetKidMealLogsQueryOptions: <TData = Awaited<ReturnType<typeof getKidMealLogs>>, TError = ErrorType<unknown>>(kidId: number, params?: GetKidMealLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidMealLogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidMealLogsQueryResult = NonNullable<Awaited<ReturnType<typeof getKidMealLogs>>>;
export type GetKidMealLogsQueryError = ErrorType<unknown>;
/**
 * @summary Get per-meal log entries for a kid (optionally filtered by date)
 */
export declare function useGetKidMealLogs<TData = Awaited<ReturnType<typeof getKidMealLogs>>, TError = ErrorType<unknown>>(kidId: number, params?: GetKidMealLogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealLogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Log a per-meal entry for a kid
 */
export declare const getAddMealLogUrl: (kidId: number) => string;
export declare const addMealLog: (kidId: number, addMealLogRequest: AddMealLogRequest, options?: RequestInit) => Promise<MealLog>;
export declare const getAddMealLogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addMealLog>>, TError, {
        kidId: number;
        data: BodyType<AddMealLogRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addMealLog>>, TError, {
    kidId: number;
    data: BodyType<AddMealLogRequest>;
}, TContext>;
export type AddMealLogMutationResult = NonNullable<Awaited<ReturnType<typeof addMealLog>>>;
export type AddMealLogMutationBody = BodyType<AddMealLogRequest>;
export type AddMealLogMutationError = ErrorType<unknown>;
/**
 * @summary Log a per-meal entry for a kid
 */
export declare const useAddMealLog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addMealLog>>, TError, {
        kidId: number;
        data: BodyType<AddMealLogRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addMealLog>>, TError, {
    kidId: number;
    data: BodyType<AddMealLogRequest>;
}, TContext>;
/**
 * @summary Delete a meal log entry
 */
export declare const getDeleteMealLogUrl: (kidId: number, logId: number) => string;
export declare const deleteMealLog: (kidId: number, logId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteMealLogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMealLog>>, TError, {
        kidId: number;
        logId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteMealLog>>, TError, {
    kidId: number;
    logId: number;
}, TContext>;
export type DeleteMealLogMutationResult = NonNullable<Awaited<ReturnType<typeof deleteMealLog>>>;
export type DeleteMealLogMutationError = ErrorType<unknown>;
/**
 * @summary Delete a meal log entry
 */
export declare const useDeleteMealLog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMealLog>>, TError, {
        kidId: number;
        logId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteMealLog>>, TError, {
    kidId: number;
    logId: number;
}, TContext>;
/**
 * @summary Set or clear the photo image URL for a meal log entry
 */
export declare const getUpdateMealLogImageUrl: (kidId: number, logId: number) => string;
export declare const updateMealLogImage: (kidId: number, logId: number, updateMealLogImageRequest: UpdateMealLogImageRequest, options?: RequestInit) => Promise<MealLog>;
export declare const getUpdateMealLogImageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMealLogImage>>, TError, {
        kidId: number;
        logId: number;
        data: BodyType<UpdateMealLogImageRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMealLogImage>>, TError, {
    kidId: number;
    logId: number;
    data: BodyType<UpdateMealLogImageRequest>;
}, TContext>;
export type UpdateMealLogImageMutationResult = NonNullable<Awaited<ReturnType<typeof updateMealLogImage>>>;
export type UpdateMealLogImageMutationBody = BodyType<UpdateMealLogImageRequest>;
export type UpdateMealLogImageMutationError = ErrorType<unknown>;
/**
 * @summary Set or clear the photo image URL for a meal log entry
 */
export declare const useUpdateMealLogImage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMealLogImage>>, TError, {
        kidId: number;
        logId: number;
        data: BodyType<UpdateMealLogImageRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMealLogImage>>, TError, {
    kidId: number;
    logId: number;
    data: BodyType<UpdateMealLogImageRequest>;
}, TContext>;
/**
 * @summary Get all food approval records for a kid
 */
export declare const getGetKidFoodApprovalsUrl: (kidId: number) => string;
export declare const getKidFoodApprovals: (kidId: number, options?: RequestInit) => Promise<FoodApproval[]>;
export declare const getGetKidFoodApprovalsQueryKey: (kidId: number) => readonly [`/api/kids/${number}/food-approvals`];
export declare const getGetKidFoodApprovalsQueryOptions: <TData = Awaited<ReturnType<typeof getKidFoodApprovals>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidFoodApprovals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidFoodApprovals>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidFoodApprovalsQueryResult = NonNullable<Awaited<ReturnType<typeof getKidFoodApprovals>>>;
export type GetKidFoodApprovalsQueryError = ErrorType<unknown>;
/**
 * @summary Get all food approval records for a kid
 */
export declare function useGetKidFoodApprovals<TData = Awaited<ReturnType<typeof getKidFoodApprovals>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidFoodApprovals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Set or delete a food approval status for a kid
 */
export declare const getUpsertKidFoodApprovalUrl: (kidId: number, foodId: number) => string;
export declare const upsertKidFoodApproval: (kidId: number, foodId: number, foodApprovalRequest: FoodApprovalRequest, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getUpsertKidFoodApprovalMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof upsertKidFoodApproval>>, TError, {
        kidId: number;
        foodId: number;
        data: BodyType<FoodApprovalRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof upsertKidFoodApproval>>, TError, {
    kidId: number;
    foodId: number;
    data: BodyType<FoodApprovalRequest>;
}, TContext>;
export type UpsertKidFoodApprovalMutationResult = NonNullable<Awaited<ReturnType<typeof upsertKidFoodApproval>>>;
export type UpsertKidFoodApprovalMutationBody = BodyType<FoodApprovalRequest>;
export type UpsertKidFoodApprovalMutationError = ErrorType<unknown>;
/**
 * @summary Set or delete a food approval status for a kid
 */
export declare const useUpsertKidFoodApproval: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof upsertKidFoodApproval>>, TError, {
        kidId: number;
        foodId: number;
        data: BodyType<FoodApprovalRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof upsertKidFoodApproval>>, TError, {
    kidId: number;
    foodId: number;
    data: BodyType<FoodApprovalRequest>;
}, TContext>;
/**
 * @summary List all parent access tokens for the doctor's kids
 */
export declare const getListTokensUrl: () => string;
export declare const listTokens: (options?: RequestInit) => Promise<ParentToken[]>;
export declare const getListTokensQueryKey: () => readonly ["/api/tokens"];
export declare const getListTokensQueryOptions: <TData = Awaited<ReturnType<typeof listTokens>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTokens>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTokens>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTokensQueryResult = NonNullable<Awaited<ReturnType<typeof listTokens>>>;
export type ListTokensQueryError = ErrorType<unknown>;
/**
 * @summary List all parent access tokens for the doctor's kids
 */
export declare function useListTokens<TData = Awaited<ReturnType<typeof listTokens>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTokens>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Generate (or regenerate) a parent access token for a kid
 */
export declare const getCreateTokenUrl: () => string;
export declare const createToken: (createTokenRequest: CreateTokenRequest, options?: RequestInit) => Promise<ParentToken>;
export declare const getCreateTokenMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createToken>>, TError, {
        data: BodyType<CreateTokenRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createToken>>, TError, {
    data: BodyType<CreateTokenRequest>;
}, TContext>;
export type CreateTokenMutationResult = NonNullable<Awaited<ReturnType<typeof createToken>>>;
export type CreateTokenMutationBody = BodyType<CreateTokenRequest>;
export type CreateTokenMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Generate (or regenerate) a parent access token for a kid
 */
export declare const useCreateToken: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createToken>>, TError, {
        data: BodyType<CreateTokenRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createToken>>, TError, {
    data: BodyType<CreateTokenRequest>;
}, TContext>;
/**
 * @summary Regenerate a parent token (invalidates old token)
 */
export declare const getResetTokenUrl: (tokenId: number) => string;
export declare const resetToken: (tokenId: number, options?: RequestInit) => Promise<ParentToken>;
export declare const getResetTokenMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof resetToken>>, TError, {
        tokenId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof resetToken>>, TError, {
    tokenId: number;
}, TContext>;
export type ResetTokenMutationResult = NonNullable<Awaited<ReturnType<typeof resetToken>>>;
export type ResetTokenMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Regenerate a parent token (invalidates old token)
 */
export declare const useResetToken: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof resetToken>>, TError, {
        tokenId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof resetToken>>, TError, {
    tokenId: number;
}, TContext>;
/**
 * @summary Revoke and delete a parent token
 */
export declare const getRevokeTokenUrl: (tokenId: number) => string;
export declare const revokeToken: (tokenId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getRevokeTokenMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof revokeToken>>, TError, {
        tokenId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof revokeToken>>, TError, {
    tokenId: number;
}, TContext>;
export type RevokeTokenMutationResult = NonNullable<Awaited<ReturnType<typeof revokeToken>>>;
export type RevokeTokenMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Revoke and delete a parent token
 */
export declare const useRevokeToken: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof revokeToken>>, TError, {
        tokenId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof revokeToken>>, TError, {
    tokenId: number;
}, TContext>;
/**
 * @summary List all recipes for the logged-in doctor
 */
export declare const getListRecipesUrl: () => string;
export declare const listRecipes: (options?: RequestInit) => Promise<RecipeDetail[]>;
export declare const getListRecipesQueryKey: () => readonly ["/api/recipes"];
export declare const getListRecipesQueryOptions: <TData = Awaited<ReturnType<typeof listRecipes>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRecipes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listRecipes>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListRecipesQueryResult = NonNullable<Awaited<ReturnType<typeof listRecipes>>>;
export type ListRecipesQueryError = ErrorType<unknown>;
/**
 * @summary List all recipes for the logged-in doctor
 */
export declare function useListRecipes<TData = Awaited<ReturnType<typeof listRecipes>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRecipes>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new recipe with ingredients
 */
export declare const getCreateRecipeUrl: () => string;
export declare const createRecipe: (createRecipeRequest: CreateRecipeRequest, options?: RequestInit) => Promise<RecipeDetail>;
export declare const getCreateRecipeMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRecipe>>, TError, {
        data: BodyType<CreateRecipeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createRecipe>>, TError, {
    data: BodyType<CreateRecipeRequest>;
}, TContext>;
export type CreateRecipeMutationResult = NonNullable<Awaited<ReturnType<typeof createRecipe>>>;
export type CreateRecipeMutationBody = BodyType<CreateRecipeRequest>;
export type CreateRecipeMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Create a new recipe with ingredients
 */
export declare const useCreateRecipe: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRecipe>>, TError, {
        data: BodyType<CreateRecipeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createRecipe>>, TError, {
    data: BodyType<CreateRecipeRequest>;
}, TContext>;
/**
 * @summary Get a single recipe with ingredients
 */
export declare const getGetRecipeUrl: (recipeId: number) => string;
export declare const getRecipe: (recipeId: number, options?: RequestInit) => Promise<RecipeDetail>;
export declare const getGetRecipeQueryKey: (recipeId: number) => readonly [`/api/recipes/${number}`];
export declare const getGetRecipeQueryOptions: <TData = Awaited<ReturnType<typeof getRecipe>>, TError = ErrorType<ErrorResponse>>(recipeId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecipe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRecipe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRecipeQueryResult = NonNullable<Awaited<ReturnType<typeof getRecipe>>>;
export type GetRecipeQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a single recipe with ingredients
 */
export declare function useGetRecipe<TData = Awaited<ReturnType<typeof getRecipe>>, TError = ErrorType<ErrorResponse>>(recipeId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRecipe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a recipe and replace its ingredients
 */
export declare const getUpdateRecipeUrl: (recipeId: number) => string;
export declare const updateRecipe: (recipeId: number, updateRecipeRequest: UpdateRecipeRequest, options?: RequestInit) => Promise<RecipeDetail>;
export declare const getUpdateRecipeMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRecipe>>, TError, {
        recipeId: number;
        data: BodyType<UpdateRecipeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateRecipe>>, TError, {
    recipeId: number;
    data: BodyType<UpdateRecipeRequest>;
}, TContext>;
export type UpdateRecipeMutationResult = NonNullable<Awaited<ReturnType<typeof updateRecipe>>>;
export type UpdateRecipeMutationBody = BodyType<UpdateRecipeRequest>;
export type UpdateRecipeMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Update a recipe and replace its ingredients
 */
export declare const useUpdateRecipe: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRecipe>>, TError, {
        recipeId: number;
        data: BodyType<UpdateRecipeRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateRecipe>>, TError, {
    recipeId: number;
    data: BodyType<UpdateRecipeRequest>;
}, TContext>;
/**
 * @summary Delete a recipe and all its ingredients
 */
export declare const getDeleteRecipeUrl: (recipeId: number) => string;
export declare const deleteRecipe: (recipeId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteRecipeMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRecipe>>, TError, {
        recipeId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteRecipe>>, TError, {
    recipeId: number;
}, TContext>;
export type DeleteRecipeMutationResult = NonNullable<Awaited<ReturnType<typeof deleteRecipe>>>;
export type DeleteRecipeMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Delete a recipe and all its ingredients
 */
export declare const useDeleteRecipe: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRecipe>>, TError, {
        recipeId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteRecipe>>, TError, {
    recipeId: number;
}, TContext>;
/**
 * @summary Add an ingredient to a recipe
 */
export declare const getAddRecipeIngredientUrl: (recipeId: number) => string;
export declare const addRecipeIngredient: (recipeId: number, recipeIngredientRequest: RecipeIngredientRequest, options?: RequestInit) => Promise<RecipeIngredient>;
export declare const getAddRecipeIngredientMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addRecipeIngredient>>, TError, {
        recipeId: number;
        data: BodyType<RecipeIngredientRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addRecipeIngredient>>, TError, {
    recipeId: number;
    data: BodyType<RecipeIngredientRequest>;
}, TContext>;
export type AddRecipeIngredientMutationResult = NonNullable<Awaited<ReturnType<typeof addRecipeIngredient>>>;
export type AddRecipeIngredientMutationBody = BodyType<RecipeIngredientRequest>;
export type AddRecipeIngredientMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Add an ingredient to a recipe
 */
export declare const useAddRecipeIngredient: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addRecipeIngredient>>, TError, {
        recipeId: number;
        data: BodyType<RecipeIngredientRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addRecipeIngredient>>, TError, {
    recipeId: number;
    data: BodyType<RecipeIngredientRequest>;
}, TContext>;
/**
 * @summary Remove an ingredient from a recipe
 */
export declare const getDeleteRecipeIngredientUrl: (recipeId: number, ingId: number) => string;
export declare const deleteRecipeIngredient: (recipeId: number, ingId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteRecipeIngredientMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRecipeIngredient>>, TError, {
        recipeId: number;
        ingId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteRecipeIngredient>>, TError, {
    recipeId: number;
    ingId: number;
}, TContext>;
export type DeleteRecipeIngredientMutationResult = NonNullable<Awaited<ReturnType<typeof deleteRecipeIngredient>>>;
export type DeleteRecipeIngredientMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Remove an ingredient from a recipe
 */
export declare const useDeleteRecipeIngredient: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRecipeIngredient>>, TError, {
        recipeId: number;
        ingId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteRecipeIngredient>>, TError, {
    recipeId: number;
    ingId: number;
}, TContext>;
/**
 * @summary List all users (admin only)
 */
export declare const getListUsersUrl: () => string;
export declare const listUsers: (options?: RequestInit) => Promise<UserResponse[]>;
export declare const getListUsersQueryKey: () => readonly ["/api/users"];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<ErrorResponse>;
/**
 * @summary List all users (admin only)
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<ErrorResponse>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new user (admin only)
 */
export declare const getCreateUserUrl: () => string;
export declare const createUser: (createUserRequest: CreateUserRequest, options?: RequestInit) => Promise<UserResponse>;
export declare const getCreateUserMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<CreateUserRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<CreateUserRequest>;
}, TContext>;
export type CreateUserMutationResult = NonNullable<Awaited<ReturnType<typeof createUser>>>;
export type CreateUserMutationBody = BodyType<CreateUserRequest>;
export type CreateUserMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Create a new user (admin only)
 */
export declare const useCreateUser: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createUser>>, TError, {
        data: BodyType<CreateUserRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createUser>>, TError, {
    data: BodyType<CreateUserRequest>;
}, TContext>;
/**
 * @summary Update a user (admin only)
 */
export declare const getUpdateUserUrl: (userId: number) => string;
export declare const updateUser: (userId: number, updateUserRequest: UpdateUserRequest, options?: RequestInit) => Promise<UserResponse>;
export declare const getUpdateUserMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        userId: number;
        data: BodyType<UpdateUserRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
    userId: number;
    data: BodyType<UpdateUserRequest>;
}, TContext>;
export type UpdateUserMutationResult = NonNullable<Awaited<ReturnType<typeof updateUser>>>;
export type UpdateUserMutationBody = BodyType<UpdateUserRequest>;
export type UpdateUserMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Update a user (admin only)
 */
export declare const useUpdateUser: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateUser>>, TError, {
        userId: number;
        data: BodyType<UpdateUserRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateUser>>, TError, {
    userId: number;
    data: BodyType<UpdateUserRequest>;
}, TContext>;
/**
 * @summary Delete a user (admin only)
 */
export declare const getDeleteUserUrl: (userId: number) => string;
export declare const deleteUser: (userId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteUserMutationOptions: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
        userId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
    userId: number;
}, TContext>;
export type DeleteUserMutationResult = NonNullable<Awaited<ReturnType<typeof deleteUser>>>;
export type DeleteUserMutationError = ErrorType<ErrorResponse>;
/**
 * @summary Delete a user (admin only)
 */
export declare const useDeleteUser: <TError = ErrorType<ErrorResponse>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteUser>>, TError, {
        userId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteUser>>, TError, {
    userId: number;
}, TContext>;
/**
 * @summary Request a presigned URL for file upload
 */
export declare const getRequestUploadUrlUrl: () => string;
export declare const requestUploadUrl: (uploadUrlRequest: UploadUrlRequest, options?: RequestInit) => Promise<UploadUrlResponse>;
export declare const getRequestUploadUrlMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
export type RequestUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestUploadUrl>>>;
export type RequestUploadUrlMutationBody = BodyType<UploadUrlRequest>;
export type RequestUploadUrlMutationError = ErrorType<unknown>;
/**
 * @summary Request a presigned URL for file upload
 */
export declare const useRequestUploadUrl: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
        data: BodyType<UploadUrlRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestUploadUrl>>, TError, {
    data: BodyType<UploadUrlRequest>;
}, TContext>;
/**
 * @summary Serve an object entity from PRIVATE_OBJECT_DIR
 */
export declare const getGetStorageObjectUrl: (objectPath: string) => string;
export declare const getStorageObject: (objectPath: string, options?: RequestInit) => Promise<Blob>;
export declare const getGetStorageObjectQueryKey: (objectPath: string) => readonly [`/api/storage/objects/${string}`];
export declare const getGetStorageObjectQueryOptions: <TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<unknown>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetStorageObjectQueryResult = NonNullable<Awaited<ReturnType<typeof getStorageObject>>>;
export type GetStorageObjectQueryError = ErrorType<unknown>;
/**
 * @summary Serve an object entity from PRIVATE_OBJECT_DIR
 */
export declare function useGetStorageObject<TData = Awaited<ReturnType<typeof getStorageObject>>, TError = ErrorType<unknown>>(objectPath: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getStorageObject>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get per-food meal entries for a kid on a given date, grouped by meal type
 */
export declare const getGetKidMealLogUrl: (kidId: number, params: GetKidMealLogParams) => string;
export declare const getKidMealLog: (kidId: number, params: GetKidMealLogParams, options?: RequestInit) => Promise<MealLogDetail>;
export declare const getGetKidMealLogQueryKey: (kidId: number, params?: GetKidMealLogParams) => readonly [`/api/kids/${number}/meal-log`, ...GetKidMealLogParams[]];
export declare const getGetKidMealLogQueryOptions: <TData = Awaited<ReturnType<typeof getKidMealLog>>, TError = ErrorType<unknown>>(kidId: number, params: GetKidMealLogParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealLog>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidMealLog>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidMealLogQueryResult = NonNullable<Awaited<ReturnType<typeof getKidMealLog>>>;
export type GetKidMealLogQueryError = ErrorType<unknown>;
/**
 * @summary Get per-food meal entries for a kid on a given date, grouped by meal type
 */
export declare function useGetKidMealLog<TData = Awaited<ReturnType<typeof getKidMealLog>>, TError = ErrorType<unknown>>(kidId: number, params: GetKidMealLogParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealLog>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get ketone readings for a kid
 */
export declare const getGetKidKetoneReadingsUrl: (kidId: number, params?: GetKidKetoneReadingsParams) => string;
export declare const getKidKetoneReadings: (kidId: number, params?: GetKidKetoneReadingsParams, options?: RequestInit) => Promise<KetoneReading[]>;
export declare const getGetKidKetoneReadingsQueryKey: (kidId: number, params?: GetKidKetoneReadingsParams) => readonly [`/api/kids/${number}/ketones`, ...GetKidKetoneReadingsParams[]];
export declare const getGetKidKetoneReadingsQueryOptions: <TData = Awaited<ReturnType<typeof getKidKetoneReadings>>, TError = ErrorType<unknown>>(kidId: number, params?: GetKidKetoneReadingsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidKetoneReadings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidKetoneReadings>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidKetoneReadingsQueryResult = NonNullable<Awaited<ReturnType<typeof getKidKetoneReadings>>>;
export type GetKidKetoneReadingsQueryError = ErrorType<unknown>;
/**
 * @summary Get ketone readings for a kid
 */
export declare function useGetKidKetoneReadings<TData = Awaited<ReturnType<typeof getKidKetoneReadings>>, TError = ErrorType<unknown>>(kidId: number, params?: GetKidKetoneReadingsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidKetoneReadings>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add a ketone reading
 */
export declare const getAddKetoneReadingUrl: (kidId: number) => string;
export declare const addKetoneReading: (kidId: number, addKetoneReadingRequest: AddKetoneReadingRequest, options?: RequestInit) => Promise<KetoneReading>;
export declare const getAddKetoneReadingMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addKetoneReading>>, TError, {
        kidId: number;
        data: BodyType<AddKetoneReadingRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addKetoneReading>>, TError, {
    kidId: number;
    data: BodyType<AddKetoneReadingRequest>;
}, TContext>;
export type AddKetoneReadingMutationResult = NonNullable<Awaited<ReturnType<typeof addKetoneReading>>>;
export type AddKetoneReadingMutationBody = BodyType<AddKetoneReadingRequest>;
export type AddKetoneReadingMutationError = ErrorType<unknown>;
/**
 * @summary Add a ketone reading
 */
export declare const useAddKetoneReading: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addKetoneReading>>, TError, {
        kidId: number;
        data: BodyType<AddKetoneReadingRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addKetoneReading>>, TError, {
    kidId: number;
    data: BodyType<AddKetoneReadingRequest>;
}, TContext>;
/**
 * @summary Delete a ketone reading
 */
export declare const getDeleteKetoneReadingUrl: (kidId: number, readingId: number) => string;
export declare const deleteKetoneReading: (kidId: number, readingId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteKetoneReadingMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKetoneReading>>, TError, {
        kidId: number;
        readingId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteKetoneReading>>, TError, {
    kidId: number;
    readingId: number;
}, TContext>;
export type DeleteKetoneReadingMutationResult = NonNullable<Awaited<ReturnType<typeof deleteKetoneReading>>>;
export type DeleteKetoneReadingMutationError = ErrorType<unknown>;
/**
 * @summary Delete a ketone reading
 */
export declare const useDeleteKetoneReading: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKetoneReading>>, TError, {
        kidId: number;
        readingId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteKetoneReading>>, TError, {
    kidId: number;
    readingId: number;
}, TContext>;
/**
 * @summary List all library meal plans (doctor-scoped)
 */
export declare const getGetLibraryMealPlansUrl: () => string;
export declare const getLibraryMealPlans: (options?: RequestInit) => Promise<LibraryMealPlan[]>;
export declare const getGetLibraryMealPlansQueryKey: () => readonly ["/api/meal-plans"];
export declare const getGetLibraryMealPlansQueryOptions: <TData = Awaited<ReturnType<typeof getLibraryMealPlans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLibraryMealPlans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLibraryMealPlans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLibraryMealPlansQueryResult = NonNullable<Awaited<ReturnType<typeof getLibraryMealPlans>>>;
export type GetLibraryMealPlansQueryError = ErrorType<unknown>;
/**
 * @summary List all library meal plans (doctor-scoped)
 */
export declare function useGetLibraryMealPlans<TData = Awaited<ReturnType<typeof getLibraryMealPlans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLibraryMealPlans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new library meal plan
 */
export declare const getCreateLibraryMealPlanUrl: () => string;
export declare const createLibraryMealPlan: (createLibraryMealPlanRequest: CreateLibraryMealPlanRequest, options?: RequestInit) => Promise<LibraryMealPlan>;
export declare const getCreateLibraryMealPlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLibraryMealPlan>>, TError, {
        data: BodyType<CreateLibraryMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createLibraryMealPlan>>, TError, {
    data: BodyType<CreateLibraryMealPlanRequest>;
}, TContext>;
export type CreateLibraryMealPlanMutationResult = NonNullable<Awaited<ReturnType<typeof createLibraryMealPlan>>>;
export type CreateLibraryMealPlanMutationBody = BodyType<CreateLibraryMealPlanRequest>;
export type CreateLibraryMealPlanMutationError = ErrorType<unknown>;
/**
 * @summary Create a new library meal plan
 */
export declare const useCreateLibraryMealPlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createLibraryMealPlan>>, TError, {
        data: BodyType<CreateLibraryMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createLibraryMealPlan>>, TError, {
    data: BodyType<CreateLibraryMealPlanRequest>;
}, TContext>;
/**
 * @summary Get a library meal plan with its items
 */
export declare const getGetLibraryMealPlanUrl: (planId: number) => string;
export declare const getLibraryMealPlan: (planId: number, options?: RequestInit) => Promise<LibraryMealPlanDetail>;
export declare const getGetLibraryMealPlanQueryKey: (planId: number) => readonly [`/api/meal-plans/${number}`];
export declare const getGetLibraryMealPlanQueryOptions: <TData = Awaited<ReturnType<typeof getLibraryMealPlan>>, TError = ErrorType<ErrorResponse>>(planId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLibraryMealPlan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLibraryMealPlan>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLibraryMealPlanQueryResult = NonNullable<Awaited<ReturnType<typeof getLibraryMealPlan>>>;
export type GetLibraryMealPlanQueryError = ErrorType<ErrorResponse>;
/**
 * @summary Get a library meal plan with its items
 */
export declare function useGetLibraryMealPlan<TData = Awaited<ReturnType<typeof getLibraryMealPlan>>, TError = ErrorType<ErrorResponse>>(planId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLibraryMealPlan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a library meal plan
 */
export declare const getUpdateLibraryMealPlanUrl: (planId: number) => string;
export declare const updateLibraryMealPlan: (planId: number, updateLibraryMealPlanRequest: UpdateLibraryMealPlanRequest, options?: RequestInit) => Promise<LibraryMealPlan>;
export declare const getUpdateLibraryMealPlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLibraryMealPlan>>, TError, {
        planId: number;
        data: BodyType<UpdateLibraryMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateLibraryMealPlan>>, TError, {
    planId: number;
    data: BodyType<UpdateLibraryMealPlanRequest>;
}, TContext>;
export type UpdateLibraryMealPlanMutationResult = NonNullable<Awaited<ReturnType<typeof updateLibraryMealPlan>>>;
export type UpdateLibraryMealPlanMutationBody = BodyType<UpdateLibraryMealPlanRequest>;
export type UpdateLibraryMealPlanMutationError = ErrorType<unknown>;
/**
 * @summary Update a library meal plan
 */
export declare const useUpdateLibraryMealPlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateLibraryMealPlan>>, TError, {
        planId: number;
        data: BodyType<UpdateLibraryMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateLibraryMealPlan>>, TError, {
    planId: number;
    data: BodyType<UpdateLibraryMealPlanRequest>;
}, TContext>;
/**
 * @summary Delete a library meal plan
 */
export declare const getDeleteLibraryMealPlanUrl: (planId: number) => string;
export declare const deleteLibraryMealPlan: (planId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteLibraryMealPlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteLibraryMealPlan>>, TError, {
        planId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteLibraryMealPlan>>, TError, {
    planId: number;
}, TContext>;
export type DeleteLibraryMealPlanMutationResult = NonNullable<Awaited<ReturnType<typeof deleteLibraryMealPlan>>>;
export type DeleteLibraryMealPlanMutationError = ErrorType<unknown>;
/**
 * @summary Delete a library meal plan
 */
export declare const useDeleteLibraryMealPlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteLibraryMealPlan>>, TError, {
        planId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteLibraryMealPlan>>, TError, {
    planId: number;
}, TContext>;
/**
 * @summary Add a food item to a library meal plan
 */
export declare const getAddLibraryMealPlanItemUrl: (planId: number) => string;
export declare const addLibraryMealPlanItem: (planId: number, addLibraryMealPlanItemRequest: AddLibraryMealPlanItemRequest, options?: RequestInit) => Promise<LibraryMealPlanItem>;
export declare const getAddLibraryMealPlanItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addLibraryMealPlanItem>>, TError, {
        planId: number;
        data: BodyType<AddLibraryMealPlanItemRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addLibraryMealPlanItem>>, TError, {
    planId: number;
    data: BodyType<AddLibraryMealPlanItemRequest>;
}, TContext>;
export type AddLibraryMealPlanItemMutationResult = NonNullable<Awaited<ReturnType<typeof addLibraryMealPlanItem>>>;
export type AddLibraryMealPlanItemMutationBody = BodyType<AddLibraryMealPlanItemRequest>;
export type AddLibraryMealPlanItemMutationError = ErrorType<unknown>;
/**
 * @summary Add a food item to a library meal plan
 */
export declare const useAddLibraryMealPlanItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addLibraryMealPlanItem>>, TError, {
        planId: number;
        data: BodyType<AddLibraryMealPlanItemRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addLibraryMealPlanItem>>, TError, {
    planId: number;
    data: BodyType<AddLibraryMealPlanItemRequest>;
}, TContext>;
/**
 * @summary Remove an item from a library meal plan
 */
export declare const getDeleteLibraryMealPlanItemUrl: (planId: number, itemId: number) => string;
export declare const deleteLibraryMealPlanItem: (planId: number, itemId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteLibraryMealPlanItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteLibraryMealPlanItem>>, TError, {
        planId: number;
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteLibraryMealPlanItem>>, TError, {
    planId: number;
    itemId: number;
}, TContext>;
export type DeleteLibraryMealPlanItemMutationResult = NonNullable<Awaited<ReturnType<typeof deleteLibraryMealPlanItem>>>;
export type DeleteLibraryMealPlanItemMutationError = ErrorType<unknown>;
/**
 * @summary Remove an item from a library meal plan
 */
export declare const useDeleteLibraryMealPlanItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteLibraryMealPlanItem>>, TError, {
        planId: number;
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteLibraryMealPlanItem>>, TError, {
    planId: number;
    itemId: number;
}, TContext>;
/**
 * @summary Get the library meal plan assigned to a kid (or null if none)
 */
export declare const getGetKidAssignedMealPlanUrl: (kidId: number) => string;
export declare const getKidAssignedMealPlan: (kidId: number, options?: RequestInit) => Promise<LibraryMealPlanDetail | void>;
export declare const getGetKidAssignedMealPlanQueryKey: (kidId: number) => readonly [`/api/kids/${number}/meal-plan`];
export declare const getGetKidAssignedMealPlanQueryOptions: <TData = Awaited<ReturnType<typeof getKidAssignedMealPlan>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidAssignedMealPlan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidAssignedMealPlan>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidAssignedMealPlanQueryResult = NonNullable<Awaited<ReturnType<typeof getKidAssignedMealPlan>>>;
export type GetKidAssignedMealPlanQueryError = ErrorType<unknown>;
/**
 * @summary Get the library meal plan assigned to a kid (or null if none)
 */
export declare function useGetKidAssignedMealPlan<TData = Awaited<ReturnType<typeof getKidAssignedMealPlan>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidAssignedMealPlan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Assign or unassign a library meal plan to a kid
 */
export declare const getAssignKidMealPlanUrl: (kidId: number) => string;
export declare const assignKidMealPlan: (kidId: number, assignMealPlanRequest: AssignMealPlanRequest, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getAssignKidMealPlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof assignKidMealPlan>>, TError, {
        kidId: number;
        data: BodyType<AssignMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof assignKidMealPlan>>, TError, {
    kidId: number;
    data: BodyType<AssignMealPlanRequest>;
}, TContext>;
export type AssignKidMealPlanMutationResult = NonNullable<Awaited<ReturnType<typeof assignKidMealPlan>>>;
export type AssignKidMealPlanMutationBody = BodyType<AssignMealPlanRequest>;
export type AssignKidMealPlanMutationError = ErrorType<unknown>;
/**
 * @summary Assign or unassign a library meal plan to a kid
 */
export declare const useAssignKidMealPlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof assignKidMealPlan>>, TError, {
        kidId: number;
        data: BodyType<AssignMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof assignKidMealPlan>>, TError, {
    kidId: number;
    data: BodyType<AssignMealPlanRequest>;
}, TContext>;
/**
 * @summary Get all foods
 */
export declare const getGetFoodsUrl: (params?: GetFoodsParams) => string;
export declare const getFoods: (params?: GetFoodsParams, options?: RequestInit) => Promise<Food[]>;
export declare const getGetFoodsQueryKey: (params?: GetFoodsParams) => readonly ["/api/foods", ...GetFoodsParams[]];
export declare const getGetFoodsQueryOptions: <TData = Awaited<ReturnType<typeof getFoods>>, TError = ErrorType<unknown>>(params?: GetFoodsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFoods>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFoods>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFoodsQueryResult = NonNullable<Awaited<ReturnType<typeof getFoods>>>;
export type GetFoodsQueryError = ErrorType<unknown>;
/**
 * @summary Get all foods
 */
export declare function useGetFoods<TData = Awaited<ReturnType<typeof getFoods>>, TError = ErrorType<unknown>>(params?: GetFoodsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFoods>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new food item
 */
export declare const getCreateFoodUrl: () => string;
export declare const createFood: (createFoodRequest: CreateFoodRequest, options?: RequestInit) => Promise<Food>;
export declare const getCreateFoodMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFood>>, TError, {
        data: BodyType<CreateFoodRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createFood>>, TError, {
    data: BodyType<CreateFoodRequest>;
}, TContext>;
export type CreateFoodMutationResult = NonNullable<Awaited<ReturnType<typeof createFood>>>;
export type CreateFoodMutationBody = BodyType<CreateFoodRequest>;
export type CreateFoodMutationError = ErrorType<unknown>;
/**
 * @summary Create a new food item
 */
export declare const useCreateFood: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createFood>>, TError, {
        data: BodyType<CreateFoodRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createFood>>, TError, {
    data: BodyType<CreateFoodRequest>;
}, TContext>;
/**
 * @summary Get all meal plans for a kid
 */
export declare const getGetKidMealPlansUrl: (kidId: number) => string;
export declare const getKidMealPlans: (kidId: number, options?: RequestInit) => Promise<MealPlan[]>;
export declare const getGetKidMealPlansQueryKey: (kidId: number) => readonly [`/api/kids/${number}/meal-plans`];
export declare const getGetKidMealPlansQueryOptions: <TData = Awaited<ReturnType<typeof getKidMealPlans>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealPlans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidMealPlans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidMealPlansQueryResult = NonNullable<Awaited<ReturnType<typeof getKidMealPlans>>>;
export type GetKidMealPlansQueryError = ErrorType<unknown>;
/**
 * @summary Get all meal plans for a kid
 */
export declare function useGetKidMealPlans<TData = Awaited<ReturnType<typeof getKidMealPlans>>, TError = ErrorType<unknown>>(kidId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealPlans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new meal plan for a kid
 */
export declare const getCreateKidMealPlanUrl: (kidId: number) => string;
export declare const createKidMealPlan: (kidId: number, createMealPlanRequest: CreateMealPlanRequest, options?: RequestInit) => Promise<MealPlan>;
export declare const getCreateKidMealPlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createKidMealPlan>>, TError, {
        kidId: number;
        data: BodyType<CreateMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createKidMealPlan>>, TError, {
    kidId: number;
    data: BodyType<CreateMealPlanRequest>;
}, TContext>;
export type CreateKidMealPlanMutationResult = NonNullable<Awaited<ReturnType<typeof createKidMealPlan>>>;
export type CreateKidMealPlanMutationBody = BodyType<CreateMealPlanRequest>;
export type CreateKidMealPlanMutationError = ErrorType<unknown>;
/**
 * @summary Create a new meal plan for a kid
 */
export declare const useCreateKidMealPlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createKidMealPlan>>, TError, {
        kidId: number;
        data: BodyType<CreateMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createKidMealPlan>>, TError, {
    kidId: number;
    data: BodyType<CreateMealPlanRequest>;
}, TContext>;
/**
 * @summary Get a single meal plan with its items
 */
export declare const getGetKidMealPlanUrl: (kidId: number, planId: number) => string;
export declare const getKidMealPlan: (kidId: number, planId: number, options?: RequestInit) => Promise<MealPlanDetail>;
export declare const getGetKidMealPlanQueryKey: (kidId: number, planId: number) => readonly [`/api/kids/${number}/meal-plans/${number}`];
export declare const getGetKidMealPlanQueryOptions: <TData = Awaited<ReturnType<typeof getKidMealPlan>>, TError = ErrorType<unknown>>(kidId: number, planId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealPlan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getKidMealPlan>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetKidMealPlanQueryResult = NonNullable<Awaited<ReturnType<typeof getKidMealPlan>>>;
export type GetKidMealPlanQueryError = ErrorType<unknown>;
/**
 * @summary Get a single meal plan with its items
 */
export declare function useGetKidMealPlan<TData = Awaited<ReturnType<typeof getKidMealPlan>>, TError = ErrorType<unknown>>(kidId: number, planId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getKidMealPlan>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a meal plan
 */
export declare const getUpdateKidMealPlanUrl: (kidId: number, planId: number) => string;
export declare const updateKidMealPlan: (kidId: number, planId: number, updateMealPlanRequest: UpdateMealPlanRequest, options?: RequestInit) => Promise<MealPlan>;
export declare const getUpdateKidMealPlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKidMealPlan>>, TError, {
        kidId: number;
        planId: number;
        data: BodyType<UpdateMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateKidMealPlan>>, TError, {
    kidId: number;
    planId: number;
    data: BodyType<UpdateMealPlanRequest>;
}, TContext>;
export type UpdateKidMealPlanMutationResult = NonNullable<Awaited<ReturnType<typeof updateKidMealPlan>>>;
export type UpdateKidMealPlanMutationBody = BodyType<UpdateMealPlanRequest>;
export type UpdateKidMealPlanMutationError = ErrorType<unknown>;
/**
 * @summary Update a meal plan
 */
export declare const useUpdateKidMealPlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateKidMealPlan>>, TError, {
        kidId: number;
        planId: number;
        data: BodyType<UpdateMealPlanRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateKidMealPlan>>, TError, {
    kidId: number;
    planId: number;
    data: BodyType<UpdateMealPlanRequest>;
}, TContext>;
/**
 * @summary Delete a meal plan
 */
export declare const getDeleteKidMealPlanUrl: (kidId: number, planId: number) => string;
export declare const deleteKidMealPlan: (kidId: number, planId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteKidMealPlanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKidMealPlan>>, TError, {
        kidId: number;
        planId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteKidMealPlan>>, TError, {
    kidId: number;
    planId: number;
}, TContext>;
export type DeleteKidMealPlanMutationResult = NonNullable<Awaited<ReturnType<typeof deleteKidMealPlan>>>;
export type DeleteKidMealPlanMutationError = ErrorType<unknown>;
/**
 * @summary Delete a meal plan
 */
export declare const useDeleteKidMealPlan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteKidMealPlan>>, TError, {
        kidId: number;
        planId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteKidMealPlan>>, TError, {
    kidId: number;
    planId: number;
}, TContext>;
/**
 * @summary Add a food item to a meal plan
 */
export declare const getAddMealPlanItemUrl: (kidId: number, planId: number) => string;
export declare const addMealPlanItem: (kidId: number, planId: number, addMealPlanItemRequest: AddMealPlanItemRequest, options?: RequestInit) => Promise<MealPlanItem>;
export declare const getAddMealPlanItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addMealPlanItem>>, TError, {
        kidId: number;
        planId: number;
        data: BodyType<AddMealPlanItemRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addMealPlanItem>>, TError, {
    kidId: number;
    planId: number;
    data: BodyType<AddMealPlanItemRequest>;
}, TContext>;
export type AddMealPlanItemMutationResult = NonNullable<Awaited<ReturnType<typeof addMealPlanItem>>>;
export type AddMealPlanItemMutationBody = BodyType<AddMealPlanItemRequest>;
export type AddMealPlanItemMutationError = ErrorType<unknown>;
/**
 * @summary Add a food item to a meal plan
 */
export declare const useAddMealPlanItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addMealPlanItem>>, TError, {
        kidId: number;
        planId: number;
        data: BodyType<AddMealPlanItemRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addMealPlanItem>>, TError, {
    kidId: number;
    planId: number;
    data: BodyType<AddMealPlanItemRequest>;
}, TContext>;
/**
 * @summary Remove an item from a meal plan
 */
export declare const getDeleteMealPlanItemUrl: (kidId: number, planId: number, itemId: number) => string;
export declare const deleteMealPlanItem: (kidId: number, planId: number, itemId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteMealPlanItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMealPlanItem>>, TError, {
        kidId: number;
        planId: number;
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteMealPlanItem>>, TError, {
    kidId: number;
    planId: number;
    itemId: number;
}, TContext>;
export type DeleteMealPlanItemMutationResult = NonNullable<Awaited<ReturnType<typeof deleteMealPlanItem>>>;
export type DeleteMealPlanItemMutationError = ErrorType<unknown>;
/**
 * @summary Remove an item from a meal plan
 */
export declare const useDeleteMealPlanItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMealPlanItem>>, TError, {
        kidId: number;
        planId: number;
        itemId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteMealPlanItem>>, TError, {
    kidId: number;
    planId: number;
    itemId: number;
}, TContext>;
/**
 * @summary Get a single food item
 */
export declare const getGetFoodUrl: (foodId: number) => string;
export declare const getFood: (foodId: number, options?: RequestInit) => Promise<Food>;
export declare const getGetFoodQueryKey: (foodId: number) => readonly [`/api/foods/${number}`];
export declare const getGetFoodQueryOptions: <TData = Awaited<ReturnType<typeof getFood>>, TError = ErrorType<unknown>>(foodId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFood>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFood>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFoodQueryResult = NonNullable<Awaited<ReturnType<typeof getFood>>>;
export type GetFoodQueryError = ErrorType<unknown>;
/**
 * @summary Get a single food item
 */
export declare function useGetFood<TData = Awaited<ReturnType<typeof getFood>>, TError = ErrorType<unknown>>(foodId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFood>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a food item
 */
export declare const getUpdateFoodUrl: (foodId: number) => string;
export declare const updateFood: (foodId: number, updateFoodRequest: UpdateFoodRequest, options?: RequestInit) => Promise<Food>;
export declare const getUpdateFoodMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFood>>, TError, {
        foodId: number;
        data: BodyType<UpdateFoodRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateFood>>, TError, {
    foodId: number;
    data: BodyType<UpdateFoodRequest>;
}, TContext>;
export type UpdateFoodMutationResult = NonNullable<Awaited<ReturnType<typeof updateFood>>>;
export type UpdateFoodMutationBody = BodyType<UpdateFoodRequest>;
export type UpdateFoodMutationError = ErrorType<unknown>;
/**
 * @summary Update a food item
 */
export declare const useUpdateFood: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateFood>>, TError, {
        foodId: number;
        data: BodyType<UpdateFoodRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateFood>>, TError, {
    foodId: number;
    data: BodyType<UpdateFoodRequest>;
}, TContext>;
/**
 * @summary Delete a food item
 */
export declare const getDeleteFoodUrl: (foodId: number) => string;
export declare const deleteFood: (foodId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteFoodMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteFood>>, TError, {
        foodId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteFood>>, TError, {
    foodId: number;
}, TContext>;
export type DeleteFoodMutationResult = NonNullable<Awaited<ReturnType<typeof deleteFood>>>;
export type DeleteFoodMutationError = ErrorType<unknown>;
/**
 * @summary Delete a food item
 */
export declare const useDeleteFood: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteFood>>, TError, {
        foodId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteFood>>, TError, {
    foodId: number;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map