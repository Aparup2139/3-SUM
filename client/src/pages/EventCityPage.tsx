
import { LeftContent } from "@/components/pagesUi/eventCityPage/leftContent"
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper"
import { CitySelectorDialog } from "@/components/selectCityeSelector"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { useParams } from "react-router-dom"

import { RightContent } from "@/components/pagesUi/tasksPageUI/rightContent"
export const EventCityPage = () => {
    const { cityName } = useParams();
    const [open, setOpen] = useState(cityName ? false : true)


    return (<PageWrapper
        headerText=""
        HeaderJSX={<>
            <CitySelectorDialog 
            setOpen={setOpen}
            open={open} onClose={() => setOpen(false)} />
            <div
                onClick={() => setOpen(true)}
                className="flex gap-2 border text-sm px-2 py-1 justify-center items-center cursor-pointer mr-2 rounded-md">
                <ChevronDown />
                <p>{!cityName ? "Select a city" : cityName}</p>
            </div>
        </>
        }
        leftContent={<LeftContent />}
        rightContent={<RightContent />}
    />)
}

