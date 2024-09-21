import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

interface EnvironmentContextType {
  isDev: boolean
  setDev: (value: boolean) => Promise<void>
  setRefresh: (value: number) => void
  refresh: number
}

const EnvironmentContext = createContext<EnvironmentContextType | undefined>(
  undefined
)

interface EnvironmentProviderProps {
  children: ReactNode
}

export const EnvironmentProvider: React.FC<EnvironmentProviderProps> = ({
  children,
}) => {
  const [isDev, setIsDevState] = useState<boolean>(false)
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    const initializeEnvironment = async () => {
      try {
        const storedIsDev = await AsyncStorage.getItem("isDev")

        if (storedIsDev !== null) {
          setIsDevState(JSON.parse(storedIsDev))
        } else {
          const newIsDev = __DEV__
          setIsDevState(newIsDev)
          await AsyncStorage.setItem("isDev", JSON.stringify(newIsDev))
        }
      } catch (error) {
        console.error("Failed to initialize environment:", error)
      }
    }

    initializeEnvironment()
  }, [])

  const setDev = async (value: boolean) => {
    try {
      await AsyncStorage.setItem("isDev", JSON.stringify(value))
      setIsDevState(value)
    } catch (error) {
      console.error("Failed to set isDev:", error)
    }
  }

  const value: EnvironmentContextType = {
    isDev,
    setDev: async (value: boolean) => {
      setRefresh(refresh + 1)
      setDev(!isDev)
    },
    setRefresh,
    refresh,
  }

  return (
    <EnvironmentContext.Provider value={value} key={refresh}>
      {children}
    </EnvironmentContext.Provider>
  )
}

export const useEnvironment = (): EnvironmentContextType => {
  const context = useContext(EnvironmentContext)
  if (context === undefined) {
    throw new Error("useEnvironment must be used within an EnvironmentProvider")
  }
  return context
}
