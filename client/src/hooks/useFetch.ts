import { useEffect, useState } from "react"

export const useFetch = <T>(fnc: (...args: any) => Promise<any>) => {
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState<T | null>(null)
    useEffect(() => {
        setLoading(true);
        fnc().then(data => {
            setData(data)
            setLoading(false)
        })
            .catch(err => {
                setError(err.message || err.msg || err)
                setLoading(false);
            })
    }, [fnc])

    return { data, loading, error }
}