
import { ArrowUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function PrivacyPolicyPage() {
    const lastUpdated = "July 15, 2025"

    return (
        <div className="w-full mix-blend-hard bg-background bg-[radial-gradient(circle_at_center,theme(colors.chart-bg)_10%,transparent_80%)]">
            <div className="container relative mx-auto max-w-[90%] md:max-w-2xl py-10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Privacy Policy</h1>
                    <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
                    <aside className="lg:w-64 shrink-0">
                        <TableOfContents />
                    </aside>

                    <div className="flex-1 space-y-10">
                        <section id="introduction" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Introduction</h2>
                            <p>
                                TubeSpace is a platform that helps YouTubers streamline their video workflow. This Privacy Policy outlines how we handle your information when you use our platform.
                            </p>
                        </section>

                        <section id="information-collection" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Information We Collect</h2>
                            <p>We collect the following information when you use TubeSpace:</p>

                            <h3 className="text-xl font-medium">OAuth Data</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>YouTube account data (channel ID, name, profile picture)</li>
                                <li>OAuth access and refresh tokens</li>
                            </ul>

                            <h3 className="text-xl font-medium">Platform Usage Data</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Uploaded videos, titles, descriptions, tags</li>
                                <li>Thumbnail images and upload status</li>
                                <li>Activity logs (who did what and when)</li>
                            </ul>

                            <h3 className="text-xl font-medium">Authentication</h3>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Session cookies for maintaining login state</li>
                            </ul>
                        </section>

                        <section id="use-of-information" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">How We Use Your Information</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>To authenticate you via Google OAuth</li>
                                <li>To upload videos, thumbnails, and metadata to YouTube on your behalf</li>
                                <li>To manage video-related tasks across your team</li>
                                <li>To show personalized content like your channel name and avatar</li>
                                <li>To maintain secure sessions using cookies</li>
                            </ul>
                        </section>

                        <section id="information-sharing" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Information Sharing</h2>
                            <p>
                                We do not sell your data. We only share your information with services necessary for core functionality, including:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>YouTube APIs (for uploads, updates, and OAuth)</li>
                                <li>Our database and background job systems</li>
                                <li>Third-party services strictly required for video processing or analytics</li>
                            </ul>
                        </section>

                        <section id="cookies" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Cookies</h2>
                            <p>
                                We use cookies to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Maintain your login session</li>
                                <li>Protect against CSRF and unauthorized access</li>
                                <li>Improve user experience</li>
                            </ul>
                        </section>

                        <section id="data-security" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Data Security</h2>
                            <p>
                                We follow best practices to protect your data using encryption, secure storage, and access controls. However, we cannot guarantee 100% security over the internet.
                            </p>
                        </section>

                        <section id="user-rights" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Your Rights</h2>
                            <p>
                                You may request:
                            </p>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Access or deletion of your stored data</li>
                                <li>Revocation of YouTube access</li>
                                <li>Modification of your profile info</li>
                            </ul>
                        </section>

                        <section id="policy-changes" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Changes to This Policy</h2>
                            <p>
                                If we update this policy, the changes will be reflected by an updated "Last Updated" date. We recommend checking this page periodically.
                            </p>
                        </section>

                        <section id="contact-us" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
                            <p>If you have any questions about this policy or your data, contact us at:</p>
                            <div className="not-prose bg-muted p-4 rounded-lg">
                                <p className="font-medium">TubeSpace</p>
                                <p>Email: adityraj10544@gmail.com or privacy@tubespace.studio</p>
                                <p>Address: 123 Creator Lane, Internet City, Webland</p>
                                <p>Phone: (555) 000-1234</p>
                            </div>
                        </section>

                        <div className="fixed bottom-8 right-8">
                            <Button
                                variant="outline"
                                size="icon"
                                className="rounded-full shadow-lg bg-transparent"
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            >
                                <ArrowUp className="h-5 w-5" />
                                <span className="sr-only">Back to top</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function TableOfContents() {
    const [activeSection, setActiveSection] = useState<string>("")

    useEffect(() => {
        const sections = document.querySelectorAll("section[id]")

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id)
                }
            })
        }

        const observerOptions = {
            rootMargin: "0px 0px -80% 0px",
            threshold: 0.1,
        }

        const observer = new IntersectionObserver(observerCallback, observerOptions)

        sections.forEach((section) => {
            observer.observe(section)
        })

        return () => {
            observer.disconnect()
        }
    }, [])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 100,
                behavior: "smooth",
            })
        }
    }

    const tocItems = [
        { id: "introduction", label: "Introduction" },
        { id: "information-collection", label: "Information Collection" },
        { id: "use-of-information", label: "Use of Information" },
        { id: "information-sharing", label: "Information Sharing" },
        { id: "cookies", label: "Cookies" },
        { id: "data-security", label: "Data Security" },
        { id: "user-rights", label: "Your Rights" },
        { id: "policy-changes", label: "Policy Changes" },
        { id: "contact-us", label: "Contact Us" },
    ]

    return (
        <div className="sticky top-20">
            <h3 className="font-medium mb-4">On this page</h3>
            <ul className="space-y-3 text-sm">
                {tocItems.map((item) => (
                    <li key={item.id}>
                        <button
                            onClick={() => scrollToSection(item.id)}
                            className={cn(
                                "text-left hover:text-foreground transition-colors",
                                activeSection === item.id ? "font-medium text-foreground" : "text-muted-foreground",
                            )}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
