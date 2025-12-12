import { cn } from "@/lib/utils"

export function PageContainer({ className, children }: { className?: string, children: React.ReactNode }) {
    // Mobile-first container that prevents scrolling on main interactions
    return (
        <div className={cn("min-h-screen w-full flex flex-col items-center justify-center p-4 relative overflow-hidden", className)}>
            {/* Dynamic background elements can go here */}
            <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-purple-300/30 rounded-full blur-[80px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[250px] h-[250px] bg-orange-200/40 rounded-full blur-[60px]" />

            <div className="w-full max-w-md min-h-[100dvh] flex flex-col relative z-10 py-4 max-h-[900px]">
                {children}
            </div>
        </div>
    )
}
