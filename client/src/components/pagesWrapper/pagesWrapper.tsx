import type { ReactNode } from "react"
import { ModeToggle } from "../toggleTheme/toggletheme"
import { useScreenSizeStore } from "@/store/screenSizestate.store"
import { logo } from "@/constast"
import { Link } from "react-router-dom"

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

    const { mobileView } = useScreenSizeStore()
    return (<section className={`${mobileView ? "h-[90dvh]" : "h-dvh"} w-full flex`} >
        <div className={`flex flex-col pt-2 pb-5 border-r h-full border-border w-full`} >
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
 
    </section>)
}