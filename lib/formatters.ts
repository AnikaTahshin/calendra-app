export function formatEventDescription(durationInMinutes:number){
   const hours = Math.floor(durationInMinutes / 60) 
    const minutes = durationInMinutes % 60 
    const minutesString = `${minutes} ${minutes > 1 ? "mins" : "min"}`
    const hoursString = `${hours} ${hours > 1 ? "hrs" : "hr"}`
  
    if (hours === 0) return minutesString
    if (minutes === 0) return hoursString
    return `${hoursString} ${minutesString}`

}

// Format timezone

 export function formatTimezoneOffset(timezone: string) {
      return new Intl.DateTimeFormat(undefined, {
        timeZone: timezone,
        timeZoneName: "shortOffset", 
      })
        .formatToParts(new Date()) 
        .find(part => part.type == "timeZoneName")?.value 
    }

  const timeFormatter = new Intl.DateTimeFormat(undefined, {
    timeStyle: "short",
  })

  // Format a Date object into a short-style time string
  export function formatTimeString(date: Date) {
    return timeFormatter.format(date)
  }

    // Create a date formatter for displaying only the date (e.g., "Apr 10, 2025")
    const dateFormatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    })
    
  
    // Format a Date object into a medium-style date string
    export function formatDate(date: Date) {
      return dateFormatter.format(date)
    }

    // Create a formatter that includes both date and time (e.g., "Apr 10, 2025, 9:45 AM")
    const dateTimeFormatter = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })
    
    // Format a Date object into a readable date + time string
    export function formatDateTime(date: Date) {
      return dateTimeFormatter.format(date)
    }