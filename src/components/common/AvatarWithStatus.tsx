export default function AvatarWithStatus({ src, name, online, size = "md" }: {
  src?: string | null; name: string; online?: boolean; size?: "sm" | "md" | "lg";
}) {
  const sizeMap = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" };
  const dotMap = { sm: "w-2 h-2", md: "w-3 h-3", lg: "w-3.5 h-3.5" };
  const textMap = { sm: "text-xs", md: "text-sm", lg: "text-lg" };
  const initials = name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  return (
    <div className="relative inline-flex flex-shrink-0">
      {src ? (
        <img src={src} alt={name} className={`${sizeMap[size]} rounded-full object-cover border-2 border-white shadow-sm`} />
      ) : (
        <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center ${textMap[size]} font-semibold text-white`}>
          {initials}
        </div>
      )}
      {online !== undefined && (
        <span className={`absolute bottom-0 right-0 ${dotMap[size]} rounded-full border-2 border-white ${online ? "bg-green-500" : "bg-gray-400"}`} />
      )}
    </div>
  );
}
