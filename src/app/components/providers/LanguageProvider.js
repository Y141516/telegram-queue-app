"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { translations } from "../../../lib/translations"

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en")

  // Load saved language
  useEffect(() => {
    const savedLang = localStorage.getItem("app-language")
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  // Save language
  useEffect(() => {
    localStorage.setItem("app-language", language)
  }, [language])

  const t = translations[language]

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
