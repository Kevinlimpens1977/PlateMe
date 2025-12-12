import { cn } from "@/lib/utils"

export function GlassCard({ className, children }: { className?: string, children: React.ReactNode }) {
    return (
        <div className={cn(
            "bg-white/60 backdrop-blur-2xl border border-white/60 shadow-xl rounded-[32px] p-6",
            "shadow-rose-900/5",
            className
        )}>
            {children}
        </div>
    )
}
