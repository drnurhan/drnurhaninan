// Google İşletme profilindeki gerçek puan. Google'dan otomatik çekilmez;
// yeni değerlendirmeler geldikçe `rating` ve `count` elle güncellenmelidir.
const placeId = "ChIJO76Ag7UVyhQRmKLS_u-LnHo";

export const googleReviews = {
  rating: 5.0,
  count: 5,
  placeId,
  writeReviewUrl: `https://search.google.com/local/writereview?placeid=${placeId}`,
  readReviewsUrl: `https://search.google.com/local/reviews?placeid=${placeId}`,
} as const;
