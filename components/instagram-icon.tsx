// lucide-react marka ikonlarını (Instagram dahil) ticari marka politikası
// gereği kaldırdı; bu yüzden site genelindeki diğer ikonlarla aynı stroke
// stiline (yuvarlak uçlar, 1.6 kalınlık) uyan özel bir SVG kullanıyoruz.
export function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
