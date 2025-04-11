'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center px-6 py-12 text-center">
      <Image
        src="/next.svg"
        alt="App Logo"
        width={160}
        height={40}
        className="mb-6 dark:invert"
      />

      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
        R & Python Code Visualizer
      </h1>

      <p className="text-muted-foreground text-sm sm:text-base max-w-xl mb-8">
        This tool allows you to write Python or R visualization code in the browser,
        select your preferred output format, and instantly see the result. It supports both
        static images and interactive charts.
      </p>

      <div className="flex gap-4 flex-col sm:flex-row">
        <Button
          className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
          onClick={() => router.push('/editor')}
        >
          Try it Yourself →
        </Button>

        <a
          href="https://github.com/manojkumarjala-dev/R_and_Python_Visualizer"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          GitHub Repo
        </a>
      </div>
    </div>
  )
}
