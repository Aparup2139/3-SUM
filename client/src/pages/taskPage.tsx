import { RightContent } from "@/components/pagesUi/tasksPageUI/rightContent"
import { LeftContent } from "@/components/pagesUi/tasksPageUI/leftContent"
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper"
import { ChevronDown } from "lucide-react"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { CitySelectorDialog } from "@/components/selectCityeSelector"
import { SearchBar } from "@/components/pagesUi/profilepageUI/searchbar"

export const HomePage = () => {
    const { cityName } = useParams();
    const [open, setOpen] = useState(cityName ? false : true)

    return (<PageWrapper
        headerText="Home"
        HeaderJSX={<>
            <SearchBar />
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

