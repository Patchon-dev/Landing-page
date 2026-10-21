import { useTranslation } from "react-i18next";

import { getAvatarUrl, getInitials, type AvatarUser } from '../utils/helpers';

type AvatarSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps {
  previewUrl?: string;
  user?: AvatarUser | null;
  size?: AvatarSize;
  bgColor?: string;
  displayInitials?: boolean;
}

const widthClasses: Record<AvatarSize, string> = {
  '2xs': 'w-6',
  xs: 'w-8',
  sm: 'w-9',
  md: 'w-10',
  lg: 'w-[73px]',
  xl: 'w-28',
  '2xl': 'w-36',
};

const textClasses: Record<AvatarSize, string> = {
  '2xs': 'text-xs',
  xs: 'text-md',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-xl',
  xl: 'text-2xl',
  '2xl': 'text-4xl',
};

export default function Avatar({
  previewUrl,
  user,
  size = 'sm',
  bgColor = 'bg-primary-500',
  displayInitials = true,
}: AvatarProps) {
  const { t } = useTranslation();
  const width = widthClasses[size];
  const text = textClasses[size];

  const avatarUrl = previewUrl || getAvatarUrl(user);

  return (
    <div className={width}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          loading="lazy"
          decoding="async"
          alt={t("avatar")}
          className={`${width} ${text} ${bgColor} aspect-square rounded-full object-cover`}
        />
      ) : (
        <div
          className={`${width} ${text} ${bgColor} flex aspect-square items-center justify-center rounded-full text-site-on`}
        >
          {displayInitials && getInitials(user?.name ?? '')}
        </div>
      )}
    </div>
  );
}
