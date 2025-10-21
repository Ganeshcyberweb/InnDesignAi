"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { Button } from "@/components/smoothui/button"

const menuItems = [
  { id: "features", name: "Features", href: "#link" },
  { id: "pricing", name: "Pricing", href: "#link" },
  { id: "about", name: "About", href: "#link" },
]

export const HeroHeader = () => {
  const [menuState, setMenuState] = useState(false)

  return (
    <div className="relative">
      <header>
        <motion.nav
          className="absolute top-0 left-0 z-20 w-full transition-all duration-300"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-6 transition-all duration-200 lg:gap-0">
              <div className="flex w-full justify-between gap-6 lg:w-auto">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <Link
                    href="/"
                    aria-label="home"
                    className="flex items-center space-x-2 text-foreground font-semibold text-lg"
                  >
                    InnDesign
                  </Link>
                </motion.div>

                <motion.button
                  type="button"
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState === true ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden text-foreground"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Menu
                    className={`m-auto size-6 duration-200 ${menuState ? "scale-0 rotate-180 opacity-0" : "scale-100 rotate-0 opacity-100"}`}
                  />
                  <X
                    className={`absolute inset-0 m-auto size-6 duration-200 ${menuState ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-180 opacity-0"}`}
                  />
                </motion.button>

                <motion.div
                  className="m-auto hidden size-fit lg:block"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <ul className="flex gap-1">
                    {menuItems.map((item, index) => (
                      <motion.li
                        key={item.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.4 + (index * 0.1),
                          ease: [0.25, 0.46, 0.45, 0.94]
                        }}
                      >
                        <Button asChild variant="ghost" size="sm">
                          <Link href={item.href} className="text-base text-foreground hover:text-primary">
                            <span>{item.name}</span>
                          </Link>
                        </Button>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>

              <AnimatePresence>
                {menuState && (
                  <motion.div
                    className="bg-background mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border border-border p-6 shadow-2xl md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none"
                    initial={{ opacity: 0, y: -20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="lg:hidden">
                      <ul className="space-y-6 text-base">
                        {menuItems.map((item, index) => (
                          <motion.li
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              duration: 0.3,
                              delay: index * 0.1,
                              ease: [0.25, 0.46, 0.45, 0.94]
                            }}
                          >
                            <Link
                              href={item.href}
                              className="text-muted-foreground hover:text-primary block duration-150"
                            >
                              <span>{item.name}</span>
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <motion.div
                      className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      <Button asChild variant="ghost" size="sm">
                        <Link href="/login" className="text-foreground hover:text-primary">
                          <span>Login</span>
                        </Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link href="/signup" className="bg-primary text-primary-foreground hover:bg-primary/90">
                          <span>Sign Up</span>
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Desktop buttons */}
              <motion.div
                className="hidden lg:flex lg:gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login" className="text-foreground hover:text-primary">
                    <span>Login</span>
                  </Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/signup" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <span>Sign Up</span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.nav>
      </header>
    </div>
  )
}