export const BUSINESS_HOUR_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type BusinessHourDay = (typeof BUSINESS_HOUR_DAYS)[number];

export type BusinessHours = Record<BusinessHourDay, string> & {
  note?: string;
};

export const BUSINESS_HOUR_LABELS: Record<BusinessHourDay, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  monday: "08:30 – 18:00",
  tuesday: "08:30 – 18:00",
  wednesday: "08:30 – 18:00",
  thursday: "08:30 – 18:00",
  friday: "08:30 – 18:00",
  saturday: "08:30 – 16:00",
  sunday: "Closed",
  note: "Island-wide delivery available",
};

type LegacyHours = {
  weekdays?: string;
  saturday?: string;
  sunday?: string;
};

function hasDayValues(value: Partial<BusinessHours> | null | undefined): boolean {
  if (!value) return false;
  return BUSINESS_HOUR_DAYS.some((day) => Boolean(value[day]?.trim()));
}

export function normalizeBusinessHours(
  value: Partial<BusinessHours> | null | undefined
): BusinessHours {
  const base = { ...DEFAULT_BUSINESS_HOURS };

  if (!value) return base;

  for (const day of BUSINESS_HOUR_DAYS) {
    if (value[day]?.trim()) {
      base[day] = value[day]!.trim();
    }
  }

  if (value.note !== undefined) {
    base.note = value.note.trim();
  }

  return base;
}

/** Maps old admin `hours` (weekdays/saturday/sunday) to per-day hours. */
export function businessHoursFromLegacy(legacy: LegacyHours | null | undefined): BusinessHours {
  const base = normalizeBusinessHours(null);
  const weekdays = legacy?.weekdays?.trim();

  if (weekdays) {
    for (const day of ["monday", "tuesday", "wednesday", "thursday", "friday"] as const) {
      base[day] = weekdays;
    }
  }
  if (legacy?.saturday?.trim()) {
    base.saturday = legacy.saturday.trim();
  }
  if (legacy?.sunday?.trim()) {
    base.sunday = legacy.sunday.trim();
  }

  return base;
}

export function resolveBusinessHours(
  businessHours: Partial<BusinessHours> | null | undefined,
  legacyHours: LegacyHours | null | undefined
): BusinessHours {
  if (hasDayValues(businessHours)) {
    return normalizeBusinessHours(businessHours);
  }
  if (legacyHours?.weekdays || legacyHours?.saturday || legacyHours?.sunday) {
    return businessHoursFromLegacy(legacyHours);
  }
  return normalizeBusinessHours(null);
}
