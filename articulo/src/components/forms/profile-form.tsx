'use client'

import React, { useState } from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'

const ProfileForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // fake delay just for UI testing
    setTimeout(() => {
      setIsLoading(false)
      console.log({ name, email })
    }, 1000)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-md flex-col gap-6"
    >
      {/* Name */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-medium">User full name</label>
        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="focus-visible:ring-2 focus-visible:ring-[#2F006B]"
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2">
        <label className="text-lg font-medium">Email</label>
        <Input
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="focus-visible:ring-2 focus-visible:ring-[#2F006B]"
        />
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isLoading}
        className="
          self-start
          bg-white text-black
          hover:bg-[#2F006B] hover:text-white
          transition-colors
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving
          </>
        ) : (
          'Save User Settings'
        )}
      </Button>
    </form>
  )
}

export default ProfileForm
