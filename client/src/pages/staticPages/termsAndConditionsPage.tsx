import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function TNC() {
    const lastUpdated = "July 15, 2025"

    return (
        <div className="w-full mix-blend-hard bg-background bg-[radial-gradient(circle_at_center,theme(colors.chart-bg)_10%,transparent_80%)]">
            <div className="container relative mx-auto max-w-[90%] md:max-w-2xl py-10">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Terms and Conditions</h1>
                    <p className="text-muted-foreground">Last updated: {lastUpdated}</p>
                </div>

                <Separator className="my-6" />

                <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
                    <div className="flex-1 space-y-10">
                        <section id="introduction" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Introduction</h2>
                            <p>
                                Welcome to TubeSpace. These Terms and Conditions govern your access to and use of the TubeSpace platform. By using our service, you agree to be bound by these terms.
                            </p>
                        </section>

                        <section id="eligibility" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Eligibility</h2>
                            <p>
                                You must be at least 13 years old to use TubeSpace. If you are using the platform on behalf of an organization, you confirm that you have authority to bind the organization to these terms.
                            </p>
                        </section>

                        <section id="user-responsibilities" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">User Responsibilities</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>You are responsible for all activity under your TubeSpace account.</li>
                                <li>You must not upload, post, or share any content that violates YouTube’s <a href="https://www.youtube.com/t/terms" target="_blank" className="underline text-red-600">Terms of Service</a>.</li>
                                <li>You are solely responsible for the legality and accuracy of the content you upload via TubeSpace.</li>
                            </ul>
                        </section>

                        <section id="service-usage" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Acceptable Use</h2>
                            <ul className="list-disc pl-6 space-y-2">
                                <li>Do not misuse the platform for unauthorized, illegal, or harmful activities.</li>
                                <li>Do not reverse engineer or interfere with the platform’s functionality.</li>
                                <li>Do not attempt to gain unauthorized access to other users' data or TubeSpace systems.</li>
                            </ul>
                        </section>

                        <section id="api-compliance" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">YouTube API Compliance</h2>
                            <p>
                                TubeSpace uses the YouTube API. By using TubeSpace, you also agree to the <a href="https://www.youtube.com/t/terms" target="_blank" className="underline text-red-600">YouTube Terms of Service</a> and <a href="https://policies.google.com/privacy" target="_blank" className="underline text-red-600">Google Privacy Policy</a>.
                            </p>
                        </section>

                        <section id="intellectual-property" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Intellectual Property</h2>
                            <p>
                                All rights, title, and interest in the TubeSpace platform and content (excluding user content) remain the exclusive property of TubeSpace and its licensors.
                            </p>
                        </section>

                        <section id="termination" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Account Termination</h2>
                            <p>
                                We may suspend or terminate your access to TubeSpace at any time for any reason, including violations of these Terms. You may also terminate your account at any time by contacting us.
                            </p>
                        </section>

                        <section id="disclaimer" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Disclaimer of Warranties</h2>
                            <p>
                                TubeSpace is provided “as is” and “as available”. We make no warranties regarding availability, uptime, or fitness for a particular purpose.
                            </p>
                        </section>

                        <section id="limitation-of-liability" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Limitation of Liability</h2>
                            <p>
                                TubeSpace shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including content loss or account issues.
                            </p>
                        </section>

                        <section id="modifications" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Modifications</h2>
                            <p>
                                We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Continued use of TubeSpace signifies your acceptance of the updated terms.
                            </p>
                        </section>

                        <section id="contact-us" className="space-y-4">
                            <h2 className="text-2xl font-semibold tracking-tight">Contact Us</h2>
                            <p>If you have any questions about these Terms, contact us at:</p>
                            <div className="not-prose bg-muted p-4 rounded-lg">
                                <p className="font-medium">TubeSpace</p>
                                <p>Email: adityraj10544@gmail.com or legal@tubespace.studio</p>
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
