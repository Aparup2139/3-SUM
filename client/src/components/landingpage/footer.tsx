import { motion } from "framer-motion"
import { Separator } from "@/components/ui/separator"
import { Github } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className=" w-screen h-full border-t bg-background text-muted-foreground "
        >
            <Separator />

            <div className="text-xs px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-muted-foreground">
                <p>© {new Date().getFullYear()} TubeSpace. Built by <a href="https://midsane.tech" target="_blank" className="underline">Midsane</a>.</p>
                <div className="flex gap-4 mt-2 sm:mt-0">
                    <a href="/privacy" className="hover:underline">Privacy</a>
                </div>
            </div>

            <div className="mx-auto max-w-7xl px-6 py-10 grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 text-sm">
                <div className="space-y-2">
                    <h3 className="text-base font-semibold text-foreground">TubeSpace</h3>
                    <p className="text-xs text-muted-foreground">
                        One-click YouTube publishing for remote creators. No downloads. No re-uploads. Just done.
                    </p>
                </div>


                <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Services</h4>
                    <ul className="space-y-1">
                        <li><Link to="/working" className="hover:underline">What We Solve</Link></li>
                        <li><Link to="/working" className="hover:underline">How It Works</Link></li>
                        <li><Link to="/pricing" className="hover:underline">Pricing</Link></li>
                    </ul>
                </div>


                <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Legal</h4>
                    <ul className="space-y-2">
                        <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
                        <li><Link to="/terms-and-conditions" className="hover:underline">Terms and Conditions</Link></li>

                    </ul>
                </div>


                <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Contact</h4>
                    <ul className="space-y-2">
                        <li><a href="mailto:adityaraj10544@gmail.com" className="hover:underline">support@tubespace.studio</a></li>
                        <li><a href="https://github.com/midsane" target="_blank" className="flex items-center gap-1 hover:underline"><Github className="w-4 h-4" /> GitHub</a></li>
                        <li><a href="https://twitter.com/no_more_mid" target="_blank" className="hover:underline">Twitter / X</a></li>
                    </ul>
                </div>
            </div>



        </motion.footer>
    )
}
