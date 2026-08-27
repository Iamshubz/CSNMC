const EARTH_RADIUS_METERS = 6_371_000;

/** Active complaints within this radius are treated as duplicate reports. */
export const DUPLICATE_RADIUS_METERS = 30;

export type BoundingBox = {
  minLatitude: number;
  maxLatitude: number;
  minLongitude: number;
  maxLongitude: number;
};

const toRadians = (degrees: number): number =>
  (degrees * Math.PI) / 180;

/**
 * Calculates the shortest surface distance between two GPS coordinates.
 */
export const calculateDistanceInMeters = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number => {
  const latitudeDelta = toRadians(latitude2 - latitude1);
  const longitudeDelta = toRadians(longitude2 - longitude1);
  const latitude1Radians = toRadians(latitude1);
  const latitude2Radians = toRadians(latitude2);

  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitude1Radians) *
      Math.cos(latitude2Radians) *
      Math.sin(longitudeDelta / 2) ** 2;

  return (
    2 *
    EARTH_RADIUS_METERS *
    Math.asin(Math.sqrt(Math.min(1, haversine)))
  );
};

/**
 * Returns a cheap SQL pre-filter around a coordinate. The final decision must
 * still use calculateDistanceInMeters because longitude degrees vary by latitude.
 */
export const getBoundingBox = (
  latitude: number,
  longitude: number,
  radiusInMeters: number
): BoundingBox => {
  const latitudeDelta = (radiusInMeters / EARTH_RADIUS_METERS) *
    (180 / Math.PI);
  const longitudeDelta =
    (radiusInMeters /
      (EARTH_RADIUS_METERS * Math.cos(toRadians(latitude)))) *
    (180 / Math.PI);

  return {
    minLatitude: latitude - latitudeDelta,
    maxLatitude: latitude + latitudeDelta,
    minLongitude: longitude - longitudeDelta,
    maxLongitude: longitude + longitudeDelta,
  };
};