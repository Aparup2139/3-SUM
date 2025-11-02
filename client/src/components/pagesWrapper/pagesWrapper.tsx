import type { ReactNode } from "react"
import { ModeToggle } from "../toggleTheme/toggletheme"
import { useScreenSizeStore } from "@/store/screenSizestate.store"
import { logo } from "@/constast"
import { Link, useNavigate } from "react-router-dom"

export const PageWrapper = ({ HeaderJSX = <></>, HeaderIcon = <></>, leftContent, rightContent, headerText, }:
    { HeaderJSX?: ReactNode, HeaderIcon?: ReactNode, rightContent: ReactNode, leftContent: ReactNode, headerText: string }) => {

    const { mobileView } = useScreenSizeStore()
    return (<section className={`${mobileView ? "h-[90dvh]" : "h-dvh"} w-full flex`} >
        <div className={`flex flex-col pt-2 pb-5 border-r h-full border-border ${mobileView ? "w-full" : "w-[65%]"}`} >
            <div className="items-center h-[12%] flex justify-between border-b border-border px-4 ">
                <div className="flex gap-2 items-center ">
                    {mobileView && <Link to={"/"} ><img
                        alt="TubeSpace Logo"
                        className="h-10" src={logo} /></Link>}
                    {HeaderIcon}
                    <h1>{headerText}</h1>

                </div>
                <div className="flex justify-end items-center gap-2">
                    {HeaderJSX}
                    <ModeToggle />
                </div>
            </div>
            <div className="h-[88%]" >
                {leftContent}
            </div>
        </div>
        {!mobileView &&
            <div className="flex px-2 pt-6 pb-5 flex-col border-l h-full border-border w-[35%]" >
                <div className="px-4 h-full" >
                    {rightContent}
                </div>
            </div>}
    </section>)
}

export const PageWrapper2 = ({ HeaderJSX = <></>, HeaderIcon = <></>, leftContent, headerText, }:
    { HeaderJSX?: ReactNode, HeaderIcon?: ReactNode, rightContent: ReactNode, leftContent: ReactNode, headerText: string }) => {
    const navigate = useNavigate()
    const { mobileView } = useScreenSizeStore()
    return (<section className={`${mobileView ? "h-[90dvh]" : "h-dvh"} w-full flex`} >
        <div className={`flex flex-col pt-2 pb-5 border-r h-full border-border w-full`} >
            <div className="items-center h-[12%] flex justify-between border-b border-border px-4 ">
                <div className="flex gap-2 items-center ">
                    <svg onClick={() => navigate("/")} width="30" height="30" viewBox="0 0 56 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M43 0C50.1797 6.44277e-07 56 5.8203 56 13C56 20.1797 50.1797 26 43 26H34.4844L48.4844 40H31.5156L15.7578 24.2422C14.672 23.1564 14 21.6569 14 20C14 16.6863 16.6863 14 20 14H43C43.5523 14 44 13.5523 44 13C44 12.4477 43.5523 12 43 12H20C15.5817 12 12 15.5817 12 20C12 22.3901 13.0482 24.5347 14.71 26H14.6875L28.6875 40H20C8.95431 40 0 31.0457 0 20C0 8.95431 8.9543 0 20 0H43Z" fill="#3902FF"></path>
                        <path d="M56 28V40H51.3125L39.3125 28H56Z" fill="#3902FF"></path>
                    </svg>
                 {!mobileView && <h1>{headerText}</h1>}
                </div>
                <div className="flex justify-end items-center gap-2">
                    {HeaderJSX}
                    <ModeToggle />
                </div>
            </div>
            <div className="h-[88%]" >
                {leftContent}
            </div>
        </div>

    </section>)
}