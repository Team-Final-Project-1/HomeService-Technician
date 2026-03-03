import { useState } from "react"

export const useAccountSettings = () => {

  const [isAvailable, setIsAvailable] =
    useState(true)

  const [services, setServices] =
    useState<string[]>([])

  const toggleAvailability = () => {
    setIsAvailable(prev => !prev)
  }

  const toggleService = (service: string) => {
    setServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }

  return {
    isAvailable,
    services,
    toggleAvailability,
    toggleService,
  }
}