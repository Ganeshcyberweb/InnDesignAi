'use client'
import { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Palette } from 'lucide-react'
import { fadeIn, scaleIn, transitions } from '@/lib/animations'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  showLogo?: boolean
}

const containerVariants = scaleIn;
const childVariants = fadeIn;

export function AuthLayout({
  children,
  title,
  subtitle,
  showLogo = true,
}: AuthLayoutProps) {
  const shouldReduceMotion = useReducedMotion()

  const motionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: containerVariants,
        transition: transitions.default
      }

  const childMotionProps = shouldReduceMotion
    ? {}
    : {
        initial: 'hidden',
        animate: 'visible',
        variants: childVariants,
        transition: { ...transitions.default, delay: 0.1 }
      }

  return (
        <div className="flex h-screen bg-[hsl(240_5%_92.16%)] md:rounded-s-3xl md:group-peer-data-[state=collapsed]/sidebar-inset:rounded-s-none transition-all ease-in-out duration-300">
          <div className="flex-1 w-full shadow-md md:rounded-s-[inherit] min-[1024px]:rounded-e-3xl bg-background">
            <div className="h-full flex items-center justify-center px-4 md:px-6 lg:px-8 py-12">
              <motion.div
                {...motionProps}
                className="w-full h-full max-w-md space-y-8"
              >

                <Card className="p-8 shadow-lg border bg-background">
                  <motion.div {...childMotionProps} className="space-y-6">
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-semibold text-foreground">
                        {title}
                      </h2>
                      {subtitle && (
                        <p className="text-sm text-muted-foreground">
                          {subtitle}
                        </p>
                      )}
                    </div>
                    {children}
                  </motion.div>
                </Card>

                <motion.div
                  {...childMotionProps}
                  className="text-center text-xs text-muted-foreground"
                >
                  <p>
                    By continuing, you agree to our{' '}
                    <a
                      href="/terms"
                      className="underline hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a
                      href="/privacy"
                      className="underline hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
  )
}