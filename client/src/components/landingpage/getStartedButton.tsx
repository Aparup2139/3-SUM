import { LucideArrowRight } from "lucide-react"
import { Link } from "react-router-dom"
export function GetStartedButton() {
    return (
        <Link to="/auth">
            <div
                className="group cursor-pointer border group border-[#3B3A3A] bg-[#151515] gap-2 h-[64px] flex items-center p-[11px] rounded-full mt-10"><div className="border border-[#3B3A3A] bg-chart-4 h-[43px] rounded-full flex items-center justify-center text-foreground"><p className="font-medium tracking-tight mr-3 ml-2 flex items-center gap-2 justify-center "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe animate-spin "><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>Get started</p></div><div className="text-bg-chart-4 group-hover:ml-6  ease-in-out transition-all size-[26px] flex items-center 
                justify-center rounded-full border-2 border-chart-4/50  ">
                    <LucideArrowRight size={14} color="orange" />
                    </div></div>
        </Link>
    )
}