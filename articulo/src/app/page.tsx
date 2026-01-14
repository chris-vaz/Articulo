import { CardBody, CardContainer, CardItem } from '@/components/global/3d-card'
import { HeroParallax } from '@/components/global/connect-parallax'
import { ContainerScroll } from '@/components/global/container-scroll-animation'
import { InfiniteMovingCards } from '@/components/global/infinite-moving-cards'
import { LampComponent } from '@/components/global/lamp'
import Navbar from '@/components/global/navbar'
import { Button } from '@/components/ui/button'
import { clients, products } from '@/lib/constant'
import { CheckIcon } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="flex items-center justify-center flex-col">
      <Navbar />
      <section className="h-screen w-full  bg-neutral-950 rounded-md  !overflow-visible relative flex flex-col items-center  antialiased">
        <div className="absolute inset-0  h-full w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#000_35%,#223_100%)]"></div>
        <div className="flex flex-col mt-[-100px] md:mt-[-50px]">
          <ContainerScroll
            titleComponent={
              <div className="flex items-center flex-col">
                <Button
                  size={'lg'}
                  className="p-8 mb-8 md:mb-0 text-2xl w-full sm:w-fit border-t-2 rounded-full border-[#4D4D4D] bg-[#1F1F1F] hover:bg-white group transition-all flex items-center justify-center gap-4 hover:shadow-xl hover:shadow-neutral-500 duration-500"
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-500 to-neutral-600  md:text-center font-sans group-hover:bg-gradient-to-r group-hover:from-black goup-hover:to-black">
                    Start For Free Today
                  </span>
                </Button>
                <h1 className="text-5xl md:text-8xl  bg-clip-text text-transparent bg-gradient-to-b from-white to-neutral-600 font-sans font-bold">
                  Automate Your Work With Articulo
                </h1>
              </div>
            }
          />
        </div>
      </section>

      {/* Additional Content Section - Now Visible */}
      <section className="w-full bg-neutral-950 relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-white mb-8 md:mb-12 px-4">
            Trusted by Leading Companies
          </h2>
          <InfiniteMovingCards items={clients} direction="right" speed="slow" />
        </div>
      </section>

      {/* You can add more sections here */}
      <section className="w-full bg-neutral-900 relative py-20 px-4">
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-white text-3xl md:text-5xl font-bold mb-4">
              Pricing
            </h2>
            <p className="text-neutral-400 text-lg">
              Simple pricing that scales with you.
            </p>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free / Starter */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-8 flex flex-col">
              <h3 className="text-white text-2xl font-semibold mb-2">
                Starter
              </h3>
              <p className="text-neutral-400 mb-6">
                Perfect for trying out Articulo.
              </p>

              <div className="text-white text-5xl font-bold mb-6">
                $0
                <span className="text-base font-medium text-neutral-400">
                  /month
                </span>
              </div>

              <ul className="space-y-3 text-neutral-300 flex-1">
                <li>✔ 3 automations</li>
                <li>✔ 100 tasks per month</li>
                <li>✔ Basic integrations</li>
                <li>✔ Community support</li>
              </ul>

              <button className="mt-8 w-full rounded-full bg-white text-black py-3 font-semibold transition hover:bg-neutral-200">
                Get Started
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border border-neutral-700 bg-neutral-900 p-8 flex flex-col relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-sm font-semibold text-black">
                Most Popular
              </span>

              <h3 className="text-white text-2xl font-semibold mb-2">
                Pro
              </h3>
              <p className="text-neutral-400 mb-6">
                For teams automating serious workflows.
              </p>

              <div className="text-white text-5xl font-bold mb-6">
                $29
                <span className="text-base font-medium text-neutral-400">
                  /month
                </span>
              </div>

              <ul className="space-y-3 text-neutral-300 flex-1">
                <li>✔ Unlimited automations</li>
                <li>✔ 10,000 tasks per month</li>
                <li>✔ Advanced integrations</li>
                <li>✔ Priority support</li>
              </ul>

              <button className="mt-8 w-full rounded-full bg-white text-black py-3 font-semibold transition hover:bg-neutral-200">
                Start Pro Trial
              </button>
            </div>
          </div>
        </div>
      </section>
      <footer className="w-full bg-neutral-950 border-t border-neutral-800 px-4 py-16">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-6">
          <h3 className="text-white text-2xl md:text-4xl font-bold">
            Ready to automate your workflow?
          </h3>

          <p className="text-neutral-400 max-w-xl">
            Start building powerful automations with Articulo in minutes.
            No credit card required.
          </p>

          <button className="mt-4 rounded-full bg-white px-10 py-4 text-black text-lg font-semibold transition hover:bg-neutral-200">
            Get Started Now
          </button>

          <div className="mt-12 text-sm text-neutral-500">
            © {new Date().getFullYear()} Articulo. All rights reserved.
          </div>
        </div>
      </footer>


    </main>
  )
}