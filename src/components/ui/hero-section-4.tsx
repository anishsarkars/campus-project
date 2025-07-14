'use client'
import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { cn } from '@/lib/utils'
import { Menu, X, Users, BookOpen, MessageSquare, Award, Clock, Zap } from 'lucide-react'
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden">
                <section>
                    <div className="pb-24 pt-12 md:pb-32 lg:pb-56 lg:pt-44">
                        <div className="relative mx-auto flex max-w-6xl flex-col px-6 lg:block">
                            <div className="mx-auto max-w-lg text-center lg:ml-0 lg:w-1/2 lg:text-left">
                                <h1 className="mt-8 max-w-2xl text-balance text-5xl font-medium md:text-6xl lg:mt-16 xl:text-7xl">Connect, Learn & Grow Together</h1>
                                <p className="mt-8 max-w-2xl text-pretty text-lg">KindCampus makes peer skill-swapping and practical assignments easier and more fun. Find study buddies, form teams, and complete tasks with instant feedback.</p>

                                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                                    <div className="flex gap-4">
                                      <Link href="/kindcollab">
                                        <HoverBorderGradient
                                          containerClassName="rounded-full"
                                          as="button"
                                          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-2 text-base font-semibold"
                                        >
                                          <AceternityLogo />
                                          <span>Go to Collab</span>
                                        </HoverBorderGradient>
                                      </Link>
                                      <Link href="/kindtasks">
                                        <HoverBorderGradient
                                          containerClassName="rounded-full"
                                          as="button"
                                          className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2 px-6 py-2 text-base font-semibold"
                                        >
                                          <AceternityLogo />
                                          <span>Go to Tasks</span>
                                        </HoverBorderGradient>
                                      </Link>
                                    </div>
                                </div>
                            </div>
                            <img
                                className="pointer-events-none order-first ml-auto h-56 w-full object-cover sm:h-96 lg:absolute lg:inset-0 lg:-right-20 lg:-top-96 lg:order-last lg:h-max lg:w-2/3 lg:object-contain"
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80"
                                alt="Students collaborating"
                                height="4000"
                                width="3000"
                            />
                        </div>
                    </div>
                </section>
                <section className="bg-background pb-16 md:pb-32">
                    <div className="group relative m-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center md:flex-row">
                            <div className="md:max-w-44 md:border-r md:pr-6">
                                <p className="text-end text-sm">Trusted by campuses worldwide</p>
                            </div>
                            <div className="relative py-6 md:w-[calc(100%-11rem)]">
                                <InfiniteSlider
                                    speedOnHover={20}
                                    speed={40}
                                    gap={112}>
                                    <div className="flex">
                                        <div className="flex items-center space-x-2 text-lg font-semibold">
                                            <Users className="h-5 w-5 text-blue-500" />
                                            <span>Peer Learning</span>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex items-center space-x-2 text-lg font-semibold">
                                            <BookOpen className="h-5 w-5 text-green-500" />
                                            <span>Skill Sharing</span>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex items-center space-x-2 text-lg font-semibold">
                                            <MessageSquare className="h-5 w-5 text-purple-500" />
                                            <span>Team Formation</span>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex items-center space-x-2 text-lg font-semibold">
                                            <Award className="h-5 w-5 text-yellow-500" />
                                            <span>Instant Feedback</span>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex items-center space-x-2 text-lg font-semibold">
                                            <Clock className="h-5 w-5 text-red-500" />
                                            <span>Real-time Updates</span>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex items-center space-x-2 text-lg font-semibold">
                                            <Zap className="h-5 w-5 text-orange-500" />
                                            <span>AI-Powered Hints</span>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <div className="flex items-center space-x-2 text-lg font-semibold">
                                            <Users className="h-5 w-5 text-indigo-500" />
                                            <span>Study Groups</span>
                                        </div>
                                    </div>

                                    <div className="flex">
                                        <div className="flex items-center space-x-2 text-lg font-semibold">
                                            <BookOpen className="h-5 w-5 text-teal-500" />
                                            <span>Practical Tasks</span>
                                        </div>
                                    </div>
                                </InfiniteSlider>

                                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
                                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
                                <ProgressiveBlur
                                    className="pointer-events-none absolute left-0 top-0 h-full w-20"
                                    direction="left"
                                    blurIntensity={1}
                                />
                                <ProgressiveBlur
                                    className="pointer-events-none absolute right-0 top-0 h-full w-20"
                                    direction="right"
                                    blurIntensity={1}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'KindCollab', href: '/kindcollab' },
    { name: 'KindTasks', href: '/kindtasks' },
    { name: 'About', href: '#about' },
]

const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="group bg-background/50 fixed z-20 w-full border-b backdrop-blur-3xl">
                <div className="mx-auto max-w-6xl px-6 transition-all duration-300">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>

                            <div className="hidden lg:block">
                                <ul className="flex gap-8 text-sm">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm">
                                    <Link href="/kindcollab">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm">
                                    <Link href="/kindtasks">
                                        <span>View Tasks</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <div className={cn('flex items-center space-x-2', className)}>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">KC</span>
            </div>
            <span className="text-xl font-bold">KindCampus</span>
        </div>
    )
}

const AceternityLogo = () => {
  return (
    <svg
      width="66"
      height="65"
      viewBox="0 0 66 65"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 text-black dark:text-white"
    >
      <path
        d="M8 8.05571C8 8.05571 54.9009 18.1782 57.8687 30.062C60.8365 41.9458 9.05432 57.4696 9.05432 57.4696"
        stroke="currentColor"
        strokeWidth="15"
        strokeMiterlimit="3.86874"
        strokeLinecap="round"
      />
    </svg>
  );
}; 