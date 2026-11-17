type BrandLogoProps = {
  className: string;
};

export default function BrandLogo({ className }: BrandLogoProps) {
  return (
    <img
      className={`brand-logo ${className}`}
      src="/prince-benja-designs-logo.png"
      alt=""
      aria-hidden="true"
      width={1054}
      height={1021}
      decoding="async"
    />
  );
}
