import React from "react";

const SCHOLARLY_AVATAR_COLORS = [
  "#7A4A28", // Deep warm leather
  "#2B2118", // Dark espresso
  "#A8793E", // Antique gold
  "#3E8B82", // Teal / Pine
  "#8A3820", // Terracotta
  "#5A3A18", // Earth brown
  "#4A5568", // Slate
  "#2D3748", // Charcoal
];

function getAvatarColor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SCHOLARLY_AVATAR_COLORS[Math.abs(hash) % SCHOLARLY_AVATAR_COLORS.length];
}

export default function UserAvatar({ user, size = 36, className = "" }) {
  const name = user?.name || "User";
  const initial = name.trim().charAt(0).toUpperCase() || "U";
  const imgUrl =
    typeof user?.profileImage === "string"
      ? user.profileImage
      : user?.profileImage?.url;
  const bgColor = getAvatarColor(name);

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={name}
        className={`rounded-full object-cover shrink-0 select-none shadow-2xs border border-white/40 ${className}`}
        style={{ width: size, height: size, minWidth: size }}
        onError={(e) => {
          // If image URL fails to load, gracefully fall back to monogram
          e.currentTarget.style.display = "none";
          if (e.currentTarget.nextElementSibling) {
            e.currentTarget.nextElementSibling.style.display = "flex";
          }
        }}
      />
    );
  }

  return (
    <div
      className={`rounded-full flex items-center justify-center text-white font-bold select-none shrink-0 shadow-2xs overflow-hidden border border-white/20 ${className}`}
      style={{
        width: size,
        height: size,
        minWidth: size,
        fontSize: Math.max(11, Math.round(size * 0.42)),
        backgroundColor: bgColor,
        lineHeight: 1,
      }}
      title={name}
      aria-label={name}
    >
      <span className="leading-none flex items-center justify-center text-center font-sans tracking-wide">
        {initial}
      </span>
    </div>
  );
}
